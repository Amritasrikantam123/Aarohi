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
  Sparkles,
  X
} from "lucide-react";
import { getDB, saveDB, logActivity } from "../data/mockData";
import { locales } from "../data/locales";

const offeringDetails = {
  en: {
    scholarship: {
      title: "Scholarship Hub",
      subtitle: "Secure your education funding",
      description: "A comprehensive gateway to connect female students with central, state, and corporate scholarships.",
      features: [
        { name: "Eligibility Calculator", desc: "Instantly check matching scholarship options based on state, grade, and family income thresholds." },
        { name: "Document Checklists", desc: "Complete guide to securing required documents like income certificates, caste certificates, and transcripts." },
        { name: "Deadlines & Reminders", desc: "Never miss an application window with real-time updates and text reminders." }
      ],
      publicAccess: "You can search the public scholarship database, download official guideline leaflets, and use our matching tools without creating an account.",
      cta: "Explore Active Scholarships"
    },
    internship: {
      title: "Internships & Workshops",
      subtitle: "Hands-on experience & tech skill building",
      description: "Curated programs helping secondary and higher secondary girls transition from classroom to professional settings.",
      features: [
        { name: "Virtual Internships", desc: "Flexible remote internships in software development, graphic design, content creation, and project management." },
        { name: "Tech Bootcamps", desc: "Immersive coding bootcamps, computational thinking workshops, and design-thinking sessions." },
        { name: "Innovation Hackathons", desc: "Compete in female-focused hackathons and project contests with other talented students." }
      ],
      publicAccess: "Anyone can browse current open training programs, download class syllabi, view workshop video recordings, and register for public events without a profile.",
      cta: "Browse Opportunities"
    },
    mentorship: {
      title: "Guide Mentorship",
      subtitle: "Learn from accomplished industry professionals",
      description: "Connecting girls with women leaders who have successfully navigated higher education and careers in STEM, medicine, civil services, and entrepreneurship.",
      features: [
        { name: "1-on-1 Guidance Sessions", desc: "Book direct video/audio consultation slots with mentors working in your field of interest." },
        { name: "Group Career Panels", desc: "Attend monthly career panels to understand the day-to-day realities of different professions." },
        { name: "Mentorship Roadmap", desc: "Follow guided paths from high school graduation to entering your dream career." }
      ],
      publicAccess: "Our mentor directory is public! Read mentor success stories, watch recorded panels, and join open webinars without signing up.",
      cta: "Meet Our Mentors"
    },
    career: {
      title: "Interactive Career Paths",
      subtitle: "Map your journey to your dream career",
      description: "Visual, step-by-step career roadmaps spanning 8 core sectors to guide you from where you are to your future goal.",
      features: [
        { name: "Visual Skill Trees", desc: "Explore what subjects to study, what technical skills to acquire, and what exams to pass." },
        { name: "Curated Learning Links", desc: "Direct access to high-quality, completely free courses and video lectures from top online platforms." },
        { name: "Industry Insights", desc: "Learn about standard entry salaries, everyday responsibilities, and future prospects of each career." }
      ],
      publicAccess: "All 8 comprehensive sector roadmaps, skill trees, and links to free educational resources are fully accessible to the public.",
      cta: "Explore Career Roadmaps"
    },
    community: {
      title: "Student & Peer Community",
      subtitle: "A safe, supportive space for mutual growth",
      description: "Connect with thousands of peers sharing your aspirations, questions, and resources in a secure environment.",
      features: [
        { name: "Subject Study Groups", desc: "Form study circles with other girls to prepare for school exams, science fairs, or college entry tests." },
        { name: "Moderated Discussion Board", desc: "A safe space to ask academic, career, and personal development questions without hesitation." },
        { name: "Resource Sharing Feed", desc: "Access notes, e-books, and study guides uploaded by seniors, teachers, and guide mentors." }
      ],
      publicAccess: "Browse active public discussion boards, download study materials, and read student success announcements without registration.",
      cta: "Join the Discussion"
    }
  },
  hi: {
    scholarship: {
      title: "छात्रवृत्ति हब (Scholarship Hub)",
      subtitle: "अपनी शिक्षा के लिए वित्तीय सहायता प्राप्त करें",
      description: "छात्राओं को सरकारी, गैर-सरकारी और कॉर्पोरेट छात्रवृत्तियों से जोड़ने का एक एकीकृत पोर्टल।",
      features: [
        { name: "पात्रता कैलकुलेटर", desc: "अपने राज्य, कक्षा और पारिवारिक आय के आधार पर सही छात्रवृत्ति की तुरंत जांच करें।" },
        { name: "दस्तावेज़ गाइड", desc: "आय प्रमाण पत्र, जाति प्रमाण पत्र और शैक्षणिक अंकों जैसे महत्वपूर्ण दस्तावेज़ों को तैयार करने की पूरी जानकारी।" },
        { name: "अंतिम तिथि अनुस्मारक", desc: "वास्तविक समय के अपडेट और समय पर रिमाइंडर प्राप्त करें ताकि आप कोई अवसर न चूकें।" }
      ],
      publicAccess: "आप बिना पंजीकरण किए छात्रवृत्ति डेटाबेस खोज सकते हैं, आधिकारिक निर्देशिका डाउनलोड कर सकते हैं और पात्रता जांच का उपयोग कर सकते हैं।",
      cta: "सक्रिय छात्रवृत्तियां देखें"
    },
    internship: {
      title: "इंटर्नशिप और कार्यशालाएं",
      subtitle: "व्यावहारिक अनुभव और तकनीकी कौशल विकास",
      description: "कक्षा की शिक्षा से व्यावसायिक दुनिया में प्रवेश करने के लिए छात्राओं हेतु विशेष व्यावहारिक कार्यक्रम।",
      features: [
        { name: "वर्चुअल इंटर्नशिप", desc: "सॉफ्टवेयर विकास, ग्राफिक डिज़ाइन, कंटेंट राइटिंग और प्रोजेक्ट मैनेजमेंट में रिमोट इंटर्नशिप।" },
        { name: "तकनीकी बूटकैंप", desc: "कोडिंग, डिज़ाइन थिंकिंग और व्यावसायिक कौशल पर 2 से 4 सप्ताह के गहन प्रशिक्षण सत्र।" },
        { name: "इनोवेशन हैकाथॉन", desc: "अन्य छात्राओं के साथ राष्ट्रीय और क्षेत्रीय हैकाथॉन और प्रोजेक्ट प्रतियोगिताओं में भाग लें।" }
      ],
      publicAccess: "कोई भी वर्तमान में चल रहे प्रशिक्षण कार्यक्रमों को देख सकता है, पाठ्यक्रम डाउनलोड कर सकता है और सार्वजनिक सत्रों के वीडियो रिकॉर्डिंग देख सकता है।",
      cta: "अवसर खोजें"
    },
    mentorship: {
      title: "मार्गदर्शक मेंटरशिप (Mentorship)",
      subtitle: "सफल पेशेवरों से सीधे मार्गदर्शन प्राप्त करें",
      description: "इंजीनियरिंग, चिकित्सा, सिविल सेवाओं (IAS/IPS), अनुसंधान और उद्यमिता जैसे क्षेत्रों में कार्यरत देश की अग्रणी महिलाओं से जुड़ें।",
      features: [
        { name: "1-ऑन-1 परामर्श सत्र", desc: "अपनी पसंद के करियर में कार्यरत मेंटर्स के साथ सीधे वीडियो/ऑडियो चैट स्लॉट बुक करें।" },
        { name: "करियर वेबिनार", desc: "विभिन्न व्यवसायों की वास्तविकताओं को समझने के लिए मासिक पैनल चर्चाओं में शामिल हों।" },
        { name: "मार्गदर्शन रोडमैप", desc: "स्कूल की पढ़ाई से लेकर सपनों के करियर तक पहुंचने का एक सुनियोजित मार्ग।" }
      ],
      publicAccess: "हमारा मेंटर डायरेक्टरी पूरी तरह सार्वजनिक है! आप बिना लॉग इन किए मेंटर्स की कहानियां पढ़ सकते हैं और वेबिनार देख सकते हैं।",
      cta: "मेंटर्स से मिलें"
    },
    career: {
      title: "इंटरएक्टिव करियर पथ",
      subtitle: "अपने सपनों के करियर तक की यात्रा को समझें",
      description: "8 प्रमुख क्षेत्रों के लिए विज़ुअल रोडमैप जो आपको स्कूल स्तर से नौकरी तक का पूरा रास्ता दिखाते हैं।",
      features: [
        { name: "विज़ुअल स्किल ट्री", desc: "जानें कि कौन से विषय पढ़ने हैं, कौन से तकनीकी कौशल सीखने हैं और कौन सी परीक्षाएँ देनी हैं।" },
        { name: "मुफ़्त शिक्षा संसाधन", desc: "शीर्ष ऑनलाइन प्लेटफॉर्म्स से चयनित और पूरी तरह से मुफ़्त कोर्सेज व वीडियो लेक्चर्स की सूची।" },
        { name: "उद्योग का विवरण", desc: "प्रत्येक करियर में शुरुआती वेतन, दैनिक जिम्मेदारियां और भविष्य के अवसरों की जानकारी।" }
      ],
      publicAccess: "सभी 8 क्षेत्रों के रोडमैप, कौशल ट्री और मुफ़्त कोर्सेज की लिंक्स आम जनता के लिए पूरी तरह सुलभ हैं।",
      cta: "करियर रोडमैप देखें"
    },
    community: {
      title: "छात्रा और सहकर्मी समुदाय",
      subtitle: "आपसी सहयोग और सीखने के लिए एक सुरक्षित मंच",
      description: "हजारों छात्राओं के साथ जुड़कर नोट्स साझा करें, अध्ययन समूह बनाएं और अपनी शंकाओं का समाधान करें।",
      features: [
        { name: "विषयवार अध्ययन समूह", desc: "समान विषयों की पढ़ाई या प्रतियोगी परीक्षाओं की तैयारी के लिए सहपाठियों के साथ ग्रुप बनाएं।" },
        { name: "सुरक्षित चर्चा मंच", desc: "शैक्षणिक और करियर संबंधी प्रश्न बिना किसी संकोच के पूछने के लिए एक पूरी तरह से मॉडरेटेड स्पेस।" },
        { name: "नोट्स और गाइड शेयरिंग", desc: "वरिष्ठ छात्राओं, शिक्षकों और मेंटर्स द्वारा साझा किए गए अध्ययन नोट्स और गाइड्स तक पहुंच।" }
      ],
      publicAccess: "आप बिना पंजीकरण के भी सार्वजनिक संदेश बोर्ड पढ़ सकते हैं, नोट्स डाउनलोड कर सकते हैं और सफलता की घोषणाएं देख सकते हैं।",
      cta: "चर्चा में शामिल हों"
    }
  },
  te: {
    scholarship: {
      title: "స్కాలర్‌షిప్ హబ్",
      subtitle: "మీ విద్యా నిధులను పొందండి",
      description: "విద్యార్థినులకు కేంద్ర, రాష్ట్ర ప్రభుత్వాలు మరియు ప్రైవేట్ సంస్థల స్కాలర్‌షిప్‌లను అనుసంధానించే ఒక సమగ్ర పోర్టల్.",
      features: [
        { name: "అర్హత కాలిక్యులేటర్", desc: "రాష్ట్రం, తరగతి మరియు కుటుంబ ఆదాయం ఆధారంగా సరిపోయే స్కాలర్‌షిప్‌లను వెంటనే తెలుసుకోండి." },
        { name: "డాక్యుమెంట్ గైడ్", desc: "ఆదాయ, కుల ధృవీకరణ పత్రాలు మరియు మార్క్స్ మేమోల తయారీకి పూర్తి మార్గదర్శకత్వం." },
        { name: "గడువు తేదీల హెచ్చరికలు", desc: "ఏ అవకాశాన్ని కోల్పోకుండా ఉండటానికి నిజ సమయ గడువు సమాచారం మరియు ఎస్ఎంఎస్ హెచ్చరికలు." }
      ],
      publicAccess: "మీరు ఖాతా సృష్టించకుండానే స్కాలర్‌షిప్ డేటాబేస్ శోధించవచ్చు, పిడిఎఫ్ మార్గదర్శకాలను డౌన్‌లోడ్ చేసుకోవచ్చు.",
      cta: "యాక్టివ్ స్కాలర్‌షిప్స్ చూడండి"
    },
    internship: {
      title: "ఇంటర్న్‌షిప్స్ & వర్క్‌షాప్స్",
      subtitle: "ప్రాక్టికల్ అనుభవం & సాంకేతిక నైపుణ్యాల పెంపొందింపు",
      description: "విద్యార్థినులు చదువు నుండి ప్రొఫెషనల్ రంగంలోకి సులభంగా అడుగు పెట్టడానికి సహాయపడే ప్రత్యేక కార్యక్రమాలు.",
      features: [
        { name: "వర్చువల్ ఇంటర్న్‌షిప్స్", desc: "సాఫ్ట్‌వేర్, గ్రాఫిక్ డిజైన్, కంటెంట్ రైటింగ్ మరియు ప్రాజెక్ట్ మేనేజ్‌మెంట్‌లో రిమోట్ అవకాశాలు." },
        { name: "టెక్ బూట్‌క్యాంప్స్", desc: "కోడింగ్ మరియు డిజైన్ థింకింగ్‌పై 2 నుండి 4 వారాల శిక్షణా తరగతులు." },
        { name: "ఇన్నోవేషన్ హ్యాకథాన్స్", desc: "ఇతర ప్రతిభావంతులైన విద్యార్థినులతో కలిసి పోటీపడే జాతీయ స్థాయి ప్రాజెక్ట్ పోటీలు." }
      ],
      publicAccess: "ఎవరైనా ప్రస్తుత శిక్షణా కోర్సులను చూడవచ్చు, సిలబస్ డౌన్‌లోడ్ చేసుకోవచ్చు మరియు వర్క్‌షాప్స్ వీడియోలను వీక్షించవచ్చు.",
      cta: "అవకాశాలను అన్వేషించండి"
    },
    mentorship: {
      title: "మార్గదర్శకత్వం (Mentorship)",
      subtitle: "విజయవంతమైన నిపుణుల నుండి నేర్చుకోండి",
      description: "ఇంజనీరింగ్, మెడిసిన్, సివిల్ సర్వీసెస్ (IAS/IPS), పరిశోధన రంగాలలో ఉన్నత స్థానాల్లో ఉన్న మహిళలతో కనెక్ట్ అవ్వండి.",
      features: [
        { name: "1-ఆన్-1 గైడెన్స్ సెషన్స్", desc: "మీకు ఆసక్తి ఉన్న రంగంలోని మెంటార్స్‌తో నేరుగా ఆడియో/వీడియో సంప్రదింపుల స్లాట్లను బుక్ చేసుకోండి." },
        { name: "కెరీర్ ప్యానెల్ వెబినార్స్", desc: "వివిధ వృత్తులలో రోజువారీ సవాళ్లు మరియు ప్రయోజనాల గురించి అవగాహన పెంచుకోవడానికి జరిగే నెలవారీ వెబినార్స్." },
        { name: "మెంటార్‌షిప్ రోడ్‌మ్యాప్", desc: "ఉన్నత పాఠశాల చదువు నుండి ఆశించిన ఉద్యోగం సాధించే వరకు సరైన దిశా నిర్దేశం." }
      ],
      publicAccess: "మా మెంటార్ డైరెక్టరీ పబ్లిక్‌గా ఉంది! రిజిస్టర్ అవ్వకుండానే వారి విజయ గాథలు చదవవచ్చు మరియు వెబినార్స్ చూడవచ్చు.",
      cta: "మా మెంటార్స్‌ను కలవండి"
    },
    career: {
      title: "ఇంటరాక్టివ్ కెరీర్ రోడ్‌మ్యాప్స్",
      subtitle: "మీ కలల కెరీర్‌కు ప్రయాణాన్ని ప్లాన్ చేసుకోండి",
      description: "మీరు ఉన్న స్థాయి నుండి భవిష్యత్తు లక్ష్యాన్ని చేరుకోవడానికి 8 ప్రధాన రంగాలలో విజువల్ రోడ్‌మ్యాప్స్.",
      features: [
        { name: "విజువల్ స్కిల్ ట్రీస్", desc: "ఏ సబ్జెక్టులు చదవాలి, ఏ నైపుణ్యాలు నేర్చుకోవాలి మరియు ఏ పరీక్షలు రాయాలో స్పష్టమైన అవగాహన." },
        { name: "ఉచిత కోర్సుల లింక్స్", desc: "ప్రముఖ ఆన్‌లైన్ వెబ్‌సైట్లలో అందుబాటులో ఉన్న అత్యుత్తమ ఉచిత కోర్సులు మరియు వీడియో లెక్చర్స్." },
        { name: "పరిశ్రమ అంతర్దృష్టులు", desc: "కెరీర్‌లో ప్రారంభ జీతాలు, విధులు మరియు భవిష్యత్తులో ఉండే ఉద్యోగ అవకాశాల సమాచారం." }
      ],
      publicAccess: "అన్ని 8 రంగాల రోడ్‌మ్యాప్‌లు మరియు ఉచిత కోర్సుల లింకులు పబ్లిక్ యాక్సెస్‌లో అందుబాటులో ఉన్నాయి.",
      cta: "కెరీర్ రోడ్‌మ్యాప్స్ చూడండి"
    },
    community: {
      title: "స్టూడెంట్ & పీర్ కమ్యూనిటీ",
      subtitle: "పరస్పర అభివృద్ధికి సురక్షితమైన వేదిక",
      description: "వేలాది మంది విద్యార్థినులతో కనెక్ట్ అయ్యి నోట్స్ పంచుకోండి, గ్రూప్ స్టడీస్ చేసుకోండి మరియు సందేహాలు నివృత్తి చేసుకోండి.",
      features: [
        { name: "సబ్జెక్ట్ స్టడీ గ్రూప్స్", desc: "పరీక్షల తయారీ లేదా సైన్స్ ఫెయిర్స్ కోసం కలిసి చదువుకునేలా సహచరులతో సర్కిల్స్ ఏర్పాటు చేసుకోండి." },
        { name: "సురక్షిత చర్చా వేదిక", desc: "ఎటువంటి భయం లేకుండా చదువు, కెరీర్ గురించి ప్రశ్నలు అడగడానికి ప్రత్యేకంగా పర్యవేక్షించబడే ఫోరమ్." },
        { name: "నోట్స్ షేరింగ్ ఫీడ్", desc: "సీనియర్లు, ఉపాధ్యాయులు పంచుకున్న నోట్స్, ఈ-బుక్స్ మరియు స్టడీ గైడ్లను యాక్సెస్ చేయండి." }
      ],
      publicAccess: "మీరు రిజిస్ట్రేషన్ చేసుకోకుండానే పబ్లిక్ చర్చలను చదవవచ్చు మరియు స్టడీ మెటీరియల్‌ని డౌన్‌లోడ్ చేసుకోవచ్చు.",
      cta: "చర్చలో పాల్గొనండి"
    }
  }
};

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
  const [activeDetailOffer, setActiveDetailOffer] = useState(null);
  const [db, setDb] = useState(() => getDB());
  const [featuredStories, setFeaturedStories] = useState([]);
  const [approvedMentors, setApprovedMentors] = useState([]);

  // Sliding Image Carousel for Hero Section
  const slideImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiCfKt-i-9XGsVVqVXSFto9Pze6YTZcaB8kg&s",
    "https://www.orfonline.org/public/uploads/posts/image/women-education.jpg",
    "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202408/girls-education-080318245-16x9_0.jpeg?VersionId=13sIgIY8UZbuEYPmj5YHB4bYI3fNo2fz&size=690:388",
    "https://satyarthi.org.in/wp-content/uploads/2021/09/girl-student_6139ecd847750.jpg"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      key: "scholarship",
      title: t.offerScholarshipTitle,
      desc: t.offerScholarshipDesc,
      icon: Award
    },
    {
      key: "internship",
      title: t.offerInternshipTitle,
      desc: t.offerInternshipDesc,
      icon: Rocket
    },
    {
      key: "mentorship",
      title: t.offerMentorshipTitle,
      desc: t.offerMentorshipDesc,
      icon: Users
    },
    {
      key: "career",
      title: t.offerCareerTitle,
      desc: t.offerCareerDesc,
      icon: Cpu
    },
    {
      key: "community",
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
          <div 
            className="navbar-brand-wrapper"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
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
            <div className="logo-text-container" style={{ display: "flex", alignItems: "center" }}>
              <span className={`logo-hindi-nav brand-text-${currentLang}`} style={{ fontSize: "1.8rem", fontWeight: 800, background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {currentLang === 'te' ? 'ఆరోహి' : currentLang === 'hi' ? 'आरोही' : 'Aarohi'}
              </span>
              <span className="sparkle-indicator">✨</span>
            </div>
          </div>

          <ul className="nav-links" style={{ margin: 0, padding: 0 }}>
            <li><a href="#about" className="nav-link-premium">{t.navAbout}</a></li>
            <li><a href="#offers" className="nav-link-premium">{t.navFeatures}</a></li>
            <li><a href="#stories" className="nav-link-premium">{t.navStories}</a></li>
            <li><a href="#mentors" className="nav-link-premium">{t.navMentors}</a></li>
            <li><a href="#contact" className="nav-link-premium">{t.navContact}</a></li>
            
            {/* Language Selection Switcher */}
            <li className="lang-dropdown-container" style={{ position: "relative" }}>
              <button 
                className="lang-btn" 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  backgroundColor: "transparent",
                  border: "1px solid var(--border-color)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Globe size={14} />
                {currentLang === "en" ? "English" : currentLang === "hi" ? "हिन्दी" : "తెలుగు"}
              </button>
              {showLanguageMenu && (
                <div style={{
                  position: "absolute",
                  top: "115%",
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
                      padding: "0.5rem 1rem",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: currentLang === "en" ? "var(--lavender-bg)" : "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => { onLangChange("hi"); setShowLanguageMenu(false); }}
                    style={{
                      padding: "0.5rem 1rem",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: currentLang === "hi" ? "var(--lavender-bg)" : "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    हिन्दी
                  </button>
                  <button 
                    onClick={() => { onLangChange("te"); setShowLanguageMenu(false); }}
                    style={{
                      padding: "0.5rem 1rem",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: currentLang === "te" ? "var(--lavender-bg)" : "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    తెలుగు
                  </button>
                </div>
              )}
            </li>

            <li>
              <button 
                onClick={onLoginClick}
                style={{
                  padding: "0.4rem 1rem",
                  fontSize: "0.82rem",
                  borderRadius: "20px",
                  border: "2.5px solid var(--primary-color)",
                  background: "transparent",
                  color: "var(--primary-color)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "var(--primary-color)";
                  e.target.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "var(--primary-color)";
                }}
              >
                {t.btnSignIn}
              </button>
            </li>
            <li>
              <button 
                onClick={onRegisterClick}
                style={{
                  padding: "0.45rem 1.2rem",
                  fontSize: "0.82rem",
                  borderRadius: "20px",
                  border: "none",
                  background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(124, 58, 237, 0.25)",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-1px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                {t.btnRegisterNow}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ padding: "60px 0 90px 0", position: "relative", overflow: "hidden", background: "#FAFAFC" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "4rem", alignItems: "center" }}>
          
          <div key={currentLang} className="hero-content hero-transition-fade" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Small Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(124, 58, 237, 0.08)",
              border: "1px solid rgba(124, 58, 237, 0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--primary-color)",
              marginBottom: "1.5rem"
            }}>
              <span>🌸 Empowering India's Daughters</span>
            </div>
            
            <h1 className="hero-title" style={{ 
              fontSize: "64px", 
              fontWeight: currentLang === 'en' ? "400" : currentLang === 'hi' ? "600" : "500", 
              color: "var(--text-main)", 
              lineHeight: "1.1", 
              letterSpacing: currentLang === 'en' ? "-1px" : "0", 
              margin: "0 0 0.5rem 0", 
              fontFamily: currentLang === 'en' ? "var(--font-hero-title-en)" : currentLang === 'hi' ? "var(--font-hero-title-hi)" : "var(--font-hero-title-te)" 
            }}>
              {t.heroTitle}
            </h1>

            <h2 className="hero-tagline" style={{
              fontSize: "24px",
              fontWeight: "500",
              color: "var(--secondary-color)",
              margin: "0 0 1rem 0",
              lineHeight: "1.3",
              fontFamily: currentLang === 'en' ? 'var(--font-hero-tagline-en)' : currentLang === 'hi' ? 'var(--font-hero-tagline-hi)' : 'var(--font-hero-tagline-te)'
            }}>
              {t.tagline}
            </h2>

            {/* Elegant Floral Divider */}
            <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "580px", gap: "1rem", margin: "0.25rem 0 1.25rem 0" }}>
              <div style={{ flexGrow: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(236, 72, 153, 0.25))" }}></div>
              <span style={{ color: "#ec4899", opacity: 0.8, fontSize: "1rem" }}>🌸</span>
              <div style={{ flexGrow: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(236, 72, 153, 0.25))" }}></div>
            </div>
            
            <p className="hero-desc" style={{ 
              color: "var(--text-muted)", 
              fontSize: "17px", 
              lineHeight: "1.7", 
              margin: "0 0 1.5rem 0", 
              maxWidth: "580px",
              fontFamily: currentLang === 'en' ? 'var(--font-hero-desc-en)' : currentLang === 'hi' ? 'var(--font-hero-desc-hi)' : 'var(--font-hero-desc-te)',
              fontWeight: "400"
            }}>
              {t.heroDesc}
            </p>

            <div className="hero-quote" style={{
              borderLeft: "3.5px solid var(--secondary-color)",
              paddingLeft: "1rem",
              margin: "0 0 2.5rem 0",
              fontStyle: "italic",
              color: "var(--text-main)",
              fontSize: "15px",
              lineHeight: "1.6",
              fontWeight: "500",
              opacity: 0.95,
              fontFamily: currentLang === 'en' ? 'var(--font-hero-desc-en)' : currentLang === 'hi' ? 'var(--font-hero-desc-hi)' : 'var(--font-hero-desc-te)'
            }}>
              {t.heroQuote}
            </div>
            
            <div className="hero-actions" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
              <button 
                className="btn-premium-primary" 
                onClick={onRegisterClick}
              >
                {t.btnBeginJourney} <ArrowRight size={16} />
              </button>
              
              <button 
                className="btn-premium-secondary" 
                onClick={onExploreOpportunities}
              >
                {currentLang === "hi" ? "छात्रवृत्ति खोजें" : currentLang === "te" ? "స్కాలర్‌షిప్స్ వెతకండి" : "Search Scholarships"}
              </button>
            </div>

            {/* Live Statistics Grid directly under Hero left content */}
            <div className="hero-stats-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
              width: "100%",
              borderTop: "1px solid var(--border-color)",
              paddingTop: "2rem"
            }}>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--primary-color)" }}>{girlsCount}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{t.counterGirls}</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--secondary-color)" }}>{mentorsCount}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{t.counterMentors}</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-color)" }}>{scholarshipsCount}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{t.counterScholarships}</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--primary-color)" }}>{statesCount}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>States Covered</div>
              </div>
            </div>
          </div>
          
          {/* Right Side Carousel */}
          <div className="hero-image-container" style={{ position: "relative", width: "100%" }}>
            <div className="hero-slider-wrapper" style={{ width: "100%", position: "relative" }}>
              <div className="hero-slider-inner" style={{ 
                borderRadius: "var(--radius-lg)", 
                overflow: "hidden", 
                position: "relative", 
                aspectRatio: "1.25", 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" 
              }}>
                {slideImages.map((src, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      opacity: idx === currentSlide ? 1 : 0,
                      transition: "opacity 0.8s ease-in-out",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: idx === currentSlide ? 2 : 1
                    }}
                  >
                    {/* Dark gradient overlay */}
                    <div style={{ 
                       position: "absolute", 
                       top: 0, 
                       left: 0, 
                       width: "100%", 
                       height: "100%", 
                       background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.65) 100%)",
                       zIndex: 3, 
                       pointerEvents: "none" 
                    }} />
                    <img
                      src={src}
                      alt={`Empowering girls education ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Pagination Dots */}
              <div className="hero-slider-dots" style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.25rem" }}>
                {slideImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot ${idx === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: idx === currentSlide ? "var(--primary-color)" : "rgba(124, 58, 237, 0.3)",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s ease",
                      transform: idx === currentSlide ? "scale(1.2)" : "scale(1)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* What We Provide */}
      <section id="offers" className="offers-section section-premium-padding" style={{ background: "#FFFFFF" }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="section-title" style={{ fontSize: "40px", fontWeight: "700", color: "var(--text-main)", marginBottom: "1rem" }}>{t.whatWeOffer}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              {t.whatWeOfferSub}
            </p>
          </div>
          
          <div className="offers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
            {offerings.map((offer, i) => (
              <div 
                key={i} 
                className="premium-card"
              >
                <div className="offer-icon-wrapper" style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>
                  <offer.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="offer-title" style={{ fontSize: "24px", fontWeight: "600", color: "var(--text-main)", marginBottom: "1rem" }}>{offer.title}</h3>
                <p className="offer-desc" style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.6", flex: 1 }}>{offer.desc}</p>
                <div style={{ marginTop: "2rem" }}>
                  <button 
                    onClick={() => setActiveDetailOffer(offer.key)}
                    className="btn-premium-secondary"
                    style={{ padding: "0.5rem 1.2rem", fontSize: "0.9rem" }}
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
      <section id="stories" className="stories-section section-premium-padding" style={{ background: "#FFFFFF", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="section-title" style={{ fontSize: "40px", fontWeight: "700", color: "var(--text-main)", marginBottom: "1rem" }}>{t.storiesTitle}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              {t.storiesSub}
            </p>
          </div>
          
          <div className="stories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {featuredStories.length > 0 ? (
              featuredStories.map((story) => (
                <div 
                  key={story.id} 
                  className="premium-card"
                  style={{ padding: "2.5rem", alignItems: "flex-start" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div className="story-avatar-wrapper" style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", border: "2.5px solid var(--secondary-color)" }}>
                      <img 
                        src={story.avatar || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=150"} 
                        alt={story.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <div className="story-name" style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>{story.name}</div>
                      <div style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>
                        {story.school}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div style={{ display: "flex", gap: "4px", marginBottom: "1rem", color: "var(--accent-color)" }}>
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>

                  <p className="story-quote" style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--text-muted)", fontStyle: "italic", flex: 1, marginBottom: "1.5rem" }}>
                    "{currentLang === "hi" ? story.featuredStory.quoteHi : currentLang === "te" ? story.featuredStory.quoteTe : story.featuredStory.quoteEn}"
                  </p>
                  
                  <div className="story-state" style={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px", fontWeight: "700", color: "var(--primary-color)" }}>
                    {story.district}, {story.state}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: "1/-1", 
                textAlign: "center", 
                padding: "80px 20px", 
                background: "#FAFAFC", 
                borderRadius: "var(--radius-lg)",
                border: "1px dashed var(--border-color)",
                color: "var(--text-muted)",
                width: "100%"
              }}>
                <Sparkles size={36} color="var(--primary-color)" style={{ marginBottom: "1rem" }} />
                <h4 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                  {t.noStories}
                </h4>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" style={{ padding: "120px 0", background: "linear-gradient(180deg, #111827 0%, #1F2937 100%)", color: "#fff" }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="section-title" style={{ fontSize: "40px", fontWeight: "700", color: "#fff", marginBottom: "1rem" }}>{t.mentorTitle}</h2>
            <p style={{ color: "var(--accent-color)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              {t.mentorSub}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            {approvedMentors.length > 0 ? (
              approvedMentors.map((mentor) => (
                <div 
                  key={mentor.id} 
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "2.5rem 2rem",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.borderColor = "var(--accent-color)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  }}
                >
                  <img 
                    src={mentor.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"} 
                    alt={mentor.name} 
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--accent-color)",
                      marginBottom: "1.25rem"
                    }}
                  />
                  <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "0.25rem" }}>{mentor.name}</h4>
                  <p style={{ fontSize: "14px", color: "var(--accent-color)", fontWeight: 600, marginBottom: "0.25rem" }}>{mentor.role}</p>
                  <span style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "0.75rem" }}>{mentor.organization}</span>
                  <p style={{ fontSize: "14px", color: "#D1D5DB", margin: "0 0 1.5rem 0", lineHeight: "1.5" }}>{mentor.field}</p>
                  
                  <button 
                    onClick={onRegisterClick}
                    style={{
                      marginTop: "auto",
                      width: "100%",
                      backgroundColor: "var(--accent-color)",
                      border: "none",
                      borderRadius: "30px",
                      padding: "10px 20px",
                      color: "#111827",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.target.style.filter = "brightness(1.1)"}
                    onMouseOut={(e) => e.target.style.filter = "none"}
                  >
                    Book Session
                  </button>
                </div>
              ))
            ) : (
              <div style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "60px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "var(--radius-lg)",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                color: "#9CA3AF"
              }}>
                <p style={{ fontSize: "16px" }}>No mentors registered yet. Click below to become the first mentor!</p>
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "2rem",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "0.75rem", color: "var(--accent-color)" }}>
                {t.joinAsMentor}
              </h3>
              <p style={{ color: "#D1D5DB", fontSize: "16px", lineHeight: "1.6" }}>
                {t.joinAsMentorSub}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                className="btn-premium-primary" 
                style={{
                  background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)",
                  boxShadow: "0 6px 20px rgba(236, 72, 153, 0.3)"
                }}
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
        padding: "120px 0",
        background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--lavender-bg) 100%)",
        borderTop: "1px solid var(--border-color)"
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <h2 className="section-title" style={{ fontSize: "40px", fontWeight: "700", color: "var(--text-main)", marginBottom: "1rem" }}>
              {currentLang === "hi" ? "हमसे संपर्क करें" : currentLang === "te" ? "మమ్మల్ని సంప్రదించండి" : "Get In Touch"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "18px", marginTop: "0.5rem" }}>
              {currentLang === "hi" ? "कोई प्रश्न या सुझाव है? हमारी राष्ट्रीय संचालन टीम से सीधे संपर्क करें।" : currentLang === "te" ? "ఏదైనా ప్రశ్న ఉందా? మమ్మల్ని నేరుగా సంప్రదించండి." : "Have questions, suggestions, or want to partner with us? Write to our national desk."}
            </p>
          </div>

          <div className="grid-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3rem" }}>
            {/* Left Column: Contact Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "2rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
                <div style={{
                  backgroundColor: "rgba(124, 58, 237, 0.08)",
                  color: "var(--primary-color)",
                  padding: "12px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    {currentLang === "hi" ? "राष्ट्रीय कार्यालय" : currentLang === "te" ? "జాతీయ కార్యాలయం" : "National Headquarters"}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                    {currentLang === "hi" ? "महिला एवं बाल विकास मंत्रालय, शास्त्री भवन, नई दिल्ली - 110001" : currentLang === "te" ? "మహిళా మరియు శిశు అభివృద్ధి మంత్రిత్వ శాఖ, శాస్త్రి భవన్, న్యూఢిల్లీ" : "Ministry of Women & Child Development, Shastri Bhawan, New Delhi - 110001"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "2rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
                <div style={{
                  backgroundColor: "rgba(236, 72, 153, 0.08)",
                  color: "var(--secondary-color)",
                  padding: "12px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    {currentLang === "hi" ? "हेल्पलाइन एवं फोन" : currentLang === "te" ? "ఫోన్ నంబర్లు" : "Helplines & Telephones"}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    <strong>National Desk:</strong> <a href="tel:+911123383937" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary-hover)"} onMouseOut={(e) => e.target.style.color = "var(--primary-color)"}>+91 11 2338 3937</a><br />
                    <strong>Women Safety Toll-Free:</strong> <a href="tel:1091" style={{ color: "var(--secondary-color)", textDecoration: "none", fontWeight: "700", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--secondary-hover)"} onMouseOut={(e) => e.target.style.color = "var(--secondary-color)"}>1091</a> (24/7 Support)
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "2rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
                <div style={{
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  color: "var(--accent-color)",
                  padding: "12px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    {currentLang === "hi" ? "ईमेल सहायता" : currentLang === "te" ? "ఈమెయిల్ మద్దతు" : "Email Communications"}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    <a href="mailto:support.aarohi@gov.in" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary-hover)"} onMouseOut={(e) => e.target.style.color = "var(--primary-color)"}>support.aarohi@gov.in</a><br />
                    <a href="mailto:info-aarohi-mission@gov.in" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--primary-hover)"} onMouseOut={(e) => e.target.style.color = "var(--primary-color)"}>info-aarohi-mission@gov.in</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "20px", boxShadow: "var(--shadow-premium)", padding: "2.5rem" }}>
              {contactSubmitted ? (
                <div style={{
                  textAlign: "center",
                  padding: "2rem 0"
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
                <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: "15px", marginBottom: "0.25rem", display: "block" }}>
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
                    <label className="form-label" style={{ fontWeight: 600, fontSize: "15px", marginBottom: "0.25rem", display: "block" }}>
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
                    <label className="form-label" style={{ fontWeight: 600, fontSize: "15px", marginBottom: "0.25rem", display: "block" }}>
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
                    <label className="form-label" style={{ fontWeight: 600, fontSize: "15px", marginBottom: "0.25rem", display: "block" }}>
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

                  <button 
                    type="submit" 
                    className="btn-premium-primary" 
                    style={{ width: "100%", padding: "0.85rem", justifyContent: "center" }}
                  >
                    {currentLang === "hi" ? "संदेश भेजें" : currentLang === "te" ? "సందేశం పంపు" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer-nav" style={{ backgroundColor: "#111827", color: "#F9FAFB", padding: "120px 0 40px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr", gap: "3rem", marginBottom: "4rem" }}>
          <div>
            <span style={{ fontSize: "2rem", fontWeight: 800, background: "linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-color) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", display: "inline-block" }}>
              Aarohi Digital Mission
            </span>
            <p style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              {t.footerMotto}
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", marginBottom: "1.5rem" }}>{t.footerLinks}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><a href="#about" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>{t.navAbout}</a></li>
              <li><a href="#offers" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>{t.navFeatures}</a></li>
              <li><a href="#stories" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>{t.navStories}</a></li>
              <li><a href="#mentors" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>{t.navMentors}</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", marginBottom: "1.5rem" }}>{t.footerResources}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>National Scholarship Portal</a></li>
              <li><a href="https://wcd.nic.in" target="_blank" rel="noreferrer" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>Beti Bachao Beti Padhao</a></li>
              <li><a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>Pragati Scholarship Portal</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", marginBottom: "1.5rem" }}>{t.footerContact}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem", color: "#9CA3AF", fontSize: "15px" }}>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <MapPin size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{currentLang === "hi" ? "शास्त्री भवन, नई दिल्ली, भारत" : currentLang === "te" ? "శాస్త్రి భవన్, న్యూఢిల్లీ" : "Shastri Bhawan, New Delhi"}</span>
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Phone size={18} />
                <a href="tel:+911123383937" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>+91 11 2338 3937</a>
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Mail size={18} />
                <a href="mailto:support.aarohi@gov.in" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>support.aarohi@gov.in</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>© 2026 Aarohi Digital Mission (आरोही). All Rights Reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span style={{ cursor: "pointer", color: "#9CA3AF", fontSize: "14px" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>Privacy Policy</span>
            <span style={{ cursor: "pointer", color: "#9CA3AF", fontSize: "14px" }} onMouseOver={(e) => e.target.style.color = "#FFF"} onMouseOut={(e) => e.target.style.color = "#9CA3AF"}>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Description / Learn More Details Modal */}
      {activeDetailOffer && (() => {
        const details = (offeringDetails[currentLang] || offeringDetails.en)[activeDetailOffer];
        if (!details) return null;
        return (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "1.5rem"
          }} onClick={() => setActiveDetailOffer(null)}>
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "var(--radius-lg)",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "var(--shadow-premium)",
              overflow: "hidden",
              border: "1px solid rgba(124, 58, 237, 0.15)",
              position: "relative"
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{
                padding: "2rem",
                background: "linear-gradient(135deg, var(--lavender-light) 0%, #FFFFFF 100%)",
                borderBottom: "1px solid var(--border-color)",
                position: "relative"
              }}>
                <button 
                  onClick={() => setActiveDetailOffer(null)}
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                    borderRadius: "50%",
                    transition: "var(--transition-smooth)"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <X size={20} />
                </button>
                
                <span style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--primary-color)",
                  letterSpacing: "1px",
                  display: "inline-block",
                  marginBottom: "0.5rem"
                }}>
                  {details.subtitle}
                </span>
                <h2 style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  margin: 0
                }}>
                  {details.title}
                </h2>
              </div>

              {/* Content */}
              <div style={{ padding: "2rem", maxHeight: "60vh", overflowY: "auto" }}>
                <p style={{
                  fontSize: "16px",
                  color: "var(--text-main)",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem"
                }}>
                  {details.description}
                </p>

                <h3 style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <Sparkles size={16} style={{ color: "var(--accent-color)" }} />
                  {currentLang === "hi" ? "मुख्य विशेषताएं" : currentLang === "te" ? "ప్రధాన ఫీచర్లు" : "Key Features"}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                  {details.features.map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <CheckCircle size={18} style={{ color: "var(--primary-color)", flexShrink: 0, marginTop: "3px" }} />
                      <div>
                        <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 0.25rem 0" }}>{feat.name}</h4>
                        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: "1.5rem 2rem",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                background: "#FAFAFC"
              }}>
                <button 
                  onClick={() => setActiveDetailOffer(null)}
                  className="btn-premium-secondary"
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  {currentLang === "hi" ? "बंद करें" : currentLang === "te" ? "మూసివేయి" : "Close"}
                </button>
                <button 
                  onClick={() => {
                    setActiveDetailOffer(null);
                    if (activeDetailOffer === "scholarship") {
                      onExploreOpportunities();
                    } else {
                      onRegisterClick();
                    }
                  }}
                  className="btn-premium-primary"
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  {activeDetailOffer === "scholarship" 
                    ? (currentLang === "hi" ? "सक्रिय छात्रवृत्तियां खोजें" : currentLang === "te" ? "యాక్టివ్ స్కాలర్‌షిప్స్ వెతకండి" : "Search Scholarships")
                    : (currentLang === "hi" ? "पूरा एक्सेस पाएं" : currentLang === "te" ? "పూర్తి యాక్సెస్ పొందండి" : "Get Full Access")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
