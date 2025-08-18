import { Button, Segmented, Modal, List } from "antd";
import { CreateExampleIcon, MessageIcon } from "../../../assets/icons";
import { useState } from "react";
import HistoryPayment from "../../../modules/notification/HistoryPayment";
import Heading from "../../../components/Heading";
import Message from "../../../modules/notification/NotificationMessage";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { API } from "../../../hooks/getEnv";
import axios from "axios";

const Notification = () => {
  const [showMessage, setShowMessage] = useState<
    "Xabarlar tarixi" | "To‘lovlar tarixi"
  >("Xabarlar tarixi");
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [cookies] = useCookies(["token"]);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clientsWithoutMessages"],
    queryFn: () =>
      axios
        .get(`${API}/message/without-messages`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });

  console.log(clients, "cl");

  return (
    <>
      <div className="containers !mt-[30px] !pb-[18px] border-b-[1px] border-[#ECECEC] !mb-[16px]">
        <div className="flex items-center justify-between ">
          <Heading tag="h2" classList="!font-bold !text-[22px]">
            Hisobot
          </Heading>
          <button>
            <CreateExampleIcon />
          </button>
        </div>
      </div>

      <div className="containers">
        <div className="!flex !gap-[10px]">
          <Segmented
            onChange={(e: "Xabarlar tarixi" | "To‘lovlar tarixi") =>
              setShowMessage(e)
            }
            className="!w-full !h-[44px] !pl-[60px]"
            size="large"
            options={["Xabarlar tarixi", "To‘lovlar tarixi"]}
          />
        </div>

        <div className="mt-[16px]">
          {selectedClient ? (
            <Message />
          ) : showMessage === "Xabarlar tarixi" ? (
            <Message />
          ) : (
            <HistoryPayment />
          )}
        </div>
      </div>

      <Button
        className="!text-[16px] !fixed !rounded-full !right-[calc(50%-185px)] !bottom-[80px] !p-0 !font-medium !h-[58px] !w-[58px]"
        type="primary"
        size="large"
        icon={<MessageIcon />}
        onClick={() => setOpenModal(true)}
      />

      <Modal
        title="Mijozlar ro‘yxati"
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        <List
          dataSource={clients}
          loading={isLoading}
          renderItem={(client: any) => (
            <List.Item
              onClick={async () => {
                if (client.chatId) {
                  navigate(`/hisobot/${client.chatId}`);
                } else {
                  const res = await axios.post(
                    `${API}/message/createChat`,
                    { mijozId: client.id },
                    { headers: { Authorization: `Bearer ${cookies.token}` } }
                  );
                  navigate(`/hisobot/${res.data.id}`);
                }
              }}
            >
              <List.Item.Meta
                title={client.name}
                description={
                  client.PhoneClient?.[0]?.phoneNumber || "Telefon yo‘q"
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default Notification;
