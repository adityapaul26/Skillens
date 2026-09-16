import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user || data);
      return { success: true, data };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        error:
          err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const handelRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      await register({ username, email, password });
      try {
        const data = await getMe();
        setUser(data.user || data);
      } catch {
        setUser({ username, email });
      }
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return {
        success: false,
        error:
          err.response?.data?.message ||
          "Registration failed. Please check your details.",
      };
    } finally {
      setLoading(false);
    }
  };

  const handelLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        if (isMounted) {
          setUser(data.user || data);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAndSetUser();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading, handleLogin, handelRegister, handelLogout };
};
