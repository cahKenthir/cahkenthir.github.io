require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// API Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// AI Service Proxy
const AI_SERVICES = {
  VIDEO_GENERATION: process.env.AI_VIDEO_SERVICE || 'http://localhost:5001',
  FACE_SWAP: process.env.AI_FACE_SWAP_SERVICE || 'http://localhost:5002',
  IMAGE_EDIT: process.env.AI_IMAGE_SERVICE || 'http://localhost:5003'
};

app.post('/api/ai/video/generate', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICES.VIDEO_GENERATION}/generate`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Video Service Error:', error.message);
    res.status(500).json({ error: 'AI video generation failed' });
  }
});

app.post('/api/ai/face/swap', upload.array('files', 2), async (req, res) => {
  try {
    const formData = new FormData();
    req.files.forEach(file => {
      formData.append('files', fs.createReadStream(file.path));
    });
    
    const response = await axios.post(`${AI_SERVICES.FACE_SWAP}/swap`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Face Swap Service Error:', error.message);
    res.status(500).json({ error: 'Face swap failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
