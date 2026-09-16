import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Target,
  FileCheck,
  Compass,
} from "lucide-react";
import "../auth.form.scss";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const result = await handleLogin({ email, password });
    if (result?.success) {
      navigate("/");
    } else if (result?.error) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        {/* Left Showcase */}
        <div className="auth-page__showcase">
          <div className="auth-page__brand">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            <span className="brand-name">Skillens</span>
          </div>

          <div className="auth-page__pitch">
            <h2>
              Turn Job Requirements Into Your <span className="highlight">Unfair Advantage</span>.
            </h2>
            <p>
              Harness AI-driven interview intelligence. Match your resume against target roles, identify critical skill gaps, and practice tailored questions.
            </p>

            <div className="auth-page__features">
              <div className="feature-item">
                <div className="feature-icon-bullet">
                  <Target size={15} />
                </div>
                <div className="feature-text">
                  <strong>Precise Match Scoring:</strong> Deep semantic comparison of your background against job specs.
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-bullet">
                  <FileCheck size={15} />
                </div>
                <div className="feature-text">
                  <strong>Curated Q&amp;A:</strong> Role-specific technical &amp; behavioral scenarios with model answers.
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-bullet">
                  <Compass size={15} />
                </div>
                <div className="feature-text">
                  <strong>Preparation Roadmap:</strong> Actionable daily execution plan and customized resume PDF.
                </div>
              </div>
            </div>
          </div>

          <div className="auth-page__testimonial">
            &ldquo;Skillens eliminated the guesswork from my interview prep. The tailored roadmap was spot on.&rdquo;
          </div>
        </div>

        {/* Right Form Card */}
        <div className="auth-page__form-wrapper">
          <div className="auth-page__form-content">
            <div className="auth-page__header">
              <h1>Welcome back</h1>
              <p>Enter your account credentials to access your interview plans.</p>
            </div>

            {errorMsg && (
              <div className="alert alert--danger">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="auth-page__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Mail size={17} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="has-icon"
                    placeholder="name@work-email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Lock size={17} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="has-icon has-action"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={loading}
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-page__footer">
              <p>
                Don&apos;t have an account?{" "}
                <Link to="/register">Create an account</Link>
              </p>
              <div className="security-note">
                <ShieldCheck size={14} />
                <span>Encrypted &amp; secure session</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
