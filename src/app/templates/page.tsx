"use client";
import { Sidebar } from "@/components/Sidebar";
import { Plus, FileText, Copy, Pencil, Trash2, Search, ShieldAlert, Stethoscope, ClipboardList, Users } from "lucide-react";
import Link from "next/link";

const templates = [
  {
    id: "surgery-consent",
    name: "Consent for Procedure / Surgery (High Risk)",
    desc: "Standard high-risk surgical consent form — covers procedure authorization, risk disclosure, and surgeon/witness signatures",
    icon: ShieldAlert,
    lang: "EN",
    used: 312,
    lastEdited: "1 day ago",
    color: "bg-red-50 text-red-600",
  },
  {
    id: "anaesthesia-consent",
    name: "Consent for Anaesthesia",
    desc: "Anaesthesia-specific consent — General, Spinal/Epidural, Nerve Blocks, Monitored Care with risk disclosures",
    icon: Stethoscope,
    lang: "EN",
    used: 287,
    lastEdited: "1 day ago",
    color: "bg-blue-50 text-[var(--color-primary)]",
  },
  {
    id: "surgery-consent-tamil",
    name: "அறுவை சிகிச்சைக்கான ஒப்புதல் படிவம்",
    desc: "பிரிவேற்கவல் — Tamil version of the high-risk surgical consent form for Tamil-speaking patients",
    icon: ShieldAlert,
    lang: "தமிழ்",
    used: 98,
    lastEdited: "3 days ago",
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "anaesthesia-consent-tamil",
    name: "மயக்க மருந்து ஒப்புதல்",
    desc: "Tamil version of the anaesthesia consent form — மயக்க மருந்து வகைகள் மற்றும் ஆபத்துகள்",
    icon: Stethoscope,
    lang: "தமிழ்",
    used: 76,
    lastEdited: "3 days ago",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "anaesthesia-care-plan",
    name: "Anaesthesia Care Plan",
    desc: "Pre-anaesthetic evaluation, airway assessment, ASA classification, and planned anaesthesia technique",
    icon: ClipboardList,
    lang: "EN",
    used: 145,
    lastEdited: "2 days ago",
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "pre-op-checklist",
    name: "Pre-Operative Checklist (Ward)",
    desc: "Ward-level checklist — identity verification, consent confirmation, site marking, NPO status, pre-op medications",
    icon: ClipboardList,
    lang: "EN",
    used: 201,
    lastEdited: "1 day ago",
    color: "bg-green-50 text-green-600",
  },
  {
    id: "nurses-consent-record",
    name: "Nurses Consent Record",
    desc: "Nursing documentation of consent process — patient understanding verification, interpreter use, and witness record",
    icon: Users,
    lang: "EN",
    used: 167,
    lastEdited: "2 days ago",
    color: "bg-cyan-50 text-cyan-600",
  },
];

function TemplateCard({ t }: { t: typeof templates[number] }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.color}`}>
            <t.icon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            t.lang === "EN"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}>
            {t.lang}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Edit"><Pencil className="w-3.5 h-3.5 text-gray-500" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Duplicate"><Copy className="w-3.5 h-3.5 text-gray-500" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md" title="Delete"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
        </div>
      </div>
      <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
      <p className="text-xs text-[var(--color-text-secondary)] mb-4 line-clamp-2">{t.desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
          <span>Used {t.used} times</span>
          <span>Edited {t.lastEdited}</span>
        </div>
        <Link
          href={`/templates/${t.id}`}
          className="text-xs font-medium text-[var(--color-primary)] hover:underline"
        >
          Use &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function Templates() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Form Templates</h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">MGMCRI Hospital, Pondicherry — Standardized consent forms</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]">
              <Plus className="w-4 h-4" /> Create Template
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search templates..." className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
            <select className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Surgery</option>
              <option>Anaesthesia</option>
              <option>Nursing</option>
              <option>Pre-Operative</option>
            </select>
            <select className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm">
              <option>All Languages</option>
              <option>English</option>
              <option>Tamil (தமிழ்)</option>
            </select>
            <select className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm">
              <option>Most Used</option>
              <option>Recently Edited</option>
              <option>Alphabetical</option>
            </select>
          </div>

          {/* Section 1: Surgery / Procedure Consent */}
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide pb-2 border-b border-[var(--color-border)] mb-4">Surgery / Procedure Consent</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {templates.filter(t => t.id === "surgery-consent" || t.id === "surgery-consent-tamil").map(t => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>

          {/* Section 2: Anaesthesia Consent */}
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide pb-2 border-b border-[var(--color-border)] mb-4">Anaesthesia Consent</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {templates.filter(t => t.id === "anaesthesia-consent" || t.id === "anaesthesia-consent-tamil").map(t => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>

          {/* Section 3: Pre-Operative & Nursing */}
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide pb-2 border-b border-[var(--color-border)] mb-4">Pre-Operative &amp; Nursing</h3>
          <div className="grid grid-cols-3 gap-4">
            {templates.filter(t => t.id === "anaesthesia-care-plan" || t.id === "pre-op-checklist" || t.id === "nurses-consent-record").map(t => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
