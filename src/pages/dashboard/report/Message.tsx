import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackIcon,
  CreateExampleIcon,
  SendMessageIcon,
} from "../../../assets/icons";
import { Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import Text from "../../../components/Text";
import Heading from "../../../components/Heading";
import type { MessageType } from "../../../types/MessageType";
import { FindMonth } from "../../../hooks/findMont";
import { API } from "../../../hooks/getEnv";

const NotificationMessage = () => {
  const { mijozId } = useParams();

  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const date = new Date()

  const content = <h2>Nimadir boladi</h2>;

  const { data = [], isLoading } = useQuery<MessageType[]>({
    queryKey: ["message"],
    queryFn: () =>
      axios
        .get(`${API}/message`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params: { mijozId },
        })
        .then((res) => res.data),
  });
  console.log(data, "d");

  const [text, setMessage] = useState<string>("");
  const { mutate } = useMutation({
    mutationFn: (data: { text: string; mijozId: string | undefined }) =>
      axios
        .post(`${API}/message`, data, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message"] });
      setMessage("");
    },
  });

  function handleCreateMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const tempId = Date.now();
    const newMessage: MessageType = {
      id: tempId.toString(),
      text,
      status: "PENDING",
      creadetAt: new Date().toISOString(),
      mijozId: mijozId!,
      mijoz: { name: data[0]?.mijoz?.name },
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setMessage("");

    mutate(
      { text, mijozId },
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

  const [localMessages, setLocalMessages] = useState<MessageType[]>([]);

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

  return (
    <div className="containers ">
      <div className="flex fixed top-0 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between pb-[11px] mb-[28px]">
        <button
          className="cursor-pointer duration-300 hover:scale-[1.2]"
          onClick={() => navigate("/hisobot")}
        >
          {" "}
          <BackIcon />{" "}
        </button>
        <Heading tag="h2">
          {data.length > 0 ? data[0]?.mijoz?.name : "---"}
        </Heading>
        <Popover
          className="debtor-single-popop"
          placement="bottomRight"
          content={content}
          trigger="click"
        >
          <button>
            {" "}
            <MoreOutlined className="!text-[24px] cursor-pointer duration-300 hover:scale-[1.2]" />{" "}
          </button>
        </Popover>
      </div>
      <div className="mt-[80px] mb-[70px] h-[calc(100vh-160px)] overflow-y-auto space-y-[20px] px-3">
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
        className="flex fixed w-full max-w-[400px] bg-white py-[8px] bottom-[60px] mx-auto justify-between items-center"
      >
        <button
          type="button"
          className="cursor-pointer hover:scale-[1.2] duration-300"
        >
          {" "}
          <CreateExampleIcon />{" "}
        </button>
        <div className="w-[90%] flex items-center justify-between pr-[18px] bg-[#F5F5F5] rounded-[50px]">
          <input
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
            {" "}
            <SendMessageIcon />{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationMessage;
