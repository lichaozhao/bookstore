import { Link } from 'react-router-dom';
import styles from '../styles/App.module.css';

const Welcome = () => (
  <div className={styles.welcome} style={{ textAlign: 'center', marginTop: '4rem' }}>
    <h1>Welcome to Book Favorites!</h1>
    <p>Sign up or log in to start saving your favorite books.</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem' }}>
      <Link to="/register" style={{ textDecoration: 'none' }}>
        <button style={{
          background: '#20b2aa',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.7rem 2.2rem',
          fontSize: '1.1rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(32,178,170,0.08)',
          transition: 'background 0.2s, transform 0.15s',
        }}
        onMouseOver={event => { event.currentTarget.style.background = '#178d8d'; }}
        onMouseOut={event => { event.currentTarget.style.background = '#20b2aa'; }}
        >Create Account</button>
      </Link>
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <button style={{
          background: '#fff',
          color: '#20b2aa',
          border: '2px solid #20b2aa',
          borderRadius: '4px',
          padding: '0.7rem 2.2rem',
          fontSize: '1.1rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(32,178,170,0.08)',
          transition: 'background 0.2s, color 0.2s, transform 0.15s',
        }}
        onMouseOver={event => { event.currentTarget.style.background = '#20b2aa'; event.currentTarget.style.color = '#fff'; }}
        onMouseOut={event => { event.currentTarget.style.background = '#fff'; event.currentTarget.style.color = '#20b2aa'; }}
        >Login</button>
      </Link>
    </div>
  </div>
);

export default Welcome;
