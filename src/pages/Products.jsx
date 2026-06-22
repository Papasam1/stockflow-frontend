import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import useFetch    from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Spinner     from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

const EMPTY_FORM = { name: '', sku: '', category: '', qty: '', price: '', supplier: '' };

const Products = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: productsData, loading, error, refetch } = useFetch('/products');
  const { data: categories } = useFetch('/categories');
  const { data: suppliers  } = useFetch('/suppliers');

  const [search,    setSearch]    = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem,  setEditItem]  = useState(null);   // null = create, object = edit
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const products = productsData?.products ?? [];

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, category: categories?.[0]?._id ?? '', supplier: suppliers?.[0]?._id ?? '' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({
      name:     p.name,
      sku:      p.sku,
      category: p.category?._id ?? p.category,
      supplier: p.supplier?._id ?? p.supplier,
      qty:      p.qty,
      price:    p.price,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const save = async () => {
    if (!form.name || !form.sku) { setFormError('Name and SKU are required.'); return; }
    setSaving(true); setFormError('');
    try {
      const body = { ...form, qty: Number(form.qty), price: Number(form.price) };
      if (editItem) {
        await api.patch(`/products/${editItem._id}`, body);
      } else {
        await api.post('/products', body);
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
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  if (loading) return <Spinner text="Loading products…" />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      <div className="table-card">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-gray)' }}>
          <input
            type="text"
            placeholder="🔍  Search by name or SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', border: '1.5px solid var(--border-gray)', borderRadius: 8, fontSize: '0.85rem', outline: 'none', width: 280 }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th><th>SKU</th><th>Category</th>
              <th>Quantity</th><th>Price (₦)</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="7"><div className="empty-state"><div className="empty-icon">📭</div><p>No products found.</p></div></td></tr>
            )}
            {filtered.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ color: 'var(--medium-text)', fontFamily: 'monospace' }}>{p.sku}</td>
                <td>{p.category?.name ?? '—'}</td>
                <td>{p.qty}</td>
                <td>₦{p.price.toLocaleString()}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" onClick={() => del(p._id)}>Delete</button>
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
            <h3>{editItem ? 'Edit Product' : 'Add New Product'}</h3>

            {formError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', color: '#DC2626', fontSize: '0.82rem', marginBottom: 14 }}>
                ⚠️ {formError}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Laptop Stand" />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input value={form.sku} onChange={e => update('sku', e.target.value)} placeholder="e.g. LS-006" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => update('category', e.target.value)}>
                  <option value="">— Select —</option>
                  {(categories ?? []).map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <select value={form.supplier} onChange={e => update('supplier', e.target.value)}>
                  <option value="">— Select —</option>
                  {(suppliers ?? []).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={form.qty} onChange={e => update('qty', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Price (₦)</label>
                <input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn btn-primary"   onClick={save}       disabled={saving}>
                {saving ? 'Saving…' : editItem ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
