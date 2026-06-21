// Aarohi Dynamic Database Layer
// Exposes CRUD operations over localStorage to simulate a production database with real records.

export const initialCareers = [
  {
    id: "engineering",
    titleEn: "Engineering & Technology",
    titleHi: "अभियांत्रिकी और प्रौद्योगिकी",
    titleTe: "ఇంజనీరింగ్ & టెక్నాలజీ",
    icon: "Cpu"
  },
  {
    id: "medicine",
    titleEn: "Medicine & Healthcare",
    titleHi: "चिकित्सा और स्वास्थ्य सेवा",
    titleTe: "మెడిసిన్ & హెల్త్‌కేర్",
    icon: "Activity"
  },
  {
    id: "law",
    titleEn: "Law & Justice",
    titleHi: "कानून और न्याय",
    titleTe: "లా & జస్టిస్",
    icon: "Scale"
  },
  {
    id: "commerce",
    titleEn: "Commerce & Finance",
    titleHi: "वाणिज्य और वित्त",
    titleTe: "కామర్స్ & ఫైనాన్స్",
    icon: "TrendingUp"
  },
  {
    id: "arts",
    titleEn: "Arts, Design & Humanities",
    titleHi: "कला, डिजाइन और मानविकी",
    titleTe: "ఆర్ట్స్, డిజైన్ & హ్యుమానిటీస్",
    icon: "Palette"
  },
  {
    id: "government",
    titleEn: "Government Services (Civil Exams)",
    titleHi: "सरकारी सेवाएं (सिविल परीक्षाएं)",
    titleTe: "ప్రభుత్వ సేవలు (సివిల్స్)",
    icon: "Briefcase"
  },
  {
    id: "entrepreneurship",
    titleEn: "Entrepreneurship & Business",
    titleHi: "उद्यमिता और व्यवसाय",
    titleTe: "ఆంట్రప్రెన్యూర్‌షిప్ & బిజినెస్",
    icon: "Rocket"
  },
  {
    id: "research",
    titleEn: "Research & Higher Studies",
    titleHi: "अनुसंधान और उच्च अध्ययन",
    titleTe: "రీసెర్చ్ & హైయర్ స్టడీస్",
    icon: "BookOpen"
  }
];

export const initialScholarships = [
  {
    id: "s1",
    title: "WISE Fellowship for Ph.D. (Women in Science & Engineering)",
    provider: "Department of Science & Technology (DST), Govt of India",
    amount: "₹37,000 per month + HRA",
    eligibility: {
      minMarks: 70,
      maxIncome: 800000,
      classRequired: "Passed 12th & pursuing Science/Engineering degree",
      description: "WISE offers research fellowships to female scientists, engineers, and students wanting to pursue advanced scientific research."
    },
    deadline: "2026-10-31",
    category: "Government",
    applyUrl: "https://dst.gov.in/women-scientists-programs",
    requirements: "Research Proposal, Academic Transcripts, Age proof (21-45 years)"
  },
  {
    id: "s2",
    title: "SURE Fellowship (State University Research Excellence)",
    provider: "Science and Engineering Research Board (SERB)",
    amount: "₹5,00,000 research grant",
    eligibility: {
      minMarks: 75,
      maxIncome: 1000000,
      classRequired: "Degree/Post-Graduation in Tech or Science",
      description: "Designed to upgrade research capabilities in state universities, prioritizing meritorious female scholars with substantial grants."
    },
    deadline: "2026-09-15",
    category: "Government",
    applyUrl: "https://www.serbonline.in/SERB/Sure",
    requirements: "Enrolment Certificate, Research Draft, Income Certificate"
  },
  {
    id: "s3",
    title: "Adobe Research Women-in-Technology Scholarship",
    provider: "Adobe Research India",
    amount: "₹8,00,000 (one-time aid)",
    eligibility: {
      minMarks: 80,
      maxIncome: 1200000,
      classRequired: "Pursuing B.Tech / M.Tech in CS/IT/Data Science",
      description: "Adobe is committed to bringing gender diversity to technology by offering massive tuition assistance and mentorship to female students."
    },
    deadline: "2026-08-30",
    category: "Private",
    applyUrl: "https://research.adobe.com/scholarship/",
    requirements: "Academic Resume, Cover Letter, Reference Letters, GitHub link"
  },
  {
    id: "s4",
    title: "AICTE Pragati Scholarship for Girl Students",
    provider: "All India Council for Technical Education (AICTE)",
    amount: "₹50,000 per year",
    eligibility: {
      minMarks: 60,
      maxIncome: 800000,
      classRequired: "Class 11th, 12th, or Technical Degree/Diploma",
      description: "An initiative by the Government of India to assist advancement of girl children pursuing technical education."
    },
    deadline: "2026-11-15",
    category: "Government",
    applyUrl: "https://www.aicte-india.org/schemes/students-development-schemes/pragati",
    requirements: "10th/12th Marksheet, Income Certificate, Tuition Fee receipt"
  }
];

