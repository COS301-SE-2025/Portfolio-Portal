//server/app/models/User.js
const { createClient } = require('@supabase/supabase-js');
const supabase = require('../config/supabase'); 

class User {
  static async create(email, password, name, professional = true) {
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

      // Insert into users table with professional field
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          auth_id: data.user.id,
          name,
          email,
          professional,
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
        professional,
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

      // If user found, generate & attach signed URL for profile picture
      if (data) {
        data.profile_picture_url = await this.getSignedProfileUrl(data.profile_picture_path);
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

      // If user found, generate & attach signed URL for profile picture
      if (data) {
        data.profile_picture_url = await this.getSignedProfileUrl(data.profile_picture_path);
      }

      return data;
    } catch (error) {
      console.error('User.findByEmail error:', error.message);
      throw error;
    }
  }

  static async getSignedProfileUrl(profilePath, expiresIn = 86400) {
    if (!profilePath) return null;

    try {
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .createSignedUrl(profilePath, expiresIn);

      if (error) {
        console.error('Supabase getSignedProfileUrl error:', error.message);
        return null; // Return null instead of throwing for this utility
      }
      return data.signedUrl;
    } catch (error) {
      console.error('User.getSignedProfileUrl catch error:', error.message);
      return null;
    }
  }

  static async updateProfile(authId, updateData) {
    try {
      // Validate & sanitize update data (basic level, more can be in service)
      const allowedFields = [
        'name', 'bio', 'cv_url', 'profile_picture_path',
        'about_paragraphs', 'certifications', 'skills',
        'linkedin', 'github', 'selected_template', 'professional'
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

      // Add signed URL to response for immediate use after update
      if (data) {
        data.profile_picture_url = await this.getSignedProfileUrl(data.profile_picture_path);
      }

      return data;
    } catch (error) {
      console.error('User.updateProfile error:', error.message);
      throw error;
    }
  }

  static async uploadProfilePicture(authId, fileBuffer, originalFileName, contentType, token) {
    try {
      // Create an authenticated Supabase client for storage operations
      const supabaseAuth = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
        { global: { headers: { 'Authorization': `Bearer ${token}` } } }
      );

      // Derive file extension
      const fileExt = originalFileName.split('.').pop();
      // Define the storage path: e.g., 'user_auth_id/profile.png'
      const filePath = `${authId}/profile.${fileExt}`;

      // 1st, attempt to remove any existing profile picture for this user
      // This prevents orphaned files & ensures only one profile pic per user
      await this.deleteProfilePicture(authId); // Use existing method for deletion

      // Upload file with proper cache control & upsert (overwrite if exists)
      const { error: uploadError } = await supabaseAuth.storage
        .from('profile-pictures')
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true, // Overwrite if a file at this path already exists
          cacheControl: '86400', // Cache for 24 hours
        });

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Update the user's profile_picture_path in the database
      const updatedUser = await this.updateProfile(authId, {
        profile_picture_path: filePath
      });

      // The updateProfile method already adds the signed URL to the returned object
      if (updatedUser && updatedUser.profile_picture_url) {
        return updatedUser.profile_picture_url;
      } else {
        throw new Error('Failed to get signed URL after upload.');
      }

    } catch (error) {
      console.error('User.uploadProfilePicture error:', {
        authId,
        message: error.message,
        stack: error.stack
      });
      throw new Error('Profile picture upload failed. Please try again.');
    }
  }

  static async deleteProfilePicture(authId) {
    try {
      // Get current user to find existing profile picture path
      const user = await this.findById(authId);
      if (user && user.profile_picture_path) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([user.profile_picture_path]);

        if (deleteError) {
          // Log a warning, but don't necessarily fail if the file wasn't found in storage
          // but the path still existed in the DB (e.g., manual deletion from bucket)
          console.warn('Profile picture storage deletion warning:', deleteError.message);
        }
      }

      // Always clear the profile_picture_path in the database, regardless of storage deletion success
      const updatedUser = await this.updateProfile(authId, {
        profile_picture_path: null
      });

      return updatedUser ? true : false;
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

static async delete(authId) {
  try {
    console.log(`User.delete called for authId: ${authId}`);
    
   
    const user = await this.findById(authId);
    if (!user) {
      throw new Error('User not found');
    }


    if (user.profile_picture_path) {
      await this.deleteProfilePicture(authId);
    }

   
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('auth_id', authId);

    if (dbError) {
      console.error('Database deletion error:', dbError.message);
      throw new Error(`Failed to delete user from database: ${dbError.message}`);
    }

    console.log('User successfully deleted from database');
    return true;
  } catch (error) {
    console.error('User.delete error:', error.message);
    throw error;
  }
}

static async deleteFromAuth(authId) {
  try {
    console.log(`User.deleteFromAuth called for authId: ${authId}`);
    
    // Create admin client with service role key
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Delete user from Supabase Auth using admin client
    const { error } = await supabaseAdmin.auth.admin.deleteUser(authId);

    if (error) {
      console.error('Auth deletion error:', error.message);
      throw new Error(`Failed to delete user from auth: ${error.message}`);
    }

    console.log('User successfully deleted from auth');
    return true;
  } catch (error) {
    console.error('User.deleteFromAuth error:', error.message);
    throw error;
  }
}

  static async searchUsers(query, limit = 10, offset = 0) {
    try {
      const searchTerm = `%${query}%`;
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, bio, profile_picture_path, skills') // Select public fields
        .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(limit)
        .offset(offset)
        .order('name');

      if (error) {
        console.error('SearchUsers error:', error.message);
        throw new Error(error.message);
      }

      // Manually add signed URLs for each user in the search results
      if (data && data.length > 0) {
        for (const user of data) {
          user.profile_picture_url = await this.getSignedProfileUrl(user.profile_picture_path);
        }
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
        .select('id, name, email, bio, profile_picture_path, skills') // Select public fields
        .overlaps('skills', skills) // Supabase function to check array overlap
        .limit(limit)
        .order('name');

      if (error) {
        console.error('GetUsersBySkills error:', error.message);
        throw new Error(error.message);
      }

      // Manually add signed URLs for each user in the results
      if (data && data.length > 0) {
        for (const user of data) {
          user.profile_picture_url = await this.getSignedProfileUrl(user.profile_picture_path);
        }
      }

      return data;
    } catch (error) {
      console.error('User.getUsersBySkills error:', error.message);
      throw error;
    }
  }
}

module.exports = User;