import axios from "axios";

const API_URL = "https://aarohi-pr61.onrender.com/api";

const defaultStudentProfile = null;


const fallbackCareers = [
  {
    id: "engineering",
    titleEn: "Engineering & Technology",
    titleHi: "अभियांत्रिकी और प्रौद्योगिकी",
    titleTe: "ఇంజనీరింగ్ & టెక్నాలజీ",
    icon: "Cpu",
    descriptionEn: "Design, build, and maintain software, hardware, infrastructures, and technical systems to solve real-world problems.",
    descriptionHi: "वास्तविक दुनिया की समस्याओं को हल करने के लिए सॉफ्टवेयर, हार्डवेयर, बुनियादी ढांचे और तकनीकी प्रणालियों का डिजाइन, निर्माण और रखरखाव करें।",
    descriptionTe: "నిజ జీవిత సమస్యలను పరిష్కరించడానికి సాఫ్ట్‌వేర్, హార్డ్‌వేర్ మరియు సాంకేతిక వ్యవస్థలను రూపొందించండి మరియు నిర్వహించండి.",
    roadmap: [
      { step: 1, titleEn: "Class 10th - Choose Science stream (PCM)", titleHi: "कक्षा 10वीं - विज्ञान स्ट्रीम (PCM) चुनें", titleTe: "10వ తరగతి - సైన్స్ గ్రూప్ ఎంచుకోండి", detailEn: "Focus heavily on Math, Physics, and logical thinking.", detailHi: "गणित, भौतिकी और तार्किक सोच पर पूरा ध्यान दें।", detailTe: "గణితం మరియు భౌతికశాస్త్రంపై దృష్టి పెట్టండి." },
      { step: 2, titleEn: "Prepare for JEE Mains/Advanced or State Entrance Exams", titleHi: "JEE Mains/Advanced या राज्य प्रवेश परीक्षाओं की तैयारी करें", titleTe: "JEE లేదా ఇతర ప్రవేశ పరీక్షలకు సిద్ధం అవ్వండి", detailEn: "Practice daily problems and understand fundamental concepts.", detailHi: "दैनिक समस्याओं का अभ्यास करें और मौलिक अवधारणाओं को समझें।", detailTe: "ప్రతిరోజూ ప్రాక్టీస్ చేయండి మరియు కాన్సెప్ట్స్ అర్థం చేసుకోండి." },
      { step: 3, titleEn: "Earn a B.Tech / B.E. Degree", titleHi: "B.Tech / B.E. डिग्री प्राप्त करें", titleTe: "B.Tech / B.E. డిగ్రీ పూర్తి చేయండి", detailEn: "Specialize in CS, IT, ECE, Mechanical, or Civil. Join tech groups, learn coding.", detailHi: "CS, IT, ECE, मैकेनिकल या सिविल में विशेषज्ञता हासिल करें। कोडिंग सीखें।", detailTe: "CS, IT, ECE, మెకానికల్ లేదా సివిల్ విభాగాలలో చేరండి." }
    ],
    skillsEn: ["Problem Solving", "Logical Coding (Python/JS)", "Mathematics", "Systems Architecture"],
    skillsHi: ["समस्या समाधान", "तार्किक कोडिंग (Python/JS)", "गणित", "सिस्टम आर्किटेक्चर"],
    skillsTe: ["సమస్య పరిష్కారం", "లాజికల్ కోడింగ్", "గణితం", "సిస్టమ్స్ ఆర్కిటెక్చర్"],
    courses: [
      { nameEn: "Introduction to Computer Science (CS50)", nameHi: "कंप्यूटर विज्ञान का परिचय (CS50)", nameTe: "కంప్యూటర్ సైన్స్ పరిచయం (CS50)", platform: "edX / Harvard", duration: "12 Weeks" },
      { nameEn: "Python for Everybody", nameHi: "सभी के लिए पायथन", nameTe: "పైథాన్ ఫర్ ఎవ్రీబాడీ", platform: "Coursera", duration: "6 Weeks" }
    ]
  },
  {
    id: "medicine",
    titleEn: "Medicine & Healthcare",
    titleHi: "चिकित्सा और स्वास्थ्य सेवा",
    titleTe: "మెడిసిన్ & హెల్త్‌కేర్",
    icon: "Activity",
    descriptionEn: "Serve humanity by diagnosing, treating, and researching illnesses to improve human health and well-being.",
    descriptionHi: "मानव स्वास्थ्य और कल्याण को बेहतर बनाने के लिए बीमारियों के निदान, उपचार और अनुसंधान द्वारा मानवता की सेवा करें।",
    descriptionTe: "ఆరోగ్య సంరక్షణ మరియు మానవ శ్రేయస్సు కొరకు రోగ నిర్ధారణ మరియు చికిత్స అందించండి.",
    roadmap: [
      { step: 1, titleEn: "Class 10th - Choose Science stream (PCB)", titleHi: "कक्षा 10वीं - विज्ञान स्ट्रीम (PCB) चुनें", titleTe: "10వ తరగతి - సైన్స్ గ్రూప్ (PCB) ఎంచుకోండి", detailEn: "Focus on Biology, Chemistry, and Human Anatomy.", detailHi: "जीवविज्ञान, रसायन विज्ञान और मानव शरीर रचना विज्ञान पर ध्यान दें।", detailTe: "జీవశాస్త్రం మరియు రసాయన శాస్త్రాలపై దృష్టి పెట్టండి." },
      { step: 2, titleEn: "Clear NEET-UG Entrance Exam", titleHi: "NEET-UG प्रवेश परीक्षा पास करें", titleTe: "NEET-UG ప్రవేశ పరీక్షలో ఉత్తీర్ణత సాధించండి", detailEn: "Compete nationally to secure a seat in government medical college.", detailHi: "सरकारी मेडिकल कॉलेज में सीट सुरक्षित करने के लिए राष्ट्रीय स्तर पर प्रतिस्पर्धा करें।", detailTe: "ప్రభుత్వ మెడికల్ కాలేజీలో సీటు కోసం జాతీయ స్థాయి పరీక్ష రాయండి." },
      { step: 3, titleEn: "Complete MBBS Degree & Internship", titleHi: "MBBS डिग्री और इंटर्नशिप पूरी करें", titleTe: "MBBS డిగ్రీ మరియు ఇంటర్న్‌షిప్ పూర్తి చేయండి", detailEn: "4.5 years of rigorous study followed by 1 year of clinical training.", detailHi: "4.5 साल के कठिन अध्ययन के बाद 1 साल का नैदानिक प्रशिक्षण।", detailTe: "4.5 సంవత్సరాల కఠినమైన చదువు మరియు 1 సంవత్సరం క్లినికల్ శిక్షణ." }
    ],
    skillsEn: ["Medical Diagnostics", "Empathy & Patient Care", "Biology & Chemistry", "Surgical Precision"],
    skillsHi: ["चिकित्सा निदान", "सहानुभूति और रोगी देखभाल", "जीव विज्ञान और रसायन विज्ञान", "सर्जिकल सटीकता"],
    skillsTe: ["మెడికల్ డయాగ్నోస్టిక్స్", "రోగి సంరక్షణ", "జీవశాస్త్రం", "శస్త్రచికిత్స నైపుణ్యం"],
    courses: [
      { nameEn: "Introductory Human Physiology", nameHi: "मानव शरीर क्रिया विज्ञान", nameTe: "హ్యూమన్ ఫిజియాలజీ పరిచయం", platform: "Coursera", duration: "8 Weeks" }
    ]
  }
];

