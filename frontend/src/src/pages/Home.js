import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VideoEditor from '../components/VideoEditor';
import FaceSwap from '../components/FaceSwap';

const Home = () => {
  return (
    <Router>
      <nav>
        <Link to="/video">Video Editor</Link>
        <Link to="/face">Face Swap</Link>
      </nav>

      <Routes>
        <Route path="/video" element={<VideoEditor />} />
        <Route path="/face" element={<FaceSwap />} />
      </Routes>
    </Router>
  );
};

export default Home;