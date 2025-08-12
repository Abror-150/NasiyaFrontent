import { Link, useLocation } from "react-router-dom";
import { DashboardNavLists } from "../hooks/path";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white z-50 flex justify-center">
      <div className="containers flex justify-around w-full py-2 border-t border-gray-200">
        {DashboardNavLists.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              to={item.path}
              key={item.key}
              className={`flex flex-col items-center text-[13px] px-2 py-1 rounded-md transition-all duration-200
                ${
                  isActive
                    ? "text-[#3E7BFA]"
                    : "text-gray-500 hover:text-[#3E7BFA] hover:bg-gray-100"
                }`}
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </div>
              <span
                className={`mt-[2px] font-medium ${
                  isActive ? "text-[#3E7BFA]" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
