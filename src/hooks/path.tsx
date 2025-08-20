import { HisobotIcon, HomeIcon, MijozIcon, SozlamaIcon } from "../assets/icons";
import SuccessPage from "../components/SuccesPage";
import Message from "../modules/notification/NotificationMessage";
import { Home, Seller, SingleMijoz } from "../pages/dashboard";
import Calendar from "../pages/dashboard/Calendar";
import CreateNamuna from "../pages/dashboard/CreateExample";
import CreateMijoz from "../pages/dashboard/CreateMijoz";
import CreateNasiya from "../pages/dashboard/CreateNasiya";
import Example from "../pages/dashboard/Example";
import Mijoz from "../pages/dashboard/Mijoz";
import MySelf from "../pages/dashboard/MySelf";
import NasiyaDetail from "../pages/dashboard/NasiyaDetail";
import NasiyaSondirish from "../pages/dashboard/NasiyaSondirish";
import NotificationMessage from "../pages/dashboard/report/Message";
import Notification from "../pages/dashboard/report/Notification";
import Sozlamalar from "../pages/dashboard/Sozlamalar";
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
  mijozUpdate: "/mijoz/edit/:id",
  debtPayment: "/mijoz/:id/debt/:debtId/payment",
  notificationMessage: "/hisobot/:chatId/:mijozId",
  // message: "/hisobot/:mijozId",
  example: "/example",
  createExample: "/namuna/create",
  updateExample: "/namuna/:id",
  mySelf: "/special",
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
  {
    id: 11,
    path: paths.mijozUpdate,
    element: <CreateMijoz />,
  },

  {
    id: 13,
    path: paths.hisobot,
    element: <Notification />,
  },
  {
    id: 12,
    path: paths.notificationMessage,
    element: <NotificationMessage />,
  },
  {
    id: 13,
    path: paths.example,
    element: <Example />,
  },
  {
    id: 14,
    path: paths.createExample,
    element: <CreateNamuna />,
  },
  {
    id: 15,
    path: paths.updateExample,
    element: <CreateNamuna />,
  },
  {
    id: 16,
    path: paths.sozlama,
    element: <Sozlamalar />,
  },
  {
    id: 17,
    path: paths.mySelf,
    element: <MySelf />,
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
