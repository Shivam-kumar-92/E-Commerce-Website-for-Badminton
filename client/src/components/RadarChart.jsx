import React from 'react';

export default function RadarChart({ stats = { power: 90, speed: 85, control: 90, durability: 88, forgiveness: 80 }, size = 260, color = "#00FF66" }) {
  const axes = [
    { key: 'power', label: 'Power Smash' },
    { key: 'speed', label: 'Speed Reflex' },
    { key: 'control', label: 'Control Pinpoint' },
    { key: 'durability', label: 'Durability' },
    { key: 'forgiveness', label: 'Forgiveness' }
  ];

  const center = size / 2;
  const radius = (size / 2) - 35;
  const totalAxes = axes.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Compute polygon points for concentric background rings (20%, 40%, 60%, 80%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];
  
  const getCoordinates = (valueNormalized, index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = center + radius * valueNormalized * Math.cos(angle);
    const y = center + radius * valueNormalized * Math.sin(angle);
    return { x, y };
  };

  // Stat polygon points
  const points = axes.map((axis, index) => {
    const rawVal = stats[axis.key] || 75;
    const normalized = Math.max(0.2, Math.min(1.0, rawVal / 100));
    const coords = getCoordinates(normalized, index);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Concentric Polygons */}
        {levels.map((level, lvlIdx) => {
          const gridPoints = axes.map((_, index) => {
            const coords = getCoordinates(level, index);
            return `${coords.x},${coords.y}`;
          }).join(' ');

          return (
            <polygon
              key={`grid-${lvlIdx}`}
              points={gridPoints}
              fill={lvlIdx === levels.length - 1 ? 'rgba(0, 255, 102, 0.03)' : 'none'}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray={lvlIdx < levels.length - 1 ? "3 3" : undefined}
            />
          );
        })}

        {/* Radial Axis Lines */}
        {axes.map((axis, index) => {
          const edgeCoords = getCoordinates(1.0, index);
          return (
            <line
              key={`axis-${axis.key}`}
              x1={center}
              y1={center}
              x2={edgeCoords.x}
              y2={edgeCoords.y}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={points}
          fill={color === '#00FF66' ? 'rgba(0, 255, 102, 0.25)' : 'rgba(0, 240, 255, 0.25)'}
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertices */}
        {axes.map((axis, index) => {
          const rawVal = stats[axis.key] || 75;
          const normalized = Math.max(0.2, Math.min(1.0, rawVal / 100));
          const coords = getCoordinates(normalized, index);
          return (
            <g key={`point-${axis.key}`}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="4.5"
                fill="#07090e"
                stroke={color}
                strokeWidth="2.5"
              />
              <circle
                cx={coords.x}
                cy={coords.y}
                r="2"
                fill="#ffffff"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, index) => {
          const labelCoords = getCoordinates(1.22, index);
          const rawVal = stats[axis.key] || 75;
          return (
            <text
              key={`label-${axis.key}`}
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-semibold fill-slate-300 select-none"
            >
              {axis.label}
              <tspan x={labelCoords.x} dy="13" className="fill-volt font-bold text-[10px]">
                {rawVal}/100
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
