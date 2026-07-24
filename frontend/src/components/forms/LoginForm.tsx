import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, LogIn, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/components/auth/PasswordInput";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});

type LoginFormData = z.infer<typeof schema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");

    try {
      await login(data);
      navigate("/dashboard");
    } catch {
      setServerError("Invalid email or password.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Email */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`w-full rounded-xl border bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition ${
              errors.email
                ? "border-red-500"
                : "border-slate-700 focus:border-blue-500"
            }`}
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        registration={register("password")}
        error={errors.password?.message}
      />

      {/* Remember + Forgot */}

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-400">
          <input
            type="checkbox"
            className="rounded border-slate-700 bg-slate-900"
          />
          Remember Me
        </label>

        <button
          type="button"
          className="text-blue-400 hover:text-blue-300"
        >
          Forgot Password?
        </button>
      </div>

      {/* Server Error */}

      {serverError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {serverError}
        </div>
      )}

      {/* Login Button */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
            />
            Logging in...
          </>
        ) : (
          <>
            <LogIn size={20} />
            Login
          </>
        )}
      </button>

      {/* Register */}

      <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Create Account
        </Link>
      </div>
    </form>
  );
}