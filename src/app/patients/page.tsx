"use client";
import { Sidebar } from "@/components/Sidebar";
import { Search, Plus, Phone, FileText, ChevronRight } from "lucide-react";
import { getCurrentDoctor, getPatients, getConsentForms } from "@/lib/auth";

export default function Patients() {
  const doctor = getCurrentDoctor();
  const patients = getPatients(doctor.id);
  const forms = getConsentForms(doctor.id);

  // Count forms per patient
  function getFormCount(patientId: string) {
    return forms.filter(f => f.patientId === patientId).length;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Patients</h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">{patients.length} patient{patients.length !== 1 ? "s" : ""} in your records</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]">
              <Plus className="w-4 h-4" /> Add Patient
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search by name, ID, or phone..." className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
            <select className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm">
              <option>All Blood Groups</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>

          <div className="bg-white border border-[var(--color-border)] rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-sm text-[var(--color-text-secondary)]">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Age / Gender</th>
                  <th className="px-5 py-3 font-medium">Blood Group</th>
                  <th className="px-5 py-3 font-medium">Forms</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center text-sm font-semibold text-[var(--color-text-secondary)]">
                          {p.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <p className="text-xs text-[var(--color-muted)]">{p.uhid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <a href={`tel:${p.phone}`} className="p-1.5 hover:bg-gray-100 rounded-md" title={p.phone}><Phone className="w-3.5 h-3.5 text-gray-500" /></a>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">{p.age} / {p.gender}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-medium">{p.bloodGroup}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <FileText className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                        {getFormCount(p.id)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 hover:bg-gray-100 rounded-md"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">
                      No patients assigned to you yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
