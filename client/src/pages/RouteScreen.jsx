import { useState } from 'react'
import RouteMap from '../components/RouteMap'
import NavSteps from '../components/NavSteps'
import BedModal from '../components/BedModal'

export default function RouteScreen({ hospital, route, onBack, bedRequests, onBedCheck }) {
  const [showBed, setShowBed] = useState(false)

  if (!hospital) return null

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#0a0f1e' }}>
      {/* Header */}
      <div style={{ padding:'18px 22px 0', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:18 }}>←</button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800 }}>
          Medi<span style={{ color:'#ff3c3c' }}>Rush</span>
        </div>
        <div style={{ marginLeft:'auto', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.28)', borderRadius:8, padding:'4px 12px', fontSize:12, color:'#22c55e', fontWeight:500 }}>
          ✓ Navigating
        </div>
      </div>

      {/* Route map */}
      <RouteMap hospital={hospital} />

      {/* ETA bar */}
      <div style={{ margin:'12px 22px 0', background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-around', alignItems:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>Arrival</div>
          <div style={{ fontSize:22, fontWeight:700, color:'#22c55e' }}>{hospital.eta}</div>
        </div>
        <div style={{ width:1, height:36, background:'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>Distance</div>
          <div style={{ fontSize:18, fontWeight:600 }}>{hospital.dist} km</div>
        </div>
        <div style={{ width:1, height:36, background:'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>Rating</div>
          <div style={{ fontSize:18, fontWeight:600 }}>⭐ {hospital.rating}</div>
        </div>
      </div>

      {/* Turn-by-turn */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 0' }}>
        <NavSteps route={route} hospital={hospital} />

        {/* Hospital detail card */}
        <div style={{ margin:'16px 22px 0', background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'16px', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>{hospital.name}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>{hospital.speciality} · {hospital.address}</div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {hospital.beds && Object.entries(hospital.beds).map(([type, count]) => (
              <div key={type} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 12px' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Beds
                </div>
                <div style={{ fontWeight:600, fontSize:15, color: count > 0 ? '#22c55e' : '#ef4444' }}>
                  {count} free
                </div>
              </div>
            ))}
          </div>

          {hospital.phone && (
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:12 }}>
              📞 {hospital.phone}
            </div>
          )}

          <button
            onClick={() => setShowBed(true)}
            style={{ width:'100%', padding:'11px', background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.25)', borderRadius:10, color:'#ff3c3c', fontFamily:"'DM Sans',sans-serif", fontWeight:500, cursor:'pointer', fontSize:14 }}
          >
            🛏 Check Live Bed Availability
          </button>
        </div>
        <div style={{ height:20 }} />
      </div>

      {showBed && (
        <BedModal
          hospitals={[hospital]}
          onClose={() => setShowBed(false)}
          onRequest={onBedCheck}
          bedRequests={bedRequests}
        />
      )}
    </div>
  )
}
