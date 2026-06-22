import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage  from './pages/LoginPage';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Categories from './pages/Categories';
import Suppliers  from './pages/Suppliers';
import Inventory  from './pages/Inventory';
import Reports    from './pages/Reports';
import Settings   from './pages/Settings';

import Sidebar from './components/Sidebar';
import Topbar  from './components/Topbar';

import { useState } from 'react';

import './styles/global.css';
import './App.css';

const AppShell = () => {
  const { isAuthed, logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!isAuthed) return <LoginPage />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard />;
      case 'products':   return <Products />;
      case 'categories': return <Categories />;
      case 'suppliers':  return <Suppliers />;
      case 'inventory':  return <Inventory />;
      case 'reports':    return <Reports />;
      case 'settings':   return <Settings />;
      default:           return null;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} onLogout={logout} />
      <div className="main-area">
        <Topbar page={page} />
        <div className="page-content">{renderPage()}</div>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
);

export default App;
