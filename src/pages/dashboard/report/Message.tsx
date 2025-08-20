import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackIcon,
  CreateExampleIcon,
  SendMessageIcon,
} from "../../../assets/icons";
import { Modal, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import axios from "axios";
import Text from "../../../components/Text";
import Heading from "../../../components/Heading";
import type { MessageType } from "../../../types/MessageType";
import { FindMonth } from "../../../hooks/findMont";
import { API } from "../../../hooks/getEnv";

type Namuna = { id: string; text: string };

const NotificationMessage = () => {
  const { chatId, mijozId } = useParams<{ chatId: string; mijozId: string }>();
  console.log(chatId, "chatId");
  console.log(mijozId, "mijoz");

  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showExamples, setShowExamples] = useState(false);
  const content = <h2>Nimadir boladi</h2>;
  const [modal, setModal] = useState<boolean>(false);

  const { data = [], isLoading } = useQuery<MessageType[]>({
    queryKey: ["message", chatId, "messages"],
    queryFn: () =>
      axios
        .get(`${API}/message?${chatId}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params: { chatId },
        })
        .then((res) => res.data),
    enabled: !!mijozId,
  });

  const [text, setMessage] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<MessageType[]>([]);

  const { mutate } = useMutation({
    mutationFn: (data: {
      text: string;
      chatId: string | undefined;
      mijozId: string;
    }) =>
      axios
        .post(`${API}/message`, data, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message", chatId] });
      setMessage("");
    },
  });

  function handleCreateMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text) return;

    const tempId = Date.now();
    const newMessage: MessageType = {
      id: tempId.toString(),
      text,
      status: "PENDING",
      creadetAt: new Date().toISOString(),
      chatId: chatId!,
      mijozId: mijozId!,
      mijoz: {
        id: mijozId!,
        name: data[0]?.mijoz?.name ?? "",
        address: data[0]?.mijoz?.address ?? "",
        note: data[0]?.mijoz?.note ?? "",
        sellerId: data[0]?.mijoz?.sellerId ?? "",
        star: data[0]?.mijoz?.star ?? false,
      },
      Chat: {
        id: chatId!,
        mijozId: mijozId!,
        createdAt: new Date().toISOString(),
        mijoz: {
          id: mijozId!,
          name: data[0]?.mijoz?.name ?? "",
          address: data[0]?.mijoz?.address ?? "",
          note: data[0]?.mijoz?.note ?? "",
          sellerId: data[0]?.mijoz?.sellerId ?? "",
          star: data[0]?.mijoz?.star ?? false,
        },
      },
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setMessage("");

    mutate(
      {
        text,
        chatId,
        mijozId: mijozId ?? "",
      },
      {
        onSuccess: (res) => {
          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === tempId.toString() ? { ...res, status: "SENT" } : m
            )
          );
        },
        onError: () => {
          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === tempId.toString() ? { ...m, status: "FAILED" } : m
            )
          );
        },
      }
    );
  }

  useEffect(() => {
    if (data?.length) {
      setLocalMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newOnes = data.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newOnes];
      });
    }
  }, [data]);

  useEffect(() => {
    localMessages.forEach((msg: any) => {
      if (msg.status === "pending") {
        setTimeout(() => {
          setLocalMessages((prev: any) =>
            prev.map((m: any) =>
              m.id === msg.id && m.status === "pending"
                ? { ...m, status: "failed" }
                : m
            )
          );
        }, 10000);
      }
    });
  }, [localMessages]);

  const [namunalar, setNamunalar] = useState<Namuna[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get(`${API}/example`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => setNamunalar(res.data))
      .catch((err) => console.error("Namunalarni olishda xatolik:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectNamuna = (text: string) => {
    setMessage(text);
    setShowExamples(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };
  const deleteMijoz = useMutation({
    mutationFn: async () => {
      await axios.delete(`${API}/message/${chatId}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientsWithoutMessages"] });
      queryClient.invalidateQueries({ queryKey: ["message", chatId] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", chatId, "clientsWithoutMessages"],
      });
      setTimeout(() => {
        navigate("/hisobot");
      }, 800);
    },
  });

  return (
    <div className="containers  h-[100vh] ">
      <div className="flex fixed top-0 z-50 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between pb-[11px] mb-[28px]">
        <button
          className="cursor-pointer duration-300 hover:scale-[1.2]"
          onClick={() => navigate("/hisobot")}
        >
          <BackIcon />
        </button>
        <Heading tag="h2">
          {data.length > 0 ? data[0]?.Chat?.mijoz.name : "---"}
        </Heading>
        <Popover
          className="debtor-single-popop"
          placement="bottomRight"
          content={content}
          trigger="click"
        >
          <button onClick={() => setModal(true)}>
            <MoreOutlined className="!text-[24px] cursor-pointer duration-300 hover:scale-[1.2]" />
          </button>
        </Popover>
      </div>

      <div className="mt-[80px] pb-[150px] h-[calc(100vh-200px)] overflow-y-auto space-y-[20px] px-3">
        {isLoading
          ? "Loading..."
          : localMessages.map((item, index) => (
              <div key={item.id}>
                <Text classList="font-medium !text-[12px] !text-center">
                  {index == 0
                    ? `${
                        item.creadetAt.split("T")[0].split("-")[2]
                      } ${FindMonth(
                        Number(item.creadetAt.split("T")[0].split("-")[1])
                      )}`
                    : Number(
                        localMessages[index]?.creadetAt
                          ?.split("T")[0]
                          .split("-")[2]
                      ) ==
                      Number(
                        localMessages[index - 1]?.creadetAt
                          ?.split("T")[0]
                          ?.split("-")[2]
                      )
                    ? ""
                    : `${
                        item.creadetAt.split("T")[0].split("-")[2]
                      } ${FindMonth(
                        Number(item.creadetAt.split("T")[0].split("-")[1])
                      )}`}
                </Text>

                <div className="p-4 ml-auto relative max-w-[300px] !mt-[20px] rounded-[16px] bg-[#F5F5F5]">
                  <Text classList="font-normal !text-[13px]">{item.text}</Text>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">{item.status}</span>
                    <span className="text-[10px]">
                      {item.creadetAt.split("T")[1].split(".")[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <form
        onSubmit={handleCreateMessage}
        autoComplete="off"
        className="flex fixed w-full max-w-[400px] bg-white py-[8px] bottom-[100px] mx-auto justify-between items-center"
      >
        <button
          onClick={() => setShowExamples(true)}
          type="button"
          className="cursor-pointer hover:scale-[1.2] duration-300"
        >
          <CreateExampleIcon />
        </button>

        <div className="w-[90%] flex items-center justify-between pr-[18px] bg-[#F5F5F5] rounded-[50px]">
          <input
            ref={inputRef}
            onChange={(e) => setMessage(e.target.value)}
            value={text}
            className="w-[90%] py-[12px] outline-none pl-[16px]"
            type="text"
            placeholder="Xabar yuborish..."
          />
          <button
            type="submit"
            className="cursor-pointer hover:scale-[1.2] duration-300"
          >
            <SendMessageIcon />
          </button>
        </div>
      </form>
      <Modal
        open={showExamples}
        footer={null}
        onCancel={() => setShowExamples(false)}
        title="Namunalar"
      >
        {loading ? (
          <p>Yuklanmoqda...</p>
        ) : namunalar.length === 0 ? (
          <p className="text-gray-500">Sizda hali namunalar yo‘q</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {namunalar.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSelectNamuna(n.text)}
                className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 whitespace-nowrap"
              >
                {n.text}
              </button>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        open={modal}
        onCancel={() => setModal(false)}
        onOk={() => deleteMijoz.mutate()}
        okText="Ha"
        cancelText="Yo‘q"
        title="Chatni o‘chirishni xohlaysizmi?"
      >
        <p>Ushbu chat o‘chirilib ketadi. Davom etishni xohlaysizmi?</p>
      </Modal>
    </div>
  );
};

export default NotificationMessage;
