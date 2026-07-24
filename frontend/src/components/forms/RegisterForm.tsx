import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/context/AuthContext";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
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

      setSuccessMessage("Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setServerError("Registration failed. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Create Account
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label>Username</label>
          <input
            {...register("username")}
            className="mt-1 w-full rounded border p-2"
          />
          <p className="text-red-600">{errors.username?.message}</p>
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded border p-2"
          />
          <p className="text-red-600">{errors.email?.message}</p>
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full rounded border p-2"
          />
          <p className="text-red-600">{errors.password?.message}</p>
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="mt-1 w-full rounded border p-2"
          />
          <p className="text-red-600">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {serverError && (
          <p className="text-center text-red-600">{serverError}</p>
        )}

        {successMessage && (
          <p className="text-center text-green-600">
            {successMessage}
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
        >
          {isSubmitting ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}