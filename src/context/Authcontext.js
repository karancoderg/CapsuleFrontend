import { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../api/config";

const AuthContext = createContext();

// Axios interceptor for debugging outgoing requests
api.interceptors.request.use(request => {
  console.log("Starting Request:", request);
  return request;
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // We'll initialize token as an empty string.
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Run this effect only once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
      // Set the auth token in our API config
      setAuthToken(storedToken);
      console.log("Token set in API config");
      // Fetch user data using the stored token
      getUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const getUser = async (authToken) => {
    try {
      setLoading(true);
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Authentication failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Function to set user and token (used for automatic login after registration)
  const setUserAndToken = (userData, authToken) => {
    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setAuthToken(authToken);
      setUser(userData);
    }
  };

  const login = async (userData) => {
    try {
      console.log("Logging in with data:", userData);
      const res = await api.post("/api/auth/login", userData, {
        headers: { "Content-Type": "application/json" },
      });
      // Check if token exists in the response
      if (res.data.token) {
        const { token, user } = res.data;
        setUserAndToken(user, token);
        return res.data;
      } else {
        throw new Error("No token returned from login.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log("Registering user with data:", userData);
      const res = await api.post("/api/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Registration initiated:", res.data);
      return res.data;
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      token, 
      loading,
      setUserAndToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
