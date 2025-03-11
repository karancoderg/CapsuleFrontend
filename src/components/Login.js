import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import "../style/Login.css"; // Your existing styling
import { Link } from "react-router-dom"; // Import Link for navigation

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // If user is already logged in, redirect to Dashboard
  useEffect(() => {
    if (user) {
      navigate("/"); // Adjust this route if your Dashboard is on another route
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert email to lowercase before sending
    const userData = { email: email.toLowerCase(), password };
    try {
      const data = await login(userData);
      alert("User logged in successfully");
      navigate("/"); // Redirect to Dashboard page after login
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Forgot Password Link */}
      <div className="forgot-password">
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
