import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/mentorlink-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/otp");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Illustration Section */}
          <div className="illustration-section">
            <div className="image-placeholder">
              <p>🚀 Animation / Illustration here</p>
            </div>
            <p className="login-caption">Where Guidance meets Opportunity</p>
          </div>

          {/* Login Form Section */}
          <div className="form-section">
            <img src={logo} alt="MentorLink Logo" className="login-logo" />
            <h2 className="welcome-text">Hey! 👋</h2>
            <h3 className="welcome-subtext">
              Welcome to <span className="highlight">MENTOR LINK</span>
            </h3>

            <button className="google-btn">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
              />
              <span>Sign in with Google</span>
            </button>

            <div className="divider">or</div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Sign your email address"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <a 
                  href="/phone-verification" 
                  className="use-phone-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/phone-verification');
                  }}
                >
                  Use Phone
                </a>
              </div>

              <button type="submit" className="continue-btn">
                Continue
              </button>
            </form>

            <p className="signup-text">
              Don't have an account? <a href="#">Sign up for free!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
