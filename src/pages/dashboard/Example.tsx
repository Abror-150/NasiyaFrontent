import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, ArrowLeft } from "lucide-react";
import axios from "axios";
import { API } from "../../hooks/getEnv";
import { useState } from "react";
import type { ExampleType } from "../../types/ExampleType";
import Heading from "../../components/Heading";
import { useCookies } from "react-cookie";

const NamunaList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [cookies] = useCookies(["token"]);

  const { data, isLoading } = useQuery({
    queryKey: ["namuna", "list"],
    queryFn: async () => {
      const res = await axios.get(`${API}/example`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      return res.data;
    },
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API}/example/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["namuna", "list"] });
      const prev = queryClient.getQueryData<ExampleType[]>(["namuna", "list"]);
      if (prev) {
        queryClient.setQueryData(
          ["namuna", "list"],
          prev.filter((item) => item.id !== id)
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["namuna", "list"], ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["namuna", "list"] });
      setMenuId(null);
      setDeleteId(null);
    },
  });

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

  return (
    <div className="containers h-[100vh]">
      <div className="pt-[40px]">
        <div className="left-0 flex gap-[100px]">
          <button
            type="button"
            onClick={() => navigate("/hisobot")}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-lg font-semibold">Namunalar</h1>
        </div>

        {!data || data.length === 0 ? (
          <div className="text-center text-gray-500 py-20 pt-[240px]">
            <Heading classList="!font-bold" tag="h2">
              Mavjud namunalar yo‘q
            </Heading>
            <span className="text-sm">
              “Qo‘shish” tugmasi orqali namuna yarating
            </span>
          </div>
        ) : (
          <div className="space-y-3 pt-[50px]">
            {data.map((n: ExampleType) => (
              <div
                key={n.id}
                className="p-3 bg-gray-100 rounded-lg flex justify-between items-center relative"
              >
                <p className="text-sm">{n.text}</p>
                <button
                  onClick={() => setMenuId(menuId === n.id ? null : n.id)}
                >
                  <MoreVertical size={18} />
                </button>

                {menuId === n.id && (
                  <div className="absolute right-2 top-8 bg-white shadow-md rounded-md border z-50">
                    <button
                      onClick={() => navigate(`/namuna/${n.id}`)}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => setDeleteId(n.id)} // 🔑 modal ochiladi
                      className="block px-4 py-2 hover:bg-red-100 text-sm text-red-500"
                    >
                      O‘chirish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center pt-[280px]">
          <button
            onClick={() => navigate("/namuna/create")}
            className="bg-blue-500 text-white h-12 w-full rounded-lg shadow-lg
               flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Qo‘shish
          </button>
        </div>
      </div>

      {/* 🔴 O‘chirish confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <p className="mb-4 font-medium">Haqiqatan o‘chirmoqchimisiz?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Ha
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Yo‘q
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamunaList;
