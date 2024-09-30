const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const matakuliahRoutes = require('./routes/matakuliah');
const catatanRoutes = require('./routes/catatan');

dotenv.config();

const corsOptions = {
  origin: ['https://catatan-kuliah-uty.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('The API is running');
});

app.use('/admin', adminRoutes);
app.use('/matakuliah', matakuliahRoutes);
app.use('/catatan', catatanRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;