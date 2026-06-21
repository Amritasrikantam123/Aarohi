import React, { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Cpu, 
  Rocket, 
  Users, 
  Scale, 
  Menu, 
  Bell, 
  LogOut, 
  Home, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  Send,
  Sparkles,
  User
} from "lucide-react";
import { getDB, saveDB, logActivity } from "../data/mockData";
import AcademicTracker from "./AcademicTracker";
import ScholarshipHub from "./ScholarshipHub";
import CareerGuidance from "./CareerGuidance";
import Opportunities from "./Opportunities";
import Mentorship from "./Mentorship";
import GrievancePortal from "./GrievancePortal";
import StudentProfileView from "./StudentProfileView";

export default function StudentDashboard({ studentProfile, onUpdateProfile, onLogout, currentLang }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Success story submission states
  const [storyInput, setStoryInput] = useState("");
  const [storyStatus, setStoryStatus] = useState(studentProfile.featuredStory?.isFeatured ? "submitted" : "idle");

  const db = getDB();

  // Calculations for KPI Metrics
  const latestPercentage = studentProfile.academicRecords.length > 0 
    ? studentProfile.academicRecords[studentProfile.academicRecords.length - 1].marksPercentage 
    : 75;

  const eligibleScholarshipsCount = db.scholarships.filter(s => {
    return latestPercentage >= s.eligibility.minMarks && studentProfile.familyIncome <= s.eligibility.maxIncome;
  }).length;

  const activeBookingsCount = studentProfile.bookedSessions ? studentProfile.bookedSessions.length : 0;
  const pendingGrievancesCount = db.grievances.filter(g => g.studentId === studentProfile.id && g.status !== "Resolved").length;

  // Real Database Counts for Dashboard footer
  const realStudentCount = db.studentsList.length;
  const realMentorCount = db.mentors.filter(m => m.status === "approved").length;
  const uniqueStatesCount = new Set([
    ...db.studentsList.map(s => s.state).filter(Boolean),
    ...db.mentors.map(m => m.state).filter(Boolean)
  ]).size;

  const handleStorySubmit = (e) => {
    e.preventDefault();
    if (!storyInput.trim() || storyInput.trim().length < 10) {
      alert("Please write a meaningful success story before submitting.");
      return;
    }

    const updatedProfile = {
      ...studentProfile,
      featuredStory: {
        isFeatured: true,
        quoteEn: storyInput,
        quoteHi: storyInput, // Will be customized by administrator during approval
        quoteTe: storyInput,
        approved: false // Needs admin review
      }
    };

    onUpdateProfile(updatedProfile);
    setStoryStatus("submitted");
    
    logActivity(
      `Student ${studentProfile.name} submitted a success story for verification.`,
      `छात्रा ${studentProfile.name} ने सत्यापन के लिए अपनी सफलता की कहानी दर्ज की।`,
      `విద్యార్థిని ${studentProfile.name} తన విజయగాథను ధృవీకరణ కొరకు సమర్పించారు.`
    );

    alert("Success story submitted to administrators for verification review!");
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderHomeTab();
      case "profile":
        return <StudentProfileView studentProfile={studentProfile} onUpdateProfile={onUpdateProfile} currentLang={currentLang} />;
      case "academic":
        return <AcademicTracker studentProfile={studentProfile} onUpdateProfile={onUpdateProfile} currentLang={currentLang} />;
      case "scholarships":
        return <ScholarshipHub studentProfile={studentProfile} onUpdateProfile={onUpdateProfile} currentLang={currentLang} />;
      case "careers":
        return <CareerGuidance studentProfile={studentProfile} currentLang={currentLang} />;
      case "opportunities":
        return <Opportunities currentLang={currentLang} />;
      case "mentorship":
        return <Mentorship studentProfile={studentProfile} onUpdateProfile={onUpdateProfile} currentLang={currentLang} />;
      case "grievance":
        return <GrievancePortal studentProfile={studentProfile} currentLang={currentLang} />;
      default:
        return renderHomeTab();
    }
  };

  const renderHomeTab = () => {
    const miniChartPoints = studentProfile.academicRecords.map((r, i) => {
      const x = 20 + i * 80;
      const y = 90 - (r.marksPercentage - 50) * 1.5;
      return `${x},${y}`;
    }).join(" ");

    return (
      <div className="student-home-view" style={{ animation: "modalIn 0.3s ease" }}>
        {/* Welcome Banner */}
        <div className="welcome-banner" style={{ background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)" }}>
          <div>
            <h2>{currentLang === "hi" ? `स्वागत है, ${studentProfile.name}! 👋` : currentLang === "te" ? `స్వాగతం, ${studentProfile.name}! 👋` : `Welcome back, ${studentProfile.name}! 👋`}</h2>
            <p>{currentLang === "hi" ? "सीखते रहें, आगे बढ़ते रहें। आपका सपना ही हमारा मिशन है।" : currentLang === "te" ? "కొత్త విషయాలు నేర్చుకోండి, ఎదుగుతూ ఉండండి. మీ కలల సాకారం మా ధ్యేయం." : "Keep learning, keep growing. Your dream is our mission."}</p>
          </div>
          <GraduationCap size={48} opacity={0.2} strokeWidth={1.5} />
        </div>

        {/* Metrics KPI Row */}
        <div className="metrics-row">
          <div className="metric-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("academic")}>
            <div className="metric-header">
              <span>{currentLang === "hi" ? "शैक्षणिक प्रगति" : currentLang === "te" ? "విద్యా పురోగతి" : "ACADEMIC PROGRESS"}</span>
              <TrendingUp size={16} color="var(--primary-color)" />
            </div>
            <div className="metric-value-row">
              <div className="metric-value">{latestPercentage}%</div>
              <div className="metric-subtext green">{currentLang === "hi" ? "उत्कृष्ट प्रगति!" : currentLang === "te" ? "మంచి పురోగతి!" : "Great Progress!"}</div>
            </div>
          </div>

          <div className="metric-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("scholarships")}>
            <div className="metric-header">
              <span>{currentLang === "hi" ? "छात्रवृत्ति पात्रता" : currentLang === "te" ? "స్కాలర్‌షిప్స్ అర్హత" : "SCHOLARSHIPS ELIGIBLE"}</span>
              <Award size={16} color="var(--secondary-color)" />
            </div>
            <div className="metric-value-row">
              <div className="metric-value">{eligibleScholarshipsCount}</div>
              <div className="metric-subtext blue">{currentLang === "hi" ? "अभी आवेदन करें" : currentLang === "te" ? "ఇప్పుడే దరఖాస్తు చేసుకోండి" : "Apply Now"}</div>
            </div>
          </div>

          <div className="metric-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("mentorship")}>
            <div className="metric-header">
              <span>{currentLang === "hi" ? "बुक की गई कॉल" : currentLang === "te" ? "మెంటార్ కాల్స్" : "MENTORSHIP CALLS"}</span>
              <Users size={16} color="var(--accent-color)" />
            </div>
            <div className="metric-value-row">
              <div className="metric-value">{activeBookingsCount}</div>
              <div className="metric-subtext orange">{currentLang === "hi" ? "निर्धारित" : currentLang === "te" ? "షెడ్యూల్డ్" : "Scheduled"}</div>
            </div>
          </div>

          <div className="metric-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("grievance")}>
            <div className="metric-header">
              <span>{currentLang === "hi" ? "सक्रिय शिकायतें" : currentLang === "te" ? "సమస్యల స్థితి" : "GRIEVANCE STATUS"}</span>
              <Scale size={16} color="#ef4444" />
            </div>
            <div className="metric-value-row">
              <div className="metric-value" style={{ color: pendingGrievancesCount > 0 ? "#ef4444" : "var(--text-main)" }}>{pendingGrievancesCount}</div>
              <div className="metric-subtext red">{pendingGrievancesCount > 0 ? "Open Ticket" : "No Active Issue"}</div>
            </div>
          </div>
        </div>

        {/* Splits Column */}
        <div className="dashboard-grid-two-col">
          <div>
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">{currentLang === "hi" ? "प्रदर्शन चार्ट" : currentLang === "te" ? "విద్యా పురోగతి చార్ట్" : "Performance Overview"}</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "130px", marginTop: "1rem" }}>
                <div style={{ flexGrow: 1, maxWidth: "340px" }}>
                  {studentProfile.academicRecords.length > 1 ? (
                    <svg viewBox="0 0 320 100" width="100%" height="80" style={{ overflow: "visible" }}>
                      <polyline points={miniChartPoints} fill="none" stroke="var(--primary-color)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      {studentProfile.academicRecords.map((r, i) => (
                        <circle key={i} cx={20 + i * 80} cy={90 - (r.marksPercentage - 50) * 1.5} r="4.5" fill="#fff" stroke="var(--primary-color)" strokeWidth="2.5" />
                      ))}
                    </svg>
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {currentLang === "hi" ? "प्रगति विश्लेषण देखने के लिए अधिक अंक दर्ज करें।" : currentLang === "te" ? "పురోగతి విశ్లేషణను చూడటానికి మరిన్ని మార్కులు నమోదు చేయండి." : "Add more marks records to see growth trends."}
                    </div>
                  )}
                </div>
                <div style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "1.5rem", minWidth: "120px" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{currentLang === "hi" ? "औसत अंक" : currentLang === "te" ? "సగటు మార్కులు" : "Average Marks"}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-color)" }}>
                    {Math.round(studentProfile.academicRecords.reduce((acc, curr) => acc + curr.marksPercentage, 0) / studentProfile.academicRecords.length)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Success Story submission desk */}
            <div className="dashboard-card" style={{ borderLeft: "4px solid var(--secondary-color)" }}>
              <h3 className="dashboard-card-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} color="var(--secondary-color)" />
                <span>{currentLang === "hi" ? "सफलता की कहानी साझा करें" : currentLang === "te" ? "మీ విజయగాథను తెలియజేయండి" : "Submit Your Success Story"}</span>
              </h3>
              
              {storyStatus === "idle" && (
                <form onSubmit={handleStorySubmit} style={{ marginTop: "1rem" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    Share how the Aarohi platform, scholarships, or mentors helped you continue your high school or college studies. 
                  </p>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Type your story here (minimum 10 characters)..." 
                    value={storyInput} 
                    onChange={e => setStoryInput(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ marginTop: "0.75rem", padding: "6px 12px", fontSize: "0.8rem" }}>
                    <Send size={12} /> Submit for Verification
                  </button>
                </form>
              )}

              {storyStatus === "submitted" && (
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Your success story is under verification review by administrators. Thank you!</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">{currentLang === "hi" ? "त्वरित क्रियाएं" : currentLang === "te" ? "త్వరిత చర్యలు" : "Quick Actions"}</h3>
              <div className="quick-actions-list" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "1rem" }}>
                <button className="quick-action-btn" onClick={() => setActiveTab("academic")}>
                  ✏️ Update Marks Record
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab("scholarships")}>
                  🔍 Search Scholarships
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab("careers")}>
                  🎓 Explore Careers
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab("opportunities")}>
                  💼 Find Opportunities
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab("mentorship")}>
                  🗓️ Book Mentor Session
                </button>
                <button className="quick-action-btn" style={{ color: "#ef4444" }} onClick={() => setActiveTab("grievance")}>
                  ⚠️ Raise a Grievance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real Dynamic Stats Footer Banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--bg-dark) 0%, #1e1b4b 100%)",
          color: "#fff",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          textAlign: "center",
          gap: "1.5rem",
          marginTop: "2rem"
        }}>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{uniqueStatesCount} State(s)</div>
            <div style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>Active National Scope</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{realStudentCount}</div>
            <div style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>Registered Live Girls</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{realMentorCount}</div>
            <div style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>Verified Mentors Onboarded</div>
          </div>
        </div>

      </div>
    );
  };

  const menuItems = [
    { id: "dashboard", label: currentLang === "hi" ? "डैशबोर्ड" : currentLang === "te" ? "డ్యాష్‌బోర్డ్" : "Dashboard", icon: Home },
    { id: "profile", label: currentLang === "hi" ? "मेरी प्रोफाइल" : currentLang === "te" ? "నా ప్రొఫైల్" : "My Profile", icon: User },
    { id: "academic", label: currentLang === "hi" ? "शैक्षणिक प्रगति" : currentLang === "te" ? "విద్యా పురోగతి" : "Academic Progress", icon: TrendingUp },
    { id: "scholarships", label: currentLang === "hi" ? "छात्रवृत्तियां" : currentLang === "te" ? "స్కాలర్‌షిప్స్" : "Scholarships", icon: Award },
    { id: "careers", label: currentLang === "hi" ? "करियर मार्ग" : currentLang === "te" ? "కెరీర్ మార్గదర్శకత్వం" : "Career Guidance", icon: Cpu },
    { id: "opportunities", label: currentLang === "hi" ? "इंटर्नशिप और अवसर" : currentLang === "te" ? "అవకాశాలు" : "Opportunities", icon: Rocket },
    { id: "mentorship", label: currentLang === "hi" ? "मेंटरशिप" : currentLang === "te" ? "మెంటార్‌షిప్" : "Mentorship", icon: Users },
    { id: "grievance", label: currentLang === "hi" ? "शिकायत और सहायता" : currentLang === "te" ? "సమస్యల నివారణ" : "Grievance & Support", icon: Scale }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GraduationCap size={28} color="#818cf8" />
            <span className="sidebar-logo" style={{ fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
              {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
            </span>
          </div>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <span 
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div style={{ padding: "1.5rem", borderTop: "1px solid #1e1b4b" }}>
          <button 
            onClick={onLogout}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <LogOut size={16} />
            <span>{currentLang === "hi" ? "लॉगआउट" : currentLang === "te" ? "లాగౌట్" : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="dashboard-content-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="menu-toggle-btn" 
              style={{ display: "block" }} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="logo-hindi-nav" style={{ fontSize: "1.4rem", fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
                {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "var(--lavender-bg)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                {currentLang === "hi" ? "छात्रा डैशबोर्ड" : currentLang === "te" ? "విద్యార్థి డ్యాష్‌బోర్డ్" : "Student Dashboard"}
              </span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-profile-badge" onClick={() => setActiveTab("profile")} style={{ cursor: "pointer" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-color)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700
              }}>
                {studentProfile.name.charAt(0)}
              </div>
              <div className="user-details">
                <span className="user-name">{studentProfile.name}</span>
                <span className="user-role">{studentProfile.class}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          {renderActiveContent()}
        </main>
      </div>
    </div>
  );
}
