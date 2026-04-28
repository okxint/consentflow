export interface Hospital {
  id: string;
  name: string;
  logo?: string;
  location: string;
  nabhId: string;
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
  designation: string;
  department: string;
  initials: string;
  email: string;
  savedSignature?: boolean;
}

export interface Patient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
  doctorId: string;
  hospitalId: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  patientName: string;
  uhid: string;
  operation: string;
  diagnosis: string;
  status: "draft" | "pending_patient" | "pending_witness" | "signed" | "expired";
  doctorId: string;
  hospitalId: string;
  createdAt: string;
  sentAt?: string;
  signedAt?: string;
  scheduledDate: string;
  anesthesiaConsent: boolean;
  anesthesiaStatus: "signed" | "pending" | "none";
  videoKycStatus: "recorded" | "pending" | "none";
}

// --- Seed Data ---

const hospitals: Hospital[] = [
  {
    id: "citygeneral",
    name: "City General Hospital",
    location: "Chennai",
    nabhId: "NABH-H-2024-XXXX",
  },
];

const doctors: Doctor[] = [
  {
    id: "dr-vishnu",
    hospitalId: "citygeneral",
    name: "Dr. B. Vishnu Vardhan",
    designation: "MS Orthopaedics",
    department: "Orthopaedics",
    initials: "BV",
    email: "vishnu.v@hospital.in",
    savedSignature: true,
  },
  {
    id: "dr-priya",
    hospitalId: "citygeneral",
    name: "Dr. Priya Sharma",
    designation: "MS General Surgery",
    department: "General Surgery",
    initials: "PS",
    email: "priya.s@hospital.in",
    savedSignature: true,
  },
  {
    id: "dr-anand",
    hospitalId: "citygeneral",
    name: "Dr. R. Anand",
    designation: "MD Anaesthesia",
    department: "Anaesthesiology",
    initials: "RA",
    email: "anand.r@hospital.in",
    savedSignature: true,
  },
];

const patients: Patient[] = [
  {
    id: "p-001",
    uhid: "CGH-2026-4518",
    name: "Rajesh Kumar",
    age: 47,
    gender: "Male",
    phone: "+91 98412 33456",
    bloodGroup: "O+",
    doctorId: "dr-vishnu",
    hospitalId: "citygeneral",
  },
  {
    id: "p-002",
    uhid: "CGH-2026-4521",
    name: "Selvam M",
    age: 55,
    gender: "Male",
    phone: "+91 99001 45678",
    bloodGroup: "B+",
    doctorId: "dr-vishnu",
    hospitalId: "citygeneral",
  },
  {
    id: "p-003",
    uhid: "CGH-2026-4525",
    name: "Lakshmi Devi",
    age: 62,
    gender: "Female",
    phone: "+91 98765 43210",
    bloodGroup: "A+",
    doctorId: "dr-priya",
    hospitalId: "citygeneral",
  },
];

const consentRecords: ConsentRecord[] = [
  {
    id: "cr-001",
    patientId: "p-001",
    patientName: "Rajesh Kumar",
    uhid: "CGH-2026-4518",
    operation: "Total Knee Replacement",
    diagnosis: "Severe osteoarthritis of the right knee with grade IV cartilage loss",
    status: "signed",
    doctorId: "dr-vishnu",
    hospitalId: "citygeneral",
    createdAt: "2026-04-03T10:00:00",
    sentAt: "2026-04-03T10:05:00",
    signedAt: "2026-04-03T14:30:00",
    scheduledDate: "2026-04-05T09:00",
    anesthesiaConsent: true,
    anesthesiaStatus: "signed",
    videoKycStatus: "recorded",
  },
  {
    id: "cr-002",
    patientId: "p-002",
    patientName: "Selvam M",
    uhid: "CGH-2026-4521",
    operation: "Wound Debridement + Bone Cement Spacer + External Fixator",
    diagnosis: "1st Metatarsophalangeal Joint Charcot's",
    status: "pending_patient",
    doctorId: "dr-vishnu",
    hospitalId: "citygeneral",
    createdAt: "2026-04-04T04:00:00",
    sentAt: "2026-04-04T04:05:00",
    scheduledDate: "2026-04-05T11:00",
    anesthesiaConsent: true,
    anesthesiaStatus: "pending",
    videoKycStatus: "pending",
  },
  {
    id: "cr-003",
    patientId: "p-003",
    patientName: "Lakshmi Devi",
    uhid: "CGH-2026-4525",
    operation: "Laparoscopic Cholecystectomy",
    diagnosis: "Symptomatic cholelithiasis",
    status: "draft",
    doctorId: "dr-priya",
    hospitalId: "citygeneral",
    createdAt: "2026-04-04T08:00:00",
    scheduledDate: "2026-04-06T10:00",
    anesthesiaConsent: true,
    anesthesiaStatus: "none",
    videoKycStatus: "none",
  },
];

// --- Exported functions ---

export function getHospital(id?: string): Hospital {
  return hospitals.find((h) => h.id === (id || "citygeneral")) || hospitals[0];
}

export function getHospitals(): Hospital[] {
  return hospitals;
}

export function getDoctors(hospitalId: string): Doctor[] {
  return doctors.filter((d) => d.hospitalId === hospitalId);
}

export function getDoctor(doctorId: string): Doctor | undefined {
  return doctors.find((d) => d.id === doctorId);
}

export function getPatients(doctorId: string): Patient[] {
  return patients.filter((p) => p.doctorId === doctorId);
}

export function getAllPatients(hospitalId: string): Patient[] {
  return patients.filter((p) => p.hospitalId === hospitalId);
}

export function getConsentForms(doctorId: string): ConsentRecord[] {
  return consentRecords.filter((c) => c.doctorId === doctorId);
}

export function getAllConsentForms(hospitalId: string): ConsentRecord[] {
  return consentRecords.filter((c) => c.hospitalId === hospitalId);
}

export function getCurrentDoctor(): Doctor {
  let doctorId = "dr-vishnu";
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("consentflow_doctor");
      if (stored) doctorId = stored;
    }
  } catch {
    // SSR or localStorage unavailable
  }
  return doctors.find((d) => d.id === doctorId) || doctors[0];
}

export function setCurrentDoctor(id: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("consentflow_doctor", id);
    }
  } catch {
    // SSR or localStorage unavailable
  }
}

export function getConsentStatusConfig(status: ConsentRecord["status"]) {
  switch (status) {
    case "signed":
      return { label: "Signed", color: "bg-green-100 text-green-800" };
    case "pending_patient":
      return { label: "Pending Patient", color: "bg-amber-100 text-amber-800" };
    case "pending_witness":
      return { label: "Pending Witness", color: "bg-blue-100 text-blue-800" };
    case "draft":
      return { label: "Draft", color: "bg-gray-100 text-gray-700" };
    case "expired":
      return { label: "Expired", color: "bg-red-100 text-red-800" };
  }
}
