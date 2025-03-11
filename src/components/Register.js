import { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import "../style/Register.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optionally, convert email to lowercase on the frontend too
    const userData = { name, email: email.toLowerCase(), password };
    try {
      const data = await register(userData);
      alert(data.message); // Notify user of successful registration
      navigate("/login");  // Redirect to Login page
    } catch (error) {
      // Display error message returned from backend
      alert(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
