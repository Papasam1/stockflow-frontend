import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const { token, user } = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, restore user from token (if present)
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
      try {
        const me = await api.get("/auth/me");
        setUser(me);
      } catch (err) {
        // token invalid or expired — remove it
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, isAuthed: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
