import React from "react";

// Define the props interface for SelectInput
interface SelectInputProps {
  label: string;
  name: string;
  errors: Record<string, any>;
  type?: string;
  register: any;
  className?: string;
  options: { id: string; title: string }[];
  multiple?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectInput({
  label,
  name,
  errors,
  type,
  register,
  className = "sm:col-span-2",
  options = [],
  multiple = false,
  onChange, // Add onChange prop here
  placeholder,
}: SelectInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Select
          onValueChange={(value) => {
            register(name).onChange({ target: { name, value } });
            if (onChange) onChange(value);
          }}
          defaultValue={register(name).value}
        >
          <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 focus:ring-[#163360] focus:border-[#163360]">
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100">
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors[name] && (
          <p className="mt-1 text-xs font-bold text-red-600">{label} is required</p>
        )}
      </div>
    </div>
  );
}
