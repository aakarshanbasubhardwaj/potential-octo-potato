// src/components/FooterTMDb.jsx
export default function FooterTMDb() {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 2,
      left: 0,
      width: '100%',
      textAlign: 'center',
      fontSize: '0.6rem',
      color: '#888',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      Data and images © <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>TMDb</a>
    </footer>
  );
}
