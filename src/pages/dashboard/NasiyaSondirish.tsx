import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../hooks/getEnv";
import { ArrowLeft, ChevronRight, Check, X } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");
const formatUZS = (n: number) =>
  isFinite(n)
    ? Math.round(n).toLocaleString("uz-UZ", { maximumFractionDigits: 0 })
    : "0";

const fDate = (iso?: string | null) =>
  !iso
    ? ""
    : new Intl.DateTimeFormat("uz-UZ", {
        timeZone: "Asia/Tashkent",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date(iso))
        .replace(/\//g, ".");

const monthNameUz = (iso?: string) =>
  !iso
    ? ""
    : new Intl.DateTimeFormat("uz-UZ", { month: "long" })
        .format(new Date(iso))
        .replace(/^\w/, (c) => c.toUpperCase());

const clamp = (x: number, min = 0) => (x < min ? min : x);

type Month = {
  id: string;
  date: string;
  amount: number;
  partialAmount: number;
  status: "UNPAID" | "PENDING" | "PAID";
  monthNo: number;
};
type DebtSchedule = { id: string; plan: Month[]; remainingTotal?: number };
type DueMonth = Month & { remainingForMonth: number; monthNo: number };

function Modal({ open, onClose, title, children, footer }: any) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md mb-13 sm:mb-0 bg-white rounded-t-[22px] sm:rounded-[22px] p-4 sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-6 right-4 h-11 w-11 rounded-full bg-white shadow-lg grid place-items-center"
          aria-label="Yopish"
        >
          <X />
        </button>

        {title ? (
          <div className="text-[18px] font-semibold mb-3">{title}</div>
        ) : null}

        <div>{children}</div>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
}

/** Frontda planni lokal yangilash helper */
const updateLocalDebt = (
  plan: Month[],
  month: number,
  payThis: number
): Month[] => {
  return plan.map((m) => {
    if (m.monthNo === month) {
      const newPartial = m.partialAmount + payThis;
      return {
        ...m,
        partialAmount: newPartial,
        status: newPartial >= m.amount ? "PAID" : "PENDING",
      };
    }
    return m;
  });
};

export default function NasiyaSondirish() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;

  const [mOne, setMOne] = useState(false);
  const [mAny, setMAny] = useState(false);
  const [mPick, setMPick] = useState(false);

  const [anyAmount, setAnyAmount] = useState("");
  const anyAmountNum = Number(anyAmount || 0);

  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const qc = useQueryClient();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const { data, isLoading, isError } = useQuery<DebtSchedule>({
    queryKey: ["debt", "schedule", id],
    enabled: !!token && !!id,
    queryFn: async () => {
      const res = await axios.get(`${API}/debt/${id}`, { headers });
      const r = res.data as any;

      const rawList: any[] =
        r?.Tolovlar?.flatMap((t: any) =>
          t.TolovOy?.map((oy: any) => ({
            id: String(oy.id),
            date: t.date,
            amount: oy.amount ?? t.amount ?? 0,
            partialAmount: oy.partialAmount ?? 0,
            status: String(oy.status ?? "UNPAID").toUpperCase(),
            monthNo: oy.month,
          }))
        ) ?? [];

      const plan: Month[] = rawList.map((x: any, i: number) => ({
        id: x.id ?? crypto.randomUUID(),
        date: x.date ?? new Date().toISOString(),
        amount: Number(x.amount ?? 0),
        partialAmount: Number(x.partialAmount ?? 0),
        status: x.status,
        monthNo: Number(x.monthNo ?? i + 1),
      }));

      return { id: r?.id ?? String(id), plan } as DebtSchedule;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const monthsDue: DueMonth[] = useMemo(() => {
    const list = data?.plan ?? [];
    return list
      .sort((a, b) => a.monthNo - b.monthNo)
      .map((m) => ({
        ...m,
        remainingForMonth: clamp(
          Number(m.amount || 0) - Number(m.partialAmount || 0)
        ),
      }))
      .filter(
        (m) =>
          (m.status === "UNPAID" || m.status === "PENDING") &&
          m.remainingForMonth > 0
      );
  }, [data]);

  const nextMonth = monthsDue[0];
  const nextAmount = nextMonth?.remainingForMonth ?? 0;

  const pickedMonthNos = useMemo(
    () =>
      monthsDue
        .filter((m) => picked[m.id])
        .map((m) => m.monthNo)
        .sort((a, b) => a - b),
    [picked, monthsDue]
  );

  const pickedTotal = useMemo(
    () =>
      monthsDue
        .filter((m) => picked[m.id])
        .reduce((s, m) => s + m.remainingForMonth, 0),
    [picked, monthsDue]
  );

  const toggleAll = () => {
    if (pickedMonthNos.length === monthsDue.length) {
      setPicked({});
      return;
    }
    const obj: Record<string, boolean> = {};
    monthsDue.forEach((m) => (obj[m.id] = true));
    setPicked(obj);
  };

  const todayISO = new Date().toISOString().slice(0, 10);

  const refreshDebt = () => {
    qc.invalidateQueries({ queryKey: ["debt", "schedule", id] });
    qc.invalidateQueries({ queryKey: ["mijoz", "debts"] });
  };

  const payOne = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Debt topilmadi");
      return axios.post(
        `${API}/tolovlar/one-month`,
        { debtId: id, method: "ONE_MONTH", date: todayISO },
        { headers }
      );
    },
    onSuccess: () => {
      qc.setQueryData<DebtSchedule>(["debt", "schedule", id], (old) => {
        if (!old) return old;
        const idx = old.plan
          .sort((a, b) => a.monthNo - b.monthNo)
          .findIndex((m) => m.amount - m.partialAmount > 0);
        if (idx < 0) return old;

        const m = old.plan[idx];
        const payThis = clamp(m.amount - m.partialAmount);
        return { ...old, plan: updateLocalDebt(old.plan, m.monthNo, payThis) };
      });

      navigate("/succes");
      setMOne(false);
      refreshDebt();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "To‘lovda xatolik"),
  });

  const payAny = useMutation({
    mutationFn: async (amount: number) => {
      if (!id || !amount || amount <= 0) throw new Error("Miqdor noto‘g‘ri");
      return axios.post(
        `${API}/tolovlar/custom`,
        { debtId: id, amount, method: "CUSTOM", date: todayISO },
        { headers }
      );
    },
    onSuccess: (_, amount) => {
      qc.setQueryData<DebtSchedule>(["debt", "schedule", id], (old) => {
        if (!old) return old;
        let left = amount;
        let updated = [...old.plan];

        for (const m of [...old.plan].sort((a, b) => a.monthNo - b.monthNo)) {
          if (left <= 0) break;
          const need = m.amount - m.partialAmount;
          if (need <= 0) continue;

          const payThis = Math.min(need, left);
          left -= payThis;
          updated = updateLocalDebt(updated, m.monthNo, payThis);
        }

        return { ...old, plan: updated };
      });

      setMAny(false);
      navigate("/succes");

      refreshDebt();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "To‘lovda xatolik"),
  });

  const payPicked = useMutation({
    mutationFn: async () => {
      if (!id || pickedMonthNos.length === 0)
        throw new Error("Hech narsa tanlanmadi");
      return axios.post(
        `${API}/tolovlar/multi-month`,
        {
          debtId: id,
          method: "MULTI_MONTH",
          date: new Date().toISOString().split("T")[0],
          months: pickedMonthNos,
        },
        { headers }
      );
    },
    onSuccess: () => {
      qc.setQueryData<DebtSchedule>(["debt", "schedule", id], (old) => {
        if (!old) return old;
        let updated = [...old.plan];

        for (const m of old.plan.filter((x) =>
          pickedMonthNos.includes(x.monthNo)
        )) {
          const remaining = m.amount - m.partialAmount;
          if (remaining > 0) {
            updated = updateLocalDebt(updated, m.monthNo, remaining);
          }
        }

        return { ...old, plan: updated };
      });

      navigate("/succes");

      setMPick(false);
      refreshDebt();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "To‘lovda xatolik"),
  });

  if (isLoading) {
    return (
      <div className="containers min-h-[100dvh] flex items-center justify-center">
        <LoadingOutlined className="text-3xl text-slate-400 animate-spin" />
      </div>
    );
  }
  if (isError || !data)
    return <div className="p-4 text-red-600">Ma’lumot topilmadi</div>;

  return (
    <div className="containers min-h-[100dvh] bg-white">
      <div className="sticky top-0 z-20 bg-white/95 border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[18px] font-semibold">Nasiyani so‘ndirish</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        <div className="text-[16px] font-semibold mb-2">To‘lov</div>

        <button
          onClick={() => setMOne(true)}
          className="w-full text-left flex items-center justify-between h-12 px-1 border-t border-slate-100"
        >
          <span>1 oyga so‘ndirish</span>
          <ChevronRight className="text-slate-400" />
        </button>

        <button
          onClick={() => setMAny(true)}
          className="w-full text-left flex items-center justify-between h-12 px-1 border-t border-slate-100"
        >
          <span>Har qanday miqdorda so‘ndirish</span>
          <ChevronRight className="text-slate-400" />
        </button>

        <button
          onClick={() => setMPick(true)}
          className="w-full text-left flex items-center justify-between h-12 px-1 border-y border-slate-100"
        >
          <span>To‘lov muddatini tanlash</span>
          <ChevronRight className="text-slate-400" />
        </button>
      </div>

      <Modal
        open={mOne}
        onClose={() => setMOne(false)}
        title="1 oy uchun so‘ndirish"
      >
        {nextMonth ? (
          <>
            <div className="rounded-2xl bg-[#E7F0FF] p-4">
              <div className="text-[#3478F7] font-semibold text-[20px]">
                {formatUZS(nextAmount)} so‘m
              </div>
              <div className="text-slate-600 mt-1">
                {monthNameUz(nextMonth?.date)} oyi uchun so‘ndiriladi
              </div>
            </div>
            <button
              disabled={payOne.isPending}
              onClick={() => payOne.mutate()}
              className="mt-4 w-full h-12 rounded-xl bg-[#3478F7] text-white font-medium active:scale-[0.99] disabled:opacity-60"
            >
              1 oylik uchun so‘ndirish
            </button>
          </>
        ) : (
          <div className="text-slate-600">Hozir to‘lanadigan oy topilmadi.</div>
        )}
      </Modal>

      <Modal
        open={mAny}
        onClose={() => setMAny(false)}
        title="Har qanday miqdorda so‘ndirish"
      >
        <div className="text-[14px] text-slate-700 mb-2">Miqdor*</div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="To‘lov miqdori"
          value={anyAmount}
          onChange={(e) => setAnyAmount(onlyDigits(e.target.value))}
          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 focus:bg-white focus:border-[#3478F7] outline-none"
        />
        {!!anyAmountNum && (
          <div className="mt-2 text-slate-500 text-sm">
            Kiritildi:{" "}
            <span className="font-medium">{formatUZS(anyAmountNum)}</span> so‘m
          </div>
        )}
        <button
          disabled={!anyAmountNum || payAny.isPending}
          onClick={() => payAny.mutate(anyAmountNum)}
          className={`mt-4 w-full h-12 rounded-xl text-white font-medium active:scale-[0.99] ${
            !anyAmountNum ? "bg-[#CFE0FF]" : "bg-[#3478F7]"
          } disabled:opacity-60`}
        >
          So‘ndirish
        </button>
      </Modal>

      <Modal
        open={mPick}
        onClose={() => setMPick(false)}
        title="To‘lov muddatini tanlang"
      >
        {monthsDue.length === 0 ? (
          <div className="text-slate-600">Faol oylar topilmadi.</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-700">
                So‘ndirish:{" "}
                <span className="font-semibold">
                  {formatUZS(pickedTotal)} so‘m
                </span>
              </div>
              <button
                onClick={toggleAll}
                className="text-[#3478F7] text-[14px] font-medium"
              >
                {pickedMonthNos.length === monthsDue.length
                  ? "Hammasini bekor qilish"
                  : "Hammasini tanlang"}
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto -mx-1 px-1">
              {monthsDue.map((m) => {
                const checked = !!picked[m.id];
                return (
                  <label
                    key={m.id}
                    className="flex items-center justify-between py-3 border-b border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 text-slate-500">{m.monthNo}-oy</div>
                      <div className="text-slate-600">{fDate(m.date)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-slate-700">
                        {formatUZS(m.remainingForMonth)} so‘m
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPicked((p) => ({ ...p, [m.id]: !p[m.id] }))
                        }
                        className={`h-5 w-5 rounded-md border grid place-items-center ${
                          checked
                            ? "border-[#22c55e] bg-[#22c55e]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {checked ? (
                          <Check size={14} className="text-white" />
                        ) : null}
                      </button>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              disabled={pickedMonthNos.length === 0 || payPicked.isPending}
              onClick={() => payPicked.mutate()}
              className={`mt-4 w-full h-12 rounded-xl text-white font-medium active:scale-[0.99] ${
                pickedMonthNos.length === 0 ? "bg-[#CFE0FF]" : "bg-[#3478F7]"
              } disabled:opacity-60`}
            >
              So‘ndirish
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
