// server/controllers/portfolio.controller.js

/**
 * Portfolio Controller
 *
 * Handles portfolio generation operations, including template selection based on CV content
 */

const templateService = require("../services/template.service");
const Portfolio = require("../models/Portfolio");
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');

/**
 * Analyzes CV data and selects an appropriate template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.selectTemplate = async (req, res) => {
  try {
    const { cvData, authId } = req.body;

    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: "CV data is required",
      });
    }

    // Use the template selection algorithm
    const selectedTemplate = templateService.selectTemplate(cvData);
    console.log(`Template selected: ${selectedTemplate}`);

    // If authId is provided, store the template in the user's record
    if (authId) {
      try {
        console.log(`Storing template ${selectedTemplate} for user ${authId}`);
        const storeResult = await templateService.storeTemplateForUser(authId, selectedTemplate);
        console.log(`Template storage result: ${storeResult}`);
      } catch (storeError) {
        console.error("Error storing template:", storeError);
        // Don't fail the entire request if storage fails
      }
    }

    // Return the selected template info and customization options
    return res.status(200).json({
      success: true,
      data: {
        selectedTemplate,
        template: selectedTemplate, // for backward compatibility
      },
    });
  } catch (error) {
    console.error("Error in template selection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to select template",
      error: error.message,
    });
  }
};

/**
 * Get template for a specific user (runs algorithm and stores result)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTemplateForUser = async (req, res) => {
  try {
    const { authId } = req.params;

    if (!authId) {
      return res.status(400).json({
        success: false,
        message: "User auth ID is required",
      });
    }

    // This will run the algorithm and store the result
    const selectedTemplate = await templateService.getTemplateForUser(authId);
    
    return res.status(200).json({
      success: true,
      data: {
        selectedTemplate,
        authId
      },
    });
  } catch (error) {
    console.error("Error getting template for user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get template for user",
      error: error.message,
    });
  }
};

/**
 * Get stored template for user (without running algorithm)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStoredTemplate = async (req, res) => {
  try {
    const { authId } = req.params;

    if (!authId) {
      return res.status(400).json({
        success: false,
        message: "User auth ID is required",
      });
    }

    const storedTemplate = await templateService.getStoredTemplateForUser(authId);
    
    return res.status(200).json({
      success: true,
      data: {
        selectedTemplate: storedTemplate,
        authId
      },
    });
  } catch (error) {
    console.error("Error getting stored template:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get stored template",
      error: error.message,
    });
  }
};

/**
 * Update template for user (re-run algorithm and update stored result)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTemplateForUser = async (req, res) => {
  try {
    const { authId } = req.params;

    if (!authId) {
      return res.status(400).json({
        success: false,
        message: "User auth ID is required",
      });
    }

    const updatedTemplate = await templateService.updateTemplateForUser(authId);
    
    return res.status(200).json({
      success: true,
      data: {
        selectedTemplate: updatedTemplate,
        authId
      },
    });
  } catch (error) {
    console.error("Error updating template for user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update template for user",
      error: error.message,
    });
  }
};

/**
 * Generates a complete portfolio based on CV data and selected template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generatePortfolio = async (req, res) => {
  try {
    const { cvData, templateId, customOptions } = req.body;

    if (!cvData || !templateId) {
      return res.status(400).json({
        success: false,
        message: "CV data and template ID are required",
      });
    }

    // In a real implementation, this would generate the complete portfolio
    // For demo 1, we can return a simplified structure

    // Create a new portfolio record (if using persistence)
    const portfolio = new Portfolio({
      template: templateId,
      customizations: customOptions,
      createdAt: new Date(),
    });

    // Save portfolio to database (if implemented)
    // await portfolio.save();

    // Generate the portfolio content (simplified for demo 1)
    const portfolioData = {
      template: templateId,
      customizations: customOptions || {},
      sections: generatePortfolioSections(cvData, templateId),
    };

    return res.status(200).json({
      success: true,
      data: portfolioData,
    });
  } catch (error) {
    console.error("Error generating portfolio:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate portfolio",
      error: error.message,
    });
  }
};

/**
 * Helper function to generate portfolio sections from CV data
 * @param {Object} cvData - The extracted CV data
 * @param {String} templateId - The selected template ID
 * @returns {Object} Portfolio sections
 */
const generatePortfolioSections = (cvData, templateId) => {
  // Extract relevant information from CV data
  const {
    name,
    title,
    summary,
    skills = [],
    experience = [],
    education = [],
    projects = [],
  } = cvData;

  // Generate sections based on available CV data
  return {
    header: {
      name: name || "Portfolio User",
      title: title || "Professional",
      summary: summary || "",
    },
    skills: skills.map((skill) => ({ name: skill })),
    experience: experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      duration: `${exp.startDate} - ${exp.endDate || "Present"}`,
      description: exp.description,
    })),
    education: education.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      duration: `${edu.startDate} - ${edu.endDate || "Present"}`,
      details: edu.fieldOfStudy,
    })),
    projects: projects.map((project) => ({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
    })),
  };
};

