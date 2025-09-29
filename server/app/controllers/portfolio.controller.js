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

// Helper function to log memory usage
function logMemoryUsage(stage) {
  const used = process.memoryUsage();
  console.log(`${stage} - Memory Usage:`, {
    rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
    external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`
  });
}

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
  let tempDir = null;
  let zipPath = null;
  
  // Set a timeout for the entire operation
  const operationTimeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('Download operation timed out');
      res.status(408).json({
        success: false,
        message: 'Download operation timed out. Please try again.',
      });
    }
  }, 240000); // 4 minutes timeout
  
  try {
    console.log('Download portfolio request received:', req.body);
    logMemoryUsage('Download Start');
    const { userData, username, template = 'default' } = req.body;

    if (!userData) {
      console.log('No user data provided');
      return res.status(400).json({
        success: false,
        message: "User data is required",
      });
    }

    // Generate a unique filename
    const portfolioName = username ? `${username}Portfolio` : `Portfolio_${Date.now()}`;
    tempDir = path.join(__dirname, '../../temp', portfolioName);
    
    console.log('Portfolio name:', portfolioName);
    console.log('Temp directory:', tempDir);
    
    // Select template directory based on the template parameter
    const templateDir = getTemplateDirectory(template);
    
    console.log('Template directory:', templateDir);
    
    if (!templateDir) {
      console.log('Template not found:', template);
      return res.status(400).json({
        success: false,
        message: `Template '${template}' not found`,
      });
    }

    // Check if template directory exists
    try {
      await fs.access(templateDir);
      console.log('Template directory exists and is accessible');
    } catch (error) {
      console.error('Template directory does not exist or is not accessible:', templateDir);
      console.error('Error details:', error.message);
      return res.status(400).json({
        success: false,
        message: `Template directory not found: ${template}`,
        details: error.message,
      });
    }

    // Create temp directory
    console.log('Creating temp directory...');
    try {
      await fs.mkdir(tempDir, { recursive: true });
      console.log('Temp directory created successfully');
    } catch (error) {
      console.error('Error creating temp directory:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to create temporary directory",
        error: error.message,
      });
    }

    // Copy template files to temp directory with progress tracking
    console.log('Copying template files...');
    logMemoryUsage('Before File Copy');
    
    try {
      await copyDirectoryWithProgress(templateDir, tempDir);
      logMemoryUsage('After File Copy');
    } catch (copyError) {
      console.error('Error copying files with progress tracking, trying fallback method:', copyError);
      // Fallback to simple copy method
      await copyDirectory(templateDir, tempDir);
      logMemoryUsage('After Fallback File Copy');
    }

    // Force garbage collection after copying files
    if (global.gc) {
      global.gc();
      console.log('Garbage collection performed after file copy');
      logMemoryUsage('After Garbage Collection');
    }

    // Inject user data into the template
    console.log('Injecting user data...');
    await injectUserData(tempDir, userData);

    // Create zip file with streaming approach
    zipPath = path.join(__dirname, '../../temp', `${portfolioName}.zip`);
    console.log('Creating zip file:', zipPath);
    logMemoryUsage('Before Zip Creation');
    
    try {
      await createZipFileStreaming(tempDir, zipPath);
      logMemoryUsage('After Zip Creation');
    } catch (zipError) {
      console.error('Error creating zip with streaming, trying fallback method:', zipError);
      // Fallback to simple zip creation
      await createZipFile(tempDir, zipPath);
      logMemoryUsage('After Fallback Zip Creation');
    }

    // Force garbage collection after creating zip
    if (global.gc) {
      global.gc();
      console.log('Garbage collection performed after zip creation');
      logMemoryUsage('After Final Garbage Collection');
    }

    // Check if zip file was created successfully
    try {
      const stats = await fs.stat(zipPath);
      console.log('Zip file created successfully, size:', stats.size, 'bytes');
      
      if (stats.size === 0) {
        throw new Error('Generated zip file is empty');
      }
    } catch (error) {
      console.error('Error checking zip file:', error);
      throw new Error('Failed to create zip file');
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${portfolioName}.zip"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Length', (await fs.stat(zipPath)).size);

    // Send the zip file with streaming
    const fileStream = require('fs').createReadStream(zipPath);
    
    fileStream.on('error', (err) => {
      console.error('Error reading file stream:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error reading file",
          error: err.message,
        });
      }
    });

    fileStream.on('open', () => {
      console.log('File stream opened, starting download...');
    });

    fileStream.on('end', () => {
      console.log('File stream ended');
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log('Client disconnected during download');
      fileStream.destroy();
    });

    fileStream.pipe(res);

    // Clean up when the response is finished
    res.on('finish', async () => {
      clearTimeout(operationTimeout);
      try {
        if (tempDir) {
          await fs.rm(tempDir, { recursive: true, force: true });
          console.log('Cleaned up temp directory:', tempDir);
        }
        if (zipPath) {
          await fs.unlink(zipPath);
          console.log('Cleaned up zip file:', zipPath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temp files:', cleanupError);
      }
    });

    res.on('close', async () => {
      clearTimeout(operationTimeout);
      try {
        if (tempDir) {
          await fs.rm(tempDir, { recursive: true, force: true });
          console.log('Cleaned up temp directory on close:', tempDir);
        }
        if (zipPath) {
          await fs.unlink(zipPath);
          console.log('Cleaned up zip file on close:', zipPath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temp files on close:', cleanupError);
      }
    });

  } catch (error) {
    clearTimeout(operationTimeout);
    console.error("Error downloading portfolio:", error);
    
    // Clean up temp files on error
    try {
      if (tempDir) {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
      if (zipPath) {
        await fs.unlink(zipPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temp files after error:', cleanupError);
    }
    
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate portfolio download",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
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
    'labpro': path.join(templatesBaseDir, 'lab-portfolio')
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
      // Skip node_modules and other unnecessary directories
      if (entry.name === 'node_modules' || 
          entry.name === '.git' || 
          entry.name === 'dist' || 
          entry.name === 'build' ||
          entry.name === '.next' ||
          entry.name === 'coverage') {
        console.log(`Skipping directory: ${srcPath}`);
        continue;
      }
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
 * Helper function to copy directory with progress tracking and memory optimization
 */
async function copyDirectoryWithProgress(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  let fileCount = 0;
  let totalFiles = 0;
  
  // First pass: count total files for progress tracking
  const countFiles = async (dir) => {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        // Skip node_modules and other unnecessary directories
        if (item.name === 'node_modules' || 
            item.name === '.git' || 
            item.name === 'dist' || 
            item.name === 'build' ||
            item.name === '.next' ||
            item.name === 'coverage') {
          continue;
        }
        await countFiles(path.join(dir, item.name));
      } else {
        totalFiles++;
      }
    }
  };
  
  await countFiles(src);
  console.log(`Total files to copy: ${totalFiles}`);

  // Second pass: copy files with progress tracking
  const copyWithProgress = async (srcDir, destDir) => {
    const items = await fs.readdir(srcDir, { withFileTypes: true });
    
    for (const item of items) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);

      if (item.isDirectory()) {
        // Skip node_modules and other unnecessary directories
        if (item.name === 'node_modules' || 
            item.name === '.git' || 
            item.name === 'dist' || 
            item.name === 'build' ||
            item.name === '.next' ||
            item.name === 'coverage') {
          console.log(`Skipping directory: ${srcPath}`);
          continue;
        }
        
        await fs.mkdir(destPath, { recursive: true });
        await copyWithProgress(srcPath, destPath);
      } else {
        try {
          // Skip node_modules and other unnecessary directories
          if (item.name === 'node_modules' || 
              item.name === '.git' || 
              item.name === 'dist' || 
              item.name === 'build' ||
              item.name === '.next' ||
              item.name === 'coverage') {
            console.log(`Skipping directory: ${srcPath}`);
            continue;
          }
          
          // Check file size and skip very large files that might cause issues
          const stats = await fs.stat(srcPath);
          if (stats.size > 50 * 1024 * 1024) { // Skip files larger than 50MB
            console.warn(`Skipping large file: ${srcPath} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
            continue;
          }
          
          await fs.copyFile(srcPath, destPath);
          fileCount++;
          
          if (fileCount % 100 === 0) {
            console.log(`Copied ${fileCount}/${totalFiles} files...`);
          }
        } catch (error) {
          console.warn(`Skipping file ${srcPath}: ${error.message}`);
        }
      }
    }
  };
  
  await copyWithProgress(src, dest);
  console.log(`Copy completed: ${fileCount} files copied`);
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
    const archive = archiver('zip', { 
      zlib: { level: 6 }, // Reduced compression level for faster processing
      forceLocalTime: true,
      forceZip64: false
    });

    let hasError = false;

    output.on('close', () => {
      if (!hasError) {
        console.log(`Archive created: ${archive.pointer()} total bytes`);
        resolve();
      }
    });

    output.on('error', (err) => {
      hasError = true;
      console.error('Output stream error:', err);
      reject(err);
    });

    archive.on('error', (err) => {
      hasError = true;
      console.error('Archive error:', err);
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        hasError = true;
        reject(err);
      }
    });

    archive.pipe(output);
    
    // Add directory with error handling
    try {
      archive.directory(sourceDir, false);
      archive.finalize();
    } catch (err) {
      hasError = true;
      reject(err);
    }
  });
}

