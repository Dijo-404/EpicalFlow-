import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Logo from './Logo';

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: 'var(--ink-950)', position: 'relative', overflow: 'hidden' }}>
      <div className="grain-overlay"></div>
      
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)' }}></div>

      <div className="card" style={{ maxWidth: 440, width: '100%', padding: '3rem', position: 'relative', zIndex: 10 }}>
        <div className="text-center mb-8 flex flex-col items-center">
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--bone)' }}>
            <Logo width={120} height={120} />
          </div>
          <h1 className="display-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>EPICALFLOW</h1>
          <p className="text-fog">Secure Access Portal</p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Link to="/dashboard" className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>
            <Shield size={20} /> Authenticate via Google
          </Link>
          <div className="text-center mt-4">
            <span className="eyebrow" style={{ fontSize: '0.65rem' }}>EPIC Build-A-Thon 2026 • Team Horizon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
