import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access the AI Moderation Dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
}