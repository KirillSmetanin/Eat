import React from 'react';

const menu = [
  { path: '/register', label: 'Регистрация' },
  { path: '/login', label: 'Вход' },
  { path: '/orders', label: 'Мои брони' },
  { path: '/new-order', label: 'Бронирование' },
  { path: '/admin', label: 'Админка' }
];

export default function Layout({ user, onLogout, children, onNavigate }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      background: '#f7f7fa'
    }}>
      {/* Боковое меню */}
      <aside style={{
        width: 200,
        background: '#232946',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0'
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: 22,
          marginBottom: 32,
          textAlign: 'center',
          letterSpacing: 1
        }}>
          Я буду кушац
        </div>
        {menu.map(item => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              padding: '14px 32px',
              textAlign: 'left',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#393e6e'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            {item.label}
          </button>
        ))}
      </aside>
      {/* Основная часть */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Верхняя панель */}
        <header style={{
          height: 56,
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 32px',
          fontSize: 16
        }}>
          {user
            ? (
              <>
                <span style={{ marginRight: 16, color: '#232946' }}>
                  Здравствуйте, <b>{user.first_name} {user.last_name}</b>
                </span>
                <button onClick={onLogout} style={{
                  background: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 16px',
                  cursor: 'pointer'
                }}>Выйти</button>
              </>
            )
            : <span style={{ color: '#888' }}>Вы не вошли</span>
          }
        </header>
        {/* Контент */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}