export const initialMentors = [];

export const initialPendingMentors = [];

// Start with empty student list as requested by user
export const initialStudents = [];

export const initialGrievances = [];

export const initialActivities = [];

export const initialContactQueries = [];

export const getDB = () => {
  if (typeof window === "undefined") return {};

  // Standard database migration/reset logic for stale client data
  let initialized = localStorage.getItem("aarohi_db_initialized_v7");
  if (!initialized) {
    localStorage.removeItem("aarohi_careers");
    localStorage.removeItem("aarohi_scholarships");
    localStorage.removeItem("aarohi_mentors");
    localStorage.removeItem("aarohi_pending_mentors");
    localStorage.removeItem("aarohi_grievances");
    localStorage.removeItem("aarohi_students_list");
    localStorage.removeItem("aarohi_activities");
    localStorage.removeItem("aarohi_contact_queries");
    localStorage.setItem("aarohi_db_initialized_v7", "true");
  }
  
  let careers = localStorage.getItem("aarohi_careers");
  let scholarships = localStorage.getItem("aarohi_scholarships");
  let mentors = localStorage.getItem("aarohi_mentors");
  let pendingMentors = localStorage.getItem("aarohi_pending_mentors");
  let grievances = localStorage.getItem("aarohi_grievances");
  let students = localStorage.getItem("aarohi_students_list");
  let activities = localStorage.getItem("aarohi_activities");
  let contactQueries = localStorage.getItem("aarohi_contact_queries");
  let language = localStorage.getItem("aarohi_language") || "en";

  const db = {
    careers: careers ? JSON.parse(careers) : initialCareers,
    scholarships: scholarships ? JSON.parse(scholarships) : initialScholarships,
    mentors: mentors ? JSON.parse(mentors) : initialMentors,
    pendingMentors: pendingMentors ? JSON.parse(pendingMentors) : initialPendingMentors,
    grievances: grievances ? JSON.parse(grievances) : initialGrievances,
    studentsList: students ? JSON.parse(students) : initialStudents,
    activities: activities ? JSON.parse(activities) : initialActivities,
    contactQueries: contactQueries ? JSON.parse(contactQueries) : initialContactQueries,
    language: language,
    studentProfile: (students ? JSON.parse(students) : initialStudents)[0] || null
  };

  if (!careers) {
    saveDB(db);
  }
  return db;
};

export const saveDB = (db) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("aarohi_careers", JSON.stringify(db.careers));
  localStorage.setItem("aarohi_scholarships", JSON.stringify(db.scholarships));
  localStorage.setItem("aarohi_mentors", JSON.stringify(db.mentors));
  localStorage.setItem("aarohi_pending_mentors", JSON.stringify(db.pendingMentors));
  localStorage.setItem("aarohi_grievances", JSON.stringify(db.grievances));
  localStorage.setItem("aarohi_students_list", JSON.stringify(db.studentsList));
  localStorage.setItem("aarohi_activities", JSON.stringify(db.activities));
  localStorage.setItem("aarohi_contact_queries", JSON.stringify(db.contactQueries || []));
  localStorage.setItem("aarohi_language", db.language || "en");
};

// Helper database triggers to log activity when records change
export const logActivity = (textEn, textHi, textTe) => {
  const db = getDB();
  const newActivity = {
    id: "act_" + Date.now(),
    textEn,
    textHi,
    textTe,
    timestamp: new Date().toISOString()
  };
  db.activities = [newActivity, ...db.activities].slice(0, 20); // Keep last 20 activities
  saveDB(db);
};
