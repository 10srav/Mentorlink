import React from 'react';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import './OrganizerProfile.css';

const OrganizerProfile = () => {
  return (
    <div className="organizer-profile">
      <HomeNavbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="profile-page-container">
            <div className="placeholder-content">
              <h1>Event Organizer Profile</h1>
              <p>This is a placeholder for the Event Organizer profile page.</p>
              <p>Karthik and the team will provide the design for this page tomorrow.</p>
              <div className="placeholder-features">
                <h3>Expected Features:</h3>
                <ul>
                  <li>Event management dashboard</li>
                  <li>Event creation and editing</li>
                  <li>Attendee management</li>
                  <li>Analytics and insights</li>
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

export default OrganizerProfile;
