import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailOtp.css';
import logoImage from '../assets/mentorlink-logo.png';

const EmailOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleContinue = () => {
    // Add your OTP verification logic here
    console.log('OTP Entered:', otp.join(''));
    // navigate('/some-next-page');
  };

  const handleResend = () => {
    setTimer(30);
    // Add your resend OTP logic here
  };

  return (
    <div className="otp-container">
      <div className="otp-left-panel"></div>
      <div className="otp-right-panel">
        <div className="otp-form-container">
          <img src={logoImage} alt="MentorLink Logo" className="otp-logo" />
          <h2 className="otp-title">Verify Email</h2>
          <p className="otp-subtitle">A verification code has been sent to your entered mail</p>
          <p className="otp-enter-code">Enter the code below:</p>
          <div className="otp-input-fields">
            {otp.map((data, index) => {
              return (
                <input
                  className="otp-input"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                  ref={el => (inputRefs.current[index] = el)}
                />
              );
            })}
          </div>
          <div className="otp-resend-container">
            <p>Didn't you receive the OTP? <span className="otp-resend-link" onClick={handleResend}>Resend OTP</span></p>
            <p className="otp-timer">{`00:${timer.toString().padStart(2, '0')}`}</p>
          </div>
          <button className="otp-continue-button" onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default EmailOtp;
