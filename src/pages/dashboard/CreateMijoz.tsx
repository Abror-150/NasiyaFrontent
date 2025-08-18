// src/pages/dashboard/CreateOrEditMijoz.tsx
import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Image as ImageIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../components/InputComp";
import { formatPhone } from "../../components/FormatPhone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";

const normalizePhoneForApi = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.startsWith("998") ? d : `998${d}`;
};

const normalizeMijozFromApi = (m: any) => {
  const phones: string[] =
    Array.isArray(m?.phones) && m.phones.length
      ? m.phones
      : Array.isArray(m?.PhoneClient)
      ? m.PhoneClient.map((p: any) => p?.phoneNumber).filter(Boolean)
      : m?.phone
      ? [m.phone]
      : [];

  const images: string[] =
    Array.isArray(m?.images) && m.images.length
      ? m.images
      : Array.isArray(m?.ImagesClient)
      ? m.ImagesClient.map((x: any) => x?.url).filter(Boolean)
      : [];
  console.log(images, "images");

  return {
    id: m?.id ?? "",
    name: m?.name ?? "",
    address: m?.address ?? "",
    note: m?.note ?? "",
    phones,
    images,
  };
};

export default function CreateOrEditMijoz() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [phones, setPhones] = useState<string[]>(["+998"]);

  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<(File | null)[]>([null, null]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showNote, setShowNote] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const { data } = useQuery({
    queryKey: ["mijoz", "info", id],
    enabled: isEdit && !!token && !!id,
    queryFn: async () => {
      const res = await axios.get(`${API}/mijoz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return normalizeMijozFromApi(res.data);
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (data && isEdit) {
      setName(data.name || "");
      setPhones(data.phones?.length ? data.phones : ["+998"]);
      setAddress(data.address || "");
      setNote(data.note || "");
      setImageUrls(data.images || []);
      setImages(Array(data.images?.length || 1).fill(null));
      setShowNote(Boolean(data.note));
    }
  }, [data, isEdit]);

  const addPhone = () => setPhones((p) => [...p, ""]);
  const removePhone = (idx: number) =>
    setPhones((p) => p.filter((_, i) => i !== idx));
  const updatePhone = (idx: number, v: string) =>
    setPhones((p) => p.map((x, i) => (i === idx ? v : x)));

  const handlePick = (i: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      if (!file) return;

      setImages((prev) => {
        const next = [...prev];
        next[i] = file;
        return next;
      });

      setImageUrls((prev) => {
        const next = [...prev];
        next[i] = URL.createObjectURL(file);
        return next;
      });
    };
    input.click();
  };

  const mutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      phones: string[];
      address: string;
      note?: string;
      images: string[];
    }) => {
      const normalizedPhones = payload.phones
        .map((p) => normalizePhoneForApi(p))
        .filter((p) => p.length >= 12);

      const body = {
        name: payload.name.trim(),
        address: payload.address.trim(),
        note: (payload.note || "").trim(),
        phones: normalizedPhones,
        images: payload.images,
      };

      if (isEdit) {
        return axios.patch(`${API}/mijoz/${id}`, body, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } else {
        return axios
          .post(`${API}/mijoz`, body, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          })
          .then((res) => res.data);
      }
    },
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ["mijoz", "list"] });
      if (isEdit && id) {
        const res = await axios.get(`${API}/mijoz/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        qc.setQueryData(["mijoz", "info", id], normalizeMijozFromApi(res.data));
      }
      toast.success(isEdit ? "Mijoz yangilandi" : "Mijoz yaratildi");
      setTimeout(() => {
        navigate(isEdit ? `/mijoz/${id}` : "/mijoz");
      }, 500);
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const uploadImages = async (files: (File | null)[]) => {
      const urls: string[] = [...imageUrls];
      for (const file of files) {
        if (!file) continue;
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(`${API}/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        urls.push(res.data.image);
      }
      return urls;
    };

    const finalImages = await uploadImages(images);
    console.log(finalImages);

    mutation.mutate({ name, phones, address, note, images: finalImages });
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={onSubmit} className="containers min-h-[100dvh] bg-white">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-[18px] font-semibold !pl-[80px]">
              {isEdit ? "Mijozni tahrirlash" : "Mijoz yaratish"}
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-2 pb-28">
          <FormInput
            label="Ismi"
            required
            placeholder="Ism kiriting"
            value={name}
            onChange={setName}
            className="mt-2 "
          />

          <div className="mt-4 space-y-3">
            <div className="text-[14px] text-slate-700">
              Telefon raqami <span className="text-red-500">*</span>
            </div>

            {phones.map((p, i) => (
              <div key={i} className="relative">
                <input
                  value={showRaw ? p : formatPhone(p)}
                  onChange={(e) => updatePhone(i, e.target.value)}
                  placeholder="+998 90 123 45 67"
                  inputMode="tel"
                  className="w-full h-12 rounded-[12px] border border-slate-200 bg-white px-4 text-[15px] placeholder:text-slate-400 outline-none focus:border-slate-300"
                />
                {phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(i)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-slate-100"
                    aria-label="Raqamni o‘chirish"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={addPhone}
                className="text-[#3E7BFA] text-[14px]"
              >
                + Ko‘proq qo‘shish
              </button>

              <label className="text-[13px] text-slate-500 flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showRaw}
                  onChange={(e) => setShowRaw(e.target.checked)}
                />
                Formatlamasdan yozish
              </label>
            </div>
          </div>

          <FormInput
            className="mt-6"
            label="Yashash manzili"
            placeholder="Yashash manzilini kiriting"
            value={address}
            onChange={setAddress}
          />

          {!showNote ? (
            <button
              type="button"
              onClick={() => setShowNote(true)}
              className="mt-4 w-full h-12 rounded-[12px] border border-slate-200 bg-white px-4 text-[15px] text-left text-slate-500 hover:border-slate-300"
            >
              Eslatma qo‘shish
            </button>
          ) : (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Eslatma kiriting"
              className="mt-4 w-full h-22 rounded-[12px] border border-slate-200 bg-white px-4 text-[15px] placeholder:text-slate-400 outline-none focus:border-slate-300"
            />
          )}

          <div className="mt-6">
            <div className="text-[14px] text-slate-700 mb-3">
              Rasm biriktirish
            </div>
            <div className="grid grid-cols-2 gap-3">
              {imageUrls.map((url, i) => (
                <img
                  key={`img-${i}`}
                  src={url}
                  alt="Mavjud rasm"
                  className="aspect-[4/3] rounded-[16px] border border-slate-200 object-cover"
                />
              ))}

              {images.map((file, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handlePick(i)}
                  className="aspect-[4/3] rounded-[16px] border border-slate-200 bg-white overflow-hidden p-0"
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Tanlangan rasm"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-slate-600">
                      <ImageIcon />
                      <span className="text-sm">Rasm qo‘shish</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-[60px]">
          <div className="max-w-md mx-auto px-4 py-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-12 rounded-[14px] bg-[#3E7BFA] text-white text-[16px] font-semibold active:scale-[0.99] disabled:opacity-60"
            >
              {mutation.isPending
                ? "Yuborilmoqda…"
                : isEdit
                ? "Yangilash"
                : "Saqlash"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
