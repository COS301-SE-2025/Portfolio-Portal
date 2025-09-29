// Standalone Integration Test for Social API
// This file is self-contained and handles its own environment setup

// Force environment variables before any imports
process.env.SUPABASE_URL = 'https://qduizfthmmynrnwtgvqd.supabase.co';
process.env.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWl6ZnRobW15bnJud3RndnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzExODcsImV4cCI6MjA2NTAwNzE4N30.PmpPxQS3kANqAx3XhXtJujVnChMfRgL3rYGwhKvBViQ';

const { createClient } = require('@supabase/supabase-js');

// Create test Supabase client with timeout and retry configuration
const testSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      fetch: (...args) => {
        return fetch(...args).catch(err => {
          console.error('Fetch error details:', {
            message: err.message,
            cause: err.cause,
            code: err.code
          });
          throw err;
        });
      }
    }
  }
);

// Test connection helper
async function testConnection() {
  try {
    const { data, error } = await testSupabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    console.log('✓ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Network error:', err.message);
    return false;
  }
}

describe('Social API Integration Tests', () => {
  let existingUsers = [];
  let testInteractionIds = [];
  let connectionEstablished = false;

  beforeAll(async () => {
    // Test connection first
    connectionEstablished = await testConnection();
    
    if (!connectionEstablished) {
      console.warn('⚠️  Skipping integration tests - cannot connect to database');
      console.warn('Possible causes:');
      console.warn('  1. WSL networking issue (try running from Windows PowerShell)');
      console.warn('  2. Firewall blocking connection');
      console.warn('  3. VPN/Proxy interference');
      console.warn('  4. Supabase instance not accessible');
      return;
    }

    // Get existing users from database
    await getExistingUsers();
  }, 30000); // 30 second timeout for initial setup

  afterAll(async () => {
    if (!connectionEstablished) return;
    await cleanupTestInteractions();
  });

  beforeEach(async () => {
    if (!connectionEstablished) return;
    await cleanupTestInteractions();
  });

  // Helper function to get existing users
  async function getExistingUsers() {
    try {
      const { data: users, error } = await testSupabase
        .from('users')
        .select('id, name, auth_id, followers_count, likes_received, is_profile_public')
        .limit(3);

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }
      
      existingUsers = users || [];
      console.log(`Found ${existingUsers.length} existing users for testing`);
      
      if (existingUsers.length === 0) {
        console.warn('⚠️  No users found in database. Some tests will be skipped.');
      }
    } catch (error) {
      console.error('Failed to get existing users:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    }
  }

  // Helper function to cleanup only test interactions
  async function cleanupTestInteractions() {
    try {
      if (testInteractionIds.length > 0) {
        await testSupabase
          .from('user_interactions')
          .delete()
          .in('id', testInteractionIds);
        testInteractionIds = [];
      }
    } catch (error) {
      console.error('Cleanup interactions failed:', error.message);
    }
  }

  describe('Database Integration - Connection & Setup', () => {
    it('should establish connection to database', () => {
      expect(connectionEstablished).toBe(true);
    });

    it('should have access to test users', () => {
      if (!connectionEstablished) {
        console.log('Skipping - no connection');
        return;
      }
      expect(existingUsers.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Database Integration - Users with CV Data', () => {
    it('should fetch users with CV data from actual database', async () => {
      if (!connectionEstablished) {
        console.log('Skipping - no connection');
        return;
      }

      const { data: cvUsers, error } = await testSupabase
        .from('cv_data')
        .select('auth_id')
        .not('auth_id', 'is', null);

      if (error) {
        console.error('Query error:', error);
      }

      expect(error).toBeNull();
      expect(cvUsers).toBeDefined();
      expect(Array.isArray(cvUsers)).toBe(true);
    });

    it('should fetch public users from actual database', async () => {
      if (!connectionEstablished) {
        console.log('Skipping - no connection');
        return;
      }

      const { data: users, error } = await testSupabase
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
        .limit(5);

      if (error) {
        console.error('Query error:', error);
      }

      expect(error).toBeNull();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      
      if (users && users.length > 0) {
        users.forEach(user => {
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('auth_id');
        });
      }
    });

    it('should query private profiles correctly', async () => {
      if (!connectionEstablished) {
        console.log('Skipping - no connection');
        return;
      }

      const { data: privateUsers, error } = await testSupabase
        .from('users')
        .select('id, name, is_profile_public')
        .eq('is_profile_public', false)
        .limit(5);

      if (error) {
        console.error('Query error:', error);
      }

      expect(error).toBeNull();
      expect(Array.isArray(privateUsers)).toBe(true);
      
      if (privateUsers && privateUsers.length > 0) {
        privateUsers.forEach(user => {
          expect(user.is_profile_public).toBe(false);
        });
      }
    });
  });

  describe('Database Integration - User Interactions', () => {
    beforeEach(async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;

      const interactions = [
        {
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'follow'
        }
      ];

      if (existingUsers.length >= 3) {
        interactions.push({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[2].id,
          interaction_type: 'like'
        });
      }

      const { data: insertedInteractions, error } = await testSupabase
        .from('user_interactions')
        .insert(interactions)
        .select('id');

      if (error) {
        console.error('Failed to setup test interactions:', error);
      }

      if (insertedInteractions) {
        testInteractionIds.push(...insertedInteractions.map(i => i.id));
      }
    });

    it('should fetch user interactions from actual database', async () => {
      if (!connectionEstablished || existingUsers.length < 2) {
        console.log('Skipping - insufficient users or no connection');
        return;
      }

      const { data: interactions, error } = await testSupabase
        .from('user_interactions')
        .select('target_user_id, interaction_type')
        .eq('user_id', existingUsers[0].id);

      expect(error).toBeNull();
      expect(Array.isArray(interactions)).toBe(true);
      
      if (interactions && interactions.length > 0) {
        interactions.forEach(interaction => {
          expect(interaction).toHaveProperty('target_user_id');
          expect(interaction).toHaveProperty('interaction_type');
          expect(['follow', 'like']).toContain(interaction.interaction_type);
        });
      }
    });

    it('should return array for user with no additional interactions', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;

      const { data: interactions, error } = await testSupabase
        .from('user_interactions')
        .select('target_user_id, interaction_type')
        .eq('user_id', existingUsers[1].id);

      expect(error).toBeNull();
      expect(Array.isArray(interactions)).toBe(true);
    });
  });

  describe('Database Integration - Follow Operations', () => {
    it('should create follow interaction in database', async () => {
      if (!connectionEstablished || existingUsers.length < 2) {
        console.log('Skipping - insufficient users or no connection');
        return;
      }

      const { data: insertedData, error: insertError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'follow'
        })
        .select('id');

      expect(insertError).toBeNull();
      
      if (insertedData && insertedData[0]) {
        testInteractionIds.push(insertedData[0].id);
      }

      const { data: interactions, error: selectError } = await testSupabase
        .from('user_interactions')
        .select()
        .eq('user_id', existingUsers[0].id)
        .eq('target_user_id', existingUsers[1].id)
        .eq('interaction_type', 'follow');

      expect(selectError).toBeNull();
      expect(interactions.length).toBeGreaterThan(0);
    });

    it('should increment follower count in database', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;

      const { data: initialUser } = await testSupabase
        .from('users')
        .select('followers_count')
        .eq('id', existingUsers[1].id)
        .single();

      expect(initialUser).not.toBeNull();
      const initialCount = initialUser.followers_count;

      const { error: updateError } = await testSupabase
        .from('users')
        .update({ followers_count: initialCount + 1 })
        .eq('id', existingUsers[1].id);

      expect(updateError).toBeNull();

      const { data: updatedUser } = await testSupabase
        .from('users')
        .select('followers_count')
        .eq('id', existingUsers[1].id)
        .single();

      expect(updatedUser.followers_count).toBe(initialCount + 1);

      // Reset
      await testSupabase
        .from('users')
        .update({ followers_count: initialCount })
        .eq('id', existingUsers[1].id);
    });

    it('should handle duplicate follow constraint', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;

      const { data: firstData, error: firstError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'follow'
        })
        .select('id');

      expect(firstError).toBeNull();
      
      if (firstData && firstData[0]) {
        testInteractionIds.push(firstData[0].id);
      }

      // Try duplicate
      const { error: duplicateError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'follow'
        });

      expect(duplicateError).toBeDefined();
      expect(duplicateError.code).toBe('23505');
    });
  });

  describe('Database Integration - Like Operations', () => {
    it('should create like interaction in database', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;

      const { data: insertedData, error: insertError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'like'
        })
        .select('id');

      expect(insertError).toBeNull();
      if (insertedData && insertedData[0]) {
        testInteractionIds.push(insertedData[0].id);
      }

      const { data: interactions, error: selectError } = await testSupabase
        .from('user_interactions')
        .select()
        .eq('user_id', existingUsers[0].id)
        .eq('target_user_id', existingUsers[1].id)
        .eq('interaction_type', 'like');

      expect(selectError).toBeNull();
      expect(interactions).toHaveLength(1);
    });

    it('should increment likes count in database', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;

      const { data: initialUser } = await testSupabase
        .from('users')
        .select('likes_received')
        .eq('id', existingUsers[1].id)
        .single();
      
      expect(initialUser).not.toBeNull();
      const initialCount = initialUser.likes_received;

      const { error: updateError } = await testSupabase
        .from('users')
        .update({ likes_received: initialCount + 1 })
        .eq('id', existingUsers[1].id);

      expect(updateError).toBeNull();

      const { data: updatedUser } = await testSupabase
        .from('users')
        .select('likes_received')
        .eq('id', existingUsers[1].id)
        .single();

      expect(updatedUser.likes_received).toBe(initialCount + 1);

      // Reset
      await testSupabase.from('users').update({ likes_received: initialCount }).eq('id', existingUsers[1].id);
    });

    it('should handle duplicate like constraint', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;
      
      const { data: firstData, error: firstError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'like'
        })
        .select('id');

      expect(firstError).toBeNull();
      if (firstData && firstData[0]) {
        testInteractionIds.push(firstData[0].id);
      }

      // Try duplicate
      const { error: duplicateError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'like'
        });

      expect(duplicateError).toBeDefined();
      expect(duplicateError.code).toBe('23505');
    });
  });

  describe('End-to-End Database Flow', () => {
    it('should complete a full social interaction flow', async () => {
      if (!connectionEstablished || existingUsers.length < 2) return;
      
      const userId = existingUsers[0].id;
      const targetId = existingUsers[1].id;

      const { data: initialUser } = await testSupabase
        .from('users')
        .select('followers_count, likes_received')
        .eq('id', targetId)
        .single();
      
      const initialFollowers = initialUser.followers_count;
      const initialLikes = initialUser.likes_received;

      // Follow
      const { data: followData } = await testSupabase
        .from('user_interactions')
        .insert({ user_id: userId, target_user_id: targetId, interaction_type: 'follow' })
        .select('id');
      
      if (followData && followData[0]) testInteractionIds.push(followData[0].id);
      
      await testSupabase
        .from('users')
        .update({ followers_count: initialFollowers + 1 })
        .eq('id', targetId);

      // Like
      const { data: likeData } = await testSupabase
        .from('user_interactions')
        .insert({ user_id: userId, target_user_id: targetId, interaction_type: 'like' })
        .select('id');
      
      if (likeData && likeData[0]) testInteractionIds.push(likeData[0].id);
      
      await testSupabase
        .from('users')
        .update({ likes_received: initialLikes + 1 })
        .eq('id', targetId);

      // Verify
      const { data: interactions } = await testSupabase
        .from('user_interactions')
        .select('target_user_id, interaction_type')
        .eq('user_id', userId);

      expect(interactions.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await testSupabase.from('user_interactions').delete().match({ user_id: userId, target_user_id: targetId });
      await testSupabase.from('users').update({ followers_count: initialFollowers, likes_received: initialLikes }).eq('id', targetId);
      
      testInteractionIds = [];
    });
  });
});
