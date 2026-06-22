import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('admin@stockflow.ng');
  const [pass,  setPass]  = useState('password');

  const handleLogin = async () => {
    await login(email, pass);
  };

  const handleKey = e => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-illustration">📦</div>
        <h1>StockFlow</h1>
        <p>Professional inventory management built for Nigerian businesses.</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome back</h2>
          <p className="sub">Sign in to your StockFlow account</p>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 8, padding: '10px 14px',
              color: '#DC2626', fontSize: '0.85rem', marginBottom: 16,
            }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="you@company.ng"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="remember-row">
            <input type="checkbox" id="rem" defaultChecked />
            <label htmlFor="rem">Keep me signed in</label>
          </div>

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
