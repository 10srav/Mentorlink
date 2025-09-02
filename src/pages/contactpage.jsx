import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "./ContactPage.css"; // CSS file

export default function ContactPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-container">
        <div className="contact-box">
          {/* Left Side - Contact Form */}
          <div className="contact-form">
            <h2>Contact Us</h2>
            <p>
              Have a question or comment? Fill out the form and we'll get back to you
              as soon as possible.
            </p>

            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input type="text" placeholder="Enter your name" required />

              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />

              <label>Message</label>
              <textarea rows="4" placeholder="Write your message" required></textarea>

              <button type="submit" className="typing-animation">Send Message</button>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="contact-image">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
              alt="Contact Illustration"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
