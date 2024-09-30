const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await Admin.createAdmin(username, password);
    res.status(201).send('Admin registered');
  } catch (error) {
    res.status(500).send('Error registering admin');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findAdminByUsername(username);
    
    if (!admin || !(await Admin.comparePassword(password, admin.password))) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

module.exports = router;