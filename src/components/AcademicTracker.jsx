import React, { useState } from "react";
import { Plus, Award, Calendar, BarChart2, BookOpen, Trash2, CheckCircle } from "lucide-react";
import { getDB, saveDB } from "../data/mockData";

export default function AcademicTracker({ studentProfile, onUpdateProfile, currentLang }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    examName: "",
    year: new Date().getFullYear(),
    marksPercentage: ""
  });
  const [error, setError] = useState("");

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRecord.examName.trim()) {
      setError(currentLang === "en" ? "Exam name is required" : "परीक्षा का नाम आवश्यक है");
      return;
    }
    const marks = parseFloat(newRecord.marksPercentage);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setError(currentLang === "en" ? "Enter a valid percentage between 0 and 100" : "0 और 100 के बीच एक वैध प्रतिशत दर्ज करें");
      return;
    }

    const updatedRecords = [
      ...studentProfile.academicRecords,
      {
        examName: newRecord.examName,
        year: parseInt(newRecord.year),
        marksPercentage: marks,
        status: "Completed"
      }
    ];

    // Update badges check: if they score 90%+, give them a "High Achiever" badge
    let updatedBadges = [...studentProfile.badges];
    if (marks >= 90 && !updatedBadges.includes("High Achiever")) {
      updatedBadges.push("High Achiever");
    }

    const updatedProfile = {
      ...studentProfile,
      academicRecords: updatedRecords,
      badges: updatedBadges
    };

    // Save to DB
    const db = getDB();
    db.studentProfile = updatedProfile;
    saveDB(db);

    // Notify parent to re-render
    onUpdateProfile(updatedProfile);

    // Reset Form
    setNewRecord({ examName: "", year: new Date().getFullYear(), marksPercentage: "" });
    setError("");
    setShowAddForm(false);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = studentProfile.academicRecords.filter((_, i) => i !== index);
    const updatedProfile = {
      ...studentProfile,
      academicRecords: updatedRecords
    };

    const db = getDB();
    db.studentProfile = updatedProfile;
    saveDB(db);

    onUpdateProfile(updatedProfile);
  };

  // Generate SVG Chart Points
  const records = studentProfile.academicRecords;
  const chartHeight = 180;
  const chartWidth = 550;
  const padding = 40;

  let pointsStr = "";
  let areaPointsStr = "";
  
  if (records && records.length > 0) {
    const xInterval = (chartWidth - padding * 2) / (records.length > 1 ? records.length - 1 : 1);
    
    const coordinates = records.map((rec, i) => {
      const x = padding + i * xInterval;
      // Map percentage (0-100) to height range (chartHeight - padding) to padding
      const y = chartHeight - padding - ((rec.marksPercentage - 50) / 50) * (chartHeight - padding * 2);
      return { x, y, val: rec.marksPercentage, name: rec.examName };
    });

    pointsStr = coordinates.map(c => `${c.x},${c.y}`).join(" ");
    
    if (coordinates.length > 0) {
      // Connect to bottom right and bottom left for area shading
      areaPointsStr = `${coordinates[0].x},${chartHeight - padding} ` + 
                      pointsStr + 
                      ` ${coordinates[coordinates.length - 1].x},${chartHeight - padding}`;
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {currentLang === "en" ? "Academic Progress Tracking" : "शैक्षणिक प्रगति ट्रैकिंग"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {currentLang === "en" ? "Visualize and manage your semester-wise grades." : "अपनी सेमेस्टर-वार ग्रेड को विज़ुअलाइज़ और प्रबंधित करें।"}
          </p>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
        >
          <Plus size={16} /> {currentLang === "en" ? "Add Marks Record" : "अंक तालिका जोड़ें"}
        </button>
      </div>

      {/* Grid of Chart and Badges */}
      <div className="grid-two-col" style={{ marginBottom: "2rem" }}>
        
        {/* SVG Performance Chart */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">
            <span><BarChart2 size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} /> {currentLang === "en" ? "Academic Growth Trend" : "शैक्षणिक विकास प्रवृत्ति"}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--primary-color)", background: "var(--lavender-bg)", padding: "2px 8px", borderRadius: "10px" }}>
              {currentLang === "en" ? "Passing Threshold: 50%" : "उत्तीर्ण सीमा: 50%"}
            </span>
          </h3>

          <div style={{ display: "flex", justifyContent: "center", position: "relative", marginTop: "1rem" }}>
            {records.length > 0 ? (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="auto" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                
                {/* Horizontal Guide Lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-color)" strokeDasharray="4" />
                <text x={padding - 10} y={padding + 5} fontSize="10" fill="var(--text-muted)" textAnchor="end">100%</text>
                
                <line x1={padding} y1={(chartHeight) / 2} x2={chartWidth - padding} y2={(chartHeight) / 2} stroke="var(--border-color)" strokeDasharray="4" />
                <text x={padding - 10} y={(chartHeight) / 2 + 5} fontSize="10" fill="var(--text-muted)" textAnchor="end">75%</text>

                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border-color)" strokeWidth="1.5" />
                <text x={padding - 10} y={chartHeight - padding + 5} fontSize="10" fill="var(--text-muted)" textAnchor="end">50%</text>

                {/* Draw shaded area */}
                {areaPointsStr && <polygon points={areaPointsStr} fill="url(#chartAreaGrad)" />}
                
                {/* Draw trend line */}
                {pointsStr && <polyline points={pointsStr} fill="none" stroke="var(--primary-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

                {/* Plot Data Dots and labels */}
                {records.map((rec, i) => {
                  const xInterval = (chartWidth - padding * 2) / (records.length > 1 ? records.length - 1 : 1);
                  const x = padding + i * xInterval;
                  const y = chartHeight - padding - ((rec.marksPercentage - 50) / 50) * (chartHeight - padding * 2);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="#fff" stroke="var(--primary-color)" strokeWidth="3" />
                      <circle cx={x} cy={y} r="2" fill="var(--primary-color)" />
                      <text x={x} y={y - 12} fontSize="11" fontWeight="700" fill="var(--text-main)" textAnchor="middle">{rec.marksPercentage}%</text>
                      {/* X Axis labels */}
                      <text x={x} y={chartHeight - padding + 20} fontSize="9" fontWeight="600" fill="var(--text-muted)" textAnchor="middle" style={{ maxWidth: "60px" }}>
                        {rec.examName.split(" ")[1] || rec.examName.substring(0, 10)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                {currentLang === "en" ? "No academic records added yet." : "अभी तक कोई शैक्षणिक अंक नहीं जोड़ा गया है।"}
              </div>
            )}
          </div>
        </div>

        {/* Badges Shelf */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">
            <span><Award size={18} style={{ verticalAlign: "middle", marginRight: "6px", color: "#fbbf24" }} /> {currentLang === "en" ? "Achievement Badges" : "सफलता के प्रतीक (बैज)"}</span>
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            marginTop: "1rem"
          }}>
            {studentProfile.badges.map((badge, idx) => (
              <div 
                key={idx} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  background: "linear-gradient(135deg, var(--lavender-bg) 0%, var(--lavender-light) 100%)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d97706"
                }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>{badge}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {badge === "New Member" ? "Joined Aarohi" : badge === "Math Marvel" ? "Aced Algebra" : "Academic Star"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Form Add Record Popup */}
      {showAddForm && (
        <div className="dashboard-card" style={{ border: "2px solid var(--primary-light)", animation: "modalIn 0.3s ease" }}>
          <h3 className="dashboard-card-title">{currentLang === "en" ? "Enter New Examination Marksheet" : "नई परीक्षा के अंक दर्ज करें"}</h3>
          
          <form onSubmit={handleAddRecord}>
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label">{currentLang === "en" ? "Exam/Semester Name" : "परीक्षा/सेमेस्टर का नाम"}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Class 12th Finals, Sem 1" 
                  value={newRecord.examName}
                  onChange={e => setNewRecord({ ...newRecord, examName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{currentLang === "en" ? "Year" : "वर्ष"}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newRecord.year}
                  onChange={e => setNewRecord({ ...newRecord, year: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{currentLang === "en" ? "Marks Obtained (%)" : "प्राप्त अंक (%)"}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 85" 
                  value={newRecord.marksPercentage}
                  onChange={e => setNewRecord({ ...newRecord, marksPercentage: e.target.value })}
                />
              </div>
            </div>

            {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                {currentLang === "en" ? "Cancel" : "रद्द करें"}
              </button>
              <button type="submit" className="btn-primary">
                {currentLang === "en" ? "Add Record" : "अंक तालिका सहेजें"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline and History Table */}
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">{currentLang === "en" ? "Academic Milestones" : "शैक्षणिक उपलब्धियां"}</h3>
        
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{currentLang === "en" ? "Exam / Semester" : "परीक्षा / सेमेस्टर"}</th>
                <th>{currentLang === "en" ? "Academic Year" : "शैक्षणिक वर्ष"}</th>
                <th>{currentLang === "en" ? "Percentage" : "प्रतिशत"}</th>
                <th>{currentLang === "en" ? "Status" : "स्थिति"}</th>
                <th>{currentLang === "en" ? "Action" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    <BookOpen size={16} style={{ verticalAlign: "middle", marginRight: "8px", color: "var(--primary-color)" }} />
                    {rec.examName}
                  </td>
                  <td>{rec.year}</td>
                  <td style={{ fontWeight: 700, color: rec.marksPercentage >= 75 ? "#16a34a" : "var(--text-main)" }}>
                    {rec.marksPercentage}%
                  </td>
                  <td>
                    <span className="badge success">
                      <CheckCircle size={12} style={{ verticalAlign: "middle", marginRight: "3px" }} />
                      {currentLang === "en" ? "Verified" : "सत्यापित"}
                    </span>
                  </td>
                  <td>
                    {/* Don't let them delete the first index record to keep dashboard populated */}
                    {i > 0 ? (
                      <button 
                        onClick={() => handleDeleteRecord(i)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "4px"
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        {currentLang === "en" ? "Locked base" : "मूल रिकॉर्ड"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
