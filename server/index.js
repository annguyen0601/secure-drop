// Import required modules
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({
  exposedHeaders: ['X-Original-Filename'] // Allow client to read this custom header
})); // Allow frontend to talk to backend

// Setup directory to store uploaded files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer to save files with random names
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext); // random ID as filename with original extension
  }
});
const upload = multer({ storage });

// In-memory file metadata store
const vault = {}; // Format: { id: { path, originalName, expiresAt } }

// Upload endpoint — saves encrypted file temporarily
app.post('/upload', upload.single('file'), (req, res) => {
  const id = uuidv4();
  const expiresAt = Date.now() + 10 * 60 * 1000; // file expires in 10 minutes

  vault[id] = {
    path: req.file.path, // multer already saved with correct extension
    originalName: req.file.originalname,
    expiresAt
  };

  res.json({ id }); // return file ID to frontend
});

// Download endpoint — one-time access, decrypts on client
app.get('/download/:id', (req, res) => {
  const { id } = req.params;
  const file = vault[id];

  if (!file || file.expiresAt < Date.now()) return res.sendStatus(404);

  // Send original filename in header
  res.setHeader('X-Original-Filename', encodeURIComponent(file.originalName));
  res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  const stream = fs.createReadStream(file.path);
  stream.pipe(res);
  stream.on('close', () => {
    fs.unlink(file.path, () => { });
    delete vault[id];
  });
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
