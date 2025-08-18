import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import axios from "axios";
import { formatPhone } from "../../components/FormatPhone";
import Text from "../../components/Text";
import NotificationMessageNotFound from "./NotificationNotFound";
import type { PaymentType } from "../../types/MessageType";
import { API } from "../../hooks/getEnv";

const HistoryPayment = () => {
  const [cookies] = useCookies(["token"]);
  const { data = [], isLoading } = useQuery<PaymentType[]>({
    queryKey: ["history-payment"],
    queryFn: () =>
      axios
        .get(`${API}/tolovlar/history`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className=" containers cursor-pointer">
            <Text classList="!text-center !text-[12px] !text-[#3478F7] !mt-[24px] !font-semibold">
              {index === 0
                ? item.date.split("T")[0]
                : Number(data[index]?.date?.split("T")[0].split("-")[2]) ===
                  Number(data[index - 1]?.date?.split("T")[0]?.split("-")[2])
                ? ""
                : item.date.split("T")[0]}
            </Text>

            {item.payments.map((p: any, idx: any) => (
              <div
                key={idx}
                className="flex items-center justify-between py-[16px] border-b border-[#ECECEC]"
              >
                <div>
                  <Text classList="!font-bold !text-[14px] !mb-[8px]">
                    {p.name}
                  </Text>
                  <Text classList="!text-bold !text-[#000000B2] !text-[13px]">
                    {formatPhone(p.phone)}
                  </Text>
                </div>
                <Text classList="!font-medium !text-[16px] !text-[#000000]">
                  {p.amount.toLocaleString()} so'm
                </Text>
              </div>
            ))}
          </div>
        ))
      ) : (
        <NotificationMessageNotFound />
      )}
    </div>
  );
};

export default HistoryPayment;
