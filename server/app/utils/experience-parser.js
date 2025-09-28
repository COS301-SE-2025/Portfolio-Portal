// Experience and Education Section Parsers
// These functions parse flat arrays of text into structured objects

const DATE_PATTERNS = [
  // Full date ranges: "Aug 2023 - Mar 2024", "2022-2024", "May 2022 - May 2024"
  /^([A-Za-z]{3,9}\s+\d{4})\s*[-–—]\s*([A-Za-z]{3,9}\s+\d{4}|present|current)$/i,
  /^(\d{4})\s*[-–—]\s*(\d{4}|present|current)$/i,
  // Single dates: "Aug 2023", "2024", "present"
  /^([A-Za-z]{3,9}\s+\d{4}|present|current)$/i,
  /^(\d{4}|present|current)$/i,
  // Date with company: "PDBY Media Aug 2023 - Mar 2024"
  /^(.+?)\s+([A-Za-z]{3,9}\s+\d{4})\s*[-–—]\s*([A-Za-z]{3,9}\s+\d{4}|present|current)$/i,
  /^(.+?)\s+(\d{4})\s*[-–—]\s*(\d{4}|present|current)$/i,
];

const COMPANY_PATTERNS = [
  // Common company indicators
  /^(university|college|school|institute|academy|corporation|corp|inc|ltd|llc|pvt|media|consulting|group|company|co\.?)$/i,
  // Location indicators
  /^(south africa|usa|uk|canada|australia|europe|africa)$/i,
];

function isDateLine(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  return DATE_PATTERNS.some(pattern => pattern.test(trimmed));
}

function isCompanyLine(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  // Skip if it's clearly a date
  if (isDateLine(trimmed)) return false;
  
  // Skip if it's clearly a job title (starts with common job title words)
  const jobTitleStarters = /^(multimedia|academic|private|qualified|advanced|open|level|first|aid|scuba|diver|tutor|counsellor|volunteer|editor|journalist)/i;
  if (jobTitleStarters.test(trimmed)) return false;
  
  // Skip if it's clearly a description (long text, starts with lowercase, contains punctuation)
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  // Check for company patterns
  return COMPANY_PATTERNS.some(pattern => pattern.test(trimmed)) || 
         // Or if it looks like a proper noun (starts with capital, reasonable length)
         (/^[A-Z]/.test(trimmed) && trimmed.length > 3 && trimmed.length < 50);
}

function isJobTitle(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  // Skip if it's clearly a date or company
  if (isDateLine(trimmed) || isCompanyLine(trimmed)) return false;
  
  // Skip if it's clearly a description
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  // Common job title patterns
  const jobTitlePatterns = [
    /^(multimedia|academic|private|qualified|advanced|open|level|first|aid|scuba|diver|tutor|counsellor|volunteer|editor|journalist)/i,
    /(engineer|developer|manager|director|analyst|consultant|specialist|coordinator|assistant|executive|officer|representative)$/i,
    /(professor|teacher|instructor|lecturer|researcher|scientist)$/i,
  ];
  
  return jobTitlePatterns.some(pattern => pattern.test(trimmed)) ||
         // Or if it's a short capitalized phrase that could be a title
         (/^[A-Z]/.test(trimmed) && trimmed.length < 50 && !/[.!?]/.test(trimmed));
}

function isDescriptionLine(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  // Skip if it's clearly a date, company, or job title
  if (isDateLine(trimmed) || isCompanyLine(trimmed) || isJobTitle(trimmed)) return false;
  
  // Description characteristics: longer text, starts with lowercase, contains punctuation
  return trimmed.length > 30 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed);
}

