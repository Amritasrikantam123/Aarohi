import React, { useState } from "react";
import { User, Award, BookOpen, Briefcase, Plus, Trash2, Camera, Link2, MapPin, Globe, Phone, Mail, Edit3, Save, X, Sparkles } from "lucide-react";

export default function StudentProfileView({ studentProfile, onUpdateProfile, currentLang }) {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(studentProfile.bio || "");
  
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: studentProfile.name,
    email: studentProfile.email || "",
    contact: studentProfile.contact || "",
    school: studentProfile.school || "",
    class: studentProfile.class || "",
    district: studentProfile.district || "",
    state: studentProfile.state || "",
    linkedin: studentProfile.linkedin || ""
  });

  const [newAchievement, setNewAchievement] = useState({ title: "", date: "", desc: "" });
  const [showAddAchievement, setShowAddAchievement] = useState(false);

  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "", url: "" });
  const [showAddCert, setShowAddCert] = useState(false);

  const [newSkill, setNewSkill] = useState("");

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(studentProfile.avatar || "");

  const handleSaveBio = () => {
    const updated = { ...studentProfile, bio: bioInput };
    onUpdateProfile(updated);
    setIsEditingBio(false);
  };

  const handleSaveContact = () => {
    const updated = {
      ...studentProfile,
      name: contactForm.name,
      email: contactForm.email,
      contact: contactForm.contact,
      school: contactForm.school,
      class: contactForm.class,
      district: contactForm.district,
      state: contactForm.state,
      linkedin: contactForm.linkedin
    };
    onUpdateProfile(updated);
    setIsEditingContact(false);
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newAchievement.title.trim()) return;
    const achievements = studentProfile.achievements || [];
    const updated = {
      ...studentProfile,
      achievements: [...achievements, { ...newAchievement, id: "ach_" + Date.now() }]
    };
    onUpdateProfile(updated);
    setNewAchievement({ title: "", date: "", desc: "" });
    setShowAddAchievement(false);
  };

  const handleDeleteAchievement = (id) => {
    const achievements = studentProfile.achievements || [];
    const updated = {
      ...studentProfile,
      achievements: achievements.filter(a => a.id !== id)
    };
    onUpdateProfile(updated);
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    const certifications = studentProfile.certifications || [];
    const updated = {
      ...studentProfile,
      certifications: [...certifications, { ...newCert, id: "cert_" + Date.now() }]
    };
    onUpdateProfile(updated);
    setNewCert({ name: "", issuer: "", date: "", url: "" });
    setShowAddCert(false);
  };

  const handleDeleteCert = (id) => {
    const certifications = studentProfile.certifications || [];
    const updated = {
      ...studentProfile,
      certifications: certifications.filter(c => c.id !== id)
    };
    onUpdateProfile(updated);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const skills = studentProfile.skills || [];
    if (!skills.includes(newSkill.trim())) {
      const updated = {
        ...studentProfile,
        skills: [...skills, newSkill.trim()]
      };
      onUpdateProfile(updated);
    }
    setNewSkill("");
  };

  const handleDeleteSkill = (skillToDelete) => {
    const skills = studentProfile.skills || [];
    const updated = {
      ...studentProfile,
      skills: skills.filter(s => s !== skillToDelete)
    };
    onUpdateProfile(updated);
  };

  const handlePresetSelect = (presetData) => {
    const updated = { ...studentProfile, avatar: presetData };
    onUpdateProfile(updated);
    setShowPhotoModal(false);
  };

  const handleCustomPhotoSubmit = (e) => {
    e.preventDefault();
    const updated = { ...studentProfile, avatar: photoUrlInput };
    onUpdateProfile(updated);
    setShowPhotoModal(false);
  };

  return (
    <div style={{ animation: "modalIn 0.3s ease" }}>
      {/* Premium Elegant Cover Banner & Avatar */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
        height: "170px",
        borderRadius: "var(--radius-md) var(--radius-md) 0 0",
        marginBottom: "60px",
        boxShadow: "var(--shadow-premium)",
        overflow: "hidden"
      }}>
        {/* Abstract floating shapes for modern graphics */}
        <div style={{ position: "absolute", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", top: "-50px", right: "-30px", filter: "blur(20px)" }}></div>
        <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", bottom: "-20px", left: "20%", filter: "blur(10px)" }}></div>

        {/* Elegant overlay badge */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "30px",
          padding: "5px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#fff",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.5px"
        }}>
          <Sparkles size={12} />
          <span>{currentLang === "hi" ? "आरोही सशक्त उड़ान" : "AAROHI EMPOWERED"}</span>
        </div>

        {/* Profile Avatar Container */}
        <div style={{
          position: "absolute",
          left: "35px",
          bottom: "-45px",
          width: "105px",
          height: "105px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          padding: "3px",
          boxShadow: "0 10px 25px rgba(124, 58, 237, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {studentProfile.avatar ? (
              <img src={studentProfile.avatar} alt={studentProfile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <path d="M50 50c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 8c-16.6 0-30 13.4-30 30h60c0-16.6-13.4-30-30-30z" fill="#9ca3af"/>
              </svg>
            )}

            {/* Change Avatar Camera Trigger */}
            <button
              onClick={() => {
                setPhotoUrlInput(studentProfile.avatar || "");
                setShowPhotoModal(true);
              }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "28px",
                background: "rgba(30, 27, 75, 0.75)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              title="Change Profile Photo"
            >
              <Camera size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Info Grid */}
      <div className="grid-two-col" style={{ gridTemplateColumns: "2.1fr 1fr", gap: "1.5rem" }}>
        
        {/* Left Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header Card / Identity */}
          <div className="dashboard-card" style={{ position: "relative", padding: "2rem" }}>
            {!isEditingContact ? (
              <>
                <button
                  onClick={() => setIsEditingContact(true)}
                  style={{
                    position: "absolute",
                    right: "24px",
                    top: "24px",
                    background: "none",
                    border: "none",
                    color: "var(--primary-color)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    padding: "4px 8px",
                    borderRadius: "15px",
                    backgroundColor: "var(--lavender-light)",
                    transition: "var(--transition-smooth)"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "var(--lavender-bg)"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "var(--lavender-light)"}
                >
                  <Edit3 size={13} /> {currentLang === "hi" ? "संपादित करें" : "Edit Profile"}
                </button>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.5px" }}>{studentProfile.name}</h2>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.95rem", color: "var(--primary-hover)", fontWeight: 700 }}>
                    {studentProfile.class}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>•</span>
                  <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    {studentProfile.school}
                  </span>
                </div>

                {/* Elegant Contact Details Capsules Grid */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.78rem",
                    color: "#4f46e5",
                    background: "rgba(79, 70, 229, 0.06)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontWeight: 600
                  }}>
                    <MapPin size={12} /> {studentProfile.district}, {studentProfile.state}
                  </span>

                  {studentProfile.email && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.78rem",
                      color: "#7c3aed",
                      background: "rgba(124, 58, 237, 0.06)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontWeight: 600
                    }}>
                      <Mail size={12} /> {studentProfile.email}
                    </span>
                  )}

                  {studentProfile.contact && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.78rem",
                      color: "#0d9488",
                      background: "rgba(13, 148, 136, 0.06)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontWeight: 600
                    }}>
                      <Phone size={12} /> {studentProfile.contact}
                    </span>
                  )}

                  {studentProfile.linkedin && (
                    <a
                      href={studentProfile.linkedin.startsWith("http") ? studentProfile.linkedin : `https://${studentProfile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.78rem",
                        color: "#2563eb",
                        background: "rgba(37, 99, 235, 0.06)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "var(--transition-smooth)"
                      }}
                      onMouseOver={(e) => e.target.style.background = "rgba(37, 99, 235, 0.12)"}
                      onMouseOut={(e) => e.target.style.background = "rgba(37, 99, 235, 0.06)"}
                    >
                      <Link2 size={12} /> LinkedIn
                    </a>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveContact(); }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-main)" }}>Edit Profile Info</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>Class / Grade</label>
                    <select
                      className="form-control"
                      value={contactForm.class}
                      onChange={e => setContactForm({ ...contactForm, class: e.target.value })}
                    >
                      <option value="Class 11th">Class 11th</option>
                      <option value="Class 12th">Class 12th</option>
                      <option value="Passed 12th">Passed 12th</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label className="form-label" style={{ fontSize: "0.78rem" }}>School / College Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contactForm.school}
                    onChange={e => setContactForm({ ...contactForm, school: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contactForm.contact}
                      onChange={e => setContactForm({ ...contactForm, contact: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>District</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contactForm.district}
                      onChange={e => setContactForm({ ...contactForm, district: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.78rem" }}>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contactForm.state}
                      onChange={e => setContactForm({ ...contactForm, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label" style={{ fontSize: "0.78rem" }}>LinkedIn Profile Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={contactForm.linkedin}
                    onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setContactForm({
                        name: studentProfile.name,
                        email: studentProfile.email || "",
                        contact: studentProfile.contact || "",
                        school: studentProfile.school || "",
                        class: studentProfile.class || "",
                        district: studentProfile.district || "",
                        state: studentProfile.state || "",
                        linkedin: studentProfile.linkedin || ""
                      });
                      setIsEditingContact(false);
                    }}
                    style={{ padding: "5px 12px", fontSize: "0.8rem" }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>
                    <Save size={12} style={{ marginRight: "3px" }} /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* About Me Section */}
          <div className="dashboard-card" style={{ position: "relative", padding: "2rem" }}>
            <h3 className="dashboard-card-title" style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              {currentLang === "hi" ? "मेरे बारे में" : "About Me"}
            </h3>
            
            {!isEditingBio ? (
              <>
                <button
                  onClick={() => setIsEditingBio(true)}
                  style={{
                    position: "absolute",
                    right: "24px",
                    top: "24px",
                    background: "none",
                    border: "none",
                    color: "var(--primary-color)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    padding: "4px 8px",
                    borderRadius: "15px",
                    backgroundColor: "var(--lavender-light)"
                  }}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <p style={{
                  color: studentProfile.bio ? "var(--text-main)" : "var(--text-muted)",
                  fontSize: "0.92rem",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap"
                }}>
                  {studentProfile.bio || (currentLang === "hi" 
                    ? "अपने बारे में कुछ लिखें (जैसे आपके सपने, करियर लक्ष्य और प्रेरणा)।" 
                    : "Write something about yourself (your dreams, aspirations, academic goals, and hobbies).")}
                </p>
              </>
            ) : (
              <div>
                <textarea
                  className="form-control"
                  rows="4"
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  placeholder="Share details about your academic interest, goals, and achievements..."
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => { setBioInput(studentProfile.bio || ""); setIsEditingBio(false); }}
                    style={{ padding: "5px 12px", fontSize: "0.8rem" }}
                  >
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSaveBio} style={{ padding: "5px 12px", fontSize: "0.8rem" }}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div className="dashboard-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 className="dashboard-card-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
                <Award size={18} color="var(--accent-color)" />
                <span>Achievements & Awards</span>
              </h3>
              <button
                className="btn-primary"
                onClick={() => setShowAddAchievement(!showAddAchievement)}
                style={{
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "15px",
                  fontWeight: 700
                }}
              >
                <Plus size={12} /> Add New
              </button>
            </div>

            {showAddAchievement && (
              <form onSubmit={handleAddAchievement} style={{
                background: "var(--lavender-light)",
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                marginBottom: "1.5rem"
              }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-main)" }}>Add Achievement</h4>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Award/Achievement Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 1st Place in District Science Fair"
                    value={newAchievement.title}
                    onChange={e => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }} className="form-row-two">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dec 2025"
                      value={newAchievement.date}
                      onChange={e => setNewAchievement({ ...newAchievement, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Won cash prize of ₹10,000 for smart solar stove model"
                      value={newAchievement.desc}
                      onChange={e => setNewAchievement({ ...newAchievement, desc: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddAchievement(false)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    Add
                  </button>
                </div>
              </form>
            )}

            {studentProfile.achievements && studentProfile.achievements.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>
                {/* Timeline vertical guide line */}
                <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "1.5px", background: "rgba(108, 99, 255, 0.15)" }}></div>
                
                {studentProfile.achievements.map((ach) => (
                  <div key={ach.id} style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingLeft: "8px"
                  }}>
                    {/* Timeline bullet dot */}
                    <div style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      border: "2.5px solid var(--primary-color)",
                      marginTop: "4px",
                      zIndex: 2,
                      flexShrink: 0
                    }}></div>

                    <div style={{
                      flexGrow: 1,
                      paddingBottom: "1rem",
                      borderBottom: "1px solid rgba(108, 99, 255, 0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{ach.title}</h4>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{ach.date}</span>
                        {ach.desc && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>{ach.desc}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteAchievement(ach.id)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "4px", display: "inline-flex" }}
                        title="Delete achievement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
                No achievements added yet. Showcase your milestones here!
              </p>
            )}
          </div>

          {/* Certifications Section */}
          <div className="dashboard-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 className="dashboard-card-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
                <BookOpen size={18} color="var(--primary-color)" />
                <span>Certifications & Courses</span>
              </h3>
              <button
                className="btn-primary"
                onClick={() => setShowAddCert(!showAddCert)}
                style={{
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "15px",
                  fontWeight: 700
                }}
              >
                <Plus size={12} /> Add New
              </button>
            </div>

            {showAddCert && (
              <form onSubmit={handleAddCert} style={{
                background: "var(--lavender-light)",
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                marginBottom: "1.5rem"
              }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-main)" }}>Add Certification</h4>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Certificate Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Intro to Python Programming"
                    value={newCert.name}
                    onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row-two">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Issuing Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Coursera / Google"
                      value={newCert.issuer}
                      onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Issue Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. November 2025"
                      value={newCert.date}
                      onChange={e => setNewCert({ ...newCert, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Credential Verification URL (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={newCert.url}
                    onChange={e => setNewCert({ ...newCert, url: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddCert(false)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    Add
                  </button>
                </div>
              </form>
            )}

            {studentProfile.certifications && studentProfile.certifications.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>
                {/* Timeline vertical guide line */}
                <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "1.5px", background: "rgba(108, 99, 255, 0.15)" }}></div>

                {studentProfile.certifications.map((crt) => (
                  <div key={crt.id} style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingLeft: "8px"
                  }}>
                    {/* Timeline bullet dot */}
                    <div style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      border: "2.5px solid var(--secondary-color)",
                      marginTop: "4px",
                      zIndex: 2,
                      flexShrink: 0
                    }}></div>

                    <div style={{
                      flexGrow: 1,
                      paddingBottom: "1rem",
                      borderBottom: "1px solid rgba(108, 99, 255, 0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>{crt.name}</h4>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginTop: "2px" }}>
                          {crt.issuer} <span style={{ color: "#cbd5e1", margin: "0 4px" }}>•</span> Issued {crt.date}
                        </div>
                        {crt.url && (
                          <a
                            href={crt.url.startsWith("http") ? crt.url : `https://${crt.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "0.75rem",
                              color: "var(--primary-color)",
                              fontWeight: 700,
                              marginTop: "8px",
                              textDecoration: "none"
                            }}
                          >
                            <Link2 size={12} /> View Certificate
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCert(crt.id)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "4px", display: "inline-flex" }}
                        title="Delete certification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
                No certifications added yet. Upload courses you have completed.
              </p>
            )}
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Skills Section */}
          <div className="dashboard-card" style={{ padding: "1.75rem" }}>
            <h3 className="dashboard-card-title" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "6px", fontSize: "1.05rem" }}>
              <Briefcase size={16} color="var(--secondary-color)" />
              <span>Skills Portfolio</span>
            </h3>
            
            <form onSubmit={handleAddSkill} style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
              <input
                type="text"
                className="form-control"
                style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", flexGrow: 1 }}
                placeholder="e.g. Coding, Speaking"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
              />
              <button
                type="submit"
                style={{
                  padding: "8px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--primary-color)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Plus size={16} />
              </button>
            </form>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(studentProfile.skills && studentProfile.skills.length > 0) ? (
                studentProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "rgba(108, 99, 255, 0.06)",
                      color: "var(--primary-color)",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      border: "1px solid rgba(108, 99, 255, 0.15)",
                      transition: "var(--transition-smooth)"
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary-color)",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        padding: 0,
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))
              ) : (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", width: "100%", textAlign: "center", padding: "1rem 0" }}>
                  No skills listed yet. Add your core strengths.
                </p>
              )}
            </div>
          </div>

          {/* Verification Badges Desk */}
          <div className="dashboard-card" style={{ padding: "1.75rem", background: "linear-gradient(135deg, rgba(129,140,248,0.06) 0%, rgba(217,70,239,0.06) 100%)", border: "1px dashed var(--primary-light)" }}>
            <h3 className="dashboard-card-title" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>Aarohi Verification</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "0.75rem" }}>
              <div style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Verified Profile</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.4 }}>Academic documents verified by Aarohi Mission</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Change Profile Photo Modal */}
      {showPhotoModal && (
        <div className="modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "480px", padding: "2rem" }}>
            <div className="modal-header">
              <span className="modal-title" style={{ fontWeight: 800 }}>Change Profile Photo</span>
              <button className="modal-close-btn" onClick={() => setShowPhotoModal(false)}>×</button>
            </div>
            
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Presets Grid */}
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.75rem" }}>Choose an Avatar:</span>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  {[
                    { emoji: "👩‍💻", fill: "%23e0e7ff" },
                    { emoji: "👩‍🎓", fill: "%23fdf2f8" },
                    { emoji: "👩‍🔬", fill: "%23ecfdf5" },
                    { emoji: "👩‍💼", fill: "%23fffbeb" }
                  ].map((item, idx) => {
                    const avatarData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="${item.fill}"/><text x="50%" y="60%" font-size="50" dominant-baseline="middle" text-anchor="middle">${item.emoji}</text></svg>`;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePresetSelect(avatarData)}
                        style={{
                          fontSize: "1.8rem",
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          border: "1.5px solid #d1d5db",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.08)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                      >
                        {item.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", backgroundColor: "#fff", padding: "0 10px", zIndex: 2, position: "relative" }}>OR</span>
                <div style={{ width: "100%", height: "1px", backgroundColor: "var(--border-color)", position: "absolute" }}></div>
              </div>

              {/* Upload Local Image File */}
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>Upload Image File:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handlePresetSelect(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    fontSize: "0.8rem",
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    background: "#fff"
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", backgroundColor: "#fff", padding: "0 10px", zIndex: 2, position: "relative" }}>OR</span>
                <div style={{ width: "100%", height: "1px", backgroundColor: "var(--border-color)", position: "absolute" }}></div>
              </div>

              {/* Web URL input */}
              <form onSubmit={handleCustomPhotoSubmit}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>Paste Image Web URL:</label>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={photoUrlInput.startsWith("data:") ? "" : photoUrlInput}
                      onChange={e => setPhotoUrlInput(e.target.value)}
                      style={{ flexGrow: 1 }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: "0 14px", fontWeight: 700 }}>Apply</button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
