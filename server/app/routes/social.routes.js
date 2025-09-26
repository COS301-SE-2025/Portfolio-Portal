const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get all users for community page
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        bio,
        email,
        github,
        linkedin,
        profile_picture_path,
        selected_template,
        followers_count,
        likes_received,
        created_at
      `)
      .eq('is_profile_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user's interactions (who they follow/like)
router.get('/interactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('user_interactions')
      .select('target_user_id, interaction_type')
      .eq('user_id', userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Follow/Unfollow a user
router.post('/follow', async (req, res) => {
  try {
    const { userId, targetUserId, action } = req.body; // action: 'follow' or 'unfollow'

    if (action === 'follow') {
      // Add follow interaction
      const { error: insertError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          target_user_id: targetUserId,
          interaction_type: 'follow'
        });

      if (insertError) throw insertError;

      // Update follower count
      const { error: updateError } = await supabase
        .from('users')
        .update({ followers_count: supabase.raw('followers_count + 1') })
        .eq('id', targetUserId);

      if (updateError) throw updateError;

    } else {
      // Remove follow interaction
      const { error: deleteError } = await supabase
        .from('user_interactions')
        .delete()
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .eq('interaction_type', 'follow');

      if (deleteError) throw deleteError;

      // Update follower count
      const { error: updateError } = await supabase
        .from('users')
        .update({ followers_count: supabase.raw('followers_count - 1') })
        .eq('id', targetUserId);

      if (updateError) throw updateError;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating follow:', error);
    res.status(500).json({ error: 'Failed to update follow status' });
  }
});

// Like/Unlike a user's portfolio
router.post('/like', async (req, res) => {
  try {
    const { userId, targetUserId, action } = req.body; // action: 'like' or 'unlike'

    if (action === 'like') {
      // Add like interaction
      const { error: insertError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          target_user_id: targetUserId,
          interaction_type: 'like'
        });

      if (insertError) throw insertError;

      // Update likes count
      const { error: updateError } = await supabase
        .from('users')
        .update({ likes_received: supabase.raw('likes_received + 1') })
        .eq('id', targetUserId);

      if (updateError) throw updateError;

    } else {
      // Remove like interaction
      const { error: deleteError } = await supabase
        .from('user_interactions')
        .delete()
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .eq('interaction_type', 'like');

      if (deleteError) throw deleteError;

      // Update likes count
      const { error: updateError } = await supabase
        .from('users')
        .update({ likes_received: supabase.raw('likes_received - 1') })
        .eq('id', targetUserId);

      if (updateError) throw updateError;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ error: 'Failed to update like status' });
  }
});

module.exports = router;