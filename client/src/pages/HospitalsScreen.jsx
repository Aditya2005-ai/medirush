import Navbar from '../components/ui/Navbar'

export default function HospitalsScreen({ connected, acceptedHospitals, onBack, onSelect }) {
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a' }}>
      <style>{`
        .hosp-card { background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:20px 22px; cursor:pointer; transition:all 0.18s; margin-bottom:12px; }
        .hosp-card:hover { background:#161616; border-color:rgba(255,255,255,0.15); transform:translateY(-1px); }
        .accepted-badge { background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.35); color:#22c55e; font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; letter-spacing:0.5px; display:flex; align-items:center; gap:5px; }
        .meta-label { font-size:11px; color:rgba(255,255,255,0.35); letter-spacing:0.8px; font-weight:500; margin-bottom:5px; text-transform:uppercase; }
        .meta-val { font-size:14px; font-weight:600; display:flex; align-items:center; gap:5px; }
        .tag-chip { background:rgba(255,255,255,0.07); border-radius:6px; padding:4px 10px; font-size:12px; color:rgba(255,255,255,0.6); }
        .arrow-btn { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      `}</style>

      <Navbar connected={connected} />

      <div style={{ padding:'28px 28px' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, marginBottom:20, fontFamily:'Inter,sans-serif' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to search
        </button>

        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:26, marginBottom:6 }}>Responding Hospitals</h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>Select a hospital to view details and route.</p>

        {acceptedHospitals.map((h, i) => {
          const totalBeds = h.beds ? Object.values(h.beds).reduce((a, b) => a + b, 0) : 0
          const tags = h.speciality ? h.speciality.split(' & ') : ['Emergency']
          return (
            <div key={h.id} className="hosp-card" onClick={() => onSelect(h)} style={{ animationDelay:`${i*0.08}s`, animation:'slideUp 0.4s ease both' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ flex:1, paddingRight:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16 }}>{h.name}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" stroke="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.38)', display:'flex', alignItems:'center', gap:4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                    {h.address || 'Lucknow, UP'}
                  </div>
                </div>
                <span className="accepted-badge">
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 5px #22c55e' }} />
                  ACCEPTED
                </span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:14, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="meta-label">Distance</div>
                  <div className="meta-val">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                    {h.dist} km
                  </div>
                </div>
                <div>
                  <div className="meta-label">ETA</div>
                  <div className="meta-val" style={{ color:'#fbbf24' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {h.eta}
                  </div>
                </div>
                <div>
                  <div className="meta-label">Free Beds</div>
                  <div className="meta-val" style={{ color:'#38bdf8' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"><path d="M2 9h20M2 15h20M5 3v18M19 3v18"/></svg>
                    {totalBeds}
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:'6', flexWrap:'wrap', gap:6 }}>
                  {tags.slice(0,2).map(t => <span key={t} className="tag-chip">{t}</span>)}
                </div>
                <div className="arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
