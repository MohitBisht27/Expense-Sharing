import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";

const LoginForm = () => {
  const [email, setEmail] = useState("aisha@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <Input
        label="Email address"
        type="email"
        icon={Mail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        icon={Lock}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {error && (
        <div className="auth-error" role="alert">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full !mt-1" loading={loading}>
        Sign in to your account
      </Button>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Test Accounts</p>
        <div className="flex flex-col gap-2">
          <button 
            type="button"
            onClick={() => { setEmail("aisha@example.com"); setPassword("password123"); }}
            className="text-left text-sm p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span className="font-bold text-slate-700">Aisha</span> (Group Creator) <br/>
            <span className="text-slate-500">aisha@example.com / password123</span>
          </button>
          <button 
            type="button"
            onClick={() => { setEmail("meera@example.com"); setPassword("password123"); }}
            className="text-left text-sm p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span className="font-bold text-slate-700">Meera</span> (Moved out in March) <br/>
            <span className="text-slate-500">meera@example.com / password123</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
