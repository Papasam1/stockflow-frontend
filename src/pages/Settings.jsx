import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import './Settings.css';

const TOGGLE_CONFIG = [
  { key: 'notif',      label: 'Email Notifications', desc: 'Receive daily inventory digest by email' },
  { key: 'lowAlerts',  label: 'Low Stock Alerts',    desc: 'Get notified when items fall below threshold' },
  { key: 'darkMode',   label: 'Dark Mode',           desc: 'Switch to a darker interface theme' },
  { key: 'autoBackup', label: 'Auto Backup',         desc: 'Automatically back up data every 24 hours' },
];

const Settings = () => {
  const { user } = useAuth();
  const [name,  setName]  = useState(user?.name  ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  const [toggles, setToggles] = useState({
    notif: true, lowAlerts: true, darkMode: false, autoBackup: false,
  });

  const toggle = key => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const saveAccount = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.patch('/auth/me', { name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header"><h2>Settings</h2></div>

      {/* Account */}
      <div className="settings-section">
        <h3>Account</h3>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', color: '#DC2626', fontSize: '0.82rem', marginBottom: 14 }}>
            ⚠️ {error}
          </div>
        )}
        {saved && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '8px 14px', color: '#15803D', fontSize: '0.82rem', marginBottom: 14 }}>
            ✅ Changes saved.
          </div>
        )}

        <div className="form-row" style={{ marginBottom: 14 }}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={saveAccount} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3>Notifications</h3>
        {TOGGLE_CONFIG.map(s => (
          <div className="settings-row" key={s.key}>
            <div>
              <div className="settings-label">{s.label}</div>
              <div className="settings-desc">{s.desc}</div>
            </div>
            <div
              className={`toggle ${toggles[s.key] ? 'on' : ''}`}
              onClick={() => toggle(s.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