const fallbackOpportunities = [
  {
    id: "wise_phd",
    title: "WISE Fellowship for Ph.D. (Women in Science & Engineering)",
    description: "WISE offers research fellowships to female scientists, engineers, and students wanting to pursue advanced scientific research.",
    eligibility: {
      minMarks: 70,
      maxIncome: 800000,
      classRequired: "Passed 12th & pursuing Science/Engineering degree",
      description: "Research Proposal, Academic Transcripts, Age proof (21-45 years)"
    },
    location: "Remote / Hybrid",
    applyLink: "https://dst.gov.in/women-scientists-programs",
    provider: "Department of Science & Technology (DST), Govt of India",
    type: "Scholarship",
    duration: "3 Years",
    stipend: "₹37,000 per month + HRA",
    date: "2026-10-31",
    category: "Government",
    state: "All"
  },
  {
    id: "adobe_tech",
    title: "Adobe Research Women-in-Technology Scholarship",
    description: "Adobe is committed to bringing gender diversity to technology by offering massive tuition assistance and mentorship to female students.",
    eligibility: {
      minMarks: 80,
      maxIncome: 1200000,
      classRequired: "Pursuing B.Tech / M.Tech in CS/IT/Data Science",
      description: "Academic Resume, Cover Letter, Reference Letters, GitHub link"
    },
    location: "Bengaluru, India",
    applyLink: "https://research.adobe.com/scholarship/",
    provider: "Adobe Research India",
    type: "Scholarship",
    duration: "1 Year",
    stipend: "₹8,00,000 (one-time aid)",
    date: "2026-08-30",
    category: "Private",
    state: "All"
  },
  {
    id: "aicte_pragati",
    title: "AICTE Pragati Scholarship for Girl Students",
    description: "An initiative by the Government of India to assist advancement of girl children pursuing technical education.",
    eligibility: {
      minMarks: 60,
      maxIncome: 800000,
      classRequired: "Pursuing Technical Degree/Diploma (1st Year)",
      description: "10th/12th Marksheet, Income Certificate, Tuition Fee receipt"
    },
    location: "New Delhi, India",
    applyLink: "https://www.aicte-india.org/schemes/students-development-schemes/pragati",
    provider: "All India Council for Technical Education (AICTE)",
    type: "Scholarship",
    duration: "Annual",
    stipend: "₹50,000 per year",
    date: "2026-11-15",
    category: "Government",
    state: "All"
  },
  {
    id: "loreal_science",
    title: "L’Oréal India For Young Women In Science Scholarship",
    description: "Financial assistance to young girls who wish to pursue their education in any scientific field (pure sciences/applied sciences/engineering/medicine).",
    eligibility: {
      minMarks: 85,
      maxIncome: 600000,
      classRequired: "Passed Class 12 in Science stream",
      description: "Class 10/12 Marksheets, Proof of Income, Active admission confirmation"
    },
    location: "All India",
    applyLink: "https://www.loreal.com/en/india/articles/science-and-technology/for-young-women-in-science-scholarship/",
    provider: "L'Oréal India",
    type: "Scholarship",
    duration: "Graduation Duration",
    stipend: "₹2,50,000 (disbursed in installments)",
    date: "2026-10-15",
    category: "Private",
    state: "All"
  },
  {
    id: "santoor_girls",
    title: "Santoor Scholarship for Girls",
    description: "Wipro Cares and Wipro Consumer Care support rural and underprivileged female students in selected states to pursue higher studies.",
    eligibility: {
      minMarks: 60,
      maxIncome: 400000,
      classRequired: "Passed Class 12 & pursuing first year graduation",
      description: "Class 10 & 12 Marksheets, Bank Account details, Rural proof if applicable"
    },
    location: "South India (KA, AP, TS)",
    applyLink: "https://www.santoorscholarship.com/",
    provider: "Wipro Cares",
    type: "Scholarship",
    duration: "3 Years",
    stipend: "₹24,000 per year",
    date: "2026-09-30",
    category: "Private",
    state: "All"
  },
  {
    id: "kotak_kanya",
    title: "Kotak Kanya Scholarship",
    description: "Financial assistance to meritorious girl students from underprivileged families for pursuing professional graduation courses.",
    eligibility: {
      minMarks: 85,
      maxIncome: 600000,
      classRequired: "Passed Class 12 & pursuing Engineering/Medicine/Law/Design",
      description: "Class 12 Marksheet, Income Certificate, Fee receipt, Parental death certificate if single parent"
    },
    location: "All India",
    applyLink: "https://www.kotak.com/en/about-us/corporate-social-responsibility.html",
    provider: "Kotak Education Foundation",
    type: "Scholarship",
    duration: "Graduation Duration",
    stipend: "₹1,50,000 per year",
    date: "2026-10-30",
    category: "Private",
    state: "All"
  },
  {
    id: "tech_intern",
    title: "Tech Innovation Virtual Internship Program",
    description: "A hands-on remote engineering internship designed for female students to learn modern web technologies, Git, and full-stack deployment.",
    eligibility: {
      minMarks: 65,
      maxIncome: 1000000,
      classRequired: "Pursuing B.Tech/B.Sc/BCA",
      description: "Basic programming understanding in JS/Python."
    },
    location: "Remote",
    applyLink: "https://github.com",
    provider: "Aarohi Corporate Partnership Desk",
    type: "Internship",
    duration: "8 Weeks",
    stipend: "₹15,000 stipend",
    date: "2026-07-20",
    category: "Private",
    state: "All"
  }
];

