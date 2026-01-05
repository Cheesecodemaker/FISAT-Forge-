import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css"; // Use dashboard styles
import logo from "./assets/logos.png"; // Import logo

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="home-page">
      {/* Navbar with Logo */}
      <nav className="navbar2">
        <div className="navbar2-container">
          <div className="logo">
            <img src={logo} alt="FISAT Forge Logo" className="logo-image" />
            <div className="site-title">
              <h1>FISAT Forge</h1>
              <p className="subtitle">Together For Tomorrow</p>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard")} className="view-allx">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Page Heading */}
      <main className="home-content">
        <div className="dashboard-container">
          <section className="welcome-section">
            <h1>📅 Event Listings</h1>
          </section>

          {/* Event Cards */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>Upcoming Events</h2>
            </div>
            <div className="card-content">
              {events.length > 0 ? (
                events.map((event) => (
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
        </div>
      </main>
    </div>
  );
};

export default EventListing;
