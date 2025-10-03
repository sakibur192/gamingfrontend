import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      nav('/lobby');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: 500,
        margin: '24px auto',
        padding: 16,
        border: '1px solid #ddd',
        borderRadius: 8
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Login</h2>

      <input
        name="identifier"
        placeholder="Email or Mobile"
        value={form.identifier}
        onChange={handle}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handle}
        required
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />

      <button
        type="submit"
        style={{
          background: '#10b981',
          color: '#fff',
          padding: '8px 12px',
          width: '100%',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Login
      </button>
    </form>
  );
}
