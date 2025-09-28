import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./StudentForm.css";
import { studentAPI } from "../services/api"; // Corrected import path and named import

const StudentForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const { userId } = location.state || {}; // Get userId from location state

  const [formData, setFormData] = useState({
    user: userId || '', // Initialize user with userId from state
    roleStatus: "",
    mentorshipField: [], // now stores multiple skills
    experienceLevel: "",
    mentorshipTypes: [],
    frequency: "",
    style: "",
    goal: "",
    portfolio: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, user: userId }));
    }
  }, [userId]);

  const [inputValue, setInputValue] = useState("");

  const domains = [
    "Web Development",
    "AI & ML",
    "Cybersecurity",
    "Data Science",
    "Cloud Computing",
    "Blockchain",
    "UI/UX Design",
    "Networking",
    "Competitive Programming",
  ];

  const handleDomainSelect = (e) => {
    const value = e.target.value;
    if (value && !formData.mentorshipField.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        mentorshipField: [...prev.mentorshipField, value],
      }));
    }
    setInputValue(""); // reset dropdown
  };

  const removeDomain = (domain) => {
    setFormData((prev) => ({
      ...prev,
      mentorshipField: prev.mentorshipField.filter((d) => d !== domain),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted form data:", formData);
    try {
      const response = await studentAPI.submitForm(formData);
      console.log("Student form submission response:", response);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Student form submission error:", error);
      alert('Student form submission failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="student-form-container">
      <form className="student-form" onSubmit={handleSubmit}>
        {/* Q1 */}
        <div className="form-group">
          <label>
            What is your current role or status?{" "}
            <span className="required">*</span>
          </label>
          <select
            name="roleStatus"
            value={formData.roleStatus}
            onChange={handleChange}
            required
          >
            <option value="">
              e.g., Final year B.Tech student, Working professional
            </option>
            <option value="student">Student</option>
            <option value="working">Working Professional</option>
            <option value="careerSwitch">Career Switcher</option>
          </select>
        </div>

        {/* Q2 */}
        <div className="form-group">
          <label>
            What field or domain are you interested in getting mentorship for?{" "}
            <span className="required">*</span>
          </label>

          {/* Selected skills */}
          <div className="selected-domains">
            {formData.mentorshipField.map((domain, index) => (
              <span key={index} className="tag">
                {domain}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDomain(domain)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Dropdown */}
          <select
            value={inputValue}
            onChange={handleDomainSelect}
            className="domain-select"
            required={formData.mentorshipField.length === 0}
          >
            <option value="">-- Choose a domain --</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        {/* Q3 */}
        <div className="form-group">
          <label>
            How would you describe your current experience level in this domain?{" "}
            <span className="required">*</span>
          </label>
          <div className="checkbox-group">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <label key={level}>
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level}
                  checked={formData.experienceLevel === level}
                  onChange={handleChange}
                  required
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Q4 */}
        <div className="form-group">
          <label>
            What kind of mentorship are you looking for?{" "}
            <span className="required">*</span>
          </label>
          <div className="checkbox-group">
            {[
              "Career guidance",
              "Project help / portfolio review",
              "Resume & LinkedIn feedback",
              "Mock interviews",
              "Learning roadmap",
              "Doubt-solving / weekly check-ins",
            ].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  name="mentorshipTypes"
                  value={item}
                  checked={formData.mentorshipTypes.includes(item)}
                  onChange={handleChange}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Q5 */}
        <div className="form-group">
          <label>
            How often would you like to connect with a mentor?{" "}
            <span className="required">*</span>
          </label>
          <div className="checkbox-group">
            {["Once a week", "Twice a month", "On-demand (as needed)"].map(
              (freq) => (
                <label key={freq}>
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={formData.frequency === freq}
                    onChange={handleChange}
                    required
                  />
                  {freq}
                </label>
              )
            )}
          </div>
        </div>

        {/* Q6 */}
        <div className="form-group">
          <label>
            Preferred mentorship style <span className="required">*</span>
          </label>
          <div className="checkbox-group">
            {["Text", "Call", "Asynchronous"].map((style) => (
              <label key={style}>
                <input
                  type="radio"
                  name="style"
                  value={style}
                  checked={formData.style === style}
                  onChange={handleChange}
                  required
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        {/* Q7 */}
        <div className="form-group">
          <label>
            Describe your short-term goal <span className="required">*</span>
          </label>
          <input
            type="text"
            name="goal"
            placeholder="e.g., I want to build a portfolio to apply for internships"
            value={formData.goal}
            onChange={handleChange}
            required
          />
        </div>

        {/* Q8 */}
        <div className="form-group">
          <label>LinkedIn Profile or Portfolio</label>
          <input
            type="text"
            name="portfolio"
            placeholder="Help mentors understand you better"
            value={formData.portfolio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">
          Continue
        </button>
      </form>
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

export default StudentForm;
