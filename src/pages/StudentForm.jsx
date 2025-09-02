import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentForm.css";

const StudentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleStatus: "",
    mentorshipField: [], // now stores multiple skills
    experienceLevel: "",
    mentorshipTypes: [],
    frequency: "",
    style: "",
    goal: "",
    portfolio: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted form data:", formData);
    navigate("/dashboard"); // redirect after submit
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
    </div>
  );
};

export default StudentForm;
