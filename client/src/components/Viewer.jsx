import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { AlertTriangle, ArrowLeft, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function Viewer() {
  const [scale, setScale] = useState(1);

  // Mock layout data based on plan
  const components = [
    { id: 'M3', type: 'PMOS', x: 100, y: 100, width: 80, height: 40, color: '#FF3B30' },
    { id: 'M4', type: 'PMOS', x: 200, y: 100, width: 80, height: 40, color: '#FF3B30' },
    { id: 'R1', type: 'RES', x: 350, y: 150, width: 40, height: 100, color: '#6B7280' },
    { id: 'CC', type: 'CAP', x: 150, y: 300, width: 60, height: 60, color: '#34C759' },
    // DRC Error components
    { id: 'M1', type: 'NMOS', x: 250, y: 250, width: 80, height: 40, color: '#007AFF', hasError: true },
    { id: 'M2', type: 'NMOS', x: 270, y: 260, width: 80, height: 40, color: '#007AFF', hasError: true },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ maxHeight: '80vh' }}>
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="display-heading" style={{ fontSize: '1.5rem' }}>test_opamp.sp</h1>
            <p className="eyebrow" style={{ marginTop: '0.25rem' }}>Auto-Placement Viewer</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-md border border-gray-300 p-1">
            <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}><ZoomOut size={18} /></button>
            <button className="p-2 hover:bg-gray-100 rounded"><Maximize size={18} /></button>
            <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setScale(s => Math.min(2, s + 0.2))}><ZoomIn size={18} /></button>
          </div>
          <Link to="/arena/1" className="btn btn-danger">
            <AlertTriangle size={18} /> Resolve DRC
          </Link>
        </div>
      </header>

      <div className="flex-1 card p-0 overflow-hidden relative bg-[#FAFAFA]" style={{ borderRadius: 'var(--radius-lg)' }}>
        {/* DRC Flag Overlay (floating UI) */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10, maxWidth: '300px' }} className="card border-red-500 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-vermilion mt-1 flex-shrink-0" />
            <div>
              <h3 style={{ fontWeight: 600, color: 'var(--vermilion)', marginBottom: '0.25rem' }}>Spacing Violation</h3>
              <p className="text-sm text-fog mb-3">0µm overlap detected between M1 (NMOS) and M2 (NMOS). Minimum spacing rule is 2µm.</p>
              <Link to="/arena/1" className="btn btn-danger w-full text-sm py-2">
                Enter Arena Queue
              </Link>
            </div>
          </div>
        </div>

        {/* Konva Canvas area */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Stage width={1200} height={800} scaleX={scale} scaleY={scale}>
            <Layer>
              {/* Draw Grid */}
              {[...Array(30)].map((_, i) => (
                <Line key={`h${i}`} points={[0, i * 50, 1500, i * 50]} stroke="#E5E7EB" strokeWidth={1} />
              ))}
              {[...Array(30)].map((_, i) => (
                <Line key={`v${i}`} points={[i * 50, 0, i * 50, 1000]} stroke="#E5E7EB" strokeWidth={1} />
              ))}

              {components.map((comp) => (
                <Group key={comp.id} x={comp.x} y={comp.y}>
                  {comp.hasError && (
                    <Rect
                      x={-5} y={-5}
                      width={comp.width + 10} height={comp.height + 10}
                      fill="rgba(255, 59, 48, 0.2)"
                      stroke="#FF3B30"
                      strokeWidth={2}
                      dash={[5, 5]}
                    />
                  )}
                  <Rect
                    width={comp.width}
                    height={comp.height}
                    fill={comp.color}
                    opacity={0.8}
                    cornerRadius={4}
                    shadowColor="#000"
                    shadowBlur={5}
                    shadowOpacity={0.1}
                    shadowOffset={{ x: 2, y: 2 }}
                  />
                  <Text
                    text={comp.id}
                    x={5}
                    y={5}
                    fill="#fff"
                    fontSize={14}
                    fontFamily="Manrope"
                    fontStyle="bold"
                  />
                  <Text
                    text={comp.type}
                    x={5}
                    y={22}
                    fill="rgba(255,255,255,0.8)"
                    fontSize={10}
                    fontFamily="JetBrains Mono"
                  />
                </Group>
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
