// server/services/template.service.js

/**
 * Template Selection Algorithm Service
 *
 * This service analyzes CV content and determines the most appropriate template
 * based on factors like industry, experience level, skills, and interests.
 */

const templateCriteria = {
  // Office template is suitable for corporate, business, finance professionals
  office: {
    keywords: [
      "management",
      "business",
      "finance",
      "accounting",
      "marketing",
      "sales",
      "administration",
      "executive",
      "director",
      "analyst",
      "consultant",
      "project manager",
      "human resources",
      "hr",
    ],
    industries: [
      "finance",
      "banking",
      "consulting",
      "insurance",
      "real estate",
      "law",
      "business",
      "corporate",
      "management",
    ],
  },

  // Space template is suitable for tech, innovation, forward-thinking professionals
  space: {
    keywords: [
      "developer",
      "engineer",
      "software",
      "technology",
      "IT",
      "technical",
      "innovation",
      "programming",
      "research",
      "science",
      "data science",
      "artificial intelligence",
      "machine learning",
      "AI",
      "ML",
      "cloud",
      "DevOps",
      "full-stack",
      "frontend",
      "backend",
      "web development",
    ],
    industries: [
      "technology",
      "software",
      "IT",
      "telecommunications",
      "aerospace",
      "research",
      "science",
      "engineering",
      "gaming",
      "startups",
    ],
  },

  // Forest template is suitable for creative, nature-focused, sustainability professionals
  forest: {
    keywords: [
      "designer",
      "creative",
      "artist",
      "content creator",
      "writer",
      "environment",
      "sustainability",
      "biology",
      "ecology",
      "conservation",
      "natural",
      "organic",
      "photography",
      "teaching",
      "education",
    ],
    industries: [
      "design",
      "art",
      "education",
      "environment",
      "non-profit",
      "sustainability",
      "healthcare",
      "pharmacy",
      "agriculture",
      "food",
      "hospitality",
    ],
  },
};

/**
 * Analyzes CV content and selects the most appropriate template
 * @param {Object} cvData - The extracted and processed CV data
 * @returns {Object} Selected template and customization options
 */
const selectTemplate = (cvData) => {
  try {
    // Extract relevant information from CV data
    const {
      skills = [],
      experience = [],
      education = [],
      summary = "",
    } = cvData;

    // Concatenate all text for keyword analysis
    const allText = [
      summary,
      ...experience.map(
        (exp) => `${exp.title} ${exp.company} ${exp.description}`
      ),
      ...education.map(
        (edu) => `${edu.degree} ${edu.institution} ${edu.fieldOfStudy}`
      ),
      ...skills,
    ]
      .join(" ")
      .toLowerCase();

    // Initialize scores for each template
    const scores = {
      office: 0,
      space: 0,
      forest: 0,
    };

    // Calculate scores based on keyword matches
    Object.entries(templateCriteria).forEach(([template, criteria]) => {
      // Check for industry keywords
      criteria.industries.forEach((industry) => {
        if (allText.includes(industry.toLowerCase())) {
          scores[template] += 2; // Industry matches are weighted higher
        }
      });

      // Check for skill/role keywords
      criteria.keywords.forEach((keyword) => {
        if (allText.includes(keyword.toLowerCase())) {
          scores[template] += 1;
        }
      });
    });

    // Determine the template with the highest score
    let selectedTemplate = "office"; // Default template
    let highestScore = scores.office;

    if (scores.space > highestScore) {
      selectedTemplate = "space";
      highestScore = scores.space;
    }

    if (scores.forest > highestScore) {
      selectedTemplate = "forest";
      highestScore = scores.forest;
    }

    // Generate customization suggestions based on CV content
    const customizations = generateCustomizationOptions(
      cvData,
      selectedTemplate
    );

    console.log(
      `Selected template: ${selectedTemplate} with score: ${highestScore}`
    );

    return {
      template: selectedTemplate,
      score: highestScore,
      confidence: calculateConfidence(highestScore, scores),
      customizations,
    };
  } catch (error) {
    console.error("Error selecting template:", error);
    return {
      template: "office", // Fallback to office template
      score: 0,
      confidence: 0,
      customizations: {},
      error: error.message,
    };
  }
};