function parseExperienceSection(experienceLines) {
  if (!Array.isArray(experienceLines) || experienceLines.length === 0) {
    return [];
  }

  const experiences = [];
  let currentExperience = null;
  let descriptionLines = [];

  for (let i = 0; i < experienceLines.length; i++) {
    const line = experienceLines[i].trim();
    if (!line) continue;

    // Check if this line starts a new experience entry
    if (isJobTitle(line)) {
      // Save previous experience if exists
      if (currentExperience) {
        currentExperience.description = descriptionLines.join(' ').trim();
        experiences.push(currentExperience);
      }
      
      // Start new experience
      currentExperience = {
        title: line,
        company: '',
        dateRange: '',
        description: ''
      };
      descriptionLines = [];
      
      // Look ahead for company and date
      let j = i + 1;
      while (j < experienceLines.length && j < i + 4) {
        const nextLine = experienceLines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        
        // Check if this line contains both company and date
        if (isDateLine(nextLine) && !currentExperience.dateRange) {
          // If it's a date line, check if it also contains company info
          const dateMatch = nextLine.match(/^(.+?)\s+(.+)$/);
          if (dateMatch && !currentExperience.company) {
            const potentialCompany = dateMatch[1].trim();
            const datePart = dateMatch[2].trim();
            if (isCompanyLine(potentialCompany)) {
              currentExperience.company = potentialCompany;
              currentExperience.dateRange = datePart;
            } else {
              currentExperience.dateRange = nextLine;
            }
          } else {
            currentExperience.dateRange = nextLine;
          }
        } else if (isCompanyLine(nextLine) && !currentExperience.company) {
          currentExperience.company = nextLine;
        } else if (isDescriptionLine(nextLine)) {
          // If we hit a description, stop looking ahead
          break;
        }
        j++;
      }
      
    } else if (currentExperience) {
      // We're in the middle of an experience entry
      if (isCompanyLine(line) && !currentExperience.company) {
        currentExperience.company = line;
      } else if (isDateLine(line) && !currentExperience.dateRange) {
        currentExperience.dateRange = line;
      } else if (isDescriptionLine(line)) {
        descriptionLines.push(line);
      }
    }
  }

  // Save the last experience
  if (currentExperience) {
    currentExperience.description = descriptionLines.join(' ').trim();
    experiences.push(currentExperience);
  }

  return experiences;
}

function parseEducationSection(educationLines) {
  if (!Array.isArray(educationLines) || educationLines.length === 0) {
    return [];
  }

  const educations = [];
  let currentEducation = null;
  let descriptionLines = [];

  for (let i = 0; i < educationLines.length; i++) {
    const line = educationLines[i].trim();
    if (!line) continue;

    // Check if this line starts a new education entry
    if (isEducationTitle(line)) {
      // Save previous education if exists
      if (currentEducation) {
        currentEducation.description = descriptionLines.join(' ').trim();
        educations.push(currentEducation);
      }
      
      // Start new education
      currentEducation = {
        degree: line,
        institution: '',
        dateRange: '',
        description: ''
      };
      descriptionLines = [];
      
      // Look ahead for institution and date
      let j = i + 1;
      while (j < educationLines.length && j < i + 4) {
        const nextLine = educationLines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        
        if (isInstitutionLine(nextLine) && !currentEducation.institution) {
          currentEducation.institution = nextLine;
        } else if (isDateLine(nextLine) && !currentEducation.dateRange) {
          currentEducation.dateRange = nextLine;
        } else if (isDescriptionLine(nextLine)) {
          // If we hit a description, stop looking ahead
          break;
        }
        j++;
      }
      
    } else if (currentEducation) {
      // We're in the middle of an education entry
      if (isInstitutionLine(line) && !currentEducation.institution) {
        currentEducation.institution = line;
      } else if (isDateLine(line) && !currentEducation.dateRange) {
        currentEducation.dateRange = line;
      } else if (isDescriptionLine(line)) {
        descriptionLines.push(line);
      }
    }
  }

  // Save the last education
  if (currentEducation) {
    currentEducation.description = descriptionLines.join(' ').trim();
    educations.push(currentEducation);
  }

  return educations;
}

