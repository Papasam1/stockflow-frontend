import './Topbar.css';

const PAGE_TITLES = {
  dashboard:  'Dashboard',
  products:   'Products',
  categories: 'Categories',
  suppliers:  'Suppliers',
  inventory:  'Inventory',
  reports:    'Reports',
  settings:   'Settings',
};

const Topbar = ({ page }) => (
  <div className="topbar">
    <span className="topbar-title">{PAGE_TITLES[page]}</span>
    <div className="search-wrap">
      <span className="search-icon">🔍</span>
      <input type="text" placeholder="Quick search…" />
    </div>
    <div className="topbar-actions">
      <button className="notif-btn">
        🔔<span className="notif-badge">3</span>
      </button>
      <div className="avatar">AD</div>
    </div>
  </div>
);

export default Topbar;
