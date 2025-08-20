import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-4 flex flex-wrap justify-center w-32">
          <div className="w-1 h-1 bg-red-500 rounded-full m-1"></div>
          <div className="w-1 h-1 bg-green-500 rounded-full m-1"></div>
          <div className="w-1 h-1 bg-blue-500 rounded-full m-1"></div>
          <div className="w-1 h-1 bg-yellow-500 rounded-full m-1"></div>
        </div>
        <div className="h-16 w-16 rounded-full bg-[#3478F7] flex items-center justify-center">
          <Check size={36} className="text-white" />
        </div>
      </div>

      <h1 className="text-[20px] font-semibold text-[#3478F7] mt-6">Ajoyib!</h1>
      <p className="text-slate-700 mt-1">Muvaffaqiyatli so‘ndirildi</p>

      <button
        onClick={() => navigate(-3)}
        className="mt-12 w-full max-w-xs h-12 bg-[#3478F7] text-white rounded-xl active:scale-[0.98]"
      >
        Ortga
      </button>
    </div>
  );
}
