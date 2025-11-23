import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import "./Navbar.css";
import logoImage from "../../assets/mentorlink-logo.png";

const Navbar = () => {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDark(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // Toggle theme
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.body.classList.toggle("dark-mode", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo" onClick={() => navigate("/home")}>
          <img src={logoImage} alt="MentorLink Logo" className="logo-image" />
        </div>

        {/* Right Side: Menu + Button + Dark Mode Toggle */}
        <div className="navbar-right">
          <div className="navbar-menu">
            <a href="#hero" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <button 
            className="get-started-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="theme-toggle-square"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;