function isEducationTitle(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  // Skip if it's clearly a date
  if (isDateLine(trimmed)) return false;
  
  // Skip if it's clearly a description
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  // Education title patterns
  const educationPatterns = [
    /^(bachelor|master|phd|doctorate|diploma|certificate|degree|qualification)/i,
    /^(undergraduate|graduate|postgraduate|associate|foundation)/i,
    /^(matric|high school|secondary|primary|elementary)/i,
    /^(psychology|anthropology|engineering|computer science|business|medicine|law)/i,
    /^(ba|bsc|ma|msc|mba|phd|md|jd|llb|beng|meng)/i,
  ];
  
  return educationPatterns.some(pattern => pattern.test(trimmed)) ||
         // Or if it's a short capitalized phrase that could be a degree
         (/^[A-Z]/.test(trimmed) && trimmed.length < 50 && !/[.!?]/.test(trimmed));
}

function isInstitutionLine(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  // Skip if it's clearly a date
  if (isDateLine(trimmed)) return false;
  
  // Skip if it's clearly a description
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  // Institution patterns
  const institutionPatterns = [
    /^(university|college|school|institute|academy|high school|secondary school|primary school)/i,
    /^(of|the|and|&)/i, // Common words in institution names
  ];
  
  return institutionPatterns.some(pattern => pattern.test(trimmed)) ||
         // Or if it looks like a proper noun (starts with capital, reasonable length)
         (/^[A-Z]/.test(trimmed) && trimmed.length > 3 && trimmed.length < 50);
}

// Format long descriptions into readable paragraphs
function formatDescription(description) {
  if (!description || typeof description !== 'string') return '';
  
  // Clean up the text
  let cleaned = description
    .replace(/\|/g, 'I') // Replace | with I (common OCR error)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Split into sentences
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Group sentences into paragraphs (3-4 sentences per paragraph)
  const paragraphs = [];
  let currentParagraph = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    currentParagraph.push(sentence);
    
    // Create paragraph every 3-4 sentences or at natural breaks
    if (currentParagraph.length >= 3 || 
        (currentParagraph.length >= 2 && i === sentences.length - 1) ||
        sentence.toLowerCase().includes('throughout') ||
        sentence.toLowerCase().includes('additionally') ||
        sentence.toLowerCase().includes('furthermore') ||
        sentence.toLowerCase().includes('moreover')) {
      paragraphs.push(currentParagraph.join('. ') + '.');
      currentParagraph = [];
    }
  }
  
  // Add any remaining sentences
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join('. ') + '.');
  }
  
  return paragraphs.join('\n\n');
}

// Parse skills section into categories
function parseSkillsSection(skillsLines) {
  if (!Array.isArray(skillsLines) || skillsLines.length === 0) {
    return { technical: [], soft: [], languages: [], tools: [] };
  }

  const categories = {
    technical: [],
    soft: [],
    languages: [],
    tools: []
  };

  const technicalKeywords = [
    'programming', 'coding', 'development', 'software', 'web', 'mobile', 'database',
    'algorithm', 'data structure', 'machine learning', 'ai', 'artificial intelligence',
    'cybersecurity', 'networking', 'cloud', 'devops', 'frontend', 'backend',
    'javascript', 'python', 'java', 'c++', 'c#', 'react', 'angular', 'vue',
    'node', 'express', 'django', 'flask', 'spring', 'sql', 'mongodb', 'mysql',
    'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'
  ];

  const softKeywords = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'creative', 'adaptable', 'organized', 'time management', 'project management',
    'mentoring', 'tutoring', 'teaching', 'presentation', 'collaboration'
  ];

  const languageKeywords = [
    'english', 'afrikaans', 'spanish', 'french', 'german', 'chinese', 'japanese',
    'arabic', 'portuguese', 'italian', 'russian', 'fluent', 'native', 'bilingual'
  ];

  const toolKeywords = [
    'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins',
    'jira', 'confluence', 'slack', 'figma', 'photoshop', 'illustrator',
    'visual studio', 'intellij', 'eclipse', 'postman', 'swagger'
  ];

  for (const line of skillsLines) {
    if (!line || typeof line !== 'string') continue;
    
    const cleanLine = line.trim().toLowerCase();
    if (!cleanLine) continue;

    // Check for technical skills
    if (technicalKeywords.some(keyword => cleanLine.includes(keyword))) {
      categories.technical.push(line.trim());
    }
    // Check for soft skills
    else if (softKeywords.some(keyword => cleanLine.includes(keyword))) {
      categories.soft.push(line.trim());
    }
    // Check for languages
    else if (languageKeywords.some(keyword => cleanLine.includes(keyword))) {
      categories.languages.push(line.trim());
    }
    // Check for tools
    else if (toolKeywords.some(keyword => cleanLine.includes(keyword))) {
      categories.tools.push(line.trim());
    }
    // Default to technical if it looks like a skill
    else if (cleanLine.length < 50 && !cleanLine.includes(' ') && /^[A-Za-z0-9\-\+\.]+$/.test(cleanLine)) {
      categories.technical.push(line.trim());
    }
    // Otherwise add to soft skills
    else {
      categories.soft.push(line.trim());
    }
  }

  // Remove duplicates
  Object.keys(categories).forEach(key => {
    categories[key] = [...new Set(categories[key])];
  });

  return categories;
}

