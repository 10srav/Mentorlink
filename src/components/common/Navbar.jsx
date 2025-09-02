import { useNavigate } from "react-router-dom";   // ✅ add this
import React, { useState } from 'react';
import './Navbar.css';
import logoImage from '../../assets/mentorlink-logo.png';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThreadPulled, setIsThreadPulled] = useState(false);
  const navigate = useNavigate();                 // ✅ add this

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleThreadPull = () => {
    setIsThreadPulled(true);
    setTimeout(() => {
      toggleDarkMode();
      setIsThreadPulled(false);
    }, 800);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src={logoImage} alt="MentorLink Logo" className="logo-image" />
        </div>

        {/* Right Side: Menu + Button + Dark Mode Toggle */}
        <div className="navbar-right">
          <div className="navbar-menu">
            <a href="#hero" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          {/* ✅ Just added onClick to navigate */}
          <button 
            className="get-started-btn typing-animation"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>

          {/* Dark Mode Thread Toggle */}
          <div
            className={`thread-toggle ${isThreadPulled ? 'pulled' : ''}`}
            onClick={handleThreadPull}
          >
            <div className="thread-line"></div>
            <div className="thread-handle">
              <span className="thread-icon">{isDarkMode ? '☀️' : '🌙'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
