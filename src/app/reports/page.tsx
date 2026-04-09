"use client";
import { Sidebar } from "@/components/Sidebar";
import { Download, CheckCircle, AlertTriangle, Shield, BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">Analytics and insights for consent forms</p>
            </div>
            <button className="inline-flex items-center gap-2 border border-[var(--color-border)] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>

          {/* Empty state */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-16 text-center mb-8">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 text-lg mb-2">No report data yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">Reports will generate automatically as consent forms are created and signed.</p>
          </div>

          {/* NABH Compliance Dashboard */}
          <div className="mt-8 bg-white border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="w-6 h-6 text-[var(--color-primary)]" />
              <h2 className="text-lg font-bold">NABH Compliance Dashboard</h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">COP.5 &amp; COP.6 Audit Readiness</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
              {/* Circular progress */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 52 * 0.94} ${2 * Math.PI * 52 * 0.06}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--color-primary)]">94%</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-2">Overall Compliance</p>
              </div>

              {/* 4 metric cards */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col justify-center">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Consent Completion Rate</p>
                <p className="text-2xl font-bold text-[var(--color-success)]">98.2%</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col justify-center">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Missing Signatures</p>
                <p className="text-2xl font-bold text-[var(--color-danger)]">3</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col justify-center">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Expired Forms</p>
                <p className="text-2xl font-bold text-amber-600">2</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col justify-center">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Template Version Control</p>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                  <span className="text-sm font-semibold text-[var(--color-success)]">Up to date</span>
                </div>
              </div>
            </div>

            {/* Audit Checklist Table */}
            <h3 className="font-semibold mb-3">Audit Checklist — COP.5 (Informed Consent)</h3>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                  <th className="pb-3 font-medium">Requirement</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Detail</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { req: "All surgical consents documented", ok: true, detail: "100%" },
                  { req: "Anesthesia consent separate", ok: true, detail: "100%" },
                  { req: "Blood transfusion consent obtained", ok: true, detail: "100%" },
                  { req: "Patient identity verified", ok: true, detail: "100%" },
                  { req: "Consent in patient's language", ok: "warn", detail: "87%" },
                  { req: "Video consent recorded", ok: true, detail: "96%" },
                  { req: "Witness signature present", ok: true, detail: "100%" },
                  { req: "Doctor signature verified", ok: true, detail: "100%" },
                  { req: "Emergency consent protocol followed", ok: true, detail: "100%" },
                ].map((row) => (
                  <tr key={row.req} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-3 text-sm">{row.req}</td>
                    <td className="py-3">
                      {row.ok === true ? (
                        <span className="inline-flex items-center gap-1 text-[var(--color-success)]"><CheckCircle className="w-4 h-4" /></span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-500"><AlertTriangle className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="py-3 text-sm font-medium">{row.detail}</td>
                    <td className="py-3 text-right">
                      <button className="text-xs text-[var(--color-primary)] hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div className="mt-6">
              <button className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]">
                <Download className="w-4 h-4" /> Download NABH Audit Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
