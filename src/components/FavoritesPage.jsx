import React, { useState, useEffect } from 'react';
import Favorites from './Favorites';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Get favorites from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Your Favorite Podcasts</h1>
      <Favorites favorites={favorites} />
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '20px',
    backgroundColor: '#BA712F',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#fff',
  },
};

export default FavoritesPage;
