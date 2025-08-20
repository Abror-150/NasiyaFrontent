import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../hooks/getEnv";

type Namuna = {
  id: string;
  text: string;
};

export default function ChatWithNamuna() {
  const [namunalar, setNamunalar] = useState<Namuna[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNamuna, setSelectedNamuna] = useState<string>("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const res = await axios.get(`${API}/example`);
        setNamunalar(res.data);
      } catch (err) {
        console.error("Namunalarni olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExamples();
  }, []);

  const handleToggle = (text: string) => {
    setSelectedNamuna(text);
    setMessage(text);
  };

  const handleSend = () => {
    if (!message) return;
    console.log("Yuborilayotgan xabar:", message);

    axios.post(`${API}/messages`, { text: message });

    setMessage("");
    setSelectedNamuna("");
  };

  return (
    <div className="containers p-4">
      <div className="border rounded-lg p-3 mb-4 h-[200px] overflow-y-auto">
        <p>Oldingi xabarlar shu yerda chiqadi...</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Xabar yozish..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={!message}
        >
          Jo‘natish
        </button>
      </div>

      <h3 className="font-semibold mb-2">Namunalar</h3>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : namunalar.length === 0 ? (
        <p className="text-gray-500">Sizda hali namunalar yo‘q</p>
      ) : (
        <div className="space-y-3">
          {namunalar.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between border p-3 rounded-lg ${
                selectedNamuna === n.text
                  ? "border-blue-400"
                  : "border-gray-200"
              }`}
            >
              <p className="text-sm">{n.text}</p>
              <input
                type="checkbox"
                checked={selectedNamuna === n.text}
                onChange={() => handleToggle(n.text)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
