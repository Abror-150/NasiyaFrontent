export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  const cleaned = digits.startsWith("998")
    ? digits.slice(3)
    : digits.startsWith("8")
    ? digits.slice(1)
    : digits;

  return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3");
}
