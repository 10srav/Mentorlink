import React from "react";
import "./StudentCard.css";

const StudentCard = ({ student, onClick }) => {
  if (!student) return null;

  // Support both nested user object (from API) and direct properties (mock data)
  const name = student.user?.name || student.name || "Unnamed Student";
  const profileImage = student.user?.profileImage || student.profileImage;
  const roleStatus = student.roleStatus || "Student";
  const mentorshipField = student.mentorshipField || [];
  const experienceLevel = student.experienceLevel || "Beginner";
  const goal = student.goal || student.user?.bio || "Learning and growing with mentors";
  const connectionsCount = student.user?.connectionsCount || student.connectionsCount || 0;

  const displaySkills = mentorshipField.length > 3 ? mentorshipField.slice(0, 3) : mentorshipField;
  const remainingSkills = mentorshipField.length > 3 ? mentorshipField.length - 3 : 0;

  return (
    <div className="student-card" onClick={onClick}>
      <div className="student-card__header">
        <img
          src={profileImage || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
          alt={name}
          className="student-card__avatar"
        />
        <div>
          <h3 className="student-card__name">
            {name}
            <span className="verified">✓</span>
          </h3>
          <div className="student-card__meta">
            <span>{roleStatus}</span>
            <span>•</span>
            <span>{experienceLevel}</span>
          </div>
        </div>
      </div>

      <p className="student-card__bio">
        {goal}
      </p>

      <div className="student-card__tags">
        {displaySkills.map((skill, i) => (
          <span key={i} className="tag">
            {skill}
          </span>
        ))}
        {remainingSkills > 0 && (
          <span className="tag tag--more">+{remainingSkills} more</span>
        )}
      </div>

      <div className="student-card__footer">
        <div className="student-card__stats">
          <span className="stat-item">
            <strong>{connectionsCount}</strong> Connections
          </span>
        </div>
        <button className="connect-button" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          View Profile
        </button>
      </div>
    </div>
  );
};

export default StudentCard;