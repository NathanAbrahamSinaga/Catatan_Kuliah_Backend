const { db, bucket } = require('../config/firebase');

const Catatan = {
  async createCatatan(matakuliahId, bab, kontenUrl) {
    await db.collection('matakuliah').doc(matakuliahId).collection('catatan').add({
      bab,
      konten: kontenUrl,
    });
  },

  async getCatatanByMatakuliah(matakuliahId) {
    const snapshot = await db.collection('matakuliah').doc(matakuliahId).collection('catatan').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteCatatan(matakuliahId, catatanId) {
    try {
      const catatanRef = db.collection('matakuliah').doc(matakuliahId).collection('catatan').doc(catatanId);
      const doc = await catatanRef.get();

      if (!doc.exists) {
        throw new Error('Catatan not found');
      }

      const { konten } = doc.data();
      if (konten) {
        const filePath = konten.split(`${bucket.name}/`)[1];
        if (filePath) {
          try {
            await bucket.file(filePath).delete();
            console.log(`File ${filePath} deleted successfully.`);
          } catch (error) {
            console.error('Error deleting file from storage:', error);
          }
        } else {
          console.warn('File path not found in konten URL.');
        }
      }

      await catatanRef.delete();
      console.log(`Catatan ${catatanId} deleted successfully.`);
    } catch (error) {
      console.error('Error in deleteCatatan:', error);
      throw error;
    }
  }
};

module.exports = Catatan;
