import React, { useState } from "react";
import { Plus, LifeBuoy, AlertTriangle, CheckCircle, Clock, Calendar, Send, ShieldAlert, PhoneCall } from "lucide-react";
import { getDB, saveDB } from "../data/mockData";

export default function GrievancePortal({ studentProfile, currentLang }) {
  const db = getDB();
  const [grievances, setGrievances] = useState(() => {
    return db.grievances.filter(g => g.studentId === studentProfile.id);
  });

  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: ""
  });
  const [error, setError] = useState("");

  const categories = [
    "Financial Difficulties",
    "Scholarship Issues",
    "Educational Barriers",
    "Early marriage concerns",
    "Safety concerns",
    "Other challenges"
  ];

  const helplines = [
    { name: currentLang === "en" ? "National Women Helpline" : "राष्ट्रीय महिला हेल्पलाइन", number: "1091", desc: "24/7 Safety & Domestic Abuse Support" },
    { name: currentLang === "en" ? "SHE Team Safety Desk" : "शी टीम सुरक्षा डेस्क", number: "9490617444", desc: "Telangana / State Police Female Safety WhatsApp" },
    { name: currentLang === "en" ? "National Emergency Response" : "राष्ट्रीय आपातकालीन प्रतिक्रिया", number: "112", desc: "All-in-one Police, Fire & Health Emergency" },
    { name: currentLang === "en" ? "Child Line Support" : "चाइल्ड लाइन सहायता", number: "1098", desc: "24/7 Protection & Help for girls under 18 years" },
    { name: currentLang === "en" ? "National Cyber Crime Support" : "राष्ट्रीय साइबर अपराध सहायता", number: "1930", desc: "Report cyber harassment, identity theft, or blackmail" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) {
      setError(currentLang === "en" ? "Please select a category." : "कृपया एक श्रेणी चुनें।");
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 15) {
      setError(currentLang === "en" ? "Please describe your challenge (minimum 15 characters)." : "कृपया अपनी चुनौती का वर्णन करें (न्यूनतम 15 वर्ण)।");
      return;
    }

    const newTicket = {
      id: "GRV" + Math.floor(Math.random() * 9000 + 1000),
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
      status: "Open",
      district: studentProfile.district || "Varanasi",
      timeline: [
        { date: new Date().toISOString().split('T')[0], update: "Grievance submitted by " + studentProfile.name }
      ],
      adminResponse: ""
    };

    // Save to Database
    const currentDB = getDB();
    currentDB.grievances = [newTicket, ...currentDB.grievances];
    
    // Also increment district stats grievances count
    currentDB.districtStats = currentDB.districtStats.map(stat => {
      if (stat.district.toLowerCase() === studentProfile.district.toLowerCase()) {
        return { ...stat, grievances: stat.grievances + 1 };
      }
      return stat;
    });

    saveDB(currentDB);

    // Update local state
    setGrievances([newTicket, ...grievances]);
    
    // Reset Form
    setFormData({ category: "", description: "" });
    setError("");
    setShowSubmitForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {currentLang === "en" ? "Grievance & Support Portal" : "शिकायत और सहायता पोर्टल"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {currentLang === "en" ? "Safely report barriers, early marriage risks, safety issues, or scholarship problems." : "बाधाओं, बाल विवाह के खतरों, सुरक्षा मुद्दों या छात्रवृत्ति समस्याओं की सुरक्षित रिपोर्ट करें।"}
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", border: "none", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.2)" }}
        >
          <ShieldAlert size={16} /> {currentLang === "en" ? "Raise New Ticket" : "शिकायत दर्ज करें"}
        </button>
      </div>

      {/* Emergency Hotlines Row */}
      <div className="emergency-support-card" style={{ marginBottom: "2rem" }}>
        <div className="emergency-header">
          <PhoneCall size={20} /> {currentLang === "en" ? "Emergency Helpline Contacts (Toll Free)" : "आपातकालीन हेल्पलाइन संपर्क (टोल फ्री)"}
        </div>
        <div className="emergency-contacts-list">
          {helplines.map((help, idx) => (
            <div key={idx} className="emergency-contact-item">
              <span className="emergency-contact-name">{help.name}</span>
              <a href={`tel:${help.number}`} className="emergency-contact-number" style={{ textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "var(--primary-hover)"} onMouseOut={e => e.target.style.color = "var(--primary-color)"}>
                {help.number}
              </a>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{help.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grievance Submission Form */}
      {showSubmitForm && (
        <div className="dashboard-card" style={{ border: "2px solid #fca5a5", animation: "modalIn 0.3s ease" }}>
          <h3 className="dashboard-card-title" style={{ color: "#b91c1c" }}>
            {currentLang === "en" ? "Grievance Redressal Form" : "शिकायत निवारण प्रपत्र"}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Select Grievance Category" : "शिकायत की श्रेणी चुनें"}</label>
              <select 
                className="form-control"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Describe Your Issue In Detail" : "अपनी समस्या का विस्तार से वर्णन करें"}</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder={currentLang === "en" ? "Please detail the challenges you are facing. Confidentiality is fully assured." : "कृपया अपनी समस्याओं का विवरण दें। गोपनीयता का पूर्ण आश्वासन दिया जाता है।"}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button type="button" className="btn-secondary" onClick={() => setShowSubmitForm(false)}>
                {currentLang === "en" ? "Cancel" : "रद्द करें"}
              </button>
              <button type="submit" className="btn-primary" style={{ background: "#dc2626" }}>
                {currentLang === "en" ? "Submit Grievance Safely" : "सुरक्षित शिकायत दर्ज करें"} <Send size={14} style={{ marginLeft: "4px" }} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket List and Timelines */}
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">{currentLang === "en" ? "Grievance Ticket Tracker" : "शिकायत टिकट ट्रैकर"}</h3>
        
        {grievances.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {grievances.map((grv, index) => (
              <div key={grv.id} style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                backgroundColor: "var(--bg-primary)"
              }}>
                {/* Ticket Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>TICKET ID: {grv.id}</span>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>{grv.category}</h4>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <Calendar size={12} /> {currentLang === "en" ? `Submitted: ${grv.date}` : `दर्ज तिथि: ${grv.date}`}
                    </div>
                  </div>
                  
                  <div>
                    <span className={`badge ${
                      grv.status === "Open" ? "warning" : grv.status === "In Progress" ? "primary" : "success"
                    }`}>
                      {grv.status}
                    </span>
                  </div>
                </div>

                {/* Ticket Body */}
                <p style={{ fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "1.25rem", borderLeft: "3px solid #cbd5e1", paddingLeft: "10px" }}>
                  {grv.description}
                </p>

                {grv.adminResponse && (
                  <div style={{ padding: "0.85rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: "0.88rem", color: "#166534" }}>
                    <strong>{currentLang === "en" ? "Response from Counselor:" : "काउंसलर का जवाब:"}</strong> {grv.adminResponse}
                  </div>
                )}

                {/* Vertical log updates */}
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                    {currentLang === "en" ? "Ticket Logs & Updates" : "टिकट अपडेट विवरण"}
                  </span>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "10px" }}>
                    {grv.timeline.map((t, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem" }}>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "85px" }}>{t.date}</span>
                        <span style={{ color: "var(--text-main)" }}>• {t.update}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            {currentLang === "en" ? "You have not raised any grievance tickets yet. Your school-continuation is our priority." : "आपने अभी तक कोई शिकायत टिकट नहीं उठाया है। स्कूल जारी रखना हमारी प्राथमिकता है।"}
          </div>
        )}
      </div>

    </div>
  );
}
