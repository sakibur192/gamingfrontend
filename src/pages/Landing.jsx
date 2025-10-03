import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing(){
  return (
    <div style={{padding:24, textAlign:'center'}}>
      <h1 style={{fontSize:36}}>Welcome to iTelBet</h1>
      <p>Play top games — login or signup to start.</p>
      <div style={{marginTop:12}}>
        <Link to="/signup" style={{marginRight:8}}>Signup</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
