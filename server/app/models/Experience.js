const supabase = require('../config/supabase');

// Experience Model
class Experience {
  static async create(userId, experienceData) {
    const { data, error } = await supabase
      .from('experience')
      .insert([{
        user_id: userId,
        title: experienceData.title,
        company: experienceData.company,
        start_date: experienceData.startDate || null,
        end_date: experienceData.endDate || null,
        extra: experienceData.extra || null
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(id, experienceData) {
    const allowedFields = ['title', 'company', 'start_date', 'end_date', 'extra'];
    const updates = {};

    for (const key in experienceData) {
      if (allowedFields.includes(key)) {
        updates[key] = experienceData[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('experience')
        .update(updates)
        .eq('id', id);

      if (error) throw new Error(error.message);
    }
  }

  static async delete(id) {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
module.exports = Experience;