// server/app/models/CVData.js
const supabase = require('../config/supabase');

class CVData {
  /**
   * Create or update CV data for a user
   * @param {string} authId - User's auth ID
   * @param {Object} cvData - Structured CV data
   * @returns {Object} Created/updated CV data
   */
  static async upsert(authId, cvData) {
    try {
      const { data, error } = await supabase
        .from('cv_data')
        .upsert({
          auth_id: authId,
          personal_info: cvData.personal_info || {},
          summary: cvData.summary || null,
          experience: cvData.experience || [],
          education: cvData.education || [],
          skills: cvData.skills || [],
          certifications: cvData.certifications || [],
          languages: cvData.languages || [],
          projects: cvData.projects || []
        }, {
          onConflict: 'auth_id'
        })
        .select()
        .single();

      if (error) {
        console.error('CVData upsert error:', error);
        throw new Error(`Failed to save CV data: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('CVData upsert error:', error.message);
      throw error;
    }
  }

  /**
   * Find CV data by user's auth ID
   * @param {string} authId - User's auth ID
   * @returns {Object|null} CV data or null if not found
   */
  static async findByAuthId(authId) {
    try {
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('CVData findByAuthId error:', error);
        throw new Error(`Failed to fetch CV data: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('CVData findByAuthId error:', error.message);
      throw error;
    }
  }

  /**
   * Delete CV data by user's auth ID
   * @param {string} authId - User's auth ID
   * @returns {boolean} Success status
   */
  static async deleteByAuthId(authId) {
    try {
      const { error } = await supabase
        .from('cv_data')
        .delete()
        .eq('auth_id', authId);

      if (error) {
        console.error('CVData deleteByAuthId error:', error);
        throw new Error(`Failed to delete CV data: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('CVData deleteByAuthId error:', error.message);
      throw error;
    }
  }

  /**
   * Update specific fields of CV data
   * @param {string} authId - User's auth ID
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated CV data
   */
  static async updateByAuthId(authId, updateData) {
    try {
      const { data, error } = await supabase
        .from('cv_data')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', authId)
        .select()
        .single();

      if (error) {
        console.error('CVData updateByAuthId error:', error);
        throw new Error(`Failed to update CV data: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('CVData updateByAuthId error:', error.message);
      throw error;
    }
  }
}

module.exports = CVData;