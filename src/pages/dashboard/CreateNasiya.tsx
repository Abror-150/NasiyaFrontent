import { CalendarOutlined } from "@ant-design/icons";
import FormInput from "../../components/InputComp";
import Text from "../../components/Text";
import { useState } from "react";
import dayjs from "dayjs";
import { Checkbox, DatePicker } from "antd";
import MonthSelect from "../../components/SelectMuddat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ImageIcon } from "lucide-react";
const CreateNasiya = () => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [muddat, setMuddat] = useState<number>();
  const [searchParams] = useSearchParams();
  const mijozId = searchParams.get("mijozId");

  const handleToday = (checked: boolean) => {
    if (checked) {
      setDate(dayjs());
    } else {
      setDate(null);
    }
  };
  const handlePick = (i: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      setImages((arr) => {
        const next = [...arr];
        next[i] = file;
        return next;
      });
    };
    input.click();
  };
  const mutation = useMutation({
    mutationFn: async (payload: {
      mijozId: string;
      name: string;
      amount: number;
      date2: string;
      muddat: string;
      note: string;
      images: string[];
    }) => {
      const body = {
        mijozId: payload.mijozId,
        name: payload.name.trim(),
        amount: payload.amount,
        date: payload.date2,
        muddat: payload.muddat,
        note: (payload.note || "").trim(),
        images: payload.images,
      };
      return axios
        .post(`${API}/debt`, body, {
          headers: {
            "Content-Type": "application/json",

            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        })
        .then((res) => res.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mijoz", "debts"] });
      toast.success("Nasiya muvaffaqiyatli yaratildi");

      setTimeout(() => {
        navigate(-1);
      }, 500);
    },
    onError: (err: any) => {
      console.log("ERR:", err?.response?.data);
      toast.error(err?.response?.data?.message || "Yaratishda xatolik");
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mijozId) {
      toast.error("Mijoz ID topilmadi");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of images) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        console.log(file.name);

        const res = await axios.post(`${API}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        uploadedUrls.push(res.data.image);
      }
    }

    mutation.mutate({
      mijozId,
      name,
      amount: amount ?? 0,
      date2: date?.format("YYYY-MM-DD") || "",
      muddat: `${muddat} oy`,
      note: note.trim(),
      images: uploadedUrls,
    });
  };

  return (
    <>
      <ToastContainer />

      <form onSubmit={onSubmit} className="containers min-w-[110vdh]">
        <div className="pt-[40px]">
          <div className="left-0 flex gap-[50px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95"
            >
              <ArrowLeft />
            </button>
            <h2 className="font-bold">Nasiya yaratish</h2>
          </div>
          <div className="pt-[20px]">
            <Text classList="!font-semibold">Ismini kiriting*</Text>
            <div className="pt-[10px]">
              <FormInput
                placeholder="Ismini kiriting"
                value={name}
                onChange={(value) => setName(value)}
              />
            </div>

            <div className="pt-[10px]">
              <Text>Pul kiriting</Text>
              <div className="pt-[10px]">
                <FormInput
                  type="number"
                  required
                  value={amount !== undefined ? String(amount) : ""}
                  onChange={(v) => setAmount(Number(v))} //
                />
              </div>
            </div>
            <div className="pt-[15px]">
              <Text>Sana</Text>

              <div className="flex items-center gap-[16px]  pt-[10px]">
                <DatePicker
                  value={date}
                  onChange={(value) => setDate(value)}
                  format="DD.MM.YYYY"
                  suffixIcon={<CalendarOutlined style={{ color: "#3478F7" }} />}
                  style={{
                    width: 250,
                    height: 44,
                    borderRadius: 8,
                    background: "#F5F5F5",
                  }}
                />
                <label className="flex items-center gap-[10px] cursor-pointer">
                  <Checkbox
                    checked={date?.isSame(dayjs(), "day")}
                    onChange={(e: any) => handleToday(e.target.checked)}
                  ></Checkbox>
                  Bugun
                </label>
              </div>
            </div>
            <div className="pt-[15px]">
              <Text>Muddat</Text>
              <div className="pt-[10px]">
                <MonthSelect value={muddat} onChange={setMuddat} />
              </div>
            </div>

            <div className="pt-[15px]">
              <Text>Eslatma</Text>
              <div>
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
              </div>
            </div>

            <div className="pt-[15px] ">
              <Text classList="pb-[20px]">Rasm biriktirish</Text>
              <div className="grid grid-cols-2 gap-3 "></div>

              {images.map((file, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handlePick(i)}
                  className="aspect-[4/3] rounded-[16px] h-[130px]   border border-slate-200 bg-white overflow-hidden p-0"
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-[180px] h-full object-cover"
                      alt="Tanlangan rasm"
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
        <div className="pt-[30px]">
          <div className="w-full mx-auto px-4 py-3 pb-[50px]">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-12 rounded-[14px] bg-[#3E7BFA] text-white text-[16px] font-semibold active:scale-[0.99] disabled:opacity-60"
            >
              {mutation.isPending ? "Yuborilmoqda…" : "Saqlash"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateNasiya;
