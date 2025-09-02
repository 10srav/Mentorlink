import React from 'react';
import './Footer.css';
import logoImage from '../../assets/mentorlink-logo.png';
import { FaHeart } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

// Make sure Font Awesome is installed: npm install @fortawesome/fontawesome-free
// and imported in index.js or public/index.html -> 
// import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logoImage} alt="MentorLink Logo" className="footer-logo-image" />
            <span className="footer-logo-text">MentorLink</span>
          </div>
          <p className="footer-description">
            Bridging the gap between learners and leaders.<br />
            Crafted and built with ❤️ by team KHUB
          </p>

          {/* Social Media Icons */}
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>

          {/* CTA */}
          <div className="footer-cta">
            <p className="cta-text">Let’s do it! —</p>
            <button className="get-started-footer-btn">Get Started</button>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-links">
          <div className="footer-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="footer-link-list">
              <li><a href="#" className="footer-link">About us</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Partnership</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Product</h3>
            <ul className="footer-link-list">
              <li><a href="#" className="footer-link">Find a mentor</a></li>
              <li><a href="#" className="footer-link">Become a mentor</a></li>
              <li><a href="#" className="footer-link">AI Design Masterclass</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Support</h3>
            <ul className="footer-link-list">
              <li><a href="#" className="footer-link">FAQs</a></li>
              <li><a href="#" className="footer-link">Help center</a></li>
              <li><a href="#" className="footer-link">Terms of service</a></li>
              <li><a href="#" className="footer-link">Privacy policy</a></li>
              <li><a href="#" className="footer-link">Site map</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MentorLink. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
