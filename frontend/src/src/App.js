import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);

  const generateVideo = async () => {
    try {
      const response = await axios.post('/api/video/generate', { text: prompt });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="app">
      <h1>IME AI STUDIO</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter video prompt"
      />
      <button onClick={generateVideo}>Generate Video</button>
      
      {result && (
        <div className="result">
          <p>Generated {result.frames} frames</p>
        </div>
      )}
    </div>
  );
}

export default App;