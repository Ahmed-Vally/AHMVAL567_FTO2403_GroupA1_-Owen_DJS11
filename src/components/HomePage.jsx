import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SortDropdown from './SortDropdown';
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
  const [sortOption, setSortOption] = useState('none');
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [seasonData, setSeasonData] = useState({});
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

  const fetchSeasonData = async (id) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (result.seasons && result.seasons.length > 0) {
        // Store the episodes for each season
        const seasonMap = result.seasons.reduce((acc, season) => {
          acc[season.id] = season.episodes || [];
          return acc;
        }, {});
        setSeasonData({
          ...result,
          seasons: result.seasons,
          seasonEpisodes: seasonMap
        });
      } else {
        setSeasonData({ seasons: [], seasonEpisodes: {} });
      }
    } catch (error) {
      console.error('Failed to fetch season data:', error);
    }
  };

  const openModal = (card) => {
    setSelectedCard(card);
    fetchSeasonData(card.id); // Fetch season data for the selected podcast
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

  const renderEpisodes = (episodes) => {
    return (
      <ul style={styles.episodeList}>
        {episodes.map((episode) => (
          <li key={episode.id} style={styles.episode}>
            <Link to={`/episodes/${episode.id}`} style={styles.episodeLink}>
              {episode.title}
            </Link>
          </li>
        ))}
      </ul>
    );
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
            <h2 style={styles.modalTitle}>{selectedCard.title}</h2>
            <img src={selectedCard.image || 'placeholder.jpg'} alt={selectedCard.title} style={styles.modalImage} />
            <p style={styles.modalDescription}>{selectedCard.description || 'No description available'}</p>
            <p style={styles.info}>Seasons: {selectedCard.seasons || 'N/A'}</p>
            <p style={styles.info}>Episodes: {selectedCard.episodes || 'N/A'}</p>
            <p style={styles.info}>Genres: {getGenreNames(selectedCard.genres || [])}</p>

            <div style={styles.seasonsContainer}>
              {seasonData.seasons && seasonData.seasons.length > 0 ? (
                seasonData.seasons.map((season) => (
                  <div key={season.id} style={styles.season}>
                    <h3>Season {season.number} - {season.title}</h3>
                    {renderEpisodes(seasonData.seasonEpisodes[season.id] || [])}
                  </div>
                ))
              ) : (
                <p>No seasons available</p>
              )}
            </div>
            
            <button onClick={() => toggleFavorite(selectedCard)} style={styles.favoriteButton}>
              {favorites.some(favorite => favorite.id === selectedCard.id) ? '★' : '☆'}
            </button>
            <button onClick={closeModal} style={styles.closeButton}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
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
    maxWidth: '600px',
    width: '100%',
    position: 'relative',
    maxHeight: '80vh',
    overflowY: 'auto',
    transition: 'transform 0.3s ease',
  },
  modalContentExpanded: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    maxWidth: '800px',
    width: '100%',
    position: 'relative',
    transform: 'scale(1.1)',
    maxHeight: '80vh',
    overflowY: 'auto',
    transition: 'transform 1.3s ease',
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
  favoriteButton: {
    position: 'absolute',
    top: '-15px',
    left: '-10px',
    backgroundColor: 'transparent',
    color: 'Yellow',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '2.3rem',
    outline: 'none',
    boxShadow: 'none',
  },
  seasonsContainer: {
    marginTop: '20px',
  },
  season: {
    marginBottom: '20px',
  },
  episodeList: {
    listStyleType: 'none',
    padding: 0,
  },
  episode: {
    marginBottom: '10px',
  },
  episodeLink: {
    textDecoration: 'none',
    color: '#007BFF',
  },
};

export default HomePage;
