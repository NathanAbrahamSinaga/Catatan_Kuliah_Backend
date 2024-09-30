const { db } = require('../config/firebase');

const Matakuliah = {
  async createMatakuliah(matakuliah) {
    await db.collection('matakuliah').add({ matakuliah });
  },

  async getMatakuliah() {
    const snapshot = await db.collection('matakuliah').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteMatakuliah(id) {
    await db.collection('matakuliah').doc(id).delete();
  }
};

module.exports = Matakuliah;