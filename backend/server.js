const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Import Models
const User = require("./models/User");
const Opportunity = require("./models/Opportunity");
const CareerGuidance = require("./models/CareerGuidance");
const Application = require("./models/Application");
const Notification = require("./models/Notification");
const Event = require("./models/Event");
const Course = require("./models/Course");
const GovernmentScheme = require("./models/GovernmentScheme");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS config
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use("/api/", apiLimiter);

// MongoDB connection
const startDatabase = async () => {
  let connectionUri = process.env.MONGODB_URI;
  
  if (!connectionUri || connectionUri.includes("<username>")) {
    console.log("ℹ️ No production MongoDB Atlas URI detected (placeholder found). Starting local In-Memory MongoDB Server...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      connectionUri = mongoServer.getUri();
      console.log(`✅ In-Memory MongoDB Server started dynamically at: ${connectionUri}`);
    } catch (err) {
      console.error("❌ Failed to start In-Memory MongoDB Server:", err);
      process.exit(1);
    }
  }

  mongoose.connect(connectionUri)
    .then(() => {
      console.log(process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<username>") 
        ? "✅ MongoDB Atlas Connected Successfully" 
        : "✅ Connected to In-Memory MongoDB successfully.");
      seedDatabase();
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
};

startDatabase();

// Schema for Grievances
const GrievanceSchema = new mongoose.Schema({
  id: String,
  studentId: String,
  studentName: String,
  category: String,
  description: String,
  status: { type: String, default: "Submitted" },
  date: String,
  response: String
}, { timestamps: true });
const Grievance = mongoose.model("Grievance", GrievanceSchema);

// Schema for Contact Queries
const ContactQuerySchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  subject: String,
  message: String,
  timestamp: String
}, { timestamps: true });
const ContactQuery = mongoose.model("ContactQuery", ContactQuerySchema);

// JWT Middleware helper
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error("JWT auth error:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

// Role authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `User role '${req.user?.role}' is not authorized to access this resource` });
    }
    next();
  };
};

// API Routes

// 1. Authentication Endpoints
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, ...extraFields } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide name, email and password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "student",
      ...extraFields
    });

    const savedUser = await user.save();
    
    // Generate JWT
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        studentProfile: savedUser
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});

// GET /api/auth/me - Get current user profile from token
app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user with that email." });
    }
    // Simulation of forgot password token
    res.json({ message: "Password reset link sent to registered email address (mocked)." });
  } catch (error) {
    res.status(500).json({ error: "Forgot password request failed." });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  res.json({ message: "Password has been reset successfully." });
});

// Users REST Routes (Admin controlled or self)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 2. Opportunities (Internships, Workshops, Competitions)
app.post("/api/opportunities", async (req, res) => {
  try {
    const opp = new Opportunity(req.body);
    const savedOpp = await opp.save();
    res.status(201).json(savedOpp);
  } catch (error) {
    res.status(500).json({ error: "Failed to create opportunity" });
  }
});

app.get("/api/opportunities", async (req, res) => {
  try {
    const opps = await Opportunity.find({});
    res.json(opps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch opportunities" });
  }
});

app.put("/api/opportunities/:id", async (req, res) => {
  try {
    const updated = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update opportunity" });
  }
});

app.delete("/api/opportunities/:id", async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// 3. Applications
app.post("/api/applications", async (req, res) => {
  try {
    const application = new Application(req.body);
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Failed to create application" });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const list = await Application.find({}).populate("student").populate("opportunity");
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve applications" });
  }
});

app.put("/api/applications/:id", async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update application" });
  }
});

