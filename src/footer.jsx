import React from 'react';
import './footer.css';
import logo from "./assets/logos.png"; // Import the image from assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/team">Our Team</a></li>
            <li><a href="/mission">Mission & Vision</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><a href="/contact">mail@fisat.ac.in</a></li>
            <li><a href="https://fisat.ac.in">https://fisat.ac.in</a></li>
            <li><a href="tel:0484 - 2725272">0484 - 2725272</a></li>
            <li><a href="/location">Hormis Nagar, Mookkannoor, Angamaly, Kerala 683577</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Help & Support</h3>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/support">Support Center</a></li>
            <li><a href="/documentation">Documentation</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://www.linkedin.com/company/federal-institute-of-science-and-technology-fisat/?originalSubdomain=in" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
            </a>
            <a href="https://www.instagram.com/fisat.official/?hl=en" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
          <img src={logo} alt="Fisat Forge Logo" />
        </div>
        <p className='tit'>
          FISAT Forge
        </p>
        <p className='subtit'>
        Together for Tomorrow
        </p>
        <p className="copyright">
         © {currentYear} Fisat Forge. All Rights Reserved. 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
