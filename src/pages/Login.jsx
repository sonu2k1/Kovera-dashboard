import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { KoveraLogo } from "@/components/common/KoveraLogo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to dashboard (or intended page)
  const from = location.state?.from || "/dashboard";
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Full-screen Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/login-bg.png"
          alt="Modern luxury house at twilight"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-950/80 to-navy-900/70" />
        {/* Extra vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,14,26,0.7)_100%)]" />
      </div>

      {/* ── Ambient Glow Effects ── */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/4 rounded-full blur-[80px]" />
      </div>

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-[440px] mx-4 animate-slide-up">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-5 shadow-lg shadow-primary/30 ring-1 ring-white/10">
            <KoveraLogo size={32} color="#ffffff" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome to <span className="text-gradient">Kovera</span> Admin
          </h1>
          <p className="text-muted mt-2 text-sm">
            Sign in to manage your real estate dashboard
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-navy-900/60 backdrop-blur-2xl border border-white/[0.08] p-8 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/20 animate-scale-in">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-danger/15 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-danger"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-danger-light">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-white/80"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@kovera.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-navy-950/60 border border-white/[0.08] text-sm text-white placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)] hover:border-white/[0.15]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-white/80"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-12 rounded-xl bg-navy-950/60 border border-white/[0.08] text-sm text-white placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)] hover:border-white/[0.15]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded border border-white/[0.15] bg-navy-950/60 peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-muted group-hover:text-white/80 transition-colors select-none">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary/80 hover:text-primary transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold"
              loading={loading}
              disabled={loading}
            >
              {!loading && (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
              {loading && "Signing in..."}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-navy-900/60 text-muted-foreground">
                Secure enterprise login
              </span>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-5 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5 text-primary/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5 text-primary/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5 text-primary/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          © 2026 Kovera. All rights reserved.
        </p>
      </div>
    </div>
  );
}
