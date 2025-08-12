import { HisobotIcon, HomeIcon, MijozIcon, SozlamaIcon } from "../assets/icons";
import SuccessPage from "../components/SuccesPage";
import { Home, Seller, SingleMijoz } from "../pages/dashboard";
import Calendar from "../pages/dashboard/Calendar";
import CreateMijoz from "../pages/dashboard/CreateMijoz";
import CreateNasiya from "../pages/dashboard/CreateNasiya";
import Mijoz from "../pages/dashboard/Mijoz";
import NasiyaDetail from "../pages/dashboard/NasiyaDetail";
import NasiyaSondirish from "../pages/dashboard/NasiyaSondirish";
export const paths = {
  home: "/",
  login: "/login",
  seller: "/seller",
  mijoz: "/mijoz",
  hisobot: "/hisobot",
  sozlama: "/sozlama",
  calendar: "/calendar",
  createMijoz: "/mijoz/create",
  mijozOne: "/mijoz/:id",
  mijozDebt: "/debt/create",
  nasiyaOne: "/debt/:id",
  debtSon: "/debt/close/:id",
  succes: "/succes",
};

export const DashboardLists = [
  {
    id: 1,
    path: paths.home,
    element: <Home />,
  },
  {
    id: 2,
    path: paths.seller,
    element: <Seller />,
  },
  {
    id: 3,
    path: paths.calendar,
    element: <Calendar />,
  },
  {
    id: 4,
    path: paths.mijoz,
    element: <Mijoz />,
  },
  {
    id: 5,
    path: paths.createMijoz,
    element: <CreateMijoz />,
  },
  {
    id: 6,
    path: paths.mijozOne,
    element: <SingleMijoz />,
  },
  {
    id: 7,
    path: paths.mijozDebt,
    element: <CreateNasiya />,
  },
  {
    id: 8,
    path: paths.nasiyaOne,
    element: <NasiyaDetail />,
  },
  {
    id: 9,
    path: paths.debtSon,
    element: <NasiyaSondirish />,
  },
  {
    id: 10,
    path: paths.succes,
    element: <SuccessPage />,
  },
];

export const DashboardNavLists = [
  {
    key: 1,
    label: "Asosiy",
    path: paths.seller,
    icon: <HomeIcon />,
  },
  {
    key: 2,
    label: "Mijozlar",
    path: paths.mijoz,
    icon: <MijozIcon />,
  },
  {
    key: 3,
    label: "Hisobot",
    path: paths.hisobot,
    icon: <HisobotIcon />,
  },
  {
    key: 4,
    label: "Sozlama",
    path: paths.sozlama,
    icon: <SozlamaIcon />,
  },
];
