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
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

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
        <select
          {...register(name)}
          id={name}
          multiple={multiple}
          name={name}
          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          onChange={onChange} // Apply onChange here
        >
          {options.map((option, i) => (
            <option key={i} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        {errors[name] && (
          <span className="text-sm text-red-600">{label} is required</span>
        )}
      </div>
    </div>
  );
}