// 4. Notifications
app.post("/api/notifications", async (req, res) => {
  try {
    const notif = new Notification(req.body);
    await notif.save();
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

app.get("/api/notifications/user/:userId", async (req, res) => {
  try {
    const list = await Notification.find({ user: req.params.userId });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// 5. Events
app.post("/api/events", async (req, res) => {
  try {
    const ev = new Event(req.body);
    await ev.save();
    res.status(201).json(ev);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const list = await Event.find({});
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 6. Skill Courses
app.post("/api/courses", async (req, res) => {
  try {
    const c = new Course(req.body);
    await c.save();
    res.status(201).json(c);
  } catch (error) {
    res.status(500).json({ error: "Failed to create course" });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const list = await Course.find({});
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// 7. Government Schemes
app.post("/api/government-schemes", async (req, res) => {
  try {
    const s = new GovernmentScheme(req.body);
    await s.save();
    res.status(201).json(s);
  } catch (error) {
    res.status(500).json({ error: "Failed to create government scheme" });
  }
});

app.get("/api/government-schemes", async (req, res) => {
  try {
    const list = await GovernmentScheme.find({});
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch government schemes" });
  }
});

// 8. Career Guidance Roadmaps
app.post("/api/career-guidance", async (req, res) => {
  try {
    const career = new CareerGuidance(req.body);
    const savedCareer = await career.save();
    res.status(201).json(savedCareer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create career path" });
  }
});

app.get("/api/career-guidance", async (req, res) => {
  try {
    const careers = await CareerGuidance.find({});
    res.json(careers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch career guidance" });
  }
});

// 9. Grievance Portal
app.post("/api/grievances", async (req, res) => {
  try {
    const grievance = new Grievance(req.body);
    const savedGrievance = await grievance.save();
    res.status(201).json(savedGrievance);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit grievance" });
  }
});

app.get("/api/grievances", async (req, res) => {
  try {
    const grievances = await Grievance.find({});
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch grievances" });
  }
});

app.put("/api/grievances/:id", async (req, res) => {
  try {
    const updated = await Grievance.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update grievance" });
  }
});

// 10. Contact Queries
app.post("/api/contact", async (req, res) => {
  try {
    const query = new ContactQuery(req.body);
    const savedQuery = await query.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit query" });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const queries = await ContactQuery.find({});
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// Serve health status
app.get("/health", (req, res) => {
  res.json({ status: "healthy", time: new Date() });
});

// Database Seeding Logic
async function seedDatabase() {
  try {
    // 1. Seed Career Guidance if empty
    const careerCount = await CareerGuidance.countDocuments();
    if (careerCount === 0) {
      console.log("Seeding Career Guidance Database...");
      const mockCareers = [
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
            { nameEn: "Introduction to Computer Science (CS50)", nameHi: "कंप्यूटर साइंस का परिचय (CS50)", nameTe: "కంప్యూటర్ సైన్స్ పరిచయం (CS50)", platform: "edX / Harvard", duration: "12 Weeks" },
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
        },
        {
          id: "law",
          titleEn: "Law & Justice",
          titleHi: "कानून और न्याय",
          titleTe: "లా & జస్టిస్",
          icon: "Scale",
          descriptionEn: "Defend rights, draft legislation, litigate cases, and maintain structural justice in courts and corporations.",
          descriptionHi: "अदालतों और निगमों में अधिकारों की रक्षा करें, कानून का मसौदा तैयार करें, मुकदमों की पैरवी करें और न्याय बनाए रखें।",
          descriptionTe: "న్యాయస్థానాలు మరియు సంస్థలలో హక్కులను రక్షించండి మరియు న్యాయాన్ని కాపాడండి.",
          roadmap: [
            { step: 1, titleEn: "Class 10th - Select Humanities or Arts", titleHi: "कक्षा 10वीं - मानविकी या कला चुनें", titleTe: "10వ తరగతి - ఆర్ట్స్ లేదా హ్యుమానిటీస్ ఎంచుకోండి", detailEn: "Hone public speaking, history, and analytical reading.", detailHi: "सार्वजनिक भाषण, इतिहास और विश्लेषणात्मक पठन को निखारें।", detailTe: "ప్రసంగం, చరిత్ర మరియు విశ్లేషణాత్మక రీడింగ్ మెరుగుపరచండి." },
            { step: 2, titleEn: "Clear CLAT Entrance Exam", titleHi: "CLAT प्रवेश परीक्षा पास करें", titleTe: "CLAT ప్రవేశ పరీక్ష రాయండి", detailEn: "Gain admission to prestigious National Law Universities (NLUs).", detailHi: "प्रतिष्ठित राष्ट्रीय विधि विश्वविद्यालयों (NLUs) में प्रवेश प्राप्त करें।", detailTe: "ప్రతిష్టాత్మక నేషనల్ లా యూనివర్సిటీలలో ప్రవేశం పొందండి." },
            { step: 3, titleEn: "Earn a Integrated BA LLB / BBA LLB", titleHi: "BA LLB / BBA LLB की डिग्री प्राप्त करें", titleTe: "BA LLB / BBA LLB డిగ్రీ పూర్తి చేయండి", detailEn: "5-year integrated law degree including moot courts and internships.", detailHi: "मूट कोर्ट और इंटर्नशिप सहित 5 साल की एकीकृत कानून डिग्री।", detailTe: "మూట్ కోర్టులు మరియు ఇంటర్న్‌షిప్‌లతో కూడిన 5 సంవత్సరాల లా డిగ్రీ." }
          ],
          skillsEn: ["Legal Research", "Argument Construction", "Public Speaking", "Drafting Contracts"],
          skillsHi: ["कानूनी अनुसंधान", "तर्क निर्माण", "सार्वजनिक भाषण", "अनुबंध का मसौदा तैयार करना"],
          skillsTe: ["లీగల్ రీసెర్చ", "వాదనలు చేయడం", "పబ్లిక్ స్పీకింగ్", "ఒప్పందాల ముసాయిదా"],
          courses: [
            { nameEn: "Introduction to Environmental Law and Policy", nameHi: "पर्यावरण कानून और नीति", nameTe: "పర్యావరణ చట్టం పరిచయం", platform: "Coursera", duration: "6 Weeks" }
          ]
        }
      ];
      await CareerGuidance.insertMany(mockCareers);
      console.log("Successfully seeded Career Guidance database!");
    }

    // 2. Seed Opportunities & Scholarships (refreshing collection to load updated real list)
    await Opportunity.deleteMany({});
    console.log("Cleared Opportunity database. Seeding real Scholarships and Opportunities...");
    const mockOpps = [
      {
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
    await Opportunity.insertMany(mockOpps);
    console.log("Successfully seeded Scholarships/Opportunities database!");

    // 3. Seed Government Schemes if empty
    const schemeCount = await GovernmentScheme.countDocuments();
    if (schemeCount === 0) {
      console.log("Seeding Government Schemes Database...");
      const mockSchemes = [
        {
          title: "Beti Bachao Beti Padhao Scheme",
          description: "A government campaign aiming to generate awareness and improve the efficiency of welfare services intended for girls.",
          eligibility: { minMarks: 0, maxIncome: 9999999, classRequired: "Class 10th and above", categoryRequired: "All" },
          state: "All",
          applyLink: "https://wcd.nic.in/schemes/beti-bachao-beti-padhao",
          provider: "Ministry of Women and Child Development"
        },
        {
          title: "Ladli Laxmi Yojana",
          description: "A scheme launched by MP government to improve educational and health status of girls and prevent child marriages.",
          eligibility: { minMarks: 0, maxIncome: 200000, classRequired: "Class 10th", categoryRequired: "All" },
          state: "Madhya Pradesh",
          applyLink: "https://ladlilaxmi.mp.gov.in/",
          provider: "Government of Madhya Pradesh"
        }
      ];
      await GovernmentScheme.insertMany(mockSchemes);
      console.log("Successfully seeded Government Schemes database!");
    }

    // 4. Seed Courses if empty
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log("Seeding Courses Database...");
      const mockCourses = [
        {
          title: "Web Development 101",
          provider: "Aarohi Skill Academy",
          duration: "6 Weeks",
          description: "Learn HTML, CSS, Javascript basics, and build a portfolio website.",
          syllabus: ["Introduction to HTML5", "Styling with CSS3", "JS Functions & DOM manipulation", "GitHub Portfolio project"]
        },
        {
          title: "Introduction to Financial Literacy",
          provider: "Global Women Finance Alliance",
          duration: "4 Weeks",
          description: "Master savings accounts, budgeting tools, investment planning, and tax structures.",
          syllabus: ["Money Management Basics", "Creating a budget", "Taxation & Schemes", "Investment avenues"]
        }
      ];
      await Course.insertMany(mockCourses);
      console.log("Successfully seeded Courses database!");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
