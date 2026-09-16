import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import CinematicLoader from "../../../components/common/CinematicLoader";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CinematicLoader
          title="Authenticating..."
          subtitle="Verifying your credentials and session."
        />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
