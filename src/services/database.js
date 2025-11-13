import * as SQLite from 'expo-sqlite';

let db = null;

const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('attendify.db');
  }
  return db;
};

export const initDB = async () => {
  try {
    const database = await getDB();
    
    // Users table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        section TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Students table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        year TEXT NOT NULL,
        block TEXT NOT NULL,
        gender TEXT NOT NULL,
        email TEXT NOT NULL,
        teacherId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(teacherId) REFERENCES users(id)
      );
    `);

    // Attendance table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        timeIn TEXT,
        timeOut TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(studentId) REFERENCES students(id)
      );
    `);

    // QR Codes table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS qrcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        teacherId INTEGER NOT NULL,
        classId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        expiresAt DATETIME,
        FOREIGN KEY(teacherId) REFERENCES users(id)
      );
    `);

    // Excuse Letters table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS excuseletters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        reason TEXT NOT NULL,
        dateSubmitted TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        attachmentPath TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(studentId) REFERENCES students(id)
      );
    `);

    // Reports table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacherId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT,
        generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(teacherId) REFERENCES users(id)
      );
    `);

    console.log("Database initialized successfully");
    return "Database initialized";
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

// ==================== USER OPERATIONS ====================
export const addUser = async (username, password, email, role, name, section) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `INSERT INTO users (username, password, email, role, name, section) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, password, email, role, name, section]
    );
    return result;
  } catch (error) {
    console.error("Add user error:", error);
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return result || [];
  } catch (error) {
    console.error("Get user by username error:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Get user by id error:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(`SELECT * FROM users`);
    return result || [];
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

// ==================== STUDENT OPERATIONS ====================
export const addStudent = async (name, year, block, gender, email, teacherId) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `INSERT INTO students (name, year, block, gender, email, teacherId) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, year, block, gender, email, teacherId]
    );
    return result;
  } catch (error) {
    console.error("Add student error:", error);
    throw error;
  }
};

export const getAllStudents = async (teacherId = null) => {
  try {
    const database = await getDB();
    let result;
    if (teacherId) {
      result = await database.getAllAsync(
        `SELECT * FROM students WHERE teacherId = ?`,
        [teacherId]
      );
    } else {
      result = await database.getAllAsync(`SELECT * FROM students`);
    }
    return result || [];
  } catch (error) {
    console.error("Get all students error:", error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync(
      `SELECT * FROM students WHERE id = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Get student by id error:", error);
    throw error;
  }
};

export const updateStudent = async (id, name, year, block, gender, email) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `UPDATE students SET name = ?, year = ?, block = ?, gender = ?, email = ? WHERE id = ?`,
      [name, year, block, gender, email, id]
    );
    return result;
  } catch (error) {
    console.error("Update student error:", error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `DELETE FROM students WHERE id = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Delete student error:", error);
    throw error;
  }
};

// ==================== ATTENDANCE OPERATIONS ====================
export const markAttendance = async (studentId, date, status, timeIn = null, timeOut = null) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `INSERT INTO attendance (studentId, date, status, timeIn, timeOut) VALUES (?, ?, ?, ?, ?)`,
      [studentId, date, status, timeIn, timeOut]
    );
    return result;
  } catch (error) {
    console.error("Mark attendance error:", error);
    throw error;
  }
};

export const getAttendanceByDate = async (date) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT a.*, s.name, s.email FROM attendance a 
       JOIN students s ON a.studentId = s.id 
       WHERE a.date = ?`,
      [date]
    );
    return result || [];
  } catch (error) {
    console.error("Get attendance by date error:", error);
    throw error;
  }
};

