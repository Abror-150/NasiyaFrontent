import Heading from "../../components/Heading";
import {
  useGetSellers,
  useGetTolovlarDashboard,
} from "../../service/SellerService";
import { CalendarImage, WalletIcon } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import { formatDebtFull } from "../../components/DebtFormat";
import { useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
const Seller = () => {
  const { data: seller } = useGetSellers();

  const { data: dashboard } = useGetTolovlarDashboard();

  const navigate = useNavigate();
  const [showTotal, setShowTotal] = useState(true);
  const toggleTotal = () => setShowTotal((s) => !s);
  const handleCalendarClick = () => {
    navigate("/calendar");
  };
  return (
    <div className="containers h-[100vh]">
      <div className="pt-[50px] flex justify-between">
        <div className="flex gap-[10px] ">
          <img
            className="rounded-full w-[40px] h-[40px]"
            src={`${seller?.img}`}
            width={40}
            height={40}
          />
          <Heading classList="!font-bold !pt-[5px]" tag="h2">
            {seller?.userName}
          </Heading>
        </div>
        <button onClick={handleCalendarClick}>
          <img src={CalendarImage} alt="Calendar" width={24} height={24} />
        </button>
      </div>
      <div className=" pt-[40px]">
        <div className=" relative bg-[#30AF49] h-[70px] rounded-[20px]">
          <div className="flex flex-col pt-[8px] items-center">
            <Heading classList="!text-[#F6F6F6]" tag="h2">
              {showTotal
                ? formatDebtFull(dashboard?.totalRemaining ?? 0)
                : "•••••• so‘m"}
            </Heading>
            <div className=" absolute right-4 top-7   ">
              <button
                onClick={toggleTotal}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 active:scale-95"
                aria-label={showTotal ? "Yashirish" : "Ko‘rsatish"}
                type="button"
              >
                {showTotal ? (
                  <Eye className="text-white" size={20} />
                ) : (
                  <EyeOff className="text-white" size={20} />
                )}
              </button>
            </div>
            <p className="text-[#F6F6F6B2]">Umumiy nasiya:</p>
          </div>
        </div>
      </div>
      <div className="pt-[25px]">
        <div className="flex gap-4">
          <div className="w-[160px] h-[100px] rounded-[20px] border border-gray-200 p-4 flex flex-col justify-between">
            <p className="text-[16px] font-semibold text-black leading-[20px]">
              Kechiktirilgan <br /> to‘lovlar
            </p>
            <p className="text-[22px] font-semibold text-red-500">
              {dashboard?.latePayments}
            </p>
          </div>

          <div className="w-[160px] h-[100px] rounded-[20px] border border-gray-200 p-4 flex flex-col justify-between">
            <p className="text-[16px] font-semibold text-black leading-[20px]">
              Mijozlar <br /> soni
            </p>
            <p className="text-[22px] font-semibold text-green-600">
              {dashboard?.clientCount}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-[30px]">
        <h2 className="text-[20px] font-semibold mb-4">Hamyoningiz</h2>

        <div className="flex items-center justify-between bg-white p-4 rounded-[20px] shadow-sm ">
          <div className="bg-[#F4F2FF] p-3 rounded-full">
            <img src={WalletIcon} alt="wallet" className="w-6 h-6" />
          </div>

          <div className="flex flex-col items-start justify-center ml-4 flex-grow">
            <p className="text-[14px] text-gray-600 mb-1">Hisobingizda</p>
            <p className="text-[24px] font-bold text-black">
              {seller?.balance}
              <span className="text-[18px] font-medium">so‘m</span>
            </p>
          </div>

          <button className="w-8 h-8 rounded-full bg-[#3E7BFA] flex items-center justify-center">
            <Plus size={18} color="white" />
          </button>
        </div>

        <div className="flex justify-between mt-4 px-1">
          <p className="text-gray-700 text-[15px]">Bu oy uchun to‘lov:</p>
          <p className="text-green-600 font-medium text-[15px]">
            To‘lov qilingan
          </p>
        </div>
      </div>
    </div>
  );
};

export default Seller;