/**
 * Calculate confidence score (how strong the template match is)
 * @param {Number} highestScore - Score of the selected template
 * @param {Object} scores - All template scores
 * @returns {Number} Confidence score (0-1)
 */
const calculateConfidence = (highestScore, scores) => {
  const totalScore = Object.values(scores).reduce(
    (sum, score) => sum + score,
    0
  );
  return totalScore > 0 ? highestScore / totalScore : 0;
};

/**
 * Generate customization options based on CV content and selected template
 * @param {Object} cvData - The extracted CV data
 * @param {String} template - The selected template
 * @returns {Object} Customization options
 */
const generateCustomizationOptions = (cvData, template) => {
  const { name, title, experience = [], skills = [] } = cvData;

  // Extract relevant information for customization
  const experienceYears = calculateExperienceYears(experience);
  const topSkills = skills.slice(0, 5); // Get top 5 skills

  // Basic customization options for all templates
  const customizations = {
    name: name || "Portfolio User",
    title: title || "Professional",
    color: determineColorScheme(cvData, template),
    focusArea: determineFocusArea(cvData),
  };

  // Template-specific customizations
  switch (template) {
    case "office":
      customizations.deskItems = suggestDeskItems(cvData);
      customizations.windowView = suggestWindowView(cvData);
      break;

    case "space":
      customizations.spaceObjects = suggestSpaceObjects(cvData);
      customizations.technology = suggestTechnology(cvData);
      break;

    case "forest":
      customizations.natureElements = suggestNatureElements(cvData);
      customizations.timeOfDay = suggestTimeOfDay(cvData);
      break;
  }

  return customizations;
};

/**
 * Calculate total years of professional experience
 * @param {Array} experience - Array of experience objects
 * @returns {Number} Total years of experience
 */
const calculateExperienceYears = (experience) => {
  let totalMonths = 0;

  experience.forEach((job) => {
    if (job.startDate && job.endDate) {
      // Simple calculation (can be improved for more accuracy)
      const start = new Date(job.startDate);
      const end =
        job.endDate === "Present" ? new Date() : new Date(job.endDate);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += months;
    }
  });

  return Math.round(totalMonths / 12);
};

/**
 * Determine color scheme based on CV content and template
 * @param {Object} cvData - The extracted CV data
 * @param {String} template - The selected template
 * @returns {String} Color scheme suggestion
 */
const determineColorScheme = (cvData, template) => {
  // Simple color scheme selection based on template
  // In a real implementation, this would analyze CV data more thoroughly
  const colorSchemes = {
    office: ["professional", "modern", "elegant"],
    space: ["futuristic", "tech", "innovative"],
    forest: ["natural", "organic", "earthy"],
  };

  return colorSchemes[template][0]; // Default to first option
};

/**
 * Determine the main focus area based on CV content
 * @param {Object} cvData - The extracted CV data
 * @returns {String} Focus area
 */
const determineFocusArea = (cvData) => {
  // Simple implementation - would be enhanced with more analysis
  return "skills"; // Default focus area
};

// Helper functions for specific template customizations
const suggestDeskItems = (cvData) => ["laptop", "notebook", "plant"];
const suggestWindowView = (cvData) => "cityscape";
const suggestSpaceObjects = (cvData) => ["planets", "satellites", "stars"];
const suggestTechnology = (cvData) => "hologram";
const suggestNatureElements = (cvData) => ["trees", "river", "mountains"];
const suggestTimeOfDay = (cvData) => "morning";

module.exports = {
  selectTemplate,
  templateCriteria,
};
