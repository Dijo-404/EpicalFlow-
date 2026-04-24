import { Link } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const projects = [
    { id: '1', name: 'test_opamp.sp', status: 'drc_error', time: '10 mins ago', author: 'Dijo' },
    { id: '2', name: 'LDO_regulator_v2.txt', status: 'placed', time: '2 hours ago', author: 'Yathish' },
    { id: '3', name: 'bandgap_ref.sp', status: 'resolved', time: '1 day ago', author: 'Barath' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="display-heading" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Project Workspace</h1>
          <p className="text-fog">Manage your netlists and resolve layout conflicts.</p>
        </div>
        <button className="btn btn-primary">
          <UploadCloud size={20} /> Upload Netlist (.sp)
        </button>
      </header>

      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        <div style={{ gridColumn: 'span 2' }} className="flex flex-col gap-4">
          <h2 className="eyebrow">Recent Netlists</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="card flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
              <div className="flex items-center gap-4">
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--fog-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {proj.status === 'drc_error' && <AlertTriangle size={24} className="text-vermilion" />}
                  {proj.status === 'placed' && <Clock size={24} className="text-fog" />}
                  {proj.status === 'resolved' && <CheckCircle size={24} className="text-success" />}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{proj.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="eyebrow" style={{ fontSize: '0.65rem' }}>{proj.author} • {proj.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {proj.status === 'drc_error' ? (
                  <span className="badge danger">DRC Conflict Flagged</span>
                ) : proj.status === 'placed' ? (
                  <span className="badge">Auto-Placed</span>
                ) : (
                  <span className="badge success">Resolved</span>
                )}
                
                <Link to={`/viewer/${proj.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                  View <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="eyebrow">Live Arena Queue</h2>
          <div className="card" style={{ background: 'var(--ink-900)', border: '1px solid var(--vermilion)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--vermilion)' }}></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 style={{ fontWeight: 600, color: 'var(--vermilion)' }}>Conflict Detected</h3>
                <p className="text-fog" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>test_opamp.sp</p>
              </div>
              <span className="badge danger" style={{ animation: 'pulse 2s infinite' }}>Waiting</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Spacing rule violation (0µm overlap) between M1 and M2 NMOS pair. Needs manual resolution.
            </p>
            <Link to="/arena/1" className="btn btn-danger w-full justify-center">
              Enter Arena
            </Link>
          </div>
          
          <div className="card" style={{ opacity: 0.6, pointerEvents: 'none' }}>
            <div className="text-center py-8">
              <Clock size={32} className="text-fog mb-2 mx-auto" />
              <p className="text-fog text-sm">No other pending conflicts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
