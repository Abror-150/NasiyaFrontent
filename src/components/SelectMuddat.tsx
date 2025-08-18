import { Select } from "antd";

type MonthSelectProps = {
  value?: number;
  onChange?: (value: number) => void;
};

const options = [
  { value: 0, label: "Oyni tanlang", disabled: true },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} oy`,
  })),
];

export default function MonthSelect({ value, onChange }: MonthSelectProps) {
  return (
    <Select
      value={value}
      onChange={(v:any) => onChange?.(v)}
      options={options}
      placeholder="Oyni tanlang"
      style={{ width: "100%", height: 44, borderRadius: 8 }}
      popupClassName="rounded-lg"
    />
  );
}
