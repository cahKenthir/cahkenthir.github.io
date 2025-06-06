require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.path.includes('video') ? 'videos' : 
                req.path.includes('face') ? 'faces' : 'images';
    const uploadDir = `uploads/${type}`;
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const validMimes = {
      'image/jpeg': true,
      'image/png': true,
      'image/webp': true,
      'video/mp4': true,
      'video/quicktime': true
    };
    cb(null, !!validMimes[file.mimetype]);
  }
});

app.use(cors());
app.use(express.json());
app.use('/results', express.static('results'));

// AI Services Configuration
const AI_SERVICES = {
  VIDEO: {
    url: process.env.AI_VIDEO_SERVICE || 'http://localhost:5001',
    apiKey: process.env.VIDEO_API_KEY
  },
  FACE: {
    url: process.env.AI_FACE_SERVICE || 'http://localhost:5002',
    apiKey: process.env.FACE_API_KEY
  },
  IMAGE: {
    url: process.env.AI_IMAGE_SERVICE || 'http://localhost:5003',
    apiKey: process.env.IMAGE_API_KEY
  }
};

// Enhanced File Processing
const processUpload = async (file, service, endpoint, formData) => {
  const serviceConfig = AI_SERVICES[service];
  
  try {
    const response = await axios.post(
      `${serviceConfig.url}/${endpoint}`,
      formData || file,
      {
        headers: {
          'Authorization': `Bearer ${serviceConfig.apiKey}`,
          ...(formData ? formData.getHeaders() : {})
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    return response.data;
  } catch (error) {
    console.error(`${service} Service Error:`, error.message);
    throw new Error(`${service} processing failed`);
  }
};

// Enhanced Routes
app.post('/api/video/generate', upload.single('file'), async (req, res) => {
  try {
    let result;
    if (req.body.text) {
      // Text-to-video
      result = await processUpload({
        text: req.body.text,
        duration: req.body.duration || 15,
        style: req.body.style || 'cinematic'
      }, 'VIDEO', 'generate');
    } else if (req.file) {
      // Image-to-video
      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path));
      formData.append('style', req.body.style || 'animation');
      result = await processUpload(formData, 'VIDEO', 'animate');
    } else {
      return res.status(400).json({ error: 'Text or file required' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/face/swap', upload.fields([
  { name: 'source', maxCount: 1 },
  { name: 'target', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.source || !req.files.target) {
      return res.status(400).json({ error: 'Source and target files required' });
    }

    const formData = new FormData();
    formData.append('source', fs.createReadStream(req.files.source[0].path));
    formData.append('target', fs.createReadStream(req.files.target[0].path));
    formData.append('blend', req.body.blend || 50);
    formData.append('color_match', req.body.color_match || 75);

    const result = await processUpload(formData, 'FACE', 'swap');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enhanced Image Processing
app.post('/api/image/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const action = req.body.action || 'enhance';
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));
    formData.append('action', action);
    
    if (req.body.options) {
      formData.append('options', JSON.stringify(req.body.options));
    }

    const result = await processUpload(formData, 'IMAGE', 'process');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OCR Functionality
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'OCR processing failed' });
  }
});

// Cleanup middleware
app.use((req, res, next) => {
  // Cleanup uploaded files after processing
  if (req.file) {
    fs.unlink(req.file.path, () => {});
  } else if (req.files) {
    Object.values(req.files).forEach(files => {
      files.forEach(file => fs.unlink(file.path, () => {}));
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Configured services:`);
  console.log(`- Video: ${AI_SERVICES.VIDEO.url}`);
  console.log(`- Face: ${AI_SERVICES.FACE.url}`);
  console.log(`- Image: ${AI_SERVICES.IMAGE.url}`);
});
