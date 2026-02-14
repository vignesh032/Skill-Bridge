
const sidebar = document.getElementById("sidebar");
// ===== SIDEBAR PROFILE UPDATE (FIX) =====
function updateSidebarProfile() {
  const sidebarName = document.getElementById("sidebarName");
  const topProfile = document.querySelector(".profile");

  if (sidebarName) {
    sidebarName.textContent = userProfile.fullName || "Student";
  }

  if (topProfile) {
    topProfile.textContent = "👤 " + (userProfile.fullName || "Student");
  }
}

// ===== UPDATE USER FROM LOGIN =====
function updateCurrentUser(name, email) {
  if (name) userProfile.fullName = name;
  if (email) userProfile.email = email;
  updateSidebarProfile();

  // If on dashboard, refresh the welcome message
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle && pageTitle.innerText === "Dashboard") {
    loadContent('dashboard');
  }
}
window.updateCurrentUser = updateCurrentUser;


/* Sidebar */
function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("hide");
}
function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("hide");
}

/* Back Button Navigation */
function goBack() {
  const currentPage = window.location.pathname.toLowerCase();

  // If on dashboard/index page, reload to show intro
  if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
    location.reload();
  } else {
    // On other pages, use browser history
    window.history.back();
  }
}

// ===== USER PROFILE MANAGEMENT =====
let userProfile = {
  // Personal
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",

  // Education
  college: "XYZ Institute of Technology",
  degree: "B.Tech",
  branch: "Computer Science",
  graduationYear: "2024",
  gpa: "3.8",

  // Career preferences (role ids from ALL_ROLES in roles-config.js)
  interestedDomains: ["Web Development"],
  interestedRoles: ["frontend", "fullstack"],
  careerGoal: "Full-Stack Developer",

  // Skills (user-provided)
  skills: {
    "HTML/CSS": 0,
    "JavaScript": 0,
    "React": 0,
    "Node.js": 0,
    "MongoDB": 0,
    "Git": 0
  },

  // Experience
  experience: "No professional experience",
  projects: [
    { name: "E-Commerce Platform", description: "Built with MERN stack", link: "#" }
  ],
  certifications: [
    { name: "React Basics", issuer: "Coursera", date: "2024-01" },
    { name: "JavaScript Advanced", issuer: "Udemy", date: "2024-02" }
  ],

  // Resume data
  resumeExperience: [],
  resumeProjects: [],

  // Tracking
  appliedInternships: [],
  savedOpportunities: [],
  completedCourses: [],

  // Profile completion
  profileCompletion: 0
};

// Load from localStorage
function loadUserProfile() {
  const saved = localStorage.getItem('userProfile');
  if (saved) {
    userProfile = JSON.parse(saved);
    if (!Array.isArray(userProfile.interestedRoles) && userProfile.interestedDomains) {
      userProfile.interestedRoles = ["frontend", "fullstack"];
    }
    if (!userProfile.skills || typeof userProfile.skills !== 'object') {
      userProfile.skills = {};
    }
  }
  calculateProfileCompletion();
}

// Save to localStorage
function saveUserProfile() {
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
  calculateProfileCompletion();
  showNotification("Profile saved successfully!");
}

// Calculate profile completion percentage
function calculateProfileCompletion() {
  let completed = 0;
  let total = 0;
  const skillLevels = Object.values(userProfile.skills || {}).map(v => Number(v) || 0);
  const nonZeroSkills = skillLevels.filter(level => level > 0);

  // Check each section
  if (userProfile.fullName && userProfile.fullName !== "") completed++;
  if (userProfile.email && userProfile.email !== "") completed++;
  if (userProfile.phone && userProfile.phone !== "") completed++;
  if (userProfile.college && userProfile.college !== "") completed++;
  if (userProfile.degree && userProfile.degree !== "") completed++;
  if (userProfile.gpa && userProfile.gpa !== "") completed++;
  if (userProfile.interestedDomains && userProfile.interestedDomains.length > 0) completed++;
  if (nonZeroSkills.length > 0) completed++;
  if (userProfile.projects && userProfile.projects.length > 0) completed++;
  if (userProfile.certifications && userProfile.certifications.length > 0) completed++;

  total = 10;
  userProfile.profileCompletion = Math.round((completed / total) * 100);
  updateSidebarProfile();
}

// Show notification
function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #22D3EE; color: white;
    padding: 15px 25px; border-radius: 8px; z-index: 10000; animation: slideIn 0.3s ease;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ===== DATABASE: ALL OPPORTUNITIES =====
