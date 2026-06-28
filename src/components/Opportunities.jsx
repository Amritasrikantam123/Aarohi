import React, { useState } from "react";
import { Search, Filter, Calendar, Briefcase, Award, CheckCircle, Info, Send } from "lucide-react";
import { getDB, saveDB } from "../data/mockData";

export default function Opportunities({ db, currentLang }) {
  const opportunities = db?.opportunities || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [registeredIds, setRegisteredIds] = useState(() => {
    return JSON.parse(localStorage.getItem("aarohi_registered_opportunities")) || [];
  });

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleRegister = async (id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("aarohi_user"));
      const studentId = storedUser?._id || storedUser?.id || db?.studentProfile?._id;
      if (!studentId) {
        alert("Please log in first.");
        return;
      }
      
      const payload = {
        student: studentId,
        opportunity: id,
        status: "Applied",
        appliedDate: new Date().toISOString().split('T')[0]
      };

      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("aarohi_token")}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const updated = [...registeredIds, id];
      setRegisteredIds(updated);
      localStorage.setItem("aarohi_registered_opportunities", JSON.stringify(updated));
      setSelectedOpportunity(null);
      alert(currentLang === "en" ? "Registered successfully!" : "पंजीकरण सफल रहा!");
    } catch (err) {
      console.error(err);
      alert("Error submitting registration application to MongoDB.");
    }
  };

  const filtered = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "All" || opp.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {currentLang === "en" ? "Internships & Opportunities" : "इंटर्नशिप और अवसर"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          {currentLang === "en" ? "Apply for virtual internships, bootcamps, workshops, and skills programs." : "वर्चुअल इंटर्नशिप, बूटकैंप, कार्यशालाओं और कौशल कार्यक्रमों के लिए आवेदन करें।"}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="dashboard-card" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexGrow: 1 }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder={currentLang === "en" ? "Search internships, workshops..." : "इंटर्नशिप, कार्यशालाएं खोजें..."}
            style={{ paddingLeft: "2.5rem" }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ position: "relative", width: "200px" }}>
          <Filter size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          <select 
            className="form-control" 
            style={{ paddingLeft: "2.5rem" }}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="All">{currentLang === "en" ? "All Types" : "सभी प्रकार"}</option>
            <option value="Internship">{currentLang === "en" ? "Internships" : "इंटर्नशिप"}</option>
            <option value="Workshop">{currentLang === "en" ? "Workshops & Seminars" : "कार्यशालाएं और सेमिनार"}</option>
            <option value="Competition">{currentLang === "en" ? "Competitions" : "प्रतियोगिताएं"}</option>
            <option value="Certification">{currentLang === "en" ? "Certifications" : "प्रमाणपत्र"}</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid-three-col">
        {filtered.map(opp => {
          const isRegistered = registeredIds.includes(opp.id);
          
          return (
            <div key={opp.id} className="card-item" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span className="badge primary">{opp.type}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {opp.duration}
                </span>
              </div>
              
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", margin: "0.5rem 0" }}>
                {opp.title}
              </h3>
              
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                {opp.provider}
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem", flexGrow: 1 }}>
                {opp.description.length > 100 ? opp.description.substring(0, 100) + "..." : opp.description}
              </p>

              {opp.stipend !== "None" && opp.stipend !== "Unpaid (Free Certification)" && (
                <div style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600, marginBottom: "1rem" }}>
                  Stipend/Award: {opp.stipend}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                <button 
                  className="btn-secondary" 
                  style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                  onClick={() => setSelectedOpportunity(opp)}
                >
                  <Info size={14} style={{ marginRight: "3px" }} /> {currentLang === "en" ? "Details" : "विवरण"}
                </button>

                {isRegistered ? (
                  <button 
                    className="btn-primary" 
                    disabled 
                    style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem", background: "#dcfce7", color: "#15803d", border: "none", boxShadow: "none", cursor: "default", display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <CheckCircle size={14} style={{ marginRight: "3px" }} /> {currentLang === "en" ? "Registered" : "पंजीकृत"}
                  </button>
                ) : (
                  <button 
                    className="btn-primary" 
                    style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                    onClick={() => handleRegister(opp.id)}
                  >
                    {currentLang === "en" ? "Register" : "पंजीकरण करें"} <Send size={14} style={{ marginLeft: "4px" }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            {currentLang === "en" ? "No matching opportunities found." : "कोई मिलान वाला अवसर नहीं मिला।"}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOpportunity && (
        <div className="modal-overlay" onClick={() => setSelectedOpportunity(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedOpportunity.title}</span>
              <button className="modal-close-btn" onClick={() => setSelectedOpportunity(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{currentLang === "en" ? "Organizer:" : "आयोजक:"}</span>
                  <div style={{ fontWeight: 600 }}>{selectedOpportunity.provider}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{currentLang === "en" ? "Duration / Time:" : "अवधि / समय:"}</span>
                  <div style={{ fontWeight: 600 }}>{selectedOpportunity.duration}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h5 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{currentLang === "en" ? "About the Program" : "कार्यक्रम के बारे में"}</h5>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  {selectedOpportunity.description}
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h5 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{currentLang === "en" ? "Incentive / Stipend" : "प्रोत्साहन / वजीफा"}</h5>
                  <div style={{ fontSize: "0.9rem", color: "#16a34a", fontWeight: 700 }}>
                    {selectedOpportunity.stipend}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h5 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{currentLang === "en" ? "Timeline" : "महत्वपूर्ण तिथि"}</h5>
                  <div style={{ fontSize: "0.9rem", color: "var(--primary-color)", fontWeight: 700 }}>
                    {selectedOpportunity.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedOpportunity(null)}>
                {currentLang === "en" ? "Close" : "बंद करें"}
              </button>
              
              {registeredIds.includes(selectedOpportunity.id) ? (
                <button className="btn-primary" disabled style={{ background: "#dcfce7", color: "#15803d", border: "none", boxShadow: "none" }}>
                  {currentLang === "en" ? "Registered Successfully" : "सफलतापूर्वक पंजीकृत"}
                </button>
              ) : (
                <button className="btn-primary" onClick={() => handleRegister(selectedOpportunity.id)}>
                  {currentLang === "en" ? "Register Now" : "अभी पंजीकरण करें"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
