import React, { useState } from "react";
import { Search, Filter, Calendar, Users, Star, CheckCircle, Video, MessageSquare, Clock, X } from "lucide-react";
import { getDB, saveDB } from "../data/mockData";

export default function Mentorship({ studentProfile, onUpdateProfile, currentLang }) {
  const db = getDB();
  const [mentors, setMentors] = useState(db.mentors);
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState("All");

  // Booking Modal State
  const [bookingMentor, setBookingMentor] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    topic: ""
  });
  const [bookingError, setBookingError] = useState("");

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.date || !bookingForm.time || !bookingForm.topic.trim()) {
      setBookingError(currentLang === "en" ? "Please fill in all fields." : "कृपया सभी फ़ील्ड भरें।");
      return;
    }

    const newBooking = {
      mentorId: bookingMentor.id,
      mentorName: bookingMentor.name,
      date: bookingForm.date,
      time: bookingForm.time,
      topic: bookingForm.topic
    };

    const updatedProfile = {
      ...studentProfile,
      bookedSessions: [...(studentProfile.bookedSessions || []), newBooking]
    };

    // Save to database
    const currentDB = getDB();
    currentDB.studentProfile = updatedProfile;
    saveDB(currentDB);

    // Notify parent state
    onUpdateProfile(updatedProfile);

    // Reset
    setBookingForm({ date: "", time: "", topic: "" });
    setBookingError("");
    setBookingMentor(null);
  };

  const handleCancelSession = (index) => {
    const updatedSessions = studentProfile.bookedSessions.filter((_, i) => i !== index);
    const updatedProfile = {
      ...studentProfile,
      bookedSessions: updatedSessions
    };

    const currentDB = getDB();
    currentDB.studentProfile = updatedProfile;
    saveDB(currentDB);

    onUpdateProfile(updatedProfile);
  };

  // Filter Logic
  const filteredMentors = mentors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = fieldFilter === "All" || m.field.includes(fieldFilter);
    return matchesSearch && matchesField;
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {currentLang === "en" ? "Mentorship & Counseling" : "मेंटरशिप और काउंसलिंग"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          {currentLang === "en" ? "Connect with experienced female professionals for academic and career advice." : "शैक्षणिक और करियर सलाह के लिए अनुभवी महिला पेशेवरों से जुड़ें।"}
        </p>
      </div>

      {/* Booked Sessions timeline */}
      {studentProfile.bookedSessions && studentProfile.bookedSessions.length > 0 && (
        <div className="dashboard-card" style={{ borderLeft: "4px solid var(--primary-color)" }}>
          <h3 className="dashboard-card-title">
            <span><Clock size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} /> {currentLang === "en" ? "My Scheduled Counseling Sessions" : "मेरी अनुसूचित काउंसलिंग सत्र"}</span>
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {studentProfile.bookedSessions.map((session, idx) => {
              const mentorInfo = mentors.find(m => m.id === session.mentorId) || { name: session.mentorName || "Mentor", role: "Advisor" };
              return (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-primary)"
                }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: "var(--lavender-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary-color)",
                      fontWeight: 700
                    }}>
                      {mentorInfo.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)" }}>
                        {mentorInfo.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {mentorInfo.role}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--primary-hover)", fontWeight: 500, marginTop: "0.25rem" }}>
                        Topic: "{session.topic}"
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Calendar size={14} /> {session.date}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {session.time} (Online Call)
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleCancelSession(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "5px",
                        borderRadius: "50%"
                      }}
                      title="Cancel Booking"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="dashboard-card" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexGrow: 1 }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder={currentLang === "en" ? "Search mentors by name, bio, or role..." : "नाम, जीवनी या भूमिका द्वारा मेंटर्स खोजें..."}
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
            value={fieldFilter}
            onChange={e => setFieldFilter(e.target.value)}
          >
            <option value="All">{currentLang === "en" ? "All Fields" : "सभी क्षेत्र"}</option>
            <option value="Engineering">{currentLang === "en" ? "Engineering" : "इंजीनियरिंग"}</option>
            <option value="Medicine">{currentLang === "en" ? "Medicine" : "चिकित्सा"}</option>
            <option value="Law">{currentLang === "en" ? "Law" : "कानून"}</option>
            <option value="Commerce">{currentLang === "en" ? "Commerce" : "वाणिज्य"}</option>
            <option value="Government">{currentLang === "en" ? "Government Services" : "सरकारी सेवाएं"}</option>
            <option value="Entrepreneurship">{currentLang === "en" ? "Entrepreneurship" : "उद्यमिता"}</option>
          </select>
        </div>
      </div>

      {/* Mentors Grid List */}
      <div className="grid-two-col">
        {filteredMentors.map(m => (
          <div key={m.id} className="card-item" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "var(--lavender-bg)",
                    border: "2px solid var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary-color)",
                    fontWeight: 700,
                    fontSize: "1.2rem"
                  }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>{m.name}</h3>
                    <div style={{ fontSize: "0.8rem", color: "var(--primary-hover)", fontWeight: 600 }}>{m.role}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "3px", backgroundColor: "#fef3c7", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 700, color: "#d97706" }}>
                  <Star size={12} fill="#d97706" /> {m.rating}
                </div>
              </div>

              <div style={{ margin: "1rem 0", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <span className="badge primary" style={{ fontSize: "0.7rem" }}>Field: {m.field}</span>
                <span className="badge warning" style={{ fontSize: "0.7rem" }}>Exp: {m.experience}</span>
                <span className="badge success" style={{ fontSize: "0.7rem" }}>Lang: {m.languages.join(", ")}</span>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineLine: 1.5, marginBottom: "1.25rem" }}>
                {m.bio}
              </p>
            </div>

            <div style={{ 
              borderTop: "1px solid var(--border-color)", 
              paddingTop: "1rem", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginTop: "auto"
            }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                {m.availStatus}
              </span>
              
              <button 
                className="btn-primary" 
                style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
                onClick={() => setBookingMentor(m)}
              >
                <Video size={14} style={{ marginRight: "4px" }} /> {currentLang === "en" ? "Book Counseling" : "परामर्श सत्र बुक करें"}
              </button>
            </div>
          </div>
        ))}

        {filteredMentors.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            {currentLang === "en" ? "No matching mentors found." : "कोई मिलान वाला मार्गदर्शक नहीं मिला।"}
          </div>
        )}
      </div>

      {/* Booking Slot Modal */}
      {bookingMentor && (
        <div className="modal-overlay" onClick={() => setBookingMentor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Book Session with {bookingMentor.name}</span>
              <button className="modal-close-btn" onClick={() => setBookingMentor(null)}>×</button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="modal-body">
                <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                  Mentor Field: <strong>{bookingMentor.field}</strong> | Languages: <strong>{bookingMentor.languages.join(", ")}</strong>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label className="form-label">{currentLang === "en" ? "Choose Date" : "तिथि चुनें"}</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingForm.date}
                      onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{currentLang === "en" ? "Select Time Slot" : "समय स्लॉट चुनें"}</label>
                    <select 
                      className="form-control"
                      value={bookingForm.time}
                      onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                    >
                      <option value="">-- Select Time Slot --</option>
                      <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                      <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                      <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                      <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{currentLang === "en" ? "Counseling Topic / Question" : "परामर्श का विषय / प्रश्न"}</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder={currentLang === "en" ? "Explain what advice you need (e.g. Higher studies planning, preparation strategy)" : "समझाएं कि आपको क्या सलाह चाहिए"}
                    value={bookingForm.topic}
                    onChange={e => setBookingForm({ ...bookingForm, topic: e.target.value })}
                  ></textarea>
                </div>

                {bookingError && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.5rem" }}>{bookingError}</div>}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setBookingMentor(null)}>
                  {currentLang === "en" ? "Cancel" : "रद्द करें"}
                </button>
                <button type="submit" className="btn-primary">
                  {currentLang === "en" ? "Confirm Slot Booking" : "बुकिंग की पुष्टि करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
