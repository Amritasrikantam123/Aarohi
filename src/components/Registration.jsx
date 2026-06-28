import React, { useState } from "react";
import { User, Calendar, MapPin, Award, Phone, Mail, BookOpen, GraduationCap, AlertCircle, ArrowLeft, Link2 } from "lucide-react";
import { getDB, saveDB, logActivity } from "../data/mockData";

export default function Registration({ onBackToHome, onRegistrationSuccess, currentLang = "en", isMentorMode = false }) {
  const [studentForm, setStudentForm] = useState({
    name: "",
    age: "",
    school: "",
    className: "",
    state: "Rajasthan",
    district: "",
    familyIncome: "",
    contact: "",
    email: "",
    careerInterests: [],
    avatar: ""
  });

  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "",
    organization: "",
    field: "Engineering & Technology",
    state: "Telangana",
    languages: [],
    experience: "5 Years",
    bio: "",
    proof: ""
  });

  const [errors, setErrors] = useState({});

  const indianStates = [
    "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Karnataka", 
    "Jharkhand", "Maharashtra", "Rajasthan", "Telangana", "Uttar Pradesh"
  ];

  const careerFields = [
    "Engineering & Technology",
    "Medicine & Healthcare",
    "Law & Justice",
    "Commerce & Finance",
    "Arts, Design & Humanities",
    "Government Services",
    "Entrepreneurship",
    "Research & Higher Studies"
  ];

  const handleLangToggle = (lang) => {
    setMentorForm(prev => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        return { ...prev, languages: prev.languages.filter(l => l !== lang) };
      } else {
        return { ...prev, languages: [...prev.languages, lang] };
      }
    });
  };

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: ""
  });

  const validateStudent = () => {
    let err = {};
    if (!isLoginMode) {
      if (!studentForm.name.trim()) err.name = "Full name is required";
      if (!studentForm.age || parseInt(studentForm.age) < 10) err.age = "Valid age is required";
      if (!studentForm.school.trim()) err.school = "School name is required";
      if (!studentForm.className) err.className = "Class selection is required";
      if (!studentForm.district.trim()) err.district = "District name is required";
      if (!studentForm.familyIncome || parseFloat(studentForm.familyIncome) < 0) err.familyIncome = "Income details are required";
      if (!studentForm.contact.trim()) err.contact = "Contact number is required";
    }
    if (!authForm.email.trim() || !authForm.email.includes("@")) err.email = "Valid email is required";
    if (!authForm.password || authForm.password.length < 4) err.password = "Password must be at least 4 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateMentor = () => {
    let err = {};
    if (!isLoginMode) {
      if (!mentorForm.name.trim()) err.name = "Full name is required";
      if (!mentorForm.role.trim()) err.role = "Professional role is required";
      if (!mentorForm.organization.trim()) err.organization = "Organization/Company is required";
      if (!mentorForm.bio.trim()) err.bio = "Bio details are required";
      if (!mentorForm.proof.trim() || !mentorForm.proof.startsWith("http")) err.proof = "A valid LinkedIn or portfolio URL is required";
    }
    if (!authForm.email.trim() || !authForm.email.includes("@")) err.email = "Valid email is required";
    if (!authForm.password || authForm.password.length < 4) err.password = "Password must be at least 4 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudent()) return;

    try {
      const endpoint = isLoginMode ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
      const payload = isLoginMode 
        ? { email: authForm.email, password: authForm.password }
        : {
            name: studentForm.name,
            email: authForm.email,
            password: authForm.password,
            role: "student",
            age: parseInt(studentForm.age),
            school: studentForm.school,
            class: studentForm.className,
            district: studentForm.district,
            state: studentForm.state,
            familyIncome: parseFloat(studentForm.familyIncome),
            contact: studentForm.contact,
            careerInterests: studentForm.careerInterests,
            academicRecords: [],
            avatar: studentForm.avatar || "",
            featuredStory: { 
              isFeatured: true, 
              quoteEn: "Aarohi gave me the confidence to pursue secondary education and discover amazing scholarship opportunities!", 
              quoteHi: "आरोही ने मुझे माध्यमिक शिक्षा प्राप्त करने और शानदार छात्रवृत्ति के अवसरों को खोजने का आत्मविश्वास दिया!", 
              quoteTe: "ఆరోహి నాకు సెకండరీ విద్యను అభ్యసించడానికి మరియు అద్భుతమైన స్కాలర్‌షిప్స్ కనుగొనడానికి విశ్వాసాన్ని ఇచ్చింది!", 
              approved: true 
            }
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Authentication failed");
        return;
      }

      localStorage.setItem("aarohi_token", data.token);
      localStorage.setItem("aarohi_user", JSON.stringify(data.user));

      const db = getDB();
      db.studentProfile = data.user.studentProfile || data.user;
      if (!isLoginMode) {
        db.studentsList.push(db.studentProfile);
      }
      saveDB(db);

      logActivity(
        isLoginMode ? `Student ${db.studentProfile.name} logged in.` : `A new student, ${db.studentProfile.name}, registered from ${db.studentProfile.district}, ${db.studentProfile.state}.`,
        isLoginMode ? `छात्रा ${db.studentProfile.name} ने लॉगिन किया।` : `एक नई छात्रा, ${db.studentProfile.name}, ने ${db.studentProfile.district}, ${db.studentProfile.state} से पंजीकरण किया।`,
        isLoginMode ? `విద్యార్థిని ${db.studentProfile.name} లాగిన్ అయ్యారు.` : `${db.studentProfile.district}, ${db.studentProfile.state} నుండి కొత్త విద్యార్థిని ${db.studentProfile.name} నమోదు చేసుకున్నారు.`
      );

      onRegistrationSuccess(db.studentProfile);
    } catch (err) {
      console.error(err);
      alert("Backend connection error. Ensure the backend server is running.");
    }
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    if (!validateMentor()) return;

    try {
      const endpoint = isLoginMode ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
      const payload = isLoginMode
        ? { email: authForm.email, password: authForm.password }
        : {
            name: mentorForm.name,
            email: authForm.email,
            password: authForm.password,
            role: "mentor",
            organization: mentorForm.organization,
            field: mentorForm.field,
            state: mentorForm.state,
            languages: mentorForm.languages.length > 0 ? mentorForm.languages : ["English"],
            experience: mentorForm.experience,
            bio: mentorForm.bio,
            proof: mentorForm.proof,
            status: "pending"
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Authentication failed");
        return;
      }

      localStorage.setItem("aarohi_token", data.token);
      localStorage.setItem("aarohi_user", JSON.stringify(data.user));

      if (isLoginMode) {
        alert("Logged in successfully!");
        onBackToHome();
      } else {
        alert(currentLang === "hi" ? "आपका मार्गदर्शक आवेदन सफलतापूर्वक जमा हो गया है और समीक्षा के अधीन है।" : currentLang === "te" ? "మీ మెంటార్ దరఖాస్తు విజయవంతంగా సమర్పించబడింది." : "Your mentor application has been successfully submitted and is under review.");
        onBackToHome();
      }
    } catch (err) {
      console.error(err);
      alert("Backend connection error. Ensure backend server is running.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--lavender-light) 0%, var(--bg-primary) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1.5rem"
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-premium)",
        border: "1px solid var(--border-color)",
        width: "100%",
        maxWidth: "680px",
        overflow: "hidden"
      }}>
        {/* Header banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
          padding: "2rem",
          color: "#fff",
          position: "relative"
        }}>
          <button 
            onClick={onBackToHome}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "1rem"
            }}
          >
            <ArrowLeft size={16} /> 
            {currentLang === "hi" ? "होम पेज पर वापस जाएं" : currentLang === "te" ? "మొదటి పేజీకి తిరిగి వెళ్లండి" : "Back to Home"}
          </button>
          
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "var(--font-hindi)" }}>
            {isMentorMode 
              ? (currentLang === "hi" ? "मार्गदर्शक ऑनबोर्डिंग आवेदन" : "Volunteer Mentor Registration") 
              : (currentLang === "hi" ? "छात्रा सशक्तिकरण पंजीकरण" : "Student Registration")}
          </h2>
          <p style={{ color: "#f5f3ff", fontSize: "0.88rem", marginTop: "0.25rem" }}>
            {isMentorMode 
              ? "Join our national network of successful professionals guiding post-10th girls."
              : "Access scholarships, structured career roadmaps, and verified mentors."}
          </p>
        </div>

        {/* Toggle Login Mode Tab */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(false); setErrors({}); }}
            style={{
              flex: 1,
              padding: "1rem",
              background: !isLoginMode ? "#fff" : "var(--lavender-light)",
              border: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: !isLoginMode ? "var(--primary-color)" : "var(--text-muted)",
              cursor: "pointer",
              borderBottom: !isLoginMode ? "3px solid var(--primary-color)" : "none"
            }}
          >
            {currentLang === "hi" ? "नया पंजीकरण" : "Register"}
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(true); setErrors({}); }}
            style={{
              flex: 1,
              padding: "1rem",
              background: isLoginMode ? "#fff" : "var(--lavender-light)",
              border: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: isLoginMode ? "var(--primary-color)" : "var(--text-muted)",
              cursor: "pointer",
              borderBottom: isLoginMode ? "3px solid var(--primary-color)" : "none"
            }}
          >
            {currentLang === "hi" ? "लॉगिन करें" : "Login"}
          </button>
        </div>

        {/* Student Form */}
        {!isMentorMode ? (
          <form onSubmit={handleStudentSubmit} style={{ padding: "2.5rem" }}>
            {/* Email and Password fields */}
            <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    style={{ paddingLeft: "2.5rem" }} 
                    placeholder="name@example.com"
                    value={authForm.email} 
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })} 
                  />
                </div>
                {errors.email && <span className="form-error"><AlertCircle size={12} /> {errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter secure password"
                  value={authForm.password} 
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })} 
                />
                {errors.password && <span className="form-error"><AlertCircle size={12} /> {errors.password}</span>}
              </div>
            </div>

            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ paddingLeft: "2.5rem" }} 
                      placeholder="Enter full name"
                      value={studentForm.name} 
                      onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} 
                    />
                  </div>
                  {errors.name && <span className="form-error"><AlertCircle size={12} /> {errors.name}</span>}
                </div>

                <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <div style={{ position: "relative" }}>
                      <Calendar size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                      <input 
                        type="number" 
                        className="form-control" 
                        style={{ paddingLeft: "2.5rem" }} 
                        placeholder="e.g. 17"
                        value={studentForm.age} 
                        onChange={e => setStudentForm({ ...studentForm, age: e.target.value })} 
                      />
                    </div>
                    {errors.age && <span className="form-error">{errors.age}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <div style={{ position: "relative" }}>
                      <GraduationCap size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                      <select 
                        className="form-control" 
                        style={{ paddingLeft: "2.5rem" }}
                        value={studentForm.className} 
                        onChange={e => setStudentForm({ ...studentForm, className: e.target.value })}
                      >
                        <option value="">-- Select Class --</option>
                        <option value="Class 11th">Class 11th</option>
                        <option value="Class 12th">Class 12th</option>
                        <option value="Passed 12th">Passed 12th</option>
                      </select>
                    </div>
                    {errors.className && <span className="form-error">{errors.className}</span>}
                  </div>
                </div>

            <div className="form-group">
              <label className="form-label">School / College Name</label>
              <div style={{ position: "relative" }}>
                <BookOpen size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: "2.5rem" }} 
                  placeholder="Enter school name"
                  value={studentForm.school} 
                  onChange={e => setStudentForm({ ...studentForm, school: e.target.value })} 
                />
              </div>
              {errors.school && <span className="form-error">{errors.school}</span>}
            </div>

            <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                  <select 
                    className="form-control" 
                    style={{ paddingLeft: "2.5rem" }}
                    value={studentForm.state} 
                    onChange={e => setStudentForm({ ...studentForm, state: e.target.value })}
                  >
                    {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Warangal"
                  value={studentForm.district} 
                  onChange={e => setStudentForm({ ...studentForm, district: e.target.value })} 
                />
                {errors.district && <span className="form-error">{errors.district}</span>}
              </div>
            </div>

            <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Annual Family Income (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 120000"
                  value={studentForm.familyIncome} 
                  onChange={e => setStudentForm({ ...studentForm, familyIncome: e.target.value })} 
                />
                {errors.familyIncome && <span className="form-error">{errors.familyIncome}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Contact Mobile Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ paddingLeft: "2.5rem" }} 
                    placeholder="10-digit number"
                    value={studentForm.contact} 
                    onChange={e => setStudentForm({ ...studentForm, contact: e.target.value })} 
                  />
                </div>
                {errors.contact && <span className="form-error">{errors.contact}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                <span>Profile Photo</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Choose any method below</span>
              </label>

              {/* Photo Preview & Options Layout */}
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", background: "var(--lavender-light)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "#e5e7eb",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--primary-color)",
                  boxShadow: "var(--shadow-sm)",
                  flexShrink: 0
                }}>
                  {studentForm.avatar ? (
                    <img src={studentForm.avatar} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <rect width="100%" height="100%" fill="#f3f4f6"/>
                      <path d="M50 50c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 8c-16.6 0-30 13.4-30 30h60c0-16.6-13.4-30-30-30z" fill="#9ca3af"/>
                    </svg>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                  {/* Preset Avatars Row */}
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>Select a Preset Avatar:</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {[
                        { emoji: "👩‍💻", fill: "%23e0e7ff" },
                        { emoji: "👩‍🎓", fill: "%23fdf2f8" },
                        { emoji: "👩‍🔬", fill: "%23ecfdf5" },
                        { emoji: "👩‍💼", fill: "%23fffbeb" }
                      ].map((item, idx) => {
                        const avatarData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="${item.fill}"/><text x="50%" y="60%" font-size="50" dominant-baseline="middle" text-anchor="middle">${item.emoji}</text></svg>`;
                        const isSelected = studentForm.avatar === avatarData;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setStudentForm({ ...studentForm, avatar: avatarData })}
                            style={{
                              fontSize: "1.2rem",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              border: isSelected ? "2.5px solid var(--primary-color)" : "1px solid #d1d5db",
                              cursor: "pointer",
                              backgroundColor: isSelected ? "#fff" : "rgba(255,255,255,0.8)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                              transform: isSelected ? "scale(1.1)" : "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {item.emoji}
                          </button>
                        );
                      })}
                      {studentForm.avatar && (
                        <button
                          type="button"
                          onClick={() => setStudentForm({ ...studentForm, avatar: "" })}
                          style={{
                            fontSize: "0.72rem",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            border: "1px solid #ef4444",
                            color: "#ef4444",
                            cursor: "pointer",
                            background: "transparent",
                            fontWeight: 600
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* File Upload Selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <label style={{
                      backgroundColor: "var(--primary-color)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-block",
                      border: "none",
                      boxShadow: "var(--shadow-sm)"
                    }}>
                      Upload Photo File
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setStudentForm({ ...studentForm, avatar: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>or paste URL below:</span>
                  </div>
                </div>
              </div>

              {/* URL Input Option */}
              <input 
                type="text" 
                className="form-control" 
                style={{ marginTop: "0.5rem" }}
                placeholder="Paste profile photo image web URL (e.g. https://...)"
                value={studentForm.avatar.startsWith("data:") ? "" : studentForm.avatar} 
                onChange={e => setStudentForm({ ...studentForm, avatar: e.target.value })} 
              />
              </div>
              </>
            )}

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem", display: "flex", justifyContent: "center" }}>
              {isLoginMode 
                ? (currentLang === "hi" ? "लॉगिन करें" : "Login & Access Dashboard")
                : (currentLang === "hi" ? "पंजीकरण करें" : "Register & Access Dashboard")}
            </button>
          </form>
        ) : (
          /* Mentor Form */
          <form onSubmit={handleMentorSubmit} style={{ padding: "2.5rem" }}>
            {/* Email and Password fields */}
            <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    style={{ paddingLeft: "2.5rem" }} 
                    placeholder="mentor@example.com"
                    value={authForm.email} 
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })} 
                  />
                </div>
                {errors.email && <span className="form-error"><AlertCircle size={12} /> {errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter secure password"
                  value={authForm.password} 
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })} 
                />
                {errors.password && <span className="form-error"><AlertCircle size={12} /> {errors.password}</span>}
              </div>
            </div>

            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label className="form-label">Professional Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ paddingLeft: "2.5rem" }} 
                      placeholder="e.g. Dr. Kavitha Reddy"
                      value={mentorForm.name} 
                      onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })} 
                    />
                  </div>
                  {errors.name && <span className="form-error"><AlertCircle size={12} /> {errors.name}</span>}
                </div>

            <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Senior Researcher"
                  value={mentorForm.role} 
                  onChange={e => setMentorForm({ ...mentorForm, role: e.target.value })} 
                />
                {errors.role && <span className="form-error">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Company / Institution</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. ISRO / IIT"
                  value={mentorForm.organization} 
                  onChange={e => setMentorForm({ ...mentorForm, organization: e.target.value })} 
                />
                {errors.organization && <span className="form-error">{errors.organization}</span>}
              </div>
            </div>

            <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Field of Expertise</label>
                <select 
                  className="form-control"
                  value={mentorForm.field} 
                  onChange={e => setMentorForm({ ...mentorForm, field: e.target.value })}
                >
                  {careerFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State of Residence</label>
                <select 
                  className="form-control"
                  value={mentorForm.state} 
                  onChange={e => setMentorForm({ ...mentorForm, state: e.target.value })}
                >
                  {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Proof URL (LinkedIn / Profile Link)</label>
              <div style={{ position: "relative" }}>
                <Link2 size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="https://linkedin.com/in/your-profile"
                  value={mentorForm.proof} 
                  onChange={e => setMentorForm({ ...mentorForm, proof: e.target.value })} 
                />
              </div>
              {errors.proof && <span className="form-error">{errors.proof}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <select 
                className="form-control"
                value={mentorForm.experience} 
                onChange={e => setMentorForm({ ...mentorForm, experience: e.target.value })}
              >
                <option value="2-5 Years">2 to 5 Years</option>
                <option value="5-10 Years">5 to 10 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Languages Supported</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["English", "Hindi", "Telugu", "Tamil", "Kannada"].map(lng => (
                  <button 
                    key={lng} 
                    type="button"
                    style={{
                      padding: "4px 10px",
                      borderRadius: "15px",
                      border: "1.5px solid var(--primary-light)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      backgroundColor: mentorForm.languages.includes(lng) ? "var(--primary-color)" : "transparent",
                      color: mentorForm.languages.includes(lng) ? "#fff" : "var(--primary-color)"
                    }}
                    onClick={() => handleLangToggle(lng)}
                  >
                    {lng}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Motivation & Bio</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Explain why you want to guide Aarohi girls..."
                value={mentorForm.bio} 
                onChange={e => setMentorForm({ ...mentorForm, bio: e.target.value })} 
              />
              {errors.bio && <span className="form-error">{errors.bio}</span>}
            </div>

              </>
            )}

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem", display: "flex", justifyContent: "center" }}>
              {isLoginMode 
                ? (currentLang === "hi" ? "लॉगिन करें" : "Login & Access Dashboard")
                : (currentLang === "hi" ? "आवेदन जमा करें" : "Submit Onboarding Application")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
