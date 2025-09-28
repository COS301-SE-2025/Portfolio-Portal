const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Social routes working!' });
});

// Get all users for community page (only those with CV data)
router.get('/users', async (req, res) => {
  try {
    console.log('Fetching users with CV data from social route...');
    
    // First get users who have CV data
    const { data: usersWithCV, error: cvError } = await supabase
      .from('cv_data')
      .select('auth_id')
      .not('auth_id', 'is', null);

    if (cvError) {
      console.error('Error fetching CV data:', cvError);
      throw cvError;
    }

    if (!usersWithCV || usersWithCV.length === 0) {
      console.log('No users with CV data found');
      return res.json([]);
    }

    // Extract auth_ids of users with CV data
    const authIdsWithCV = usersWithCV.map(cv => cv.auth_id);

    // Now get user profiles for those who have CV data
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
        created_at,
        auth_id
      `)
      .eq('is_profile_public', true)
      .in('auth_id', authIdsWithCV)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Found users with CV data:', data?.length || 0);
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user's interactions
router.get('/interactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('user_interactions')
      .select('target_user_id, interaction_type')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Follow/Unfollow a user
router.post('/follow', async (req, res) => {
  try {
    const { userId, targetUserId, action } = req.body;

    if (!userId || !targetUserId || !action) {
      return res.status(400).json({ error: 'Missing required fields: userId, targetUserId, action' });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    if (action === 'follow') {
      // Add follow interaction
      const { error: insertError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          target_user_id: targetUserId,
          interaction_type: 'follow'
        });

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          return res.status(400).json({ error: 'Already following this user' });
        }
        throw insertError;
      }

      // Update follower count
      const { error: updateError } = await supabase
        .from('users')
        .update({ followers_count: supabase.sql`followers_count + 1` })
        .eq('id', targetUserId);

      if (updateError) throw updateError;

    } else if (action === 'unfollow') {
      // Remove follow interaction
      const { error: deleteError } = await supabase
        .from('user_interactions')
        .delete()
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .eq('interaction_type', 'follow');

      if (deleteError) throw deleteError;

      // Update follower count (ensure it doesn't go below 0)
      const { error: updateError } = await supabase
        .from('users')
        .update({ followers_count: supabase.sql`GREATEST(0, followers_count - 1)` })
        .eq('id', targetUserId);

      if (updateError) throw updateError;
    } else {
      return res.status(400).json({ error: 'Invalid action. Must be "follow" or "unfollow"' });
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
    const { userId, targetUserId, action } = req.body;

    if (!userId || !targetUserId || !action) {
      return res.status(400).json({ error: 'Missing required fields: userId, targetUserId, action' });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot like your own portfolio' });
    }

    if (action === 'like') {
      // Add like interaction
      const { error: insertError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          target_user_id: targetUserId,
          interaction_type: 'like'
        });

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          return res.status(400).json({ error: 'Already liked this portfolio' });
        }
        throw insertError;
      }

      // Update likes count
      const { error: updateError } = await supabase
        .from('users')
        .update({ likes_received: supabase.sql`likes_received + 1` })
        .eq('id', targetUserId);

      if (updateError) throw updateError;

    } else if (action === 'unlike') {
      // Remove like interaction
      const { error: deleteError } = await supabase
        .from('user_interactions')
        .delete()
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .eq('interaction_type', 'like');

      if (deleteError) throw deleteError;

      // Update likes count (ensure it doesn't go below 0)
      const { error: updateError } = await supabase
        .from('users')
        .update({ likes_received: supabase.sql`GREATEST(0, likes_received - 1)` })
        .eq('id', targetUserId);

      if (updateError) throw updateError;
    } else {
      return res.status(400).json({ error: 'Invalid action. Must be "like" or "unlike"' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ error: 'Failed to update like status' });
  }
});

module.exports = router;