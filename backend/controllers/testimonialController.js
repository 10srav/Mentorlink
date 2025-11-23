const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

// Get all approved testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const { featured, limit = 20 } = req.query;

    const query = { isApproved: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const testimonials = await Testimonial.find(query)
      .populate('user', 'name profileImage')
      .sort({ order: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// Create a new testimonial (authenticated users only)
const createTestimonial = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const userId = req.user._id;

    // Check if user already has a testimonial
    const existingTestimonial = await Testimonial.findOne({ user: userId });
    if (existingTestimonial) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a testimonial'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine role and company based on user type
    let role = 'User';
    let company = '';

    if (user.role === 'mentor') {
      const Mentor = require('../models/Mentor');
      const mentor = await Mentor.findOne({ user: userId });
      if (mentor) {
        role = mentor.role || 'Mentor';
        company = mentor.company || 'Professional';
      }
    } else if (user.role === 'student') {
      const Student = require('../models/Student');
      const student = await Student.findOne({ user: userId });
      if (student) {
        role = student.role || 'Student';
        company = student.college || 'University';
      }
    } else if (user.role === 'organizer') {
      const Organizer = require('../models/Organizer');
      const organizer = await Organizer.findOne({ user: userId });
      if (organizer) {
        role = organizer.role || 'Event Organizer';
        company = organizer.organization || 'Organization';
      }
    }

    const testimonial = await Testimonial.create({
      user: userId,
      name: user.name,
      role,
      company,
      image: user.profileImage || '',
      rating,
      feedback,
      isApproved: false // Needs admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed by our team.',
      testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
};

// Update testimonial (admin only)
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name profileImage');

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
};

// Delete testimonial (admin only)
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
};

// Approve testimonial (admin only)
const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name profileImage');

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial
    });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving testimonial',
      error: error.message
    });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
};
