import LoginForm from "../components/auth/LoginForm";
import AuthLayout from "../components/auth/AuthLayout";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Sign in to your account to continue"
      footerText="Don't have an account?"
      footerLinkText="Create one free →"
      footerLinkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
