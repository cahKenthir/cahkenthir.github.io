import React, { useRef, useState } from 'react';
import axios from 'axios';

const VideoEditor = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post('/api/video/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        }
      });
      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="editor-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
        accept="video/*"
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload Video
      </button>
      {progress > 0 && <progress value={progress} max="100" />}
    </div>
  );
};

export default VideoEditor;