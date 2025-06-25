class Links {
  static async create(userId, linksData) {
    const { data, error } = await supabase
      .from('links')
      .insert([{
        user_id: userId,
        linkedin: linksData.linkedin || null,
        github: linksData.github || null
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(userId, linksData) {
    const allowedFields = ['linkedin', 'github'];
    const updates = {};

    for (const key in linksData) {
      if (allowedFields.includes(key)) {
        updates[key] = linksData[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
    }
  }

  static async delete(userId) {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}