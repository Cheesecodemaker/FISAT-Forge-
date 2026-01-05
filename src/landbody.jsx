import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./landbody.css";

const MainContent = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate function

  // Scroll Left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll Right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <main className="main-content">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Connect, Collaborate, and Grow Together</h1>
            <p>Join FISAT's exclusive platform connecting students with alumni for mentorship, opportunities, and professional growth.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Platform Features</h2>

          <button className="scroll-button left" onClick={scrollLeft}>❮</button>

          <div className="features-grid" ref={scrollContainerRef}>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Networking</h3>
              <p>Connect with alumni and students, build professional relationships, and expand your network within the FISAT community.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Knowledge Sharing</h3>
              <p>Access valuable insights, participate in discussions, and learn from experienced professionals in your field.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Opportunity Hub</h3>
              <p>Discover internships, job openings, and career opportunities shared exclusively by FISAT alumni.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Achievement Showcase</h3>
              <p>Celebrate success stories and get inspired by the accomplishments of FISAT alumni.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💭</div>
              <h3>Discussion Forums</h3>
              <p>Engage in meaningful discussions about career paths, industry trends, and professional development.</p>
            </div>
          </div>

          <button className="scroll-button right" onClick={scrollRight}>❯</button>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Join FISAT Forge?</h2>
          <p>Create your account today and become part of our growing community.</p>
          <div className="cta-buttons">
            <button className="primary-button" onClick={() => navigate("/login")}>Sign In Now</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
