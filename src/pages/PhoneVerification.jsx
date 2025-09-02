import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhoneVerification.css';
import logo from '../assets/mentorlink-logo.png';

const PhoneVerification = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the OTP to the phone number
    // For now, we'll just navigate to the OTP page
    navigate('/otp');
  };

  return (
    <div className="verification-page">
      <div className="verification-left">
        <div className="verification-illustration">
          <p>📱 Phone Verification</p>
        </div>
        <p className="verification-caption">Secure and fast verification</p>
      </div>

      <div className="verification-right">
        <div className="verification-box">
          <img src={logo} alt="MentorLink Logo" className="verification-logo" />
          
          <h2 className="verification-title">Enter your phone number</h2>
          <p className="verification-subtitle">We'll send you a verification code</p>
          
          <div className="divider">or</div>
          
          <button 
            className="google-btn"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Use Email</span>
          </button>
          
          <div className="divider">or</div>

          <form className="verification-form" onSubmit={handleSubmit}>
            <div className="phone-input-container">
              <select 
                className="country-code-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+91">+91 IN</option>
                <option value="+1">+1 US</option>
                <option value="+44">+44 UK</option>
                <option value="+61">+61 AU</option>
              </select>
              <input
                type="tel"
                placeholder="Phone number"
                className="phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </div>

            <button type="submit" className="send-code-btn">
              Send Code
            </button>
          </form>

          <p className="verification-footer">
            By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
          
          <p className="signup-prompt">
            Don't have an account?{' '}
            <a 
              href="/signup" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
              className="signup-link"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