const ALL_INTERNSHIPS = [
  { id: 1, title: "Frontend Developer Intern", company: "TechCorp", duration: "3 months", stipend: "₹8,000/month", skills: ["HTML", "CSS", "JavaScript", "React"], description: "Build responsive UIs", location: "Bangalore", category: "internship" },
  { id: 2, title: "Full-Stack Developer Intern", company: "WebXcel", duration: "4 months", stipend: "₹12,000/month", skills: ["React", "Node.js", "MongoDB"], description: "MERN stack development", location: "Mumbai", category: "internship" },
  { id: 3, title: "Backend Developer Intern", company: "CloudSoft", duration: "3 months", stipend: "₹10,000/month", skills: ["Node.js", "MongoDB", "Docker"], description: "API development", location: "Remote", category: "internship" },
  { id: 4, title: "Data Analyst Intern", company: "DataFlow", duration: "3 months", stipend: "₹10,000/month", skills: ["Python", "SQL", "Tableau"], description: "Data analysis and reporting", location: "Hyderabad", category: "internship" },
  { id: 5, title: "Mobile App Developer", company: "AppVerse", duration: "3 months", stipend: "₹9,000/month", skills: ["Kotlin", "Android", "Firebase"], description: "Android development", location: "Pune", category: "internship" },
  { id: 6, title: "React Native Developer", company: "MobileFirst", duration: "4 months", stipend: "₹11,000/month", skills: ["ReactNative", "JavaScript", "Firebase"], description: "Cross-platform apps", location: "Delhi", category: "internship" },
  { id: 7, title: "DevOps Intern", company: "InfraCloud", duration: "3 months", stipend: "₹9,500/month", skills: ["Docker", "Kubernetes", "Linux"], description: "Cloud infrastructure", location: "Bangalore", category: "internship" },
  { id: 8, title: "AI/ML Intern", company: "NeuroTech", duration: "4 months", stipend: "₹13,000/month", skills: ["Python", "TensorFlow", "ML"], description: "Machine learning projects", location: "Remote", category: "internship" },
  { id: 9, title: "UI/UX Designer Intern", company: "DesignHub", duration: "3 months", stipend: "₹8,500/month", skills: ["Figma", "UI Design", "Adobe XD"], description: "Design user interfaces", location: "Bangalore", category: "internship" },
  { id: 10, title: "QA Engineer Intern", company: "TestPro", duration: "3 months", stipend: "₹7,500/month", skills: ["TestAutomation", "Selenium", "QA"], description: "Quality assurance testing", location: "Pune", category: "internship" },
  { id: 11, title: "Blockchain Developer", company: "ChainLink", duration: "4 months", stipend: "₹14,000/month", skills: ["JavaScript", "Solidity", "Web3"], description: "Smart contract development", location: "Remote", category: "internship" },
  { id: 12, title: "Security Engineer Intern", company: "CyberGuard", duration: "3 months", stipend: "₹10,500/month", skills: ["Linux", "Networking", "Security"], description: "Cybersecurity research", location: "Bangalore", category: "internship" }
];

const ALL_PROJECTS = [
  { id: 101, title: "Build Smart Home Dashboard", type: "Hackathon", prize: "₹1,00,000", duration: "48 hours", skills: ["React", "IoT", "Node.js"], description: "Control home devices", category: "project" },
  { id: 102, title: "AI Chatbot Challenge", type: "Hackathon", prize: "₹75,000", duration: "48 hours", skills: ["Python", "NLP", "Flask"], description: "Build intelligent chatbot", category: "project" },
  { id: 103, title: "Fintech App Development", type: "Project-based", prize: "₹50,000", duration: "4 weeks", skills: ["React", "Node.js", "REST API"], description: "Payment processing app", category: "project" },
  { id: 104, title: "E-Learning Platform", type: "Project-based", prize: "₹60,000", duration: "6 weeks", skills: ["MERN Stack", "Authentication"], description: "Online course platform", category: "project" },
  { id: 105, title: "Real-time Collaboration Tool", type: "Open Source", prize: "Contributions", duration: "Ongoing", skills: ["React", "WebSocket", "Node.js"], description: "Google Docs-like tool", category: "project" }
];

const ALL_EVENTS = [
  { id: 201, title: "React Performance Workshop", type: "Workshop", date: "Mar 15", duration: "2 hours", skills: ["React"], description: "Optimize React apps", category: "event" },
  { id: 202, title: "Web3 & Blockchain Bootcamp", type: "Bootcamp", date: "Mar 20-22", duration: "3 days", skills: ["Web3", "Solidity"], description: "Learn blockchain basics", category: "event" },
  { id: 203, title: "System Design Masterclass", type: "Webinar", date: "Mar 10", duration: "1.5 hours", skills: ["SystemDesign"], description: "Design scalable systems", category: "event" },
  { id: 204, title: "AI/ML Career Conference", type: "Conference", date: "Mar 25-26", duration: "2 days", skills: ["ML", "AI"], description: "Network with AI experts", category: "event" }
];

// ===== SKILL MATCHING ALGORITHM =====
function calculateSkillMatch(opportunitySkills) {
  if (!opportunitySkills || opportunitySkills.length === 0) return 0;
  const userSkillEntries = Object.entries(userProfile.skills || {})
    .map(([skill, level]) => [skill, Number(level) || 0])
    .filter(([, level]) => level > 0);
  if (userSkillEntries.length === 0) return 0;

  let matchedSkills = 0;
  opportunitySkills.forEach(skill => {
    // Check if user has the skill
    for (let [userSkill, level] of userSkillEntries) {
      if (userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())) {
        if (level >= 50) matchedSkills++;
      }
    }
  });

  return Math.round((matchedSkills / opportunitySkills.length) * 100);
}

