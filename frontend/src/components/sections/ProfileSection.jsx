import React, { useEffect, useState } from 'react';
import { profileService } from '../../services/profile.service';

const ProfileSection = () => {
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile(token);
        console.log(response);
        setName(response.data.name || ''); // ✅ data comes from axios
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return <h1>Hello, {name || 'User'}!</h1>;
};

export default ProfileSection;
