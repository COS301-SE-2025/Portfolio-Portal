//  server/services/template.service.js

/**
 * Template Selection Algorithm Service
 *
 * This service analyzes CV content & determines the most appropriate template
 * based on factors like skills, job titles, education, and interests.
 */

const CVData = require("../models/CVData");
const User = require("../models/User");

// template keywords with weights
const TEMPLATE_KEYWORDS = {
  space: {
    skills: [
      { keyword: "software development", weight: 3 },
      { keyword: "engineering", weight: 3 },
      { keyword: "programming", weight: 3 },
      { keyword: "coding", weight: 2 },
      { keyword: "software", weight: 2 },
      { keyword: "astronomy", weight: 5 },
      { keyword: "astrophysics", weight: 5 },
      { keyword: "mathematics", weight: 2 },
      { keyword: "technology", weight: 2 },
      { keyword: "ai", weight: 3 },
      { keyword: "machine learning", weight: 3 },
      { keyword: "data science", weight: 3 },
      { keyword: "cybersecurity", weight: 3 },
      { keyword: "ui/ux", weight: 2 },
      { keyword: "C++", weight: 3 },
      { keyword: "Java", weight: 3 },
      { keyword: "Python", weight: 3 },
      { keyword: "C++", weight: 3 },
      { keyword: "C#", weight: 2 },
      { keyword: "JavaScript", weight: 3 },
      { keyword: "PHP", weight: 3 },
      { keyword: "HTML", weight: 3 },
      { keyword: "CSS", weight: 3 },
      { keyword: "React.js", weight: 3 },
      { keyword: "Three.js", weight: 3 },
      { keyword: "GitHub", weight: 3 },
      { keyword: "Git", weight: 3 },
      { keyword: "OpenGL", weight: 3 },
      { keyword: "quantum", weight: 4 },
      { keyword: "robotics", weight: 3 },
      { keyword: "cloud computing", weight: 2 },
      { keyword: "VR", weight: 2 },
      { keyword: "AR", weight: 2 },
      { keyword: "physics", weight: 2 },
    ],
    jobTitles: [
      { keyword: "developer", weight: 3 },
      { keyword: "software developer", weight: 3 },
      { keyword: "engineer", weight: 3 },
      { keyword: "software engineer", weight: 3 },
      { keyword: "computer scientist", weight: 3 },
      { keyword: "artificial intelligence", weight: 3 },
      { keyword: "ai", weight: 3 },
      { keyword: "cybersecurity", weight: 3 },
      { keyword: "cyber security", weight: 3 },
      { keyword: "computer engineer", weight: 3 },
      { keyword: "programmer", weight: 3 },
      { keyword: "coder", weight: 3 },
      { keyword: "aerospace engineer", weight: 3 },
      { keyword: "astronomer", weight: 5 },
      { keyword: "astrologer", weight: 5 },
      { keyword: "physicist", weight: 4 },
      { keyword: "technologist", weight: 3 },
      { keyword: "scientist", weight: 1 },
    ],
    education: [
      { keyword: "computer science", weight: 3 },
      { keyword: "computer engineering", weight: 3 },
      { keyword: "engineering", weight: 3 },
      { keyword: "aerospace", weight: 4 },
      { keyword: "artificial intelligence", weight: 3 },
      { keyword: "robotics", weight: 3 },
      { keyword: "astronomy", weight: 5 },
      { keyword: "mathematics", weight: 3 },
      { keyword: "technology", weight: 2 },
      { keyword: "physics", weight: 1 },
    ],
  },

  //-------------------------------FOREST TEMPLATE:-------------------------------
  forest: {
    skills: [
      { keyword: "design", weight: 4 },
      { keyword: "art", weight: 4 },
      { keyword: "gardening", weight: 4 },
      { keyword: "creative", weight: 3 },
      { keyword: "photography", weight: 3 },
      { keyword: "illustration", weight: 3 },
      { keyword: "graphic", weight: 3 },
      { keyword: "animation", weight: 3 },
      { keyword: "writing", weight: 2 },
      { keyword: "environment", weight: 2 },
      { keyword: "sustainability", weight: 2 },
      { keyword: "biology", weight: 2 },
      { keyword: "ecology", weight: 2 },
    ],
    jobTitles: [
      { keyword: "climate activist", weight: 4 },
      { keyword: "environmental scientist", weight: 4 },
      { keyword: "conservationist", weight: 4 },
      { keyword: "designer", weight: 4 },
      { keyword: "artist", weight: 4 },
      { keyword: "florist", weight: 4 },
      { keyword: "botanist", weight: 4 },
      { keyword: "creative", weight: 3 },
      { keyword: "photographer", weight: 3 },
      { keyword: "illustrator", weight: 3 },
      { keyword: "writer", weight: 2 },
      { keyword: "ecologist", weight: 3 },
      { keyword: "biologist", weight: 3 },
    ],
    education: [
      { keyword: "environmental science", weight: 4 },
      { keyword: "ecology", weight: 3 },
      { keyword: "geography", weight: 2 },
      { keyword: "sustainable development", weight: 3 },
      { keyword: "design", weight: 4 },
      { keyword: "art", weight: 4 },
      { keyword: "fine arts", weight: 4 },
      { keyword: "photography", weight: 3 },
      { keyword: "biology", weight: 3 },
      { keyword: "botany", weight: 3 },
      { keyword: "environmental", weight: 3 },
      { keyword: "literature", weight: 2 },
    ],
  },
  //-------------------------------OFFICE TEMPLATE:-------------------------------
  office: {
    skills: [
      { keyword: "management", weight: 4 },
      { keyword: "business", weight: 4 },
      { keyword: "accounting", weight: 2 },
      { keyword: "finance", weight: 4 },
      { keyword: "marketing", weight: 3 },
      { keyword: "sales", weight: 3 },
      { keyword: "hr", weight: 3 },
      { keyword: "leadership", weight: 3 },
      { keyword: "strategy", weight: 3 },
      { keyword: "communication", weight: 2 },
      { keyword: "administration", weight: 2 },
      { keyword: "economics", weight: 2 },
      { keyword: "accounting", weight: 2 },
    ],
    jobTitles: [
      { keyword: "accountant", weight: 2 },
      { keyword: "hr manager", weight: 2 },
      { keyword: "manager", weight: 2 },
      { keyword: "director", weight: 2 },
      { keyword: "executive", weight: 4 },
      { keyword: "business", weight: 4 },
      { keyword: "finance", weight: 4 },
      { keyword: "marketing", weight: 3 },
      { keyword: "sales", weight: 2 },
      { keyword: "consultant", weight: 3 },
      { keyword: "analyst", weight: 2 },
    ],
    education: [
      { keyword: "business", weight: 4 },
      { keyword: "mba", weight: 4 },
      { keyword: "finance", weight: 4 },
      { keyword: "economics", weight: 4 },
      { keyword: "marketing", weight: 4 },
      { keyword: "management", weight: 2 },
      { keyword: "administration", weight: 3 },
      { keyword: "commerce", weight: 3 },
      { keyword: "entrepreneurship", weight: 3 },
      { keyword: "human resources", weight: 2 },
      { keyword: "corporate law", weight: 2 },
      { keyword: "law", weight: 2 },
    ],
  },
  //-------------------------------LAB TEMPLATE:-------------------------------
  lab: {
    skills: [
      { keyword: "chemistry", weight: 4 },
      { keyword: "biochemistry", weight: 4 },
      { keyword: "molecular biology", weight: 4 },
      { keyword: "bioinformatics", weight: 4 },
      { keyword: "pharmacology", weight: 4 },
      { keyword: "clinical research", weight: 4 },
      { keyword: "patient assessment", weight: 3 },
      { keyword: "genetics", weight: 3 },
      { keyword: "medicine", weight: 3 },
      { keyword: "medical", weight: 3 },
      { keyword: "electrocardiogram", weight: 3 },
      { keyword: "EKG", weight: 2 },
      { keyword: "administering injections", weight: 3 },
      { keyword: "HIPAA compliance training", weight: 3 },
      { keyword: "lab", weight: 3 },
    ],
    jobTitles: [
      { keyword: "medical assistant", weight: 8 },
      { keyword: "chemist", weight: 4 },
      { keyword: "biochemist", weight: 4 },
      { keyword: "pharmacologist", weight: 4 },
      { keyword: "lab technician", weight: 4 },
      { keyword: "scientist", weight: 4 },
      { keyword: "doctor", weight: 4 },
      { keyword: "nurse", weight: 4 },
      { keyword: "biomedical researcher", weight: 4 },
      { keyword: "geneticist", weight: 3 },
      { keyword: "research scientist", weight: 3 },
      { keyword: "lab assistant", weight: 2 },
      { keyword: "clinical researcher", weight: 3 },
      { keyword: "medical assistant", weight: 3 },
    ],
    education: [
      { keyword: "chemistry", weight: 4 },
      { keyword: "biochemistry", weight: 4 },
      { keyword: "medicine", weight: 4 },
      { keyword: "healthcare", weight: 4 },
      { keyword: "healthcare management", weight: 4 },
      { keyword: "healthcare informatics", weight: 3 },
      { keyword: "genetics", weight: 3 },
      { keyword: "molecular biology", weight: 3 },
      { keyword: "public health", weight: 2 },
    ],
  },

  // -------------------------------CAVE TEMPLATE:-------------------------------
  cave: {
    skills: [
      { keyword: "speleology", weight: 5 },
      { keyword: "hydrogeology", weight: 4 },
      { keyword: "geomorphology", weight: 4 },
      { keyword: "anthropology", weight: 4 },
      { keyword: "archaeological excavation", weight: 4 },
      { keyword: "mining", weight: 4 },
      { keyword: "geology", weight: 3 },
      { keyword: "history", weight: 3 },
      { keyword: "rockclimbing", weight: 3 },
      { keyword: "exploring", weight: 3 },
      { keyword: "excavation", weight: 3 },
      { keyword: "expedition", weight: 3 },
      { keyword: "hiking", weight: 2 },
    ],
    jobTitles: [
      { keyword: "speleologist", weight: 5 },
      { keyword: "hydrogeologist", weight: 4 },
      { keyword: "cave explorer", weight: 4 },
      { keyword: "geomorphologist", weight: 4 },
      { keyword: "mining engineer", weight: 4 },
      { keyword: "archaeologist", weight: 4 },
      { keyword: "paleontologist", weight: 4 },
      { keyword: "anthropologist", weight: 4 },
      { keyword: "cartographer", weight: 4 },
      { keyword: "mining", weight: 4 },
      { keyword: "cave diver", weight: 4 },
      { keyword: "tour guide", weight: 4 },
      { keyword: "mountain guide", weight: 4 },
      { keyword: "adventure tour guide", weight: 4 },
      { keyword: "expedition leader", weight: 3 },
      { keyword: "survival instructor", weight: 3 },
      { keyword: "geologist", weight: 3 },
    ],
    education: [
      { keyword: "speleology", weight: 5 },
      { keyword: "hydrogeology", weight: 4 },
      { keyword: "geomorphology", weight: 4 },
      { keyword: "mining engineering", weight: 4 },
      { keyword: "BEng mining engineering", weight: 4 },
      { keyword: "mining", weight: 4 },
      { keyword: "archaeology", weight: 4 },
      { keyword: "paleontology", weight: 4 },
      { keyword: "geology", weight: 3 },
      { keyword: "anthropology", weight: 4 },
    ],
  },
};

