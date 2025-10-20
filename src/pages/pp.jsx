import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PP() {
  const [games, setGames] = useState([]);
  const [currentGameUrl, setCurrentGameUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("https://backend-tw4p.onrender.com/api/pp/getCasinoGames")
      .then((res) => {
        if (res.data?.games) setGames(res.data.games);
      })
      .catch((err) => console.error("Error fetching games:", err))
      .finally(() => setLoading(false));
  }, []);

  const getIconUrl = (gameId) =>
    `https://common-static.ppgames.net/gs2c/common/lobby/v1/apps/slots-lobby-assets/${gameId}/${gameId}_260x350_NB.png`;

  const handlePlayClick = async (game) => {
    try {
      const playerId = "player123"; // Replace with actual player ID
      const res = await axios.post("https://backend-tw4p.onrender.com/api/pp/getGameUrl", {
        gameId: game.gameID,
        playerId,
        currency: "USD",
        platform: "WEB",
        language: "en",
        playMode: "REAL",
        country: "US",
      });

      if (res.data?.gameURL) {
        setCurrentGameUrl(res.data.gameURL);
      } else {
        alert("Failed to get game URL. Check console for details.");
      }
    } catch (err) {
      console.error("Failed to get game URL:", err);
      alert("Failed to launch game. Check console for details.");
    }
  };

  return (
    <div style={{ background: "#0d0d0d", color: "white", minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        .page-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width:100vw ;
          overflow: hidden;
        }

        .header {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          padding: 15px;
          background: linear-gradient(to right, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .grid-container {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          justify-content: center;
          align-content: start;
        }

        .game-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          height:190px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .game-card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .game-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }

        .game-name {
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          margin: 6px 0;
          padding: 0 5px;
          color: #ffffff;
        }

        .play-button {
          display: block;
          margin: 0 auto 8px auto;
          padding: 5px 10px;
          background: linear-gradient(to right, #007bff, #6f42c1);
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .play-button:hover {
          background: linear-gradient(to right, #0056b3, #4b0082);
        }

        .iframe-container {
          width: 100%;
          height: 100vh;
          width:100vw;
          display: flex;
          flex-direction: column;
        }

        .iframe-container iframe {
          flex: 1;
          border: none;
        }

        .back-button {
          background: #ff3333;
          color: white;
          font-size: 14px;
          font-weight: bold;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin: 10px auto;
          display: block;
          transition: background 0.2s ease;
        }

        .back-button:hover {
          background: #cc0000;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
      `}</style>

      {!currentGameUrl && (
        <div className="page-container">
          <div className="header">🎰 Pragmatic Play Games</div>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "40px", color: "#bbb" }}>
              Loading games...
            </div>
          ) : (
            <div className="grid-container">
              {games.map((game) => (
                <div key={game.gameID} className="game-card">
                  <img
                    src={getIconUrl(game.gameID)}
                    alt={game.gameName}
                    className="game-image"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/120x120?text=No+Image")
                    }
                  />
                  <div className="game-name">{game.gameName}</div>
                  <button className="play-button" onClick={() => handlePlayClick(game)}>
                    ▶ Play
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentGameUrl && (
        <div className="iframe-container">
          <iframe
            src={currentGameUrl}
            title="Pragmatic Play Game"
            allowFullScreen
          />
          <button className="back-button" onClick={() => setCurrentGameUrl(null)}>
            ⬅ Back to Lobby
          </button>
        </div>
      )}
    </div>
  );
}
