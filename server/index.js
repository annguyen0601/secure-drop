// Import required modules
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors()); // Allow frontend to talk to backend

// Setup directory to store uploaded files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer to save files with random names
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, uuidv4()) // random ID as filename
});
const upload = multer({ storage });

// In-memory file metadata store
const vault = {}; // Format: { id: { path, originalName, expiresAt } }

// Upload endpoint — saves encrypted file temporarily
app.post('/upload', upload.single('file'), (req, res) => {
  const id = uuidv4();
  const expiresAt = Date.now() + 10 * 60 * 1000; // file expires in 10 minutes

  vault[id] = {
    path: req.file.path,
    originalName: req.file.originalname,
    expiresAt
  };

  res.json({ id }); // return file ID to frontend
});

// Download endpoint — one-time access, decrypts on client
app.get('/download/:id', (req, res) => {
  const { id } = req.params;
  const file = vault[id];

  // Reject if file not found or expired
  if (!file || file.expiresAt < Date.now()) return res.sendStatus(404);

  // Send file for download and delete after use
  res.download(file.path, file.originalName, () => {
    fs.unlink(file.path, () => { }); // delete from disk
    delete vault[id];               // delete metadata
  });
});

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS test passed!' });
});

app.listen(4000, () => {
  console.log('✅ Backend running on http://localhost:4000');
});
