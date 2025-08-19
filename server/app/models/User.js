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
      'linkedin', 'github', 'profile_picture_path',
      'selected_template'
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
      const supabaseAuth = createClient(
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

      // Delete existing profile picture first
      await this.deleteProfilePicture(authId);

      const fileExt = fileName.split('.').pop();
      const filePath = `${authId}/profile.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabaseAuth.storage
        .from('profile-pictures')
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Generate signed URL (1 hour expiration)
      const { data: signedUrlData, error: signedUrlError } = await supabaseAuth.storage
        .from('profile-pictures')
        .createSignedUrl(filePath, 3600);

      if (signedUrlError) throw signedUrlError;
      const signedUrl = signedUrlData.signedUrl;

      // Update user profile with path and URL
      await this.updateProfile(authId, { 
        profile_picture_url: signedUrl,
        profile_picture_path: filePath
      });

      return signedUrl;
    } catch (error) {
      console.error('UploadProfilePicture error:', {
        message: error.message,
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
      if (user && user.profile_picture_path) {
        // Delete from storage using path
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([user.profile_picture_path]);

        if (deleteError) {
          console.warn('Profile picture deletion warning:', deleteError.message);
        }
      }

      // Remove URL and path from database
      await this.updateProfile(authId, { 
        profile_picture_url: null,
        profile_picture_path: null 
      });
      return true;
    } catch (error) {
      console.error('User.deleteProfilePicture error:', error.message);
      throw error;
    }
  }

static async updateSelectedTemplate(authId, template) {
  try {
    console.log(`User.updateSelectedTemplate called with authId: ${authId}, template: ${template}`);
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        selected_template: template,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', authId)
      .select()
      .single();

    if (error) {
      console.error('UpdateSelectedTemplate Supabase error:', error);
      throw new Error(error.message);
    }

    console.log('UpdateSelectedTemplate success, updated user:', data);
    return data ? true : false;
  } catch (error) {
    console.error('User.updateSelectedTemplate error:', error.message);
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