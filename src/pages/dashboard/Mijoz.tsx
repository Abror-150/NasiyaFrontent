import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import { API } from "../../hooks/getEnv";
import { formatPhone } from "../../components/FormatPhone";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SortIcon } from "../../assets/icons";

const formatUZS = (n: number) =>
  n.toLocaleString("uz-UZ", { maximumFractionDigits: 0 });

type Item = { mijozId: string; name: string; phone: string; total: number };

export default function Mijoz() {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token as string | undefined;

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  function handleCreateCLientClikc() {
    navigate("/mijoz/create");
  }

  type Item = { mijozId: string; name: string; phone: string; total: number };
  type ClientStats = { grandTotal: number; list: Item[] };

  const { data, isLoading, isError } = useQuery<ClientStats>({
    queryKey: ["mijoz", "list"],
    queryFn: async () => {
      const res = await axios.get(`${API}/mijoz`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = res.data as {
        grandTotal: number;
        data: Array<{
          id: string;
          name: string;
          total: number;
          PhoneClient?: { phoneNumber: string }[];
        }>;
      };

      const list: Item[] = payload.data.map((m) => ({
        mijozId: m.id,
        name: m.name,
        phone: m.PhoneClient?.[0]?.phoneNumber ?? "",
        total: m.total ?? 0,
      }));

      return { grandTotal: payload.grandTotal, list };
    },
    enabled: !!token,
  });

  const list = data?.list ?? [];

  const [sortByNameAsc, setSortByNameAsc] = useState(true);

  const filtered: Item[] = useMemo(() => {
    let items = list;

    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (x) =>
          x.name.toLowerCase().includes(s) ||
          (x.phone || "").toLowerCase().includes(s)
      );
    }

    return [...items].sort((a, b) =>
      sortByNameAsc
        ? a.name.localeCompare(b.name, "uz", { sensitivity: "base" })
        : b.name.localeCompare(a.name, "uz", { sensitivity: "base" })
    );
  }, [list, search, sortByNameAsc]);

  if (isLoading) {
    return (
      <div className="containers bg-white h-[100vh] ">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border  bg-white p-4 shadow-sm"
          >
            <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-28 bg-slate-200 rounded mb-4" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError)
    return (
      <div className="p-4 text-red-600 max-w-md mx-auto">
        Xatolik yuz berdi. Qayta urinib ko‘ring.
      </div>
    );

  return (
    <div className="containers min-h-[100dvh] ">
      <div className="sticky top-0 z-20 bg-white/95 supports-[backdrop-filter]:backdrop-blur-md border-b border-slate-100">
        <div className=" mx-auto px-3 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative ">
              <div className="!">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Mijozlarni qidirish…"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-slate-300"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-3.5-3.5"></path>
                </svg>
              </div>
            </div>
            <button
              onClick={() => setSortByNameAsc((prev) => !prev)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm active:scale-[0.98]"
              title="Filter"
            >
              <SortIcon />
            </button>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-3 pb-28">
        {filtered.map((item) => (
          <ClientCardLike key={item.mijozId} item={item} />
        ))}
        <div className="containers relative">
          <div className="flex justify-end">
            <button
              onClick={handleCreateCLientClikc}
              className="fixed bottom-20 md:right-[calc((100%-var(--container-width))/2)] inline-flex items-center gap-2 rounded-full bg-[#3B82F6] text-white px-5 h-12 shadow-lg active:scale-[0.98] z-50"
            >
              <UserPlus size={20} />
              Yaratish
            </button>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            Hech narsa topilmadi
          </div>
        )}
      </div>
    </div>
  );
}

function ClientCardLike({ item }: { item: Item }) {
  const navigate = useNavigate();
  const debt = item.total ?? 0;
  const goDetail = () =>
    navigate(`/mijoz/${item.mijozId}`, { state: { item } });

  return (
    <div
      onClick={goDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goDetail()}
      className="
        rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm mb-3
        cursor-pointer select-none
        transition-transform duration-150 ease-out will-change-transform
        hover:-translate-y-[2px] hover:shadow-md
        active:scale-[0.98]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-slate-800">{item.name}</div>
          <div className="text-slate-500 text-sm mt-1">
            {formatPhone(item.phone)}
          </div>
        </div>

        <button
          className="shrink-0 text-amber-400"
          title="Sevimlilar"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>

      <div className="mt-4 text-slate-500 text-sm">Jami nasiya:</div>
      <div className="text-[#F94D4D]">{formatUZS(-Math.abs(debt))} so‘m</div>
    </div>
  );
}
