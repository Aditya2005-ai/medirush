import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import './index.css'
import HomeScreen from './pages/HomeScreen'
import SearchScreen from './pages/SearchScreen'
import HospitalsScreen from './pages/HospitalsScreen'
import HospitalDetailScreen from './pages/HospitalDetailScreen'

export default function App() {
  const socketRef = useRef(null)

  const [connected, setConnected] = useState(false)
  const [phase, setPhase] = useState('home') // home|searching|hospitals|detail

  const [range, setRange] = useState(10)
  const [sessionId, setSessionId] = useState(null)

  const [nearbyHospitals, setNearby] = useState([])
  const [hospitalStatuses, setStatuses] = useState({})
  const [acceptedHospitals, setAccepted] = useState([])

  const [selectedHospital, setSelected] = useState(null)

  const [bedRequests, setBedRequests] = useState({})

  const [userLocation, setUserLoc] = useState(null)
  const [locationReady, setLocationReady] = useState(false)

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationReady(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (p) => {
        const location = {
          lat: p.coords.latitude,
          lng: p.coords.longitude
        }

        console.log('User Location:', location)

        setUserLoc(location)
        setLocationReady(true)
      },
      (err) => {
        console.error('Location Error:', err)
        alert('Unable to access your location. Please enable location services.')
        setLocationReady(false)
      }
    )
  }, [])

  // Socket connection
  useEffect(() => {
    const serverUrl = window.location.origin.includes('5173')
      ? window.location.origin.replace('5173', '3001')
      : window.location.origin

    const s = io(serverUrl, {
      transports: ['websocket', 'polling']
    })

    socketRef.current = s

    s.on('connect', () => setConnected(true))
    s.on('disconnect', () => setConnected(false))

    s.on('error', ({ message }) => {
      console.error('Server error:', message)
      alert(message)
    })
    
    s.on('session_created', ({ sessionId }) => {
      setSessionId(sessionId)
    })

    s.on('search_started', ({ hospitals }) => {
      setNearby(hospitals)

      const init = {}

      hospitals.forEach((h) => {
        init[h.id] = 'calling'
      })

      setStatuses(init)
    })

    s.on('hospital_response', (data) => {
      setStatuses((prev) => ({
        ...prev,
        [data.hospitalId]: data.accepted ? 'accepted' : 'declined'
      }))

      if (data.accepted) {
        setAccepted((prev) =>
          prev.find((h) => h.id === data.hospitalId)
            ? prev
            : [...prev, data]
        )
      }
    })

    s.on('bed_response', (data) => {
      setBedRequests((prev) => ({
        ...prev,
        [`${data.hospitalId}_${data.bedType}`]: {
          ...data,
          status: 'done'
        }
      }))
    })

    return () => s.disconnect()
  }, [])

  // Prevent searching screen from hanging forever
  useEffect(() => {
    if (phase !== 'searching') return

    const timer = setTimeout(() => {
      setPhase('hospitals')
    }, 12000)

    return () => clearTimeout(timer)
  }, [phase])

  const triggerSOS = useCallback(() => {
    if (!socketRef.current) return

    if (!locationReady || !userLocation) {
      alert('Please wait while we fetch your location.')
      return
    }

    setAccepted([])
    setNearby([])
    setStatuses({})
    setBedRequests({})

    setPhase('searching')

    socketRef.current.emit('sos_trigger', {
      lat: userLocation.lat,
      lng: userLocation.lng,
      range
    })
  }, [locationReady, userLocation, range])

  const checkBed = useCallback(
    (hospitalId, bedType) => {
      if (!socketRef.current) return

      setBedRequests((prev) => ({
        ...prev,
        [`${hospitalId}_${bedType}`]: {
          hospitalId,
          bedType,
          status: 'pending'
        }
      }))

      socketRef.current.emit('check_bed', {
        sessionId,
        hospitalId,
        bedType
      })
    },
    [sessionId]
  )

  const selectHospital = useCallback((hospital) => {
    setSelected(hospital)
    setPhase('detail')
  }, [])

  const reset = () => {
    setPhase('home')
    setAccepted([])
    setNearby([])
    setStatuses({})
    setSelected(null)
    setSessionId(null)
    setBedRequests({})
  }

  const commonProps = {
    connected,
    userLocation,
    range,
    setRange,
    bedRequests,
    checkBed,
    locationReady
  }

  return (
    <div
      style={{
        maxWidth: 820,
        margin: '0 auto',
        minHeight: '100vh',
        background: '#0a0a0a'
      }}
    >
      {phase === 'home' && (
        <HomeScreen
          {...commonProps}
          onSOS={triggerSOS}
          locationReady={locationReady}
          nearbyHospitals={nearbyHospitals}
        />
      )}

      {phase === 'searching' && (
        <SearchScreen
          {...commonProps}
          range={range}
          nearbyHospitals={nearbyHospitals}
          hospitalStatuses={hospitalStatuses}
          acceptedHospitals={acceptedHospitals}
          onBack={reset}
          onViewHospitals={() => setPhase('hospitals')}
        />
      )}

      {phase === 'hospitals' && (
        <HospitalsScreen
          {...commonProps}
          acceptedHospitals={acceptedHospitals}
          onBack={() => setPhase('searching')}
          onSelect={selectHospital}
        />
      )}

      {phase === 'detail' && (
        <HospitalDetailScreen
          {...commonProps}
          hospital={selectedHospital}
          userLocation={userLocation}
          onBack={() => setPhase('hospitals')}
        />
      )}
    </div>
  )
}