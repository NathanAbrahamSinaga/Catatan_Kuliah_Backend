const express = require('express');
const router = express.Router();
const Catatan = require('../models/catatan');
const auth = require('../middleware/auth');
const { upload, uploadToStorage } = require('../utils/upload');

router.post('/', auth, upload.single('konten'), async (req, res) => {
  const { matakuliahId, bab } = req.body;

  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const kontenUrl = await uploadToStorage(req.file, 'catatan');

    await Catatan.createCatatan(matakuliahId, bab, kontenUrl);
    res.status(201).send('Catatan created with content uploaded');
  } catch (error) {
    console.error('Error creating catatan:', error);
    res.status(500).send({ message: 'Failed to create catatan', error: error.message });
  }
});

router.get('/:matakuliahId', async (req, res) => {
  const { matakuliahId } = req.params;
  try {
    const data = await Catatan.getCatatanByMatakuliah(matakuliahId);
    res.send(data);
  } catch (error) {
    console.error('Error fetching catatan:', error);
    res.status(500).send({ message: 'Failed to fetch catatan', error: error.message });
  }
});

router.delete('/:matakuliahId/:catatanId', auth, async (req, res) => {
  const { matakuliahId, catatanId } = req.params;
  try {
    await Catatan.deleteCatatan(matakuliahId, catatanId);
    res.send('Catatan deleted');
  } catch (error) {
    console.error('Error deleting catatan:', error);
    if (error.message === 'Catatan not found') {
      res.status(404).send({ message: 'Catatan not found', error: error.message });
    } else {
      res.status(500).send({ message: 'Failed to delete catatan', error: error.message });
    }
  }
});

module.exports = router;