class References {
  static async create(userId, referenceData) {
    const { data, error } = await supabase
      .from('references')
      .insert([{
        user_id: userId,
        name: referenceData.name,
        phone: referenceData.phone || null,
        email: referenceData.email || null
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('references')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('references')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data;
  }

  static async update(id, referenceData) {
    const allowedFields = ['name', 'phone', 'email'];
    const updates = {};

    for (const key in referenceData) {
      if (allowedFields.includes(key)) {
        updates[key] = referenceData[key];
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('references')
        .update(updates)
        .eq('id', id);

      if (error) throw new Error(error.message);
    }
  }

  static async delete(id) {
    const { error } = await supabase
      .from('references')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}