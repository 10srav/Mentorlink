import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';
import logo from '../assets/mentorlink-logo.png';
import { FiUser, FiMail, FiPhone, FiEdit2, FiChevronDown, FiLock } from 'react-icons/fi';
import { userAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    mobile: '',
    email: '',
    bio: '',
    gender: '',
    role: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: '#e5e7eb', score: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    // Map score to label/color
    if (score <= 1) return { label: 'Weak', color: '#ef4444', score }; // red
    if (score === 2) return { label: 'Fair', color: '#f59e0b', score }; // yellow
    return { label: 'Strong', color: '#10b981', score }; // green
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const response = await userAPI.signup(formData);
      console.log('Signup response:', response);

      // Store user ID for OTP verification
      localStorage.setItem('userId', response.userId);

      // Save email and role for OTP verification flow
      localStorage.setItem('signupEmail', formData.email);
      localStorage.setItem('signupRole', formData.role);

      // Show success and go to OTP verification
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/otp');
      }, 800);

    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <img src={logo} alt="MentorLink Logo" className="signup-logo" />
        <div className="header-actions">
          <button className="theme-toggle">🌙</button>
          <button className="signin-btn" onClick={handleSignIn}>Sign In</button>
        </div>
      </header>

      <div className="signup-container">
        <h2 className="signup-title">Tell us About you..</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name*</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Username*</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number*</label>
            <div className="input-with-icon">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="mobile"
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email*</label>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password*</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {/* Password strength indicator */}
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  height: 8,
                  background: '#e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(passwordStrength.score, 3) / 3 * 100}%`,
                    height: '100%',
                    background: passwordStrength.color,
                    transition: 'width 200ms ease',
                  }}
                />
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: passwordStrength.color }}>
                {formData.password ? `Strength: ${passwordStrength.label}` : 'Enter a password (8+ chars, uppercase, number, symbol)'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Bio*</label>
            <div className="input-with-icon">
              <FiEdit2 className="input-icon" />
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender*</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="gender-select"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <FiChevronDown className="select-arrow" />
            </div>
          </div>

          <div className="form-group">
            <label>Role*</label>
            <div className="select-wrapper">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
                required
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="organizer">Event Organizer</option>
              </select>
              <FiChevronDown className="select-arrow" />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: '#10b981',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            zIndex: 9999,
          }}
        >
          Signup successful! Check your email for OTP…
        </div>
      )}
    </div>
  );
};

export default Signup;
