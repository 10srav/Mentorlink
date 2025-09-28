import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <h1>Account Settings</h1>
      
      <div className="settings-container">
        <div className="settings-section">
          <h2>Profile Information</h2>
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                defaultValue="John Doe" 
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                defaultValue="john.doe@example.com" 
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea 
                className="form-control" 
                rows="4"
                defaultValue="I'm a software engineer passionate about building great products."
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="settings-section">
          <h2>Preferences</h2>
          <div className="preferences">
            <div className="preference-item">
              <div>
                <h3>Email Notifications</h3>
                <p>Receive email notifications about your account</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="preference-item">
              <div>
                <h3>Email Updates</h3>
                <p>Receive updates about new features and promotions</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="preference-item">
              <div>
                <h3>Theme</h3>
                <p>Choose between light and dark theme</p>
              </div>
              <select 
                className="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button className="btn btn-secondary">Cancel</button>
          <button 
            type="submit" 
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
