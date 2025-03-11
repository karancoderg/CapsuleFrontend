import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Axios interceptor for debugging outgoing requests
axios.interceptors.request.use(request => {
  console.log("Starting Request:", request);
  return request;
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // We'll initialize token as an empty string.
  const [token, setToken] = useState("");

  // Run this effect only once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
      // Set the Axios default header with the Bearer prefix
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      console.log("Token set in Axios defaults:", axios.defaults.headers.common["Authorization"]);
      // Fetch user data using the stored token
      getUser(storedToken);
    }
  }, []);

  const getUser = async (authToken) => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error("Authentication failed:", error);
      logout();
    }
  };

  const login = async (userData) => {
    try {
      console.log("Logging in with data:", userData);
      const res = await axios.post("http://localhost:5000/api/auth/login", userData, {
        headers: { "Content-Type": "application/json" },
      });
      // Check if token exists in the response
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        getUser(res.data.token);
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
      const res = await axios.post("http://localhost:5000/api/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Registration successful:", res.data);
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
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
