import { string, object } from "yup";

export const LoginSchema = object({
  userName: string()
    .required("Login kiritish majburiy")
    .min(2, "Minimum 2 soz bo'lishi kerak"),
  password: string()
    .required("Password kiritish majburiy")
    .min(4, "Minimum 4 harf bo'lishi kerak"),
});
