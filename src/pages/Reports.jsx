import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Spinner     from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './Reports.css';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/reports/summary');
      setSummary(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner text="Loading reports…" />;
  if (error)   return <ErrorBanner message={error} onRetry={load} />;

  const total = summary.totalProducts || 0;
  const getCount = (status) => summary.statusBreakdown?.find(s => s.status === status)?.count ?? 0;

  const distribution = [
    { label: 'In Stock',     count: getCount('In Stock'),     pct: total ? Math.round(getCount('In Stock')     / total * 100) : 0, color: 'var(--success-green)' },
    { label: 'Low Stock',    count: getCount('Low Stock'),    pct: total ? Math.round(getCount('Low Stock')    / total * 100) : 0, color: 'var(--accent-gold)' },
    { label: 'Out of Stock', count: getCount('Out of Stock'), pct: total ? Math.round(getCount('Out of Stock') / total * 100) : 0, color: 'var(--danger-red)' },
  ];

  const catCounts = summary.categoryBreakdown ?? [];
  const maxCat = Math.max(...catCounts.map(c => c.count), 1);

  const summaryCells = [
    { label: 'Total SKUs',      val: total,                                          color: 'var(--primary-blue)' },
    { label: 'Total Suppliers', val: summary.totalSuppliers,                         color: 'var(--success-green)' },
    { label: 'Categories',      val: summary.totalCategories,                        color: 'var(--accent-gold)' },
    { label: 'Stock Value (₦)', val: '₦' + (summary.stockValue ?? 0).toLocaleString(), color: 'var(--primary-dark)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Reports</h2>
        <button className="btn btn-secondary">Export PDF</button>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h4>Stock Distribution</h4>
          <div className="chart-bar-row">
            {distribution.map(r => (
              <div key={r.label}>
                <div className="bar-label">
                  <span style={{ color: 'var(--dark-text)', fontWeight: 500 }}>{r.label}</span>
                  <span style={{ color: 'var(--medium-text)' }}>{r.count} ({r.pct}%)</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <h4>Products by Category</h4>
          <div className="chart-bar-row">
            {catCounts.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--medium-text)' }}>No data yet.</p>}
            {catCounts.map(c => (
              <div key={c.name}>
                <div className="bar-label">
                  <span style={{ fontWeight: 500 }}>{c.icon} {c.name}</span>
                  <span style={{ color: 'var(--medium-text)' }}>{c.count} items</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.round(c.count / maxCat * 100)}%`, background: 'var(--primary-blue)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card" style={{ gridColumn: '1 / -1' }}>
          <h4>Inventory Summary</h4>
          <div className="summary-grid">
            {summaryCells.map(m => (
              <div key={m.label} className="summary-cell">
                <div className="summary-val" style={{ color: m.color }}>{m.val}</div>
                <div className="summary-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
