import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SortDropdown from './SortDropdown';
import { format, parseISO } from 'date-fns';
import FavoritesPage from './FavoritesPage';

const genreMap = {
  "1": "Personal Growth",
  "2": "Investigative Journalism",
  "3": "History",
  "4": "Comedy",
  "5": "Entertainment",
  "6": "Business",
  "7": "Fiction",
  "8": "News",
  "9": "Kids and Family"
};

function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sortOption, setSortOption] = useState('asc'); // Default sorting option
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

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
          console.log('Fetched Data:', result);
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

    if (sortOption === 'asc') {
      filteredAndSortedData.sort((a, b) => {
        const nameA = a.title ? a.title.toUpperCase() : 'A';
        const nameB = b.title ? b.title.toUpperCase() : 'Z';
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === 'desc') {
      filteredAndSortedData.sort((a, b) => {
        const nameA = a.title ? a.title.toUpperCase() : 'Z';
        const nameB = b.title ? b.title.toUpperCase() : 'A';
        return nameB.localeCompare(nameA);
      });
    }

    console.log('Filtered and Sorted Data:', filteredAndSortedData);
    setFilteredData(filteredAndSortedData);
  }, [sortOption, data]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsExpanded(false);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const getGenreNames = (genreIds) => {
    return genreIds.map(id => genreMap[id] || id).join(', ');
  };

  const formatDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Unknown Date';
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.navMenu}>
          <Link to="/favorites" style={styles.navLink}>
            Favorites ☆
          </Link>
        </nav>
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
              <img src={item.image || 'placeholder.jpg'} alt={item.title} style={styles.image} />
              <h2 style={styles.name}>{item.title}</h2>
              <p style={styles.description}>
                {item.description ? item.description.slice(0, 50) + '...' : 'No description available'}
              </p>
              <p style={styles.info}>Seasons: {item.seasons || 'N/A'}</p>
              <p style={styles.info}>Episodes: {item.episodes || 'N/A'}</p>
              <p style={styles.info}>Genres: {getGenreNames(item.genres || [])}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No podcasts available</p>
      )}

      {selectedCard && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div
            style={isExpanded ? styles.modalContentExpanded : styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={toggleExpand}
          >
            <div style={styles.modalHeader}>
              <button onClick={() => toggleFavorite(selectedCard)} style={styles.favoriteButton}>
                {favorites.some(favorite => favorite.id === selectedCard.id) ? '★' : '☆'}
              </button>
              <button onClick={closeModal} style={styles.closeButton}>×</button>
            </div>
            <h2 style={styles.modalTitle}>{selectedCard.title}</h2>
            <img src={selectedCard.image || 'placeholder.jpg'} alt={selectedCard.title} style={styles.modalImage} />
            <p style={styles.modalDescription}>{selectedCard.description || 'No description available'}</p>
            <p style={styles.info}>Episodes: {selectedCard.episodes || 'N/A'}</p>
            <p style={styles.info}>Genres: {getGenreNames(selectedCard.genres || [])}</p>
            <p style={styles.info}>Last Updated: {formatDate(selectedCard.updated)}</p>
            
            <button onClick={() => navigate(`/seasons/${selectedCard.id}`)} style={styles.listenNowButton}>
              Listen Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#CFA607',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  navMenu: {
    marginBottom: '20px',
  },
  navLink: {
    fontSize: '1.25rem',
    color: '#fff',
    textDecoration: 'none',
  },
  title: {
    fontSize: '2rem',
    margin: '0',
    color: '#333',
  },
  controlsContainer: {
    marginBottom: '20px',
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
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80%',
    overflowY: 'auto',
    transition: 'max-height 0.2s ease',
  },
  modalContentExpanded: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: 'none',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  modalTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
  },
  modalDescription: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '10px',
  },
  closeButton: {
    fontSize: '1.5rem',
    backgroundColor: 'transparent',
    color: 'red',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  listenNowButton: {
    marginTop: '10px',
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  favoriteButton: {
    backgroundColor: 'transparent',
    color: '#FFD700',
    fontSize: '1.5rem',
    border: 'none',
    cursor: 'pointer',
    marginRight: 'auto',
  }
};

export default HomePage;
