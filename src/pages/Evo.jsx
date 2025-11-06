import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function EVOGameLauncher() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState(null);
  const [launching, setLaunching] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [activeGameId, setActiveGameId] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  // 🔍 Search filter now working with correct fields
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredGames(
      games.filter(
        (g) =>
          (g["Table Name"] || "").toLowerCase().includes(lower) ||
          (g["Game Type"] || "").toLowerCase().includes(lower)
      )
    );
  }, [search, games]);

  async function fetchGames() {
    setLoadingGames(true);
    setError(null);
    try {
      const res = await api.get("/evo/games");
      const data = res.data?.data || [];
      setGames(data);
      setFilteredGames(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load games");
    } finally {
      setLoadingGames(false);
    }
  }

  function cryptoRandomUuid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
      return crypto.randomUUID();
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  function buildUserAuthPayload(tableId) {
    return {
      uuid: cryptoRandomUuid(),
      player: {
        id: "demo_user",
        update: true,
        firstName: "John",
        lastName: "Demo",
        country: "BD",
        nickname: "demoJohn",
        language: "en",
        currency: "BDT",
        session: { id: "sess-demo-001", ip: "" }
      },
      config: {
        game: {
          category: "roulette",
          interface: "view1",
          table: { id: tableId }
        },
        channel: { wrapped: false, mobile: false }
      }
    };
  }

  async function handlePlay(table) {
    const tableId =
      table["Direct Launch Table ID"] ||
      table["Table ID"] ||
      null;

    if (!tableId) {
      alert("This table has no launch ID configured.");
      return;
    }

    setLaunching(true);
    setActiveGameId(tableId);

    try {
      const payload = buildUserAuthPayload(tableId);
      const res = await api.post("/evo/userauth", payload);
      const entry = res.data?.entry || res.data?.entryEmbedded || res.data?.launchUrl;

      if (!entry) throw new Error("Launch URL not found in response");

      setIframeUrl(
        entry.startsWith("http") ? entry : `${window.location.origin}${entry}`
      );
      document.getElementById("evo-game-iframe")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to launch game");
    } finally {
      setLaunching(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ==== GAME LIST ==== */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Live Tables</h2>

           {/* ==== GAME PLAYER ==== */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Game Player</h2>
            <div className="text-sm text-gray-500">
              {iframeUrl ? "Game loaded" : "Select a table to play"}
            </div>
          </div>

          <div className="w-full h-[70vh] bg-black/5 rounded overflow-hidden">
            {iframeUrl ? (
              <iframe
                id="evo-game-iframe"
                title="EVO Game"
                src={iframeUrl}
                style={{ width: "100%", height: "100%", border: "0" }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No game loaded
              </div>
            )}
          </div>
        </div>

          {loadingGames ? (
            <div className="text-sm text-gray-500">Loading games…</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[75vh] pr-2">
              {filteredGames.length === 0 && (
                <div className="text-sm text-gray-500">No games found.</div>
              )}

              {filteredGames.map((g, idx) => {
                const bet = g["Bet Limit"]?.BDT;
                const tableId = g["Direct Launch Table ID"] || g["Table ID"];
                return (
                  <div
                    key={tableId || idx}
                    className={`p-3 border rounded-md flex items-center justify-between cursor-pointer hover:bg-indigo-50 transition ${
                      activeGameId === tableId ? "ring-2 ring-indigo-200 bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">
                        {g["Table Name"] || `Table ${tableId}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {g["Game Type"] || "Live"} •{" "}
                        {bet
                          ? `Min: ${bet.min} ${bet.symbol} • Max: ${bet.max} ${bet.symbol}`
                          : "Limit: –"}
                      </div>
                    </div>

                    <button
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                      onClick={() => handlePlay(g)}
                      disabled={launching && activeGameId === tableId}
                    >
                      {launching && activeGameId === tableId ? "Launching…" : "Play"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

   

      </div>
    </div>
  );
}
