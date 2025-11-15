import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  setDoc,
  deleteDoc,
  arrayUnion
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Initialize DB (Firestore collections auto-create on first write, but this is a placeholder)
export const initDB = async () => {
  try {
    console.log("Firebase Firestore initialized and ready");
    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

// ==================== USER OPERATIONS ====================
// FIXED VERSION — does NOT create Firebase Auth user
export const addUser = async (uid, userData) => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: Timestamp.now(),
    });

    return { uid, ...userData };
  } catch (error) {
    console.error("Add user error:", error);
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get user by username error:", error);
    throw error;
  }
};

export const getUserById = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Get user by id error:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

// ==================== STUDENT OPERATIONS ====================
export const addStudent = async (name, year, block, gender, email, teacherId) => {
  try {
    const docRef = await addDoc(collection(db, "students"), {
      name,
      year,
      block,
      gender,
      email,
      teacherId,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, name, year, block, gender, email, teacherId };
  } catch (error) {
    console.error("Add student error:", error);
    throw error;
  }
};

export const getAllStudents = async (teacherId = null) => {
  try {
    let q;
    if (teacherId) {
      q = query(collection(db, "students"), where("teacherId", "==", teacherId));
    } else {
      q = query(collection(db, "students"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get all students error:", error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, "students", id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Get student by id error:", error);
    throw error;
  }
};

export const updateStudent = async (id, name, year, block, gender, email) => {
  try {
    await updateDoc(doc(db, "students", id), {
      name, year, block, gender, email, updatedAt: Timestamp.now()
    });
    return { id, name, year, block, gender, email };
  } catch (error) {
    console.error("Update student error:", error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    await deleteDoc(doc(db, "students", id));
    return true;
  } catch (error) {
    console.error("Delete student error:", error);
    throw error;
  }
};

// ==================== ATTENDANCE OPERATIONS ====================
export const markAttendance = async (studentId, date, status, timeIn = null, timeOut = null) => {
  try {
    const docRef = await addDoc(collection(db, "attendance"), {
      studentId,
      date,
      status,
      timeIn,
      timeOut,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, studentId, date, status, timeIn, timeOut };
  } catch (error) {
    console.error("Mark attendance error:", error);
    throw error;
  }
};

export const getAttendanceByDate = async (date) => {
  try {
    const q = query(collection(db, "attendance"), where("date", "==", date));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get attendance by date error:", error);
    throw error;
  }
};

export const getAttendanceByStudent = async (studentId) => {
  try {
    const q = query(collection(db, "attendance"), where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get attendance by student error:", error);
    throw error;
  }
};

export const updateAttendance = async (id, status, timeOut = null) => {
  try {
    await updateDoc(doc(db, "attendance", id), {
      status, timeOut, updatedAt: Timestamp.now()
    });
    return { id, status, timeOut };
  } catch (error) {
    console.error("Update attendance error:", error);
    throw error;
  }
};

// ==================== QR CODE OPERATIONS ====================
export const addQRCode = async (code, teacherId, classId, expiresAt = null) => {
  try {
    const docRef = await addDoc(collection(db, "qrcodes"), {
      code, teacherId, classId, expiresAt, createdAt: Timestamp.now()
    });
    return { id: docRef.id, code, teacherId, classId, expiresAt };
  } catch (error) {
    console.error("Add QR code error:", error);
    throw error;
  }
};

export const getQRCodeByCode = async (code) => {
  try {
    const q = query(collection(db, "qrcodes"), where("code", "==", code));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Get QR code error:", error);
    throw error;
  }
};

export const getQRCodesByTeacher = async (teacherId) => {
  try {
    const q = query(collection(db, "qrcodes"), where("teacherId", "==", teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get QR codes by teacher error:", error);
    throw error;
  }
};

// ==================== EXCUSE LETTER OPERATIONS ====================
export const addExcuseLetter = async (studentId, reason, dateSubmitted, attachmentPath = null) => {
  try {
    const docRef = await addDoc(collection(db, "excuseletters"), {
      studentId, reason, dateSubmitted, attachmentPath,
      status: "pending", createdAt: Timestamp.now()
    });
    return { id: docRef.id, studentId, reason, dateSubmitted, status: "pending" };
  } catch (error) {
    console.error("Add excuse letter error:", error);
    throw error;
  }
};

export const getExcuseLetters = async (status = null) => {
  try {
    let q;
    if (status) {
      q = query(collection(db, "excuseletters"), where("status", "==", status));
    } else {
      q = query(collection(db, "excuseletters"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get excuse letters error:", error);
    throw error;
  }
};

export const updateExcuseLetterStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, "excuseletters", id), { status, updatedAt: Timestamp.now() });
    return { id, status };
  } catch (error) {
    console.error("Update excuse letter status error:", error);
    throw error;
  }
};

// ==================== REPORT OPERATIONS ====================
export const addReport = async (teacherId, title, description, type) => {
  try {
    const docRef = await addDoc(collection(db, "reports"), {
      teacherId, title, description, type, generatedAt: Timestamp.now()
    });
    return { id: docRef.id, teacherId, title, description, type };
  } catch (error) {
    console.error("Add report error:", error);
    throw error;
  }
};

export const getReportsByTeacher = async (teacherId) => {
  try {
    const q = query(collection(db, "reports"), where("teacherId", "==", teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get reports by teacher error:", error);
    throw error;
  }
};

// ==================== SEARCH & FILTER ====================
export const searchStudents = async (searchTerm) => {
  try {
    const q = query(collection(db, "students"));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.filter(doc => {
      const data = doc.data();
      return data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             data.block.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return results.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Search students error:", error);
    throw error;
  }
};

export const getAttendanceStats = async (studentId, startDate, endDate) => {
  try {
    const q = query(collection(db, "attendance"), where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => doc.data());

    const stats = {};
    records.forEach(record => {
      if (record.date >= startDate && record.date <= endDate) {
        stats[record.status] = (stats[record.status] || 0) + 1;
      }
    });
    return stats;
  } catch (error) {
    console.error("Get attendance stats error:", error);
    throw error;
  }
};

export async function addStudentClass(studentId, sessionId) {
  try {
    // create a student doc under sessions/{sessionId}/students/{studentId}
    const studentRef = doc(db, "sessions", sessionId, "students", String(studentId));
    const existing = await getDoc(studentRef);
    if (existing.exists()) return { id: existing.id, ...existing.data(), alreadyJoined: true };

    await setDoc(studentRef, {
      uid: String(studentId),
      joinedAt: new Date().toISOString(),
    });

    // also add sessionId to user.joinedSessions array (create user doc if needed)
    const userRef = doc(db, "users", String(studentId));
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, { joinedSessions: arrayUnion(sessionId) });
    } else {
      await setDoc(userRef, {
        uid: String(studentId),
        joinedSessions: [sessionId],
        createdAt: new Date().toISOString(),
      });
    }

    return { id: studentId, sessionId };
  } catch (err) {
    console.error("addStudentClass error:", err);
    throw err;
  }
}