const fallbackMentors = [];

// Local cache
let dbCache = {
  careers: [],
  scholarships: [],
  opportunities: [],
  mentors: [],
  pendingMentors: [],
  grievances: [],
  studentsList: [],
  activities: [],
  contactQueries: [],
  language: "en",
  studentProfile: null
};

// Loader state
let isLoaded = false;
let loadPromise = null;

export const getDB = () => {
  if (!isLoaded && typeof window !== "undefined") {
    const localDb = localStorage.getItem("aarohi_db_cache");
    if (localDb) {
      try {
        dbCache = { ...dbCache, ...JSON.parse(localDb) };
      } catch (e) {}
    }
  }
  return dbCache;
};

// Initialize DB by fetching from backend
export const initDB = async () => {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      console.log("Initializing database from backend...");
      
      // Fetch users
      const usersRes = await axios.get(`${API_URL}/users`);
      const users = usersRes.data || [];
      
      const students = users.filter(u => u.role === "student");
      const mentors = users.filter(u => u.role === "mentor" && u.status === "approved");
      const pendingMentors = users.filter(u => u.role === "mentor" && u.status === "pending");

      // Fetch opportunities
      const oppsRes = await axios.get(`${API_URL}/opportunities`);
      const rawOpportunities = oppsRes.data || [];
      
      // Fetch careers
      const careersRes = await axios.get(`${API_URL}/career-guidance`);
      const rawCareers = careersRes.data || [];

      // Fetch grievances
      let grievances = [];
      try {
        const gRes = await axios.get(`${API_URL}/grievances`);
        grievances = gRes.data || [];
      } catch (e) {}

      // Fetch contact queries
      let contactQueries = [];
      try {
        const cRes = await axios.get(`${API_URL}/contact`);
        contactQueries = cRes.data || [];
      } catch (e) {}

      // Language preference
      let language = "en";
      if (typeof window !== "undefined") {
        language = localStorage.getItem("aarohi_language") || "en";
      }

      // Map career fields dynamically based on the current language
      const careersToMap = rawCareers.length > 0 ? rawCareers : fallbackCareers;
      const mappedCareers = careersToMap.map(c => {
        const title = language === "hi" ? c.titleHi : language === "te" ? c.titleTe : c.titleEn;
        const description = language === "hi" ? c.descriptionHi : language === "te" ? c.descriptionTe : c.descriptionEn;
        const skills = language === "hi" ? c.skillsHi : language === "te" ? c.skillsTe : c.skillsEn;
        const roadmap = (c.roadmap || []).map(r => ({
          ...r,
          title: language === "hi" ? r.titleHi : language === "te" ? r.titleTe : r.titleEn,
          detail: language === "hi" ? r.detailHi : language === "te" ? r.detailTe : r.detailEn
        }));
        const courses = (c.courses || []).map(course => ({
          ...course,
          name: language === "hi" ? course.nameHi : language === "te" ? course.nameTe : course.nameEn
        }));

        return {
          ...c,
          id: c.id || c._id,
          title,
          description,
          skills,
          roadmap,
          courses
        };
      });

      const processedOpps = (rawOpportunities.length > 0 ? rawOpportunities : fallbackOpportunities).map(opp => ({
        ...opp,
        id: opp.id || opp._id
      }));

      dbCache = {
        careers: mappedCareers,
        scholarships: processedOpps.filter(o => o.type === "Scholarship"),
        opportunities: processedOpps.filter(o => o.type !== "Scholarship"),
        mentors: mentors.length > 0 ? mentors : fallbackMentors,
        pendingMentors: pendingMentors,
        grievances: grievances,
        studentsList: students.length > 0 ? students.map(s => ({ ...s, id: s.id || s._id })) : [],
        activities: dbCache.activities.length > 0 ? dbCache.activities : [
          { id: "act_init", textEn: "Connected to MongoDB backend successfully.", textHi: "MongoDB बैकएंड से सफलतापूर्वक जुड़े।", textTe: "మొంగోడిబి బ్యాకెండ్‌కి విజయవంతంగా కనెక్ట్ చేయబడింది.", timestamp: new Date().toISOString() }
        ],
        contactQueries: contactQueries,
        language: language,
        studentProfile: students.length > 0 ? { ...students[0], id: students[0].id || students[0]._id } : null
      };

      isLoaded = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("aarohi_db_cache", JSON.stringify(dbCache));
      }
      return dbCache;
    } catch (error) {
      console.error("Failed to load initial data from backend, using fallback seed:", error);
      
      let language = "en";
      if (typeof window !== "undefined") {
        language = localStorage.getItem("aarohi_language") || "en";
      }

      // Populate using fallbacks if completely offline or backend failed
      const mappedCareers = fallbackCareers.map(c => {
        const title = language === "hi" ? c.titleHi : language === "te" ? c.titleTe : c.titleEn;
        const description = language === "hi" ? c.descriptionHi : language === "te" ? c.descriptionTe : c.descriptionEn;
        const skills = language === "hi" ? c.skillsHi : language === "te" ? c.skillsTe : c.skillsEn;
        const roadmap = (c.roadmap || []).map(r => ({
          ...r,
          title: language === "hi" ? r.titleHi : language === "te" ? r.titleTe : r.titleEn,
          detail: language === "hi" ? r.detailHi : language === "te" ? r.detailTe : r.detailEn
        }));
        const courses = (c.courses || []).map(course => ({
          ...course,
          name: language === "hi" ? course.nameHi : language === "te" ? course.nameTe : course.nameEn
        }));

        return { ...c, title, description, skills, roadmap, courses };
      });

      const processedOpps = fallbackOpportunities.map(opp => ({
        ...opp,
        id: opp.id || opp._id
      }));

      dbCache = {
        ...dbCache,
        careers: mappedCareers,
        scholarships: processedOpps.filter(o => o.type === "Scholarship"),
        opportunities: processedOpps.filter(o => o.type !== "Scholarship"),
        mentors: [],
        studentsList: [],
        studentProfile: null,
        language: language
      };

      isLoaded = true;
      return dbCache;
    }
  })();

  return loadPromise;
};

