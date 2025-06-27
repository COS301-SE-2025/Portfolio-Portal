const supabase = require('../config/supabase');
class Certifications {
  static async create(userId, certificationsList) {
    const { data, error } = await supabase
      .from('certifications')
      .insert([{
        user_id: userId,
        certifications_list: certificationsList
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(userId, certificationsList) {
    const { error } = await supabase
      .from('certifications')
      .update({ certifications_list: certificationsList })
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }

  static async delete(userId) {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}
module.exports = Certifications;