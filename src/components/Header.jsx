import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(){
  const { user, logout } = useAuth();
  return (
    <header style={{ width:'100vw',  background:'#000', color:'#fff', padding:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
    
      <div style={{marginLeft:'20px',color:'#ff7a00', fontWeight:700}}>iTelBet</div>
    
      <nav style={{display:'flex', gap:12, alignItems:'center'}}>
        <Link to="/lobby" style={{color:'#fff'}}>EVO</Link>
         <Link to="/pp" style={{color:'#fff'}}>PP</Link>
        {user ? (
          <>
            <div>Hi, {user.full_name}</div>
            <div>Balance: <strong>{Number(user.balance || 0).toFixed(2)}</strong></div>
            <Link to="/profile" style={{color:'#fff'}}>Profile</Link>
            <button onClick={logout} style={{background:'#c53030', color:'#fff', padding:'6px 10px', borderRadius:6}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{color:'#fff'}}>Login</Link>
            <Link to="/signup" style={{  marginRight:'20px', background:'#1d4ed8', color:'#fff', padding:'6px 10px', borderRadius:6}}>Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
