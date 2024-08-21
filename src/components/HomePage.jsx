import React, { useState, useEffect } from 'react';
import SortDropdown from './SortDropDown';

function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sortOption, setSortOption] = useState('none');
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const history = useHistory();

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
    // Load favorites from localStorage on component mount
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  // Sort data based on sortOption
  const sortedData = [...filteredData].sort((a, b) => {
    const nameA = typeof a.name === 'string' ? a.name : 'a';
    const nameB = typeof b.name === 'string' ? b.name : 'b';

    if (sortOption === 'asc') {
      return nameA.localeCompare(nameB);
    } else if (sortOption === 'desc') {
      return nameB.localeCompare(nameA);
    }
    return 0; // No sorting
  });

  const toggleFavorite = (podcast) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((item) => item.id === podcast.id);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter((item) => item.id !== podcast.id)
        : [...prevFavorites, podcast];

      // Save updated favorites to localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const handleGoToFavorites = () => {
    history.push('/favorites');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Podcast List</h1>

      <div style={styles.controlsContainer}>
        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        <button style={styles.favoritesButton} onClick={handleGoToFavorites}>
          View Favorites
        </button>
      </div>

      <div style={styles.grid}>
        {sortedData.length > 0 ? (
          sortedData.map((item) => (
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
          ))
        ) : (
          <p>No podcasts available</p>
        )}
      </div>

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
    height: '300px',
    objectFit: 'fill',
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
  favoritesButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default HomePage;
