import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PersonalCapsule from "./components/PersonalCapsule"; // Capsule creation for personal capsules
import CollaborativeCapsule from "./components/CollaborativeCapsule"; // Capsule creation for collaborative capsules
import CapsuleManager from "./components/CapsuleManager"; // (Optional: list view for capsules)
import CapsuleDetail from "./components/CapsuleDetail"; // Detail view for a single capsule
import PersonalCapsuleTree from "./components/PersonalCapsuleTree"; // Tree view for personal capsules
import CollaborativeCapsuleTree from "./components/CollaborativeCapsuleTree"; // Tree view for collaborative capsules
import ForgotPassword from "./components/forgot-password"; // New Forgot Password page
import ResetPassword from "./components/reset-password/[token]"; // New Reset Password page
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-personal-capsule" element={<PersonalCapsule />} />
          <Route path="/create-collaborative-capsule" element={<CollaborativeCapsule />} />
          <Route path="/capsules" element={<CapsuleManager />} />
          <Route path="/capsules/:capsuleId" element={<CapsuleDetail />} />
          <Route path="/view-personal-capsules" element={<PersonalCapsuleTree />} />
          <Route path="/view-collaborative-capsules" element={<CollaborativeCapsuleTree />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New Route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* New Route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
