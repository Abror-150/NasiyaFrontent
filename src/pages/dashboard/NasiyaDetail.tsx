// src/pages/nasiya/NasiyaDetail.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { API } from "../../hooks/getEnv";
import { LoadingOutlined } from "@ant-design/icons";

const fDate = (iso?: string | null) => {
  if (!iso) return "";
  return new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date(iso))
    .replace(/\//g, ".");
};
const fTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};
const formatUZS = (n: number) =>
  Math.round(n).toLocaleString("uz-UZ", { maximumFractionDigits: 0 });

type Month = {
  id: string;
  date: string;
  amount: number;
  status: "UNPAID" | "PENDING" | "PAID";
  partialAmount: number;
};
type DebtDetailResp = {
  id: string;
  date?: string;
  muddat?: number;
  amount?: number;
  note?: string;
  images?: string[];
  plan?: Month[];
  ImagesDebt?: { id: string; debtId: string; url: string }[];
};

export default function NasiyaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;
  const { state } = useLocation() as { state?: { mijozId?: string } };

  const { data, isLoading, isError } = useQuery<DebtDetailResp>({
    queryKey: ["debt", "detail", id],
    enabled: !!token && !!id,
    queryFn: async () => {
      const res = await axios.get(`${API}/debt/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as DebtDetailResp;
    },
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <div className="containers h-[100vh] flex items-center justify-center">
        <LoadingOutlined
          className="text-3xl text-slate-400 animate-spin"
          aria-label="Yuklanmoqda"
        />
      </div>
    );
  }

  if (isError || !data)
    return <div className="p-4 text-red-600">Ma’lumot topilmadi</div>;

  const startISO = data.date || null;
  const dateStr = fDate(startISO);
  const timeStr = fTime(startISO);
  const months = data.muddat ?? data.plan?.length ?? 0;
  const total =
    data.amount ?? data.plan?.reduce((s, m) => s + (m.amount || 0), 0) ?? 0;
  const images: string[] = (data.ImagesDebt ?? data.images ?? [])
    .map((x: any) => (typeof x === "string" ? x : x?.url))
    .filter(Boolean);

  return (
    <div className="containers h-[112vh] bg-white !pt-[20px]">
      <div className=" top-0 z-20 bg-white/95 border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className=" flex items-center gap-2">
            <button
              onClick={() => navigate(`/mijoz/${id}`)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-[18px] font-semibold">Batafsil</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-100">
            <MoreVertical />
          </button>
        </div>
        <div className="h-[3px] bg-violet-500 w-full" />
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4 !pt-[30px]">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-slate-600 mb-1">Sana</div>
            <input
              disabled
              value={dateStr}
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4"
            />
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Sana</div>
            <input
              disabled
              value={timeStr}
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4"
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-600 mb-1">Muddat</div>
          <input
            disabled
            value={`${months}`}
            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4"
          />
        </div>

        <div>
          <div className="text-sm text-slate-600 mb-1">Summa miqdori</div>
          <div className="flex items-center gap-2">
            <input
              disabled
              value={formatUZS(total)}
              className="flex-1 h-12 rounded-xl border border-slate-200 bg-white px-4"
            />
            <span className="text-slate-600">so‘m</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-600 mb-1">Eslatma</div>
          <textarea
            disabled
            value={data.note || ""}
            className="w-full min-h-[96px] rounded-xl border border-slate-200 bg-white px-4 py-3"
          />
        </div>

        {images.length > 0 && (
          <div>
            <div className="text-sm text-slate-600 mb-2">Rasm biriktirish</div>
            <div className="flex gap-3 flex-wrap">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  loading="lazy"
                  alt="Nasiya rasmi"
                  className="w-[46%] aspect-[4/3] rounded-xl object-cover border border-slate-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pt-[24px]">
          <button
            type="button"
            onClick={() =>
              navigate(`/debt/close/${id}`, {
                state: { mijozId: state?.mijozId },
              })
            }
            className=" w-full h-12 rounded-xl bg-[#3B82F6] text-white font-semibold active:scale-[0.99]"
          >
            Nasiyani so‘ndirish
          </button>
        </div>
      </div>
    </div>
  );
}
