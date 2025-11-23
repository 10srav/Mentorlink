const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], students: [] }, null, 2), 'utf8');
  }
};

const readJson = () => {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw || '{}');
    // Ensure structure
    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!Array.isArray(parsed.students)) parsed.students = [];
    return parsed;
  } catch {
    return { users: [], students: [] };
  }
};

const writeJson = (data) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

const findUserByEmail = (email) => {
  const db = readJson();
  return db.users.find((u) => u.email === email) || null;
};

const findUserByUsername = (username) => {
  const db = readJson();
  return db.users.find((u) => u.username === username) || null;
};

const upsertUser = (user) => {
  const db = readJson();
  const existingIndex = db.users.findIndex((u) => u.email === user.email);
  if (existingIndex >= 0) {
    db.users[existingIndex] = { ...db.users[existingIndex], ...user };
  } else {
    db.users.push(user);
  }
  writeJson(db);
  return user;
};

module.exports = {
  readJson,
  writeJson,
  findUserByEmail,
  findUserByUsername,
  upsertUser,
  DATA_FILE,
};

// Student helpers
const findStudentByUser = (userId) => {
  const db = readJson();
  return db.students.find((s) => s.user === userId) || null;
};

const upsertStudent = (student) => {
  const db = readJson();
  const idx = db.students.findIndex((s) => s.user === student.user);
  if (idx >= 0) {
    db.students[idx] = { ...db.students[idx], ...student };
  } else {
    db.students.push(student);
  }
  writeJson(db);
  return student;
};

module.exports.findStudentByUser = findStudentByUser;
module.exports.upsertStudent = upsertStudent;


