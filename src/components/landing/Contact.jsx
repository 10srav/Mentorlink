import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Contact.css';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.contact-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section className="contact-section" id="contact">
<div className="contact-container" style={{ padding: '0' }}>
        {/* Left Illustration */}
        <div className="contact-illustration">
          <div className={`illustration-wrapper ${isVisible ? 'animate-in' : ''}`}>
            {/* Chat Bubbles */}
            <div className="chat-bubbles">
              <div className="chat-bubble bubble-1">
                <div className="bubble-lines">
                  <div className="line"></div>
                  <div className="line short"></div>
                </div>
              </div>
              <div className="chat-bubble bubble-2">
                <div className="checkmark">✓</div>
              </div>
            </div>

            {/* Main Characters */}
            <div className="characters">
              {/* Left Character - Male */}
              <div className="character male-character">
                <div className="character-head">
                  <div className="hair male-hair"></div>
                  <div className="face">
                    <div className="eye left-eye"></div>
                    <div className="eye right-eye"></div>
                    <div className="smile"></div>
                  </div>
                </div>
                <div className="character-body male-body">
                  <div className="shirt"></div>
                  <div className="phone">
                    <div className="phone-screen"></div>
                  </div>
                </div>
              </div>

              {/* Right Character - Female */}
              <div className="character female-character">
                <div className="character-head">
                  <div className="hair female-hair"></div>
                  <div className="face">
                    <div className="eye left-eye"></div>
                    <div className="eye right-eye"></div>
                    <div className="smile"></div>
                  </div>
                </div>
                <div className="character-body female-body">
                  <div className="shirt"></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-elements">
              <div className="floating-icon icon-1">💬</div>
              <div className="floating-icon icon-2">📱</div>
              <div className="floating-icon icon-3">✉️</div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="contact-content">
          <div className={`content-wrapper ${isVisible ? 'animate-in' : ''}`}>
            <h2 className="contact-title">GET IN TOUCH</h2>
            <h3 className="contact-subtitle">Need Help? Let's Talk.</h3>
            <p className="contact-description">
              Whether you're a student, mentor, or organizer, we'd love to hear from you. 
              Reach out with questions, suggestions, or just to say hello!
            </p>
            {/* ✅ Navigate to ContactPage.jsx */}
            <button 
              className="contact-btn"
              onClick={() => navigate('/contact')}
            >
              CONTACT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
