import { useState, useEffect, useCallback, useRef } from 'react'

export function useEmergency(socket) {
  const [sessionId, setSessionId]       = useState(null)
  const [phase, setPhase]               = useState('idle')   // idle | searching | results | navigating
  const [nearbyHospitals, setNearby]    = useState([])
  const [hospitalStatuses, setStatuses] = useState({})       // id -> 'calling'|'accepted'|'declined'
  const [acceptedHospitals, setAccepted]= useState([])
  const [selectedHospital, setSelected] = useState(null)
  const [route, setRoute]               = useState(null)
  const [bedRequests, setBedRequests]   = useState({})       // requestId -> status obj
  const [userLocation, setUserLoc]      = useState({ lat: 26.850, lng: 80.930 })
  const [range, setRange]               = useState(5)

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handlers = {
      session_created: ({ sessionId }) => setSessionId(sessionId),

      search_started: ({ hospitals }) => {
        setNearby(hospitals)
        const initial = {}
        hospitals.forEach(h => { initial[h.id] = 'calling' })
        setStatuses(initial)
      },

      hospital_response: (data) => {
        setStatuses(prev => ({ ...prev, [data.hospitalId]: data.accepted ? 'accepted' : 'declined' }))
        if (data.accepted) {
          setAccepted(prev => {
            if (prev.find(h => h.id === data.hospitalId)) return prev
            return [...prev, data]
          })
        }
      },

      navigation_start: ({ hospital, route }) => {
        setSelected(hospital)
        setRoute(route)
        setPhase('navigating')
      },

      bed_request_sent: ({ requestId, hospitalId, bedType, hospitalName }) => {
        setBedRequests(prev => ({
          ...prev,
          [requestId]: { requestId, hospitalId, bedType, hospitalName, status: 'pending' }
        }))
      },

      bed_response: (data) => {
        setBedRequests(prev => ({
          ...prev,
          [data.requestId]: { ...prev[data.requestId], ...data, status: 'done' }
        }))
      },

      session_cancelled: () => resetState()
    }

    Object.entries(handlers).forEach(([evt, fn]) => socket.on(evt, fn))
    return () => Object.entries(handlers).forEach(([evt, fn]) => socket.off(evt, fn))
  }, [socket])

  const triggerSOS = useCallback(() => {
    if (!socket) return
    resetState()
    setPhase('searching')
    socket.emit('sos_trigger', {
      lat: userLocation.lat,
      lng: userLocation.lng,
      range,
      userName: 'user'
    })
  }, [socket, userLocation, range])

  const cancelSOS = useCallback(() => {
    if (!socket || !sessionId) return
    socket.emit('sos_cancel', { sessionId })
    resetState()
  }, [socket, sessionId])

  const selectHospital = useCallback((hospital) => {
    if (!socket || !sessionId) return
    setSelected(hospital)
    socket.emit('hospital_selected', { sessionId, hospitalId: hospital.id })
    setPhase('navigating')
  }, [socket, sessionId])

  const checkBed = useCallback((hospitalId, bedType) => {
    if (!socket) return
    socket.emit('check_bed', { sessionId, hospitalId, bedType })
  }, [socket, sessionId])

  function resetState() {
    setPhase('idle')
    setSessionId(null)
    setNearby([])
    setStatuses({})
    setAccepted([])
    setSelected(null)
    setRoute(null)
    setBedRequests({})
  }

  return {
    phase, sessionId,
    nearbyHospitals, hospitalStatuses, acceptedHospitals,
    selectedHospital, route, bedRequests,
    userLocation, range, setRange,
    triggerSOS, cancelSOS, selectHospital, checkBed, resetState
  }
}