// Parse certifications section
function parseCertificationsSection(certLines) {
  if (!Array.isArray(certLines) || certLines.length === 0) {
    return [];
  }

  const certifications = [];
  let currentCert = null;
  let descriptionLines = [];

  for (let i = 0; i < certLines.length; i++) {
    const line = certLines[i].trim();
    if (!line) continue;

    // Check if this line starts a new certification
    if (isCertificationTitle(line)) {
      // Save previous certification if exists
      if (currentCert) {
        currentCert.description = descriptionLines.join(' ').trim();
        certifications.push(currentCert);
      }
      
      // Start new certification
      currentCert = {
        title: line,
        issuer: '',
        dateIssued: '',
        dateExpires: '',
        description: ''
      };
      descriptionLines = [];
      
      // Look ahead for issuer and dates
      let j = i + 1;
      while (j < certLines.length && j < i + 4) {
        const nextLine = certLines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        
        if (isIssuerLine(nextLine) && !currentCert.issuer) {
          currentCert.issuer = nextLine;
        } else if (isDateLine(nextLine)) {
          if (!currentCert.dateIssued) {
            currentCert.dateIssued = nextLine;
          } else if (!currentCert.dateExpires) {
            currentCert.dateExpires = nextLine;
          }
        } else if (isDescriptionLine(nextLine)) {
          break;
        }
        j++;
      }
      
    } else if (currentCert) {
      // We're in the middle of a certification entry
      if (isIssuerLine(line) && !currentCert.issuer) {
        currentCert.issuer = line;
      } else if (isDateLine(line)) {
        if (!currentCert.dateIssued) {
          currentCert.dateIssued = line;
        } else if (!currentCert.dateExpires) {
          currentCert.dateExpires = line;
        }
      } else if (isDescriptionLine(line)) {
        descriptionLines.push(line);
      }
    }
  }

  // Save the last certification
  if (currentCert) {
    currentCert.description = descriptionLines.join(' ').trim();
    certifications.push(currentCert);
  }

  return certifications;
}

