/****************************************
 * Simple notification worker
 * Listens on Redis list `notification_queue` (BRPOP)
 * Job format (JSON): { type: 'notify_hospital', emergency_id, hospital_id, user: {lat,lng}, timeout_sec }
 ****************************************/

require('dotenv').config()
const IORedis = require('ioredis')
const Twilio = require('twilio')

module.exports = function startWorker(io, redis, db, activeSessionsMap){
  const twilioSid = process.env.TWILIO_ACCOUNT_SID
  const twilioToken = process.env.TWILIO_AUTH_TOKEN
  const twilioFrom = process.env.TWILIO_FROM_NUMBER
  const twClient = (twilioSid && twilioToken) ? Twilio(twilioSid, twilioToken) : null

  async function processJob(job){
    try{
      if(job.type === 'notify_hospital'){
        const { emergency_id, hospital_id, user, timeout_sec } = job
        // real-time notify hospital panels
        const payload = { emergencyId: emergency_id, user, timeout_sec }
        try{ io.to(`hospital:${hospital_id}`).emit('emergency:notify', payload) }catch(e){ console.error('emit err', e) }

        // send SMS fallback via Twilio if number provided
        if(twClient && job.hospital_phone){
          try{
            await twClient.messages.create({ from: twilioFrom, to: job.hospital_phone, body: `Emergency request near ${user.lat},${user.lng} - reply: ${job.accept_url || 'open dashboard'}` })
            console.log('SMS sent to', job.hospital_phone)
          }catch(err){ console.error('Twilio SMS error', err && err.message)
          }
        } else {
          console.log('No Twilio configured — skipping SMS for', hospital_id)
        }

        // schedule a timeout check after timeout_sec seconds (best-effort)
        setTimeout(async ()=>{
          try{
            // Check whether the hospital has already responded in PostgreSQL.
            const row = await db.hospitalResponse.findUnique({
              where: {
                emergencyRequestId_hospitalId: {
                  emergencyRequestId: emergency_id,
                  hospitalId: hospital_id
                }
              }
            })
            if(row && row.status === 'PENDING'){
              await db.hospitalResponse.update({
                where: { id: row.id },
                data: { status: 'TIMEOUT', respondedAt: new Date() }
              })
              // optionally notify user about timeout
              const linked = Object.values(activeSessionsMap).find(s=>s.sessionId===emergency_id)
              if(linked && linked.userSocketId){
                io.to(linked.userSocketId).emit('hospital_timeout',{emergencyId:emergency_id,hospitalId:hospital_id})
              }
            }
          }catch(err){ console.error('timeout check err', err)
          }
        }, (timeout_sec || 45)*1000)
      }
    }catch(err){ console.error('processJob error', err) }
  }

  async function loop(){
    console.log('Notification worker started, waiting for jobs...')
    while(true){
      try{
        const res = await redis.brpop('notification_queue', 0) // [key, value]
        if(!res) continue
        const payload = JSON.parse(res[1])
        console.log('Job popped', payload.type, 'for hospital', payload.hospital_id)
        processJob(payload)
      }catch(err){
        console.error('Worker loop error', err)
        await new Promise(r=>setTimeout(r,2000))
      }
    }
  }

  loop().catch(err=>console.error('Worker failed', err))
}