// ===== GENERATE PERSONALIZED ROADMAP =====
function generateRoadmap() {
  const domains = userProfile.interestedDomains || ["Web Development"];
  const domain = domains[0];

  let stages = [];
  let coursePath = [];

  if (domain === "Web Development") {
    stages = [
      {
        icon: "📚",
        title: "STAGE 1: Foundation",
        weeks: "1-3",
        hours: 14,
        topics: ["HTML/CSS Fundamentals", "JavaScript Basics", "DOM Manipulation", "Practice Projects"],
        goal: "65/100"
      },
      {
        icon: "🛠️",
        title: "STAGE 2: Practical Skills",
        weeks: "4-8",
        hours: 12,
        topics: ["React Fundamentals", "Component Design", "State Management", "API Integration"],
        goal: "80/100"
      },
      {
        icon: "⚡",
        title: "STAGE 3: Advanced & Interview Ready",
        weeks: "9-12",
        hours: 10,
        topics: ["Advanced React", "Performance Optimization", "System Design", "Mock Interviews"],
        goal: "85+/100"
      }
    ];
    coursePath = [
      { week: "1-3", focus: "HTML/CSS", hours: 14, deliverable: "2 static websites" },
      { week: "4-5", focus: "JavaScript", hours: 10, deliverable: "Todo app, calculator" },
      { week: "6-7", focus: "React Basics", hours: 12, deliverable: "Component library" },
      { week: "8-10", focus: "Full-Stack", hours: 16, deliverable: "CRUD app with backend" },
      { week: "11-12", focus: "Interview Prep", hours: 8, deliverable: "Portfolio + practice" }
    ];
  } else if (domain === "Data Science") {
    stages = [
      {
        icon: "📊",
        title: "STAGE 1: Python & SQL Basics",
        weeks: "1-3",
        hours: 12,
        topics: ["Python Fundamentals", "Pandas", "SQL Queries", "Data Cleaning"],
        goal: "60/100"
      },
      {
        icon: "📈",
        title: "STAGE 2: Advanced Analytics",
        weeks: "4-8",
        hours: 12,
        topics: ["Statistical Analysis", "Visualization", "ML Basics", "Projects"],
        goal: "75/100"
      },
      {
        icon: "⚡",
        title: "STAGE 3: ML & Interview Ready",
        weeks: "9-12",
        hours: 10,
        topics: ["Machine Learning Models", "Deep Dive Projects", "Case Studies"],
        goal: "85/100"
      }
    ];
  }

  return { stages, coursePath };
}

// ===== GENERATE ATS SCORE =====
function generateATSScore(resumeData) {
  let score = 0;

  // Check sections (20 points each)
  if (resumeData.name && resumeData.name.trim()) score += 5;
  if (resumeData.email && resumeData.email.trim()) score += 5;
  if (resumeData.phone && resumeData.phone.trim()) score += 5;
  if (resumeData.education && resumeData.education.trim()) score += 5;

  // Check for action verbs (+5)
  const actionVerbs = ["developed", "built", "created", "designed", "implemented", "led", "managed"];
  const hasActionVerbs = actionVerbs.some(v => resumeData.experience && resumeData.experience.toLowerCase().includes(v));
  if (hasActionVerbs) score += 5;

  // Check for quantified achievements (+5)
  const hasQuantified = /\d+(%|x|L|thousand|million|hours|days)/i.test(resumeData.experience || "");
  if (hasQuantified) score += 5;

  // Check technical skills section (+10)
  if (resumeData.skills && resumeData.skills.trim()) score += 10;

  // Check projects section (+10)
  if (resumeData.projects && resumeData.projects.trim()) score += 10;

  // Check certifications (+10)
  if (resumeData.certifications && resumeData.certifications.trim()) score += 10;

  // Keyword matching (+20)
  const keywords = ["experience", "project", "skill", "achievement", "responsibility", "result"];
  let keywordCount = 0;
  keywords.forEach(kw => {
    if ((resumeData.experience || "").toLowerCase().includes(kw)) keywordCount++;
  });
  score += keywordCount * 3;

  return Math.min(100, score);
}

// ===== GLOBAL FUNCTIONS =====
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.saveUserProfile = saveUserProfile;
window.loadUserProfile = loadUserProfile;

