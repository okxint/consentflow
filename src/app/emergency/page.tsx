"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function EmergencyPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"emergency" | "mlc">("emergency");
  const [unknownPatient, setUnknownPatient] = useState(false);
  const [authMethod, setAuthMethod] = useState<"kin" | "twodoctor">("kin");
  const [doctorCertify1, setDoctorCertify1] = useState(false);
  const [doctorCertify2, setDoctorCertify2] = useState(false);
  const [photosTaken, setPhotosTaken] = useState(false);
  const [submittingEmergency, setSubmittingEmergency] = useState(false);
  const [submittingMlc, setSubmittingMlc] = useState(false);

  const [form, setForm] = useState({
    patientName: "",
    condition: "",
    procedure: "",
    urgency: "",
    relativeName: "",
    relationship: "",
    relativePhone: "",
    doctor1Name: "",
    doctor1Designation: "",
    doctor2Name: "",
    doctor2Designation: "",
    // MLC fields
    caseType: "",
    firNumber: "",
    broughtBy: "",
    conditionOnArrival: "",
    injuries: "",
    treatmentGiven: "",
  });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const inputClass = "w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent";
  const labelClass = "block text-sm font-medium mb-1.5";
  const now = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 bg-[var(--color-card)]">
        <div className="max-w-3xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">Emergency Consent</h1>
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">URGENT</span>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">For unconscious/incapacitated patients or medico-legal cases</p>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab("emergency")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === "emergency" ? "bg-white shadow text-red-600" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}
            >
              Emergency Consent
            </button>
            <button
              onClick={() => setActiveTab("mlc")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === "mlc" ? "bg-white shadow text-red-600" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}
            >
              MLC Documentation
            </button>
          </div>

          {activeTab === "emergency" && (
            <div className="space-y-6">
              {/* Alert Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">When a patient cannot provide consent, document the emergency authorization per MCI Guidelines</p>
              </div>

              {/* Patient Info */}
              <section className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className={labelClass}>Patient Name {unknownPatient ? "(Unknown)" : "*"}</label>
                    <input
                      className={inputClass}
                      value={unknownPatient ? "Unknown Patient" : form.patientName}
                      onChange={e => update("patientName", e.target.value)}
                      disabled={unknownPatient}
                      placeholder="Patient name if known"
                    />
                  </div>
                  <label className="flex items-center gap-2 ml-4 cursor-pointer mt-5">
                    <input type="checkbox" checked={unknownPatient} onChange={e => setUnknownPatient(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500" />
                    <span className="text-sm whitespace-nowrap">Unknown Patient</span>
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Patient Condition / Diagnosis *</label>
                  <textarea className={inputClass} rows={3} value={form.condition} onChange={e => update("condition", e.target.value)} placeholder="Describe the patient's current condition" />
                </div>

                <div>
                  <label className={labelClass}>Procedure Required *</label>
                  <input className={inputClass} value={form.procedure} onChange={e => update("procedure", e.target.value)} placeholder="Name of the emergency procedure" />
                </div>

                <div>
                  <label className={labelClass}>Urgency Level *</label>
                  <select className={inputClass} value={form.urgency} onChange={e => update("urgency", e.target.value)}>
                    <option value="">Select urgency</option>
                    <option value="immediate">Immediate life-threatening</option>
                    <option value="1hour">Urgent within 1 hour</option>
                    <option value="4hours">Urgent within 4 hours</option>
                  </select>
                </div>
              </section>

              {/* Authorization Method */}
              <section className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">Authorization Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="authMethod" checked={authMethod === "kin"} onChange={() => setAuthMethod("kin")} className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Next of Kin Consent</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="authMethod" checked={authMethod === "twodoctor"} onChange={() => setAuthMethod("twodoctor")} className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Two-Doctor Authorization</span>
                  </label>
                </div>

                {authMethod === "kin" && (
                  <div className="border border-[var(--color-border)] rounded-lg p-4 space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Relative Name *</label>
                        <input className={inputClass} value={form.relativeName} onChange={e => update("relativeName", e.target.value)} placeholder="Full name" />
                      </div>
                      <div>
                        <label className={labelClass}>Relationship *</label>
                        <select className={inputClass} value={form.relationship} onChange={e => update("relationship", e.target.value)}>
                          <option value="">Select</option>
                          <option>Spouse</option>
                          <option>Parent</option>
                          <option>Child</option>
                          <option>Sibling</option>
                          <option>Legal Guardian</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input className={inputClass} value={form.relativePhone} onChange={e => update("relativePhone", e.target.value)} placeholder="+91" />
                    </div>
                    <div>
                      <label className={labelClass}>Signature</label>
                      <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg h-32 flex items-center justify-center text-sm text-[var(--color-muted)]">
                        Signature pad - tap to sign
                      </div>
                    </div>
                  </div>
                )}

                {authMethod === "twodoctor" && (
                  <div className="border border-[var(--color-border)] rounded-lg p-4 space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Doctor 1 Name *</label>
                        <input className={inputClass} value={form.doctor1Name} onChange={e => update("doctor1Name", e.target.value)} placeholder="Full name" />
                      </div>
                      <div>
                        <label className={labelClass}>Doctor 1 Designation *</label>
                        <input className={inputClass} value={form.doctor1Designation} onChange={e => update("doctor1Designation", e.target.value)} placeholder="e.g. Consultant Surgeon" />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={doctorCertify1} onChange={e => setDoctorCertify1(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500" />
                      <span className="text-sm">I certify this procedure is immediately necessary</span>
                    </label>

                    <hr className="border-[var(--color-border)]" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Doctor 2 Name *</label>
                        <input className={inputClass} value={form.doctor2Name} onChange={e => update("doctor2Name", e.target.value)} placeholder="Full name" />
                      </div>
                      <div>
                        <label className={labelClass}>Doctor 2 Designation *</label>
                        <input className={inputClass} value={form.doctor2Designation} onChange={e => update("doctor2Designation", e.target.value)} placeholder="e.g. Anesthesiologist" />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={doctorCertify2} onChange={e => setDoctorCertify2(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500" />
                      <span className="text-sm">I certify this procedure is immediately necessary</span>
                    </label>

                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mt-2">
                      <Clock className="w-4 h-4" />
                      <span>Timestamp: {now}</span>
                    </div>
                  </div>
                )}
              </section>

              <button
                disabled={submittingEmergency}
                onClick={() => {
                  setSubmittingEmergency(true);
                  setTimeout(() => {
                    setSubmittingEmergency(false);
                    toast({ type: "success", message: "Emergency consent documented successfully!" });
                  }, 1500);
                }}
                className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingEmergency && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />}
                {submittingEmergency ? "Documenting..." : "Document Emergency Consent"}
              </button>
            </div>
          )}

          {activeTab === "mlc" && (
            <div className="space-y-6">
              <section className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">MLC Documentation</h2>

                <div>
                  <label className={labelClass}>Case Type *</label>
                  <select className={inputClass} value={form.caseType} onChange={e => update("caseType", e.target.value)}>
                    <option value="">Select case type</option>
                    <option>Road accident</option>
                    <option>Assault</option>
                    <option>Poisoning</option>
                    <option>Burns</option>
                    <option>Sexual assault</option>
                    <option>Self-harm</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Police Station / FIR Number</label>
                  <input className={inputClass} value={form.firNumber} onChange={e => update("firNumber", e.target.value)} placeholder="Station name and FIR number" />
                </div>

                <div>
                  <label className={labelClass}>Brought By *</label>
                  <select className={inputClass} value={form.broughtBy} onChange={e => update("broughtBy", e.target.value)}>
                    <option value="">Select</option>
                    <option>Ambulance</option>
                    <option>Police</option>
                    <option>Bystander</option>
                    <option>Self</option>
                    <option>Family</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Patient Condition on Arrival *</label>
                  <textarea className={inputClass} rows={3} value={form.conditionOnArrival} onChange={e => update("conditionOnArrival", e.target.value)} placeholder="Describe the patient's condition when brought in" />
                </div>

                <div>
                  <label className={labelClass}>Injuries Documented *</label>
                  <textarea className={inputClass} rows={3} value={form.injuries} onChange={e => update("injuries", e.target.value)} placeholder="Document all visible injuries with location, size, and type" />
                </div>

                <div>
                  <label className={labelClass}>Treatment Given *</label>
                  <textarea className={inputClass} rows={3} value={form.treatmentGiven} onChange={e => update("treatmentGiven", e.target.value)} placeholder="Document all treatment provided" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={photosTaken} onChange={e => setPhotosTaken(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500" />
                  <span className="text-sm">Photographs taken</span>
                </label>
              </section>

              <button
                disabled={submittingMlc}
                onClick={() => {
                  setSubmittingMlc(true);
                  setTimeout(() => {
                    setSubmittingMlc(false);
                    toast({ type: "success", message: "MLC report generated successfully!" });
                  }, 1500);
                }}
                className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingMlc && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />}
                {submittingMlc ? "Generating..." : "Generate MLC Report"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
