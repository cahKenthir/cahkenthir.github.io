const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy to AI services
app.use('/api/video', createProxyMiddleware({
  target: process.env.AI_VIDEO_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/video': '' }
}));

app.use('/api/face', createProxyMiddleware({
  target: process.env.AI_FACE_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/face': '' }
}));

app.use('/api/image', createProxyMiddleware({
  target: process.env.AI_IMAGE_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/image': '' }
}));

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});