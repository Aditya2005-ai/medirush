const http = require('http')
const { Server } = require('socket.io')
const createApp = require('./app')
const registerUserSocket = require('./sockets/user.socket')
const registerHospitalSocket = require('./sockets/hospital.socket')

// const state = { activeSessions: {}, cachedHospitals: [] }
const app = createApp()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } })
const state = {
    activeSessions: {},
    cachedHospitals: [],
    hospitalSockets: {}
};

app.set("io", io);
app.set("state", state);


registerUserSocket(io, state);
registerHospitalSocket(io, state);

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`\nMediRush API -> http://localhost:${PORT}/api/hospitals`)
  console.log(`   Socket.io     -> ws://localhost:${PORT}\n`)
})
