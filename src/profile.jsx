import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import logo from "./assets/logos.png";
import { FaCamera, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaUsers, FaEdit, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // ✅ Add this line
import { Link } from "react-router-dom"; // ✅ Add this line




const ProfilePage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [id]);
    
    const handleLogout = () => {
      localStorage.removeItem("userToken"); // Remove authentication token
      localStorage.removeItem("userId"); // Remove user ID if stored
      navigate("/login"); // Redirect to login page
    };
  

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/profile/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      console.log("Fetched profile data:", data);
      setProfileData(data);
      setProfileImage(data.ProfileImage || "/default-avatar.png");
      // Create a deep copy of data to avoid reference issues
      setEditedData({
        ...data,
        SocialLinks: { ...data.SocialLinks },
        Skills: [...(data.Skills || [])]
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Show preview before upload
      };
      reader.readAsDataURL(file);
  
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        const response = await fetch(`http://localhost:5000/upload/${id}`, {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        if (data.image) {
          setProfileImage(data.image);
          fetchProfile(); // <-- Refetch profile to update image from backend
        } else {
          console.error("Image upload failed:", data.message);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  

  const handleEditToggle = () => {
    if (editMode) {
      // If canceling edit, reset to original data
      setEditedData({
        ...profileData,
        SocialLinks: { ...profileData.SocialLinks },
        Skills: [...(profileData.Skills || [])]
      });
    }
    setEditMode(!editMode);
    setSaveStatus(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Handle nested properties (e.g., SocialLinks.LinkedIn)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData({
        ...editedData,
        [parent]: {
          ...(editedData[parent] || {}),
          [child]: value
        }
      });
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleSkillsChange = (event) => {
    const skillsArray = event.target.value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    setEditedData({ ...editedData, Skills: skillsArray });
  };

  const handleSaveChanges = async () => {
    try {
      setSaveStatus("saving");
      console.log("Sending update data:", editedData);
      
      const response = await fetch(`http://localhost:5000/profile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);
      
      if (response.ok) {
        // Update the profile data with the response from the server
        setProfileData(responseData.updatedUser);
        // Also update the edited data to match
        setEditedData({
          ...responseData.updatedUser,
          SocialLinks: { ...responseData.updatedUser.SocialLinks },
          Skills: [...(responseData.updatedUser.Skills || [])]
        });
        setSaveStatus("success");
        setEditMode(false);
        
        // Refresh the profile to ensure we have the latest data
        setTimeout(() => {
          fetchProfile();
        }, 500);
      } else {
        console.error("Failed to update profile:", responseData.message);
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-page">
      <nav className="navbar44">
        <div className="navbar44-container">
          <div className="logo">
          <Link to="/dashboard">
            <img src={logo} alt="Logo"/>
          </Link>
            <div className="site-title">
              <h1>FISAT Forge</h1>
              <p className="subtitle">Together For Tomorrow</p>
            </div>
          </div>

          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
    

      <main className="profile-content">
        <div className="profile-container">
          <div className="edit-mode-toggle">
            <button 
              className={`edit-button ${editMode ? 'save-mode' : ''}`} 
              onClick={editMode ? handleSaveChanges : handleEditToggle}
              disabled={saveStatus === "saving"}
            >
              {editMode ? (
                saveStatus === "saving" ? "Saving..." : <><FaSave /> Save Changes</>
              ) : (
                <><FaEdit /> Edit Profile</>
              )}
            </button>
            {saveStatus === "success" && <span style={{color: "green", marginLeft: "10px"}}>Saved successfully!</span>}
            {saveStatus === "error" && <span style={{color: "red", marginLeft: "10px"}}>Save failed</span>}
          </div>

          <section className="profile-header">
            <div className="profile-image-container">
              <img src={profileImage} alt="Profile" className="profile-image" />
              {editMode && (
                <label className="image-upload-label">
                  <FaCamera />
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                </label>
              )}
            </div>
            <div className="profile-info">
              {editMode ? (
                <input 
                  type="text" 
                  name="Name" 
                  value={editedData.Name || ""} 
                  onChange={handleInputChange} 
                  className="form-control"
                  style={{ fontSize: "1.5rem", marginBottom: "10px", width: "100%", color: "white", background: "rgba(255,255,255,0.1)", padding: "5px 10px" }}
                />
              ) : (
                <h1>{profileData?.Name || "No Name Available"}</h1>
              )}
              <h3>@{profileData?.Email?.split('@')[0] || "username"}</h3>
              {editMode ? (
                <textarea 
                  name="Bio" 
                  value={editedData.Bio || ""} 
                  onChange={handleInputChange} 
                  className="form-control bio-section"
                  style={{ width: "100%", minHeight: "80px", color: "white", background: "rgba(255,255,255,0.1)", padding: "5px 10px" }}
                />
              ) : (
                <p className="bio-section">{profileData?.Bio || "Profile information not available"}</p>
              )}
              <div className="followers-count">
                <FaUsers /> {profileData?.Followers?.length || 0} Followers
              </div>
            </div>
          </section>

          <div className="profile-body">
            <div className="profile-card contact-social-card">
              <div className="card-header">
                <h2>Contact & Social</h2>
              </div>
              <div className="card-content">
                <div className="contact-info">
                  <div className="info-item">
                    <span className="info-icon"><FaEnvelope /></span>
                    <span>{profileData?.Email}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"><FaPhone /></span>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="Phone Number" 
                        value={editedData["Phone Number"] || ""} 
                        onChange={handleInputChange} 
                        className="form-control"
                      />
                    ) : (
                      <span>{profileData?.["Phone Number"]}</span>
                    )}
                  </div>
                </div>

                <div className="social-links">
                  <div className="info-item">
                    <span className="info-icon linkedin"><FaLinkedin /></span>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="SocialLinks.LinkedIn" 
                        value={editedData.SocialLinks?.LinkedIn || ""} 
                        onChange={handleInputChange} 
                        className="form-control"
                        placeholder="LinkedIn URL"
                      />
                    ) : (
                      <a href={profileData?.SocialLinks?.LinkedIn || "#"} target="_blank" rel="noopener noreferrer">
                        {profileData?.SocialLinks?.LinkedIn || "Not provided"}
                      </a>
                    )}
                  </div>

                  <div className="info-item">
                    <span className="info-icon github"><FaGithub /></span>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="SocialLinks.GitHub" 
                        value={editedData.SocialLinks?.GitHub || ""} 
                        onChange={handleInputChange} 
                        className="form-control"
                        placeholder="GitHub URL"
                      />
                    ) : (
                      <a href={profileData?.SocialLinks?.GitHub || "#"} target="_blank" rel="noopener noreferrer">
                        {profileData?.SocialLinks?.GitHub || "Not provided"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-card professional-card">
  <div className="card-header">
    <h2>Professional Details</h2>
  </div>
  <div className="card-content">
    <div className="info-row">
      <div className="info-label">Role</div>
      {editMode ? (
        <input 
          type="text" 
          name="Role" 
          value={editedData.Role || ""} 
          onChange={handleInputChange} 
          className="form-control"
        />
      ) : (
        <div className="info-value">{profileData?.Role || "Not specified"}</div>
      )}
    </div>
    
    <div className="info-row">
      <div className="info-label">Branch</div>
      {editMode ? (
        <input 
          type="text" 
          name="Branch" 
          value={editedData.Branch || ""} 
          onChange={handleInputChange} 
          className="form-control"
        />
      ) : (
        <div className="info-value">{profileData?.Branch || "Not specified"}</div>
      )}
    </div>
    
    <div className="info-row">
      <div className="info-label">Year of Graduation</div>
      {editMode ? (
        <input 
          type="number" 
          name="Year of Graduation" 
          value={editedData["Year of Graduation"] || ""} 
          onChange={handleInputChange} 
          className="form-control"
        />
      ) : (
        <div className="info-value">{profileData?.["Year of Graduation"] || "Not specified"}</div>
      )}
    </div>
    
    <div className="info-row">
      <div className="info-label">Company</div>
      {editMode ? (
        <input 
          type="text" 
          name="Company" 
          value={editedData.Company || ""} 
          onChange={handleInputChange} 
          className="form-control"
        />
      ) : (
        <div className="info-value">{profileData?.Company || "Not specified"}</div>
      )}
    </div>
  </div>
</div>
            <div className="profile-card skills-card">
              <div className="card-header">
                <h2>Skills</h2>
              </div>
              <div className="card-content">
                {editMode ? (
                  <textarea 
                    name="Skills" 
                    value={editedData.Skills?.join(", ") || ""} 
                    onChange={handleSkillsChange} 
                    className="form-control"
                    placeholder="Enter skills separated by commas"
                    style={{ width: "100%", minHeight: "80px" }}
                  />
                ) : (
                  <div className="skills-container">
                    {profileData?.Skills?.length > 0 ? 
                      profileData.Skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      )) 
                      : "No skills listed"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;