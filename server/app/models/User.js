// app/models/User.js
const { db } = require('../config/firebase');

class User {
  static async create(email, passwordHash) {
    const userRef = db.collection('users').doc();
    const userData = {
      email,
      password_hash: passwordHash,
      created_at: new Date()
    };
    
    await userRef.set(userData);
    
    return {
      id: userRef.id,
      email,
      created_at: userData.created_at
    };
  }

  static async findByEmail(email) {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  static async findById(id) {
    const doc = await db.collection('users').doc(id).get();
    
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    };
  }
}

module.exports = User;