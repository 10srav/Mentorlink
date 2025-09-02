import React, { useState } from "react";
import Select from "react-select";
import "./MentorForm.css";

const MentorForm = () => {
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mentor form submitted:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="mentor-form-container">
      <form onSubmit={handleSubmit}>
        {/* Domain Expertise */}
        <div className="form-group">
          <label>Domain's your Expertise <span className="required">*</span></label>
          <select
            name="primaryDomain"
            value={formData.primaryDomain}
            onChange={handleChange}
            required
          >
            <option value="">Primary Domain</option>
            {domains.map((domain, i) => (
              <option key={i} value={domain}>{domain}</option>
            ))}
          </select>

          <select
            name="secondaryDomain"
            value={formData.secondaryDomain}
            onChange={handleChange}
          >
            <option value="">Secondary Domain</option>
            {domains.map((domain, i) => (
              <option key={i} value={domain}>{domain}</option>
            ))}
          </select>
        </div>

        {/* LinkedIn */}
        <div className="form-group">
          <label>Enter your LinkedIn Id <span className="required">*</span></label>
          <input
            type="text"
            name="linkedin"
            placeholder="Enter your LinkedIn Id"
            value={formData.linkedin}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Your current role and Organization <span className="required">*</span></label>
          <input
            type="text"
            name="role"
            placeholder="Enter your current role and organization"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>

        {/* Requirements */}
        <div className="form-group checkbox-single">
          <input
            type="checkbox"
            name="requirements"
            checked={formData.requirements}
            onChange={handleChange}
          />
          <label>Requirements to be a mentor</label>
        </div>

        {/* Experience */}
        <div className="form-group">
          <label>Experience in Primary Domain <span className="required">*</span></label>
          <input
            type="text"
            name="primaryExperience"
            placeholder="How many years of experience do you have?"
            value={formData.primaryExperience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Have you mentored anyone before? If yes, in what capacity? <span className="required">*</span></label>
          <textarea
            name="mentorshipExperience"
            placeholder="Mention your mentorship experience"
            value={formData.mentorshipExperience}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        {/* Preferred mentoring style */}
        <div className="form-group">
          <label>Preferred mentoring style <span className="required">*</span></label>
          <div className="checkbox-group">
            {mentoringStyles.map((style, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  checked={formData.mentoringStyle.includes(style)}
                  onChange={() => handleCheckboxGroup("mentoringStyle", style)}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        {/* Weekly availability */}
        <div className="form-group">
          <label>Weekly availability <span className="required">*</span></label>
          <div className="checkbox-group">
            {weeklyAvailabilityOptions.map((opt, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  checked={formData.weeklyAvailability.includes(opt)}
                  onChange={() => handleCheckboxGroup("weeklyAvailability", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Skills Dropdown */}
        <div className="form-group">
          <label>Select Skills you can mentor in</label>
          <Select
            options={skillOptions}
            isMulti
            onChange={handleSkillsChange}
            placeholder="Search and select skills..."
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-submit">Continue</button>
      </form>
    </div>
  );
};

export default MentorForm;
