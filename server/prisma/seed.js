require('dotenv').config()

const { PrismaClient, UserRole, HospitalType, OwnershipType, VerificationStatus, ResourceKind } = require('@prisma/client')

const prisma = new PrismaClient()
const specialties = ['Trauma Surgeon', 'Emergency Physician', 'Neurologist', 'Orthopedic Surgeon', 'Anesthesiologist', 'Radiologist']
const departments = ['Trauma', 'Cardiology', 'Neurology', 'Burn Unit', 'Pediatrics', 'Orthopedics', 'General Surgery']
const equipment = ['Ventilator', 'MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'ECG', 'Laboratory', 'Blood Bank']
const hospitals = [
  { name: 'K.D. Medical College Hospital', latitude: 27.5547, longitude: 77.6745, address: 'Akbarpur, Mathura', phone: '+915652241001', email: 'kdmedical@medirush.test' },
  { name: 'Nayati Medicity', latitude: 27.5268, longitude: 77.6952, address: 'NH-2, Mathura', phone: '+915652665000', email: 'nayati@medirush.test' },
  { name: 'District Hospital Mathura', latitude: 27.4928, longitude: 77.6732, address: 'Dampier Nagar, Mathura', phone: '+915652240212', email: 'district.mathura@medirush.test' },
  { name: 'Gopal Hospital', latitude: 27.5005, longitude: 77.6801, address: 'Krishna Nagar, Mathura', phone: '+915652240245', email: 'gopal@medirush.test' },
  { name: 'Brijwasi Hospital', latitude: 27.5108, longitude: 77.6827, address: 'Vrindavan Road, Mathura', phone: '+915652242300', email: 'brijwasi@medirush.test' },
  { name: 'City Hospital Mathura', latitude: 27.4862, longitude: 77.6894, address: 'Junction Road, Mathura', phone: '+915652240980', email: 'city.mathura@medirush.test' },
  { name: 'Sushila Hospital', latitude: 27.4973, longitude: 77.6582, address: 'Maholi Road, Mathura', phone: '+915652242510', email: 'sushila@medirush.test' },
  { name: 'Vrindavan Multispeciality Hospital', latitude: 27.5724, longitude: 77.6756, address: 'Chhatikara Road, Vrindavan', phone: '+915652244611', email: 'vrindavan@medirush.test' },
  { name: 'R.K. Hospital Mathura', latitude: 27.4801, longitude: 77.6773, address: 'Bharatpur Gate, Mathura', phone: '+915652243701', email: 'rk.mathura@medirush.test' },
  { name: 'MediRush Emergency Test Hospital', latitude: 27.5044, longitude: 77.6653, address: 'Civil Lines, Mathura', phone: '+915652249999', email: 'emergency.mathura@medirush.test' }
]

async function main() {
  const specialtyRows = await Promise.all(specialties.map((name) => prisma.doctorSpecialty.upsert({ where: { name }, update: {}, create: { name } })))
  const departmentRows = await Promise.all(departments.map((name) => prisma.department.upsert({ where: { name }, update: {}, create: { name } })))
  const equipmentRows = await Promise.all(equipment.map((name) => prisma.equipmentType.upsert({ where: { name }, update: {}, create: { name } })))

  for (let index = 0; index < hospitals.length; index += 1) {
    const { name, latitude, longitude, address, phone, email } = hospitals[index]
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: 'seed-data-not-for-authentication', role: UserRole.HOSPITAL_ADMIN, isEmailVerified: true }
    })
    const hospital = await prisma.hospital.upsert({
      where: { userId: user.id },
      update: { verificationStatus: VerificationStatus.VERIFIED, profileCompleted: true },
      create: { userId: user.id, verificationStatus: VerificationStatus.VERIFIED, profileCompleted: true, verifiedAt: new Date() }
    })
    await prisma.hospitalProfile.upsert({
      where: { hospitalId: hospital.id },
      update: {},
      create: { hospitalId: hospital.id, legalName: name, displayName: name, registrationNumber: `MR-MATHURA-${String(index + 1).padStart(3, '0')}`, hospitalType: HospitalType.MULTI_SPECIALTY, ownershipType: OwnershipType.PRIVATE, addressLine1: address, city: 'Mathura', state: 'Uttar Pradesh', latitude, longitude, emergencyPhone: phone, emergencyEmail: email },
      update: { legalName: name, displayName: name, addressLine1: address, city: 'Mathura', state: 'Uttar Pradesh', latitude, longitude, emergencyPhone: phone, emergencyEmail: email }
    })
    await prisma.hospitalInfrastructure.upsert({
      where: { hospitalId: hospital.id },
      update: {},
      create: { hospitalId: hospital.id, totalBeds: 100 + index * 10, availableBeds: 25, totalIcuBeds: 20, availableIcuBeds: 6, totalEmergencyBeds: 12, availableEmergencyBeds: 4, totalVentilators: 15, availableVentilators: 5, operationTheatres: 4, availableOperationTheatres: 2, ambulances: 4, availableAmbulances: 2 }
    })
    await prisma.hospitalDoctor.createMany({ data: specialtyRows.slice(0, 2).map((specialty) => ({ hospitalId: hospital.id, specialtyId: specialty.id, totalCount: 2, availableCount: 1 })), skipDuplicates: true })
    await prisma.hospitalDepartment.createMany({ data: departmentRows.slice(0, 3).map((department) => ({ hospitalId: hospital.id, departmentId: department.id })), skipDuplicates: true })
    await prisma.hospitalEquipment.createMany({ data: equipmentRows.slice(0, 4).map((item) => ({ hospitalId: hospital.id, equipmentTypeId: item.id, totalQuantity: 3, availableQuantity: 2 })), skipDuplicates: true })
    await prisma.hospitalResource.createMany({ data: [ResourceKind.BED, ResourceKind.ICU_BED, ResourceKind.VENTILATOR, ResourceKind.OPERATION_THEATRE, ResourceKind.AMBULANCE].map((kind) => ({ hospitalId: hospital.id, kind, totalQuantity: 10, availableQuantity: 4 })), skipDuplicates: true })
  }
  console.log('Seeded 10 Mathura hospitals, 20 specialty allocations, departments, equipment, and resources.')
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
