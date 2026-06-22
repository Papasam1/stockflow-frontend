import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Spinner     from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './Dashboard.css';

const StatCard = ({ label, value, sub, icon, iconClass, cardClass }) => (
  <div className={`stat-card ${cardClass || ''}`}>
    <div className="card-header">
      <span className="card-label">{label}</span>
      <div className={`card-icon ${iconClass}`}>{icon}</div>
    </div>
    <div className="card-value">{value ?? '—'}</div>
    <div className="card-sub">{sub}</div>
  </div>
);

const Dashboard = () => {
  const [summary,  setSummary]  = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [sum, act] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/activity?limit=10'),
      ]);
      setSummary(sum);
      setActivity(act);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner text="Loading dashboard…" />;
  if (error)   return <ErrorBanner message={error} onRetry={load} />;

  const today = new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--medium-text)' }}>{today}</span>
      </div>

      <div className="cards-row">
        <StatCard label="Total Products"  value={summary.totalProducts}   sub="Across all categories"      icon="📦" iconClass="icon-blue"  />
        <StatCard label="Low Stock"       value={summary.statusBreakdown?.find(s => s.status === 'Low Stock')?.count ?? 0}
                                          sub="Needs restocking soon"     icon="⚠️" iconClass="icon-gold" cardClass="butter-bg" />
        <StatCard label="Out of Stock"    value={summary.statusBreakdown?.find(s => s.status === 'Out of Stock')?.count ?? 0}
                                          sub="Unavailable items"         icon="🚫" iconClass="icon-red"  />
        <StatCard label="Total Suppliers" value={summary.totalSuppliers}  sub="Active vendor relationships" icon="🏭" iconClass="icon-green" />
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Activity</span>
          <span className="badge badge-blue">{activity.length} events</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th><th>Action</th><th>Qty</th><th>Date</th><th>User</th>
            </tr>
          </thead>
          <tbody>
            {activity.length === 0 && (
              <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon">📋</div><p>No activity yet.</p></div></td></tr>
            )}
            {activity.map((a) => (
              <tr key={a._id}>
                <td style={{ fontWeight: 500 }}>{a.product?.name ?? '—'}</td>
                <td>
                  <span className={`badge ${a.type === 'in' ? 'badge-green' : a.type === 'out' ? 'badge-red' : 'badge-gold'}`}>
                    {a.action}
                  </span>
                </td>
                <td>{a.qty ?? '—'}</td>
                <td style={{ color: 'var(--medium-text)' }}>
                  {new Date(a.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ color: 'var(--medium-text)' }}>{a.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
