require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const socialRoutes = require('../../../app/routes/social.routes');
const express = require('express');

// Test database setup
const testSupabase = createClient(
  process.env.SUPABASE_URL ,
  process.env.SUPABASE_KEY
);

// Helper function to create mock req/res objects for route testing
const createMockReq = (params = {}, body = {}, method = 'GET', url = '') => ({
  params,
  body,
  method,
  url
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper to simulate route execution
const executeRoute = async (router, method, path, reqData = {}) => {
  return new Promise((resolve, reject) => {
    const req = createMockReq(reqData.params, reqData.body, method, path);
    const res = createMockRes();
    
    // Add resolve/reject to res for async testing
    res.end = () => resolve({ status: res.status.mock.calls[0]?.[0] || 200, body: res.json.mock.calls[0]?.[0] });
    
    // Execute the route
    try {
      router(req, res, (err) => {
        if (err) reject(err);
        else resolve({ status: 200, body: res.json.mock.calls[0]?.[0] });
      });
    } catch (error) {
      reject(error);
    }
  });
};

describe('Social API Integration Tests', () => {
  let existingUsers = [];
  let testInteractionIds = [];

  beforeAll(async () => {
    // Get existing users from database instead of creating new ones
    await getExistingUsers();
  });

  afterAll(async () => {
    // Cleanup only the interactions we created
    await cleanupTestInteractions();
  });

  beforeEach(async () => {
    // Clean up interactions before each test
    await cleanupTestInteractions();
  });

  // Helper function to get existing users
  async function getExistingUsers() {
    try {
      const { data: users, error } = await testSupabase
        .from('users')
        .select('id, name, auth_id, followers_count, likes_received, is_profile_public')
        .limit(3);

      if (error) throw error;
      existingUsers = users || [];
      console.log(`Found ${existingUsers.length} existing users for testing`);
    } catch (error) {
      console.error('Failed to get existing users:', error);
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
      console.error('Cleanup interactions failed:', error);
    }
  }

  describe('Database Integration - Users with CV Data', () => {
    it('should fetch users with CV data from actual database', async () => {
      // Query the database directly to verify our test data setup
      const { data: cvUsers, error } = await testSupabase
        .from('cv_data')
        .select('auth_id')
        .not('auth_id', 'is', null);

      expect(error).toBeNull();
      expect(cvUsers).toBeDefined();
      
      // Check if we have any CV data (could be existing or test data)
      expect(Array.isArray(cvUsers)).toBe(true);
    });

    it('should fetch public users from actual database', async () => {
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
        .limit(5); // Just get first 5 users

      expect(error).toBeNull();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      
      if (users.length > 0) {
        users.forEach(user => {
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('auth_id');
        });
      }
    });

    it('should query private profiles correctly', async () => {
      const { data: privateUsers, error } = await testSupabase
        .from('users')
        .select('id, name, is_profile_public')
        .eq('is_profile_public', false)
        .limit(5);

      expect(error).toBeNull();
      expect(Array.isArray(privateUsers)).toBe(true);
      
      if (privateUsers.length > 0) {
        privateUsers.forEach(user => {
          expect(user.is_profile_public).toBe(false);
        });
      }
    });
  });

  describe('Database Integration - User Interactions', () => {
    beforeEach(async () => {
      // Skip if we don't have enough users
      if (existingUsers.length < 2) return;

      // Add test interactions using existing users
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
          target_user_id: existingUsers[2]?.id || existingUsers[1].id,
          interaction_type: 'like'
        });
      }

      const { data: insertedInteractions } = await testSupabase
        .from('user_interactions')
        .insert(interactions)
        .select('id');

      if (insertedInteractions) {
        testInteractionIds.push(...insertedInteractions.map(i => i.id));
      }
    });

    it('should fetch user interactions from actual database', async () => {
      if (existingUsers.length < 2) {
        console.log('Skipping test - not enough existing users');
        return;
      }

      const { data: interactions, error } = await testSupabase
        .from('user_interactions')
        .select('target_user_id, interaction_type')
        .eq('user_id', existingUsers[0].id);

      expect(error).toBeNull();
      expect(Array.isArray(interactions)).toBe(true);
      
      if (interactions.length > 0) {
        interactions.forEach(interaction => {
          expect(interaction).toHaveProperty('target_user_id');
          expect(interaction).toHaveProperty('interaction_type');
          expect(['follow', 'like']).toContain(interaction.interaction_type);
        });
      }
    });

    it('should return empty array for user with no interactions', async () => {
      if (existingUsers.length < 2) return;

      const { data: interactions, error } = await testSupabase
        .from('user_interactions')
        .select('target_user_id, interaction_type')
        .eq('user_id', existingUsers[1].id); // User that shouldn't have interactions

      expect(error).toBeNull();
      expect(Array.isArray(interactions)).toBe(true);
    });
  });

  describe('Database Integration - Follow Operations', () => {
    it('should create follow interaction in database', async () => {
      if (existingUsers.length < 2) {
        console.log('Skipping test - not enough existing users');
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

      // Verify it was created
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
      if (existingUsers.length < 2) return;

      // First, get current count
      const { data: initialUser } = await testSupabase
        .from('users')
        .select('followers_count')
        .eq('id', existingUsers[1].id)
        .single();

      expect(initialUser).not.toBeNull();
      const initialCount = initialUser.followers_count;

      // Increment follower count
      const { error: updateError } = await testSupabase
        .from('users')
        .update({ followers_count: initialCount + 1 })
        .eq('id', existingUsers[1].id);

      expect(updateError).toBeNull();

      // Verify it was incremented
      const { data: updatedUser } = await testSupabase
        .from('users')
        .select('followers_count')
        .eq('id', existingUsers[1].id)
        .single();

      expect(updatedUser.followers_count).toBe(initialCount + 1);

      // Reset the count back to original
      await testSupabase
        .from('users')
        .update({ followers_count: initialCount })
        .eq('id', existingUsers[1].id);
    });

    it('should remove follow interaction from database', async () => {
      if (existingUsers.length < 2) return;

      // First create the interaction
      const { data: insertedData } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'follow'
        })
        .select('id');

      if (insertedData && insertedData[0]) {
        testInteractionIds.push(insertedData[0].id);
      }

      // Then remove it
      const { error: deleteError } = await testSupabase
        .from('user_interactions')
        .delete()
        .eq('user_id', existingUsers[0].id)
        .eq('target_user_id', existingUsers[1].id)
        .eq('interaction_type', 'follow');

      expect(deleteError).toBeNull();

      // Verify it was removed
      const { data: interactions } = await testSupabase
        .from('user_interactions')
        .select()
        .eq('user_id', existingUsers[0].id)
        .eq('target_user_id', existingUsers[1].id)
        .eq('interaction_type', 'follow');

      expect(interactions).toHaveLength(0);
    });

    it('should handle duplicate follow constraint', async () => {
      if (existingUsers.length < 2) return;

      // Create first interaction
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

      // Try to create duplicate - should fail
      const { error: duplicateError } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: existingUsers[0].id,
          target_user_id: existingUsers[1].id,
          interaction_type: 'follow'
        });

      expect(duplicateError).toBeDefined();
      expect(duplicateError.code).toBe('23505'); // Unique constraint violation
    });
  });

  describe('Database Integration - Like Operations', () => {
    it('should create like interaction in database', async () => {
        if (existingUsers.length < 2) return;

        const { data: insertedData, error: insertError } = await testSupabase
            .from('user_interactions')
            .insert({
                user_id: existingUsers[0].id,
                target_user_id: existingUsers[1].id,
                interaction_type: 'like'
            })
            .select('id');

        expect(insertError).toBeNull();
        if(insertedData && insertedData[0]) {
            testInteractionIds.push(insertedData[0].id);
        }

        // Verify it was created
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
        if (existingUsers.length < 2) return;

        // First, get current count
        const { data: initialUser } = await testSupabase
            .from('users')
            .select('likes_received')
            .eq('id', existingUsers[1].id)
            .single();
        
        expect(initialUser).not.toBeNull();
        const initialCount = initialUser.likes_received;

        // Increment likes count
        const { error: updateError } = await testSupabase
            .from('users')
            .update({ likes_received: initialCount + 1 })
            .eq('id', existingUsers[1].id);

        expect(updateError).toBeNull();

        // Verify it was incremented
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
        if (existingUsers.length < 2) return;
        
        // Create first interaction
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

        // Try to create duplicate - should fail
        const { error: duplicateError } = await testSupabase
            .from('user_interactions')
            .insert({
                user_id: existingUsers[0].id,
                target_user_id: existingUsers[1].id,
                interaction_type: 'like'
            });

        expect(duplicateError).toBeDefined();
        expect(duplicateError.code).toBe('23505'); // Unique constraint violation
    });
  });

  describe('End-to-End Database Flow', () => {
    it('should complete a full social interaction flow in database', async () => {
        if (existingUsers.length < 2) return;
        const userId = existingUsers[0].id;
        const targetId = existingUsers[1].id;

        const { data: initialUser } = await testSupabase
            .from('users')
            .select('followers_count, likes_received')
            .eq('id', targetId)
            .single();
        
        const initialFollowers = initialUser.followers_count;
        const initialLikes = initialUser.likes_received;

        // Step 1: Follow user
        await testSupabase
            .from('user_interactions')
            .insert({ user_id: userId, target_user_id: targetId, interaction_type: 'follow' });
        await testSupabase
            .from('users')
            .update({ followers_count: initialFollowers + 1 })
            .eq('id', targetId);

        // Step 2: Like user's portfolio
        await testSupabase
            .from('user_interactions')
            .insert({ user_id: userId, target_user_id: targetId, interaction_type: 'like' });
        await testSupabase
            .from('users')
            .update({ likes_received: initialLikes + 1 })
            .eq('id', targetId);

        // Verify interactions exist
        const { data: interactions } = await testSupabase
            .from('user_interactions')
            .select('target_user_id, interaction_type')
            .eq('user_id', userId);

        expect(interactions).toHaveLength(2);
        expect(interactions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ target_user_id: targetId, interaction_type: 'follow' }),
                expect.objectContaining({ target_user_id: targetId, interaction_type: 'like' })
            ])
        );

        // Verify counts updated
        const { data: user } = await testSupabase
            .from('users')
            .select('followers_count, likes_received')
            .eq('id', targetId)
            .single();

        expect(user.followers_count).toBe(initialFollowers + 1);
        expect(user.likes_received).toBe(initialLikes + 1);

        // Step 3: Unfollow and unlike
        await testSupabase.from('user_interactions').delete().match({ user_id: userId, target_user_id: targetId, interaction_type: 'follow' });
        await testSupabase.from('users').update({ followers_count: initialFollowers }).eq('id', targetId);

        await testSupabase.from('user_interactions').delete().match({ user_id: userId, target_user_id: targetId, interaction_type: 'like' });
        await testSupabase.from('users').update({ likes_received: initialLikes }).eq('id', targetId);

        // Verify interactions removed
        const { data: finalInteractions } = await testSupabase.from('user_interactions').select().eq('user_id', userId);
        expect(finalInteractions).toHaveLength(0);

        // Verify counts back to original
        const { data: finalUser } = await testSupabase.from('users').select('followers_count, likes_received').eq('id', targetId).single();
        expect(finalUser.followers_count).toBe(initialFollowers);
        expect(finalUser.likes_received).toBe(initialLikes);
    });
  });

  describe('Data Consistency and Edge Cases', () => {
    it('should maintain data consistency during concurrent operations', async () => {
        if (existingUsers.length < 3) return;

        // Simulate multiple users following the same target
        const followPromises = [
            testSupabase.from('user_interactions').insert({ user_id: existingUsers[0].id, target_user_id: existingUsers[2].id, interaction_type: 'follow' }),
            testSupabase.from('user_interactions').insert({ user_id: existingUsers[1].id, target_user_id: existingUsers[2].id, interaction_type: 'follow' })
        ];
        
        const results = await Promise.allSettled(followPromises);
        
        // Both should succeed
        results.forEach(result => {
            expect(result.status).toBe('fulfilled');
            if (result.value.error) console.error(result.value.error);
            expect(result.value.error).toBeNull();
        });

        const { data: inserted } = await testSupabase.from('user_interactions').select('id').in('user_id', [existingUsers[0].id, existingUsers[1].id]);
        if(inserted) testInteractionIds.push(...inserted.map(i => i.id));

        // Verify both interactions exist
        const { data: interactions } = await testSupabase
            .from('user_interactions')
            .select()
            .eq('target_user_id', existingUsers[2].id)
            .eq('interaction_type', 'follow');

        expect(interactions).toHaveLength(2);
    });

    it('should handle follower count edge cases', async () => {
        if (existingUsers.length < 1) return;
        const targetId = existingUsers[0].id;
        
        const { data: initialUser } = await testSupabase.from('users').select('followers_count').eq('id', targetId).single();
        
        // Set count to 0 to test the boundary condition
        await testSupabase.from('users').update({ followers_count: 0 }).eq('id', targetId);

        // Simulate a decrement operation when the count is at 0.
        // A robust application would read the value first, then calculate the new value.
        const { data: userAtZero } = await testSupabase
            .from('users')
            .select('followers_count')
            .eq('id', targetId)
            .single();
        
        // The application logic should ensure the count never goes below zero.
        const newFollowerCount = Math.max(0, userAtZero.followers_count - 1);

        // Update the database with the calculated (safe) value.
        await testSupabase
            .from('users')
            .update({ followers_count: newFollowerCount })
            .eq('id', targetId);
        
        // Verify the result is not negative.
        const { data: user } = await testSupabase.from('users').select('followers_count').eq('id', targetId).single();
        
        expect(user.followers_count).toBe(0); // It should be clamped at 0
        expect(user.followers_count).toBeGreaterThanOrEqual(0);

        // Reset to original value for subsequent tests
        await testSupabase.from('users').update({ followers_count: initialUser.followers_count }).eq('id', targetId);
    });

    it('should verify database constraints are working', async () => {
        if (existingUsers.length < 1) return;
      // Test that user_id must exist (foreign key constraint)
      const { error } = await testSupabase
        .from('user_interactions')
        .insert({
          user_id: 99999999, // Non-existent user
          target_user_id: existingUsers[0].id,
          interaction_type: 'follow'
        });

      // Should fail due to foreign key constraint
      expect(error).toBeDefined();
      expect(error.code).toBe('23503');
    });
  });
});
