import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function FastSpin() {
  const [games, setGames] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedGameUrl, setSelectedGameUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const [backPressCount, setBackPressCount] = useState(0);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (token) {
          const res = await api.get("/fastspin/games", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setGames(res.data.games?.games || []);
          setBalance(parseFloat(res.data.balance) || 0);
        } else {
          const res = await api.get("/fastspin/test-fastspin");
          setGames(res.data.games);
        }
      } catch (err) {
        console.error("❌ Failed to fetch games:", err);
        setError("Failed to load games. Please try again.");
      }
    };
    fetchGames();
  }, [token]);

  useEffect(() => {
    if (selectedGameUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedGameUrl]);

  // Handle browser back button behavior
  useEffect(() => {
    if (!selectedGameUrl) return;

    const handlePopState = (e) => {
      e.preventDefault();

      if (backPressCount === 0) {
        setBackPressCount(1);
        alert("Press back again to exit the game");
        setTimeout(() => setBackPressCount(0), 2000);
        window.history.pushState(null, "", window.location.href);
      } else {
        setSelectedGameUrl(null);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedGameUrl, backPressCount]);

  const launchGame = async (gameCode, betAmount = 0) => {
    setLoading(true);
    setSelectedGameUrl(null);
    setError(null);

    try {
      if (token && user) {
        if (user.balance < betAmount) {
          setError("Insufficient balance to play this game.");
          setLoading(false);
          return;
        }
        const res = await api.post(
          "/fastspin/launch-game",
          { gameCode, betAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.url) {
          setSelectedGameUrl(res.data.url);
          setBalance((prev) => prev - betAmount);
        } else setError("Game launch failed: " + (res.data.error || "Unknown error"));
      } else {
        const res = await api.post("/fastspin/test-fastspin-launch", { gameCode });
        if (res.data.url) setSelectedGameUrl(res.data.url);
        else setError("Demo launch failed");
      }
    } catch (err) {
      setError("Error launching game: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------- STYLE FIXES ----------
  // Global defensive inline CSS (applies only while this component is mounted)
  // - Reset default body margin/padding
  // - Ensure border-box sizing so padding doesn't expand widths
  // - Prevent horizontal overflow just in case
  const globalStyle = `
    html, body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    *, *::before, *::after { box-sizing: inherit; }
  `;

  const containerStyle = {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(to bottom, #1a1a1a, #2a2a2a)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden", // guard against horizontal scroll
    boxSizing: "border-box",
  };

  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "16px",
    flex: 1,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "16px", // keep spacing inside the viewport
  };

  const gameCardStyle = {
    display: "flex",
    flexDirection: "column",
    width: "220px",
    cursor: "pointer",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "rgba(55, 65, 81, 0.5)",
    backdropFilter: "blur(8px)",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    boxSizing: "border-box",
  };

  const gameImageWrapper = {
    position: "relative",
    height: "160px",
    overflow: "hidden",
  };

  const gameImage = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    display: "block", // removes bottom whitespace from img
    maxWidth: "100%",
  };

  const gameNameStyle = {
    padding: "12px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
    color: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  // ---------- END STYLE FIXES ----------

  return (
    <div style={containerStyle}>
      <style>{globalStyle}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
        <h6
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            background: "linear-gradient(to right, #9f7aea, #ed64a6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          🎰 FastSpin
        </h6>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "#2d3748",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              padding: "16px",
              boxSizing: "border-box",
            }}
          >
            <h3 style={{ color: "#f56565", fontWeight: "700", margin: 0 }}>⚠️ Error</h3>
            <p style={{ marginTop: "8px", color: "#e2e8f0" }}>{error}</p>
            <button
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "#f56565",
                color: "white",
                borderRadius: "12px",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Game Iframe (overlay) */}
      {selectedGameUrl ? (
        <div
          style={{
            position: "fixed",
            // Instead of width:100vw / height:100vh (which often causes overflow), use inset 0
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            background: "#111",
            zIndex: 9999,
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          {/* Back Button */}
          <div style={{ zIndex: 10 }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#e11d48",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => setSelectedGameUrl(null)}
            >
              ⬅ Back to Games
            </button>
          </div>

          {/* Iframe Container */}
          <div
            style={{
              flex: 1,
              marginTop: "16px",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              minHeight: 0, // important: allow flex child to shrink properly in some browsers
            }}
          >
            {/* Loading Overlay */}
            {loading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.75)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    border: "4px solid #ccc",
                    borderTop: "4px solid #8b5cf6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ color: "#fff", marginTop: "16px", fontWeight: "bold" }}>Loading game...</p>
              </div>
            )}

            {/* Game Iframe */}
            <iframe
              title="FastSpin Game"
              src={selectedGameUrl}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              allow="autoplay; fullscreen; encrypted-media; clipboard-write"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setLoading(false)}
            />
          </div>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        <div style={gridStyle}>
          {games.length === 0 ? (
            <p style={{ textAlign: "center", color: "#a0aec0", fontSize: "16px", width: "100%" }}>
              ⚠️ No games available at the moment. {games.length}
            </p>
          ) : (
            games.map((game) => (
              <div
                key={game.gameCode}
                style={gameCardStyle}
                onClick={() => launchGame(game.gameCode, 10)}
              >
                <div style={gameImageWrapper}>
                  <img
                    src={game.thumbnail ? `https://api-egame-staging.fsuat.com/${game.thumbnail}` : "/fallback-game-image.jpg"}
                    alt={game.gameName}
                    style={gameImage}
                    onError={(e) => (e.target.src = "/fallback-game-image.jpg")}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  />
                </div>
                <div style={gameNameStyle}>{game.gameName}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Loading overlay when launching (keeps user informed) */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid #e2e8f0",
                borderTop: "4px solid #9f7aea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ marginTop: "16px", fontSize: "18px", fontWeight: "600" }}>Launching game...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
