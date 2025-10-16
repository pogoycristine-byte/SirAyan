// Student Attendance Tracker - Basic JavaScript Structure

/**
 * A simple object to represent a student.
 * @param {string} name - The name of the student.
 * @param {string} id - The unique identifier for the student.
 */
function Student(name, id) {
    this.name = name;
    this.id = id;
    this.attendance = {}; // Attendance record: date => status ('present', 'absent', 'late')
}

/**
 * Method to record attendance for a specific date.
 * @param {Date} date - The date for which attendance is being recorded.
 * @param {string} status - The attendance status ('present', 'absent', 'late').
 */
Student.prototype.recordAttendance = function(date, status) {
    this.attendance[date.toDateString()] = status;
};

/**
 * Method to get the attendance status for a specific date.
 * @param {Date} date - The date for which attendance is being checked.
 * @returns {string|null} - The attendance status or null if not recorded.
 */
Student.prototype.getAttendance = function(date) {
    return this.attendance[date.toDateString()] || null;
};

/**
 * A class to manage student attendance.
 */
class AttendanceTracker {
    constructor() {
        this.students = [];
    }

    /**
     * Adds a new student to the tracker.
     * @param {Student} student - The student object to add.
     */
    addStudent(student) {
        this.students.push(student);
    }

    /**
     * Finds a student by their ID.
     * @param {string} id - The ID of the student to find.
     * @returns {Student|null} - The student object or null if not found.
     */
    findStudent(id) {
        return this.students.find(student => student.id === id) || null;
    }

    /**
     * Records attendance for a student on a specific date.
     * @param {string} studentId - The ID of the student.
     * @param {Date} date - The date for which attendance is being recorded.
     * @param {string} status - The attendance status ('present', 'absent', 'late').
     */
    recordAttendance(studentId, date, status) {
        const student = this.findStudent(studentId);
        if (student) {
            student.recordAttendance(date, status);
        } else {
            console.log(`Student with ID ${studentId} not found.`);
        }
    }

    /**
     * Generates a summary report for a student.
     * @param {string} studentId - The ID of the student.
     * @returns {object} - An object containing the attendance summary.
     */
    generateAttendanceSummary(studentId) {
        const student = this.findStudent(studentId);
        if (!student) {
            console.log(`Student with ID ${studentId} not found.`);
            return null;
        }

        let presentDays = 0;
        let absentDays = 0;
        let lateDays = 0;

        for (const date in student.attendance) {
            const status = student.attendance[date];
            switch (status) {
                case 'present':
                    presentDays++;
                    break;
                case 'absent':
                    absentDays++;
                    break;
                case 'late':
                    lateDays++;
                    break;
            }
        }

        return {
            studentName: student.name,
            presentDays: presentDays,
            absentDays: absentDays,
            lateDays: lateDays,
        };
    }
}

// Example Usage:
const tracker = new AttendanceTracker();

// Adding Students
const student1 = new Student("Alice Smith", "AS123");
const student2 = new Student("Bob Johnson", "BJ456");
tracker.addStudent(student1);
tracker.addStudent(student2);

// Recording Attendance
tracker.recordAttendance("AS123", new Date("2024-07-15"), "present");
tracker.recordAttendance("BJ456", new Date("2024-07-15"), "absent");
tracker.recordAttendance("AS123", new Date("2024-07-16"), "late");

// Generating Summary
const summary = tracker.generateAttendanceSummary("AS123");
console.log(summary);
