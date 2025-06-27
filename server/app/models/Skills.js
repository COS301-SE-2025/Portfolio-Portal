const supabase = require('../config/supabase');

class Skills {
  static async create(userId, skillsList) {
    const { data, error } = await supabase
      .from('skills')
      .insert([{
        user_id: userId,
        skills_list: skillsList,
        created_at: new Date().toISOString()
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
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(error.message);
    }

    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(error.message);
    }

    return data;
  }

  static async updateSkills(userId, skillsList) {
    const { data, error } = await supabase
      .from('skills')
      .update({ skills_list: skillsList })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  static async addSkill(userId, newSkill) {
    // First get current skills
    const existingSkills = await this.findByUserId(userId);
    
    if (!existingSkills) {
      // If no skills exist, create new record
      return await this.create(userId, [newSkill]);
    }

    // Check if skill already exists
    if (existingSkills.skills_list.includes(newSkill)) {
      throw new Error('Skill already exists');
    }

    // Add new skill to existing array
    const updatedSkills = [...existingSkills.skills_list, newSkill];
    return await this.updateSkills(userId, updatedSkills);
  }

  static async removeSkill(userId, skillToRemove) {
    const existingSkills = await this.findByUserId(userId);
    
    if (!existingSkills) {
      throw new Error('No skills found for user');
    }

    // Remove skill from array
    const updatedSkills = existingSkills.skills_list.filter(skill => skill !== skillToRemove);
    return await this.updateSkills(userId, updatedSkills);
  }

  static async deleteUserSkills(userId) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }

  static async getAllSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  }
}

module.exports = Skills;