import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiCalendar, FiUsers, FiSettings } from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active tab from URL
  const active = location.pathname.split('/').pop() || 'home';
  
  const handleNavigation = (path) => {
    navigate(`/${path.toLowerCase()}`);
  };
  const items = [
    { key: "home", icon: <FiHome />, label: "Home", path: "home" },
    { key: "profile", icon: <FiUser />, label: "Profile", path: "student-profile" },
    { key: "events", icon: <FiCalendar />, label: "Events", path: "events" },
    { key: "mentors", icon: <FiUsers />, label: "Mentors", path: "mentors" },
    { key: "settings", icon: <FiSettings />, label: "Settings", path: "settings" },
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar__list">
        {items.map((it) => (
          <li 
            key={it.key} 
            className={`sidebar__item ${active === it.path ? "active" : ""}`}
            onClick={() => handleNavigation(it.path)}
          >
            <span className="sidebar__icon">{it.icon}</span>
            <span className="sidebar__label">{it.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
