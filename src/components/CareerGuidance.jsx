import React, { useState } from "react";
import { 
  Cpu, 
  Activity, 
  Scale, 
  TrendingUp, 
  Palette, 
  Briefcase, 
  Rocket, 
  BookOpen, 
  ChevronRight, 
  Check,
  Brain,
  Award,
  Users,
  Compass,
  ArrowRight
} from "lucide-react";
import { getDB } from "../data/mockData";

export default function CareerGuidance({ db, studentProfile, currentLang }) {
  const careers = db?.careers || [];
  const scholarships = db?.scholarships || [];
  const mentors = db?.mentors || [];
  const opportunities = db?.opportunities || [];

  const [subTab, setSubTab] = useState("explore"); // explore, ai-planner

  // Exploration states
  const initialCareerId = studentProfile?.careerInterests && studentProfile.careerInterests.length > 0 
    ? careers.find(c => studentProfile.careerInterests[0] && c.title && studentProfile.careerInterests[0].toLowerCase().includes(c.title.split(" ")[0].toLowerCase()))?.id || "engineering"
    : "engineering";
  const [activeCareerId, setActiveCareerId] = useState(initialCareerId);
  const activeCareer = careers.find(c => c.id === activeCareerId) || careers[0];

  // AI Planner Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [inputs, setInputs] = useState({
    studentClass: studentProfile?.class || "Class 11th (Science)",
    interests: [],
    careerGoal: ""
  });
  const [aiResult, setAiResult] = useState(null);

  if (!activeCareer) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
        {currentLang === "en" ? "No career guidance data available at the moment." : "इस समय कोई करियर मार्गदर्शन डेटा उपलब्ध नहीं है।"}
      </div>
    );
  }

  const interestOptions = [
    { id: "math", label: "Mathematics & Logic" },
    { id: "code", label: "Coding & Computers" },
    { id: "bio", label: "Biology & Human Health" },
    { id: "civics", label: "Polity & Social Science" },
    { id: "creative", label: "Arts & Design" },
    { id: "mgmt", label: "Business & Management" }
  ];

  const careerGoalOptions = [
    { id: "swe", label: "Software Engineer", domain: "engineering" },
    { id: "doc", label: "Doctor / Medical Practitioner", domain: "medicine" },
    { id: "adv", label: "Legal Advocate", domain: "law" },
    { id: "ias", fill: "Civil Servant (IAS/IPS)", label: "Civil Servant", domain: "government" },
    { id: "ent", label: "Business Entrepreneur", domain: "entrepreneurship" },
    { id: "sci", label: "Scientific Researcher", domain: "research" }
  ];

  const handleInterestToggle = (id) => {
    setInputs(prev => {
      const exists = prev.interests.includes(id);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(item => item !== id) };
      } else {
        return { ...prev, interests: [...prev.interests, id] };
      }
    });
  };

  const generateRecommendations = () => {
    // Basic recommendation algorithm based on selected goals
    const selectedGoal = careerGoalOptions.find(g => g.id === inputs.careerGoal);
    const domainId = selectedGoal ? selectedGoal.domain : "engineering";
    const matchedDomain = careers.find(c => c.id === domainId) || careers[0] || { title: "General", skills: [], courses: [] };

    // 1. Filter Scholarships
    const recommendedScholarships = scholarships.filter(s => {
      // Show scholarships with min marks match
      const avgMarks = 80; // default average
      const minMarks = s.eligibility?.minMarks || 0;
      const maxIncome = s.eligibility?.maxIncome || 9999999;
      const matchesMarks = avgMarks >= minMarks;
      const matchesIncome = studentProfile?.familyIncome ? studentProfile.familyIncome <= maxIncome : true;
      return matchesMarks && matchesIncome;
    }).slice(0, 2);

    // 2. Filter Mentors matching field
    const recommendedMentors = mentors.filter(m => {
      if (!m.field) return false;
      const matchesDomainId = m.field.toLowerCase().includes(domainId.substring(0, 4));
      const matchesTitle = matchedDomain.title ? m.field.toLowerCase().includes(matchedDomain.title.split(" ")[0].toLowerCase().substring(0, 4)) : false;
      return matchesDomainId || matchesTitle;
    }).slice(0, 2);

    // 3. Filter Opportunities
    const recommendedOpps = opportunities.filter(o => {
      if (!o.title) return false;
      if (domainId === "engineering") return o.title.toLowerCase().includes("web") || o.title.toLowerCase().includes("tech") || o.title.toLowerCase().includes("stem");
      if (domainId === "medicine") return o.title.toLowerCase().includes("science") || o.title.toLowerCase().includes("stem");
      return o.type === "Workshop";
    }).slice(0, 2);

    setAiResult({
      careerDomain: matchedDomain,
      goalName: selectedGoal ? selectedGoal.label : "Professional",
      skills: matchedDomain.skills || [],
      courses: matchedDomain.courses || [],
      scholarships: recommendedScholarships,
      mentors: recommendedMentors,
      opportunities: recommendedOpps
    });
    setWizardStep(4);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Cpu": return <Cpu size={22} />;
      case "Activity": return <Activity size={22} />;
      case "Scale": return <Scale size={22} />;
      case "TrendingUp": return <TrendingUp size={22} />;
      case "Palette": return <Palette size={22} />;
      case "Briefcase": return <Briefcase size={22} />;
      case "Rocket": return <Rocket size={22} />;
      case "BookOpen": return <BookOpen size={22} />;
      default: return <BookOpen size={22} />;
    }
  };

  return (
    <div>
      {/* Sub tabs header layout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {currentLang === "en" ? "Career Guidance Center" : "करियर मार्गदर्शन केंद्र"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {currentLang === "en" ? "Plan your academic roadmaps, discover skill sets, and request matching guides." : "अपनी शैक्षणिक राह की योजना बनाएं, कौशलों को जानें और मेंटर्स खोजें।"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            className={`persona-btn ${subTab === "explore" ? "active" : ""}`}
            style={{ border: "1px solid var(--border-color)", borderRadius: "20px", color: subTab === "explore" ? "#fff" : "var(--text-main)" }}
            onClick={() => setSubTab("explore")}
          >
            <Compass size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />
            {currentLang === "en" ? "Explore Domains" : "करियर क्षेत्र"}
          </button>
          <button 
            className={`persona-btn ${subTab === "ai-planner" ? "active" : ""}`}
            style={{ border: "1px solid var(--border-color)", borderRadius: "20px", color: subTab === "ai-planner" ? "#fff" : "var(--text-main)" }}
            onClick={() => { setSubTab("ai-planner"); setWizardStep(1); setAiResult(null); }}
          >
            <Brain size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />
            {currentLang === "en" ? "AI Recommendation Planner" : "एआई करियर प्लानर"}
          </button>
        </div>
      </div>

      {/* RENDER EXPLORATION VIEW */}
      {subTab === "explore" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          {/* Categories Grid */}
          <div className="careers-grid" style={{ marginBottom: "2rem" }}>
            {careers.map((c) => {
              const isActive = c.id === activeCareerId;
              const isStudentInterest = studentProfile?.careerInterests ? studentProfile.careerInterests.some(i => i && c.title && i.toLowerCase().includes(c.title.split(" ")[0].toLowerCase())) : false;

              return (
                <div 
                  key={c.id} 
                  className={`career-grid-card ${isActive ? "active" : ""}`}
                  onClick={() => setActiveCareerId(c.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                    <div style={{
                      color: isActive ? "#fff" : "var(--primary-color)",
                      backgroundColor: isActive ? "var(--primary-color)" : "var(--lavender-light)",
                      padding: "8px",
                      borderRadius: "8px"
                    }}>
                      {getIcon(c.icon)}
                    </div>

                    {isStudentInterest && (
                      <span style={{ 
                        fontSize: "0.65rem", 
                        backgroundColor: "#dcfce7", 
                        color: "#15803d", 
                        fontWeight: 700, 
                        padding: "2px 6px", 
                        borderRadius: "4px" 
                      }}>
                        {currentLang === "en" ? "Interest" : "रुचि है"}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "1rem", color: "var(--text-main)" }}>
                    {c.title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid-two-col" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">
                {currentLang === "en" ? `${activeCareer.title} Roadmap` : `${activeCareer.title} रोडमैप`}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem", lineHeight: 1.6 }}>
                {activeCareer.description}
              </p>

              <div className="vertical-timeline">
                {activeCareer.roadmap.map((step, idx) => (
                  <div key={idx} className="timeline-node">
                    <div className="timeline-bullet completed"></div>
                    <div className="timeline-node-title">
                      Step {step.step}: {step.title}
                    </div>
                    <div className="timeline-node-desc">
                      {step.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">{currentLang === "en" ? "Key Skills" : "महत्वपूर्ण कौशल"}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.25rem" }}>
                  {activeCareer.skills.map((skill, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justify: "center", color: "#16a34a" }}>
                        <Check size={14} />
                      </div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="dashboard-card-title">{currentLang === "en" ? "Recommended Free Courses" : "अनुशंसित नि:शुल्क कोर्सेज"}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.25rem" }}>
                  {activeCareer.courses.map((course, idx) => (
                    <div key={idx} style={{ padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-primary)" }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>{course.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <span>Platform: <strong>{course.platform}</strong></span>
                        <span>Duration: <strong>{course.duration}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER AI PLANNER WIZARD */}
      {subTab === "ai-planner" && (
        <div style={{ animation: "modalIn 0.3s ease" }}>
          
          {/* Stepper nodes */}
          <div className="ai-advisor-stepper">
            <div className={`ai-step-node ${wizardStep >= 1 ? "active" : ""} ${wizardStep > 1 ? "completed" : ""}`}>1</div>
            <div className={`ai-step-node ${wizardStep >= 2 ? "active" : ""} ${wizardStep > 2 ? "completed" : ""}`}>2</div>
            <div className={`ai-step-node ${wizardStep >= 3 ? "active" : ""} ${wizardStep > 3 ? "completed" : ""}`}>3</div>
            <div className={`ai-step-node ${wizardStep >= 4 ? "active" : ""} ${wizardStep > 4 ? "completed" : ""}`}>✨</div>
          </div>

          {/* STEP 1: Select Class */}
          {wizardStep === 1 && (
            <div className="dashboard-card" style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                {currentLang === "en" ? "Step 1: Confirm Your Current Class" : "चरण 1: अपनी वर्तमान कक्षा की पुष्टि करें"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                We use this to identify eligibility for scholarship deadlines and intermediate degree pathways.
              </p>
              
              <div className="form-group" style={{ textAlign: "left" }}>
                <label className="form-label">{currentLang === "en" ? "Current Academic Class" : "वर्तमान शैक्षणिक कक्षा"}</label>
                <select 
                  className="form-control"
                  value={inputs.studentClass}
                  onChange={e => setInputs({ ...inputs, studentClass: e.target.value })}
                >
                  <option value="Class 10th Completed">Class 10th Completed</option>
                  <option value="Class 11th (Science)">Class 11th (Science)</option>
                  <option value="Class 11th (Commerce)">Class 11th (Commerce)</option>
                  <option value="Class 11th (Arts)">Class 11th (Arts)</option>
                  <option value="Class 12th (Science)">Class 12th (Science)</option>
                  <option value="Class 12th (Commerce)">Class 12th (Commerce)</option>
                  <option value="Class 12th (Arts)">Class 12th (Arts)</option>
                </select>
              </div>

              <button className="btn-primary" onClick={() => setWizardStep(2)} style={{ marginTop: "1rem" }}>
                {currentLang === "en" ? "Next Step" : "अगला चरण"} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: Select Interests */}
          {wizardStep === 2 && (
            <div className="dashboard-card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                {currentLang === "en" ? "Step 2: Select Your Top Interests" : "चरण 2: अपनी मुख्य रुचियों को चुनें"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
                Select areas you enjoy studying or want to build skills in.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                {interestOptions.map(opt => {
                  const isSelected = inputs.interests.includes(opt.id);
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => handleInterestToggle(opt.id)}
                      style={{
                        padding: "1.25rem 1rem",
                        border: "2px solid",
                        borderColor: isSelected ? "var(--primary-color)" : "var(--border-color)",
                        backgroundColor: isSelected ? "var(--lavender-light)" : "var(--bg-secondary)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "var(--transition-smooth)"
                      }}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={18} color="var(--primary-color)" />}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button className="btn-secondary" onClick={() => setWizardStep(1)}>
                  {currentLang === "en" ? "Back" : "पीछे"}
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => setWizardStep(3)}
                  disabled={inputs.interests.length === 0}
                  style={{ opacity: inputs.interests.length === 0 ? 0.6 : 1 }}
                >
                  {currentLang === "en" ? "Next Step" : "अगला चरण"} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Goal */}
          {wizardStep === 3 && (
            <div className="dashboard-card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                {currentLang === "en" ? "Step 3: Define Your Target Career Goal" : "चरण 3: अपना लक्षित करियर गोल चुनें"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
                What do you want to become or specialize in?
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                {careerGoalOptions.map(opt => {
                  const isSelected = inputs.careerGoal === opt.id;
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => setInputs({ ...inputs, careerGoal: opt.id })}
                      style={{
                        padding: "1.25rem 1rem",
                        border: "2px solid",
                        borderColor: isSelected ? "var(--primary-color)" : "var(--border-color)",
                        backgroundColor: isSelected ? "var(--lavender-light)" : "var(--bg-secondary)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "var(--transition-smooth)"
                      }}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={18} color="var(--primary-color)" />}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button className="btn-secondary" onClick={() => setWizardStep(2)}>
                  {currentLang === "en" ? "Back" : "पीछे"}
                </button>
                <button 
                  className="btn-primary" 
                  onClick={generateRecommendations}
                  disabled={!inputs.careerGoal}
                  style={{ opacity: !inputs.careerGoal ? 0.6 : 1 }}
                >
                  {currentLang === "en" ? "Generate Career Plan" : "करियर योजना तैयार करें"} <Brain size={16} style={{ marginLeft: "4px" }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATION OUTPUTS */}
          {wizardStep === 4 && aiResult && (
            <div style={{ animation: "modalIn 0.4s ease" }}>
              <div className="welcome-banner" style={{ background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)" }}>
                <div>
                  <span className="badge warning" style={{ marginBottom: "0.5rem" }}>AI Counselor Matches</span>
                  <h2>{currentLang === "en" ? `Path for Future ${aiResult.goalName}` : `भावी ${aiResult.goalName} हेतु मार्ग निर्देश`}</h2>
                  <p>Recommended curriculum, financial aid, internships, and counselors selected for your profile.</p>
                </div>
                <Brain size={48} opacity={0.25} />
              </div>

              {/* Outputs grid */}
              <div className="grid-two-col" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
                
                {/* Curriculum and Skills */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="dashboard-card">
                    <h3 className="dashboard-card-title">
                      <span><Compass size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} /> Skill Checklist & Curriculums</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                      {aiResult.skills.map((skill, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justify: "center", color: "#16a34a" }}>
                            <Check size={12} />
                          </div>
                          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <h3 className="dashboard-card-title">
                      <span><BookOpen size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} /> Recommended Free Courses</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {aiResult.courses.map((course, idx) => (
                        <div key={idx} style={{ padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-primary)" }}>
                          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>{course.name}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                            <span>Platform: <strong>{course.platform}</strong></span>
                            <span>Duration: <strong>{course.duration}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial aid and Mentors */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Scholarships eligible */}
                  <div className="dashboard-card">
                    <h3 className="dashboard-card-title">
                      <span><Award size={18} style={{ verticalAlign: "middle", marginRight: "6px", color: "var(--primary-color)" }} /> Eligible Scholarships</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {aiResult.scholarships.map((s, idx) => (
                        <div key={idx} style={{ padding: "0.85rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>{s.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--primary-color)", fontWeight: 600 }}>Stipend: {s.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matched Mentors */}
                  <div className="dashboard-card">
                    <h3 className="dashboard-card-title">
                      <span><Users size={18} style={{ verticalAlign: "middle", marginRight: "6px", color: "var(--secondary-color)" }} /> Matched Active Mentors</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {aiResult.mentors.map((m, idx) => (
                        <div key={idx} style={{ padding: "0.85rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>{m.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{m.role} ({m.district})</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Internships */}
                  <div className="dashboard-card">
                    <h3 className="dashboard-card-title">
                      <span><Briefcase size={18} style={{ verticalAlign: "middle", marginRight: "6px", color: "var(--accent-color)" }} /> Matching Opportunities</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {aiResult.opportunities.map((o, idx) => (
                        <div key={idx} style={{ padding: "0.85rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)" }}>{o.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{o.provider} ({o.duration})</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button className="btn-secondary" onClick={() => { setWizardStep(1); setAiResult(null); }}>
                  Re-plan Career Goal
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
