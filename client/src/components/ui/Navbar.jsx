export default function Navbar({ connected }) {
  return (
    <nav style={{ padding:'0 28px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#0a0a0a', position:'sticky', top:0, zIndex:50 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17, letterSpacing:-0.3 }}>MediRush</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 14px', fontSize:12, fontWeight:500, letterSpacing:0.5 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background: connected ? '#22c55e' : '#fbbf24', boxShadow: connected ? '0 0 6px #22c55e' : '0 0 6px #fbbf24' }} />
        SYSTEM ACTIVE
      </div>
    </nav>
  )
}
