const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

const Admin = {
  async createAdmin(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('admin').doc(username).set({ username, password: hashedPassword });
  },

  async findAdminByUsername(username) {
    const adminRef = db.collection('admin').doc(username);
    const doc = await adminRef.get();
    return doc.exists ? doc.data() : null;
  },

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
};

module.exports = Admin;