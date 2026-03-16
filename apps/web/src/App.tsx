import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, logout } = useAuthStore();

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-link">首页</Link>
        <Link to="/search" className="nav-link">搜索</Link>
        <Link to="/dashboard" className="nav-link">仪表板</Link>
        <Link to="/admin" className="nav-link">管理</Link>
        {user ? (
          <Link to="/" className="nav-link" onClick={(e) => {
            e.preventDefault();
            logout();
          }}>登出</Link>
        ) : (
          <Link to="/login" className="nav-link">登录</Link>
        )}
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      
      <NotificationCenter />
    </div>
  );
}

export default App;
