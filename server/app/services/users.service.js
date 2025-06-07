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

const loginUser = async (extractEmail, password) => {
  const snapshot = await db.ref('users').orderByChild('email').equalTo(extractEmail).once('value');
  if (!snapshot.exists()) {
    return null;
  }
  
  const userData = snapshot.val();
  const userId = Object.keys(userData)[0];
  const user = userData[userId];

  if (user.password === password) {
    return { id: userId, ...user };
  } else {
    return null;
  }
}

module.exports = {
  getUserById,
  createUser,
  loginUser
};