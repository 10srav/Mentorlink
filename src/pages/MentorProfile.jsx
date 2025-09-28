import React from 'react';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import './MentorProfile.css';

const MentorProfile = () => {
  return (
    <div className="mentor-profile">
      <HomeNavbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="profile-page-container">
            <div className="placeholder-content">
              <h1>Mentor Profile</h1>
              <p>This is a placeholder for the Mentor profile page.</p>
              <div className="placeholder-features">
                <h3>Expected Features:</h3>
                <ul>
                  <li>Mentor dashboard</li>
                  <li>Student management</li>
                  <li>Session scheduling</li>
                  <li>Progress tracking</li>
                  <li>Profile settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
