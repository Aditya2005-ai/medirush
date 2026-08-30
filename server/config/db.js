require('dotenv').config()

const { PrismaClient } = require('@prisma/client')

const globalForPrisma = global

const prisma =
  globalForPrisma.__medirushPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__medirushPrisma = prisma
}

module.exports = prisma
