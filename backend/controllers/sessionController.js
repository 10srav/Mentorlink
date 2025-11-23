const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { studentId, date, time, duration, timezone, zoomLink, password, notes } = req.body;
    const mentorId = req.user._id;

    // Validate required fields
    if (!studentId || !date || !time || !zoomLink) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create session with notification
    const session = await Session.createSessionWithNotification(
      {
        mentor: mentorId,
        student: studentId,
        date,
        time,
        duration: duration || 30,
        timezone: timezone || 'GMT-05:00 (Eastern Time - US and Canada)',
        zoomLink,
        password,
        notes,
        createdBy: mentorId,
      },
      mentorId,
      studentId
    );

    // Populate student and mentor details
    await session.populate('student mentor', 'name email profileImage');

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all sessions for logged-in user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const query = {
      $or: [{ mentor: userId }, { student: userId }],
    };

    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('mentor student', 'name email profileImage')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get sessions with a specific user
// @route   GET /api/sessions/with-user/:userId
// @access  Private
const getSessionsWithUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    const sessions = await Session.find({
      $or: [
        { mentor: currentUserId, student: userId },
        { mentor: userId, student: currentUserId },
      ],
    })
      .populate('mentor student', 'name email profileImage')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions with user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:sessionId
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(sessionId)
      .populate('mentor student', 'name email profileImage');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the session
    if (
      session.mentor._id.toString() !== userId.toString() &&
      session.student._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:sessionId/status
// @access  Private
const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the session
    if (
      session.mentor.toString() !== userId.toString() &&
      session.student.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    session.status = status;
    await session.save();

    await session.populate('mentor student', 'name email profileImage');

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:sessionId
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only creator can delete
    if (session.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this session' });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionsWithUser,
  getSessionById,
  updateSessionStatus,
  deleteSession,
};
