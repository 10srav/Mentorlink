import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import "./MentorCard.css";

const MentorCard = ({ mentor }) => {
  return (
    <div className="mentor-card">
      <div className="mentor-card__header">
        <img src={mentor.avatar} alt={mentor.name} className="mentor-card__avatar" />
        <div className="mentor-card__title">
          <div className="mentor-card__name">
            {mentor.name}
            {mentor.verified && <FiCheckCircle className="verified" />}
          </div>
          <div className="mentor-card__meta">
            <span>{mentor.title}</span>
            <span>•</span>
            <span>{mentor.company}</span>
            <span>•</span>
            <span>{mentor.experience}+ yrs experience</span>
          </div>
        </div>
      </div>

      <p className="mentor-card__bio">{mentor.bio}</p>
      <button className="read-more">Read More</button>

      <div className="mentor-card__tags">
        {mentor.skills.slice(0, 6).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
        {mentor.skills.length > 6 && (
          <span className="tag tag--more">+{mentor.skills.length - 6} more</span>
        )}
      </div>

      {mentor.coreDomain && (
        <div className="mentor-card__core">Core Domains: {mentor.coreDomain}</div>
      )}
    </div>
  );
};

export default MentorCard;