// default template if no clear winner
const DEFAULT_TEMPLATE = "space";

/**
 * calculate score for a given template based on CV data
 * @param {string} template - template name (space, forest, office, lab, cave)
 * @param {object} cvData - structured CV data
 * @returns {number} calculated score
 */
const calculateTemplateScore = (template, cvData) => {
  let score = 0;
  const templateKeywords = TEMPLATE_KEYWORDS[template];

  // score skills section
  if (cvData.skills && Array.isArray(cvData.skills)) {
    cvData.skills.forEach((skill) => {
      templateKeywords.skills.forEach(({ keyword, weight }) => {
        if (skill.toLowerCase().includes(keyword.toLowerCase())) {
          score += weight;
        }
      });
    });
  }

  // score job titles in experience
  if (cvData.experience && Array.isArray(cvData.experience)) {
    cvData.experience.forEach((exp) => {
      if (exp.position) {
        templateKeywords.jobTitles.forEach(({ keyword, weight }) => {
          if (exp.position.toLowerCase().includes(keyword.toLowerCase())) {
            score += weight;
          }
        });
      }
    });
  }

  // score education
  if (cvData.education && Array.isArray(cvData.education)) {
    cvData.education.forEach((edu) => {
      if (edu.degree) {
        templateKeywords.education.forEach(({ keyword, weight }) => {
          if (edu.degree.toLowerCase().includes(keyword.toLowerCase())) {
            score += weight;
          }
        });
      }
      if (edu.field) {
        templateKeywords.education.forEach(({ keyword, weight }) => {
          if (edu.field.toLowerCase().includes(keyword.toLowerCase())) {
            score += weight;
          }
        });
      }
    });
  }

  return score;
};

