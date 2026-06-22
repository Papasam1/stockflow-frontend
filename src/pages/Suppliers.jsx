import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import useFetch    from '../hooks/useFetch';
import Spinner     from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

const EMPTY_FORM = { name: '', contact: '', email: '' };

const Suppliers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: suppliers, loading, error, refetch } = useFetch('/suppliers');

  const [showModal, setShowModal] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true); };
  const openEdit   = s  => { setEditItem(s);   setForm({ name: s.name, contact: s.contact, email: s.email }); setFormError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const save = async () => {
    if (!form.name) { setFormError('Name is required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editItem) {
        await api.patch(`/suppliers/${editItem._id}`, form);
      } else {
        await api.post('/suppliers', form);
      }
      await refetch();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  if (loading) return <Spinner text="Loading suppliers…" />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <h2>Suppliers</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Supplier</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Supplier Name</th><th>Contact</th><th>Email</th><th>Products</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && (
              <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon">🏭</div><p>No suppliers yet.</p></div></td></tr>
            )}
            {suppliers.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ color: 'var(--medium-text)' }}>{s.contact}</td>
                <td style={{ color: 'var(--primary-blue)' }}>{s.email}</td>
                <td><span className="badge badge-blue">{s.products ?? 0}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-gold btn-sm"   onClick={() => openEdit(s)}>Edit</button>
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" onClick={() => del(s._id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h3>{editItem ? 'Edit Supplier' : 'Add Supplier'}</h3>
            {formError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', color: '#DC2626', fontSize: '0.82rem', marginBottom: 14 }}>
                ⚠️ {formError}
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Company name" />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="+234 800 000 0000" />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="sales@supplier.com" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn btn-primary"   onClick={save}       disabled={saving}>
                {saving ? 'Saving…' : editItem ? 'Update Supplier' : 'Save Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
