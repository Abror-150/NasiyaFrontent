export const FindMonth = (index: number) => {
  const monthList = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  return monthList[index];
};

export const formatDayMonth = (iso?: string) => {
  if (!iso) return "--";
  const [y, m, d] = iso.split("T")[0].split("-");
  return d && m ? `${d} ${FindMonth(Number(m))}` : "--";
};
