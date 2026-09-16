import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  TrendingUp,
} from "lucide-react";
import "../auth.form.scss";

const Register = () => {
  const navigate = useNavigate();
  const { loading, handelRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters long.");
      return;
    }

    const result = await handelRegister({ username, email, password });
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
              Elevate Your Prep With <span className="highlight">Intelligent AI Insights</span>.
            </h2>
            <p>
              Join software engineers, product managers, and leaders accelerating their interview preparation with customized role roadmaps.
            </p>

            <div className="auth-page__features">
              <div className="feature-item">
                <div className="feature-icon-bullet">
                  <Zap size={15} />
                </div>
                <div className="feature-text">
                  <strong>Instant Gap Analysis:</strong> Uncover missing skills before the hiring manager does.
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-bullet">
                  <TrendingUp size={15} />
                </div>
                <div className="feature-text">
                  <strong>Dynamic 7 to 14-Day Sprints:</strong> Day-by-day focus areas with actionable preparation tasks.
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-bullet">
                  <Check size={15} />
                </div>
                <div className="feature-text">
                  <strong>Targeted Resume Export:</strong> Download an AI-aligned PDF resume tailored to the exact role.
                </div>
              </div>
            </div>
          </div>

          <div className="auth-page__testimonial">
            &ldquo;Skillens helped me land my dream Senior Frontend role. The behavioral questions matched the real interview identically.&rdquo;
          </div>
        </div>

        {/* Right Form Card */}
        <div className="auth-page__form-wrapper">
          <div className="auth-page__form-content">
            <div className="auth-page__header">
              <h1>Create an account</h1>
              <p>Start engineering your interview success in under 2 minutes.</p>
            </div>

            {errorMsg && (
              <div className="alert alert--danger">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="auth-page__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <User size={17} />
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="has-icon"
                    placeholder="e.g. aditya26"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Work or Personal Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Mail size={17} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="has-icon"
                    placeholder="name@domain.com"
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
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-page__footer">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
              <div className="security-note">
                <ShieldCheck size={14} />
                <span>Your resume and data are private &amp; secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
