import React, { useEffect, useState } from 'react';

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user || !user.id) return;
    fetch(`/api/bookings?user_id=${user.id}`)
      .then(r => r.json())
      .then(setOrders);
  }, [user]);

  const handleReview = async (booking_id) => {
    const text = review[booking_id]?.text || '';
    const rating = review[booking_id]?.rating || 5;
    if (!text) return;
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, booking_id, rating, comment: text })
    });
    setMsg('Спасибо за отзыв!');
    setReview({ ...review, [booking_id]: { text: '', rating: 5 } });
  };

  if (!user || !user.id) {
    return <div>Пожалуйста, войдите в систему.</div>;
  }

  return (
    <div>
      <h2>Мои бронирования</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div>Дата: {order.booking_date} {order.booking_time}</div>
          <div>Гостей: {order.guests_count}</div>
          <div>Телефон: {order.contact_phone}</div>
          <div>Статус: {order.status}</div>
          {order.status === 'Посещение состоялось' && (
            <div>
              <textarea
                placeholder="Оставьте отзыв"
                value={review[order.id]?.text || ''}
                onChange={e => setReview({ ...review, [order.id]: { ...review[order.id], text: e.target.value } })}
              />
              <select
                value={review[order.id]?.rating || 5}
                onChange={e => setReview({ ...review, [order.id]: { ...review[order.id], rating: e.target.value } })}
              >
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button onClick={() => handleReview(order.id)}>Отправить отзыв</button>
            </div>
          )}
        </div>
      ))}
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
    </div>
  );
}