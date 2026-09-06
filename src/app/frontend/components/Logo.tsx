'use client';
export default function Logo({ size = 40, light = false }: { size?: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-2" style={{ color: light ? 'white' : '#111' }}>
      <div className="rounded-xl flex items-center justify-center font-black" style={{ width: size, height: size, background: light ? 'white' : '#111', color: light ? '#111' : 'white', fontSize: size * 0.45, letterSpacing: '-0.05em' }}>PS7</div>
      <div className="leading-none">
        <div className="font-black tracking-tight" style={{ fontSize: size * 0.38, letterSpacing: '-0.04em', color: light ? 'white' : '#111' }}>PS7</div>
        <div className="font-semibold uppercase" style={{ fontSize: size * 0.18, letterSpacing: '0.15em', color: light ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>TravelAI</div>
      </div>
    </div>
  );
}
