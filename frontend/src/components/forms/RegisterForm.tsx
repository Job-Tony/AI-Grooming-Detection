import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  UserPlus,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/components/auth/PasswordInput";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters."),
    email: z.string().email("Enter a valid email."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    setSuccessMessage("");

    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setServerError(
        "Registration failed. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Username */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Username
        </label>

        <div className="relative">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Choose a username"
            {...register("username")}
            className={`w-full rounded-xl border bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition ${
              errors.username
                ? "border-red-500"
                : "border-slate-700 focus:border-blue-500"
            }`}
          />
        </div>

        {errors.username && (
          <p className="mt-2 text-sm text-red-400">
            {errors.username.message}
          </p>
        )}
      </div>

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
        placeholder="Create a password"
        registration={register("password")}
        error={errors.password?.message}
      />

      {/* Confirm Password */}

      <PasswordInput
        label="Confirm Password"
        placeholder="Re-enter your password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      {/* Error */}

      {serverError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {serverError}
        </div>
      )}

      {/* Success */}

      {successMessage && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {/* Button */}

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
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus size={20} />
            Create Account
          </>
        )}
      </button>

      {/* Login */}

      <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Login
        </Link>
      </div>
    </form>
  );
}