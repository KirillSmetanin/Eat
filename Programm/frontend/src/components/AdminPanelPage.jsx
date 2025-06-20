import React, { useEffect, useState } from 'react';

const statuses = ['Новое', 'Посещение состоялось', 'Отменено'];

export default function AdminPanelPage({ user }) {
  if (!user || !user.is_admin) {
    return <div>Доступ только для администратора.</div>;
  }

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = () => {
    fetch(`/api/admin/bookings?status=${status}&page=${page}`)
      .then(r => r.json())
      .then(setOrders);
  };

  useEffect(fetchOrders, [status, page]);

  const changeStatus = async (id, newStatus) => {
    await fetch('/api/admin/booking-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: id, status: newStatus })
    });
    fetchOrders();
  };

  return (
    <div>
      <h2>Панель администратора</h2>
      <div>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Все статусы</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div>Пользователь: {order.user?.first_name} {order.user?.last_name} ({order.user?.phone}, {order.user?.email})</div>
          <div>Дата: {order.booking_date} {order.booking_time}</div>
          <div>Гостей: {order.guests_count}</div>
          <div>Телефон: {order.contact_phone}</div>
          <div>Статус: {order.status}</div>
          <button onClick={() => changeStatus(order.id, 'Посещение состоялось')}>Посещение состоялось</button>
          <button onClick={() => changeStatus(order.id, 'Отменено')}>Отменить</button>
        </div>
      ))}
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Назад</button>
        <span>Стр. {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Вперёд</button>
      </div>
    </div>
  );
}