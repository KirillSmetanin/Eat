import React, { useState } from 'react';

export default function NewOrderPage({ user }) {
  const [form, setForm] = useState({
    booking_date: '', booking_time: '', guests_count: 1, contact_phone: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: user.id })
    });
    setMsg('Бронирование отправлено!');
    setForm({ booking_date: '', booking_time: '', guests_count: 1, contact_phone: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Бронирование столика</h2>
      <input name="booking_date" type="date" value={form.booking_date} onChange={handleChange} required />
      <input name="booking_time" type="time" value={form.booking_time} onChange={handleChange} required />
      <input name="guests_count" type="number" min={1} max={10} value={form.guests_count} onChange={handleChange} required />
      <input name="contact_phone" placeholder="Контактный телефон" value={form.contact_phone} onChange={handleChange} required />
      <button type="submit">Забронировать</button>
      {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
    </form>
  );
}