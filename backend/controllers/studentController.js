
const Student = require('../models/Student');
const User = require('../models/User');
const fileDb = require('../utils/fileDb');
const isFileDbEnabled = () => String(process.env.USE_FILE_DB || 'false').toLowerCase() === 'true';

// @desc    Create or update student profile
// @route   POST /api/students
// @access  Private
const createOrUpdateStudent = async (req, res) => {
  const {
    roleStatus,
    mentorshipField,
    experienceLevel,
    mentorshipTypes,
    frequency,
    style,
    goal,
    portfolio,
  } = req.body;

  // const user = req.user._id; // Old way (requires authentication)
  const { user } = req.body; // New way (from request body)

  try {
    const isUuidLike = typeof user === 'string' && user.includes('-') && user.length >= 16;
    const useFilePath = isFileDbEnabled() || isUuidLike;
    // eslint-disable-next-line no-console
    console.log('[students] useFilePath=', useFilePath, 'USE_FILE_DB=', isFileDbEnabled(), 'isUuidLike=', isUuidLike, 'user=', user);
    if (useFilePath) {
      // File DB flow
      let student = fileDb.findStudentByUser(user);
      if (student) {
        student = {
          ...student,
          roleStatus,
          mentorshipField,
          experienceLevel,
          mentorshipTypes,
          frequency,
          style,
          goal,
          portfolio,
          updatedAt: new Date().toISOString(),
        };
        fileDb.upsertStudent(student);
        return res.json({ message: 'Student profile updated', student });
      }
      student = {
        id: `${user}-student`,
        user,
        roleStatus,
        mentorshipField,
        experienceLevel,
        mentorshipTypes,
        frequency,
        style,
        goal,
        portfolio,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      fileDb.upsertStudent(student);
      return res.status(201).json({ message: 'Student profile created', student });
    }

    let student = await Student.findOne({ user });

    if (student) {
      // Update existing student
      student.roleStatus = roleStatus;
      student.mentorshipField = mentorshipField;
      student.experienceLevel = experienceLevel;
      student.mentorshipTypes = mentorshipTypes;
      student.frequency = frequency;
      student.style = style;
      student.goal = goal;
      student.portfolio = portfolio;

      await student.save();
      return res.json({ message: 'Student profile updated', student });
    }

    // Create new student
    student = new Student({
      user,
      roleStatus,
      mentorshipField,
      experienceLevel,
      mentorshipTypes,
      frequency,
      style,
      goal,
      portfolio,
    });

    await student.save();
    res.status(201).json({ message: 'Student profile created', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isFileDbEnabled()) {
      const student = fileDb.findStudentByUser(userId);
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      return res.json({ student });
    }

    const student = await Student.findOne({ user: userId }).populate('user', 'name email bio');
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student profile image
// @route   PUT /api/students/profile-image
// @access  Private
const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileImage } = req.body;

    if (isFileDbEnabled()) {
      const student = fileDb.findStudentByUser(userId);
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      student.profileImage = profileImage;
      student.updatedAt = new Date().toISOString();
      fileDb.upsertStudent(student);
      return res.json({ message: 'Profile image updated', student });
    }

    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    student.profileImage = profileImage;
    await student.save();

    res.json({ message: 'Profile image updated', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateStudent,
  getStudentProfile,
  updateProfileImage,
};
