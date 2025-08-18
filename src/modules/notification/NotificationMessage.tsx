import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { notificationType } from "../../types/MessageType";
import NotificationMessageNotFound from "./NotificationNotFound";
import { formatPhone } from "../../components/FormatPhone";
import Text from "../../components/Text";
import { API } from "../../hooks/getEnv";
import { formatDayMonth } from "../../hooks/findMont";

const Message = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const { data = [], isLoading } = useQuery<notificationType[]>({
    queryKey: ["messages"],
    queryFn: () =>
      axios
        .get(`${API}/message`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });

  return (
    <div className="">
      {isLoading ? (
        "Loading..."
      ) : data.length > 0 ? (
        data?.map((item: notificationType) => (
          <div
            onClick={() => navigate(`/hisobot/${item.mijozId}`)}
            key={item.id}
            className="flex cursor-pointer items-center justify-between py-[16px] border-b-[1px] border-[#ECECEC]"
          >
            <div>
              <Text classList="!font-bold !text-[14px] !mb-[8px]">
                {item.mijoz.name}
              </Text>
              <Text classList="!font-semibold !text-[13px]">
                {item?.mijoz?.PhoneClient?.[0]?.phoneNumber?.trim()
                  ? formatPhone(item.mijoz.PhoneClient[0].phoneNumber)
                  : "-"}
              </Text>
            </div>
            <Text classList="!font-semibold !text-[12px]">
              <Text classList="!font-semibold !text-[12px]">
                {formatDayMonth(item.creadetAt)}
              </Text>
            </Text>
          </div>
        ))
      ) : (
        <NotificationMessageNotFound />
      )}
    </div>
  );
};

export default Message;
