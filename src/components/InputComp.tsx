import { cn } from "./utils";

type FormInputProps = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  className?: string;
};

export default function FormInput({
  label,
  required,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
  disabled,
  className,
}: FormInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-[14px] text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full h-12 rounded-[12px] border border-slate-200 bg-white px-4",
          "text-[15px] placeholder:text-slate-400 outline-none",
          "focus:border-slate-300 disabled:opacity-60"
        )}
      />
    </div>
  );
}
