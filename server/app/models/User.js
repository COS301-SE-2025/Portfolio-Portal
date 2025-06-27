const supabase = require('../config/supabase');

class User {
static async create(email, password) {
  // First create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);

  // Then insert profile using service role
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: authData.user.id,
      email: authData.user.email,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (profileError) throw new Error(profileError.message);

  return profileData;
}
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
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
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(error.message);
    }

    return data;
  }

  static async updateProfile(userId, data) {
    const allowedFields = ['name', 'bio'];
    const updates = {};
    
    for (const key in data) {
      if (allowedFields.includes(key)) {
        updates[key] = data[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  static async setCvUrl(userId, url) {
    const { error } = await supabase
      .from('profiles')
      .update({ cv_url: url })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async setProfilePictureUrl(userId, url) {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_picture_url: url })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = User;