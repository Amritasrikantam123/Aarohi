import React, { useState, useEffect } from "react";
import { 
  Users, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Cpu, 
  Scale, 
  Rocket, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Zap,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { getDB, saveDB, logActivity } from "../data/mockData";
import { locales } from "../data/locales";

export default function LandingPage({ 
  onRegisterClick, 
  onExploreOpportunities, 
  onExploreCareers, 
  onLoginClick, 
  onLangChange, 
  currentLang = "en",
  onMentorRegisterClick 
}) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [db, setDb] = useState(() => getDB());
  const [featuredStories, setFeaturedStories] = useState([]);
  const [approvedMentors, setApprovedMentors] = useState([]);

  // Contact Form State
  const [contactData, setContactData] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const currentDB = getDB();
    const newQuery = {
      id: "msg_" + Date.now(),
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject || "General Inquiry",
      message: contactData.message,
      timestamp: new Date().toISOString()
    };

    currentDB.contactQueries = [newQuery, ...(currentDB.contactQueries || [])];
    saveDB(currentDB);

    logActivity(
      `Visitor ${contactData.name} sent a contact query regarding: "${newQuery.subject}".`,
      `आगंतुक ${contactData.name} ने विषय पर एक संपर्क प्रश्न भेजा: "${newQuery.subject}"।`,
      `సందర్శకులు ${contactData.name} ఒక సంప్రదింపు సందేశాన్ని పంపారు: "${newQuery.subject}".`
    );

    setContactSubmitted(true);
    setContactData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => {
      setContactSubmitted(false);
    }, 5000);
  };

  // Live Counts from Local DB
  const [girlsCount, setGirlsCount] = useState(0);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [scholarshipsCount, setScholarshipsCount] = useState(0);
  const [statesCount, setStatesCount] = useState(0);

  // Active translation dictionary
  const t = locales[currentLang] || locales.en;

  useEffect(() => {
    // Fetch live records from local DB
    const freshDb = getDB();
    setDb(freshDb);

    if (freshDb) {
      // 1. Approved Success Stories only
      const approvedStories = freshDb.studentsList.filter(
        s => s.featuredStory && s.featuredStory.isFeatured && s.featuredStory.approved
      );
      setFeaturedStories(approvedStories);

      // 2. Approved Mentors only
      const mentors = freshDb.mentors.filter(m => m.status === "approved");
      setApprovedMentors(mentors);

      // 3. Compute dynamic live stats directly from database records
      const girlsNum = freshDb.studentsList.length;
      const mentorsNum = mentors.length;
      
      // SUM of approved student scholarships
      const scholarNum = freshDb.studentsList.reduce(
        (sum, student) => sum + (student.appliedScholarships ? student.appliedScholarships.filter(s => s.status === "Approved").length : 0), 
        0
      );

      // Unique states reached by students and mentors
      const allStates = new Set([
        ...freshDb.studentsList.map(s => s.state).filter(Boolean),
        ...freshDb.mentors.map(m => m.state).filter(Boolean)
      ]);
      const statesNum = allStates.size;

      // Mount animate values (short duration count up for premium feel)
      let startG = 0;
      let startM = 0;
      let startS = 0;
      let startSt = 0;

      const interval = setInterval(() => {
        let done = true;
        if (startG < girlsNum) { startG++; setGirlsCount(startG); done = false; }
        if (startM < mentorsNum) { startM++; setMentorsCount(startM); done = false; }
        if (startS < scholarNum) { startS++; setScholarshipsCount(startS); done = false; }
        if (startSt < statesNum) { startSt++; setStatesCount(startSt); done = false; }
        if (done) clearInterval(interval);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [currentLang]);

  // Offers mapping (cards)
  const offerings = [
    {
      title: t.offerScholarshipTitle,
      desc: t.offerScholarshipDesc,
      icon: Award
    },
    {
      title: t.offerInternshipTitle,
      desc: t.offerInternshipDesc,
      icon: Rocket
    },
    {
      title: t.offerMentorshipTitle,
      desc: t.offerMentorshipDesc,
      icon: Users
    },
    {
      title: t.offerCareerTitle,
      desc: t.offerCareerDesc,
      icon: Cpu
    },
    {
      title: t.offerCommunityTitle,
      desc: t.offerCommunityDesc,
      icon: BookOpen
    }
  ];

  return (
    <div className="landing-layout">
      {/* Navbar */}
      <nav className="navbar-landing">
        <div className="container navbar-container">
          
          {/* Calligraphic Callout Logo: A bird taking flight transforms into a butterfly */}
          <div 
            className="navbar-brand-wrapper"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* SVG: Bird morphs into butterfly */}
            <svg viewBox="0 0 120 100" width="56" height="46" className="brand-logo-svg">
              <defs>
                <linearGradient id="butterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              
              {/* Left wing (butterfly style + bird lines) */}
              <path 
                d="M 60,50 C 45,30 20,20 12,35 C 5,47 15,62 32,65 C 48,68 55,58 60,50 Z" 
                fill="url(#butterflyGrad)" 
                className="wing-left"
              />
              {/* Right wing (soaring bird wing silhouette morphing to butterfly) */}
              <path 
                d="M 60,50 C 75,25 105,15 112,30 C 118,42 108,60 88,65 C 72,69 65,58 60,50 Z" 
                fill="url(#butterflyGrad)"
                className="wing-right"
              />
              {/* Central body & antennas */}
              <path d="M 60,82 C 61,65 61,50 60,35 C 59,50 59,65 60,82 Z" fill="#7c3aed" strokeWidth="2" stroke="#7c3aed" />
              <path d="M 60,35 C 56,22 48,18 48,18 M 60,35 C 64,22 72,18 72,18" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Small sparkle dots */}
              <circle cx="95" cy="22" r="3" fill="#f59e0b" className="logo-sparkle" />
              <circle cx="25" cy="22" r="2" fill="#f59e0b" className="logo-sparkle" />
            </svg>
            <div className="logo-text-container">
              <span className="logo-hindi-nav" style={{ fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
                {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
              </span>
              <span className="sparkle-indicator">✨</span>
            </div>
          </div>

          <ul className="nav-links">
            <li><a href="#about" className="nav-link">{t.navAbout}</a></li>
            <li><a href="#offers" className="nav-link">{t.navFeatures}</a></li>
            <li><a href="#stories" className="nav-link">{t.navStories}</a></li>
            <li><a href="#mentors" className="nav-link">{t.navMentors}</a></li>
            <li><a href="#contact" className="nav-link">{t.navContact}</a></li>
            
            {/* Language Selection Switcher */}
            <li className="lang-dropdown-container" style={{ position: "relative" }}>
              <button 
                className="lang-btn" 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  backgroundColor: "var(--lavender-light)",
                  border: "1px solid var(--primary-light)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--primary-color)",
                  cursor: "pointer"
                }}
              >
                <Globe size={14} />
                {currentLang === "en" ? "English" : currentLang === "hi" ? "हिन्दी" : "తెలుగు"}
              </button>
              {showLanguageMenu && (
                <div style={{
                  position: "absolute",
                  top: "105%",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 200,
                  overflow: "hidden",
                  width: "120px"
                }}>
                  <button 
                    onClick={() => { onLangChange("en"); setShowLanguageMenu(false); }}
                    style={{
                      padding: "0.6rem 1rem",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: currentLang === "en" ? "var(--lavender-bg)" : "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.82rem"
                    }}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => { onLangChange("hi"); setShowLanguageMenu(false); }}
                    style={{
                      padding: "0.6rem 1rem",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: currentLang === "hi" ? "var(--lavender-bg)" : "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.82rem"
                    }}
                  >
                    हिन्दी
                  </button>
                  <button 
                    onClick={() => { onLangChange("te"); setShowLanguageMenu(false); }}
                    style={{
                      padding: "0.6rem 1rem",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: currentLang === "te" ? "var(--lavender-bg)" : "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.82rem"
                    }}
                  >
                    తెలుగు
                  </button>
                </div>
              )}
            </li>

            <li>
              <button className="btn-secondary" style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", borderRadius: "18px" }} onClick={onLoginClick}>
                {t.btnSignIn}
              </button>
            </li>
            <li>
              <button className="btn-primary" style={{ padding: "0.45rem 1.15rem", fontSize: "0.85rem", borderRadius: "18px" }} onClick={onRegisterClick}>
                {t.btnRegisterNow}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ padding: "5rem 0 3.5rem 0", position: "relative" }}>
        
        {/* Soft floating illustrations in background */}
        <div className="floating-bubble bubble-1"></div>
        <div className="floating-bubble bubble-2"></div>
        
        {/* Floating butterfly icons (Feminine theme) */}
        <div className="floating-butterfly-art f1">🦋</div>
        <div className="floating-butterfly-art f2">🌸</div>
        <div className="floating-butterfly-art f3">✨</div>

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="brand-header-combo">
              <span className="logo-hindi-hero" style={{ fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
                {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
              </span>
              <span className="sparkle-indicator-hero">✨</span>
            </div>
            
            <h2 className="hero-subtitle-hindi" style={{ fontSize: "1.9rem", color: "var(--text-main)" }}>
              {t.tagline}
            </h2>
            
            <p className="hero-desc" style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, margin: "1.25rem 0 2rem 0" }}>
              {t.heroDesc}
            </p>
            
            <div className="hero-actions" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={onRegisterClick}>
                {t.btnBeginJourney} <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={onExploreOpportunities}>
                {currentLang === "hi" ? "छात्रवृत्ति खोजें" : currentLang === "te" ? "స్కాలర్‌షిప్స్ వెతకండి" : "Search Scholarships"}
              </button>
            </div>

            {/* Micro Live Statistics Feed Badge */}
            <div className="live-db-badge" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "2rem",
              background: "rgba(124, 58, 237, 0.08)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--primary-color)"
            }}>
              <Zap size={12} className="pulse-icon" />
              <span>{t.liveCount}: {girlsCount} {currentLang === "hi" ? "बेटियाँ लाइव जुड़ी हैं" : currentLang === "te" ? "బాలికలు లైవ్‌లో ఉన్నారు" : "girls registered live"}</span>
            </div>
          </div>
          
          <div className="hero-image-container">
            <div className="hero-blob-bg"></div>
            
            {/* Visual Vector Illustration matching mockup */}
            <svg 
              viewBox="0 0 500 500" 
              className="hero-image"
              style={{ zIndex: 10, width: "100%", maxWidth: "440px" }}
            >
              <defs>
                <linearGradient id="pinkPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="70%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              
              {/* Back glowing ring */}
              <circle cx="250" cy="250" r="190" fill="url(#pinkPurpleGrad)" opacity="0.12" />
              
              {/* Rising birds morphing from butterfly path */}
              <g transform="translate(200, 30) scale(0.95)" className="soaring-birds-path">
                <path d="M 60,70 Q 20,40 10,60 Q 20,80 60,70 Z" fill="url(#pinkPurpleGrad)" opacity="0.6" />
                <path d="M 60,70 Q 100,40 110,60 Q 100,80 60,70 Z" fill="url(#pinkPurpleGrad)" />
                <path d="M 60,70 C 50,40 20,10 40,0 C 50,0 60,20 60,70 Z" fill="#8b5cf6" />
                <path d="M 60,70 C 70,40 100,10 80,0 C 70,0 60,20 60,70 Z" fill="#ec4899" />
              </g>

              {/* Styled portrait of confident school girl holding books (Canva illustration style) */}
              <g transform="translate(110, 100)">
                {/* Hair background */}
                <path d="M70,160 C50,110 130,80 180,110 C210,130 210,190 200,240 C190,270 140,290 110,280 C60,260 70,210 70,160 Z" fill="#1e1b4b" />
                {/* Neck and Face */}
                <path d="M125,240 L125,270 L145,270 L145,240 Z" fill="#fed7aa" />
                <circle cx="135" cy="185" r="45" fill="#ffedd5" />
                {/* Eyes, smile */}
                <path d="M115,180 Q120,183 125,180" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M145,180 Q150,183 155,180" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M125,205 Q135,215 145,205" stroke="#db2777" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Front Hair bangs */}
                <path d="M90,150 Q135,130 180,150 Q160,175 135,160 Q110,175 90,150 Z" fill="#1e1b4b" />
                
                {/* Uniform/Salwar Kameez */}
                <path d="M60,320 C60,270 90,260 135,260 C180,260 210,270 210,320 L190,380 L80,380 Z" fill="url(#pinkPurpleGrad)" />
                
                {/* Notebook / Books held in hand */}
                <rect x="85" y="275" width="80" height="100" rx="6" fill="#fff" stroke="#e9d5ff" strokeWidth="3" transform="rotate(-15 125 325)" />
                <rect x="90" y="280" width="70" height="90" rx="4" fill="#a78bfa" opacity="0.8" transform="rotate(-15 125 325)" />
                {/* Hand fingers on books */}
                <circle cx="75" cy="315" r="6" fill="#ffedd5" />
                <circle cx="78" cy="323" r="6" fill="#ffedd5" />
                <circle cx="82" cy="330" r="6" fill="#ffedd5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Real-time Statistics Cards */}
      <section className="stats-section" style={{ padding: "2.5rem 0", background: "#fff", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div className="stats-grid">
            
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--lavender-light)", color: "var(--primary-color)" }}>
                <Users size={24} />
              </div>
              <div className="stat-details">
                <div className="stat-number">{girlsCount}</div>
                <div className="stat-label">{t.counterGirls}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: "rgba(236, 72, 153, 0.1)", color: "var(--secondary-color)" }}>
                <Users size={24} />
              </div>
              <div className="stat-details">
                <div className="stat-number">{mentorsCount}</div>
                <div className="stat-label">{t.counterMentors}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "var(--accent-color)" }}>
                <Award size={24} />
              </div>
              <div className="stat-details">
                <div className="stat-number">{scholarshipsCount}</div>
                <div className="stat-label">{t.counterScholarships}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--lavender-light)", color: "var(--primary-color)" }}>
                <MapPin size={24} />
              </div>
              <div className="stat-details">
                <div className="stat-number">{statesCount}</div>
                <div className="stat-label">{t.counterStates}</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section id="offers" className="offers-section" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.whatWeOffer}</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {t.whatWeOfferSub}
            </p>
          </div>
          
          <div className="offers-grid" style={{ marginTop: "3rem" }}>
            {offerings.map((offer, i) => (
              <div key={i} className="offer-card" style={{ transition: "var(--transition-smooth)" }}>
                <div className="offer-icon-wrapper" style={{ backgroundColor: "var(--lavender-light)", color: "var(--primary-color)" }}>
                  <offer.icon size={24} />
                </div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.desc}</p>
                <div style={{ marginTop: "1.5rem" }}>
                  <button 
                    onClick={onRegisterClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary-color)",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      cursor: "pointer",
                      fontSize: "0.88rem"
                    }}
                  >
                    {t.learnMore} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Feed Section */}
      <section style={{ padding: "4rem 0", background: "var(--lavender-light)" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: "2.5rem" }}>
            <h2 className="section-title">{t.activityFeedTitle}</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {t.activityFeedSub}
            </p>
          </div>

          <div style={{
            maxWidth: "700px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-md)"
          }}>
            {db.activities && db.activities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {db.activities.map((act, index) => (
                  <div key={act.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingBottom: index === db.activities.length - 1 ? 0 : "0.75rem",
                    borderBottom: index === db.activities.length - 1 ? "none" : "1px solid var(--border-color)"
                  }}>
                    <div style={{
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      color: "#10b981",
                      borderRadius: "50%",
                      padding: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <CheckCircle size={14} />
                    </div>
                    <div style={{ flex: 1, fontSize: "0.88rem", fontWeight: 500, color: "var(--text-main)" }}>
                      {currentLang === "hi" ? act.textHi : currentLang === "te" ? act.textTe : act.textEn}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      <Clock size={10} />
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                No platform activity logged yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="stories" className="stories-section" style={{ padding: "5rem 0", background: "#fff" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.storiesTitle}</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {t.storiesSub}
            </p>
          </div>
          
          <div className="stories-grid" style={{ marginTop: "3.5rem" }}>
            {featuredStories.length > 0 ? (
              featuredStories.map((story) => (
                <div key={story.id} className="story-card" style={{ boxShadow: "var(--shadow-md)" }}>
                  <div className="story-avatar-wrapper" style={{ border: "2.5px solid var(--secondary-color)" }}>
                    <img 
                      src={story.avatar || "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200"} 
                      alt={story.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    />
                  </div>
                  <p className="story-quote" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                    "{currentLang === "hi" ? story.featuredStory.quoteHi : currentLang === "te" ? story.featuredStory.quoteTe : story.featuredStory.quoteEn}"
                  </p>
                  <div className="story-name">{story.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--primary-color)", fontWeight: 600, marginTop: "2px" }}>
                    {story.school}
                  </div>
                  <div className="story-state" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                    {story.district}, {story.state}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: "1/-1", 
                textAlign: "center", 
                padding: "4rem 2rem", 
                background: "var(--lavender-light)", 
                borderRadius: "var(--radius-lg)",
                border: "1px dashed var(--primary-light)",
                color: "var(--text-muted)"
              }}>
                <Sparkles size={36} color="var(--primary-color)" style={{ marginBottom: "1rem" }} />
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                  {t.noStories}
                </h4>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" style={{ padding: "5rem 0", background: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)", color: "#fff" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <h2 className="section-title" style={{ color: "#fff" }}>{t.mentorTitle}</h2>
            <p style={{ color: "#c084fc", marginTop: "0.5rem" }}>
              {t.mentorSub}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            {approvedMentors.map((mentor) => (
              <div key={mentor.id} style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--accent-color)",
                    marginBottom: "1rem"
                  }}
                />
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{mentor.name}</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--accent-color)", fontWeight: 600, marginTop: "2px" }}>{mentor.role}</p>
                <span style={{ fontSize: "0.75rem", color: "#d8b4fe", marginTop: "4px" }}>{mentor.organization}</span>
                <p style={{ fontSize: "0.8rem", color: "#c084fc", margin: "10px 0" }}>{mentor.field}</p>
                <button 
                  onClick={onRegisterClick}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "15px",
                    padding: "6px 12px",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "var(--transition-smooth)"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  {t.viewProfile}
                </button>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "2rem",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--accent-color)" }}>
                {t.joinAsMentor}
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.92rem", lineHeight: 1.6 }}>
                {t.joinAsMentorSub}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                className="btn-primary" 
                style={{ background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)" }}
                onClick={onMentorRegisterClick}
              >
                {t.btnApplyMentor} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Section */}
      <section id="contact" style={{
        padding: "5rem 0",
        background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--lavender-bg) 100%)",
        borderTop: "1px solid var(--border-color)"
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <h2 className="section-title">
              {currentLang === "hi" ? "हमसे संपर्क करें" : currentLang === "te" ? "మమ్మల్ని సంప్రదించండి" : "Get In Touch"}
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {currentLang === "hi" ? "कोई प्रश्न या सुझाव है? हमारी राष्ट्रीय संचालन टीम से सीधे संपर्क करें।" : currentLang === "te" ? "ఏదైనా ప్రశ్న ఉందా? మమ్మల్ని నేరుగా సంప్రదించండి." : "Have questions, suggestions, or want to partner with us? Write to our national desk."}
            </p>
          </div>

          <div className="grid-two-col" style={{ gridTemplateColumns: "1fr 1.2fr", gap: "3rem" }}>
            {/* Left Column: Contact Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="dashboard-card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.5rem" }}>
                <div style={{
                  backgroundColor: "rgba(108, 99, 255, 0.1)",
                  color: "var(--primary-color)",
                  padding: "10px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-main)" }}>
                    {currentLang === "hi" ? "राष्ट्रीय कार्यालय" : currentLang === "te" ? "జాతీయ కార్యాలయం" : "National Headquarters"}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
                    {currentLang === "hi" ? "महिला एवं बाल विकास मंत्रालय, शास्त्री भवन, नई दिल्ली - 110001" : currentLang === "te" ? "మహిళా మరియు శిశు అభివృద్ధి మంత్రిత్వ శాఖ, శాస్త్రి భవన్, న్యూఢిల్లీ" : "Ministry of Women & Child Development, Shastri Bhawan, New Delhi - 110001"}
                  </p>
                </div>
              </div>

              <div className="dashboard-card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.5rem" }}>
                <div style={{
                  backgroundColor: "rgba(217, 70, 239, 0.1)",
                  color: "var(--secondary-color)",
                  padding: "10px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-main)" }}>
                    {currentLang === "hi" ? "हेल्पलाइन एवं फोन" : currentLang === "te" ? "ఫోన్ నంబర్లు" : "Helplines & Telephones"}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px", lineHeight: 1.6 }}>
                    <strong>National Desk:</strong> +91 11 2338 3937<br />
                    <strong>Women Safety Toll-Free:</strong> 1091 (24/7 Support)
                  </p>
                </div>
              </div>

              <div className="dashboard-card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.5rem" }}>
                <div style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  color: "var(--accent-color)",
                  padding: "10px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Mail size={24} fill="none" />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-main)" }}>
                    {currentLang === "hi" ? "ईमेल सहायता" : currentLang === "te" ? "ఈమెయిల్ మద్దతు" : "Email Communications"}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
                    support.aarohi@gov.in<br />
                    info-aarohi-mission@gov.in
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="dashboard-card" style={{ boxShadow: "var(--shadow-premium)", padding: "2.5rem" }}>
              {contactSubmitted ? (
                <div style={{
                  textAlign: "center",
                  padding: "2rem 0",
                  animation: "modalIn 0.3s ease"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem"
                  }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {currentLang === "hi" ? "सफलतापूर्वक भेजा गया!" : currentLang === "te" ? "విజయవంతంగా పంపబడింది!" : "Message Sent Successfully!"}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.5rem" }}>
                    {currentLang === "hi" ? "आपका संदेश दर्ज कर लिया गया है। हम जल्द ही आपसे संपर्क करेंगे।" : currentLang === "te" ? "మీ సందేశాన్ని నమోదు చేసుకున్నాము. త్వరలోనే స్పందిస్తాము." : "Thank you for reaching out. We have logged your query and our team will get back to you shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      {currentLang === "hi" ? "आपका नाम" : currentLang === "te" ? "మీ పేరు" : "Full Name"} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Anjali Sharma"
                      value={contactData.name}
                      onChange={e => setContactData({ ...contactData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      {currentLang === "hi" ? "ईमेल पता" : currentLang === "te" ? "ఈమెయిల్ చిరునామా" : "Email Address"} *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="anjali@example.com"
                      value={contactData.email}
                      onChange={e => setContactData({ ...contactData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      {currentLang === "hi" ? "विषय" : currentLang === "te" ? "విషయం" : "Subject"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Scholarship Assistance / Mentorship enquiry"
                      value={contactData.subject}
                      onChange={e => setContactData({ ...contactData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      {currentLang === "hi" ? "संदेश" : currentLang === "te" ? "సందేశం" : "Message"} *
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Write your message here..."
                      value={contactData.message}
                      onChange={e => setContactData({ ...contactData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", padding: "0.75rem", fontSize: "0.9rem", display: "flex", justifyContent: "center" }}>
                    {currentLang === "hi" ? "संदेश भेजें" : currentLang === "te" ? "సందేశం పంపు" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer-nav" className="landing-footer">
        <div className="container footer-grid">
          <div>
            <span className="footer-logo-hindi" style={{ fontFamily: currentLang === 'te' ? 'inherit' : 'var(--font-hindi)' }}>
              {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
            </span>
            <p className="footer-desc">
              {t.footerMotto}
            </p>
          </div>
          
          <div>
            <h3 className="footer-title">{t.footerLinks}</h3>
            <ul className="footer-links">
              <li><a href="#about">{t.navAbout}</a></li>
              <li><a href="#offers">{t.navFeatures}</a></li>
              <li><a href="#stories">{t.navStories}</a></li>
              <li><a href="#mentors">{t.navMentors}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">{t.footerResources}</h3>
            <ul className="footer-links">
              <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer">National Scholarship Portal</a></li>
              <li><a href="https://wcd.nic.in" target="_blank" rel="noreferrer">Beti Bachao Beti Padhao</a></li>
              <li><a href="https://www.aicte-india.org" target="_blank" rel="noreferrer">Pragati Scholarship Portal</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">{t.footerContact}</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>{currentLang === "hi" ? "शास्त्री भवन, नई दिल्ली, भारत" : currentLang === "te" ? "శాస్త్రి భవన్, న్యూఢిల్లీ" : "Shastri Bhawan, New Delhi"}</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+91 11 2338 3937</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support.aarohi@gov.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container footer-bottom">
          <p>© 2026 Aarohi Digital Mission (आरोही). All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
