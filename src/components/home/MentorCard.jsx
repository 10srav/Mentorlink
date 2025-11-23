import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import {
  FiCheckCircle,
  FiLink2,
  FiUserPlus,
  FiUserCheck
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { followAPI } from "../../services/api";
import "./MentorCard.css";

const MentorCard = ({ mentor, onClick }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Extract mentor data with fallbacks
  const profileImage = mentor.user?.profileImage || mentor.avatar || 'https://i.pravatar.cc/150?img=1';
  const name = mentor.user?.name || mentor.name || 'Mentor';
  const bio = mentor.user?.bio || mentor.bio || 'Experienced professional passionate about mentoring and helping others grow.';
  const role = mentor.role || mentor.title || 'Professional Mentor';
  const company = mentor.company || '';
  const experience = mentor.primaryExperience || mentor.experience || '5+ years';
  const skills = mentor.skills || [];
  const verified = mentor.verified !== undefined ? mentor.verified : true;
  const userId = mentor.user?._id || mentor._id;
  const followersCount = mentor.user?.followersCount || mentor.followersCount || 0;
  const coreDomain = mentor.primaryDomain || mentor.coreDomain || '';

  const [isFollowing, setIsFollowing] = useState(mentor.isFollowing || false);
  const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);
  const [loading, setLoading] = useState(false);

  const handleFollowClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!userId) return;

    const wasFollowing = isFollowing;
    const originalCount = localFollowersCount;

    try {
      setLoading(true);
      setIsFollowing(!wasFollowing);
      setLocalFollowersCount(prev => wasFollowing ? Math.max(0, prev - 1) : prev + 1);

      const response = await followAPI.toggleFollow(userId);
      setIsFollowing(response.isFollowing);
      setLocalFollowersCount(response.followersCount);
    } catch (error) {
      // Revert on error
      setIsFollowing(wasFollowing);
      setLocalFollowersCount(originalCount);
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleConnectClick = (e) => {
    e.stopPropagation();
    handleCardClick();
  };

  return (
    <Card className="mentor-brief-card">
      <CardContent className="mentor-brief-content">
        {/* Top Section: Avatar + Name/Title/Experience */}
        <Box className="mentor-header-section">
          {/* Left: Avatar */}
          <Avatar
            src={profileImage}
            alt={name}
            className="mentor-avatar-brief"
          />

          {/* Right: Info */}
          <Box className="mentor-header-info">
            <Box className="mentor-name-verified">
              <Typography variant="h6" className="mentor-name-heading">
                {name}
              </Typography>
              {verified && (
                <FiCheckCircle className="verified-badge-icon" />
              )}
            </Box>

            <Typography variant="body2" className="mentor-role-title">
              {role}
              {company && ` • ${company}`}
            </Typography>

            <Typography variant="body2" className="mentor-exp-years">
              {experience} experience
            </Typography>

            {/* Followers Count */}
            <Typography variant="caption" className="mentor-followers-count">
              {localFollowersCount} followers
            </Typography>
          </Box>
        </Box>

        {/* Middle Section: Bio/Description */}
        <Box className="mentor-description-section">
          <Typography variant="body2" className="mentor-description-text">
            {bio}
          </Typography>
        </Box>

        {/* Bottom Section: Skills */}
        <Box className="mentor-skills-section">
          {skills.slice(0, 5).map((skill, idx) => (
            <Chip
              key={idx}
              label={skill}
              className="skill-tag-chip"
              size="small"
            />
          ))}
          {skills.length > 5 && (
            <Chip
              label={`+${skills.length - 5} more`}
              className="skill-tag-chip skill-tag-more"
              size="small"
            />
          )}
        </Box>

        {/* Core Domain (Optional) */}
        {coreDomain && (
          <Box className="mentor-core-domain">
            <Typography variant="caption" className="core-domain-heading">
              Core Domains:
            </Typography>
            <Typography variant="body2" className="core-domain-text">
              {coreDomain}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Actions Section */}
      <CardActions className="mentor-actions-section">
        <Button
          variant="contained"
          fullWidth
          size="large"
          className="connect-action-btn"
          startIcon={<FiLink2 />}
          onClick={handleConnectClick}
        >
          Connect
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="large"
          className={isFollowing ? "follow-action-btn following-active" : "follow-action-btn"}
          startIcon={isFollowing ? <FiUserCheck /> : <FiUserPlus />}
          onClick={handleFollowClick}
          disabled={loading}
        >
          {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default MentorCard;
