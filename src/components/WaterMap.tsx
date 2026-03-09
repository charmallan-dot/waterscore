'use client';

interface StateData {
  state: string;
  avgScore: number;
  grade: string;
  systemCount: number;
  population: number;
  fCount: number;
}

// Approximate x,y positions for states on a 800x500 grid
const STATE_POS: Record<string, [number, number]> = {
  WA:[75,45],OR:[65,100],CA:[45,210],NV:[95,185],ID:[120,105],MT:[175,55],WY:[185,130],UT:[140,185],CO:[200,200],AZ:[130,275],NM:[185,280],
  ND:[270,60],SD:[270,110],NE:[275,155],KS:[285,205],OK:[300,250],TX:[270,320],MN:[320,70],IA:[330,140],MO:[345,200],AR:[340,260],LA:[345,315],
  WI:[365,80],IL:[375,160],MS:[370,280],MI:[415,90],IN:[405,160],AL:[400,270],OH:[440,140],KY:[425,200],TN:[405,230],GA:[430,270],
  FL:[460,330],SC:[470,250],NC:[490,225],VA:[500,195],WV:[465,180],PA:[500,130],NY:[520,95],NJ:[530,150],DE:[525,170],MD:[515,175],
  CT:[545,115],RI:[555,120],MA:[555,105],VT:[530,70],NH:[540,75],ME:[565,50],
  AK:[95,380],HI:[180,390],DC:[520,185],
};

function gradeColor(grade: string): string {
  switch (grade) {
    case 'A': return '#22c55e';
    case 'B': return '#84cc16';
    case 'C': return '#eab308';
    case 'D': return '#f97316';
    case 'F': return '#ef4444';
    default: return '#9ca3af';
  }
}

function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export default function WaterMap({ stateData }: { stateData: StateData[] }) {
  const dataMap = new Map(stateData.map(s => [s.state, s]));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 620 430" className="w-full max-w-4xl mx-auto" style={{ minWidth: 500 }}>
        {/* Background */}
        <rect width="620" height="430" fill="#f8fafc" rx="12" />
        
        {stateData.map(s => {
          const pos = STATE_POS[s.state];
          if (!pos) return null;
          const grade = getGrade(s.avgScore);
          const r = Math.max(12, Math.min(24, Math.sqrt(s.population / 200000) * 4));
          
          return (
            <g key={s.state}>
              <circle
                cx={pos[0]}
                cy={pos[1]}
                r={r}
                fill={gradeColor(grade)}
                opacity={0.85}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={pos[0]}
                y={pos[1] + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={r > 14 ? 10 : 8}
                fontWeight="bold"
              >
                {s.state}
              </text>
              <title>
                {s.state}: Grade {grade} ({s.avgScore}/100) — {s.systemCount.toLocaleString()} systems, {s.population.toLocaleString()} people{s.fCount > 0 ? `, ${s.fCount} failing` : ''}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
