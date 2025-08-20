import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { ArrowLeft } from "lucide-react";
import { DIcon } from "../../assets/icons";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

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
  const qc = useQueryClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [favorite, setFavorite] = useState(false);

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

  const deleteMijoz = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID topilmadi");
      await axios.delete(`${API}/mijoz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Mijoz o‘chirildi");

      qc.removeQueries({ queryKey: ["mijoz", "info", id] });
      qc.removeQueries({ queryKey: ["mijoz", "debts", id] });

      qc.invalidateQueries({ queryKey: ["mijoz", "list"] });
      setTimeout(() => {
        navigate("/mijoz");
      }, 800);
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "O‘chirishda xatolik");
    },
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
  if (isError || !data) return <div>Xatolik</div>;

  const debts = data.debts ?? [];
  const empty = debts.length === 0 || (data.total ?? 0) <= 0;

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await axios.patch(`${API}/mijoz/${id}/favorite`);
      console.log(res.data);

      setFavorite(res.data.star);
    } catch (err) {
      console.error("Favorite o‘zgartirishda xato:", err);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className=" containers min-h-[100dvh] bg-white !pt-[20px] relative">
        <div className="sticky top-0 z-20 bg-white/95 border-b border-slate-100">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center  gap-2 relative">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-[18px] font-semibold">{client?.name}</h1>
            <div className="ml-auto relative">
              <button
                onClick={toggleFavorite}
                className="shrink-0 text-amber-400 cursor-pointer pr-[15px] mt-[5px]"
                title="Sevimlilar"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill={favorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
              <button
                className="cursor-pointer"
                onClick={() => setMenuOpen((p) => !p)}
              >
                <DIcon />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-[160px] bg-white rounded-2xl shadow-lg border z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/mijoz/edit/${id}`);
                    }}
                    className="block px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Tahrirlash
                  </button>
                  <div className="border-t" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmDelete(true);
                    }}
                    className="block px-4 py-2 text-left text-red-500 hover:bg-red-50"
                  >
                    O‘chirish
                  </button>
                </div>
              )}
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
                Bu mijozda hozircha nasiya yo‘q.
              </div>
            </>
          ) : (
            debts.map((d) => (
              <div
                key={d.id}
                onClick={() => navigate(`/debt/${d.id}`)}
                className="rounded-2xl border p-4 mb-3 cursor-pointer hover:shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-slate-500">
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
                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${Math.round((d.progress ?? 0) * 100)}%` }}
                  />
                </div>
                <div></div>
              </div>
            ))
          )}
        </div>
        <Button
          onClick={() => navigate(`/debt/create?mijozId=${id}`)}
          className="!text-[16px] !fixed !right-[calc(50%-185px)] !bottom-[80px] !font-medium !h-[48px]"
          type="primary"
          size="large"
          icon={<PlusOutlined />}
        >
          Qo'shish
        </Button>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-80">
              <p className="mb-4">Haqiqatan ham o‘chirishni xohlaysizmi?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-slate-200 rounded"
                >
                  Yo‘q
                </button>
                <button
                  onClick={() => deleteMijoz.mutate()}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Ha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
