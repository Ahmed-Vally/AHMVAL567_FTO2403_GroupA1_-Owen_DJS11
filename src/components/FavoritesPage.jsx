import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Favorites</h1>
      <Link to="/" style={styles.backButton}>Back to Home</Link>

      <div style={styles.grid}>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image || 'placeholder.jpg'} alt={item.name} style={styles.image} />
              <h2 style={styles.name}>{item.name}</h2>
              <p style={styles.description}>
                {item.description ? item.description.slice(0, 50) + '...' : 'No description available'}
              </p>
              <p style={styles.info}>Seasons: {item.seasons || 'N/A'}</p>
              <p style={styles.info}>Episodes: {item.episodes || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No favorites available</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#BA712F',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  backButton: {
    display: 'block',
    margin: '20px auto',
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
  },
  card: {
    flex: '1 1 calc(25% - 20px)',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px 10px 0 0',
  },
  name: {
    fontSize: '1.25rem',
    margin: '10px 0',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
    overflow: 'hidden',
  },
  info: {
    fontSize: '0.9rem',
    color: '#888',
    marginTop: '5px',
  },
};

export default FavoritesPage;
