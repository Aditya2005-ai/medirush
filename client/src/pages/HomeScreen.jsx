import { useState } from 'react'
import Navbar from '../components/ui/Navbar'
import BedCheckModal from '../components/hospital/BedCheckModal'

export default function HomeScreen({
  connected,
  onSOS,
  range,
  setRange,
  bedRequests,
  checkBed,
  locationReady,
  nearbyHospitals
}) {
  const [firing, setFiring] = useState(false)
  const [showBed, setShowBed] = useState(false)

  const handleSOS = () => {
    if (!locationReady) {
      alert("Waiting for your location...")
      return
    }

    setFiring(true)

    setTimeout(() => {
      setFiring(false)
      onSOS()
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <style>{`
        .sos-panel {
          background: radial-gradient(ellipse at center, rgba(120,10,10,0.9) 0%, rgba(20,0,0,0.95) 70%);
          border-radius:20px;
          padding:56px 40px 48px;
          display:flex;
          flex-direction:column;
          align-items:center;
          margin:28px 28px 0;
          border:1px solid rgba(220,30,30,0.2);
          position:relative;
          overflow:hidden;
        }

        .sos-panel::before{
          content:'';
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 50% 40%, rgba(239,68,68,0.12) 0%, transparent 65%);
          pointer-events:none;
        }

        .sos-circle{
          width:140px;
          height:140px;
          border-radius:50%;
          background:radial-gradient(circle at 38% 38%, #f87171,#dc2626);
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          border:none;
          transition:transform .12s, box-shadow .12s, opacity .2s;
          box-shadow:0 0 0 0 rgba(239,68,68,.4);
          animation:sosPulse 2.2s ease-in-out infinite;
          position:relative;
          z-index:2;
        }

        .sos-circle:disabled{
          opacity:.45;
          cursor:not-allowed;
          animation:none;
        }

        .sos-circle:active,
        .sos-circle.fire{
          transform:scale(.93);
        }

        .sos-ring{
          position:absolute;
          border-radius:50%;
          border:1.5px solid rgba(239,68,68,.28);
          animation:broadcast 2.4s ease-out infinite;
        }

        @keyframes sosPulse{
          0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}
          50%{box-shadow:0 0 0 22px rgba(239,68,68,0)}
        }

        @keyframes broadcast{
          0%{transform:scale(.9);opacity:.9}
          100%{transform:scale(2.5);opacity:0}
        }

        .stat-tile{
          background:#141414;
          border:1px solid rgba(255,255,255,.08);
          border-radius:14px;
          padding:22px 20px;
          flex:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:10px;
        }

        .stat-icon{
          width:40px;
          height:40px;
          border-radius:10px;
          background:rgba(255,255,255,.06);
          display:flex;
          align-items:center;
          justify-content:center;
        }

        input[type=range]{
          -webkit-appearance:none;
          height:3px;
          border-radius:2px;
          outline:none;
          cursor:pointer;
          width:100%;
        }

        input[type=range]::-webkit-slider-thumb{
          -webkit-appearance:none;
          width:18px;
          height:18px;
          border-radius:50%;
          background:#ef4444;
          box-shadow:0 0 10px rgba(239,68,68,.6);
          cursor:pointer;
        }

        .check-bed-btn{
          width:100%;
          padding:16px;
          background:#141414;
          border:1px solid rgba(255,255,255,.1);
          border-radius:12px;
          color:#fff;
          font-family:'Inter',sans-serif;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          transition:all .2s;
          letter-spacing:.3px;
        }

        .check-bed-btn:hover{
          background:#1e1e1e;
          border-color:rgba(255,255,255,.2);
        }
      `}</style>

      <Navbar connected={connected} />

      <div style={{ padding: '0 28px 32px' }}>

        <div className="sos-panel">
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 8,
              textAlign: 'center'
            }}
          >
            Emergency Command
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,.45)',
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 48,
              maxWidth: 340
            }}
          >
            Every second counts. Activate SOS for immediate hospital dispatch.
          </p>

          <div
            style={{
              position: 'relative',
              width: 200,
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}
          >
            <div className="sos-ring" style={{ width: 170, height: 170 }} />
            <div className="sos-ring" style={{ width: 170, height: 170, animationDelay: '.8s' }} />
            <div className="sos-ring" style={{ width: 170, height: 170, animationDelay: '1.6s' }} />

            <button
              disabled={!locationReady}
              className={`sos-circle${firing ? ' fire' : ''}`}
              onClick={handleSOS}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </button>
          </div>

          <div
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 4,
              marginBottom: 4
            }}
          >
            SOS
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#ef4444',
              letterSpacing: 2,
              fontWeight: 500
            }}
          >
            {locationReady ? "TAP TO ACTIVATE" : "GETTING LOCATION..."}
          </div>
        </div>

        <div
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 14,
            padding: '18px 22px',
            margin: '16px 0'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 14
            }}
          >
            <span style={{ color: 'rgba(255,255,255,.7)' }}>
              Search Radius
            </span>

            <span style={{ color: '#ef4444', fontWeight: 700 }}>
              {range} KM
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="30"
            value={range}
            onChange={e => setRange(Number(e.target.value))}
          />
        </div>

        <button
          className="check-bed-btn"
          onClick={() => setShowBed(true)}
        >
          Check Specific Bed Availability
        </button>
      </div>

      {showBed && (
        <BedCheckModal
          hospitals={nearbyHospitals}
          onClose={() => setShowBed(false)}
          onRequest={checkBed}
          bedRequests={bedRequests}
        />
      )}
    </div>
  )
}
