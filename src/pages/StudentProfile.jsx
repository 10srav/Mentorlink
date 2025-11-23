import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import SessionHistory from '../components/common/SessionHistory';
import { studentAPI, connectionAPI, userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './StudentProfile.css';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    goal: '',
    mentorshipField: [],
    experienceLevel: '',
    frequency: '',
    style: ''
  });

  // New states for requests and mentors
  const [myRequests, setMyRequests] = useState([]);
  const [myMentors, setMyMentors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Profile picture upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Reset state when navigating between different profiles
  useEffect(() => {
    setIsConnected(false);
    setIsOwnProfile(false);
    setIsEditing(false);
    setConnecting(false);
    setMyRequests([]);
    setMyMentors([]);
    setActiveTab('pending');
    setEditForm({
      goal: '',
      mentorshipField: [],
      experienceLevel: '',
      frequency: '',
      style: ''
    });
  }, [id]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);

        // If no ID in URL, fetch authenticated user's profile
        if (!id) {
          const response = await studentAPI.getProfile();
          setStudent(response.student);
          setConnectionsCount(response.student.user?.connectionsCount || 0);
          setIsOwnProfile(true);
          setEditForm({
            goal: response.student.goal || '',
            mentorshipField: response.student.mentorshipField || [],
            experienceLevel: response.student.experienceLevel || '',
            frequency: response.student.frequency || '',
            style: response.student.style || ''
          });
          setLoading(false);
          return;
        }

        // Fetch student details by ID
        const response = await studentAPI.getStudentById(id);

        if (!response || !response.student) {
          throw new Error('Student not found');
        }

        setStudent(response.student);
        setConnectionsCount(response.student.user?.connectionsCount || 0);

        // Check if this is user's own profile
        if (user && response.student.user?._id === user._id) {
          setIsOwnProfile(true);
          setEditForm({
            goal: response.student.goal || '',
            mentorshipField: response.student.mentorshipField || [],
            experienceLevel: response.student.experienceLevel || '',
            frequency: response.student.frequency || '',
            style: response.student.style || ''
          });
        } else if (isAuthenticated()) {
          // Check if already connected (only if viewing someone else's profile)
          try {
            const connectionStatus = await connectionAPI.checkConnection(response.student.user?._id);
            setIsConnected(connectionStatus.isConnected);
          } catch (error) {
            console.error('Error checking connection:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert(`Failed to load student profile: ${errorMsg}`);
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, navigate, isAuthenticated, user]);

  // Fetch student's requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!isOwnProfile) return;

      try {
        setLoadingRequests(true);
        const response = await fetch(`http://localhost:5000/api/requests/my-requests?status=${activeTab}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setMyRequests(data.requests || []);
      } catch (error) {
        console.error('Error fetching my requests:', error);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchMyRequests();
  }, [isOwnProfile, activeTab]);

  // Fetch student's mentors (accepted requests)
  useEffect(() => {
    const fetchMyMentors = async () => {
      if (!isOwnProfile) return;

      try {
        const response = await fetch(`http://localhost:5000/api/requests/my-mentors`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setMyMentors(data.mentors || []);
      } catch (error) {
        console.error('Error fetching my mentors:', error);
      }
    };

    fetchMyMentors();
  }, [isOwnProfile]);

  const handleConnect = async () => {
    if (!isAuthenticated()) {
      alert('Please login to connect with students');
      navigate('/login');
      return;
    }

    if (!student?.user?._id) return;

    const wasConnected = isConnected;
    const originalConnectionsCount = connectionsCount;

    try {
      setConnecting(true);
      setIsConnected(!wasConnected);
      setConnectionsCount(prev => wasConnected ? prev - 1 : prev + 1);

      const response = await connectionAPI.toggleConnection(student.user._id);
      setIsConnected(response.isConnected);
      setConnectionsCount(response.targetUserConnectionsCount);

    } catch (error) {
      console.error('Error toggling connection:', error);
      setIsConnected(wasConnected);
      setConnectionsCount(originalConnectionsCount);
      alert('Failed to update connection');
    } finally {
      setConnecting(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await studentAPI.updateProfile(editForm);
      setStudent({
        ...student,
        ...editForm
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      goal: student?.goal || '',
      mentorshipField: student?.mentorshipField || [],
      experienceLevel: student?.experienceLevel || '',
      frequency: student?.frequency || '',
      style: student?.style || ''
    });
    setIsEditing(false);
  };

  const handleViewRequest = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  const openHistoryModal = (mentor) => {
    setSelectedMentor(mentor);
    setShowHistoryModal(true);
  };

  const handleProfileImageClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should not exceed 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await userAPI.uploadProfilePicture(formData);

      // Update student state with new profile image
      setStudent({
        ...student,
        user: {
          ...student.user,
          profileImage: response.profileImage,
        },
      });

      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="student-profile-page">
        <HomeNavbar />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <div className="loading-spinner">Loading student profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-profile-page">
        <HomeNavbar />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <div className="error-message">Student not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-page">
      <HomeNavbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">

          {/* 1. PROFILE SECTION (Top) */}
          <div className="student-profile-container">
            <div className="profile-header-student">
              <div className="profile-photo-section">
                <div className="profile-photo-wrapper" onClick={handleProfileImageClick} style={{ cursor: isOwnProfile ? 'pointer' : 'default', position: 'relative' }}>
                  <img
                    src={student.user?.profileImage || student.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                    alt={student.user?.name || 'Student'}
                    className="profile-photo-large"
                  />
                  {isOwnProfile && (
                    <div className="photo-upload-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span>{uploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="connections-badge">
                  <div className="connections-count">{connectionsCount}</div>
                  <div className="connections-label">Connections</div>
                </div>
              </div>

              <div className="profile-info-section">
                <h1 className="student-name-large">{student.user?.name || 'Student'}</h1>

                <div className="student-meta-info">
                  <span className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {student.roleStatus || 'Student'}
                  </span>
                  <span className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {student.experienceLevel || 'Beginner'}
                  </span>
                  {student.user?.location && (
                    <span className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {student.user.location}
                    </span>
                  )}
                </div>

                {/* Edit Form or Display Mode */}
                {isOwnProfile && isEditing ? (
                  <div className="edit-form-section">
                    <h3>Edit Profile</h3>

                    <div className="form-group">
                      <label>Goal / About</label>
                      <textarea
                        value={editForm.goal}
                        onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                        placeholder="What are your learning goals?"
                        rows={4}
                        className="edit-textarea"
                      />
                    </div>

                    <div className="form-group">
                      <label>Experience Level</label>
                      <select
                        value={editForm.experienceLevel}
                        onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value })}
                        className="edit-input"
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Preferred Frequency</label>
                      <select
                        value={editForm.frequency}
                        onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                        className="edit-input"
                      >
                        <option value="">Select Frequency</option>
                        <option value="Once a week">Once a week</option>
                        <option value="Twice a month">Twice a month</option>
                        <option value="On-demand (as needed)">On-demand (as needed)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Communication Style</label>
                      <select
                        value={editForm.style}
                        onChange={(e) => setEditForm({ ...editForm, style: e.target.value })}
                        className="edit-input"
                      >
                        <option value="">Select Style</option>
                        <option value="Text">Text</option>
                        <option value="Call">Call</option>
                        <option value="Asynchronous">Asynchronous</option>
                      </select>
                    </div>

                    <div className="action-buttons">
                      <button className="cancel-btn-large" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                      <button className="save-btn-large" onClick={handleSaveProfile}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Mentorship Fields */}
                    {student.mentorshipField && student.mentorshipField.length > 0 && (
                      <div className="mentorship-fields-section">
                        <h3>Interested In</h3>
                        <div className="fields-tags-orange">
                          {student.mentorshipField.map((field, index) => (
                            <span key={index} className="field-tag-orange">{field}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Goal/Bio */}
                    {(student.goal || student.user?.about) && (
                      <div className="about-section">
                        <h3>About</h3>
                        <p className="about-text">{student.goal || student.user?.about}</p>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="action-buttons">
                      {isOwnProfile ? (
                        <button
                          className="edit-profile-btn-large"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <button
                          className={`connect-btn-large ${isConnected ? 'connected' : ''}`}
                          onClick={handleConnect}
                          disabled={connecting}
                        >
                          {connecting ? 'Loading...' : isConnected ? 'Connected' : 'Connect'}
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Additional Info */}
                <div className="additional-info-grid">
                  {student.frequency && (
                    <div className="info-card">
                      <div className="info-label">Preferred Frequency</div>
                      <div className="info-value">{student.frequency}</div>
                    </div>
                  )}
                  {student.style && (
                    <div className="info-card">
                      <div className="info-label">Communication Style</div>
                      <div className="info-value">{student.style}</div>
                    </div>
                  )}
                  {student.mentorshipTypes && student.mentorshipTypes.length > 0 && (
                    <div className="info-card full-width">
                      <div className="info-label">Looking For</div>
                      <div className="mentorship-types-list">
                        {student.mentorshipTypes.map((type, index) => (
                          <span key={index} className="mentorship-type-badge">{type}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {student.portfolio && (
                    <div className="info-card full-width">
                      <div className="info-label">Portfolio</div>
                      <a href={student.portfolio} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                        {student.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. MY REQUESTS SECTION (Only for own profile) */}
          {isOwnProfile && !id && (
            <>
              <div className="requests-section">
                <h2>My Mentorship Requests</h2>

                {/* Filter Tabs */}
                <div className="request-tabs">
                  <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accepted')}
                  >
                    Accepted
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rejected')}
                  >
                    Rejected
                  </button>
                </div>

                {/* Requests List */}
                <div className="requests-list">
                  {loadingRequests ? (
                    <div className="loading-text">Loading requests...</div>
                  ) : myRequests.length === 0 ? (
                    <div className="empty-state">
                      <p>No {activeTab} requests.</p>
                    </div>
                  ) : (
                    myRequests.map((request) => (
                      <div key={request._id} className="request-card">
                        <div className="request-header">
                          <img
                            src={request.mentor?.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                            alt={request.mentor?.user?.name}
                            className="request-avatar"
                          />
                          <div className="request-info">
                            <h3>{request.mentor?.user?.name || 'Mentor'}</h3>
                            <p className="request-role">{request.mentor?.role || 'Mentor'}</p>
                            <p className="request-date">
                              Sent on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="request-actions">
                          <button
                            className="view-btn"
                            onClick={() => handleViewRequest(request._id)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3. MY MENTORS SECTION */}
              <div className="mentoring-section">
                <h2>My Mentors</h2>
                <div className="mentees-list">
                  {myMentors.length === 0 ? (
                    <div className="empty-state">
                      <p>You don't have any mentors yet. Send connection requests to get started!</p>
                    </div>
                  ) : (
                    myMentors.map((mentor) => (
                      <div key={mentor._id} className="mentee-card">
                        <img
                          src={mentor.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                          alt={mentor.user?.name}
                          className="mentee-avatar"
                        />
                        <div className="mentee-info">
                          <h3>{mentor.user?.name}</h3>
                          <p>{mentor.role || 'Mentor'}</p>
                          <p className="mentor-experience">{mentor.primaryExperience}</p>
                        </div>
                        <div className="mentee-actions">
                          <button
                            className="action-link"
                            onClick={() => openHistoryModal(mentor)}
                          >
                            View History
                          </button>
                          <button
                            className="action-link primary"
                            onClick={() => navigate(`/mentors/${mentor._id}`)}
                          >
                            View Profile
                          </button>
                          <button
                            className="message-btn-small"
                            onClick={() => navigate(`/messages/${mentor.user?._id}`)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Message
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Session History Modal */}
      <SessionHistory
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedMentor(null);
        }}
        mentee={selectedMentor}
      />
    </div>
  );
};

export default StudentProfile;
