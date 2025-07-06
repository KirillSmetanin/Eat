import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ setUser }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    const data = await res.json();
    if (data.error) setMsg(data.error);
    else {
      setUser(data);
      if (data.is_admin) navigate('/admin');
      else navigate('/orders');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Вход</h2>
      <input placeholder="Логин" value={login} onChange={e => setLogin(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Войти</button>
      {msg && <div style={{ color: 'red', marginTop: 10 }}>{msg}</div>}
    </form>
  );
}