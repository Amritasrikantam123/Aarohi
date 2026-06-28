import React, { useState } from "react";
import { Search, Filter, Calendar, Award, CheckCircle, Info, ChevronRight } from "lucide-react";
import { getDB, saveDB, logActivity } from "../data/mockData";

export default function ScholarshipHub({ db, studentProfile, onUpdateProfile, currentLang, onRegisterRedirect }) {
  const scholarships = db?.scholarships || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Eligibility Check States (pre-populated from student profile if logged in)
  const [userMarks, setUserMarks] = useState(
    studentProfile && studentProfile.academicRecords && studentProfile.academicRecords.length > 0 
      ? Math.max(...studentProfile.academicRecords.map(r => r.marksPercentage)) 
      : 75
  );
  const [userIncome, setUserIncome] = useState(studentProfile?.familyIncome || 150000);
  const [checkerEnabled, setCheckerEnabled] = useState(false);

  // Selected scholarship detail modal
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const handleApply = (id) => {
    const sch = scholarships.find(s => s.id === id);
    if (!sch) return;

    // Direct redirection to the actual scholarship page
    const url = sch.applyLink || sch.applyUrl;
    if (url) {
      window.open(url, "_blank");
    }

    if (!studentProfile) {
      // Guest mode - successfully redirected, no profile updates needed
      return;
    }

    // 1. Add scholarship application to profile with "Approved" to simulate immediate award in prototype
    const appliedRecord = {
      scholarshipId: id,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "Approved" // Immediately approved for prototype real-time awarded counter
    };

    const updatedProfile = {
      ...studentProfile,
      appliedScholarships: [...studentProfile.appliedScholarships, appliedRecord]
    };

    // 2. Save profile in DB & students list
    const currentDB = getDB();
    currentDB.studentsList = currentDB.studentsList.map(s => s.id === studentProfile.id ? updatedProfile : s);
    currentDB.studentProfile = updatedProfile;
    saveDB(currentDB);

    // 3. Log real-time activity feed
    logActivity(
      `Student ${studentProfile.name} successfully applied for and was awarded the ${sch.title}.`,
      `छात्रा ${studentProfile.name} ने सफलतापूर्वक ${sch.title} के लिए आवेदन किया और इसे प्राप्त किया।`,
      `విద్యార్థిని ${studentProfile.name} విజయవంతంగా ${sch.title} కొరకు దరఖాస్తు చేసుకున్నారు మరియు అవార్డు పొందారు.`
    );

    // 4. Notify parent state
    onUpdateProfile(updatedProfile);

    // 5. Close details modal if open
    setSelectedScholarship(null);
  };

  // Filter Logic
  const filteredScholarships = scholarships.filter(sch => {
    const matchesSearch = sch.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sch.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || sch.category === categoryFilter;

    if (checkerEnabled) {
      const meetsMarks = userMarks >= sch.eligibility.minMarks;
      const meetsIncome = userIncome <= sch.eligibility.maxIncome;
      return matchesSearch && matchesCategory && meetsMarks && meetsIncome;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {currentLang === "en" ? "Scholarship Hub" : "छात्रवृत्ति हब"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          {currentLang === "en" ? "Find educational aid and apply directly to empowerment schemes." : "शैक्षणिक सहायता प्राप्त करें और सीधे सशक्तिकरण योजनाओं के लिए आवेदन करें।"}
        </p>
      </div>

      {/* Grid: Left: Filters & Search, Right: Checker widget */}
      <div className="grid-two-col" style={{ marginBottom: "2rem", gridTemplateColumns: "1.6fr 1fr" }}>
        
        {/* Filter Toolbar */}
        <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 600 }}>{currentLang === "en" ? "Search Schemes" : "योजनाएं खोजें"}</h4>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ position: "relative", flexGrow: 1 }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder={currentLang === "en" ? "Search by title or provider..." : "शीर्षक या प्रदाता द्वारा खोजें..."}
                style={{ paddingLeft: "2.5rem" }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ position: "relative", width: "160px" }}>
              <Filter size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <select 
                className="form-control" 
                style={{ paddingLeft: "2.5rem" }}
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="All">{currentLang === "en" ? "All Categories" : "सभी श्रेणियां"}</option>
                <option value="Government">{currentLang === "en" ? "Government" : "सरकारी"}</option>
                <option value="NGO">{currentLang === "en" ? "NGO / Foundation" : "गैर सरकारी संस्था"}</option>
                <option value="Private">{currentLang === "en" ? "Corporate CSR" : "निजी कॉर्पोरेट"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Eligibility Checker */}
        <div className="dashboard-card" style={{ 
          background: checkerEnabled 
            ? "linear-gradient(135deg, var(--lavender-bg) 0%, var(--lavender-light) 100%)" 
            : "#fff",
          border: checkerEnabled ? "2px solid var(--primary-light)" : "1px solid var(--border-color)",
          transition: "var(--transition-smooth)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>
              {currentLang === "en" ? "Eligibility Matcher" : "पात्रता चेकर"}
            </h4>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="lang-btn" style={{ cursor: "pointer", display: "flex", gap: "0.25rem" }}>
                <input 
                  type="checkbox" 
                  checked={checkerEnabled} 
                  onChange={e => setCheckerEnabled(e.target.checked)} 
                />
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  {currentLang === "en" ? "Enable Check" : "चेकर सक्रिय करें"}
                </span>
              </label>
            </div>
          </div>

          <div className="form-row-two" style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.78rem" }}>{currentLang === "en" ? "My Marks (%)" : "मेरे अंक (%)"}</label>
              <input 
                type="number" 
                className="form-control" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                value={userMarks} 
                onChange={e => setUserMarks(parseFloat(e.target.value) || 0)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.78rem" }}>{currentLang === "en" ? "Family Income (₹)" : "पारिवारिक आय (₹)"}</label>
              <input 
                type="number" 
                className="form-control" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                value={userIncome} 
                onChange={e => setUserIncome(parseFloat(e.target.value) || 0)} 
              />
            </div>
          </div>
        </div>

      </div>

      {/* Cards list grid */}
      <div className="grid-three-col">
        {filteredScholarships.map(sch => {
          // Check application status
          const application = studentProfile?.appliedScholarships?.find(a => a.scholarshipId === sch.id);
          const isApplied = !!application;
          
          return (
            <div key={sch.id} className="card-item" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "260px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span className={`badge ${sch.category === "Government" ? "success" : sch.category === "NGO" ? "primary" : "warning"}`}>
                  {sch.category}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Calendar size={14} /> {sch.deadline}
                </span>
              </div>
              
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.5rem 0", color: "var(--text-main)", flexGrow: 0 }}>
                {sch.title}
              </h3>
              
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                {sch.provider}
              </div>

              <div style={{ 
                background: "var(--lavender-bg)", 
                padding: "0.75rem", 
                borderRadius: "var(--radius-sm)", 
                marginBottom: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{currentLang === "en" ? "Funding amount:" : "सहायता राशि:"}</span>
                <span style={{ color: "var(--primary-hover)", fontWeight: 700, fontSize: "1rem" }}>{sch.amount}</span>
              </div>

              <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem" }}>
                <button 
                  className="btn-secondary" 
                  style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                  onClick={() => setSelectedScholarship(sch)}
                >
                  <Info size={14} style={{ marginRight: "3px" }} /> {currentLang === "en" ? "Details" : "विवरण"}
                </button>

                {isApplied ? (
                  <button 
                    className="btn-primary" 
                    disabled 
                    style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem", background: "#d1d5db", color: "#6b7280", border: "none", boxShadow: "none", cursor: "default", display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <CheckCircle size={14} style={{ marginRight: "3px" }} /> {application.status}
                  </button>
                ) : (
                  <button 
                    className="btn-primary" 
                    style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                    onClick={() => handleApply(sch.id)}
                  >
                    {currentLang === "en" ? "Apply" : "आवेदन करें"} <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {filteredScholarships.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            {currentLang === "en" ? "No matching scholarship programs found." : "कोई मिलान वाली छात्रवृत्ति कार्यक्रम नहीं मिला।"}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedScholarship && (
        <div className="modal-overlay" onClick={() => setSelectedScholarship(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedScholarship.title}</span>
              <button className="modal-close-btn" onClick={() => setSelectedScholarship(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{currentLang === "en" ? "Offered by:" : "प्रदाता:"}</span>
                  <div style={{ fontWeight: 600 }}>{selectedScholarship.provider}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{currentLang === "en" ? "Funding Value:" : "वित्तीय सहायता:"}</span>
                  <div style={{ fontWeight: 700, color: "var(--primary-color)" }}>{selectedScholarship.amount}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h5 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{currentLang === "en" ? "About the Scheme" : "योजना के बारे में"}</h5>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  {selectedScholarship.eligibility.description}
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <h5 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{currentLang === "en" ? "Eligibility Criteria" : "पात्रता मापदंड"}</h5>
                <ul style={{ fontSize: "0.85rem", color: "var(--text-muted)", paddingLeft: "1.25rem" }}>
                  <li>{currentLang === "en" ? `Required Class: ${selectedScholarship.eligibility.classRequired}` : `आवश्यक कक्षा: ${selectedScholarship.eligibility.classRequired}`}</li>
                  <li>{currentLang === "en" ? `Minimum marks in 10th/11th: ${selectedScholarship.eligibility.minMarks}%` : `10वीं/11वीं में न्यूनतम अंक: ${selectedScholarship.eligibility.minMarks}%`}</li>
                  <li>{currentLang === "en" ? `Maximum Annual Family Income: ₹${selectedScholarship.eligibility.maxIncome.toLocaleString()}` : `अधिकतम वार्षिक पारिवारिक आय: ₹${selectedScholarship.eligibility.maxIncome.toLocaleString()}`}</li>
                </ul>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <h5 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{currentLang === "en" ? "Required Certificates" : "आवश्यक प्रमाण पत्र"}</h5>
                <p style={{ fontSize: "0.85rem", color: "var(--primary-hover)", fontWeight: 500 }}>
                  {selectedScholarship.requirements}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedScholarship(null)}>
                {currentLang === "en" ? "Close" : "बंद करें"}
              </button>
              
              {(studentProfile?.appliedScholarships || []).some(a => a.scholarshipId === selectedScholarship.id) ? (
                <button className="btn-primary" disabled style={{ background: "#d1d5db", color: "#6b7280", border: "none", boxShadow: "none" }}>
                  {currentLang === "en" ? "Already Applied" : "पहले से लागू"}
                </button>
              ) : (
                <button className="btn-primary" onClick={() => handleApply(selectedScholarship.id)}>
                  {currentLang === "en" ? "Apply for Scholarship" : "छात्रवृत्ति के लिए आवेदन करें"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