/**
 * select most appropriate template based on CV content
 * @param {object} cvData - structured CV data from OCR
 * @returns {string} selected template name (space, forest, office, lab, or cave)
 */
const selectTemplate = (cvData) => {
  if (!cvData) return DEFAULT_TEMPLATE;

  // calculate scores for each template
  const scores = {
    space: calculateTemplateScore("space", cvData),
    forest: calculateTemplateScore("forest", cvData),
    office: calculateTemplateScore("office", cvData),
    lab: calculateTemplateScore("lab", cvData),
    cave: calculateTemplateScore("cave", cvData),
  };

  console.log("Template Scores:", scores); // testing

  // find template with highest score
  let selectedTemplate = DEFAULT_TEMPLATE;
  let maxScore = 0;

  for (const [template, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      selectedTemplate = template;
    }
  }

  // if scores are close (within 5%), use default template
  const scoreValues = Object.values(scores);
  const scoreRange = Math.max(...scoreValues) - Math.min(...scoreValues);
  if (scoreRange < maxScore * 0.05) {
    return DEFAULT_TEMPLATE;
  }

  return selectedTemplate;
};

/**
 * Store the selected template in the user's database record
 * @param {string} authId - user's auth ID
 * @param {string} template - selected template name
 * @returns {Promise<boolean>} success status
 */
