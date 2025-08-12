import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import { API } from "../hooks/getEnv";
import type { MijozType } from "../types/CreateMijozType";

export const useGetclients = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  return useQuery({
    queryKey: ["mijoz"],
    queryFn: async () => {
      const res = await axios.get(`${API}/tolovlar/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, "res2");

      return res.data;
    },
  });
};

export const createMijoz = async (data: MijozType) => {
  const res = await axios.post("/mijoz", data);
  return res.data;
};
