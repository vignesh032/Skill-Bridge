/**
 * Shared roles config: used in Profile, Skill Analysis, and Career Roadmap.
 * Keep roles and required skills in sync across the app.
 */
const ALL_ROLES = [
  { id: 'frontend', title: 'Frontend Developer', path: 'Design → Build → Deploy', outcome: 'Frontend Intern / UI Engineer', requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design'] },
  { id: 'backend', title: 'Backend Developer', path: 'APIs → Databases → Scale', outcome: 'Backend Engineer', requiredSkills: ['Node.js', 'Python', 'Java', 'SQL', 'REST API', 'Git'] },
  { id: 'fullstack', title: 'Full-Stack Developer', path: 'Frontend + Backend → Deploy', outcome: 'Full-Stack Engineer', requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'Git'] },
  { id: 'data', title: 'Data Analyst', path: 'Analyze → Visualize → Decide', outcome: 'Data Analyst', requiredSkills: ['Excel', 'SQL', 'Python', 'Statistics', 'Tableau', 'Power BI'] },
  { id: 'datascientist', title: 'Data Scientist', path: 'Data → Models → Insights', outcome: 'Data Scientist', requiredSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'TensorFlow', 'Pandas'] },
  { id: 'mobile', title: 'Mobile App Developer', path: 'Build → Integrate → Publish', outcome: 'Mobile App Developer', requiredSkills: ['React Native', 'Kotlin', 'Flutter', 'Firebase', 'REST API'] },
  { id: 'software', title: 'Software Engineer', path: 'Industry Projects → Teams → Delivery', outcome: 'Software Engineer', requiredSkills: ['Data Structures', 'Algorithms', 'OOP', 'SQL', 'Git', 'System Design'] },
  { id: 'ai', title: 'AI/ML Engineer', path: 'Mathematics → Algorithms → Models → Deployment', outcome: 'Machine Learning Engineer', requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'NLP', 'Statistics'] },
  { id: 'cyber', title: 'Cybersecurity Analyst', path: 'Networking → Security → Tools → Ethical Hacking', outcome: 'Security Analyst', requiredSkills: ['Networking', 'Linux', 'Security', 'Cryptography', 'Ethical Hacking'] },
  { id: 'devops', title: 'DevOps Engineer', path: 'Development → Automation → Cloud → Monitoring', outcome: 'DevOps Specialist', requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Git'] },
  { id: 'blockchain', title: 'Blockchain Developer', path: 'Smart Contracts → Web3 → DApps', outcome: 'Blockchain Developer', requiredSkills: ['JavaScript', 'Solidity', 'Web3', 'Smart Contracts'] },
  { id: 'uiux', title: 'UI/UX Designer', path: 'Research → Design → Prototype', outcome: 'UI/UX Designer', requiredSkills: ['Figma', 'UI Design', 'Adobe XD', 'User Research', 'Wireframing'] },
  { id: 'qa', title: 'QA Engineer', path: 'Test → Automate → Quality', outcome: 'QA Engineer', requiredSkills: ['Test Automation', 'Selenium', 'Manual Testing', 'API Testing'] }
];

/**
 * Normalize skill name for matching (user might type "HTML/CSS" or "html").
 */
function normalizeSkillName(s) {
  if (!s || typeof s !== 'string') return '';
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Find user's level for a required skill (flexible match).
 */
function getUserLevelForSkill(userSkills, requiredSkillName) {
  if (!userSkills || typeof userSkills !== 'object') return 0;
  const req = normalizeSkillName(requiredSkillName);
  for (const [userSkill, level] of Object.entries(userSkills)) {
    const u = normalizeSkillName(userSkill);
    if (u === req || u.includes(req) || req.includes(u)) return Math.min(100, Math.max(0, Number(level) || 0));
  }
  return 0;
}

/**
 * Compute skill gap for a role: for each required skill, (targetLevel - userLevel).
 * Returns array of { skill, userLevel, targetLevel, gap }.
 */
function getSkillGapForRole(role, userSkills, targetLevel = 80) {
  if (!role || !role.requiredSkills) return [];
  return role.requiredSkills.map(skill => {
    const userLevel = getUserLevelForSkill(userSkills, skill);
    const gap = Math.max(0, targetLevel - userLevel);
    return { skill, userLevel, targetLevel, gap };
  });
}

/**
 * Overall match % for a role based on user skills (average of (userLevel/target) per required skill).
 */
function getRoleMatchPercent(role, userSkills, targetLevel = 80) {
  const gaps = getSkillGapForRole(role, userSkills, targetLevel);
  if (gaps.length === 0) return 0;
  const sum = gaps.reduce((acc, g) => acc + (g.userLevel / targetLevel) * 100, 0);
  return Math.round(sum / gaps.length);
}
