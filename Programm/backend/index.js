const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Регистрация
app.post('/api/register', async (req, res) => {
  const { login, password, first_name, last_name, phone, email } = req.body;
  if (!login || !password || !first_name || !last_name || !phone || !email)
    return res.status(400).json({ error: 'Все поля обязательны' });

  const { data: exists } = await supabase.from('users').select('id').eq('login', login).single();
  if (exists) return res.status(400).json({ error: 'Логин уже занят' });

  const { error } = await supabase.from('users').insert([{ login, password, first_name, last_name, phone, email }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Авторизация
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  const { data: user } = await supabase.from('users').select('*').eq('login', login).single();
  if (!user) return res.status(400).json({ error: 'Пользователь не найден' });

  if (!password) return res.status(400).json({ error: 'Неверный пароль' });
  res.json({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    is_admin: user.is_admin
  });
});

// Создать бронирование
app.post('/api/bookings', async (req, res) => {
  const { user_id, booking_date, booking_time, guests_count, contact_phone } = req.body;
  if (!user_id || !booking_date || !booking_time || !guests_count || !contact_phone)
    return res.status(400).json({ error: 'Все поля обязательны' });
  const { error } = await supabase.from('bookings').insert([{ user_id, booking_date, booking_time, guests_count, contact_phone }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Получить бронирования пользователя
app.get('/api/bookings', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id обязателен' });
  const { data, error } = await supabase.from('bookings').select('*').eq('user_id', user_id).order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Оставить отзыв
app.post('/api/reviews', async (req, res) => {
  const { user_id, booking_id, rating, comment } = req.body;
  if (!user_id || !booking_id || !rating)
    return res.status(400).json({ error: 'Все поля обязательны' });
  const { error } = await supabase.from('reviews').insert([{ user_id, booking_id, rating, comment }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Получить отзывы по бронированию
app.get('/api/reviews', async (req, res) => {
  const { booking_id } = req.query;
  const { data, error } = await supabase.from('reviews').select('*').eq('booking_id', booking_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Админ: все бронирования
app.get('/api/admin/bookings', async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  let query = supabase
    .from('bookings')
    .select('*, user:users(id, first_name, last_name, phone, email)')
    .order('id', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status && status !== '') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Админ: сменить статус бронирования
app.post('/api/admin/booking-status', async (req, res) => {
  const { booking_id, status } = req.body;
  const { error } = await supabase.from('bookings').update({ status }).eq('id', booking_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend запущен на http://localhost:${PORT}`);
});