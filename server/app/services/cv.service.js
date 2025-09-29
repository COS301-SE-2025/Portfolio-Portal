// server/app/services/cv.service.js
const CVData = require("../models/CVData"); // Assuming CVData is your Mongoose model or ORM class

const toArr = (v) => (Array.isArray(v) ? v : []);
const toObj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

/**
 * Normalize the OCR/sectionizer output to our DB model.
 * - Always provide correct shapes (objects/arrays).
 * - Pass through `references` as an array.
 */
function mapToDbModel(structured) {
  const pi = toObj(structured.personal_info);

  return {
    personal_info: pi,
    experience: toArr(structured.experience),
    education: toArr(structured.education),
    skills: toArr(structured.skills),
    certifications: toArr(structured.certifications),
    languages: toArr(structured.languages),
    projects: toArr(structured.projects),
    // keep accepting `references` from OCR, but map to cv_references for DB
    cv_references: toArr(structured.references),
  };
}

const saveCVData = async (authId, structuredCV) => {
  try {
    if (!authId) {
      throw new Error("User authentication ID is required");
    }
    if (
      !structuredCV ||
      typeof structuredCV !== "object" ||
      Object.keys(structuredCV).length === 0
    ) {
      throw new Error("Valid structured CV data is required");
    }

    // Instead of throwing for “missing required fields”, normalize them so DB insert is robust.
    const doc = mapToDbModel(structuredCV);

    // Deeper validation examples (add more as needed for your schema)
    if (doc.personal_info && typeof doc.personal_info !== "object") {
      throw new Error("Personal info must be an object");
    }
    if (doc.experience && !Array.isArray(doc.experience)) {
      throw new Error("Experience must be an array");
    }

    // Use upsert to create or update the CV data based on authId
    const savedData = await CVData.upsert(authId, doc);

    console.log(`CV data saved successfully for user: ${authId}`);
    return savedData;
  } catch (error) {
    console.error("SaveCVData service error:", error.message);
    throw error; // Re-throw to be caught by centralized error handler
  }
};

const getCVData = async (authId) => {
  try {
    if (!authId) {
      throw new Error("User authentication ID is required");
    }

    const cvData = await CVData.findByAuthId(authId);
    if (!cvData) {
      throw new Error("CV data not found for this user");
    }
    return cvData;
  } catch (error) {
    console.error("GetCVData service error:", error.message);
    throw error;
  }
};

const updateCVData = async (authId, updateData) => {
  try {
    if (!authId) {
      throw new Error("User authentication ID is required");
    }
    if (
      !updateData ||
      typeof updateData !== "object" ||
      Object.keys(updateData).length === 0
    ) {
      throw new Error("Valid update data is required");
    }

    // Optional: Add specific validation for fields within updateData if needed
    // For example, if updateData.skills exists, ensure it's an array.
    if (updateData.skills && !Array.isArray(updateData.skills)) {
      throw new Error("Skills must be an array in update data");
    }
    // Allow updates to references but ensure it is an array if provided
    if (updateData.references && !Array.isArray(updateData.references)) {
      throw new Error("References must be an array in update data");
    }
    // You might also want to ensure that 'auth_id' or 'id' cannot be updated via this route
    if (updateData.auth_id || updateData.id) {
      throw new Error("Auth ID cannot be updated directly");
    }

    // Map client key `references` → DB key `cv_references` for updates too
    const mapped = { ...updateData };
    if (Object.prototype.hasOwnProperty.call(mapped, "references")) {
      mapped.cv_references = Array.isArray(mapped.references)
        ? mapped.references
        : [];
      delete mapped.references;
    }

    const updatedData = await CVData.updateByAuthId(authId, mapped);
    if (!updatedData) {
      throw new Error("Failed to update CV data or CV data not found");
    }
    return updatedData;
  } catch (error) {
    console.error("UpdateCVData service error:", error.message);
    throw error;
  }
};

const deleteCVData = async (authId) => {
  try {
    if (!authId) {
      throw new Error("User authentication ID is required");
    }

    const success = await CVData.deleteByAuthId(authId);
    if (!success) {
      throw new Error("Failed to delete CV data or CV data not found");
    }
    return success;
  } catch (error) {
    console.error("DeleteCVData service error:", error.message);
    throw error;
  }
};

module.exports = {
  saveCVData,
  getCVData,
  updateCVData,
  deleteCVData,
};
