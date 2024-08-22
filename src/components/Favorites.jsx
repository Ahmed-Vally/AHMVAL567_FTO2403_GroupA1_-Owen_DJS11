// src/components/Favorites.jsx

import React from 'react';

const Favorites = ({ favorites }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Favorite Podcasts</h2>
      <div style={styles.grid}>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image || 'placeholder.jpg'} alt={item.name} style={styles.image} />
              <h3 style={styles.name}>{item.name}</h3>
              <p style={styles.description}>
                {item.description ? item.description.slice(0, 50) + '...' : 'No description available'}
              </p>
            </div>
          ))
        ) : (
          <p>No favorites added</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#333',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
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
    borderRadius: '10px',
  },
  name: {
    fontSize: '1.25rem',
    margin: '10px 0',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
  },
};

export default Favorites;
    