/**
 * Helper function to create zip file with streaming and better memory management
 */
async function createZipFileStreaming(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = require('fs').createWriteStream(outputPath);
    const archive = archiver('zip', { 
      zlib: { level: 1 }, // Minimal compression for faster processing
      forceLocalTime: true,
      forceZip64: false,
      highWaterMark: 1024 * 1024 // 1MB buffer
    });

    let hasError = false;
    let bytesProcessed = 0;

    output.on('close', () => {
      if (!hasError) {
        console.log(`Archive created: ${archive.pointer()} total bytes`);
        resolve();
      }
    });

    output.on('error', (err) => {
      hasError = true;
      console.error('Output stream error:', err);
      reject(err);
    });

    archive.on('error', (err) => {
      hasError = true;
      console.error('Archive error:', err);
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        hasError = true;
        reject(err);
      }
    });

    archive.on('progress', (progress) => {
      bytesProcessed = progress.entries.processed;
      if (bytesProcessed % 50 === 0) {
        console.log(`Archive progress: ${bytesProcessed} entries processed`);
      }
    });

    archive.pipe(output);
    
    // Add directory with error handling and progress tracking
    try {
      console.log('Starting archive creation...');
      archive.directory(sourceDir, false);
      archive.finalize();
    } catch (err) {
      hasError = true;
      reject(err);
    }
  });
}

/**
 * Health check for download endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.healthCheck = async (req, res) => {
  try {
    logMemoryUsage('Health Check');
    res.json({
      success: true,
      message: 'Download endpoint is healthy',
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
};

module.exports = exports;