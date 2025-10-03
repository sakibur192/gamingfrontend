import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Lobby(){
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/games').then(r => {
      setGames(r.data.gameList || []);
    }).catch(err => {
      console.error('Games fetch error', err.response?.data || err.message);
      alert('Failed to fetch games');
    }).finally(()=>setLoading(false));
  }, []);

  const launch = async (gameID) => {
    if (!user) return window.location.href = '/login';
    try {
      const payload = { symbol: gameID, externalPlayerId: String(user.id), playMode: 'REAL', language: 'en', country: user.country || 'BD' };
      const r = await api.post('/game/url', payload);
      const url = r.data.gameURL || r.data.url || (r.data && r.data.gameURL);
      if (url) window.open(url, '_blank');
      else alert('Game URL not returned');
    } catch (err) {
      console.error('Launch error', err.response?.data || err.message);
      alert('Failed to launch');
    }
  };

  if (loading) return <div style={{padding:20}}>Loading games...</div>;
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:12, padding:12}}>
      {games.map(g => (
        <div key={g.gameID} onClick={()=>launch(g.gameID)} style={{border:'1px solid #ddd', padding:8, cursor:'pointer'}}>
          <img src={`https://common-static.ppgames.net/gs2c/common/lobby/v1/apps/slots-lobby-assets/${g.gameID}/${g.gameID}_200x200_NB.png`} alt={g.gameName} style={{width:'100%', height:120, objectFit:'contain'}} onError={(e)=> e.target.src='/fallback.png'} />
          <div style={{marginTop:8, fontWeight:600}}>{g.gameName}</div>
        </div>
      ))}
    </div>
  );
}
