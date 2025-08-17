//  server/services/template.service.js

/**
 * Template Selection Algorithm Service
 *
 * This service analyzes CV content & determines the most appropriate template
 * based on factors like skills, job titles, education, and interests.
 */

const CVData = require("../models/CVData");

// template keywords with weights
const TEMPLATE_KEYWORDS = {
  space: {
    skills: [
      { keyword: "software development", weight: 3 },
      { keyword: "engineering", weight: 3 },
      { keyword: "programming", weight: 3 },
      { keyword: "codimg", weight: 2 },
      { keyword: "software", weight: 2 },
      { keyword: "astronomy", weight: 5 },
      { keyword: "astrophysics", weight: 5 },
      { keyword: "physics", weight: 3 },
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
      { keyword: "JavaScrpt", weight: 3 },
      { keyword: "PHP", weight: 3 },
      { keyword: "HTML", weight: 3 },
      { keyword: "CSS", weight: 3 },
      { keyword: "React.js", weight: 3 },
      { keyword: "Three.js", weight: 3 },
      { keyword: "GitHub", weight: 3 },
      { keyword: "Git", weight: 3 },
      { keyword: "OpenGL", weight: 3 },

      { keyword: "quantum", weight: 4 },
    ],
    jobTitles: [
      { keyword: "developer", weight: 3 },
      { keyword: "software developer", weight: 3 },
      { keyword: "engineer", weight: 3 },
      { keyword: "software engineer", weight: 3 },
      { keyword: "computer scientist", weight: 3 },
      { keyword: "computer engineer", weight: 3 },
      { keyword: "programmer", weight: 3 },
      { keyword: "coder", weight: 3 },
      { keyword: "scientist", weight: 4 },
      { keyword: "researcher", weight: 3 },
      { keyword: "analyst", weight: 2 },
      { keyword: "astronomer", weight: 5 },
      { keyword: "astrologer", weight: 5 },
      { keyword: "physicist", weight: 4 },
      { keyword: "technologist", weight: 3 },
    ],
    education: [
      { keyword: "computer science", weight: 3 },
      { keyword: "computer engineering", weight: 3 },
      { keyword: "engineering", weight: 3 },
      { keyword: "physics", weight: 4 },
      { keyword: "astronomy", weight: 5 },
      { keyword: "mathematics", weight: 3 },
      { keyword: "technology", weight: 2 },
    ],
  },
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
      { keyword: "designer", weight: 4 },
      { keyword: "artist", weight: 4 },
      { keyword: "florist", weight: 4 },
      { keyword: "creative", weight: 3 },
      { keyword: "photographer", weight: 3 },
      { keyword: "illustrator", weight: 3 },
      { keyword: "writer", weight: 2 },
      { keyword: "ecologist", weight: 3 },
      { keyword: "biologist", weight: 3 },
    ],
    education: [
      { keyword: "design", weight: 4 },
      { keyword: "art", weight: 4 },
      { keyword: "fine arts", weight: 4 },
      { keyword: "photography", weight: 3 },
      { keyword: "biology", weight: 3 },
      { keyword: "environmental", weight: 3 },
      { keyword: "literature", weight: 2 },
    ],
  },
  office: {
    skills: [
      { keyword: "management", weight: 4 },
      { keyword: "business", weight: 4 },
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
    ],
  },
};

// default template if no clear winner
const DEFAULT_TEMPLATE = "space";

/**
 * calculate score for a given template based on CV data
 * @param {string} template - template name (space, forest, office)
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
 * @returns {string} selected template name (space, forest, or office)
 */
const selectTemplate = (cvData) => {
  if (!cvData) return DEFAULT_TEMPLATE;

  // calculate scores for each template
  const scores = {
    space: calculateTemplateScore("space", cvData),
    forest: calculateTemplateScore("forest", cvData),
    office: calculateTemplateScore("office", cvData),
  };

  // find template with highest score
  let selectedTemplate = DEFAULT_TEMPLATE;
  let maxScore = 0;

  for (const [template, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      selectedTemplate = template;
    }
  }

  // if scores are close (within 10%), use default template
  const scoreValues = Object.values(scores);
  const scoreRange = Math.max(...scoreValues) - Math.min(...scoreValues);
  if (scoreRange < maxScore * 0.1) {
    return DEFAULT_TEMPLATE;
  }

  return selectedTemplate;
};

/**
 * get template selection for a user
 * @param {string} authId - user's auth ID
 * @returns {Promise<string>} selected template name
 */
const getTemplateForUser = async (authId) => {
  try {
    const cvData = await CVData.findByAuthId(authId);
    if (!cvData) return DEFAULT_TEMPLATE;

    return selectTemplate(cvData);
  } catch (error) {
    console.error("Error getting template for user:", error);
    return DEFAULT_TEMPLATE;
  }
};

module.exports = {
  selectTemplate,
  getTemplateForUser,
  TEMPLATE_KEYWORDS,
  DEFAULT_TEMPLATE,
};
