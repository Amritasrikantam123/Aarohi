import React, { useState } from "react";
import { User, Mail, Briefcase, Award, Phone, Globe, BookOpen, AlertCircle, ArrowLeft, Send, MapPin } from "lucide-react";
import { getDB, saveDB } from "../data/mockData";

export default function MentorRegistration({ onBackToHome, currentLang }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    field: "",
    experience: "",
    languages: "",
    district: "",
    bio: "",
    proof: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fields = [
    "Engineering & Research",
    "Medicine & Healthcare",
    "Law & Justice",
    "Commerce & Finance",
    "Arts, Design & Humanities",
    "Government Services",
    "Entrepreneurship"
  ];

  const validate = () => {
    let temp = {};
    if (!formData.name.trim()) temp.name = "Full Name is required";
    
    if (!formData.email.trim()) {
      temp.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      temp.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      temp.phone = "Phone number is required";
    } else if (!/^[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      temp.phone = "Enter a valid 10-digit number";
    }

    if (!formData.role.trim()) temp.role = "Designation/Organization is required";
    if (!formData.field) temp.field = "Field of Expertise is required";
    if (!formData.experience.trim()) temp.experience = "Experience is required";
    if (!formData.languages.trim()) temp.languages = "Languages are required";
    if (!formData.district.trim()) temp.district = "Location is required";
    
    if (!formData.bio.trim()) {
      temp.bio = "Short bio is required";
    } else if (formData.bio.trim().length < 20) {
      temp.bio = "Bio must be at least 20 characters";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const db = getDB();
      const newPending = {
        id: "m_pending_" + Math.floor(Math.random() * 9000 + 1000),
        name: formData.name,
        role: formData.role,
        field: formData.field,
        district: formData.district,
        languages: formData.languages.split(",").map(s => s.trim()),
        experience: formData.experience,
        rating: 4.8, // Initial rating
        bio: formData.bio,
        availStatus: "Pending verification",
        status: "pending",
        email: formData.email,
        phone: formData.phone,
        proof: formData.proof || "Not provided"
      };

      db.pendingMentors.push(newPending);
      saveDB(db);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div className="dashboard-card" style={{ maxWidth: "560px", textAlign: "center", padding: "3rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#dcfce7",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto"
          }}>
            <Send size={32} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>
            {currentLang === "en" ? "Application Submitted!" : "आवेदन सफलतापूर्वक प्राप्त हुआ!"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            {currentLang === "en" 
              ? "Thank you for volunteering to support our girls. Your application has been logged. An administrator will verify your credentials and activate your mentor profile shortly."
              : "हमारी बेटियों का सहयोग करने के लिए धन्यवाद। आपका आवेदन दर्ज कर लिया गया है। एक प्रशासक आपके विवरणों का सत्यापन करेगा और शीघ्र ही आपकी प्रोफाइल को सक्रिय करेगा।"}
          </p>
          <button className="btn-primary" onClick={onBackToHome}>
            {currentLang === "en" ? "Back to Homepage" : "होमपेज पर वापस जाएं"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f3ff 0%, #faf9ff 100%)",
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
          padding: "2.5rem 2rem",
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
            <ArrowLeft size={16} /> {currentLang === "en" ? "Back to Homepage" : "होम पेज पर वापस"}
          </button>

          <h2 style={{ fontSize: "1.9rem", fontWeight: 700, fontFamily: "var(--font-hindi)" }}>बनिए किसी बेटी की उड़ान का सहारा</h2>
          <p style={{ color: "var(--lavender-light)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {currentLang === "en" ? "Register as a verified Aarohi mentor and inspire girls." : "एक सत्यापित आरोही मेंटर के रूप में पंजीकरण करें और बालिकाओं को प्रेरित करें।"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "2.5rem" }}>
          
          <div className="form-group">
            <label className="form-label">{currentLang === "en" ? "Full Name" : "पूरा नाम"}</label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Priya Sharma"
                style={{ paddingLeft: "2.5rem" }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {errors.name && <span className="form-error"><AlertCircle size={12} style={{ display: "inline", marginRight: "3px" }} /> {errors.name}</span>}
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Email Address" : "ईमेल आईडी"}</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@organization.com"
                  style={{ paddingLeft: "2.5rem" }}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Phone Number" : "संपर्क नंबर"}</label>
              <div style={{ position: "relative" }}>
                <Phone size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="10-digit number"
                  style={{ paddingLeft: "2.5rem" }}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Designation & Organization" : "पद और संस्था"}</label>
              <div style={{ position: "relative" }}>
                <Briefcase size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Software Engineer, DM"
                  style={{ paddingLeft: "2.5rem" }}
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Field of Expertise" : "विशेषज्ञता का क्षेत्र"}</label>
              <div style={{ position: "relative" }}>
                <Award size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <select 
                  className="form-control" 
                  style={{ paddingLeft: "2.5rem" }}
                  value={formData.field}
                  onChange={e => setFormData({ ...formData, field: e.target.value })}
                >
                  <option value="">-- Choose Field --</option>
                  {fields.map((f, i) => <option key={i} value={f}>{f}</option>)}
                </select>
              </div>
              {errors.field && <span className="form-error">{errors.field}</span>}
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Years of Experience" : "अनुभव (वर्ष)"}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 5 Years"
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
              />
              {errors.experience && <span className="form-error">{errors.experience}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Native Languages (Comma Sep)" : "भाषाएं (अल्पविराम विभाजित)"}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Hindi, English"
                value={formData.languages}
                onChange={e => setFormData({ ...formData, languages: e.target.value })}
              />
              {errors.languages && <span className="form-error">{errors.languages}</span>}
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Location / District" : "स्थान / जिला"}</label>
              <div style={{ position: "relative" }}>
                <MapPin size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Varanasi, Delhi"
                  style={{ paddingLeft: "2.5rem" }}
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
              {errors.district && <span className="form-error">{errors.district}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{currentLang === "en" ? "Credential Link / LinkedIn Profile" : "प्रमाणपत्र लिंक / लिंक्डइन प्रोफाइल"}</label>
              <div style={{ position: "relative" }}>
                <Globe size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="https://linkedin.com/in/..."
                  style={{ paddingLeft: "2.5rem" }}
                  value={formData.proof}
                  onChange={e => setFormData({ ...formData, proof: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{currentLang === "en" ? "Motivation (Why do you want to mentor girls?)" : "प्रेरणा (आप लड़कियों को क्यों मेंटर करना चाहते हैं?)"}</label>
            <textarea 
              className="form-control" 
              rows="3" 
              placeholder="Provide a brief explanation of how you want to guide students..."
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            ></textarea>
            {errors.bio && <span className="form-error">{errors.bio}</span>}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
            <button type="button" className="btn-secondary" onClick={onBackToHome}>
              {currentLang === "en" ? "Cancel" : "रद्द करें"}
            </button>
            <button type="submit" className="btn-primary">
              {currentLang === "en" ? "Submit Registration" : "आवेदन जमा करें"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
