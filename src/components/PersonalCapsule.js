import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import "../style/PersonalCapsule.css";
import api from "../api/config";

const PersonalCapsule = () => {
  const { token } = useContext(AuthContext);
  const [capsuleData, setCapsuleData] = useState({
    title: "",
    description: "",
    lockDate: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [s3Status, setS3Status] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Test S3 connectivity when component mounts
  useEffect(() => {
    const testS3Connection = async () => {
      try {
        const res = await api.get("/api/capsules/test-s3");
        console.log("S3 connection test result:", res.data);
        setS3Status({ success: true, message: "S3 connection successful" });
      } catch (error) {
        console.error("S3 connection test failed:", error.response?.data || error.message);
        setS3Status({ 
          success: false, 
          message: error.response?.data?.message || "S3 connection failed" 
        });
      }
    };

    testS3Connection();
  }, []);

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
      formData.append("file", file);
      
      console.log("Uploading file:", file.name, "Type:", file.type, "Size:", file.size);
      
      const res = await api.post("/api/capsules/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("File upload response:", res.data);
      return res.data.fileUrl;
    } catch (error) {
      console.error("File upload error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "File upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // First upload the file
      const fileUrl = await uploadFile();
      if (!fileUrl) {
        setError("File upload failed");
        setIsSubmitting(false);
        return;
      }
      
      // Then create the capsule with the file URL
      const payload = {
        ...capsuleData,
        fileUrl,
        type: "personal"
      };
      
      const res = await api.post("/api/capsules", payload);
      
      console.log("Capsule creation response:", res.data); // Debugging
      alert("Personal capsule created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating personal capsule:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || "Error creating capsule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="personal-capsule-container">
      {/* Render your form here */}
    </div>
  );
};

export default PersonalCapsule;