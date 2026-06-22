import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import useFetch    from '../hooks/useFetch';
import Spinner     from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './Categories.css';

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: cats, loading, error, refetch } = useFetch('/categories');

  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ name: '', icon: '📦' });
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const save = async () => {
    if (!form.name) { setFormError('Name is required.'); return; }
    setSaving(true); setFormError('');
    try {
      await api.post('/categories', form);
      await refetch();
      setShowModal(false);
      setForm({ name: '', icon: '📦' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner text="Loading categories…" />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <h2>Categories</h2>
        <button className="btn btn-primary" onClick={() => { setFormError(''); setShowModal(true); }}>+ Add Category</button>
      </div>

      <div className="cat-grid">
        {cats.map(c => (
          <div className="cat-card" key={c._id} style={{ position: 'relative' }}>
            {isAdmin && (
              <button
                onClick={() => del(c._id)}
                style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--medium-text)', opacity: 0.5 }}
                title="Delete"
              >✕</button>
            )}
            <div className="cat-icon">{c.icon}</div>
            <div className="cat-name">{c.name}</div>
            <div className="cat-count">{c.count ?? 0} product{(c.count ?? 0) !== 1 ? 's' : ''}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ width: 380 }}>
            <h3>Add Category</h3>
            {formError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', color: '#DC2626', fontSize: '0.82rem', marginBottom: 14 }}>
                ⚠️ {formError}
              </div>
            )}
            <div className="form-group">
              <label>Category Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Beverages" />
            </div>
            <div className="form-group">
              <label>Icon (emoji)</label>
              <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📦" style={{ fontSize: '1.3rem' }} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary"   onClick={save}                       disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
