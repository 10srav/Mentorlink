import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./MentorForm.css";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { mentorAPI } from "../services/api";

const MentorForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const { userId } = location.state || {}; // Get userId from location state

  const [formData, setFormData] = useState({
    user: userId || '', // Initialize user with userId from state
    primaryDomain: "",
    secondaryDomain: "",
    linkedin: "",
    role: "",
    requirements: false,
    primaryExperience: "",
    mentorshipExperience: "",
    mentoringStyle: [],
    weeklyAvailability: [],
    skills: []
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, user: userId }));
    }
  }, [userId]);

  const domains = [
    "Web Development", "Mobile Development", "Data Science", "Machine Learning",
    "UI/UX Design", "Product Management", "Cloud Computing", "Cybersecurity",
    "DevOps", "AI/ML Ops", "Blockchain", "Digital Marketing", "Finance",
    "Business Strategy", "Career Coaching", "Interview Preparation"
  ];

  const mentoringStyles = ["Text", "Call", "Asynchronous"];
  const weeklyAvailabilityOptions = ["1-2 hrs", "3-5 hrs", "On-demand"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCheckboxGroup = (name, value) => {
    setFormData((prev) => {
      const current = [...prev[name]];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      skills: selectedOptions ? selectedOptions.map((opt) => opt.value) : []
    }));
  };

  const skillOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
    { value: "C#", label: "C#" },
    { value: "Ruby", label: "Ruby" },
    { value: "PHP", label: "PHP" },
    { value: "Swift", label: "Swift" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "Go", label: "Go" },
    { value: "Rust", label: "Rust" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "SQL", label: "SQL" },
    { value: "HTML/CSS", label: "HTML/CSS" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Mentor form submitted:", formData);
    try {
      const response = await mentorAPI.submitForm(formData);
      console.log("Mentor form submission response:", response);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Mentor form submission error:", error);
      alert('Mentor form submission failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="mentor-form-container">
      <form className="student-form" onSubmit={handleSubmit}>
        {/* Match StudentForm structure: simple stacked groups */}
        <div className="form-group">
          <label>
            Primary Domain <span className="required">*</span>
          </label>
          <select
            name="primaryDomain"
            value={formData.primaryDomain}
            onChange={handleChange}
            required
          >
            <option value="">Select Primary Domain</option>
            {domains.map((domain, i) => (
              <option key={i} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Secondary Domain</label>
          <select
            name="secondaryDomain"
            value={formData.secondaryDomain}
            onChange={handleChange}
          >
            <option value="">Select Secondary Domain</option>
            {domains.map((domain, i) => (
              <option key={i} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            LinkedIn Profile <span className="required">*</span>
          </label>
          <input
            type="text"
            name="linkedin"
            placeholder="Enter your LinkedIn profile URL or ID"
            value={formData.linkedin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Your current role and Organization <span className="required">*</span>
          </label>
          <input
            type="text"
            name="role"
            placeholder="e.g., Senior Engineer @ ABC Corp"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Experience in Primary Domain <span className="required">*</span>
          </label>
          <input
            type="text"
            name="primaryExperience"
            placeholder="Years of experience"
            value={formData.primaryExperience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Have you mentored anyone before? If yes, in what capacity? <span className="required">*</span>
          </label>
          <textarea
            name="mentorshipExperience"
            placeholder="Mention your mentorship experience"
            value={formData.mentorshipExperience}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Preferred mentoring style <span className="required">*</span>
          </label>
          <div className="checkbox-group">
            {mentoringStyles.map((style, i) => (
              <label key={style}>
                <input
                  type="checkbox"
                  value={style}
                  checked={formData.mentoringStyle.includes(style)}
                  onChange={() => handleCheckboxGroup("mentoringStyle", style)}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            Weekly availability <span className="required">*</span>
          </label>
          <div className="checkbox-group">
            {weeklyAvailabilityOptions.map((opt) => (
              <label key={opt}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={formData.weeklyAvailability.includes(opt)}
                  onChange={() => handleCheckboxGroup("weeklyAvailability", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Skills you can mentor in</label>
          <Select
            options={skillOptions}
            isMulti
            onChange={handleSkillsChange}
            placeholder="Search and select skills..."
          />
        </div>

        <div className="form-group">
          <label>
            I meet the requirements to be a mentor
          </label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="requirements"
                checked={formData.requirements}
                onChange={handleChange}
              />
              Yes
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary">Continue</button>
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

export default MentorForm;
