const supabase = require('../config/supabase');
class Education {
  static async create(userId, educationData) {
    const { data, error } = await supabase
      .from('education')
      .insert([{
        user_id: userId,
        degree: educationData.degree,
        institution: educationData.institution,
        field: educationData.field || null,
        start_date: educationData.startDate || null,
        end_date: educationData.endDate || null,
        extra: educationData.extra || null
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(id, educationData) {
    const allowedFields = ['degree', 'institution', 'field', 'start_date', 'end_date', 'extra'];
    const updates = {};

    for (const key in educationData) {
      if (allowedFields.includes(key)) {
        updates[key] = educationData[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('education')
        .update(updates)
        .eq('id', id);

      if (error) throw new Error(error.message);
    }
  }

  static async delete(id) {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
module.exports = Education;