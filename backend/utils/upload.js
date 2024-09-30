const multer = require('multer');
const { bucket } = require('../config/firebase');

const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadToStorage = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error('No file provided for upload.');
      return reject('No file provided');
    }

    const filename = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(filename);
    console.log(`Uploading file: ${filename}`);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('Error during file upload:', error);
      reject(error);
    });

    blobStream.on('finish', async () => {
      console.log(`File ${filename} uploaded successfully.`);
      try {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        console.log(`Public URL: ${publicUrl}`);
        resolve(publicUrl);
      } catch (err) {
        console.error('Error making file public:', err);
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { upload, uploadToStorage };
