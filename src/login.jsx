import React, { useState } from "react";
import "./login.css";
import logo from "./assets/logos.png";
import { useNavigate } from "react-router-dom"; 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    admission_no: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // ✅ Use for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.admission_no) newErrors.admission_no = "Admission Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Login successful!");
          
          // ✅ Store Student ID
          localStorage.setItem("studentId", data.studentId);

          // ✅ Redirect to dashboard
          navigate("/dashboard");  
        } else {
          alert(data.message); // Show error message
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img 
            src={logo} 
            alt="FISAT Forge Logo" 
            className="logo-imagex" 
            style={{ cursor: "pointer" }} 
            onClick={() => navigate("/")} 
          />
          <div className="login-title">
            <h1>FISAT Forge</h1>
            <p className="login-subtitle">Together For Tomorrow</p>
          </div>
        </div>

        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-description">Sign in to your FISAT Forge account</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="admission_no">Admission Number</label>
              <input
                type="text"
                id="admission_no"
                name="admission_no"
                value={formData.admission_no}
                onChange={handleChange}
                placeholder="Enter your Admission Number"
                className={errors.admission_no ? "error-input" : ""}
              />
              {errors.admission_no && <span className="error-message">{errors.admission_no}</span>}
            </div>
            
            <div className="forgot-password">
              <a href="/forgot-password">Forgot Admission Number?</a>
            </div>
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
