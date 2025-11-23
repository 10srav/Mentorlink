const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  toggleFollow,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  trackProfileView,
  getProfileAnalytics
} = require('../controllers/followController');

// Follow/unfollow routes
router.post('/toggle/:userId', protect, toggleFollow);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/status/:userId', protect, checkFollowStatus);

// Profile view tracking
router.post('/view/:mentorId', trackProfileView);
router.get('/analytics', protect, getProfileAnalytics);

module.exports = router;