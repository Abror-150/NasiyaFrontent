import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CalendarPage from "../../components/CalendarComponents";

const Calendar = () => {
  const navigate = useNavigate();

  return (
    <div className="containers h-[100vh] ">
      <div className="pt-[40px] relative flex items-center justify-center">
        <Heading classList="!font-bold" tag="h2">
          Kalendar
        </Heading>

        <div className="absolute left-0">
          <button onClick={() => navigate("/seller")}>
            <ArrowLeftOutlined />
          </button>
        </div>
      </div>
      <div className="pt-[30px]">
        <CalendarPage />
      </div>
    </div>
  );
};

export default Calendar;
