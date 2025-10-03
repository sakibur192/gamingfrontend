import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameLobby = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [cloudfrontId, setCloudfrontId] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      setRequestId(null);
      setCloudfrontId(null);
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data.games || response.data);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.response?.data?.details || 'Failed to load games. Please try again.');
        setRequestId(err.response?.data?.requestId);
        setCloudfrontId(err.response?.data?.cloudfrontId);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Game Lobby</h1>
      
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          {requestId && <p>Request ID: {requestId}</p>}
          {cloudfrontId && <p>CloudFront ID: {cloudfrontId}</p>}
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <p className="text-center text-gray-500">No games available.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{game.name || `Game ${index + 1}`}</h2>
              <p className="text-gray-600">{game.description || 'No description available'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameLobby;