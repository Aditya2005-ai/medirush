import { useState, useEffect } from 'react'
import Navbar from '../components/ui/Navbar'

export default function SearchScreen({ connected, range, nearbyHospitals, hospitalStatuses, acceptedHospitals, onBack, onViewHospitals }) {
  const [dots, setDots] = useState('')
  const [searchTimedOut, setSearchTimedOut] = useState(false)
  const accepted = acceptedHospitals.length
  const total = nearbyHospitals.length

  useEffect(() => {
      setSearchTimedOut(false)

      const timeout = setTimeout(() => {
        if (acceptedHospitals.length === 0) {
          setSearchTimedOut(true)
        }
      }, 15000) // 15 seconds

      return () => clearTimeout(timeout)
    }, [])
      useEffect(() => {
        const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
        return () => clearInterval(iv)
      }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', flexDirection:'column' }}>
      <style>{`
        .broadcast-icon { width:52px; height:52px; border-radius:50%; background:rgba(239,68,68,0.15); border:2px solid rgba(239,68,68,0.4); display:flex; align-items:center; justify-content:center; position:relative; flex-shrink:0; }
        .broadcast-ring { position:absolute; inset:-8px; border-radius:50%; border:1.5px solid rgba(239,68,68,0.3); animation:broadcast 1.8s ease-out infinite; }
        .broadcast-ring2 { position:absolute; inset:-8px; border-radius:50%; border:1.5px solid rgba(239,68,68,0.15); animation:broadcast 1.8s ease-out 0.6s infinite; }
        @keyframes broadcast { 0%{transform:scale(0.85);opacity:1} 100%{transform:scale(1.7);opacity:0} }
        .view-btn { width:100%; padding:18px; background:#16a34a; border:none; border-radius:12px; color:#fff; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; letter-spacing:1px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:background 0.2s; }
        .view-btn:hover { background:#15803d; }
        .view-btn:disabled { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.4); cursor:not-allowed; }
      `}</style>

      <Navbar connected={connected} />

      <div style={{ padding:'24px 28px', flex:1, display:'flex', flexDirection:'column' }}>
        {/* Status card */}
        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div className="broadcast-icon">
            <div className="broadcast-ring" />
            <div className="broadcast-ring2" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, letterSpacing:0.5, display:'flex', alignItems:'center', gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              BROADCASTING SOS
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:3 }}>
              Radius: {range}km • {total > 0 ? `${total} hospitals notified` : `Searching${dots}`}
            </div>
          </div>
          {accepted > 0 && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:24, color:'#22c55e', lineHeight:1 }}>{accepted}</div>
              <div style={{ fontSize:11, color:'#22c55e', fontWeight:600, letterSpacing:0.5, marginTop:2 }}>RESPONDED</div>
            </div>
          )}
        </div>

        {/* Map placeholder with animated radar */}
        <div style={{ flex:1, background:'#0e0e0e', borderRadius:16, border:'1px solid rgba(255,255,255,0.06)', position:'relative', overflow:'hidden', minHeight:340, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <style>{`
            .radar-sweep { position:absolute; width:300px; height:300px; border-radius:50%; border:1px solid rgba(239,68,68,0.15); }
            @keyframes radarPing { 0%{transform:scale(0.2);opacity:0.9} 100%{transform:scale(1.8);opacity:0} }
            .h-dot { position:absolute; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:3px; animation:fadeIn 0.5s ease; }
            @keyframes fadeIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
          `}</style>

          {/* Radar rings */}
          {[100,180,260,340].map((s,i) => (
            <div key={i} className="radar-sweep" style={{ width:s, height:s, animationDelay:`${i*0.4}s`, animation:'radarPing 3s ease-out infinite', animationDelay:`${i*0.5}s` }} />
          ))}

          {/* You dot */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:5 }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#3b82f6', border:'3px solid #fff', boxShadow:'0 0 16px rgba(59,130,246,0.8)' }} />
          </div>

          {/* Hospital dots appearing */}
          {nearbyHospitals.map((h, i) => {
            const positions = [
              {top:'30%',left:'62%'},{top:'65%',left:'32%'},{top:'22%',left:'28%'},
              {top:'72%',left:'68%'},{top:'40%',left:'72%'}
            ]
            const pos = positions[i % positions.length]
            const status = hospitalStatuses[h.id]
            const color = status === 'accepted' ? '#22c55e' : status === 'declined' ? '#ef4444' : '#fbbf24'
            return (
              <div key={h.id} className="h-dot" style={{ ...pos, position:'absolute' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:color, boxShadow:`0 0 10px ${color}88` }} />
                <div style={{ fontSize:8, color:'rgba(255,255,255,0.5)', whiteSpace:'nowrap', background:'rgba(0,0,0,0.7)', padding:'1px 4px', borderRadius:3 }}>{h.name?.split(' ')[0]}</div>
              </div>
            )
          })}

          {nearbyHospitals.length === 0 && (
            <div
              style={{
                color: searchTimedOut ? '#ef4444' : 'rgba(255,255,255,0.2)',
                fontSize: 13,
                textAlign: 'center',
                padding: '0 20px'
              }}
            >
              {searchTimedOut
                ? "No hospitals found nearby. Try increasing the search radius."
                : `Scanning for hospitals${dots}`}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding:'0 28px 32px' }}>
        <button className="view-btn" onClick={onViewHospitals} disabled={accepted === 0}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {accepted > 0
            ? `VIEW ${accepted} RESPONDING HOSPITALS`
            : searchTimedOut
                ? "NO HOSPITAL RESPONDED"
                : `WAITING FOR RESPONSES${dots}`}
        </button>
        {searchTimedOut && (
  <button
        onClick={onBack}
        style={{
          width: '100%',
          marginTop: 12,
          padding: 15,
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Try Again
      </button>
    )}
      </div>
      
    </div>
  )
}
