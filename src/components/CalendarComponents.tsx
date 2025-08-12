import { Calendar } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/uz";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../hooks/getEnv";
import { useCookies } from "react-cookie";
import { ChevronLeft, ChevronRight } from "lucide-react";

dayjs.locale("uz");

const uzWeekdays = ["DU", "SE", "CH", "PA", "JU", "SH", "YA"];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const year = selectedDate.year();
  const month = selectedDate.month() + 1;

  const { data: monthlyTotal } = useQuery({
    queryKey: ["monthly-total", year, month],
    queryFn: async () => {
      const res = await axios.get(`${API}/debt/monthly-total`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month: String(month).padStart(2, "0") },
      });
      return res.data as { year: number; month: number; total: number };
    },
    enabled: !!token,
  });

  const { data: dayList } = useQuery({
    queryKey: ["by-date", selectedDate.format("YYYY-MM-DD")],
    queryFn: async () => {
      const res = await axios.get(`${API}/debt/byDate`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: selectedDate.format("YYYY-MM-DD") },
      });
      return res.data as {
        name: string;
        phone: string;
        remaining: number;
        payDate: string;
      }[];
    },
    enabled: !!token && !!selectedDate,
  });

  const { data: daysMeta } = useQuery({
    queryKey: ["monthly-days", year, month],
    queryFn: async () => {
      const res = await axios.get(`${API}/debt/monthly-days`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month: String(month).padStart(2, "0") },
      });
      console.log(res.data, "d");

      return res.data as { days: number[] };
    },
    enabled: !!token,
  });

  const daysWithPayments = useMemo(
    () => new Set(daysMeta?.days ?? []),
    [daysMeta]
  );

  const onSelect = (date: dayjs.Dayjs) => setSelectedDate(date);

  return (
    <div className="px-4 pt-2 pb-6 mx-auto h-[120vh]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[22px] font-semibold">
          {selectedDate.format("MMMM")}, {selectedDate.year()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate((d) => d.subtract(1, "month"))}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setSelectedDate((d) => d.add(1, "month"))}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between">
          <p className="text-[13px] text-gray-600">Oylik jami:</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-extrabold leading-none">
              {monthlyTotal?.total?.toLocaleString("uz-UZ") ?? 0}
            </span>
            <span className="text-gray-600">so‘m</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[12px] text-gray-500 mb-2">
        {uzWeekdays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <Calendar
        rootClassName="[&_.ant-picker-panel-container]:shadow-none
    [&_.ant-picker-content]:!mx-0
    [&_.ant-picker-content_thead]:hidden   /* inglizcha haftalik headerni o'chiradi */
    [&_.ant-picker-content]:!pt-0          /* yuqoridagi bo'sh joyni kamaytiradi */"
        fullscreen={false}
        value={selectedDate}
        onSelect={onSelect}
        headerRender={() => null}
        dateFullCellRender={(date) => {
          const isCurrentMonth = date.month() === selectedDate.month();
          const isSelected = date.isSame(selectedDate, "day");
          const hasPayment =
            isCurrentMonth && daysWithPayments.has(date.date());

          return (
            <div
              className={[
                "relative w-10 h-10 mx-auto flex items-center justify-center rounded-[12px] text-sm font-medium select-none",
                isSelected
                  ? "bg-blue-100 border border-blue-500 text-blue-700"
                  : isCurrentMonth
                  ? "bg-[#F2F2F2] text-gray-900"
                  : "bg-[#EFEFEF] text-gray-400",
              ].join(" ")}
            >
              {hasPayment && (
                <span className="absolute left-[4px] top-[4px] w-2 h-2 rounded-full bg-green-500" />
              )}
              {date.date()}
            </div>
          );
        }}
        className="[&_.ant-picker-panel-container]:shadow-none [&_.ant-picker-content]:!mx-0"
      />

      <div className="mt-4">
        <div className="bg-[#F5F5F7] px-4 py-3 rounded-t-[16px]">
          <p className="text-[14px] text-black font-medium">
            {selectedDate.format("D MMMM")} kuni to‘lov kutilmoqda
          </p>
        </div>

        <div className="bg-[#F5F5F7] px-4 pb-4 rounded-b-[16px]">
          <div className="space-y-3">
            {(dayList ?? []).map((item) => (
              <div
                key={`${item.name}-${item.phone}-${item.payDate ?? ""}`}
                className="bg-white p-4 rounded-2xl shadow-sm"
              >
                <p className="text-[15px] font-semibold text-black">
                  {item.name}
                </p>
                <p className="text-[13px] text-gray-600">
                  UZS {item.remaining.toLocaleString("uz-UZ")}
                </p>
              </div>
            ))}

            {(!dayList || dayList.length === 0) && (
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-[13px] text-gray-500">
                  Bu kunda to‘lov kutilmaydi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
