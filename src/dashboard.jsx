import React, { useState, useEffect } from "react";
import "./dashboard.css";
import logo from "./assets/logos.png";
import { FaSearch, FaBell, FaUser, FaCalendarAlt, FaBriefcase, FaNewspaper, FaPlus, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [latestPosts, setLatestPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [profileImage, setProfileImage] = useState(null); 
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("studentId");
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/search?query=${searchQuery}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred while searching");
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const handleSearchResultClick = (userId) => {
    navigate(`/view-profile/${userId}`); // Redirect to public profile page
};
useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/profile/${loggedInUserId}`);
      setUserRole(response.data.Role);
      setProfileImage(response.data.ProfileImage || "/default-avatar.png"); // Get profile image
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  if (loggedInUserId) {
    fetchUserProfile();
  }
}, [loggedInUserId]);

  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${loggedInUserId}`);
        setUserRole(response.data.Role);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchLatestPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setLatestPosts(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching community posts:", error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setJobs(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (loggedInUserId) {
      fetchUserProfile();
    }
    fetchLatestPosts();
    fetchJobs();
  }, [loggedInUserId]);

  const goToProfile = () => {
    if (loggedInUserId) {
      navigate(`/profile/${loggedInUserId}`);
    } else {
      alert("Student ID not found. Please log in again.");
      navigate("/login");
    }
  };

  const goToPostJob = () => {
    navigate('/post-job');
  };

  return (
    <div className="home-page">
      <nav className="navbar2">
        <div className="navbar2-container">
          <div className="logo">
            <img src={logo} alt="FISAT Forge Logo" className="logo-image" />
            <div className="site-title">
              <h1>FISAT Forge</h1>
              <p className="subtitle">Together For Tomorrow</p>
            </div>
          </div>
          <div className="nav-actions">
            <div className="search-container">
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
                 {/* Search Results Dropdown */}
                 {showSearchResults && searchResults.length > 0 && (
                  <div 
                    className="search-results-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    {searchResults.map((user) => (
                      <div 
                        key={user['Student ID']} 
                        onClick={() => handleSearchResultClick(user['Student ID'])}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        className="search-result-item"
                      >
                        <div>
                          <strong>{user.Name}</strong>
                          <p style={{ fontSize: '0.8rem', color: '#666' }}>
                            {user['Student ID']} | {user.Branch} | {user.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            <div className="nav-icons">
              <button className="icon-button notifications">
                <FaBell />
                <span className="notification-badge">3</span>
              </button>
              <button className="icon-button profile" onClick={goToProfile}>
  {profileImage && profileImage.trim() ? (
    <img 
      src={profileImage} 
      alt="User Profile" 
      className="profile-picture" 
      onError={(e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.style.display = "none"; // Hide broken image
        setProfileImage(null); // Force re-render to show fallback
      }} 
    />
  ) : (
    <FaUser className="default-avatar-icon" title="User Avatar" />
  )}
</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="home-content">
        <div className="dashboard-container">
          <section className="welcome-section">
            <h1>Welcome to FISAT Forge</h1>
            <p>Your gateway to opportunities, events, and community connections</p>
          </section>

          <div className="dashboard-grid">
          <section className="dashboard-card events-card">
  <div className="card-header">
    <h2><FaCalendarAlt /> Upcoming Events</h2>
    <div className="card-header-actions">
      <button onClick={() => navigate('/events')} className="view-allx">
        View All
      </button>
    </div>
  </div>
  <div className="card-content">
    {events.length > 0 ? (
      events.slice(0, 3).map((event) => (  // Show only first 3 events
        <div key={event._id} className="event-item">
          <div className="event-date">
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
            <span>-</span>
            <span>{new Date(event.endDate).toLocaleDateString()}</span>
          </div>
          <div className="event-details">
            <h3>{event.name}</h3>
            <p>{event.details}</p>
            <p><strong>Conducted by:</strong> {event.conductedBy}</p>
          </div>
        </div>
      ))
    ) : (
      <p>No upcoming events.</p>
    )}
  </div>
</section>


            <section className="dashboard-card jobs-card">
              <div className="card-header">
                <h2><FaBriefcase /> Job Opportunities</h2>
                <div className="card-header-actions">
                  {userRole === "Alumni" && (
                    <button onClick={goToPostJob} className="post-job-button">
                      <FaPlus /> Post Job
                    </button>
                  )}
                  <a href="/jobs" className="view-all">View All</a>
                </div>
              </div>
              <div className="card-content">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job._id} className="job-item">
                      <h3 onClick={() => navigate(`/job/${job._id}`)}>{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                      <p className="job-deadline">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                      <button className="apply-button" onClick={() => navigate(`/job/${job._id}`)}>Apply Now</button>
                    </div>
                  ))
                ) : (
                  <p>No recent job opportunities available.</p>
                )}
              </div>
            </section>

            <section className="dashboard-card community-card">
              <div className="card-header">
                <h2><FaNewspaper /> Community Posts</h2>
                <div className="card-header-actions">
                  <button onClick={() => navigate('/create-post')} className="create-post-button">
                    <FaEdit /> Create Post
                  </button>
                  <a href="/community" className="view-all">View All Posts</a>
                </div>
              </div>
              <div className="card-content">
                {latestPosts.length > 0 ? (
                  latestPosts.map((post) => (
                    <div key={post._id} className="community-post">
                      <p className="community-post-author">{post.authorName}</p>
                      <h3 className="community-post-title">{post.title}</h3>
                    </div>
                  ))
                ) : (
                  <p className="no-posts-message">No recent posts available.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
