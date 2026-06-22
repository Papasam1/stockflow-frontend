import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '📊' },
  { id: 'products',   label: 'Products',   icon: '📦' },
  { id: 'categories', label: 'Categories', icon: '🏷️' },
  { id: 'suppliers',  label: 'Suppliers',  icon: '🏭' },
  { id: 'inventory',  label: 'Inventory',  icon: '🗃️' },
  { id: 'reports',    label: 'Reports',    icon: '📈' },
  { id: 'settings',   label: 'Settings',   icon: '⚙️' },
];

const Sidebar = ({ page, setPage, onLogout }) => (
  <div className="sidebar">
    <div className="sidebar-brand">
      <span>StockFlow</span>
      <small>Inventory Manager</small>
    </div>
    <nav>
      {NAV_ITEMS.map(n => (
        <div
          key={n.id}
          className={`nav-item ${page === n.id ? 'active' : ''}`}
          onClick={() => setPage(n.id)}
        >
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </div>
      ))}
    </nav>
    <div className="sidebar-footer">
      <div className="nav-item logout" onClick={onLogout}>
        <span className="nav-icon">🚪</span>Sign Out
      </div>
    </div>
  </div>
);

export default Sidebar;