export const saveDB = async (db) => {
  dbCache = { ...dbCache, ...db };
  if (typeof window !== "undefined") {
    localStorage.setItem("aarohi_db_cache", JSON.stringify(dbCache));
    localStorage.setItem("aarohi_language", db.language || "en");
  }

  try {
    // 1. Sync student profile updates
    if (db.studentProfile) {
      const profile = db.studentProfile;
      const profileId = profile._id || profile.id;
      if (profileId) {
        const token = localStorage.getItem("aarohi_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        if (profileId.startsWith("STU_")) {
          // If it's a new profile, register it
          const res = await axios.post(`${API_URL}/auth/register`, {
            ...profile,
            role: "student"
          });
          // Update id in local db cache
          if (res.data && res.data._id) {
            profile._id = res.data._id;
          }
        } else {
          // Update existing profile
          await axios.put(`${API_URL}/users/${profileId}`, profile, { headers });
        }
      }
    }

    // 2. Sync Grievances
    if (db.grievances && db.grievances.length > 0) {
      for (const g of db.grievances) {
        try {
          await axios.post(`${API_URL}/grievances`, g);
        } catch (e) {
          try {
            await axios.put(`${API_URL}/grievances/${g.id}`, g);
          } catch (err) {}
        }
      }
    }

    // 3. Sync Contact Queries
    if (db.contactQueries && db.contactQueries.length > 0) {
      for (const q of db.contactQueries) {
        try {
          await axios.post(`${API_URL}/contact`, q);
        } catch (e) {}
      }
    }
  } catch (error) {
    console.error("Error syncing changes to server:", error);
  }
};

export const logActivity = (textEn, textHi, textTe) => {
  const newActivity = {
    id: "act_" + Date.now(),
    textEn,
    textHi,
    textTe,
    timestamp: new Date().toISOString()
  };
  dbCache.activities = [newActivity, ...dbCache.activities].slice(0, 20);
  if (typeof window !== "undefined") {
    localStorage.setItem("aarohi_db_cache", JSON.stringify(dbCache));
  }
};

