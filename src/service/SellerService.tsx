import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../hooks/getEnv";
import { useCookies } from "react-cookie";

export const useGetSellers = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  return useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await axios.get(`${API}/seller/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      return res.data;
    },
  });
};

export const useGetTolovlarDashboard = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  return useQuery({
    queryKey: ["tolovlarDashboard"],
    queryFn: async () => {
      const res = await axios.get(`${API}/tolovlar/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });
};
