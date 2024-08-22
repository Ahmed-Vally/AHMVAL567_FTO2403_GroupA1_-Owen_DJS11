import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import SortDropdown from './SortDropdown';
import Favorites from './Favorites';

function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sortOption, setSortOption] = useState('none');
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for burger menu
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const apiUrl = 'https://podcast-api.netlify.app';

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);
          setFilteredData(result);
          console.log('Fetched Data:', result); // Debugging line
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredAndSortedData = [...data];

    // Sorting logic
    if (sortOption === 'asc') {
      filteredAndSortedData.sort((a, b) => {
        const nameA = a.name ? a.name.toUpperCase() : 'A';
        const nameB = b.name ? b.name.toUpperCase() : 'Z';
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === 'desc') {
      filteredAndSortedData.sort((a, b) => {
        const nameA = a.name ? a.name.toUpperCase() : 'Z';
        const nameB = b.name ? b.name.toUpperCase() : 'A';
        return nameB.localeCompare(nameA);
      });
    }

    console.log('Filtered and Sorted Data:', filteredAndSortedData); // Debugging line
    setFilteredData(filteredAndSortedData);
  }, [sortOption, data]);

  useEffect(() => {
    // Load favorites from local storage on initial render
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    // Save favorites to local storage whenever favorites change
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const toggleFavorite = (podcast) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((item) => item.id === podcast.id)) {
        return prevFavorites.filter((item) => item.id !== podcast.id);
      } else {
        return [...prevFavorites, podcast];
      }
    });
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.menuButton} onClick={handleMenuToggle}>
          ☰
        </button>
        {isMenuOpen && (
          <nav style={styles.navMenu}>
            <Link to="/favorites" onClick={handleMenuToggle} style={styles.navLink}>
              View Favorites
            </Link>
          </nav>
        )}
        <h1 style={styles.title}>Podcast List</h1>
      </header>

      <div style={styles.controlsContainer}>
        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      {filteredData.length > 0 ? (
        <div style={styles.grid}>
          {filteredData.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => openModal(item)}
            >
              <img src={item.image || 'placeholder.jpg'} alt={item.name} style={styles.image} />
              <h2 style={styles.name}>{item.name}</h2>
              <p style={styles.description}>
                {item.description ? item.description.slice(0, 50) + '...' : 'No description available'}
              </p>
              <p style={styles.info}>Seasons: {item.seasons || 'N/A'}</p>
              <p style={styles.info}>Episodes: {item.episodes || 'N/A'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No podcasts available</p>
      )}

      {selectedCard && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedCard.image || 'placeholder.jpg'} alt={selectedCard.name} style={styles.modalImage} />
            <h2 style={styles.modalTitle}>{selectedCard.name}</h2>
            <p style={styles.modalDescription}>{selectedCard.description || 'No description available'}</p>
            <p style={styles.info}>Seasons: {selectedCard.seasons || 'N/A'}</p>
            <p style={styles.info}>Episodes: {selectedCard.episodes || 'N/A'}</p>
            <button style={styles.favoriteButton} onClick={() => toggleFavorite(selectedCard)}>
              {favorites.some((item) => item.id === selectedCard.id) ? 'Unfavorite' : 'Favorite'}
            </button>
            <button style={styles.closeButton} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#BA712F',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
 
  navMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    padding: '10px',
    zIndex: 1000,
  },
  navLink: {
    display: 'block',
    padding: '10px',
    textDecoration: 'none',
    color: '#333',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  controlsContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
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
  },
  modalImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  modalTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  modalDescription: {
    fontSize: '1rem',
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  favoriteButton: {
    position: 'absolute',
    top: '50px',
    right: '10px',
    backgroundColor: '#f39c12',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default HomePage;
