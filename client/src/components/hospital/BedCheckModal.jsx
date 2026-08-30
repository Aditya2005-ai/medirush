import { useState } from 'react'

const BED_TYPES = ['ICU', 'General', 'Emergency', 'Ventilator', 'Maternity', 'Paediatric']

export default function BedCheckModal({ hospitals, onClose, onRequest, bedRequests }) {
  const [selHosp, setSelHosp] = useState(hospitals.length === 1 ? hospitals[0] : null)
  const [selBed, setSelBed] = useState('')
  const [sent, setSent] = useState(false)

  const key = selHosp && selBed ? `${selHosp.id}_${selBed.toLowerCase()}` : null
  const result = key ? bedRequests[key] : null

  const send = () => {
    if (!selHosp || !selBed) return
    setSent(true)
    onRequest(selHosp.id, selBed.toLowerCase())
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#111', borderRadius:'20px 20px 0 0', width:'100%', maxWidth:820, padding:'28px 28px 36px', border:'1px solid rgba(255,255,255,0.1)', borderBottom:'none', maxHeight:'80vh', overflowY:'auto', animation:'sheetUp 0.3s ease' }}>
        <style>{`
          .opt { padding:12px 16px; border-radius:10px; cursor:pointer; transition:all 0.15s; font-size:14px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.75); }
          .opt:hover { background:rgba(255,255,255,0.07); }
          .opt.active { border-color:rgba(239,68,68,0.45); background:rgba(239,68,68,0.08); color:#fff; }
          .send-btn { width:100%; padding:14px; background:#ef4444; border:none; border-radius:12px; color:#fff; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px; letter-spacing:0.5px; cursor:pointer; transition:background 0.2s; margin-top:4px; }
          .send-btn:disabled { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.3); cursor:not-allowed; }
          .send-btn:not(:disabled):hover { background:#dc2626; }
        `}</style>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:20 }}>Check Bed Availability</h3>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:3 }}>Send a live request to the hospital</p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:34, height:34, cursor:'pointer', color:'#fff', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        {hospitals.length > 1 && !selHosp && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:10, textTransform:'uppercase', letterSpacing:1.5, fontWeight:600 }}>Select Hospital</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {hospitals.map(h => (
                <div key={h.id} className={`opt${selHosp?.id===h.id?' active':''}`} onClick={() => setSelHosp(h)}>
                  <div style={{ fontWeight:600 }}>{h.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{h.dist} km · {h.eta}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selHosp && !sent && (
          <>
            <div style={{ background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:20, fontSize:13, color:'rgba(255,255,255,0.7)' }}>
              🏥 {selHosp.name}
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:10, textTransform:'uppercase', letterSpacing:1.5, fontWeight:600 }}>Bed Type</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:20 }}>
              {BED_TYPES.map(t => (
                <div key={t} className={`opt${selBed===t?' active':''}`} onClick={() => setSelBed(t)} style={{ textAlign:'center' }}>{t}</div>
              ))}
            </div>
            <button className="send-btn" disabled={!selBed} onClick={send}>
              📡 Send Request to Hospital
            </button>
          </>
        )}

        {sent && !result && (
          <div style={{ textAlign:'center', padding:'32px 0' }}>
            <div style={{ fontSize:36, marginBottom:12, animation:'blink 1s infinite' }}>📡</div>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:6 }}>Contacting {selHosp?.name}…</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Awaiting hospital response</div>
          </div>
        )}

        {result && result.status === 'done' && (
          <div style={{ borderRadius:16, padding:'28px 24px', textAlign:'center', background: result.available ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border:`1px solid ${result.available ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
            <div style={{ fontSize:46, marginBottom:12 }}>{result.available ? '✅' : '❌'}</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color: result.available ? '#22c55e' : '#ef4444', marginBottom:6 }}>
              {result.available ? `${result.count} ${selBed} bed${result.count !== 1 ? 's' : ''} available` : `No ${selBed} beds available`}
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>
              {result.available ? `${selHosp?.name} confirmed availability` : 'Try another hospital or bed type'}
            </div>
            <button onClick={() => { setSent(false); setSelBed(''); }} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color:'#fff', padding:'9px 22px', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:13 }}>
              Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
