import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import "../style/PersonalCapsule.css";

const PersonalCapsule = () => {
  const { token } = useContext(AuthContext);
  const [capsuleData, setCapsuleData] = useState({
    title: "",
    description: "",
    lockDate: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCapsuleData({ ...capsuleData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("mediaFile", file);

      const res = await axios.post("http://localhost:5000/api/capsules/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("File upload response:", res.data); // Debugging
      return res.data.fileUrl;
    } catch (error) {
      console.error("File upload error:", error.response?.data || error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Media file is required.");
      return;
    }
    try {
      let mediaUrl = "";
      if (file) {
        mediaUrl = await uploadFile();
      }

      const payload = {
        title: capsuleData.title,
        description: capsuleData.description,
        media: mediaUrl ? [{ url: mediaUrl, type: file.type }] : [],
        lockDate: capsuleData.lockDate || null,
        type: "personal",
      };

      const res = await axios.post("http://localhost:5000/api/capsules", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Capsule creation response:", res.data); // Debugging
      alert("Personal capsule created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating personal capsule:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating capsule");
    }
  };

  return (
    <div className="personal-capsule-container">
      <h2>Create Personal Capsule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={capsuleData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description or memories"
          value={capsuleData.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          name="mediaFile"
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*"
          required
        />
        <input
          type="date"
          name="lockDate"
          placeholder="Unlock Date (YYYY-MM-DD)"
          value={capsuleData.lockDate}
          onChange={handleChange}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Create Personal Capsule</button>
      </form>
    </div>
  );
};

export default PersonalCapsule;