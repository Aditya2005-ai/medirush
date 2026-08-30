const BASE_URL = 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const emergencyApi = {
  createEmergency: (body) =>
    request('/api/v1/emergency', { method: 'POST', body: JSON.stringify(body) }),

  getEmergency: (id) =>
    request(`/api/v1/emergency/${id}`),

  getAcceptedHospitals: (id) =>
    request(`/api/v1/emergency/${id}/accepted-hospitals`),

  respondHospital: (id, body) =>
    request(`/api/v1/emergency/${id}/respond`, { method: 'POST', body: JSON.stringify(body) }),

  selectHospital: (id, body) =>
    request(`/api/v1/emergency/${id}/select-hospital`, { method: 'POST', body: JSON.stringify(body) }),

  createPayment: (id, body) =>
    request(`/api/v1/emergency/${id}/payment/create`, { method: 'POST', body: JSON.stringify(body) }),

  confirmPayment: (id, body) =>
    request(`/api/v1/emergency/${id}/payment/confirm`, { method: 'POST', body: JSON.stringify(body) }),

  getRoute: (id, body) =>
    request(`/api/v1/emergency/${id}/route`, { method: 'POST', body: JSON.stringify(body) }),

  validateQr: (id, body) =>
    request(`/api/v1/emergency/${id}/qr/validate`, { method: 'POST', body: JSON.stringify(body) }),
}