export interface MessageType {
  id: string;
  text: string;
  status: Status;
  chatId: string;
  mijozId: string;
  creadetAt: string;
  mijoz: MijozType;
  Chat: {
    id: string;
    mijozId: string;
    createdAt: string;
    mijoz: MijozType;
  };
}
export interface MijozType {
  id: string;
  name: string;
  address: string;
  note: string;
  sellerId: string;
  star: boolean;
}

export interface PaymentItem {
  id: string;
  name: string;
  phone: string;
  amount: number;
}
export interface PaymentType {
  id: string;
  date: string;
  payments: PaymentItem[];
}

export type Status = "PENDING" | "FAILED" | "SENT";

export interface notificationType {
  id: string;
  mijozId: string;
  chatId: string;
  text: string;
  status: Status;
  creadetAt: string;
  mijoz: {
    name: string;
    PhoneClient: {
      id: string;
      phoneNumber: string;
      mijozId: string;
    }[];
  };
}

export interface chatType {
  id: string;
  mijozId: string;
  createdAt: string;
  mijoz: {
    name: string;
    PhoneClient: {
      phoneNumber: string;
    };
  }[];
}
