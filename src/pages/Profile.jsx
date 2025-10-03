import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile(){
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/user/transactions').then(r => setTransactions(r.data.transactions)).catch(err => {
      console.error(err);
    });
  }, []);

  if (!user) return <div style={{padding:20}}>Please login</div>;

  return (
    <div style={{padding:20}}>
      <h2>Profile</h2>
      <div>Name: {user.full_name || user.username}</div>
      <div>Mobile: {user.mobile}</div>
      <div>Payment: {user.payment_number || '-'}</div>
      <div>Balance: {Number(user.balance || 0).toFixed(2)}</div>

      <h3 style={{marginTop:16}}>Transactions</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr style={{borderBottom:'1px solid #ddd'}}><th>Date</th><th>Type</th><th>Amount</th><th>Balance</th><th>Note</th></tr></thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} style={{borderBottom:'1px solid #eee'}}>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.balance_after}</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