const storeTemplateForUser = async (authId, template) => {
  try {
    const result = await User.updateSelectedTemplate(authId, template);
    console.log(`Template '${template}' stored for user ${authId}`);
    return result;
  } catch (error) {
    console.error("Error storing template for user:", error);
    return false;
  }
};

/**
 * get template selection for a user and store it in database
 * @param {string} authId - user's auth ID
 * @returns {Promise<string>} selected template name
 */
const getTemplateForUser = async (authId) => {
  try {
    const cvData = await CVData.findByAuthId(authId);
    if (!cvData) return DEFAULT_TEMPLATE;

    const selectedTemplate = selectTemplate(cvData);
    
    // Store the selected template in the user's record
    await storeTemplateForUser(authId, selectedTemplate);
    
    return selectedTemplate;
  } catch (error) {
    console.error("Error getting template for user:", error);
    return DEFAULT_TEMPLATE;
  }
};

/**
 * Get stored template for user from database (without running selection algorithm)
 * @param {string} authId - user's auth ID
 * @returns {Promise<string>} stored template name or default
 */
const getStoredTemplateForUser = async (authId) => {
  try {
    const user = await User.findById(authId);
    return user?.selected_template || DEFAULT_TEMPLATE;
  } catch (error) {
    console.error("Error getting stored template for user:", error);
    return DEFAULT_TEMPLATE;
  }
};

/**
 * Re-run template selection and update stored template
 * @param {string} authId - user's auth ID
 * @returns {Promise<string>} newly selected template name
 */
const updateTemplateForUser = async (authId) => {
  try {
    const cvData = await CVData.findByAuthId(authId);
    if (!cvData) {
      await storeTemplateForUser(authId, DEFAULT_TEMPLATE);
      return DEFAULT_TEMPLATE;
    }

    const selectedTemplate = selectTemplate(cvData);
    await storeTemplateForUser(authId, selectedTemplate);
    
    console.log(`Template updated to '${selectedTemplate}' for user ${authId}`);
    return selectedTemplate;
  } catch (error) {
    console.error("Error updating template for user:", error);
    return DEFAULT_TEMPLATE;
  }
};

module.exports = {
  selectTemplate,
  getTemplateForUser,
  getStoredTemplateForUser,
  updateTemplateForUser,
  storeTemplateForUser,
  TEMPLATE_KEYWORDS,
  DEFAULT_TEMPLATE,
};