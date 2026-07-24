import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Administrator Account"
      subtitle="Register to access SafeChat AI"
    >
      <RegisterForm />
    </AuthLayout>
  );
}