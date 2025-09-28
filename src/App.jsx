import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Landing from "./pages/Landing";
import ContactPage from "./pages/contactpage";
import Login from "./pages/Login";
import EmailOtp from "./pages/EmailOtp";
import PhoneVerification from "./pages/PhoneVerification";
import Signup from "./pages/Signup";
import StudentForm from "./pages/StudentForm";
import MentorForm from "./pages/MentorForm";
import EventOrganizer from "./pages/EventOrganizer";
import HomePage from "./pages/HomePage";
import StudentProfile from "./pages/StudentProfile";
import OrganizerProfile from "./pages/OrganizerProfile";
import MentorProfile from "./pages/MentorProfile";
import Events from "./pages/Events";
import Mentors from "./pages/Mentors";
import Settings from "./pages/Settings";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAppPage = ['/home', '/student-profile', '/organizer-profile', '/mentor-profile', '/events', '/mentors', '/settings'].includes(location.pathname);

  return (
    <AuthProvider>
      {!isLoginPage && !isAppPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<EmailOtp />} />
        <Route path="/phone-verification" element={<PhoneVerification />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/mentor-form" element={<MentorForm />} />
        <Route path="/event-organizer" element={<EventOrganizer />} />
        
        {/* App Routes (with sidebar) */}
        <Route path="/home" element={<HomePage />} />
        <Route 
          path="/student-profile" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organizer-profile" 
          element={
            <ProtectedRoute requiredRole="organizer">
              <OrganizerProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentor-profile" 
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorProfile />
            </ProtectedRoute>
          } 
        />
        <Route path="/events" element={<Events />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {!isLoginPage && !isAppPage && <Footer />}
    </AuthProvider>
  );
}

export default App;
