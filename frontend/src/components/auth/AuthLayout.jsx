import { Link } from "react-router-dom";
import { Wallet, Sparkles, Shield, Zap } from "lucide-react";

const FEATURES = [
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
];

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="auth-page bg-auth-page">
      {/* Brand panel — desktop only */}
      <div className="auth-brand-panel hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 xl:px-16">
        <div className="auth-brand-blob top-20 left-10 w-72 h-72 bg-indigo-200/30 animate-float" />
        <div className="auth-brand-blob bottom-24 right-4 w-52 h-52 bg-violet-200/30 animate-pulse" />

        <div className="relative z-10 text-center max-w-md w-full animate-slide-up">
          <div className="inline-flex mb-8">
            <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-300/50">
              <Wallet className="w-10 h-10 xl:w-12 xl:h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-800 mb-4 leading-tight tracking-tight">
            Split
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
              Wise
            </span>
          </h1>

          <p className="text-base xl:text-lg text-slate-500 mb-10 font-medium leading-relaxed">
            The smartest way to track and split expenses with friends, family,
            and colleagues.
          </p>

          <div className="flex flex-col gap-3 text-left">
            {FEATURES.map(({ icon: Icon, title: featureTitle, desc }, idx) => (
              <div
                key={featureTitle}
                className="group flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3.5 border border-white/80 hover:bg-white/85 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm">{featureTitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-mobile-logo flex lg:hidden items-center gap-3 animate-slide-down">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200/60 shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Split<span className="text-indigo-500">Wise</span>
          </span>
        </div>

        <div className="auth-card animate-slide-up">
          <div className="auth-card-inner">
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1.5 tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>

            {children}

            <div className="auth-footer">
              <p className="text-sm text-slate-500 leading-relaxed">
                {footerText}{" "}
                <Link
                  to={footerLinkTo}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>

          <p className="auth-copyright">
            © {new Date().getFullYear()} SplitWise · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
