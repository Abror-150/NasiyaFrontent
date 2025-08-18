export interface MessageType {
  id: string;
  text: string;
  status: Status;
  mijozId: string;
  creadetAt: string;
  mijoz: {
    name: string;
  };
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
