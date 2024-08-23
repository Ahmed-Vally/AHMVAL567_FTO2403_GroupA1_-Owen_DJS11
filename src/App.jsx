import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage'; // Example import for HomePage
import FavoritesPage from './components/FavoritesPage'; // Import for FavoritesPage


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path='/home' element={<HomePage />}/>
      </Routes>
    </Router>
  );
}

export default App;
