const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllTestimonials);

// Protected routes (authenticated users)
router.post('/', protect, createTestimonial);

// Admin only routes
router.put('/:id', protect, authorize('admin'), updateTestimonial);
router.delete('/:id', protect, authorize('admin'), deleteTestimonial);
router.patch('/:id/approve', protect, authorize('admin'), approveTestimonial);

module.exports = router;
