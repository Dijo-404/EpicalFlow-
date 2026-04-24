import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { AlertTriangle, Clock, MessageSquare, ArrowLeft, Check, X, Sparkles, Terminal, Activity, Send } from 'lucide-react';

export default function Arena() {
  const [timeLeft, setTimeLeft] = useState(120);
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Arena matched. You are paired with Barath (Designer).', type: 'system', time: '10:42 AM' },
    { id: 2, user: 'Barath', text: 'Hey! Looks like M1 and M2 are overlapping by a full coordinate block.', type: 'user', time: '10:43 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Dijo', text: inputMsg, type: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInputMsg('');
  };

  const aiSuggestions = [
    { id: 1, text: "Shift M2 2µm to the right (+x axis)", confidence: "94%", impact: "Solves 0µm overlap" },
    { id: 2, text: "Decrease M1 width by 1µm", confidence: "72%", impact: "Reduces parasitic cap" }
  ];

  return (
    <div className="flex flex-col h-screen" style={{ maxHeight: '88vh' }}>
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/viewer/1" className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="display-heading" style={{ fontSize: '1.75rem', color: 'var(--vermilion)' }}>
              Live Resolution Workspace
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full" style={{ background: 'var(--vermilion)', animation: 'pulse 2s infinite', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%' }}></span>
              <p className="eyebrow" style={{ color: 'var(--vermilion)', fontWeight: 600 }}>Arena Room #1042 • Spacing Violation</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 card" style={{ padding: '0.5rem 1rem', background: timeLeft <= 30 ? 'rgba(255, 59, 48, 0.1)' : 'var(--card-bg)', border: timeLeft <= 30 ? '1px solid var(--vermilion)' : '1px solid var(--border)', transition: 'all 0.3s ease' }}>
            <Clock size={22} color={timeLeft <= 30 ? "var(--vermilion)" : "var(--fog)"} style={timeLeft <= 30 ? { animation: 'pulse 1s infinite' } : {}} />
            <span className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: timeLeft <= 30 ? 'var(--vermilion)' : 'var(--bone)', letterSpacing: '0.05em' }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main 3-column layout using Flexbox instead of CSS Grid to ensure it never breaks */}
      <div className="flex-1 flex gap-6 min-h-0 w-full overflow-hidden">
        
        {/* Left Panel: Zoomed Canvas (Flex 3) */}
        <div className="card flex flex-col relative" style={{ flex: '3', padding: 0, background: '#0a0a0a', borderRadius: 'var(--radius-lg)', border: '1px solid #222', overflow: 'hidden' }}>
          <div className="scanline"></div>
          <div className="flex justify-between items-center" style={{ padding: '1rem', borderBottom: '1px solid #333', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', position: 'absolute', top: 0, width: '100%', zIndex: 20 }}>
            <div className="flex items-center gap-2">
              <Activity size={16} color="#60a5fa" />
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', color: '#d1d5db', letterSpacing: '0.05em' }}>Contested Zone</span>
            </div>
            <span className="badge danger" style={{ background: 'rgba(255, 59, 48, 0.2)', border: '1px solid var(--vermilion)' }}>M1 & M2</span>
          </div>
          <div className="flex-1 relative mt-12 overflow-hidden flex items-center justify-center">
            <Stage width={400} height={500} scaleX={1.5} scaleY={1.5} x={-100} y={-100}>
              <Layer>
                {/* Blueprint Grid */}
                {[...Array(20)].map((_, i) => (
                  <Line key={`h${i}`} points={[0, i * 50, 1000, i * 50]} stroke="#1f2937" strokeWidth={1} />
                ))}
                {[...Array(20)].map((_, i) => (
                  <Line key={`v${i}`} points={[i * 50, 0, i * 50, 1000]} stroke="#1f2937" strokeWidth={1} />
                ))}
                <Group x={250} y={250}>
                  {/* Glowing conflict zone */}
                  <Rect x={-10} y={-10} width={100} height={60} fill="rgba(255, 59, 48, 0.15)" stroke="#FF3B30" strokeWidth={1} dash={[4, 4]} />
                  <Rect width={80} height={40} fill="#3b82f6" opacity={0.9} cornerRadius={2} shadowColor="#3b82f6" shadowBlur={10} shadowOpacity={0.5} />
                  <Text text="M1" x={5} y={5} fill="#fff" fontSize={14} fontStyle="bold" fontFamily="monospace" />
                </Group>
                <Group x={270} y={260}>
                  <Rect width={80} height={40} fill="#3b82f6" opacity={0.9} cornerRadius={2} shadowColor="#3b82f6" shadowBlur={10} shadowOpacity={0.5} />
                  <Text text="M2" x={5} y={5} fill="#fff" fontSize={14} fontStyle="bold" fontFamily="monospace" />
                </Group>
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Center Panel: Chat (Flex 5) */}
        <div className="card flex flex-col p-0 overflow-hidden" style={{ flex: '5', padding: 0, borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center z-10" style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} color="var(--fog)" />
              <span style={{ fontWeight: 'bold', color: 'var(--bone)' }}>Team Link</span>
            </div>
            <div className="flex" style={{ marginLeft: '-0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10 }}>D</div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold', marginLeft: '-0.5rem', zIndex: 0 }}>B</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 relative" style={{ padding: '1.25rem', background: 'var(--background)' }}>
            <div className="relative z-10 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col" style={{ alignItems: msg.type === 'system' ? 'center' : msg.user === 'Dijo' ? 'flex-end' : 'flex-start' }}>
                  {msg.type !== 'system' && <span style={{ fontSize: '0.75rem', color: 'var(--fog)', marginBottom: '0.25rem', fontWeight: 500, padding: '0 0.25rem' }}>{msg.user} • {msg.time}</span>}
                  <div style={{
                    padding: '0.75rem 1rem', 
                    maxWidth: '85%', 
                    lineHeight: 1.5,
                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                    ...(msg.type === 'system' ? { background: 'var(--fog-light)', color: 'var(--bone)', borderRadius: '0.5rem', fontSize: '0.75rem', fontStyle: 'italic' } : 
                       msg.user === 'Dijo' ? { background: '#000000', color: '#ffffff', borderRadius: '1rem 1rem 0 1rem' } : 
                       { background: 'var(--card-bg)', color: 'var(--bone)', border: '1px solid var(--border)', borderRadius: '1rem 1rem 1rem 0' })
                  }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSend} className="flex gap-4 z-10" style={{ padding: '1rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
            <input 
              type="text" 
              placeholder="Discuss resolution..." 
              style={{ flex: 1, background: 'var(--background)', borderRadius: '9999px', padding: '0.75rem 1.5rem', border: '1px solid var(--border)', outline: 'none', color: 'var(--bone)', fontSize: '0.9rem' }}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '9999px', width: '3rem', height: '3rem', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} disabled={!inputMsg.trim()}>
              <Send size={18} style={{ marginLeft: '-2px' }} />
            </button>
          </form>
        </div>

        {/* Right Panel: Resolution Actions (Flex 4) */}
        <div className="flex flex-col gap-6" style={{ flex: '4', overflow: 'hidden' }}>
          
          <div className="card relative" style={{ padding: '1.5rem', background: 'var(--card-bg)', overflow: 'hidden' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--bone)' }}>
              <Sparkles size={16} /> AI Routing Hints
            </h3>
            <div className="flex flex-col gap-4 relative z-10">
              {aiSuggestions.map(sug => (
                <button 
                  key={sug.id} 
                  style={{ textAlign: 'left', padding: '1rem', border: activeSuggestion === sug.id ? '2px solid var(--bone)' : '1px solid var(--border)', borderRadius: '0.75rem', background: activeSuggestion === sug.id ? 'var(--fog-light)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s ease', transform: activeSuggestion === sug.id ? 'scale(1.02)' : 'none' }}
                  onClick={() => {
                    setActiveSuggestion(sug.id);
                    setInputMsg(`I propose we ${sug.text.toLowerCase()}`);
                  }}
                >
                  <div className="flex justify-between" style={{ alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bone)', margin: 0 }}>{sug.text}</p>
                    <span className="badge success">{sug.confidence}</span>
                  </div>
                  <p className="text-fog" style={{ fontSize: '0.75rem', margin: 0 }}>{sug.impact}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card flex-1 flex flex-col relative" style={{ padding: '1.25rem', background: '#0a0a0a', borderColor: '#222' }}>
            <div className="flex items-center gap-2 relative z-10" style={{ marginBottom: '0.75rem' }}>
              <Terminal size={18} color="#9ca3af" />
              <h3 style={{ fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Propose Fix</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem', lineHeight: 1.5, position: 'relative', zIndex: 10, margin: '0 0 1rem 0' }}>Enter terminal coordinates or instructions to resolve the layout overlap.</p>
            
            <div className="relative z-10" style={{ marginBottom: '1.5rem' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '0.65rem', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.875rem' }}>$</span>
              <input 
                type="text" 
                style={{ width: '100%', boxSizing: 'border-box', background: '#000000', border: '1px solid #333', color: '#4ade80', fontFamily: 'monospace', fontSize: '0.875rem', padding: '0.75rem 1rem 0.75rem 2rem', borderRadius: '0.5rem', outline: 'none' }}
                placeholder="Move M2 x=300" 
              />
            </div>
            
            <div className="flex gap-4 mt-auto relative z-10">
              <button className="btn" style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', color: '#ffffff', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <X size={18} /> Disagree
              </button>
              <button className="btn" style={{ flex: 1, background: '#ffffff', color: '#000000', border: 'none', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Check size={18} /> Agree
              </button>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
