// Circular match-percentage indicator. Color shifts green/amber/rose by score.
function MatchScoreRing({ score = 0, size = 64, stroke = 6 }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color = clamped >= 75 ? "#059669" : clamped >= 50 ? "#d97706" : "#e11d48";

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-black text-slate-900">{clamped}%</span>
    </div>
  );
}

export default MatchScoreRing;
