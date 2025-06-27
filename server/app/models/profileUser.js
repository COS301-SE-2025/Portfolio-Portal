const supabase = require('../config/supabase');

class profileUser {
  static async create(userData) {
    const { email, name, bio, ...otherData } = userData;
    
    // Insert user directly into users table (no auth)
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: email || null,
        name: name || null,
        bio: bio || null,
        created_at: new Date().toISOString(),
        ...otherData
      }])
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    return data || [];
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(error.message);
    }

    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(error.message);
    }

    return data;
  }

  static async update(userId, updateData) {
    const allowedFields = ['name', 'bio', 'email', 'cv_url', 'profile_picture_url'];
    const updates = {};
    
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        updates[key] = updateData[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new Error('No valid fields to update');
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return data;
  }

  static async delete(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw new Error(error.message);
    
    return true;
  }

  static async updateProfile(userId, data) {
    return await this.update(userId, data);
  }

  static async setCvUrl(userId, url) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        cv_url: url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return data;
  }

  static async setProfilePictureUrl(userId, url) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        profile_picture_url: url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return data;
  }
}

module.exports = profileUser;