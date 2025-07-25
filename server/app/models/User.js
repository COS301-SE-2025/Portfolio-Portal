// models/User.js
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

      // Insert into users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({ auth_id: data.user.id, name, email })
        .select()
        .single();
      if (userError) {
        console.error('User insert error:', userError.message);
        throw new Error(userError.message);
      }

      return { id: data.user.id, email, name, token: data.session?.access_token };
    } catch (error) {
      console.error('User.create error:', error.message);
      throw error;
    }
  }

  static async findById(id) {
    const { data, error } = await supabase.from('users').select('*').eq('auth_id', id).single();
    if (error) {
      console.error('FindById error:', error.message);
      throw new Error(error.message);
    }
    return data;
  }
}

module.exports = User;