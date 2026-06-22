const Spinner = ({ text = 'Loading…' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px', gap: 14, color: 'var(--medium-text)',
  }}>
    <div style={{
      width: 36, height: 36,
      border: '3px solid var(--border-gray)',
      borderTopColor: 'var(--primary-blue)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <span style={{ fontSize: '0.875rem' }}>{text}</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
