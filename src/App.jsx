import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import FavoritesPage from './components/FavoritesPage';
import SeasonsPage from './components/SeasonsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage to root path */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/seasons/:podcastId" element={<SeasonsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
