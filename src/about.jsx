import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-containerh">
      {/* Hero Section */}
      <section className="about-heroh">
        <div className="about-hero-contenth">
          <h1>About FISAT Forge</h1>
          <p>Bridging the Gap Between Students and Alumni</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-sectionh">
        <h2 className="section-titleh">Our Mission</h2>
        <div className="about-contenth">
          <p>
            FISAT Forge is a centralized platform designed to foster meaningful connections between the students and alumni of Federal Institute of Science and Technology (FISAT). Our mission is to create a vibrant community where knowledge sharing, mentorship, and professional growth can flourish.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-sectionh">
        <h2 className="section-titleh">Our Vision</h2>
        <div className="about-contenth">
          <p>At FISAT Forge, we envision a strong, interconnected community where:</p>
          <ul className="vision-listh">
            <li>Current students benefit from the wisdom and experience of those who came before them</li>
            <li>Alumni remain engaged with their alma mater and contribute to its growth</li>
            <li>Mentorship opportunities abound, creating pathways for professional development</li>
            <li>A rich ecosystem of knowledge sharing and career advancement exists for all members</li>
          </ul>
        </div>
      </section>

      {/* Why Section */}
      <section className="about-sectionh">
        <h3 className="section-titleh">Why FISAT Forge?</h3>
        <div className="about-contenth">
          <p>
            Traditional methods of connecting students and alumni—such as occasional alumni meets or informal social media groups—are inadequate for fostering continuous engagement. FISAT Forge addresses this gap by providing a purpose-built platform that serves as a bridge between the college's past, present, and future communities.
          </p>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="about-sectionh">
        <h2 className="section-titleh">What We Offer</h2>
        <div className="offerings-gridh">
          <div className="offering-cardh">
            <h3>For Students</h3>
            <ul>
              <li>Connect with alumni working in your field of interest</li>
              <li>Discover internship and job opportunities</li>
              <li>Gain valuable insights through discussion forums</li>
              <li>Showcase your skills and achievements</li>
              <li>Receive mentorship from industry professionals</li>
            </ul>
          </div>
          <div className="offering-cardh">
            <h3>For Alumni</h3>
            <ul>
              <li>Stay connected with your alma mater</li>
              <li>Share your professional journey and achievements</li>
              <li>Mentor the next generation of professionals</li>
              <li>Post job and internship opportunities</li>
              <li>Engage in knowledge sharing and networking</li>
            </ul>
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section className="team-sectionh">
        <div className="about-sectionh">
          <h2 className="section-titleh">The Team Behind FISAT Forge</h2>
          <div className="team-gridh">
            <div className="team-memberh">
              <h3>Gayathri M A</h3>
              <p>FIT22CS080</p>
            </div>
            <div className="team-memberh">
              <h3>Muhammad Rafi V A</h3>
              <p>FIT22CS129</p>
            </div>
            <div className="team-memberh">
              <h3>John Antony</h3>
              <p>FIT22CS103</p>
            </div>
            <div className="team-memberh">
              <h3>Joseph Hadlee</h3>
              <p>FIT22CS106</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="join-sectionh">
        <div className="join-contenth">
          <h2>Join Our Community</h2>
          <p>
            Whether you're a current student seeking guidance or an alumnus looking to give back, FISAT Forge welcomes you to be part of our growing network. Together, we can build a stronger, more connected FISAT community that benefits everyone.
          </p>
          <a href="/login" className="join-buttonh">Sign In Now</a>
          <p className="taglineh">FISAT Forge: Connecting the Past, Present, and Future of FISAT</p>
        </div>
      </section>
    </div>
  );
};

export default About;