// Parse projects section
function parseProjectsSection(projectLines) {
  if (!Array.isArray(projectLines) || projectLines.length === 0) {
    return [];
  }

  const projects = [];
  let currentProject = null;
  let descriptionLines = [];

  for (let i = 0; i < projectLines.length; i++) {
    const line = projectLines[i].trim();
    if (!line) continue;

    // Check if this line starts a new project
    if (isProjectTitle(line)) {
      // Save previous project if exists
      if (currentProject) {
        currentProject.description = descriptionLines.join(' ').trim();
        projects.push(currentProject);
      }
      
      // Start new project
      currentProject = {
        title: line,
        technologies: [],
        dateRange: '',
        description: '',
        url: ''
      };
      descriptionLines = [];
      
      // Look ahead for technologies and dates
      let j = i + 1;
      while (j < projectLines.length && j < i + 4) {
        const nextLine = projectLines[j].trim();
        if (!nextLine) {
          j++;
          continue;
        }
        
        if (isDateLine(nextLine) && !currentProject.dateRange) {
          currentProject.dateRange = nextLine;
        } else if (isURL(nextLine) && !currentProject.url) {
          currentProject.url = nextLine;
        } else if (isDescriptionLine(nextLine)) {
          break;
        }
        j++;
      }
      
    } else if (currentProject) {
      // We're in the middle of a project entry
      if (isDateLine(line) && !currentProject.dateRange) {
        currentProject.dateRange = line;
      } else if (isURL(line) && !currentProject.url) {
        currentProject.url = line;
      } else if (isDescriptionLine(line)) {
        descriptionLines.push(line);
      } else if (isTechnology(line)) {
        currentProject.technologies.push(line);
      }
    }
  }

  // Save the last project
  if (currentProject) {
    currentProject.description = descriptionLines.join(' ').trim();
    projects.push(currentProject);
  }

  return projects;
}

// Helper functions for new parsers
function isCertificationTitle(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  if (isDateLine(trimmed)) return false;
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  const certPatterns = [
    /^(certified|certification|certificate|qualified|advanced|professional|expert)/i,
    /^(level|grade|degree|diploma|license)/i,
    /^(first aid|scuba|diving|safety|security|network|cloud|aws|azure)/i
  ];
  
  return certPatterns.some(pattern => pattern.test(trimmed)) ||
         (/^[A-Z]/.test(trimmed) && trimmed.length < 50 && !/[.!?]/.test(trimmed));
}

function isIssuerLine(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  if (isDateLine(trimmed)) return false;
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  const issuerPatterns = [
    /^(issued|expires|valid|certified by)/i,
    /^(naui|red cross|american heart|microsoft|google|amazon|cisco)/i
  ];
  
  return issuerPatterns.some(pattern => pattern.test(trimmed)) ||
         (/^[A-Z]/.test(trimmed) && trimmed.length > 3 && trimmed.length < 50);
}

function isProjectTitle(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  if (isDateLine(trimmed) || isURL(trimmed)) return false;
  if (trimmed.length > 50 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  const projectPatterns = [
    /^(project|application|website|app|system|platform|tool|dashboard)/i,
    /^(web|mobile|desktop|game|ai|ml|data|analytics)/i
  ];
  
  return projectPatterns.some(pattern => pattern.test(trimmed)) ||
         (/^[A-Z]/.test(trimmed) && trimmed.length < 50 && !/[.!?]/.test(trimmed));
}

function isURL(line) {
  if (!line || typeof line !== 'string') return false;
  return /^https?:\/\//.test(line.trim()) || /^www\./.test(line.trim());
}

function isTechnology(line) {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  
  if (trimmed.length > 30 || /^[a-z]/.test(trimmed) || /[.!?]/.test(trimmed)) return false;
  
  const techPatterns = [
    /^(react|angular|vue|node|express|django|flask|spring|laravel)/i,
    /^(javascript|python|java|c\+\+|c#|php|ruby|go|rust|swift)/i,
    /^(html|css|typescript|sql|mongodb|mysql|postgresql|redis)/i,
    /^(aws|azure|gcp|docker|kubernetes|jenkins|git|github)/i
  ];
  
  return techPatterns.some(pattern => pattern.test(trimmed)) ||
         (/^[A-Za-z0-9\-\+\.]+$/.test(trimmed) && trimmed.length < 20);
}

module.exports = {
  parseExperienceSection,
  parseEducationSection,
  parseSkillsSection,
  parseCertificationsSection,
  parseProjectsSection,
  formatDescription,
  isDateLine,
  isCompanyLine,
  isJobTitle,
  isEducationTitle,
  isInstitutionLine,
  isDescriptionLine
};
