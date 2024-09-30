const express = require('express');
const router = express.Router();
const Matakuliah = require('../models/matakuliah');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { matakuliah } = req.body;
  try {
    await Matakuliah.createMatakuliah(matakuliah);
    res.status(201).send('Mata kuliah created');
  } catch (error) {
    res.status(500).send('Error creating mata kuliah');
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Matakuliah.getMatakuliah();
    res.send(data);
  } catch (error) {
    res.status(500).send('Error getting mata kuliah');
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await Matakuliah.deleteMatakuliah(id);
    res.send('Mata kuliah deleted');
  } catch (err) {
    res.status(404).send('Mata kuliah not found');
  }
});

module.exports = router;