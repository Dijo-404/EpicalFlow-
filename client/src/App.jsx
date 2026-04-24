import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Activity } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Viewer from './components/Viewer';
import Arena from './components/Arena';
import Logo from './components/Logo';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Logo width={40} height={40} />
        <span>EpicalFlow</span>
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <LayoutDashboard size={18} /> Workspace
        </Link>
        <div className="flex items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--fog-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dijo (1200 ELO)</span>
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }) {
  return (
    <>
      <div className="grain-overlay"></div>
      <Navbar />
      <main className="container mt-8" style={{ paddingBottom: '4rem' }}>
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/viewer/:id" element={<Layout><Viewer /></Layout>} />
        <Route path="/arena/:id" element={<Layout><Arena /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
