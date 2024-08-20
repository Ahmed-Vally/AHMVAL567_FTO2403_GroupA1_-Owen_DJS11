import React, { useState, useEffect } from 'react';

function HomePage() {
  const [data, setData] = useState([]); // State to store API data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors
  const [selectedCard, setSelectedCard] = useState(null); // State to manage the selected card

  useEffect(() => {
    const apiUrl = 'https://podcast-api.netlify.app'; // API endpoint

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('API response:', result); // Log the API response to check its structure

        if (Array.isArray(result)) {
          setData(result); // Directly set the data without filtering or sorting
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
  }, []); // Empty dependency array means this runs once on mount

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
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
      {data.length > 0 ? (
        <div style={styles.grid}>
          {data.map((item) => (
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
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
  },
  card: {
    flex: '1 1 calc(25% - 20px)', // Adjusted to make 4 cards per row
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
    objectFit: 'full',
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
};

export default HomePage;
