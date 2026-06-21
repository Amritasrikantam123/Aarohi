import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Registration from "./components/Registration";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { getDB, saveDB } from "./data/mockData";
import { ShieldCheck, UserCheck, Eye } from "lucide-react";

export default function App() {
  const [db, setDb] = useState(() => getDB());
  const [currentPage, setCurrentPage] = useState("landing"); // landing, register, dashboard, admin, mentorRegister
  const [currentLang, setCurrentLang] = useState(db.language || "en");
  const [studentProfile, setStudentProfile] = useState(db.studentProfile);
  const [activePersona, setActivePersona] = useState("guest"); // guest, student, admin

  useEffect(() => {
    // Sync language preference in db
    const updatedDb = { ...db, language: currentLang };
    setDb(updatedDb);
    saveDB(updatedDb);
  }, [currentLang]);

  const handleRegistrationSuccess = (newProfile) => {
    const freshDb = getDB();
    freshDb.studentProfile = newProfile;
    saveDB(freshDb);
    
    setDb(freshDb);
    setStudentProfile(newProfile);
    setActivePersona("student");
    setCurrentPage("dashboard");
  };

  const handlePersonaChange = (persona) => {
    setActivePersona(persona);
    const freshDb = getDB();
    if (persona === "guest") {
      setCurrentPage("landing");
    } else if (persona === "student") {
      setStudentProfile(freshDb.studentProfile);
      setCurrentPage("dashboard");
    } else if (persona === "admin") {
      setCurrentPage("admin");
    }
  };

  const handleUpdateProfile = (updatedProfile) => {
    const freshDb = getDB();
    freshDb.studentsList = freshDb.studentsList.map(s => s.id === updatedProfile.id ? updatedProfile : s);
    freshDb.studentProfile = updatedProfile;
    saveDB(freshDb);
    
    setDb(freshDb);
    setStudentProfile(updatedProfile);
  };

  return (
    <div>
      {/* Professional Portal Access Controller */}
      <div className="persona-switcher" style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "var(--shadow-premium)"
      }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <Eye size={12} />
          {currentLang === "hi" ? "गेटवे:" : currentLang === "te" ? "గేట్‌వే:" : "Gateway:"}
        </span>
        <button 
          className={`persona-btn ${activePersona === "guest" ? "active" : ""}`}
          onClick={() => handlePersonaChange("guest")}
          style={{ fontSize: "0.75rem", padding: "4px 8px" }}
        >
          {currentLang === "hi" ? "पब्लिक" : currentLang === "te" ? "పబ్లిక్" : "Public"}
        </button>
        <button 
          className={`persona-btn ${activePersona === "student" ? "active" : ""}`}
          onClick={() => {
            const dbRef = getDB();
            if (dbRef.studentsList.length === 0) {
              alert(currentLang === "hi" 
                ? "कोई पंजीकृत छात्रा नहीं मिली। कृपया पहले पंजीकरण करें।" 
                : currentLang === "te" 
                ? "ఎటువంటి నమోదైన విద్యార్థినులు లేరు. దయచేసి మొదట రిజిస్టర్ చేసుకోండి." 
                : "No student accounts found. Please register first.");
              setCurrentPage("register");
            } else {
              handlePersonaChange("student");
            }
          }}
          style={{ fontSize: "0.75rem", padding: "4px 8px" }}
        >
          {currentLang === "hi" ? "स्टूडेंट" : currentLang === "te" ? "స్టూడెంట్" : "Student"}
        </button>
        <button 
          className={`persona-btn ${activePersona === "admin" ? "active" : ""}`}
          onClick={() => handlePersonaChange("admin")}
          style={{ fontSize: "0.75rem", padding: "4px 8px" }}
        >
          {currentLang === "hi" ? "एडमिन" : currentLang === "te" ? "అడ్మిన్" : "Admin"}
        </button>
      </div>

      {/* Pages Switch Router */}
      {currentPage === "landing" && (
        <LandingPage 
          onRegisterClick={() => setCurrentPage("register")}
          onExploreOpportunities={() => {
            if (activePersona === "student") {
              setCurrentPage("dashboard");
            } else {
              setCurrentPage("register");
            }
          }}
          onExploreCareers={() => {
            if (activePersona === "student") {
              setCurrentPage("dashboard");
            } else {
              setCurrentPage("register");
            }
          }}
          onLoginClick={() => {
            const dbRef = getDB();
            if (dbRef.studentsList.length === 0) {
              alert(currentLang === "hi" 
                ? "कोई पंजीकृत छात्रा नहीं मिली। कृपया पहले पंजीकरण करें।" 
                : currentLang === "te" 
                ? "ఎటువంటి నమోదైన విద్యార్థినులు లేరు. దయచేసి మొదట రిజిస్టర్ చేసుకోండి." 
                : "No student accounts found. Please register first.");
              setCurrentPage("register");
            } else {
              setStudentProfile(dbRef.studentsList[0]);
              setActivePersona("student");
              setCurrentPage("dashboard");
            }
          }}
          onLangChange={(lang) => setCurrentLang(lang)}
          currentLang={currentLang}
          onMentorRegisterClick={() => {
            setActivePersona("guest");
            setCurrentPage("mentorRegister");
          }}
        />
      )}

      {currentPage === "register" && (
        <Registration 
          onBackToHome={() => setCurrentPage("landing")}
          onRegistrationSuccess={handleRegistrationSuccess}
          currentLang={currentLang}
        />
      )}

      {currentPage === "mentorRegister" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          {/* Lazy load components as needed or simulate inside register/opportunities */}
          {/* We will route student/mentors correctly */}
          <Registration 
            isMentorMode={true}
            onBackToHome={() => setCurrentPage("landing")}
            onRegistrationSuccess={() => {
              setCurrentPage("landing");
            }}
            currentLang={currentLang}
          />
        </div>
      )}

      {currentPage === "dashboard" && studentProfile && (
        <StudentDashboard 
          studentProfile={studentProfile}
          onUpdateProfile={handleUpdateProfile}
          onLogout={() => {
            setActivePersona("guest");
            setCurrentPage("landing");
          }}
          currentLang={currentLang}
        />
      )}

      {currentPage === "admin" && (
        <div className="dashboard-container">
          {/* Admin Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={28} color="#D946EF" />
                <span className="sidebar-logo" style={{ fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
                  {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
                </span>
              </div>
            </div>
            
            <ul className="sidebar-menu">
              <li>
                <span className="sidebar-item active">
                  <UserCheck size={18} />
                  <span>{currentLang === "hi" ? "एडमिन कंट्रोल" : currentLang === "te" ? "అడ్మిన్ నియంత్రణ" : "Admin Control"}</span>
                </span>
              </li>
            </ul>

            <div style={{ padding: "1.5rem", marginTop: "auto" }}>
              <button 
                onClick={() => {
                  setActivePersona("guest");
                  setCurrentPage("landing");
                }}
                style={{
                  width: "100%",
                  background: "none",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  padding: "0.6rem",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {currentLang === "hi" ? "एडमिन से बाहर निकलें" : currentLang === "te" ? "అడ్మిన్ నుండి నిష్క్రమించు" : "Exit Admin Control"}
              </button>
            </div>
          </aside>

          {/* Admin Main content */}
          <div className="dashboard-content-wrapper">
            <header className="dashboard-header">
              <div className="header-left">
                <span className="logo-hindi-nav" style={{ fontSize: "1.4rem", fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
                  {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#6b21a8", background: "#f3e8ff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                  {currentLang === "hi" ? "मंत्रालय पोर्टल: राष्ट्रीय संचालक" : currentLang === "te" ? "మంత్రిత్వ శాఖ పోర్టల్: అడ్మిన్" : "Ministry Portal: National Director"}
                </span>
              </div>
            </header>

            <main className="dashboard-main">
              <AdminDashboard currentLang={currentLang} />
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
