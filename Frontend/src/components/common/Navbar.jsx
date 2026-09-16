import { Link, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Sparkles, LogOut, FileText } from "lucide-react";
import "../../styles/navbar.scss";

const Navbar = () => {
  const { user, handelLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handelLogout();
    navigate("/login");
  };

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="skillens-navbar">
      <div className="skillens-navbar__inner">
        {/* Brand */}
        <Link to="/" className="skillens-navbar__brand">
          <div className="brand-icon-wrapper">
            <Sparkles size={20} />
          </div>
          <span className="brand-title">
            Skillens <span className="brand-badge">AI</span>
          </span>
        </Link>

        {/* Right Section */}
        <div className="skillens-navbar__user-menu">
          <Link to="/" className="skillens-navbar__link">
            <FileText size={16} />
            <span>Dashboard</span>
          </Link>

          {user && (
            <div className="skillens-navbar__profile" title={user.email || displayName}>
              <div className="profile-avatar">{initial}</div>
              <span className="profile-name">{displayName}</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="skillens-navbar__logout-btn"
            title="Log out of your account"
          >
            <LogOut size={15} />
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
