import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SeasonsPage = () => {
  const { podcastId } = useParams();
  const [seasonData, setSeasonData] = useState({ seasons: [], seasonEpisodes: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentAudioId, setCurrentAudioId] = useState(null);
  const [playbackTime, setPlaybackTime] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${podcastId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.seasons && result.seasons.length > 0) {
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [podcastId]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleFavorite = (episode) => {
    const updatedFavorites = [...favorites, episode];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handlePlayPause = (episodeId, audio) => {
    if (currentAudio && currentAudioId !== episodeId) {
      currentAudio.pause();
    }

    if (currentAudio && currentAudioId === episodeId) {
      currentAudio.pause();
      setCurrentAudio(null);
      setCurrentAudioId(null);
    } else {
      audio.play();
      setCurrentAudio(audio);
      setCurrentAudioId(episodeId);
    }
  };

  const handleTimeUpdate = (episodeId, audio) => {
    if (audio) {
      setPlaybackTime(prev => ({
        ...prev,
        [episodeId]: audio.currentTime
      }));
    }
  };

  const handleFavoriteClick = (episode) => {
    handleFavorite(episode);
  };

  const renderEpisodes = (episodes) => {
    return (
      <ul style={styles.episodeList}>
        {episodes.map((episode) => (
          <li key={episode.id} style={styles.episode}>
            <h4 style={styles.episodeTitle}>{episode.title}</h4>
            <audio
              controls
              onPlay={() => handlePlayPause(episode.id, new Audio(episode.file))}
              onPause={() => setCurrentAudioId(null)}
              onTimeUpdate={() => handleTimeUpdate(episode.id, currentAudio)}
              src={episode.file}
              style={styles.audioPlayer}
            >
              <source src={episode.file} />
              Your browser does not support the audio element.
            </audio>
            <button onClick={() => handleFavoriteClick(episode)} style={styles.favoriteButton}>
              {favorites.some(fav => fav.id === episode.id) ? '☆' : '★'}
            </button>
            <p>Last played at: {Math.floor(playbackTime[episode.id] || 0)} seconds</p>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backButton}>
        Back to Home
      </button>
      <h1 style={styles.title}>Seasons</h1>
      {seasonData.seasons && seasonData.seasons.length > 0 ? (
        seasonData.seasons.map((season) => (
          <div key={season.id} style={styles.season}>
            <h2>Season {season.number} - {season.title}</h2>
            <img src={season.image || 'placeholder.jpg'} alt={season.title} style={styles.seasonImage} />
            {renderEpisodes(seasonData.seasonEpisodes[season.id] || [])}
          </div>
        ))
      ) : (
        <p>No seasons available</p>
      )}
    </div>
  );
};

const styles = {
  // Your existing styles...
};

export default SeasonsPage;
