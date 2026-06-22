const ErrorBanner = ({ message, onRetry }) => (
  <div style={{
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: 10, padding: '16px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 12, color: 'var(--danger-red)', fontSize: '0.875rem',
  }}>
    <span>⚠️ {message}</span>
    {onRetry && (
      <button className="btn btn-danger btn-sm" onClick={onRetry}>Retry</button>
    )}
  </div>
);

export default ErrorBanner;
