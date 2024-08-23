import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsExpanded(false); // Reset expansion when opening new modal
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsExpanded(false); // Reset expansion when closing modal
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.navMenu}>
          <Link to="/home" style={styles.navLink}>
            Home
          </Link>
          <Link to="/" style={styles.navLink}> {/* Add a link to Seasons Page */}
            Seasons
          </Link>
        </nav>
        <h1 style={styles.title}>Favorites</h1>
      </header>

      <div style={styles.grid}>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => openModal(item)}
            >
              <img src={item.image || 'placeholder.jpg'} alt={item.title} style={styles.image} />
              <h2 style={styles.name}>{item.title}</h2>
              <p style={styles.description}>
                {item.description ? item.description.slice(0, 50) + '...' : 'No description available'}
              </p>
              <p style={styles.info}>Seasons: {item.seasons || 'N/A'}</p>
              <p style={styles.info}>Episodes: {item.episodes || 'N/A'}</p>
              <Link to={`/seasons/${item.id}`} style={styles.linkButton}>Go to Season</Link> {/* Link to SeasonsPage */}
            </div>
          ))
        ) : (
          <p style={styles.noFavorites}>No favorites added</p>
        )}
      </div>

      {selectedCard && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div
            style={isExpanded ? styles.modalContentExpanded : styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={toggleExpand}
          >
            <h2 style={styles.modalTitle}>{selectedCard.title}</h2>
            <img src={selectedCard.image || 'placeholder.jpg'} alt={selectedCard.title} style={styles.modalImage} />
            <p style={styles.modalDescription}>{selectedCard.description || 'No description available'}</p>
            <p style={styles.info}>Seasons: {selectedCard.seasons || 'N/A'}</p>
            <p style={styles.info}>Episodes: {selectedCard.episodes || 'N/A'}</p>
            <button style={styles.removeButton} onClick={() => removeFavorite(selectedCard.id)}>⭐</button>
            <button style={styles.closeButton} onClick={closeModal}>✗</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#BA712F',
      minHeight: '100vh',
      width: '100vw',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      marginBottom: '20px',
    },
    navMenu: {
      position: 'absolute',
      top: '60px',
      right: '50%',
      transform: 'translateX(50%)',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      padding: '0',
      zIndex: 1000,
    },
    navLink: {
      padding: '10px',
      textDecoration: 'none',
      color: '#F0FE02', // Yellow color
      fontSize: '1rem',
    },
    title: {
      fontSize: '2rem',
      textAlign: 'center',
      margin: '20px 0',
      color: '#fff',
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
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
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
    noFavorites: {
      color: '#fff',
      textAlign: 'center',
      marginTop: '20px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '600px',
      width: '100%',
      position: 'relative',
      transition: 'transform 0.3s ease',
    },
    modalContentExpanded: {
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '10px',
      maxWidth: '800px',
      width: '100%',
      position: 'relative',
      transition: 'transform 1.3s ease',
      transform: 'scale(1.1)',
    },
    modalImage: {
      width: '100%',
      height: '450px',
      objectFit: 'cover',
      borderRadius: '10px',
      marginBottom: '15px',
    },
    modalTitle: {
      fontSize: '1.75rem',
      marginBottom: '10px',
      color: '#333',
    },
    modalDescription: {
      fontSize: '1rem',
      color: '#666',
    },
    closeButton: {
      position: 'absolute',
      top: '-25px',
      right: '-15px',
      backgroundColor: 'transparent',
      color: 'red',
      border: 'none',
      padding: '5px',
      borderRadius: '1px',
      cursor: 'pointer',
      fontSize: '3rem',
      outline: 'none',
      boxShadow: 'none',
    },
    removeButton: {
      position: 'absolute',
      top: '-15px',
      right: '590px',
      backgroundColor: 'transparent',
      color: '#F00',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      outline: 'none',
      boxShadow: 'none',
    },
  linkButton: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    textAlign: 'center',
    cursor: 'pointer',
  },
};

export default FavoritesPage;
