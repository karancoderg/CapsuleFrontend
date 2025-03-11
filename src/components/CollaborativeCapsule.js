import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import "../style/CollaborativeCapsule.css";

const CollaborativeCapsule = () => {
  const { token } = useContext(AuthContext);
  const [capsuleData, setCapsuleData] = useState({
    title: "",         // Group Name
    description: "",   // Description
    lockDate: ""       // Unlock date
  });
  const [memberInput, setMemberInput] = useState(""); // e.g., "John Doe <john@example.com>, Jane Doe <jane@example.com>"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCapsuleData({ ...capsuleData, [e.target.name]: e.target.value });
  };

  const handleMemberInputChange = (e) => {
    setMemberInput(e.target.value);
  };

  // Function to parse member input string into an array of objects
  const parseMemberInput = (input) => {
    return input.split(",").map((item) => {
      const trimmed = item.trim();
      const match = trimmed.match(/(.*)<(.*)>/);
      if (match) {
        return { name: match[1].trim(), email: match[2].trim() };
      } else {
        return { name: "Unknown", email: trimmed };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!memberInput.trim()) {
      setError("At least one member is required.");
      return;
    }

    try {
      const members = parseMemberInput(memberInput); // Parse the member input
      
      const payload = {
        ...capsuleData,
        memberEmails: members, // This array now contains objects with { name, email }
        type: "collaborative",
      };

      console.log("Creating collaborative capsule with payload:", payload);
      const res = await axios.post("${process.env.REACT_APP_API_URL}/api/capsules", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Collaborative capsule group created successfully!");
      navigate("/"); // Redirect to Dashboard after creation
    } catch (error) {
      console.error("Error creating collaborative capsule:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating capsule");
    }
  };

  return (
    <div className="collaborative-capsule-container">
      <h2>Create Collaborative Capsule Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Group Name"
          value={capsuleData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={capsuleData.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="date"
          name="lockDate"
          placeholder="Unlock Date (YYYY-MM-DD)"
          value={capsuleData.lockDate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="memberInput"
          placeholder="Member Details Including Creator (e.g., John Doe <john@example.com>, Jane Doe <jane@example.com>)"
          value={memberInput}
          onChange={handleMemberInputChange}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Create Collaborative Capsule</button>
      </form>
    </div>
  );
};

export default CollaborativeCapsule;
