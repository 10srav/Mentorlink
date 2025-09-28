// MentorLinkForm.jsx
import React, { useState, useEffect } from "react";
import "./EventOrganizer.css";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { organizerAPI } from "../services/api";

const EventOrganizer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const { userId } = location.state || {}; // Get userId from location state

  const [formData, setFormData] = useState({
    user: userId || '', // Initialize user with userId from state
    pastEvents: "",
    eventTypes: [],
    mode: [],
    domains: "",
    help: [],
    motivation: "",
    audience: [],
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, user: userId }));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const updated = new Set(prev[name]);
        if (checked) updated.add(value);
        else updated.delete(value);
        return { ...prev, [name]: Array.from(updated) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    try {
      const response = await organizerAPI.submitForm(formData);
      console.log("Organizer form submission response:", response);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Organizer form submission error:", error);
      alert('Organizer form submission failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="event-organizer-container">
      <div className="form-box">
        <h2 className="form-title">Event Organizer</h2>
        <form onSubmit={handleSubmit}>

          {/* Past Events */}
          <div className="form-group">
            <label>
              Have you organized any events before? If yes, briefly describe them<span className="required">*</span>
            </label>
            <input
              type="text"
              name="pastEvents"
              placeholder="e.g., Hackathons, Webinars, Career Talks"
              value={formData.pastEvents}
              onChange={handleChange}
              required
            />
          </div>

          {/* Event Types */}
          <div className="form-group">
            <label>What type of events do you want to host on our platform?<span className="required">*</span></label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="eventTypes" value="mentoring" onChange={handleChange}/> 1:1 mentoring sessions</label>
              <label><input type="checkbox" name="eventTypes" value="panel" onChange={handleChange}/> Panel discussions</label>
              <label><input type="checkbox" name="eventTypes" value="techTalks" onChange={handleChange}/> Tech talks</label>
              <label><input type="checkbox" name="eventTypes" value="resumeReview" onChange={handleChange}/> Resume/portfolio reviews</label>
              <label><input type="checkbox" name="eventTypes" value="fireside" onChange={handleChange}/> Fireside chats / AMAs</label>
              <label><input type="checkbox" name="eventTypes" value="showcase" onChange={handleChange}/> Student showcases / demo days</label>
            </div>
          </div>

          {/* Event Mode */}
          <div className="form-group">
            <label>What type of events do you want to host on our platform?<span className="required">*</span></label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="mode" value="hybrid" onChange={handleChange}/> Live online / Hybrid</label>
              <label><input type="checkbox" name="mode" value="inPerson" onChange={handleChange}/> In-person</label>
              <label><input type="checkbox" name="mode" value="recorded" onChange={handleChange}/> Pre-recorded</label>
            </div>
          </div>

          {/* Domains */}
          <div className="form-group">
            <label>Which domains will your event focus on?<span className="required">*</span></label>
            <input
              type="text"
              name="domains"
              placeholder="e.g., Cybersecurity, AI/ML, Web Dev"
              value={formData.domains}
              onChange={handleChange}
              required
            />
          </div>

          {/* MentorLink Help */}
          <div className="form-group">
            <label>
              Do you need help from the MentorLink team?<span className="required">*</span> If Yes → What kind of help?
            </label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="help" value="promotion" onChange={handleChange}/> Promotion & outreach</label>
              <label><input type="checkbox" name="help" value="speakers" onChange={handleChange}/> Finding speakers</label>
              <label><input type="checkbox" name="help" value="hosting" onChange={handleChange}/> Hosting / moderation</label>
              <label><input type="checkbox" name="help" value="techSetup" onChange={handleChange}/> Tech setup</label>
              <label><input type="checkbox" name="help" value="planning" onChange={handleChange}/> Event planning & structure</label>
              <label><input type="checkbox" name="help" value="feedback" onChange={handleChange}/> Follow-up & feedback collection</label>
            </div>
          </div>

          {/* Motivation */}
          <div className="form-group">
            <label>What is your motivation for organizing this event?<span className="required">*</span></label>
            <textarea
              name="motivation"
              placeholder="Tell us what impact you hope to make"
              value={formData.motivation}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>

          {/* Target Audience */}
          <div className="form-group">
            <label>Target audience<span className="required">*</span></label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="audience" value="students" onChange={handleChange}/> Students</label>
              <label><input type="checkbox" name="audience" value="professionals" onChange={handleChange}/> Professionals</label>
              <label><input type="checkbox" name="audience" value="all" onChange={handleChange}/> Open to all</label>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">Continue</button>
          </div>
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
          Profile created successfully! Explore now →
        </div>
      )}
    </div>
  );
};

export default EventOrganizer;
