import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ add this
import "./WhyMentorLink.css";

const WhyMentorLink = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();  // ✅ add this

  const features = [
    {
      id: 1,
      title: "Personalized Mentorship",
      description: "Get matched with mentors aligned to your goals, skills, and interests."
    },
    {
      id: 2,
      title: "Centralized Event Access",
      description: "Discover, register, and attend curated tech talks, webinars, and hackathons — all in one place."
    },
    {
      id: 3,
      title: "Growth Tracking Dashboard",
      description: "Visualize your progress through sessions, achievements, and learning paths."
    }
  ];

  // Dummy images (replace later with your own assets)
  const images = [
    "https://via.placeholder.com/743x704.png?text=MentorLink+Image+1",
    "https://via.placeholder.com/743x704.png?text=MentorLink+Image+2",
    "https://via.placeholder.com/743x704.png?text=MentorLink+Image+3",
  ];

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector(".why-mentorlink-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Image auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4s
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="why-mentorlink-section">
      <div className="why-mentorlink-container">
        
        {/* Left Content */}
        <div className="why-mentorlink-content">
          <div className={`content-wrapper ${isVisible ? "animate-in" : ""}`}>
            <h2 className="section-title">Why MentorLink?</h2>
            
            <div className="features-list">
              {features.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className={`feature-item ${isVisible ? "animate-in" : ""}`}
                  style={{ animationDelay: `${0.2 + index * 0.15}s` }}
                >
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className={`cta-buttons ${isVisible ? "animate-in" : ""}`}>
              {/* ✅ Updated buttons with navigate */}
              <button 
                className="connect-btn"
                onClick={() => navigate("/login")}
              >
                CONNECT
              </button>
              <button 
                className="try-btn"
                onClick={() => navigate("/login")}
              >
                LET'S TRY
              </button>
            </div>
          </div>
        </div>

        {/* Right Image Placeholder (Carousel) */}
        <div className="image-placeholder">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`MentorLink-${idx}`} 
              className={`carousel-image ${idx === currentImage ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMentorLink;