export const getAttendanceByStudent = async (studentId) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT * FROM attendance WHERE studentId = ? ORDER BY date DESC`,
      [studentId]
    );
    return result || [];
  } catch (error) {
    console.error("Get attendance by student error:", error);
    throw error;
  }
};

export const updateAttendance = async (id, status, timeOut = null) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `UPDATE attendance SET status = ?, timeOut = ? WHERE id = ?`,
      [status, timeOut, id]
    );
    return result;
  } catch (error) {
    console.error("Update attendance error:", error);
    throw error;
  }
};

// ==================== QR CODE OPERATIONS ====================
export const addQRCode = async (code, teacherId, classId, expiresAt = null) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `INSERT INTO qrcodes (code, teacherId, classId, expiresAt) VALUES (?, ?, ?, ?)`,
      [code, teacherId, classId, expiresAt]
    );
    return result;
  } catch (error) {
    console.error("Add QR code error:", error);
    throw error;
  }
};

export const getQRCodeByCode = async (code) => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync(
      `SELECT * FROM qrcodes WHERE code = ?`,
      [code]
    );
    return result;
  } catch (error) {
    console.error("Get QR code error:", error);
    throw error;
  }
};

export const getQRCodesByTeacher = async (teacherId) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT * FROM qrcodes WHERE teacherId = ? ORDER BY createdAt DESC`,
      [teacherId]
    );
    return result || [];
  } catch (error) {
    console.error("Get QR codes by teacher error:", error);
    throw error;
  }
};

// ==================== EXCUSE LETTER OPERATIONS ====================
export const addExcuseLetter = async (studentId, reason, dateSubmitted, attachmentPath = null) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `INSERT INTO excuseletters (studentId, reason, dateSubmitted, attachmentPath) VALUES (?, ?, ?, ?)`,
      [studentId, reason, dateSubmitted, attachmentPath]
    );
    return result;
  } catch (error) {
    console.error("Add excuse letter error:", error);
    throw error;
  }
};

export const getExcuseLetters = async (status = null) => {
  try {
    const database = await getDB();
    let result;
    if (status) {
      result = await database.getAllAsync(
        `SELECT e.*, s.name, s.email FROM excuseletters e JOIN students s ON e.studentId = s.id WHERE e.status = ? ORDER BY e.createdAt DESC`,
        [status]
      );
    } else {
      result = await database.getAllAsync(
        `SELECT e.*, s.name, s.email FROM excuseletters e JOIN students s ON e.studentId = s.id ORDER BY e.createdAt DESC`
      );
    }
    return result || [];
  } catch (error) {
    console.error("Get excuse letters error:", error);
    throw error;
  }
};

export const updateExcuseLetterStatus = async (id, status) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `UPDATE excuseletters SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result;
  } catch (error) {
    console.error("Update excuse letter status error:", error);
    throw error;
  }
};

// ==================== REPORT OPERATIONS ====================
export const addReport = async (teacherId, title, description, type) => {
  try {
    const database = await getDB();
    const result = await database.runAsync(
      `INSERT INTO reports (teacherId, title, description, type) VALUES (?, ?, ?, ?)`,
      [teacherId, title, description, type]
    );
    return result;
  } catch (error) {
    console.error("Add report error:", error);
    throw error;
  }
};

export const getReportsByTeacher = async (teacherId) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT * FROM reports WHERE teacherId = ? ORDER BY generatedAt DESC`,
      [teacherId]
    );
    return result || [];
  } catch (error) {
    console.error("Get reports by teacher error:", error);
    throw error;
  }
};

// ==================== SEARCH & FILTER ====================
export const searchStudents = async (searchTerm) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT * FROM students WHERE name LIKE ? OR email LIKE ? OR block LIKE ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return result || [];
  } catch (error) {
    console.error("Search students error:", error);
    throw error;
  }
};

export const getAttendanceStats = async (studentId, startDate, endDate) => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync(
      `SELECT status, COUNT(*) as count FROM attendance 
       WHERE studentId = ? AND date BETWEEN ? AND ? 
       GROUP BY status`,
      [studentId, startDate, endDate]
    );
    return result || [];
  } catch (error) {
    console.error("Get attendance stats error:", error);
    throw error;
  }
};