// ===== MAIN CONTENT LOADER =====
function loadContent(section, btn) {
  document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  closeSidebar();

  const content = document.getElementById("content");
  const title = document.getElementById("pageTitle");

  /* DASHBOARD */
  if (section === "dashboard") {
    title.innerText = "Dashboard";
    const skillEntries = Object.entries(userProfile.skills || {});
    const avgSkill = skillEntries.length > 0
      ? skillEntries.reduce((sum, [, level]) => sum + (Number(level) || 0), 0) / skillEntries.length
      : 0;
    const activeSkills = skillEntries.filter(([, level]) => (Number(level) || 0) > 0).length;

    content.innerHTML = `
      <div class="dashboard-hero">
        <div class="hero-content">
          <h2>Welcome, ${userProfile.fullName || "Student"}! 🚀</h2>
          <p class="hero-tagline">Your Personalized Career Intelligence Platform</p>
          <p class="hero-description">Transform your skills into opportunities based on YOUR profile. Complete your profile to unlock personalized internships, projects, and career guidance.</p>
          <div class="hero-buttons">
            <button class="hero-btn primary" onclick="loadContent('profile'); closeSidebar();">👤 Complete Your Profile</button>
            <button class="hero-btn secondary" onclick="loadContent('resume'); closeSidebar();">📄 Build Resume</button>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card card-profile" onclick="loadContent('profile'); closeSidebar();">
          <h3>👤 Your Profile</h3>
          <div class="progress-metric">
            <div class="progress-bar"><div class="progress-fill" style="width: ${userProfile.profileCompletion}%"></div></div>
            <span>${userProfile.profileCompletion}% Complete</span>
          </div>
          <p class="small-text">Add all your details for personalization</p>
        </div>

        <div class="dashboard-card card-skill" onclick="window.location.href='skills-analysis.html';">
          <h3>📊 Skill Analysis</h3>
          <div class="metric">Current Skills: ${activeSkills}</div>
          <div class="metric highlight">Avg Level: ${avgSkill.toFixed(0)}/100</div>
          <p class="small-text">Analyze gaps and get recommendations</p>
        </div>

        <div class="dashboard-card card-internship" onclick="loadContent('internships'); closeSidebar();">
          <h3>🚀 Matched Internships</h3>
          <div class="metric">Available: ${ALL_INTERNSHIPS.length}+ opportunities</div>
          <div class="metric">Personalized for you</div>
          <p class="small-text">Based on your skills & interests</p>
        </div>

        <div class="dashboard-card card-career" onclick="window.location.href='roadmap.html';">
          <h3>🛣️ Career Roadmap</h3>
          <div class="metric">Roles: ${(userProfile.interestedRoles || []).length || "Select in profile"}</div>
          <div class="metric">All roles available</div>
          <p class="small-text">Same roles as profile & skill analysis</p>
        </div>

        <div class="dashboard-card card-resume" onclick="window.location.href='resume.html';">
          <h3>📄 Resume Builder (ATS)</h3>
          <div class="metric">Create & Track</div>
          <div class="metric">Get ATS Score</div>
          <p class="small-text">AI-powered feedback</p>
        </div>

        <div class="dashboard-card" onclick="loadContent('opportunities'); closeSidebar();">
          <h3>💡 Opportunities Hub</h3>
          <div class="metric">Internships, Projects, Events</div>
          <div class="metric">All matched</div>
          <p class="small-text">Everything in one place</p>
        </div>
      </div>
    `;
  }

  /* ENHANCED PROFILE FORM */
  if (section === "profile") {
    title.innerText = "Your Complete Career Profile";

    content.innerHTML = `
      <div class="profile-container">
        <div class="profile-header">
          <h2>📋 Build Your Complete Profile</h2>
          <p>Fill all sections to get personalized recommendations</p>
          <div class="progress-metric" style="max-width: 300px;">
            <div class="progress-bar"><div class="progress-fill" style="width: ${userProfile.profileCompletion}%"></div></div>
            <span>${userProfile.profileCompletion}% Complete</span>
          </div>
        </div>

        <div class="profile-form">
          <!-- Section 1: Personal Info -->
          <div class="form-section">
            <h3>👤 Personal Information</h3>
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" id="fullName" value="${userProfile.fullName}" placeholder="Your full name">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email *</label>
                <input type="email" id="email" value="${userProfile.email}" placeholder="your.email@example.com">
              </div>
              <div class="form-group">
                <label>Phone *</label>
                <input type="tel" id="phone" value="${userProfile.phone}" placeholder="+91-XXXXXXXXXX">
              </div>
            </div>
            <div class="form-group">
              <label>LinkedIn Profile</label>
              <input type="text" id="linkedin" value="${userProfile.linkedin}" placeholder="linkedin.com/in/yourprofile">
            </div>
          </div>

          <!-- Section 2: Education -->
          <div class="form-section">
            <h3>🎓 Education Background</h3>
            <div class="form-row">
              <div class="form-group">
                <label>College/University *</label>
                <input type="text" id="college" value="${userProfile.college}" placeholder="Your college name">
              </div>
              <div class="form-group">
                <label>Degree *</label>
                <input type="text" id="degree" value="${userProfile.degree}" placeholder="B.Tech, M.Tech, etc.">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Branch/Specialization *</label>
                <input type="text" id="branch" value="${userProfile.branch}" placeholder="CSE, ECE, etc.">
              </div>
              <div class="form-group">
                <label>Graduation Year *</label>
                <input type="number" id="graduationYear" value="${userProfile.graduationYear}" placeholder="2024">
              </div>
              <div class="form-group">
                <label>GPA/Percentage *</label>
                <input type="text" id="gpa" value="${userProfile.gpa}" placeholder="3.8/4.0">
              </div>
            </div>
          </div>

          <!-- Section 3: Career Preferences (all roles – same list as Skill Analysis & Roadmap) -->
          <div class="form-section">
            <h3>🎯 Interested Roles</h3>
            <p style="color: #9CA3AF; font-size: 13px;">Select the roles you're interested in. These appear in Skill Analysis and Career Roadmap.</p>
            <div class="checkbox-group" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
              ${(typeof ALL_ROLES !== 'undefined' ? ALL_ROLES : []).map(r => `
                <label><input type="checkbox" class="role-check" value="${r.id}" ${(userProfile.interestedRoles || []).includes(r.id) ? "checked" : ""}> ${r.title}</label>
              `).join('')}
            </div>
            <div class="form-group" style="margin-top: 16px;">
              <label>Career Goal (optional)</label>
              <input type="text" id="careerGoal" value="${userProfile.careerGoal}" placeholder="e.g., Full-Stack Developer, Data Scientist">
            </div>
          </div>

          <!-- Section 4: Skills -->
          <div class="form-section">
            <h3>💻 Your Technical Skills</h3>
            <p style="color: #9CA3AF; font-size: 13px;">Rate each skill from 0-100 (0=Never used, 100=Expert)</p>
            <div id="skillsInput" class="skills-input-group"></div>
            <button type="button" onclick="addSkill()" class="btn-add-skill">+ Add Another Skill</button>
          </div>

          <!-- Section 5: Experience & Projects -->
          <div class="form-section">
            <h3>💼 Experience & Projects</h3>
            <div class="form-group">
              <label>Work Experience (if any)</label>
              <textarea id="experience" placeholder="Describe your internships, freelance work, etc." style="height: 100px;">${userProfile.experience}</textarea>
            </div>
            <div class="form-group">
              <label>Key Projects (list them)</label>
              <textarea id="projectsList" placeholder="Project 1: Description\nProject 2: Description" style="height: 100px;"></textarea>
            </div>
          </div>

          <!-- Section 6: Certifications -->
          <div class="form-section">
            <h3>🏅 Certifications & Achievements</h3>
            <div class="form-group">
              <label>Certifications & Awards (list them)</label>
              <textarea id="certsList" placeholder="Certification 1 - Platform, Date\nAward 2 - Organization, Date" style="height: 100px;"></textarea>
            </div>
          </div>

          <button onclick="saveProfileData()" class="btn-save-profile">💾 Save My Complete Profile</button>
        </div>
      </div>
    `;

    // Render skills input
    renderSkillsInput();
  }

  /* INTERNSHIPS & PROJECTS */
  if (section === "internships") {
    title.innerText = "🚀 Matched Internships & Projects (Based on Your Profile)";

    // Filter and rank opportunities by skill match
    const rankedOpps = ALL_INTERNSHIPS.map(opp => ({
      ...opp,
      matchPercentage: calculateSkillMatch(opp.skills)
    })).filter(opp => opp.matchPercentage >= 30).sort((a, b) => b.matchPercentage - a.matchPercentage);

    content.innerHTML = `
      <div class="opportunities-section">
        <p style="color: #9CA3AF; margin-bottom: 20px;">Showing <strong>${rankedOpps.length}</strong> internships ranked by match with your profile</p>
        <div class="opportunities-grid">
          ${rankedOpps.map((opp, idx) => `
            <div class="opportunity-card">
              <div class="opp-header">
                <h3>${opp.title}</h3>
                <span class="match-badge">${opp.matchPercentage}% Match</span>
              </div>
              <p class="company">📍 ${opp.company} | ${opp.location}</p>
              <p class="desc">${opp.description}</p>
              <div class="details">
                <p>⏱️ ${opp.duration}</p>
                <p>💰 ${opp.stipend}</p>
              </div>
              <div class="skills-required">
                <p><strong>Required Skills:</strong></p>
                <div class="skill-tags">
                  ${opp.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
              </div>
              <button class="btn-apply" onclick="applyOpportunity(${opp.id}, '${opp.title}')">Apply Now →</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* RESUME BUILDER WITH ATS */
  if (section === "resume") {
    title.innerText = "📄 AI-Powered Resume Builder with ATS Tracking";

    content.innerHTML = `
      <div class="resume-builder-section">
        <div class="resume-grid">
          <!-- Resume Form -->
          <div class="resume-form-side">
            <h3>📝 Build Your Resume</h3>
            <form id="resumeForm" class="form-section">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" id="resName" value="${userProfile.fullName}" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email *</label>
                  <input type="email" id="resEmail" value="${userProfile.email}" required>
                </div>
                <div class="form-group">
                  <label>Phone *</label>
                  <input type="tel" id="resPhone" value="${userProfile.phone}" required>
                </div>
              </div>
              <div class="form-group">
                <label>LinkedIn/Portfolio</label>
                <input type="text" id="resLinkedin" value="${userProfile.linkedin}">
              </div>

              <hr style="border: none; border-top: 1px solid rgba(45,212,191,0.2); margin: 20px 0;">

              <h4>🎓 Education</h4>
              <div class="form-group">
                <label>Education Details *</label>
                <textarea id="resEducation" placeholder="B.Tech in CSE from XYZ University (2020-2024), GPA: 3.8/4.0" required>${userProfile.college} - ${userProfile.degree} in ${userProfile.branch}</textarea>
              </div>

              <h4>💼 Professional Experience</h4>
              <div class="form-group">
                <label>Work Experience</label>
                <textarea id="resExperience" placeholder="Intern at Company Name (May 2023 - Jul 2023): Led frontend redesign, improved performance by 40%">${userProfile.experience}</textarea>
              </div>

              <h4>🛠️ Technical Skills</h4>
              <div class="form-group">
                <label>Tech Skills (comma-separated) *</label>
                <textarea id="resSkills" placeholder="HTML5, CSS3, JavaScript, React, Node.js, MongoDB, Git, REST API">${Object.keys(userProfile.skills).join(", ")}</textarea>
              </div>

              <h4>📊 Projects</h4>
              <div class="form-group">
                <label>Key Projects</label>
                <textarea id="resProjects" placeholder="E-Commerce Platform: Built with MERN stack, 1000+ users, Hosted on Vercel, github.com/user/ecommerce">${userProfile.projects.map(p => p.name + ": " + p.description).join("\n")}</textarea>
              </div>

              <h4>🏆 Certifications & Achievements</h4>
              <div class="form-group">
                <label>Certs & Awards</label>
                <textarea id="resCerts" placeholder="React Certification - Coursera (2024), JavaScript Advanced - Udemy (2024)">${userProfile.certifications.map(c => c.name + " - " + c.issuer).join("\n")}</textarea>
              </div>

              <button type="button" onclick="generateResumePreview()" class="btn-generate">👁️ Preview & Score (ATS)</button>
            </form>
          </div>

          <!-- ATS Analyzer & Preview -->
          <div class="resume-preview-side">
            <div id="resumeOutput"></div>
          </div>
        </div>
      </div>
    `;
  }

  /* SKILL ANALYSIS */
  if (section === "skills") {
    title.innerText = "📊 Your Skill Analysis & Growth Plan";

    const avgSkill = Object.values(userProfile.skills).reduce((a, b) => a + b, 0) / Object.keys(userProfile.skills).length || 0;

    content.innerHTML = `
      <div class="skills-container">
        <div class="card">
          <h3>📈 Your Current Skills Profile</h3>
          <p style="color: #9CA3AF; margin-bottom: 20px;">Based on the ${Object.keys(userProfile.skills).length} skills you've provided</p>
          
          <div class="skills-overview">
            ${Object.entries(userProfile.skills).map(([skill, level]) => `
              <div class="skill-item">
                <div class="skill-header">
                  <span class="skill-name">${skill}</span>
                  <span class="skill-level">${level}/100</span>
                </div>
                <div class="skill-meter">
                  <div class="skill-fill" style="width: ${level}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 20px; padding: 16px; background: rgba(45,212,191,0.1); border-radius: 8px; border-left: 3px solid #22D3EE;">
            <p style="color: #22D3EE; font-weight: 700; margin-bottom: 8px;">📊 Your Profile Summary</p>
            <p style="color: #9CA3AF; margin: 4px 0;">Average Skill Level: <strong>${avgSkill.toFixed(1)}/100</strong></p>
            <p style="color: #9CA3AF; margin: 4px 0;">Skills Tracked: <strong>${Object.keys(userProfile.skills).length}</strong></p>
            <p style="color: #9CA3AF; margin: 4px 0;">Top Skill: <strong>${Object.entries(userProfile.skills).length ? `${Object.entries(userProfile.skills).sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))[0][0]} (${Object.entries(userProfile.skills).sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))[0][1]}/100)` : "Add skills in profile"}</strong></p>
          </div>
        </div>

        <div class="card">
          <h3>🎯 Skill Gaps & Growth Opportunities</h3>
          <p style="color: #9CA3AF; font-size: 13px; margin-bottom: 12px;">Skills to focus on for your career goals</p>
          <div id="gapAnalysis"></div>
        </div>

        <div class="card">
          <h3>🚀 Recommendations for You</h3>
          <div id="skillRecommendations"></div>
        </div>
      </div>
    `;

    generateSkillAnalysis();
  }

  /* CAREER ROADMAP */
  if (section === "roadmap") {
    title.innerText = "🛣️ Your Personalized Career Roadmap";

    const roadmapData = generateRoadmap();
    const { stages, coursePath } = roadmapData;
    const firstRoleTitle = (typeof ALL_ROLES !== 'undefined' && userProfile.interestedRoles && userProfile.interestedRoles[0])
      ? (ALL_ROLES.find(r => r.id === userProfile.interestedRoles[0])?.title || userProfile.interestedDomains?.[0]) : (userProfile.interestedDomains?.[0] || "Web Development");

    content.innerHTML = `
      <div class="roadmap-section">
        <div class="roadmap-intro">
          <h3>🎯 Your 12-Week Path to Industry-Ready</h3>
          <p>Domain: <strong>${firstRoleTitle}</strong> | Commitment: 8-10 hours/week | Goal: Internship-ready in 12 weeks</p>
          <p style="margin-top: 12px;"><a href="roadmap.html" style="color: #22D3EE;">View all ${typeof ALL_ROLES !== 'undefined' ? ALL_ROLES.length : 7} roles in Career Roadmap →</a></p>
        </div>

        <div class="roadmap-stages">
          ${stages.map((stage, idx) => `
            <div class="stage-card stage-${idx + 1}">
              <div class="stage-icon">${stage.icon}</div>
              <div class="stage-content">
                <h4>${stage.title} (Weeks ${stage.weeks})</h4>
                <p class="stage-duration">${stage.weeks.split('-')[1] - stage.weeks.split('-')[0] + 1} weeks | ${stage.hours} hours/week</p>
                <ul>
                  ${stage.topics.map(topic => `<li>✅ ${topic}</li>`).join('')}
                </ul>
                <div class="stage-metrics">
                  <span class="metric-tag">Goal: ${stage.goal} avg</span>
                  <span class="metric-tag">Total: ${(stage.hours * (stage.weeks.split('-')[1] - stage.weeks.split('-')[0] + 1))} hours</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="weekly-breakdown">
          <h3>📅 Recommended Weekly Schedule</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="background: rgba(34, 211, 238, 0.15);">
              <th style="padding: 10px; text-align: left; color: #22D3EE;">Week</th>
              <th style="padding: 10px; text-align: left; color: #22D3EE;">Focus Area</th>
              <th style="padding: 10px; color: #22D3EE;">Hours/Week</th>
              <th style="padding: 10px; text-align: left; color: #22D3EE;">Deliverable</th>
            </tr>
            ${coursePath.map(week => `
              <tr style="border: 1px solid rgba(34, 211, 238, 0.1);">
                <td style="padding: 10px; color: #9CA3AF;">${week.week}</td>
                <td style="padding: 10px; color: #9CA3AF;">${week.focus}</td>
                <td style="padding: 10px; color: #9CA3AF; text-align: center;">${week.hours}h</td>
                <td style="padding: 10px; color: #9CA3AF;">${week.deliverable}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>
    `;
  }

  /* OPPORTUNITIES HUB */
  if (section === "opportunities") {
    title.innerText = "💡 Complete Opportunities Hub";

    const allOpps = [...ALL_INTERNSHIPS, ...ALL_PROJECTS, ...ALL_EVENTS];
    const scored = allOpps.map(opp => ({
      ...opp,
      score: opp.skills ? calculateSkillMatch(opp.skills) : 50
    })).sort((a, b) => b.score - a.score);

    content.innerHTML = `
      <div class="opportunities-hub">
        <div class="hub-intro">
          <h3>🌟 All Opportunities Tailored to Your Profile</h3>
          <p>Showing <strong>${scored.length}</strong> matched opportunities</p>
        </div>

        <div class="opp-list">
          ${scored.slice(0, 15).map(opp => `
            <div class="list-item">
              <div class="item-header">
                <h4>${opp.title}</h4>
                <span class="item-badge">${opp.category}</span>
                ${opp.score ? `<span class="match-score">${opp.score}% Match</span>` : ''}
              </div>
              <p>${opp.description || 'Opportunity'}</p>
              <p style="font-size: 12px; color: #3B82F6;">📍 ${opp.company || opp.type}</p>
              <button class="btn-small" onclick="alert('Added to saved opportunities!')">Save</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// ===== HELPER FUNCTIONS =====
function renderSkillsInput() {
  const container = document.getElementById("skillsInput");
  container.innerHTML = Object.entries(userProfile.skills).map(([skill, level], idx) => `
    <div class="skill-input-item">
      <input type="text" value="${skill}" placeholder="Skill name" class="skill-name-input">
      <input type="number" min="0" max="100" value="${level}" placeholder="Level (0-100)" class="skill-level-input">
      <button type="button" onclick="removeSkill(${idx})" class="btn-remove">✕</button>
    </div>
  `).join('');
}

function addSkill() {
  userProfile.skills["New Skill"] = 0;
  renderSkillsInput();
}

function removeSkill(idx) {
  const skills = Object.entries(userProfile.skills);
  skills.splice(idx, 1);
  userProfile.skills = Object.fromEntries(skills);
  renderSkillsInput();
}

function saveProfileData() {
  // Collect form data
  userProfile.fullName = document.getElementById("fullName").value;
  userProfile.email = document.getElementById("email").value;
  userProfile.phone = document.getElementById("phone").value;
  userProfile.linkedin = document.getElementById("linkedin").value;
  userProfile.college = document.getElementById("college").value;
  userProfile.degree = document.getElementById("degree").value;
  userProfile.branch = document.getElementById("branch").value;
  userProfile.graduationYear = document.getElementById("graduationYear").value;
  userProfile.gpa = document.getElementById("gpa").value;
  userProfile.careerGoal = document.getElementById("careerGoal").value;
  userProfile.experience = document.getElementById("experience").value;

  // Collect interested role ids (same roles as Skill Analysis & Career Roadmap)
  const selectedRoles = [];
  document.querySelectorAll(".role-check:checked").forEach(checkbox => {
    selectedRoles.push(checkbox.value);
  });
  userProfile.interestedRoles = selectedRoles.length > 0 ? selectedRoles : (userProfile.interestedRoles || ["frontend"]);
  // Keep first role for legacy dashboard domain display
  userProfile.interestedDomains = selectedRoles.length > 0 && typeof ALL_ROLES !== 'undefined'
    ? [ALL_ROLES.find(r => r.id === selectedRoles[0])?.title || "Web Development"]
    : ["Web Development"];

  // Collect skills
  const newSkills = {};
  document.querySelectorAll(".skill-input-item").forEach(item => {
    const name = item.querySelector(".skill-name-input").value;
    const level = parseInt(item.querySelector(".skill-level-input").value) || 0;
    if (name) newSkills[name] = level;
  });
  userProfile.skills = newSkills;

  saveUserProfile();
  loadContent("dashboard");
}

function generateSkillAnalysis() {
  const { stages } = generateRoadmap();
  const gapDiv = document.getElementById("gapAnalysis");
  const recDiv = document.getElementById("skillRecommendations");

  // Gaps
  let gapHTML = "";
  const topSkills = Object.entries(userProfile.skills).sort((a, b) => b[1] - a[1]);
  topSkills.slice(0, 3).forEach(([skill, level]) => {
    const gapToClose = 85 - level;
    gapHTML += `
      <div style="margin: 12px 0; padding: 12px; background: rgba(45,212,191,0.1); border-radius: 4px; border-left: 3px solid ${gapToClose > 20 ? '#ff6b6b' : '#22D3EE'};">
        <p style="color: #9CA3AF; margin: 0;"><strong>${skill}</strong>: ${level}/100</p>
        <p style="color: #9CA3AF; font-size: 12px; margin: 4px 0;">Gap to close: ${gapToClose} points</p>
      </div>
    `;
  });
  gapDiv.innerHTML = gapHTML;

  // Recommendations
  recDiv.innerHTML = `
    <div style="padding: 16px; background: rgba(96,165,250,0.1); border-radius: 8px; border-left: 3px solid #3B82F6;">
      <p style="color: #3B82F6; font-weight: 700; margin-bottom: 12px;">🚀 Personalized Growth Plan:</p>
      <ul style="color: #9CA3AF; line-height: 1.8;">
        <li>✅ Focus on closing the 3 largest skill gaps</li>
        <li>✅ Build projects to demonstrate each skill</li>
        <li>✅ Practice mock interviews for your chosen domain</li>
        <li>✅ Network on LinkedIn with industry professionals</li>
        <li>✅ Apply to internships once you reach 75+ in 3 key skills</li>
      </ul>
    </div>
  `;
}

function generateResumePreview() {
  const name = document.getElementById("resName").value;
  const email = document.getElementById("resEmail").value;
  const phone = document.getElementById("resPhone").value;
  const linkedin = document.getElementById("resLinkedin").value;
  const education = document.getElementById("resEducation").value;
  const experience = document.getElementById("resExperience").value;
  const skills = document.getElementById("resSkills").value;
  const projects = document.getElementById("resProjects").value;
  const certs = document.getElementById("resCerts").value;

  // Calculate ATS score
  const atsScore = generateATSScore({ name, email, education, experience, skills, projects, certs });

  // Generate HTML preview
  const output = document.getElementById("resumeOutput");
  output.innerHTML = `
    <div class="ats-analyzer">
      <h3>🤖 ATS Analyzer</h3>
      <div class="ats-score-display">
        <div class="score-circle" style="background: conic-gradient(#22D3EE 0deg ${(atsScore / 100) * 360}deg, rgba(45,212,191,0.1) 0deg);">
          <div class="score-inner">${atsScore}%</div>
        </div>
        <div class="score-details">
          <p style="color: #22D3EE; font-weight: 700;">ATS Score</p>
          <p style="color: #9CA3AF;">${atsScore >= 75 ? "Excellent! Your resume will pass ATS" : atsScore >= 60 ? "Good! Some improvements needed" : "Needs work. Follow suggestions below"}</p>
        </div>
      </div>

      <div style="background: rgba(255,107,107,0.1); padding: 12px; border-radius: 8px; border-left: 3px solid #ff6b6b; margin: 12px 0;">
        <p style="color: #ff6b6b; font-weight: 700; margin: 0;">⚠️ Tips to Improve:</p>
        <ul style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0 0;">
          <li>✓ Use action verbs (Led, Developed, Built, Designed)</li>
          <li>✓ Add quantified achievements (improved by 40%, 1000+ users)</li>
          <li>✓ Include relevant keywords from job descriptions</li>
          <li>✓ Keep to 1 page for freshers</li>
          <li>✓ Use standard fonts and clear formatting</li>
        </ul>
      </div>
    </div>

    <div class="resume-preview" style="background: white; color: black; padding: 40px; border-radius: 10px; margin-top: 20px; box-shadow: 0 0 20px rgba(45,212,191,0.2);">
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #22D3EE; padding-bottom: 15px;">
        <h2 style="color: #22D3EE; margin: 0; font-size: 28px;">${name}</h2>
        <p style="color: #3B82F6; margin: 4px 0; font-size: 12px;">
          ${email} | ${phone} ${linkedin ? '| ' + linkedin : ''}
        </p>
      </div>

      <div style="margin-bottom: 15px;">
        <h4 style="color: #22D3EE; border-bottom: 1px solid #22D3EE; padding-bottom: 5px; margin-bottom: 8px;">EDUCATION</h4>
        <p style="margin: 0; color: #333;">${education}</p>
      </div>

      ${experience ? `
        <div style="margin-bottom: 15px;">
          <h4 style="color: #22D3EE; border-bottom: 1px solid #22D3EE; padding-bottom: 5px; margin-bottom: 8px;">EXPERIENCE</h4>
          <p style="margin: 0; color: #333; white-space: pre-wrap;">${experience}</p>
        </div>
      ` : ''}

      <div style="margin-bottom: 15px;">
        <h4 style="color: #22D3EE; border-bottom: 1px solid #22D3EE; padding-bottom: 5px; margin-bottom: 8px;">TECHNICAL SKILLS</h4>
        <p style="margin: 0; color: #333;">${skills}</p>
      </div>

      ${projects ? `
        <div style="margin-bottom: 15px;">
          <h4 style="color: #22D3EE; border-bottom: 1px solid #22D3EE; padding-bottom: 5px; margin-bottom: 8px;">PROJECTS</h4>
          <p style="margin: 0; color: #333; white-space: pre-wrap;">${projects}</p>
        </div>
      ` : ''}

      ${certs ? `
        <div>
          <h4 style="color: #22D3EE; border-bottom: 1px solid #22D3EE; padding-bottom: 5px; margin-bottom: 8px;">CERTIFICATIONS</h4>
          <p style="margin: 0; color: #333; white-space: pre-wrap;">${certs}</p>
        </div>
      ` : ''}

      <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #22D3EE; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%;">🖨️ Print Resume</button>
    </div>
  `;
}

function applyOpportunity(id, title) {
  if (!userProfile.appliedInternships.includes(id)) {
    userProfile.appliedInternships.push(id);
    saveUserProfile();
  }
  showNotification(`✅ Applied to "${title}"! Check email for updates.`);
}

function logout() {
  localStorage.removeItem('userProfile');
  window.location.href = 'login.html';
}

window.logout = logout;
window.loadContent = loadContent;

// Initialize
loadUserProfile();
window.onload = () => loadContent("dashboard", null);
