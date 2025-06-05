const { db } = require('../config/firebase');

const getUserById = async (id) => {
  const snapshot = await db.ref(`users/${id}`).once('value');
  if (!snapshot.exists()) {
    return null;
  }
  return { id, ...snapshot.val() };
};

const createUser = async (userData) => {
  const userRef = db.ref('users').push();
  await userRef.set(userData);
  return { id: userRef.key, ...userData };
};

module.exports = {
  getUserById,
  createUser
};