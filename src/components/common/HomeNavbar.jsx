import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/mentorlink-logo.png";
import "./HomeNavbar.css";

const HomeNavbar = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [dark, setDark] = useState(false);
  const [isThreadPulled, setIsThreadPulled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Initialize from saved preference
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // Fetch profile image for students
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.role === 'student') {
        try {
          const { studentAPI } = await import('../../services/api');
          const response = await studentAPI.getProfile();
          if (response.student?.profileImage) {
            setProfileImage(response.student.profileImage);
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };

    fetchProfileImage();
  }, [user?.role]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.body.classList.toggle("dark-mode", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleThreadPull = () => {
    setIsThreadPulled(true);
    setTimeout(() => {
      toggleDark();
      setIsThreadPulled(false);
    }, 800);
  };

  const logout = () => {
    authLogout();
    navigate("/login");
  };

  const goHome = () => navigate("/home");
  const onProfileClick = () => {
    // Route to appropriate profile based on user role
    if (user?.role === 'student') {
      navigate('/student-profile');
    } else if (user?.role === 'organizer') {
      navigate('/organizer-profile');
    } else if (user?.role === 'mentor') {
      navigate('/mentor-profile');
    } else {
      navigate('/home');
    }
  };

  return (
    <header className="home-navbar">
      <div className="home-navbar__inner">
        <div className="brand" onClick={goHome} role="button" tabIndex={0}>
          <img src={logo} alt="MentorLink" className="brand__logo" />
          <span className="brand__name">MentorLink</span>
        </div>

        <nav className="actions">
          <div className="nav-actions-left">
            <button className="icon-btn" onClick={() => setShowNotifications(s => !s)} aria-label="Notifications">
              <FiBell size={18} />
              <span className="notif-dot" />
            </button>
            {showNotifications && (
              <div className="notif-popup" onBlur={() => setShowNotifications(false)} tabIndex={0}>
                <div className="notif-header">Notifications</div>
                <div className="notif-item">No new notifications</div>
              </div>
            )}
          </div>

          <button className="btn btn--ghost" onClick={logout}>
            <FiLogOut size={18} />
            <span>Log out</span>
          </button>

          <button className="icon-btn theme-toggle" onClick={toggleDark} aria-label="Toggle theme">
            {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          <div
            className={`thread-toggle ${isThreadPulled ? 'pulled' : ''}`}
            onClick={handleThreadPull}
            role="button"
            tabIndex={0}
          >
            <div className="thread-line"></div>
            <div className="thread-handle">
              <span className="thread-icon">{dark ? '☀️' : '🌙'}</span>
            </div>
          </div>

          <button className="avatar" onClick={onProfileClick} aria-label="Open profile">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }} 
              />
            ) : (
              <span role="img" aria-label="user">🧑</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default HomeNavbar;
