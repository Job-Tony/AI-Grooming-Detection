import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
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
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Login
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label>Email</label>

          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full rounded border p-2"
          />

          <p className="text-red-600">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full rounded border p-2"
          />

          <p className="text-red-600">
            {errors.password?.message}
          </p>
        </div>

        {serverError && (
          <p className="text-center text-red-600">
            {serverError}
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}