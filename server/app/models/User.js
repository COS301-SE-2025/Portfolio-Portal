// models/User.js
const { createClient } = require('@supabase/supabase-js');
const supabase = require('../config/supabase');

class User {
  static async create(email, password, name) {
    try {
      // Sign up user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        console.error('Supabase signUp error:', error.message);
        throw new Error(error.message);
      }

      // Insert into users table with all available fields
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({ 
          auth_id: data.user.id, 
          name, 
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (userError) {
        console.error('User insert error:', userError.message);
        throw new Error(userError.message);
      }

      return { 
        id: data.user.id, 
        email, 
        name, 
        token: data.session?.access_token,
        user_profile: user
      };
    } catch (error) {
      console.error('User.create error:', error.message);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        console.error('FindById error:', error.message);
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('User.findById error:', error.message);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        console.error('FindByEmail error:', error.message);
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('User.findByEmail error:', error.message);
      throw error;
    }
  }

  static async updateProfile(authId, updateData) {
    try {
      // Validate and sanitize update data
      const allowedFields = [
        'name', 'bio', 'cv_url', 'profile_picture_url', 
        'about_paragraphs', 'certifications', 'skills', 
        'linkedin', 'github'
      ];
      
      const sanitizedData = {};
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          sanitizedData[key] = updateData[key];
        }
      });

      // Add updated timestamp
      sanitizedData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('users')
        .update(sanitizedData)
        .eq('auth_id', authId)
        .select()
        .single();

      if (error) {
        console.error('UpdateProfile error:', error.message);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('User.updateProfile error:', error.message);
      throw error;
    }
  }

  static async uploadProfilePicture(authId, fileBuffer, fileName, contentType, token) {
    try {
      // Create authenticated client
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
        {
          global: {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        }
      );

      const fileExt = fileName.split('.').pop();
      const filePath = `${authId}/profile.${fileExt}`; // Consistent filename

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update user profile
      await this.updateProfile(authId, { 
        profile_picture_url: publicUrl 
      });

      return publicUrl;
    } catch (error) {
      console.error('Upload error details:', {
        error: error.message,
        authId,
        fileName
      });
      throw error;
    }
  }

  static async deleteProfilePicture(authId) {
    try {
      // Get current user to find existing profile picture
      const user = await this.findById(authId);
      if (user && user.profile_picture_url) {
        // Extract filename from URL
        const urlParts = user.profile_picture_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${authId}/${fileName}`;

        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([filePath]);

        if (deleteError) {
          console.warn('Profile picture deletion warning:', deleteError.message);
        }
      }

      // Remove URL from database
      await this.updateProfile(authId, { profile_picture_url: null });
      return true;
    } catch (error) {
      console.error('User.deleteProfilePicture error:', error.message);
      throw error;
    }
  }

  static async searchUsers(query, limit = 10, offset = 0) {
    try {
      const searchTerm = `%${query}%`;
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, bio, profile_picture_url, skills')
        .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(limit)
        .offset(offset)
        .order('name');

      if (error) {
        console.error('SearchUsers error:', error.message);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('User.searchUsers error:', error.message);
      throw error;
    }
  }

  static async getUsersBySkills(skills, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, bio, profile_picture_url, skills')
        .overlaps('skills', skills)
        .limit(limit)
        .order('name');

      if (error) {
        console.error('GetUsersBySkills error:', error.message);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('User.getUsersBySkills error:', error.message);
      throw error;
    }
  }
}

module.exports = User;