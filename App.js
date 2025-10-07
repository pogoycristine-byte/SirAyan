import React, { useState } from "react";
import Account from "./Pages/Account/Account";
import TeacherDashboard from "./Pages/Teacher/Dashboard";
import StudentDashboard from "./Pages/Student/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  const handleRegister = (registeredUser) => setUser(registeredUser);
  const handleLogout = () => setUser(null);

  if (!user) return <Account onRegister={handleRegister} />;

  return user.role === "teacher" ? (
    <TeacherDashboard onLogout={handleLogout} />
  ) : (
    <StudentDashboard onLogout={handleLogout} />
  );
}
