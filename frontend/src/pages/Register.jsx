import RegisterForm from "../components/auth/RegisterForm";
import AuthLayout from "../components/auth/AuthLayout";

const Register = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SplitWise and start tracking expenses"
      footerText="Already have an account?"
      footerLinkText="Sign in →"
      footerLinkTo="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
