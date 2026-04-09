"use client";
import { Sidebar } from "@/components/Sidebar";
import { SAMPLE_FORMS, getStatusConfig } from "@/lib/data";
import { useToast } from "@/components/Toast";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { ChevronRight, Download, Printer, Mail, AlertTriangle, CheckCircle, Clock, Send, FileText, QrCode, CloudUpload } from "lucide-react";

export default function FormDetail() {
  const { toast } = useToast();
  const [showTpaMenu, setShowTpaMenu] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const form = SAMPLE_FORMS.find(f => f.id === id) || SAMPLE_FORMS[0];
  const status = getStatusConfig(form.status);

  const timeline = [
    { label: "Form Created", time: new Date(form.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), done: true },
    { label: "Sent to Patient", time: form.status !== "draft" ? "Apr 7, 10:05 AM" : null, done: form.status !== "draft" },
    { label: "Patient Signed", time: form.patientSignature ? "Apr 7, 2:30 PM" : null, done: !!form.patientSignature },
    { label: "Witness Signed", time: form.witnessSignature ? "Apr 7, 2:32 PM" : null, done: !!form.witnessSignature },
    { label: "Completed", time: form.status === "signed" ? "Apr 7, 2:32 PM" : null, done: form.status === "signed" },
  ];

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 bg-[var(--color-card)]">
        <div className="px-8 py-4 border-b border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
            <Link href="/dashboard" className="hover:text-[var(--color-primary)]">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--color-text)]">{form.patientName}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Consent Form — {form.patientName}</h1>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{form.operation}</p>
        </div>

        <div className="p-8 grid grid-cols-5 gap-6">
          {/* PDF Preview */}
          <div className="col-span-3 bg-white border border-[var(--color-border)] rounded-lg p-8">
            <div ref={printRef} className="print-area border border-gray-200 rounded p-8 bg-white">
              {/* Letterhead */}
              <div className="text-center border-b-2 border-[var(--color-primary)] pb-4 mb-6">
                <h2 className="text-xl font-bold text-[var(--color-primary)]">MGMCRI</h2>
                <p className="text-xs text-[var(--color-muted)]">Pondicherry | NABH-H-2024-0156</p>
                <p className="text-sm font-semibold mt-2">INFORMED CONSENT FOR SURGICAL PROCEDURE</p>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                <p><span className="font-medium">Patient:</span> {form.patientName}</p>
                <p><span className="font-medium">ID:</span> {form.patientId}</p>
                <p><span className="font-medium">DOB:</span> {new Date(form.dob).toLocaleDateString("en-IN")}</p>
                <p><span className="font-medium">Blood Group:</span> {form.bloodGroup}</p>
              </div>

              {/* Procedure */}
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-1">Procedure</h3>
                <p className="text-sm">{form.operation}</p>
                <p className="text-sm text-[var(--color-muted)]">Surgeon: {form.surgeon} | Anesthesia: {form.anesthesia}</p>
                <p className="text-sm text-[var(--color-muted)]">Scheduled: {new Date(form.scheduledDate).toLocaleString("en-IN")}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-1">Description</h3>
                <p className="text-sm">{form.procedureDescription}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-1">Risks & Complications</h3>
                <p className="text-sm">{form.risks}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-1">Benefits</h3>
                <p className="text-sm">{form.benefits}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-1">Alternatives</h3>
                <p className="text-sm">{form.alternatives}</p>
              </div>

              {/* Signatures */}
              <div className="border-t pt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-1 flex items-end justify-center">
                    {form.patientSignature ? <p className="italic text-lg font-serif text-gray-600">{form.patientName}</p> : <p className="text-xs text-gray-400">Pending</p>}
                  </div>
                  <p className="text-xs font-medium">Patient Signature</p>
                  {form.signedAt && <p className="text-xs text-[var(--color-muted)]">{new Date(form.signedAt).toLocaleDateString("en-IN")}</p>}
                </div>
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-1 flex items-end justify-center">
                    {form.witnessSignature ? <p className="italic text-lg font-serif text-gray-600">{form.witnessName}</p> : <p className="text-xs text-gray-400">Pending</p>}
                  </div>
                  <p className="text-xs font-medium">Witness</p>
                  {form.witnessName && <p className="text-xs text-[var(--color-muted)]">{form.witnessName} ({form.witnessRelation})</p>}
                </div>
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-1 flex items-end justify-center">
                    <p className="italic text-lg font-serif text-gray-600">{form.surgeon}</p>
                  </div>
                  <p className="text-xs font-medium">Doctor</p>
                </div>
              </div>

              {/* QR */}
              <div className="flex justify-end mt-4">
                <div className="border p-2 rounded">
                  <QrCode className="w-12 h-12 text-gray-400" />
                  <p className="text-[8px] text-gray-400 text-center mt-0.5">{form.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-2 space-y-4">
            {/* Status */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <h3 className="font-semibold mb-4">Status Timeline</h3>
              <div className="space-y-3">
                {timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {step.done ? (
                      <CheckCircle className="w-5 h-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-sm ${step.done ? "font-medium" : "text-gray-400"}`}>{step.label}</p>
                      {step.time && <p className="text-xs text-[var(--color-muted)]">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <h3 className="font-semibold mb-3">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (!printRef.current) return;
                    const printWindow = window.open("", "_blank");
                    if (!printWindow) return;
                    printWindow.document.write(`<!DOCTYPE html><html><head><title>Consent Form - ${form.patientName}</title><style>body{font-family:Inter,system-ui,sans-serif;color:#0f172a;margin:0;padding:32px}h2{color:#0d9488}.sig-line{border-bottom:1px solid #d1d5db;height:48px;margin-bottom:4px;display:flex;align-items:flex-end;justify-content:center}p,span{font-size:14px}.text-xs{font-size:12px}.font-semibold{font-weight:600}.font-medium{font-weight:500}</style></head><body>${printRef.current.innerHTML}</body></html>`);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => printWindow.print(), 300);
                  }}
                  className="w-full flex items-center gap-2 justify-center bg-[var(--color-primary)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center gap-2 justify-center border border-[var(--color-border)] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4" /> Print Form
                </button>
                <button className="w-full flex items-center gap-2 justify-center border border-[var(--color-border)] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Mail className="w-4 h-4" /> Send Copy to Patient
                </button>
                {form.status === "pending_patient" && (
                  <Link href={`/sign/${form.id}`} className="w-full flex items-center gap-2 justify-center border border-[var(--color-primary)] text-[var(--color-primary)] py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50">
                    <FileText className="w-4 h-4" /> Open Patient Signing Link
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowTpaMenu(!showTpaMenu)}
                    className="w-full flex items-center gap-2 justify-center border border-[var(--color-border)] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4" /> Generate TPA Pack
                  </button>
                  {showTpaMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-10 py-1">
                      {["Medi Assist", "Paramount", "Vidal", "Generic"].map(fmt => (
                        <button key={fmt} onClick={() => setShowTpaMenu(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{fmt}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="w-full flex items-center gap-2 justify-center border border-[var(--color-border)] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <CloudUpload className="w-4 h-4" /> Push to ABHA
                  <span className="text-[10px] bg-[var(--color-primary-light)] text-[var(--color-primary)] px-1.5 py-0.5 rounded font-semibold">ABDM</span>
                </button>
                <button className="w-full flex items-center gap-2 justify-center border border-[var(--color-border)] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <AlertTriangle className="w-4 h-4" /> LAMA Form
                </button>
                <button className="w-full text-sm text-[var(--color-danger)] py-2 hover:underline">
                  Revoke Consent
                </button>
              </div>
            </div>

            {/* Audit */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <h3 className="font-semibold mb-3">Audit Log</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { action: `${form.surgeon} created form`, time: form.createdAt },
                  ...(form.status !== "draft" ? [{ action: `SMS sent to ${form.phone}`, time: form.createdAt }] : []),
                  ...(form.patientSignature ? [{ action: "Patient signed consent", time: form.signedAt! }] : []),
                  ...(form.witnessSignature ? [{ action: `${form.witnessName} witnessed`, time: form.signedAt! }] : []),
                  ...(form.patientSignature ? [{ action: "Consent pushed to ABHA PHR", time: form.signedAt! }] : []),
                  ...(form.patientSignature ? [{ action: "TPA documentation generated (Medi Assist format)", time: form.signedAt! }] : []),
                ].map((entry, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">{entry.action}</span>
                    <span className="text-xs text-[var(--color-muted)]">{new Date(entry.time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
