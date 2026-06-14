import { Link } from "react-router-dom";
import { Wallet, Sparkles, Shield, Zap } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="bg-auth-page min-h-screen flex">
      {/* ── Left Brand Panel (lg+) ────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
        style={{ width: '50%', padding: '3rem' }}
      >
        {/* Decorative blobs - animated */}
        <div
          className="absolute animate-float"
          style={{
            top: '5rem', left: '2.5rem', width: '18rem', height: '18rem',
            background: 'rgba(199, 210, 254, 0.3)', borderRadius: '50%',
            filter: 'blur(64px)', pointerEvents: 'none',
          }}
        />
        <div
          className="absolute animate-pulse"
          style={{
            bottom: '6rem', right: '1rem', width: '13rem', height: '13rem',
            background: 'rgba(221, 214, 254, 0.3)', borderRadius: '50%',
            filter: 'blur(64px)', pointerEvents: 'none',
          }}
        />

        <div className="relative animate-slide-up" style={{ zIndex: 1, textAlign: 'center', maxWidth: '28rem', width: '100%' }}>
          <div className="animate-float" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
            <div
              style={{
                width: '5rem', height: '5rem', borderRadius: '1.5rem',
                background: 'linear-gradient(to bottom right, #6366f1, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5)',
                transition: 'transform 0.3s',
              }}
            >
              <Wallet style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', lineHeight: 1.2, letterSpacing: '-0.025em' }}>
            Split<span style={{ color: 'transparent', backgroundImage: 'linear-gradient(to right, #6366f1, #7c3aed)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Wise</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2.5rem', fontWeight: 500, lineHeight: 1.625 }}>
            The smartest way to track and split expenses with friends, family,
            and colleagues.
          </p>
          <div className="flex flex-col gap-3" style={{ textAlign: 'left' }}>
            {[
              {
                icon: Sparkles,
                title: "Effortless Splitting",
                desc: "Split equally, by shares, or exact amounts",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is always encrypted",
              },
              {
                icon: Zap,
                title: "Instant Settlements",
                desc: "Track and settle debts in real-time",
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className="animate-slide-up"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(4px)',
                  borderRadius: '1rem', padding: '0.875rem',
                  border: '1px solid rgba(255,255,255,0.7)',
                  transition: 'all 0.3s',
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div
                  style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem',
                    background: 'linear-gradient(to bottom right, #eef2ff, #ede9fe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: '1rem', height: '1rem', color: '#4f46e5' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>{title}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Mobile logo — visible below lg */}
        <style>{`
          @media (max-width: 1023px) {
            .mobile-logo-login { display: flex !important; }
          }
        `}</style>
        <div className="mobile-logo-login items-center gap-3 mb-8 animate-slide-down" style={{ display: 'none' }}>
          <div
            style={{
              width: '2.75rem', height: '2.75rem', borderRadius: '1rem',
              background: 'linear-gradient(to bottom right, #6366f1, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            }}
            className="animate-float"
          >
            <Wallet style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.025em' }}>
            Split<span style={{ color: '#6366f1' }}>Wise</span>
          </span>
        </div>

        {/* Card */}
        <div className="w-full animate-slide-up" style={{ maxWidth: '28rem' }}>
          <div className="card-elevated rounded-2xl card-interactive" style={{ padding: '1.5rem 2rem' }}>
            <div className="mb-7">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                Welcome back 👋
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Sign in to your account to continue
              </p>
            </div>
            <LoginForm />
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  style={{ color: '#4f46e5', fontWeight: 600, transition: 'color 0.2s' }}
                >
                  Create one free →
                </Link>
              </p>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.25rem', fontWeight: 500 }}>
            © 2026 SplitWise · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
