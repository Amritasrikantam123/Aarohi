import React, { useState } from "react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  BarChart2, 
  ShieldAlert, 
  Award, 
  ThumbsUp, 
  Eye, 
  Trash2,
  Edit2,
  Sliders,
  Play
} from "lucide-react";
import { getDB, saveDB, logActivity } from "../data/mockData";

export default function AdminDashboard({ currentLang }) {
  const [dbState, setDbState] = useState(() => getDB());
  const [activeSubTab, setActiveSubTab] = useState("analytics"); // analytics, mentors, students, scholarships, events
  
  // Modals / Editing states
  const [featuringStudent, setFeaturingStudent] = useState(null);
  const [storyQuoteEn, setStoryQuoteEn] = useState("");
  const [storyQuoteHi, setStoryQuoteHi] = useState("");
  const [storyQuoteTe, setStoryQuoteTe] = useState("");
  const [storyError, setStoryError] = useState("");

  const [editingScholarship, setEditingScholarship] = useState(null);
  const [schTitle, setSchTitle] = useState("");
  const [schProvider, setSchProvider] = useState("");
  const [schAmount, setSchAmount] = useState("");
  const [schDeadline, setSchDeadline] = useState("");
  const [schCategory, setSchCategory] = useState("Government");

  const [newEventTextEn, setNewEventTextEn] = useState("");
  const [newEventTextHi, setNewEventTextHi] = useState("");
  const [newEventTextTe, setNewEventTextTe] = useState("");

  const reloadDB = () => {
    setDbState(getDB());
  };

  // --- Mentor Verification Actions ---
  const handleApproveMentor = (mentor) => {
    const db = getDB();
    db.pendingMentors = db.pendingMentors.filter(pm => pm.id !== mentor.id);
    const approved = {
      ...mentor,
      status: "approved",
      availStatus: "Available"
    };
    db.mentors = [approved, ...db.mentors];
    saveDB(db);
    reloadDB();
    logActivity(
      `Mentor ${mentor.name} has been verified.`,
      `मार्गदर्शक ${mentor.name} को सत्यापित किया गया है।`,
      `మెంటార్ ${mentor.name} విజయవంతంగా ధృవీకరించబడ్డారు.`
    );
  };

  const handleRejectMentor = (id) => {
    const db = getDB();
    const mentor = db.pendingMentors.find(pm => pm.id === id);
    db.pendingMentors = db.pendingMentors.filter(pm => pm.id !== id);
    saveDB(db);
    reloadDB();
    if (mentor) {
      logActivity(
        `Mentor application rejected for ${mentor.name}.`,
        `मार्गदर्शक आवेदन ${mentor.name} के लिए अस्वीकार कर दिया गया।`,
        `మెంటార్ ${mentor.name} దరఖాస్తు తిరస్కరించబడింది.`
      );
    }
  };

  const handleSuspendMentor = (id) => {
    const db = getDB();
    const mentor = db.mentors.find(m => m.id === id);
    if (mentor) {
      db.mentors = db.mentors.filter(m => m.id !== id);
      db.pendingMentors = [...db.pendingMentors, { ...mentor, status: "pending" }];
      saveDB(db);
      reloadDB();
      logActivity(
        `Mentor ${mentor.name} has been suspended.`,
        `मार्गदर्शक ${mentor.name} को निलंबित कर दिया गया।`,
        `మెంటార్ ${mentor.name} తాత్కాలికంగా నిలిపివేయబడ్డారు.`
      );
    }
  };

  // --- Success Story Actions ---
  const openFeatureModal = (student) => {
    setFeaturingStudent(student);
    setStoryQuoteEn(student.featuredStory?.quoteEn || "");
    setStoryQuoteHi(student.featuredStory?.quoteHi || "");
    setStoryQuoteTe(student.featuredStory?.quoteTe || "");
    setStoryError("");
  };

  const handleFeatureStudentSubmit = (e) => {
    e.preventDefault();
    if (!storyQuoteEn.trim() || !storyQuoteHi.trim() || !storyQuoteTe.trim()) {
      setStoryError("Please enter success story quotes for all three languages.");
      return;
    }

    const db = getDB();
    db.studentsList = db.studentsList.map(s => {
      if (s.id === featuringStudent.id) {
        return {
          ...s,
          featuredStory: {
            isFeatured: true,
            quoteEn: storyQuoteEn,
            quoteHi: storyQuoteHi,
            quoteTe: storyQuoteTe,
            approved: true
          }
        };
      }
      return s;
    });

    saveDB(db);
    reloadDB();
    setFeaturingStudent(null);
    logActivity(
      `Success story published for student ${featuringStudent.name}.`,
      `छात्रा ${featuringStudent.name} के लिए सफलता की कहानी प्रकाशित की गई।`,
      `విద్యార్థిని ${featuringStudent.name} విజయగాథ ప్రచురించబడింది.`
    );
  };

  const handleRemoveSuccessStory = (studentId, studentName) => {
    const db = getDB();
    db.studentsList = db.studentsList.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          featuredStory: {
            isFeatured: false,
            quoteEn: "",
            quoteHi: "",
            quoteTe: "",
            approved: false
          }
        };
      }
      return s;
    });
    saveDB(db);
    reloadDB();
    logActivity(
      `Success story removed for ${studentName}.`,
      `सफलता की कहानी ${studentName} के लिए हटा दी गई।`,
      `విజయగాథ తిరస్కరించబడింది.`
    );
  };

  // --- Scholarship Actions ---
  const handleSaveScholarship = (e) => {
    e.preventDefault();
    if (!schTitle || !schProvider || !schAmount || !schDeadline) return;

    const db = getDB();
    if (editingScholarship && editingScholarship !== "new") {
      db.scholarships = db.scholarships.map(s => s.id === editingScholarship ? {
        ...s,
        title: schTitle,
        provider: schProvider,
        amount: schAmount,
        deadline: schDeadline,
        category: schCategory
      } : s);
    } else {
      db.scholarships.push({
        id: "s_" + Date.now(),
        title: schTitle,
        provider: schProvider,
        amount: schAmount,
        deadline: schDeadline,
        category: schCategory,
        eligibility: { minMarks: 60, maxIncome: 500000, classRequired: "10th Passed", description: "Updated scheme details." }
      });
    }
    saveDB(db);
    reloadDB();
    setEditingScholarship(null);
    setSchTitle("");
    setSchProvider("");
    setSchAmount("");
    setSchDeadline("");
  };

  const handleDeleteScholarship = (id) => {
    const db = getDB();
    db.scholarships = db.scholarships.filter(s => s.id !== id);
    saveDB(db);
    reloadDB();
  };

  // --- Live Activity Feed Event Actions ---
  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!newEventTextEn || !newEventTextHi || !newEventTextTe) return;
    logActivity(newEventTextEn, newEventTextHi, newEventTextTe);
    reloadDB();
    setNewEventTextEn("");
    setNewEventTextHi("");
    setNewEventTextTe("");
  };

  // --- Dynamic Live Metrics (Computed from DB) ---
  const girlsCount = dbState.studentsList.length;
  const verifiedMentorsCount = dbState.mentors.filter(m => m.status === "approved").length;
  const pendingMentorsCount = dbState.pendingMentors.length;
  const scholarshipsAwarded = dbState.studentsList.reduce(
    (sum, s) => sum + s.appliedScholarships.filter(as => as.status === "Approved").length, 
    0
  );
  const totalScholarshipsCount = dbState.scholarships.length;

  // Compute state-wise distribution for dynamic analytics
  const stateDistribution = {};
  dbState.studentsList.forEach(s => {
    if (s.state) {
      stateDistribution[s.state] = (stateDistribution[s.state] || 0) + 1;
    }
  });

  // KPI Array
  const statesNum = new Set([
    ...dbState.studentsList.map(s => s.state).filter(Boolean),
    ...dbState.mentors.map(m => m.state).filter(Boolean)
  ]).size;

  return (
    <div>
      {/* Sub tabs Administration Menu */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", flexWrap: "wrap" }}>
        <button 
          className={`persona-btn ${activeSubTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveSubTab("analytics")}
        >
          <BarChart2 size={14} style={{ marginRight: "4px" }} />
          {currentLang === "hi" ? "लाइव डेटा और विश्लेषिकी" : currentLang === "te" ? "లైవ్ డేటా & అనలిటిక్స్" : "Live Data & Analytics"}
        </button>

        <button 
          className={`persona-btn ${activeSubTab === "mentors" ? "active" : ""}`}
          onClick={() => setActiveSubTab("mentors")}
          style={{ position: "relative" }}
        >
          <Users size={14} style={{ marginRight: "4px" }} />
          {currentLang === "hi" ? "मार्गदर्शक सत्यापन" : currentLang === "te" ? "మెంటార్ల ధృవీకరణ" : "Mentor Verifications"}
          {pendingMentorsCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "var(--secondary-color)",
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "10px"
            }}>
              {pendingMentorsCount}
            </span>
          )}
        </button>

        <button 
          className={`persona-btn ${activeSubTab === "students" ? "active" : ""}`}
          onClick={() => setActiveSubTab("students")}
        >
          <Award size={14} style={{ marginRight: "4px" }} />
          {currentLang === "hi" ? "सफलता की कहानियां" : currentLang === "te" ? "విజయగాథలు" : "Success Stories"}
        </button>

        <button 
          className={`persona-btn ${activeSubTab === "scholarships" ? "active" : ""}`}
          onClick={() => setActiveSubTab("scholarships")}
        >
          <Award size={14} style={{ marginRight: "4px" }} />
          {currentLang === "hi" ? "छात्रवृत्ति योजनाएं" : currentLang === "te" ? "స్కాలర్‌షిప్ పథకాలు" : "Scholarship Schemes"}
        </button>

        <button 
          className={`persona-btn ${activeSubTab === "events" ? "active" : ""}`}
          onClick={() => setActiveSubTab("events")}
        >
          <Sliders size={14} style={{ marginRight: "4px" }} />
          {currentLang === "hi" ? "प्लेटफॉर्म गतिविधियां" : currentLang === "te" ? "ప్లాట్‌ఫారమ్ ఈవెంట్స్" : "Platform Activities"}
        </button>
      </div>

      {/* SUB TAB 1: ANALYTICS & KPIS */}
      {activeSubTab === "analytics" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          
          <div className="metrics-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div className="metric-card" style={{ background: "#fff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>REGISTERED GIRLS</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-color)" }}>{girlsCount}</div>
              <span style={{ fontSize: "0.75rem", color: "#10b981" }}>● Real database count</span>
            </div>

            <div className="metric-card" style={{ background: "#fff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>VERIFIED MENTORS</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary-color)" }}>{verifiedMentorsCount}</div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pending approvals: {pendingMentorsCount}</span>
            </div>

            <div className="metric-card" style={{ background: "#fff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>SCHOLARSHIPS AWARDED</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-color)" }}>{scholarshipsAwarded}</div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Active Schemes: {totalScholarshipsCount}</span>
            </div>

            <div className="metric-card" style={{ background: "#fff", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>STATES REACHED</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>{statesNum}</div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>National scope footprint</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            {/* Dynamic registration distribution chart */}
            <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>State-Wise Distribution Analytics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1.5rem" }}>
                {Object.keys(stateDistribution).length > 0 ? (
                  Object.entries(stateDistribution).map(([state, count]) => {
                    const percent = Math.round((count / girlsCount) * 100);
                    return (
                      <div key={state} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ width: "120px", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>{state}</span>
                        <div style={{ flex: 1, backgroundColor: "var(--border-color)", height: "16px", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ backgroundColor: "var(--primary-color)", width: `${percent}%`, height: "100%", borderRadius: "10px", transition: "width 0.5s ease" }}></div>
                        </div>
                        <span style={{ width: "40px", fontSize: "0.85rem", fontWeight: 700, textAlign: "right" }}>{count}</span>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No state data logged yet.</p>
                )}
              </div>
            </div>

            <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>System Integrity Status</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", fontSize: "0.85rem" }}>
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Student Nodes:</span>
                  <strong style={{ color: "var(--text-main)" }}>{girlsCount}</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Academic Transcripts:</span>
                  <strong style={{ color: "var(--text-main)" }}>{dbState.studentsList.reduce((sum, s) => sum + s.academicRecords.length, 0)}</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Active Mentorship Nodes:</span>
                  <strong style={{ color: "var(--text-main)" }}>{dbState.mentors.length}</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Platform Database Version:</span>
                  <strong style={{ color: "var(--primary-color)" }}>v2.01 (Local Relational)</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: MENTOR VERIFICATIONS */}
      {activeSubTab === "mentors" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          
          {/* Pending applications */}
          <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Pending Mentor Applications ({pendingMentorsCount})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {dbState.pendingMentors.length > 0 ? (
                dbState.pendingMentors.map(m => (
                  <div key={m.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "1.25rem", backgroundColor: "#fff8f8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{m.name}</h4>
                        <div style={{ fontSize: "0.82rem", color: "var(--primary-color)", fontWeight: 600 }}>{m.role} @ {m.organization} ({m.state})</div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}><strong>Bio:</strong> {m.bio}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Languages: <strong>{m.languages.join(", ")}</strong> | Experience: <strong>{m.experience}</strong></p>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.78rem", color: "#ef4444", borderColor: "#fca5a5" }} onClick={() => handleRejectMentor(m.id)}>
                          Reject
                        </button>
                        <button className="btn-primary" style={{ padding: "4px 10px", fontSize: "0.78rem", background: "#10b981" }} onClick={() => handleApproveMentor(m)}>
                          Verify and Activate
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No pending mentor applications.</p>
              )}
            </div>
          </div>

          {/* Active Mentors Management */}
          <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Active Mentor Roster ({verifiedMentorsCount})</h3>
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role & Company</th>
                    <th>Field</th>
                    <th>State</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dbState.mentors.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700 }}>{m.name}</td>
                      <td>{m.role} @ {m.organization}</td>
                      <td>{m.field}</td>
                      <td>{m.state}</td>
                      <td><span className="badge success">Verified</span></td>
                      <td>
                        <button className="btn-secondary" style={{ padding: "2px 8px", fontSize: "0.72rem", color: "#ef4444", borderColor: "#fca5a5" }} onClick={() => handleSuspendMentor(m.id)}>
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: SUCCESS STORY MODERATION */}
      {activeSubTab === "students" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Success Story Moderation Desk</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Student success stories must be curated and verified by administration before appearing on the public homepage.
            </p>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>School & Location</th>
                    <th>Grades Avg</th>
                    <th>State Story Approval</th>
                    <th>Story Quote (EN)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dbState.studentsList.map(s => {
                    const hasStory = s.featuredStory && s.featuredStory.isFeatured;
                    const isApproved = s.featuredStory && s.featuredStory.approved;
                    const avgMarks = Math.round(s.academicRecords.reduce((sum, r) => sum + r.marksPercentage, 0) / s.academicRecords.length) || 0;

                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 700 }}>{s.name}</td>
                        <td>{s.school} ({s.state})</td>
                        <td>{avgMarks}%</td>
                        <td>
                          <span className={`badge ${isApproved ? "success" : "danger"}`}>
                            {isApproved ? "Approved & Public" : "No Approved Story"}
                          </span>
                        </td>
                        <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.82rem" }}>
                          {isApproved ? s.featuredStory.quoteEn : "—"}
                        </td>
                        <td>
                          {isApproved ? (
                            <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#ef4444" }} onClick={() => handleRemoveSuccessStory(s.id, s.name)}>
                              Revoke Public Story
                            </button>
                          ) : (
                            <button className="btn-primary" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => openFeatureModal(s)}>
                              Create & Publish Story
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Success Story Creation Popup */}
          {featuringStudent && (
            <div className="modal-overlay" onClick={() => setFeaturingStudent(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "550px" }}>
                <div className="modal-header">
                  <span className="modal-title">Write Success Story for {featuringStudent.name}</span>
                  <button className="modal-close-btn" onClick={() => setFeaturingStudent(null)}>×</button>
                </div>
                
                <form onSubmit={handleFeatureStudentSubmit}>
                  <div className="modal-body">
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                      Provide translation quotes to maintain correct rendering across all localized portals.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Story Quote (English)</label>
                      <textarea 
                        className="form-control" 
                        rows="2" 
                        placeholder="e.g. Thanks to the scholarship I can study coding..."
                        value={storyQuoteEn}
                        onChange={e => setStoryQuoteEn(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">सफलता की कहानी (हिन्दी)</label>
                      <textarea 
                        className="form-control" 
                        rows="2" 
                        placeholder="जैसे: छात्रवृत्ति की मदद से मैं सॉफ्टवेयर सीख पा रही हूँ..."
                        value={storyQuoteHi}
                        onChange={e => setStoryQuoteHi(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">విజయగాథ కోట్ (తెలుగు)</label>
                      <textarea 
                        className="form-control" 
                        rows="2" 
                        placeholder="ఉదాహరణ: స్కాలర్‌షిప్ సహాయంతో నేను కోడింగ్ నేర్చుకుంటున్నాను..."
                        value={storyQuoteTe}
                        onChange={e => setStoryQuoteTe(e.target.value)}
                      />
                    </div>

                    {storyError && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{storyError}</div>}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setFeaturingStudent(null)}>Cancel</button>
                    <button type="submit" className="btn-primary">Approve & Publish Story</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 4: SCHOLARSHIPS MANAGEMENT */}
      {activeSubTab === "scholarships" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
            
            {/* Roster of active schemes */}
            <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Active Scholarship Schemes</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {dbState.scholarships.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border-color)", padding: "10px 14px", borderRadius: "8px" }}>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{s.title}</h4>
                      <span style={{ fontSize: "0.78rem", color: "var(--primary-color)", fontWeight: 600 }}>{s.provider} | {s.amount}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="btn-secondary" style={{ padding: "4px", color: "var(--primary-color)" }} onClick={() => {
                        setEditingScholarship(s.id);
                        setSchTitle(s.title);
                        setSchProvider(s.provider);
                        setSchAmount(s.amount);
                        setSchDeadline(s.deadline);
                        setSchCategory(s.category);
                      }}>
                        <Edit2 size={12} />
                      </button>
                      <button className="btn-secondary" style={{ padding: "4px", color: "#ef4444" }} onClick={() => handleDeleteScholarship(s.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editing / Adding Form */}
            <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                {editingScholarship ? "Edit Scholarship Details" : "Launch New Scholarship Scheme"}
              </h3>
              
              <form onSubmit={handleSaveScholarship}>
                <div className="form-group">
                  <label className="form-label">Scheme Title</label>
                  <input type="text" className="form-control" placeholder="e.g. Pragati Scholarship" value={schTitle} onChange={e => setSchTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Provider Name</label>
                  <input type="text" className="form-control" placeholder="e.g. AICTE / Ministry of Education" value={schProvider} onChange={e => setSchProvider(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Scholarship Amount</label>
                  <input type="text" className="form-control" placeholder="e.g. ₹50,000 per year" value={schAmount} onChange={e => setSchAmount(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Deadline Date</label>
                  <input type="date" className="form-control" value={schDeadline} onChange={e => setSchDeadline(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={schCategory} onChange={e => setSchCategory(e.target.value)}>
                    <option value="Government">Government Sponsored</option>
                    <option value="NGO">NGO Grant</option>
                    <option value="Private">Private Corporate Sponsor</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
                  {editingScholarship && (
                    <button type="button" className="btn-secondary" style={{ padding: "8px 12px" }} onClick={() => setEditingScholarship(null)}>
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn-primary" style={{ padding: "8px 14px", flex: 1 }}>
                    {editingScholarship ? "Update Details" : "Launch Scheme"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 5: PLATFORM ACTIVITIES INJECTION */}
      {activeSubTab === "events" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr", gap: "2rem" }}>
            
            <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Log Live Platform Event</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Add genuine operations directly to the public live activities ledger.
              </p>

              <form onSubmit={handleCreateActivity}>
                <div className="form-group">
                  <label className="form-label">Event Text (English)</label>
                  <input type="text" className="form-control" placeholder="e.g. A girl from Telangana registered." value={newEventTextEn} onChange={e => setNewEventTextEn(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">गतिविधि विवरण (हिन्दी)</label>
                  <input type="text" className="form-control" placeholder="जैसे: तेलंगाना की एक छात्रा ने पंजीकरण किया।" value={newEventTextHi} onChange={e => setNewEventTextHi(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">ఈవెంట్ టెక్స్ట్ (తెలుగు)</label>
                  <input type="text" className="form-control" placeholder="ఉదాహరణ: తెలంగాణ నుండి ఒక విద్యార్థి నమోదు చేసుకున్నారు." value={newEventTextTe} onChange={e => setNewEventTextTe(e.target.value)} required />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                  Inject and Broadcast Live
                </button>
              </form>
            </div>

            <div className="dashboard-card" style={{ background: "#fff", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Platform Audit Ledger</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto" }}>
                {dbState.activities.map(act => (
                  <div key={act.id} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", fontSize: "0.82rem" }}>
                    <div style={{ color: "var(--text-main)", fontWeight: 600 }}>{act.textEn}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "2px" }}>
                      {new Date(act.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