/**
 * Downloads a portfolio as a React application zip file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.downloadPortfolio = async (req, res) => {
  try {
    const { userData, username, template = 'default' } = req.body;

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User data is required",
      });
    }

    // Generate a unique filename
    const portfolioName = username ? `${username}Portfolio` : `Portfolio_${Date.now()}`;
    const tempDir = path.join(__dirname, '../../temp', portfolioName);
    
    // Select template directory based on the template parameter
    const templateDir = getTemplateDirectory(template);
    
    if (!templateDir) {
      return res.status(400).json({
        success: false,
        message: `Template '${template}' not found`,
      });
    }

    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    // Copy template files to temp directory
    await copyDirectory(templateDir, tempDir);

    // Inject user data into the template
    await injectUserData(tempDir, userData);

    // Create zip file
    const zipPath = path.join(__dirname, '../../temp', `${portfolioName}.zip`);
    await createZipFile(tempDir, zipPath);

    // Send the zip file
    res.download(zipPath, `${portfolioName}.zip`, async (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      
      // Clean up temp files
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        await fs.unlink(zipPath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp files:', cleanupError);
      }
    });

  } catch (error) {
    console.error("Error downloading portfolio:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate portfolio download",
      error: error.message,
    });
  }
};

/**
 * Helper function to get template directory based on template name
 * @param {String} template - The template name
 * @returns {String|null} Template directory path or null if not found
 */
function getTemplateDirectory(template) {
  const templatesBaseDir = path.join(__dirname, '../../templates');
  
  const templateMap = {
    'default': path.join(templatesBaseDir, 'react-portfolio'),
    'space': path.join(templatesBaseDir, 'space-portfolio'),
    'office': path.join(templatesBaseDir, 'office-portfolio'),
    'forest': path.join(templatesBaseDir, 'forest-portfolio'),
    'cave': path.join(templatesBaseDir, 'cave-portfolio'),
    'lab': path.join(templatesBaseDir, 'lab-portfolio')
  };

  return templateMap[template] || templateMap['default'];
}

/**
 * Helper function to copy directory recursively
 */
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      try {
        await fs.copyFile(srcPath, destPath);
      } catch (error) {
        // Skip files that can't be copied (like sockets, pipes, etc.)
        console.warn(`Skipping file ${srcPath}: ${error.message}`);
      }
    }
  }
}

/**
 * Helper function to inject user data into template files
 */
async function injectUserData(tempDir, userData) {
  // Update package.json with user's name
  const packageJsonPath = path.join(tempDir, 'package.json');
  let packageJson = await fs.readFile(packageJsonPath, 'utf8');
  packageJson = packageJson.replace('"portfolio-website"', `"${userData.name ? userData.name.toLowerCase().replace(/\s+/g, '-') : 'portfolio'}-website"`);
  await fs.writeFile(packageJsonPath, packageJson);

  // Update index.html with user's name
  const indexHtmlPath = path.join(tempDir, 'public/index.html');
  let indexHtml = await fs.readFile(indexHtmlPath, 'utf8');
  indexHtml = indexHtml.replace('{{USER_NAME}}', userData.name || 'Portfolio User');
  await fs.writeFile(indexHtmlPath, indexHtml);

  // Update README.md with user's name
  const readmePath = path.join(tempDir, 'README.md');
  let readme = await fs.readFile(readmePath, 'utf8');
  readme = readme.replace(/{{USER_NAME}}/g, userData.name || 'Portfolio User');
  await fs.writeFile(readmePath, readme);

  // Update portfolioData.js with user's data
  const portfolioDataPath = path.join(tempDir, 'src/data/portfolioData.js');
  let portfolioDataContent = await fs.readFile(portfolioDataPath, 'utf8');
  
  // Replace placeholders with actual data
  portfolioDataContent = portfolioDataContent
    .replace('{{USER_NAME}}', userData.name || 'Portfolio User')
    .replace('{{USER_TITLE}}', userData.title || 'Professional')
    .replace('{{USER_SUMMARY}}', userData.summary || '')
    .replace('{{USER_SKILLS}}', JSON.stringify(userData.skills || []))
    .replace('{{USER_EXPERIENCE}}', JSON.stringify(userData.experience || []))
    .replace('{{USER_EDUCATION}}', JSON.stringify(userData.education || []))
    .replace('{{USER_PROJECTS}}', JSON.stringify(userData.projects || []))
    .replace('{{USER_EMAIL}}', userData.contact?.email || '')
    .replace('{{USER_PHONE}}', userData.contact?.phone || '')
    .replace('{{USER_LINKEDIN}}', userData.contact?.linkedin || '')
    .replace('{{USER_GITHUB}}', userData.contact?.github || '');

  await fs.writeFile(portfolioDataPath, portfolioDataContent);
}

/**
 * Helper function to create zip file
 */
async function createZipFile(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = require('fs').createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Archive created: ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

module.exports = exports;