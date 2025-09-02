import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Landing from "./pages/Landing";
import ContactPage from "./pages/contactpage";
import Login from "./pages/Login";   // new login page
import EmailOtp from "./pages/EmailOtp";
import PhoneVerification from "./pages/PhoneVerification";
import Signup from "./pages/Signup";
import StudentForm from "./pages/StudentForm";
import MentorForm from "./pages/MentorForm";
import EventOrganizer from "./pages/EventOrganizer";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
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
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
