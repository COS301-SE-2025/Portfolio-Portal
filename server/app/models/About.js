const supabase = require('../config/supabase');
class About {
  static async create(userId, paragraphs) {
    const { data, error } = await supabase
      .from('about')
      .insert([{
        user_id: userId,
        paragraphs: paragraphs
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(userId, paragraphs) {
    const { error } = await supabase
      .from('about')
      .update({ paragraphs: paragraphs })
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }

  static async delete(userId) {
    const { error } = await supabase
      .from('about')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}

// Skills Model
class Skills {
  static async create(userId, skillsList) {
    const { data, error } = await supabase
      .from('skills')
      .insert([{
        user_id: userId,
        skills_list: skillsList
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(userId, skillsList) {
    const { error } = await supabase
      .from('skills')
      .update({ skills_list: skillsList })
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }

  static async delete(userId) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}
module.exports = About;