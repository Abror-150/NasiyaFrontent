import { RightOutlined } from "@ant-design/icons";
import Heading from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Sozlamalar = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  console.log(cookies.token);

  function handleLogOout() {
    removeCookie("token", { path: "/" });
    setCookie("token", null);
    navigate("/login");
  }
  return (
    <div className="containers h-[100vh]">
      <div className="pt-[40px]">
        <Heading classList="!font-semibold" tag="h2">
          Sozlamalar
        </Heading>
      </div>
      <div className="pt-[30px] ">
        <span className="text-[#3478F7]">Asosiy</span>

        <div className="pt-[20px] flex justify-between gap-[60px]">
          <button
            onClick={() => navigate("/special")}
            className="flex justify-between items-center w-full"
          >
            <span>Shaxsiy ma'lumotlar</span>
            <RightOutlined />
          </button>
        </div>
        <button className="flex justify-between items-center w-full pt-[10px]">
          <span>Xavfsizlik</span>
          <RightOutlined />
        </button>
        <div className="pt-[30px]">
          <span className="text-[#3478F7]">Boshqa</span>
        </div>
        <div className="pt-[10px]">
          <button className="flex justify-between items-center w-full pt-[10px]">
            <span>Yordam</span>
            <RightOutlined />
          </button>
        </div>
        <div className="pt-[10px]">
          <button className="flex justify-between items-center w-full pt-[10px]">
            <span>Taklif va shikoyatlar</span>
            <RightOutlined />
          </button>{" "}
        </div>
        <div className="pt-[10px]">
          <button className="flex justify-between items-center w-full pt-[10px]">
            <span>Dastur haqida</span>
            <RightOutlined />
          </button>{" "}
        </div>
        <div className="pt-[10px]">
          <button className="flex justify-between items-center w-full pt-[10px]">
            <span>Ommaviy oferta</span>
            <RightOutlined />
          </button>{" "}
        </div>
        <div className="pt-[10px]">
          <button className="flex justify-between items-center w-full pt-[10px]">
            <span>Maxfiylik siyosati</span>
            <RightOutlined />
          </button>{" "}
        </div>
        <div className="pt-[20px]">
          <button
            onClick={() => setModal(true)}
            className="text-[#F94D4D] font-normal"
          >
            Chiqish
          </button>
        </div>
      </div>
      {modal && (
        <>
          <div
            className=" pb-[290px] fixed inset-0 bg-black/40 backdrop-blur-sm z-40 "
            onClick={() => setModal(false)}
          />

          <div className="containers fixed  left-0 right-0 z-50 mx-auto  ">
            <div className="bg-white rounded-t-2xl p-5 shadow-lg">
              <h2 className="text-lg font-semibold text-center text-[#F94D4D]">
                Hisobdan chiqish
              </h2>
              <p className="text-center text-gray-600 mt-2">
                Siz haqiqatan hisobdan chiqmoqchimisiz?
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleLogOout}
                  className="flex-1 border-[1px] border-[#EDEDED]  text-[#3478F7] py-2 rounded-[10px]"
                >
                  Ha, chiqish
                </button>
                <button
                  onClick={() => setModal(false)}
                  className="flex-1 bg-[#F94D4D] text-white py-2 rounded-md"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sozlamalar;
