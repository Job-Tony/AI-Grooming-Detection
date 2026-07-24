import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export default function PasswordInput({
  label,
  placeholder,
  error,
  registration,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...registration}
          className={`w-full rounded-xl border bg-slate-950 px-4 py-3 pr-12 text-white outline-none transition ${
            error
              ? "border-red-500"
              : "border-slate-700 focus:border-blue-500"
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}