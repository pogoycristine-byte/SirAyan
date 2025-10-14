import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice', present: false },
    { id: 2, name: 'Bob', present: false },
    { id: 3, name: 'Charlie', present: false },
  ]);

  const [darkMode, setDarkMode] = useState(false);

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const resetAttendance = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, present: false })));
  };

  return (
    <AppContext.Provider
      value={{ students, toggleAttendance, resetAttendance, darkMode, setDarkMode }}
    >
      {children}
    </AppContext.Provider>
  );
};
                                            
