"use client";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentDoctor, getConsentForms, getConsentStatusConfig } from "@/lib/auth";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, Eye, Download, Send, Pencil, Trash2, RefreshCw, Bell, Search } from "lucide-react";

export default function Dashboard() {
  const doctor = getCurrentDoctor();
  const forms = getConsentForms(doctor.id);

  const stats = [
    { label: "Total Forms", value: forms.length, icon: FileText, color: "text-[var(--color-primary)]", bg: "bg-blue-50" },
    { label: "Pending Signatures", value: forms.filter(f => f.status.startsWith("pending")).length, icon: Clock, color: "text-[var(--color-warning)]", bg: "bg-amber-50" },
    { label: "Completed", value: forms.filter(f => f.status === "signed").length, icon: CheckCircle, color: "text-[var(--color-success)]", bg: "bg-green-50" },
    { label: "Expired", value: forms.filter(f => f.status === "expired").length, icon: AlertTriangle, color: "text-[var(--color-danger)]", bg: "bg-red-50" },
  ];

  const pendingForms = forms.filter(f => f.status === "pending_patient" || f.status === "pending_witness");

  // Calculate time elapsed for pending forms
  function timeAgo(dateStr: string) {
    const sent = new Date(dateStr);
    const now = new Date("2026-04-04T10:00:00"); // mock current time
    const diffMs = now.getTime() - sent.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-[var(--color-border)] px-8 py-4 flex items-center justify-between bg-white">
          <div />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search forms..." className="pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" />
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-500" />
              {pendingForms.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--color-danger)] rounded-full text-[10px] text-white flex items-center justify-center">{pendingForms.length}</span>
              )}
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {doctor.name}</h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">Manage and track patient consent forms</p>
            </div>
            <Link href="/forms/new" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              <Plus className="w-4 h-4" /> New Consent Form
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-[var(--color-border)] rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[var(--color-text-secondary)]">{s.label}</span>
                  <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Reminders Card */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-[var(--color-warning)]" />
              <h2 className="font-semibold text-sm">Reminders</h2>
            </div>
            {pendingForms.length > 0 ? (
              <div className="space-y-3">
                {pendingForms.map(form => (
                  <div key={form.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm">
                        <strong>{form.patientName}</strong>
                        <span className="text-[var(--color-muted)]"> -- sent {form.sentAt ? timeAgo(form.sentAt) : "N/A"} -- </span>
                        <span className="text-amber-600 font-medium">No response</span>
                      </span>
                    </div>
                    <button className="text-xs font-medium text-[var(--color-primary)] bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1.5">
                      <Send className="w-3 h-3" />
                      Send Reminder
                    </button>
                  </div>
                ))}
                <p className="text-xs text-[var(--color-muted)] mt-2">Auto-reminders: 4h, 24h, 48h</p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">No pending reminders</p>
            )}
          </div>

          <div className="bg-white border border-[var(--color-border)] rounded-lg">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="font-semibold">Recent Forms</h2>
              <div className="flex gap-2">
                <select className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm">
                  <option>All Status</option>
                  <option>Signed</option>
                  <option>Pending</option>
                  <option>Draft</option>
                  <option>Expired</option>
                </select>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-sm text-[var(--color-text-secondary)]">
                  <th className="px-5 py-3 font-medium">Patient Name</th>
                  <th className="px-5 py-3 font-medium">Operation</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => {
                  const status = getConsentStatusConfig(form.status);
                  return (
                    <tr key={form.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-sm">{form.patientName}</p>
                        <p className="text-xs text-[var(--color-muted)]">{form.uhid}</p>
                      </td>
                      <td className="px-5 py-4 text-sm">{form.operation}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                        {new Date(form.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/forms/${form.id}`} className="p-1.5 hover:bg-gray-100 rounded-md" title="View">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          {form.status === "signed" && (
                            <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Download PDF">
                              <Download className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                          {form.status === "pending_patient" && (
                            <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Send Reminder">
                              <Send className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                          {form.status === "draft" && (
                            <>
                              <Link href={`/forms/${form.id}`} className="p-1.5 hover:bg-gray-100 rounded-md" title="Edit">
                                <Pencil className="w-4 h-4 text-gray-500" />
                              </Link>
                              <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Delete">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                          {form.status === "expired" && (
                            <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Renew">
                              <RefreshCw className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {forms.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">
                      No consent forms yet. Create your first one.
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
