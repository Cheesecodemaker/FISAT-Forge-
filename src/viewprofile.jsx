import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./viewprofile.css";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaUniversity, FaBriefcase, FaUsers } from "react-icons/fa";
import logo from "./assets/logos.png";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";



const ViewProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [isFollowing, setIsFollowing] = useState(false);
  const loggedInUserId = localStorage.getItem("studentId");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/profile/${id}`)
      .then((res) => {
        setProfileData(res.data);
        setProfileImage(res.data.ProfileImage || "/default-avatar.png");
        setIsFollowing(res.data.Followers?.includes(loggedInUserId));
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [id, loggedInUserId]);

  const handleFollowUnfollow = async () => {
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.post(`http://localhost:5000/${endpoint}`, {
        userId: loggedInUserId,
        targetId: id,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };
  const handleSendMessage = async () => {
    const message = prompt("Enter your message:");
    if (!message) return;
  
    try {
      const response = await axios.post("http://localhost:5000/send-message", {
        senderId: loggedInUserId,
        recipientId: id,
        message,
      });
  
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };
  
  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div className="profile-pagex">
      <nav className="navbar1x">
        <div className="navbar1-containerx">
          <div className="logox">
          <img 
              src={logo} 
              alt="FISAT Forge Logo" 
              className="logo-imagex" 
              style={{ cursor: "pointer" }} 
              onClick={() => navigate("/dashboard")} 
          />

            <div className="site-titlex">
              <h1>FISAT Forge</h1>
              <p className="subtitlex">Together For Tomorrow</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="profile-contentx">
        <div className="profile-containerx">
          <section className="profile-headerx">
          <div className="profile-image-containerx">
  {profileImage && profileImage !== "/default-avatar.png" ? (
    <img src={profileImage} alt="Profile" className="profile-imagex" />
  ) : (
    <FaUserCircle size={160} color="#003366" />
  )}
</div>
            <div className="profile-infox">
              <h1>{profileData?.Name || "No Name Available"}</h1>
              <h3>@{profileData?.Email?.split('@')[0] || "username"}</h3>
              <p className="biox">{profileData?.Bio || "Profile information not available"}</p>
              <div className="followers-countx">
                <FaUsers /> {profileData?.Followers?.length || 0} Followers
              </div>
            </div>
            <button onClick={handleFollowUnfollow} className="follow-btnx">
  {isFollowing ? "Unfollow" : "Follow"}
</button>

{isFollowing && (
  <button
    onClick={() => navigate(`/chat/${loggedInUserId}/${id}`)}
    className="message-btnx"
  >
    Chat
  </button>
)}


          </section>

          <section className="profile-cardx contact-social-cardx">
            <h2>Contact & Social</h2>
            <p><FaEnvelope /> {profileData?.Email || "No Email"}</p>
            <p><FaPhone /> {profileData?.["Phone Number"] || "No Phone Number"}</p>
            <p><FaLinkedin /> <a href={profileData?.SocialLinks?.LinkedIn || "#"}>LinkedIn</a></p>
            <p><FaGithub /> <a href={profileData?.SocialLinks?.GitHub || "#"}>GitHub</a></p>
          </section>

          <section className="profile-cardx professional-cardx">
            <h2>Professional Details</h2>
            <p><FaBriefcase /> {profileData?.Role || "Student"}</p>
            <p><FaUniversity /> {profileData?.Branch || "Institution Not Available"}</p>
            <p>Graduation Year: {profileData?.["Year of Graduation"] || "N/A"}</p>
          </section>

          <section className="profile-cardx skills-cardx">
            <h2>Skills</h2>
            <div className="skills-containerx">
              {profileData?.Skills?.length > 0 ? (
                profileData.Skills.map((skill, index) => (
                  <span key={index} className="skill-tagx">{skill}</span>
                ))
              ) : (
                <p>No skills added.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ViewProfile;
