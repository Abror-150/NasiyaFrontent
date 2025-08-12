// src/pages/mijoz/SingleMijoz.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { ArrowLeft } from "lucide-react";
import { DIcon } from "../../assets/icons";

const formatUZS = (n: number) =>
  Math.round(n).toLocaleString("uz-UZ", { maximumFractionDigits: 0 });

export const fDate = (iso?: string | null) => {
  if (!iso) return "";
  const fmt = new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return fmt.format(new Date(iso)).replace(/\//g, ".");
};

type DebtCard = {
  id: string;
  remaining: number;
  nextAmount: number;
  nextDueDate: string | null;
  progress: number;
};

type DebtsResp = {
  total: number;
  debts: DebtCard[];
};

export default function SingleMijoz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;
  const { data: client } = useQuery({
    queryKey: ["mijoz", "info", id],
    enabled: !!token && !!id,
    queryFn: async () => {
      const res = await axios.get(`${API}/mijoz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const m = res.data as any;
      return { id: m.id, name: m.name };
    },
    refetchOnMount: "always",
  });

  const { data, isLoading, isError } = useQuery<DebtsResp>({
    queryKey: ["mijoz", "debts", id],
    enabled: !!token && !!id,
    queryFn: async () => {
      const res = await axios.get(`${API}/mijoz/${id}/debts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as DebtsResp;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-white">
        <div className="sticky top-0 z-20 bg-white/95 border-b">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100"
            >
              <ArrowLeft />
            </button>
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-md mx-auto p-4">
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto p-4 text-red-600">
        Ma’lumotlarni yuklashda xatolik.
      </div>
    );
  }

  const debts = data.debts ?? [];
  const empty = debts.length === 0 || (data.total ?? 0) <= 0;

  return (
    <div className=" containers min-h-[100dvh] bg-white !pt-[20px]">
      <div className="sticky top-0 z-20 bg-white/95 border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center  gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[18px] font-semibold">{client?.name}</h1>
          <div className="flex pl-[225px]">
            <button className="cursor-pointer">
              <DIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="rounded-2xl bg-blue-100 text-slate-800 p-4 mb-4">
          <div className="text-sm text-slate-600">Umumiy nasiya:</div>
          <div className="text-[22px] font-semibold ">
            {formatUZS(data.total)} so‘m
          </div>
        </div>

        {empty ? (
          <>
            <div className="mt-2 text-slate-800 font-medium">
              Faol nasiya yo‘q
            </div>
            <div className="text-slate-500 mt-1">
              Bu mijozda hozircha nasiya yo‘q. Yangi nasiya yaratishingiz
              mumkin.
            </div>
          </>
        ) : (
          <div className="space-y-3 pb-24">
            {debts.map((d) => {
              const pct = Math.max(
                0,
                Math.min(100, Math.round((d.progress ?? 0) * 100))
              );
              return (
                <div
                  key={d.id}
                  onClick={() => navigate(`/debt/${d.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/nasiya/${d.id}`)
                  }
                  className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm cursor-pointer hover:shadow transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-slate-700">
                      <div className="text-slate-500 text-sm">
                        Keyingi to‘lov: {fDate(d.nextDueDate)}
                      </div>
                      <div className="text-violet-600 font-semibold">
                        {formatUZS(d.nextAmount)} so‘m
                      </div>
                    </div>
                    <div className="text-right text-[#3478F7] font-semibold">
                      {formatUZS(d.remaining)} so‘m
                    </div>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex itemce justify-end pr-[20px]">
        <button
          onClick={() => navigate(`/debt/create?mijozId=${id}`)}
          className=" flex justify-end items-center   rounded-full bg-[#3B82F6] text-white px-5 h-12 shadow-lg active:scale-[0.98]"
        >
          <span className="text-xl leading-none">＋</span> Qo‘shish
        </button>
      </div>
    </div>
  );
}
