// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Routes>
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        </Routes>
      </Routes>
    </Router>
  );
}

export default App;
