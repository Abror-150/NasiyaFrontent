const nfUZ = new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 });

export function formatDebtFull(n: number) {
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  return `${sign}${nfUZ.format(abs)}\u00A0so‘m`;
}