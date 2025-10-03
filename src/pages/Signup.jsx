import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    email: '',
    password: '',
    refer_code: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // clear that field error
  };

  const validate = () => {
    let errs = {};

    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    // allow digits only for mobile; adjust regex to match backend rules if needed
    if (!/^\d{7,20}$/.test(form.mobile.trim()))
      errs.mobile = 'Mobile must be 7-20 digits';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      errs.email = 'Valid email is required';
    if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    // refer_code is optional; if provided you can validate format (e.g. /^REF[0-9A-Z]{6}$/) if you want

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    // prepare payload: trim & normalize
    const payload = {
      full_name: form.full_name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      refer_code: form.refer_code.trim() || undefined
    };

    try {
      const res = await api.post('/auth/signup', payload);
      // expect res.data.token and res.data.user
      login(res.data.token, res.data.user);
      nav('/lobby');
    } catch (err) {
      // robust error extraction
      const serverErr =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Signup failed';
      setErrors({ api: serverErr });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        margin: '24px auto',
        padding: 16,
        border: '1px solid #ddd',
        borderRadius: 8
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Signup</h2>

      {errors.api && (
        <div style={{ color: 'red', marginBottom: 8 }}>{errors.api}</div>
      )}

      <input
        name="full_name"
        placeholder="Full name"
        value={form.full_name}
        onChange={handleChange}
        autoFocus
        style={{ display: 'block', width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.full_name && <small style={{ color: 'red' }}>{errors.full_name}</small>}

      <input
        name="mobile"
        placeholder="Mobile"
        value={form.mobile}
        onChange={handleChange}
        inputMode="numeric"
        pattern="\d*"
        style={{ display: 'block', width: '100%', marginTop: 8, marginBottom: 4, padding: 8 }}
      />
      {errors.mobile && <small style={{ color: 'red' }}>{errors.mobile}</small>}

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        type="email"
        style={{ display: 'block', width: '100%', marginTop: 8, marginBottom: 4, padding: 8 }}
      />
      {errors.email && <small style={{ color: 'red' }}>{errors.email}</small>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        style={{ display: 'block', width: '100%', marginTop: 8, marginBottom: 4, padding: 8 }}
      />
      {errors.password && <small style={{ color: 'red' }}>{errors.password}</small>}

      <input
        name="refer_code"
        placeholder="Refer code (optional)"
        value={form.refer_code}
        onChange={handleChange}
        style={{ display: 'block', width: '100%', marginTop: 8, marginBottom: 12, padding: 8 }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? '#6b7280' : '#0ea5e9',
          color: '#fff',
          padding: '8px 12px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Signing up...' : 'Signup'}
      </button>
    </form>
  );
}
