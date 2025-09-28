import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import MentorCard from '../components/home/MentorCard';
import { studentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './StudentProfile.css';

// --- SVG Icons ---
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const MentorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <polyline points="17 11 19 13 23 9"></polyline>
    </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="linkedin-icon">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

// --- Mock Data ---
const userProfile = {
    name: 'Bhavani Shankar',
    title: 'Btech@3rd year student AimI',
    bio: 'I\'m Actively interested in getting mentorship to boost my career into advance ai and automations',
    speaks: 'Speaks English and Telugu',
    frequency: 'Connects once in a week',
    style: 'Preferred mentorship style call',
    connections: 847,
    profilePicture: 'https://placehold.co/150x150/E0E0E0/333?text=BS',
};

const skills = [
    'Operations', 'Program Management', 'Interview', 'AI', 'Automation'
];

const connectionRequests = [
    { id: 1, name: 'JOHN DOE', role: 'Founder @Tesla | CEO @SpaceX', status: 'Accepted', message: 'John Doe has accepted your request! You can now schedule your first session.', time: '< 1 day ago', avatar: 'https://placehold.co/50x50/EEE/333?text=JD' },
    { id: 2, name: 'Jane Smith', role: 'Founder @OPEN AI| CEO @CHAT GPT', status: 'Rejected', message: 'Jane Smith has declined your connection request', time: '3 days ago', avatar: 'https://placehold.co/50x50/DDD/333?text=JS' },
    { id: 3, name: 'Michael Lee', role: 'Founder @OPEN AI| CEO @CHAT GPT', status: 'Pending', message: 'Awaiting response from Michael Lee', time: '3 days ago', avatar: 'https://placehold.co/50x50/CCC/333?text=ML' },
    { id: 4, name: 'Emily White', role: 'Lead Engineer @Google', status: 'Accepted', message: 'Emily White has accepted your request! You can now schedule your first session.', time: '5 days ago', avatar: 'https://placehold.co/50x50/BBB/333?text=EW' },
];

// Mock data for mentors
const mockMentors = [
  {
    id: 1,
    name: 'Vivek Sridhar',
    verified: true,
    title: 'CTO - Microsoft For Startups',
    company: 'Microsoft',
    experience: 18,
    sessions: 10,
    rating: 4.5,
    avatar: 'https://i.pravatar.cc/100?img=12',
    bio: 'Vivek is a technophile and an Open Source contributor with 18+ years in software industry. Worked at Microsoft as CTO-Microsoft for startups.',
    skills: ['Javascript','Flutter','Node JS','React','Python','React Native','DevOps','Cloud','Leadership'],
    coreDomain: 'Interview Preparation',
    domains: ['Tech Mentor','Startup Mentor'],
  },
  {
    id: 2,
    name: 'Priyanka Taneja',
    verified: true,
    title: 'CTO - Microsoft For Startups',
    company: 'Microsoft',
    experience: 15,
    sessions: 9,
    rating: 4.0,
    avatar: 'https://i.pravatar.cc/100?img=32',
    bio: 'Priyanka is an Open Source contributor with 15+ years of experience and has worked at Microsoft in previous roles.',
    skills: ['Javascript','Kotlin','Node JS','React','Python','React Native'],
    coreDomain: 'System Design',
    domains: ['Professor in experiences','UI/UX Developer'],
  },
  {
    id: 3,
    name: 'Rahul Verma',
    verified: false,
    title: 'Senior Engineer',
    company: 'Google',
    experience: 10,
    sessions: 20,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/100?img=5',
    bio: 'Rahul specializes in scalable systems, cloud architecture and interview coaching.',
    skills: ['Golang','System Design','Kubernetes','GCP','React'],
    coreDomain: 'Backend Architecture',
    domains: ['Tech Mentor'],
  },
];

const StudentProfile = () => {
    const { user } = useAuth();
    const [mentors] = useState(mockMentors);
    const [activeTab, setActiveTab] = useState('Accepted');
    const [showMoreSkills, setShowMoreSkills] = useState(false);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Fetch student profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await studentAPI.getProfile();
                setStudentProfile(response.student);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await studentAPI.uploadImage(formData);
            setStudentProfile(prev => ({
                ...prev,
                profileImage: response.student.profileImage
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const filteredConnections = connectionRequests.filter(
        (request) => request.status === activeTab
    );

    const displayedSkills = showMoreSkills ? skills : skills.slice(0, 3);

    if (loading) {
        return (
            <div className="student-profile">
                <HomeNavbar />
                <div className="app-container">
                    <Sidebar />
                    <div className="main-content">
                        <div className="profile-page-container">
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                Loading profile...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="student-profile">
        <HomeNavbar />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <div className="profile-page-container">
              <header className="profile-header">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                        <LinkedInIcon />
                    </a>
                </header>

                <main className="profile-main-content">
                    <div className="profile-top">
                        <div className="left">
                            <div className="profile-picture-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="profile-image-upload"
                                    disabled={uploading}
                                />
                                <label htmlFor="profile-image-upload" style={{ cursor: 'pointer' }}>
                                    <img 
                                        src={studentProfile?.profileImage || userProfile.profilePicture} 
                                        alt={studentProfile?.user?.name || userProfile.name}
                                        className="profile-picture"
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/E0E0E0/333?text=Error'; }}
                                        style={{ opacity: uploading ? 0.7 : 1 }}
                                    />
                                    {uploading && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            Uploading...
                                        </div>
                                    )}
                                </label>
                            </div>

                            <div className="user-info-section">
                                <h1>{studentProfile?.user?.name || userProfile.name}</h1>
                                <p className="user-title">{studentProfile?.user?.email || userProfile.title}</p>
                                <p className="user-bio">{studentProfile?.user?.bio || userProfile.bio}</p>
                                <div className="user-meta">
                                    <span>{userProfile.speaks}</span>
                                    <span>{studentProfile?.frequency || userProfile.frequency}</span>
                                    <span>{studentProfile?.style || userProfile.style}</span>
                                </div>
                            </div>
                        </div>

                        <div className="right">
                            <div className="skills-section">
                                <h2>Skills</h2>
                                <div className="skills-list">
                                    {(studentProfile?.mentorshipField || displayedSkills).map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                                {(studentProfile?.mentorshipField || skills).length > 3 && !showMoreSkills && (
                                    <button 
                                        className="skills-more"
                                        onClick={() => setShowMoreSkills(true)}
                                    >
                                        +{(studentProfile?.mentorshipField || skills).length - 3} more
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions-section">
                        <div className="actions-row">
                            <div className="connections-box">
                                <span className="connections-count">{userProfile.connections}</span>
                                <span>Connections</span>
                            </div>
                            <div className="action-buttons">
                                <button className="btn btn-primary">
                                    <EditIcon />
                                    Edit Profile
                                </button>
                                <button className="btn btn-secondary">
                                    <MentorIcon />
                                    Become a Mentor
                                </button>
                            </div>
                        </div>
                    </div>

                    <section className="connection-requests-section">
                        <h2>Connection Requests</h2>
                        <nav className="tabs">
                            <button 
                                className={`tab-item ${activeTab === 'Accepted' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Accepted')}
                            >
                                Accepted
                            </button>
                            <button 
                                className={`tab-item ${activeTab === 'Rejected' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Rejected')}
                            >
                                Rejected
                            </button>
                            <button 
                                className={`tab-item ${activeTab === 'Pending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Pending')}
                            >
                                Pending
                            </button>
                        </nav>
                        
                        <div className="connection-list">
                            {filteredConnections.length > 0 ? (
                                filteredConnections.map(request => (
                                    <div key={request.id} className="connection-item">
                                        <img 
                                            src={request.avatar} 
                                            alt={request.name}
                                            className="connection-avatar"
                                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/50x50/E0E0E0/333?text=Err'; }}
                                        />
                                        <div className="connection-details">
                                            <p className="connection-name-role">
                                                <strong>{request.name}</strong>
                                                <span>{request.role}</span>
                                            </p>
                                            <p className="connection-message">{request.message}</p>
                                        </div>
                                        <span className={`connection-status ${request.status.toLowerCase()}`}>
                                            {request.status}
                                        </span>
                                        <span className="connection-time">{request.time}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-connections">No {activeTab.toLowerCase()} connections.</p>
                            )}
                        </div>
                    </section>
                    {/* Add Mentor Cards Section */}
              <section className="mentors-section">
                <h2>Recommended Mentors</h2>
                <div className="mentors-grid">
                  {mentors.slice(0, 3).map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;