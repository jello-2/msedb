import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';

// Import your page components
import AlgebraPage from './pages/AlgebraPage';
import LimitsPage from './pages/LimitsPage';
import HowToUse from './pages/HowToUse';
import Motivation from './pages/Motivation'
// Import other pages as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Actual Math Pages*/}
        <Route path="/algebra" element={<AlgebraPage />} />
        <Route path="/limits" element={<LimitsPage />} />

        {/* Info Pages*/}
        <Route path="/howtouse" element={<HowToUse />} />
        <Route path="/motivation" element={<Motivation />} />
      </Routes>
    </Router>
  );
};

export default App;