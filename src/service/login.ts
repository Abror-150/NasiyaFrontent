// service/login.ts
import { instance } from "../hooks/instance";

export const Logins = async (
  data: { userName: string; password: string },
  setCookie: (name: string, value: any, options?: any) => void
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await instance.post("/login", data);
    const token = res.data?.token;

    if (token) {
      setCookie("token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
      return { success: true };
    }

    return { success: false, message: res.data?.message || "Token topilmadi" };
  } catch (err: any) {
    const msg = err?.response?.data?.message || "Username yoki parol noto‘g‘ri";
    return { success: false, message: msg };
  }
};
