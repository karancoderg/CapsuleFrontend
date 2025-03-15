import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/Authcontext"; // Ensure proper casing
import { Link } from "react-router-dom";
import "../style/CapsuleManager.css";
import api from "../api/config";

const CapsuleManager = () => {
  const { token } = useContext(AuthContext);
  const [capsuleData, setCapsuleData] = useState({
    title: "",
    content: "",
    lockDate: ""
  });
  const [memberEmails, setMemberEmails] = useState("");
  const [file, setFile] = useState(null);
  const [capsules, setCapsules] = useState([]);

  const handleChange = (e) => {
    setCapsuleData({ ...capsuleData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMemberEmailsChange = (e) => {
    setMemberEmails(e.target.value);
  };

  const uploadFile = async () => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await api.post("/api/capsules/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return res.data.fileUrl;
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First upload the file
      const fileUrl = await uploadFile();
      
      // Then create the capsule with the file URL
      const payload = {
        ...capsuleData,
        fileUrl,
        memberEmails: memberEmails.split(",").map(email => email.trim()).filter(email => email),
        type: "collaborative"
      };
      
      const res = await api.post("/api/capsules", payload);
      
      console.log("Capsule created:", res.data);
      // Reset form
      setCapsuleData({ title: "", content: "", lockDate: "" });
      setMemberEmails("");
      setFile(null);
      
      // Refresh capsules list
      fetchCapsules();
    } catch (error) {
      console.error("Error creating capsule:", error);
    }
  };

  const fetchCapsules = async () => {
    try {
      const res = await api.get("/api/capsules");
      setCapsules(res.data);
    } catch (error) {
      console.error("Error fetching capsules:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCapsules();
    }
  }, [token]);

  return (
    <div className="capsule-manager-container">
      <h2>Create Capsule</h2>
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
          name="content"
          placeholder="Content"
          value={capsuleData.content}
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          name="mediaFile"
          onChange={handleFileChange}
        />
        <input
          type="date"
          name="lockDate"
          placeholder="Lock Date (optional)"
          value={capsuleData.lockDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="memberEmails"
          placeholder="Member Emails (comma separated)"
          value={memberEmails}
          onChange={handleMemberEmailsChange}
        />
        <button type="submit">Create Capsule</button>
      </form>

      <h2>Your Capsules</h2>
      {capsules.length > 0 ? (
        <ul className="capsule-list">
          {capsules.map((cap) => {
            // Determine if the capsule is locked
            const isLocked = cap.lockDate && new Date(cap.lockDate) > new Date();

            return (
              <li key={cap._id}>
                <h3>
                  <Link to={`/capsules/${cap._id}`}>{cap.title}</Link>
                </h3>

                {isLocked ? (
                  <>
                    <p><strong>🔒 Locked</strong></p>
                    <p>Unlock Date: {new Date(cap.lockDate).toLocaleDateString()}</p>
                  </>
                ) : (
                  <>
                    <p>{cap.content}</p>
                    {cap.media && cap.media.length > 0 && (
                      <div>
                        <p>Media:</p>
                        {cap.media.map((url, index) => (
                          <img key={index} src={url} alt="capsule media" style={{ maxWidth: '100%' }} />
                        ))}
                      </div>
                    )}
                    {cap.lockDate && (
                      <p>Lock Date: {new Date(cap.lockDate).toLocaleDateString()}</p>
                    )}
                  </>
                )}

                {cap.members && cap.members.length > 0 && (
                  <p>Collaborators: {cap.members.length}</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No capsules created yet.</p>
      )}
    </div>
  );
};

export default CapsuleManager;
