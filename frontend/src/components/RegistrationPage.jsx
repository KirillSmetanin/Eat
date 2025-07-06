import React, { useState } from 'react';

const initial = { first_name: '', last_name: '', phone: '', email: '', login: '', password: '' };

function validate({ first_name, last_name, phone, email, login, password }) {
  const errors = {};
  if (!first_name.match(/^[А-Яа-яЁё\s]+$/)) errors.first_name = 'Имя: только кириллица и пробелы';
  if (!last_name.match(/^[А-Яа-яЁё\s]+$/)) errors.last_name = 'Фамилия: только кириллица и пробелы';
  if (!phone.match(/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/)) errors.phone = 'Телефон: формат +7(XXX)-XXX-XX-XX';
  if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) errors.email = 'Некорректный email';
  if (!login.match(/^[А-Яа-яЁё0-9]{6,}$/)) errors.login = 'Логин: кириллица, не менее 6 символов';
  if (password.length < 6) errors.password = 'Пароль: минимум 6 символов';
  return errors;
}

export default function RegistrationPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setMsg('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.error) setMsg(data.error);
    else setMsg('Регистрация успешна! Теперь войдите.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Регистрация</h2>
      <input name="first_name" placeholder="Имя" value={form.first_name} onChange={handleChange} />
      {errors.first_name && <div style={{ color: 'red' }}>{errors.first_name}</div>}
      <input name="last_name" placeholder="Фамилия" value={form.last_name} onChange={handleChange} />
      {errors.last_name && <div style={{ color: 'red' }}>{errors.last_name}</div>}
      <input name="phone" placeholder="Телефон +7(XXX)-XXX-XX-XX" value={form.phone} onChange={handleChange} />
      {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
      <input name="login" placeholder="Логин" value={form.login} onChange={handleChange} />
      {errors.login && <div style={{ color: 'red' }}>{errors.login}</div>}
      <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} />
      {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
      <button type="submit">Зарегистрироваться</button>
      {msg && <div style={{ marginTop: 10, color: msg.startsWith('Регистрация') ? 'green' : 'red' }}>{msg}</div>}
    </form>
  );
}