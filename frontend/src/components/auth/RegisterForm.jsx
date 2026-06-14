import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <Input
        label="Full Name"
        name="name"
        icon={User}
        value={formData.name}
        onChange={handleChange}
        placeholder="John Doe"
        required
        autoComplete="name"
      />

      <Input
        label="Email address"
        type="email"
        name="email"
        icon={Mail}
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <Input
        label="Phone (optional)"
        type="tel"
        name="phone"
        icon={Phone}
        value={formData.phone}
        onChange={handleChange}
        placeholder="+91 9876543210"
        autoComplete="tel"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        icon={Lock}
        value={formData.password}
        onChange={handleChange}
        placeholder="Minimum 8 characters"
        required
        autoComplete="new-password"
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        icon={Lock}
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter your password"
        required
        autoComplete="new-password"
      />

      {error && (
        <div className="auth-error" role="alert">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full !mt-1" loading={loading}>
        Create account
      </Button>
    </form>
  );
};

export default RegisterForm;
