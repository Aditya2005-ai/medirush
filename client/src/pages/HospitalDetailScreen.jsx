import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import BedCheckModal from '../components/hospital/BedCheckModal'

export default function HospitalDetailScreen({ connected, hospital, userLocation, onBack, bedRequests, checkBed }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [showBed, setShowBed] = useState(false)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then(L => {
      const map = L.default.map(mapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      })

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      mapInstanceRef.current = map

      // User marker (blue)
      const userIcon = L.default.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 14px rgba(59,130,246,0.8)"></div>`,
        className: '', iconAnchor: [7, 7]
      })
      L.default.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)
        .bindPopup('<b style="color:#000">Your Location</b>')

      // Hospital marker (red)
      if (hospital?.lat && hospital?.lng) {
        const hospIcon = L.default.divIcon({
          html: `<div style="background:#ef4444;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(239,68,68,0.7)"><span style="transform:rotate(45deg);font-size:13px">🏥</span></div>`,
          className: '', iconAnchor: [14, 28]
        })
        L.default.marker([hospital.lat, hospital.lng], { icon: hospIcon }).addTo(map)
          .bindPopup(`<b style="color:#000">${hospital.name}</b>`)

        // Draw dashed route line
        const routeCoords = [
          [userLocation.lat, userLocation.lng],
          [(userLocation.lat + hospital.lat) / 2 + 0.01, (userLocation.lng + hospital.lng) / 2],
          [hospital.lat, hospital.lng]
        ]
        L.default.polyline(routeCoords, {
          color: '#ef4444', weight: 3, dashArray: '8 6', opacity: 0.85
        }).addTo(map)

        // Fit bounds
        map.fitBounds([
          [userLocation.lat, userLocation.lng],
          [hospital.lat, hospital.lng]
        ], { padding: [40, 40] })
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  if (!hospital) return null

  const beds = hospital.beds || { icu: 2, general: 14, emergency: 3 }
  const bedEntries = Object.entries(beds)

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', flexDirection:'column' }}>
      <style>{`
        .info-card { background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:18px 20px; }
        .bed-row { background:#0e0e0e; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
        .bed-count-badge { background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.3); color:#22c55e; font-size:12px; font-weight:700; padding:4px 10px; border-radius:6px; }
        .call-btn { flex:1; background:#111; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:all 0.2s; color:#fff; font-family:'Inter',sans-serif; }
        .call-btn:hover { background:#1a1a1a; }
        .nav-btn { width:100%; padding:18px; background:#ef4444; border:none; border-radius:12px; color:#fff; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px; letter-spacing:1.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:background 0.2s; margin-top:16px; }
        .nav-btn:hover { background:#dc2626; }
        .nav-btn.active { background:#16a34a; }
      `}</style>

      <Navbar connected={connected} />

      <div style={{ flex:1, overflowY:'auto', paddingBottom:24 }}>
        {/* Header */}
        <div style={{ padding:'24px 28px 0' }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, marginBottom:16, fontFamily:'Inter,sans-serif' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Responding Hospitals
          </button>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:24 }}>{hospital.name}</h2>
            <div style={{ background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.3)', borderRadius:8, padding:'5px 10px', display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600, color:'#fbbf24', flexShrink:0 }}>
              ★ {hospital.rating || '4.4'}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            {hospital.address || 'Lucknow, Uttar Pradesh'}
          </div>
        </div>

        {/* Map */}
        <div style={{ margin:'0 28px', height:260, borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
        </div>

        {/* ETA + Call */}
        <div style={{ padding:'16px 28px 0', display:'flex', gap:12 }}>
          <div className="info-card" style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:1, fontWeight:500, marginBottom:8 }}>ETA</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:'#fbbf24', lineHeight:1 }}>{hospital.eta?.split(' ')[0] || '—'}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{hospital.dist ? `${hospital.dist} km away` : 'km'}</div>
          </div>
          <button className="call-btn" onClick={() => window.open(`tel:${hospital.phone || '+911800'}`)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg>
            <span style={{ fontSize:13, fontWeight:600 }}>Call Hospital</span>
          </button>
        </div>

        {/* Live Bed Availability */}
        <div style={{ padding:'16px 28px 0' }}>
          <div className="info-card">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M2 9h20M2 15h20M5 3v18M19 3v18"/></svg>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:15 }}>Live Bed Availability</span>
            </div>
            {bedEntries.map(([type, count]) => (
              <div key={type} className="bed-row">
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', textTransform:'capitalize', fontWeight:500 }}>{type}</span>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>Total: {count + Math.floor(count * 2.5)}</span>
                  <span className="bed-count-badge">{count} Free</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowBed(true)}
              style={{ width:'100%', padding:'10px', marginTop:8, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, color:'#ef4444', fontFamily:'Inter,sans-serif', fontWeight:500, cursor:'pointer', fontSize:13 }}
            >
              Request Specific Bed Type
            </button>
          </div>
        </div>

        {/* Navigate CTA */}
        <div style={{ padding:'0 28px' }}>
          <button
            className={`nav-btn${navigating ? ' active' : ''}`}
            onClick={() => {
              setNavigating(true)
              if (hospital.lat && hospital.lng) {
                window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.lat},${hospital.lng}`, '_blank')
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            {navigating ? 'OPENING GOOGLE MAPS…' : 'CONFIRM & START NAVIGATION'}
          </button>
        </div>
      </div>

      {showBed && (
        <BedCheckModal
          hospitals={[hospital]}
          onClose={() => setShowBed(false)}
          onRequest={checkBed}
          bedRequests={bedRequests}
        />
      )}
    </div>
  )
}
