import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 如果已登录，重定向到搜索页
    if (isAuthenticated) {
      navigate('/search');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>React Flow</h1>
          <p>一个强大的工作流管理和可视化平台</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn primary-btn">立即登录</Link>
            <Link to="/search" className="btn secondary-btn">浏览功能</Link>
          </div>
        </div>
      </header>

      <section className="features-section">
        <h2>核心功能</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>智能搜索</h3>
            <p>快速找到您需要的信息和资源</p>
          </div>
          <div className="feature-card">
            <h3>数据可视化</h3>
            <p>直观展示工作流和项目状态</p>
          </div>
          <div className="feature-card">
            <h3>实时通知</h3>
            <p>及时获取重要更新和提醒</p>
          </div>
          <div className="feature-card">
            <h3>权限管理</h3>
            <p>精细控制用户访问权限</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>关于项目</h2>
        <p>React Flow 是一个现代化的工作流管理平台，旨在帮助团队更高效地协作和管理项目。通过直观的界面和强大的功能，您可以轻松创建、跟踪和优化工作流程，提高团队生产力。</p>
        <p>我们的平台支持多种工作场景，包括项目管理、任务分配、进度跟踪等，为不同规模的团队提供灵活的解决方案。</p>
      </section>

      <footer className="footer">
        <p>© 2026 React Flow. 保留所有权利。</p>
      </footer>
    </div>
  );
};

export default HomePage;