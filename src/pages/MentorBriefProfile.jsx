import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import { mentorAPI, requestAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './MentorBriefProfile.css';

const MentorBriefProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    currentRole: '',
    experience: '',
    objective: '',
    message: '',
    preferredMeetingTime: '',
    agreedToTerms: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [followersCount] = useState(300); // Placeholder

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const response = await mentorAPI.getMentorById(id);

        if (!response || !response.mentor) {
          throw new Error('Mentor not found');
        }

        setMentor(response.mentor);
      } catch (error) {
        console.error('Error fetching mentor:', error);
        alert('Failed to load mentor profile');
        navigate('/mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id, navigate]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert('Please login to send a connection request');
      navigate('/login');
      return;
    }

    // Validate all required fields
    if (!formData.fullName || !formData.fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      alert('Please enter your email address');
      return;
    }

    if (!formData.phone || !formData.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    if (!formData.currentRole || !formData.currentRole.trim()) {
      alert('Please enter your current role');
      return;
    }

    if (!formData.experience) {
      alert('Please select your years of experience');
      return;
    }

    if (!formData.objective || !formData.objective.trim()) {
      alert('Please describe what you hope to achieve through this mentorship');
      return;
    }

    if (!formData.preferredMeetingTime) {
      alert('Please select your preferred meeting schedule');
      return;
    }

    if (!formData.agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // Prepare request data outside try block for error logging
    const requestData = {
      message: formData.message || `I am interested in connecting with you as a mentor to discuss ${formData.objective}`,
      bio: `${formData.fullName} - ${formData.currentRole} with ${formData.experience} of experience`,
      reasonForMentorship: formData.objective,
      currentPriorities: formData.preferredMeetingTime,
      supportAreas: ['Career Growth', 'Professional Development'], // Default support areas
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedIn
      }
    };

    try {
      setSubmitting(true);

      console.log('Submitting request to mentor:', mentor.user._id);
      console.log('Request data:', requestData);
      console.log('Auth token exists:', !!localStorage.getItem('token'));

      const response = await requestAPI.submitRequest(mentor.user._id, requestData);

      console.log('Response received:', response);

      // Navigate to the connection request view page
      if (response && response.request && response.request._id) {
        navigate(`/connection-request/${response.request._id}`);
      } else {
        alert('Connection request sent successfully! The mentor will review your request.');
        setShowConnectionModal(false);
      }

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        linkedIn: '',
        currentRole: '',
        experience: '',
        objective: '',
        message: '',
        preferredMeetingTime: '',
        agreedToTerms: false,
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      console.error('Error details:', error.details);
      console.error('Request data:', requestData);

      // Show more detailed error message
      let errorMessage = 'Failed to send connection request. ';
      if (error.message) {
        errorMessage += error.message;
      } else if (error.details?.message) {
        errorMessage += error.details.message;
      } else {
        errorMessage += 'Please try again.';
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mentor-brief-profile-page">
        <HomeNavbar />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <div className="loading-spinner">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="mentor-brief-profile-page">
        <HomeNavbar />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <div className="error-message">Mentor not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-brief-profile-page">
      <HomeNavbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="single-column-container">

            {/* Profile Banner Section */}
            <div className="profile-banner-section">
              <div className="banner-background"></div>

              <div className="profile-content">
                <div className="profile-header-left">
                  <img
                    src={mentor.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                    alt={mentor.user?.name}
                    className="profile-avatar-large"
                  />

                  <div className="profile-info">
                    <h1 className="profile-name">{mentor.user?.name || 'Mentor'}</h1>
                    <p className="profile-handle">@{(mentor.user?.name || 'mentor').toLowerCase().replace(/\s+/g, '')}</p>

                    <div className="profile-role-bio">
                      <p className="role-text">
                        {mentor.role || 'Mentor'} {mentor.primaryDomain && `| ${mentor.primaryDomain}`}
                      </p>
                      <p className="bio-text">
                        {mentor.user?.bio || 'A dedicated mentor helping students and professionals grow in their careers.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="profile-actions">
                      <button
                        className="connection-btn"
                        onClick={() => setShowConnectionModal(true)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        CONNECTION
                      </button>
                      <button
                        className={`follow-btn ${isFollowing ? 'following' : ''}`}
                        onClick={handleFollowToggle}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <polyline points="17 11 19 13 23 9"></polyline>
                        </svg>
                        {followersCount} FOLLOWERS
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="profile-stats">
                      <div className="stat-item">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                          <span className="stat-value">4.8</span>
                          <span className="stat-label">Rating</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                          <span className="stat-value">{mentor.activeMentees?.length || '100'}+</span>
                          <span className="stat-label">Mentees</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">👤</div>
                        <div className="stat-content">
                          <span className="stat-value">300k</span>
                          <span className="stat-label">Followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-header-right">
                  <div className="experience-badge">
                    {mentor.primaryExperience || '18'} + years of experience
                  </div>

                  {/* Social Links */}
                  <div className="social-links">
                    {mentor.linkedin && (
                      <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    <button className="social-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </button>
                    <button className="social-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Details Section */}
            <div className="mentor-details-section">
              <h2 className="details-heading">
                {mentor.role || 'CEO & Chief Engineer'}, {mentor.primaryDomain || 'Space X'}
              </h2>

              <div className="details-description">
                <p>
                  {mentor.primaryExperience || '20'} + YEARS IN {mentor.primaryDomain?.toUpperCase() || 'AEROSPACE ENGINEERING'}, PRODUCT INNOVATION
                </p>
                <p className="mentorship-achievement">
                  MEENTORED {mentor.activeMentees?.length || '100'} + ENTREPRENUERS IN SCALING BUSSINESS, SECURING FUNDING, AND LEADERSHIP DEVELOPMENT
                </p>
              </div>

              {/* Availability and Mentoring Style Cards */}
              <div className="details-cards-grid">
                {/* Availability Card */}
                <div className="detail-card availability-card">
                  <h3>Weekly availability*</h3>
                  <div className="availability-options">
                    {mentor.weeklyAvailability && mentor.weeklyAvailability.length > 0 ? (
                      mentor.weeklyAvailability.map((avail, index) => (
                        <div key={index} className="availability-option">{avail}</div>
                      ))
                    ) : (
                      <>
                        <div className="availability-option">1-3-5-HRS</div>
                        <div className="availability-option">ON-DEMAND</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Mentoring Style Card */}
                <div className="detail-card mentoring-style-card">
                  <h3>Mentoring style</h3>
                  <div className="mentoring-options">
                    {mentor.mentoringStyle && mentor.mentoringStyle.length > 0 ? (
                      mentor.mentoringStyle.map((style, index) => (
                        <div key={index} className="mentoring-option">{style}</div>
                      ))
                    ) : (
                      <>
                        <div className="mentoring-option">Text</div>
                        <div className="mentoring-option">Call</div>
                        <div className="mentoring-option">Asynchronous</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Display */}
              {mentor.skills && mentor.skills.length > 0 && (
                <div className="skills-section">
                  <h3>Skills & Expertise</h3>
                  <div className="skills-grid">
                    {mentor.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Connection Request Modal */}
          {showConnectionModal && (
            <div className="modal-overlay" onClick={() => setShowConnectionModal(false)}>
              <div className="connection-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Send Connection Request</h2>
                  <button className="close-modal-btn" onClick={() => setShowConnectionModal(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="connection-modal-form">
                  {/* Full Name */}
                  <div className="modal-form-group">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email and Phone - Two columns */}
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>Email Address*</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="modal-form-group">
                      <label>Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* LinkedIn Profile */}
                  <div className="modal-form-group">
                    <label>LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedIn"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Current Role and Experience - Two columns */}
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>Current Role*</label>
                      <input
                        type="text"
                        name="currentRole"
                        placeholder="e.g., Software Engineer"
                        value={formData.currentRole}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="modal-form-group">
                      <label>Years of Experience*</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="0-1 years">0-1 years</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    </div>
                  </div>

                  {/* Mentorship Objective */}
                  <div className="modal-form-group">
                    <label>What do you hope to achieve through this mentorship?*</label>
                    <textarea
                      name="objective"
                      placeholder="Share your goals and what you're looking to learn..."
                      value={formData.objective}
                      onChange={handleInputChange}
                      required
                      rows={3}
                    />
                  </div>

                  {/* Additional Message */}
                  <div className="modal-form-group">
                    <label>Message to Mentor</label>
                    <textarea
                      name="message"
                      placeholder="Introduce yourself and explain why you'd like to connect with this mentor..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  {/* Preferred Meeting Time */}
                  <div className="modal-form-group">
                    <label>Preferred Meeting Schedule*</label>
                    <select
                      name="preferredMeetingTime"
                      value={formData.preferredMeetingTime}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your availability...</option>
                      <option value="Weekday Mornings">Weekday Mornings (9 AM - 12 PM)</option>
                      <option value="Weekday Afternoons">Weekday Afternoons (12 PM - 5 PM)</option>
                      <option value="Weekday Evenings">Weekday Evenings (5 PM - 9 PM)</option>
                      <option value="Weekends">Weekends (Flexible)</option>
                      <option value="Flexible">Flexible / As per mentor's availability</option>
                    </select>
                  </div>

                  {/* Terms Agreement */}
                  <div className="modal-form-group">
                    <label className="modal-checkbox-label terms-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                      />
                      <span>I agree to respect the mentor's time and commitment policy</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="cancel-modal-btn"
                      onClick={() => setShowConnectionModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-modal-btn"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending Request...' : 'Send Connection Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorBriefProfile;
