import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { useCookies } from "react-cookie";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "../../assets/icons";
import Image from "../../assets/images/Image.png";

type Seller = {
  id: string;
  userName: string;
  phone: string;
  email: string;
  img?: string;
  password: string;
};

const MySelf = () => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [_, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get(`${API}/seller/me`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        console.log(res.data);

        setSeller(res.data);
      } catch (err) {
        console.error("Seller ma'lumotlarini olishda xato:", err);
      }
    };
    fetchSeller();
  }, [cookies.token]);

  type UploadResponse = {
    image?: string;
    path?: string;
    location?: string;
    filename?: string;
  };

  const resolveUploadUrl = (data: UploadResponse) => {
    if (data.location) return data.location;
    if (data?.image) return data.image;
    if (data.path) {
      return data.path.startsWith("http")
        ? data.path
        : `${API}${data.path.startsWith("/") ? "" : "/"}${data.path}`;
    }
    if (data.filename) {
      return `${API}/images/${data.filename}`;
    }
    throw new Error("Upload API javobidan URL topilmadi");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !seller?.id) return;

    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await axios.post(`${API}/upload`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const uploadedUrl = resolveUploadUrl(uploadRes.data);
      console.log("Yuklangan rasm URL:", uploadedUrl);

      const patchRes = await axios.patch(
        `${API}/seller/${seller.id}`,
        { img: uploadedUrl },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );

      setSeller((prev) =>
        prev ? { ...prev, img: patchRes.data.img ?? uploadedUrl } : prev
      );
    } catch (err) {
      console.error("Rasmni yuklash yoki yangilashda xato:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="containers py-4">
      <div className="flex items-center gap-4 mb-6 mt-[35px]">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold  pl-[40px] ">
          Shaxsiy ma’lumotlar
        </h1>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={preview || seller?.img || Image}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-none"
          />
          <label className="absolute bottom-0 right-0 p-2 rounded-full text-white cursor-pointer">
            <ImageIcon />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Ismi familiya
          </label>
          <input
            type="text"
            value={seller?.userName || ""}
            disabled
            className="w-full border-[#ECECEC] border-[1px] rounded-[8px] p-3 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Telefon raqam
          </label>
          <input
            type="text"
            value={seller?.phone || ""}
            disabled
            className="w-full  border-[#ECECEC] border-[1px] rounded-[8px] p-3 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Elektron pochta
          </label>
          <input
            type="text"
            value={seller?.email || ""}
            disabled
            className="w-full border-[#ECECEC] border-[1px] rounded-[8px] p-3 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default MySelf;
