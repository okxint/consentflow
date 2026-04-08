export interface ConsentForm {
  id: string;
  patientName: string;
  patientId: string;
  dob: string;
  gender: string;
  phone: string;
  bloodGroup: string;
  operation: string;
  surgeon: string;
  scheduledDate: string;
  anesthesia: string;
  diagnosis: string;
  procedureDescription: string;
  risks: string;
  benefits: string;
  alternatives: string;
  consequences: string;
  status: "draft" | "pending_patient" | "pending_witness" | "signed" | "expired";
  createdAt: string;
  patientSignature?: string;
  witnessSignature?: string;
  witnessName?: string;
  witnessRelation?: string;
  signedAt?: string;
}

export const SAMPLE_FORMS: ConsentForm[] = [
  {
    id: "cf-001",
    patientName: "Rajesh Kumar",
    patientId: "APL-2026-4518",
    dob: "1978-06-12",
    gender: "Male",
    phone: "+91 98412 33456",
    bloodGroup: "O+",
    operation: "Total Knee Replacement",
    surgeon: "Dr. Priya Sharma",
    scheduledDate: "2026-04-10T09:00",
    anesthesia: "Spinal",
    diagnosis: "Severe osteoarthritis of the right knee with grade IV cartilage loss",
    procedureDescription: "The damaged knee joint will be replaced with an artificial joint made of metal and plastic components.",
    risks: "Infection, blood clots, nerve damage, implant loosening, stiffness, allergic reaction to implant materials",
    benefits: "Pain relief, improved mobility, better quality of life, ability to walk without assistance",
    alternatives: "Pain medications, physical therapy, knee injections, partial knee replacement",
    consequences: "Progressive joint deterioration, increasing pain, reduced mobility, potential need for wheelchair",
    status: "signed",
    createdAt: "2026-04-07T10:00:00",
    patientSignature: "data:image/png;base64,sig1",
    witnessSignature: "data:image/png;base64,sig2",
    witnessName: "Meera Kumar",
    witnessRelation: "Spouse",
    signedAt: "2026-04-07T14:30:00",
  },
];

export function getStatusConfig(status: ConsentForm["status"]) {
  switch (status) {
    case "signed": return { label: "Signed", color: "bg-green-100 text-green-800" };
    case "pending_patient": return { label: "Pending Patient", color: "bg-amber-100 text-amber-800" };
    case "pending_witness": return { label: "Pending Witness", color: "bg-blue-100 text-blue-800" };
    case "draft": return { label: "Draft", color: "bg-gray-100 text-gray-700" };
    case "expired": return { label: "Expired", color: "bg-red-100 text-red-800" };
  }
}
