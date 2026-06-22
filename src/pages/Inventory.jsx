import { useState } from 'react';
import { api } from '../api/client';
import useFetch    from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Spinner     from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

const StockModal = ({ product, type, onClose, onDone }) => {
  const [qty,   setQty]   = useState('');
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const submit = async () => {
    const n = Number(qty);
    if (!n || n <= 0) { setError('Enter a positive quantity.'); return; }
    setSaving(true); setError('');
    try {
      await api.post(`/products/${product._id}/${type === 'in' ? 'stock-in' : 'stock-out'}`, { qty: n });
      onDone();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 360 }}>
        <h3>{type === 'in' ? '📥 Stock In' : '📤 Stock Out'} — {product.name}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--medium-text)', marginBottom: 16 }}>
          Current quantity: <strong>{product.qty}</strong>
        </p>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', color: '#DC2626', fontSize: '0.82rem', marginBottom: 12 }}>
            ⚠️ {error}
          </div>
        )}
        <div className="form-group">
          <label>Quantity to {type === 'in' ? 'add' : 'remove'}</label>
          <input
            type="number" min="1" autoFocus
            value={qty} onChange={e => setQty(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="e.g. 10"
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className={`btn ${type === 'in' ? 'btn-primary' : 'btn-danger'}`} onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : type === 'in' ? 'Add Stock' : 'Remove Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { data: productsData, loading, error, refetch } = useFetch('/products?limit=100');
  const [stockModal, setStockModal] = useState(null); // { product, type }

  const products = productsData?.products ?? [];

  if (loading) return <Spinner text="Loading inventory…" />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <h2>Inventory</h2>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Product</th><th>SKU</th><th>Qty On Hand</th><th>Stock Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon">🗃️</div><p>No products yet.</p></div></td></tr>
            )}
            {products.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--medium-text)' }}>{p.sku}</td>
                <td><strong>{p.qty}</strong></td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setStockModal({ product: p, type: 'in'  })}>Stock In</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => setStockModal({ product: p, type: 'out' })} disabled={p.qty === 0}>Stock Out</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stockModal && (
        <StockModal
          product={stockModal.product}
          type={stockModal.type}
          onClose={() => setStockModal(null)}
          onDone={async () => { setStockModal(null); await refetch(); }}
        />
      )}
    </div>
  );
};

export default Inventory;
