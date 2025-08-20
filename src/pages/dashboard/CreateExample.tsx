import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { ArrowLeft } from "lucide-react";
import { useCookies } from "react-cookie";

export default function CreateNamuna() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["token"]);

  const [text, setText] = useState("");

  const { data } = useQuery({
    queryKey: ["namuna", "detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axios.get(`${API}/example/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (data) setText(data.text);
  }, [data]);

  const createMutation = useMutation({
    mutationFn: async (payload: { text: string }) => {
      const res = await axios.post(`${API}/example`, payload, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["namuna", "list"] });
      navigate("/example");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { text: string }) => {
      const res = await axios.patch(`${API}/example/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["namuna", "list"] });
      navigate("/example");
    },
  });

  const handleSubmit = () => {
    if (!text) return;
    if (id) {
      updateMutation.mutate({ text });
    } else {
      createMutation.mutate({ text });
    }
  };

  return (
    <div className="containers !pt-[40px]">
      <div className="left-0 flex gap-[80px] ">
        <button onClick={() => navigate(-1)} className="pb-[7px]">
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold mb-4">
          {id ? "Namuna tahrirlash" : "Namuna yaratish"}
        </h1>
      </div>
      <textarea
        className="w-full border border-[#78A5FA] rounded-lg p-2 mb-4 mt-[70px]"
        rows={4}
        placeholder="Matn yozish..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white py-3 rounded-lg disabled:opacity-50 mt-[150px]"
        disabled={!text}
        onClick={handleSubmit}
      >
        {id ? "Saqlash" : "Yaratish"}
      </button>
      <div>
      </div>
    </div>
  );
}
