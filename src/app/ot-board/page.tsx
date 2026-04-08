"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { getAllConsentForms, getDoctor } from "@/lib/auth";

export default function OTBoard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const forms = getAllConsentForms("mgmcri");

  // Build surgery cards from consent records
  const surgeries = forms.map(form => {
    const doctor = getDoctor(form.doctorId);
    let consentLevel: "green" | "amber" | "red" = "red";
    let consentLabel = "NO CONSENT";

    if (form.status === "signed") {
      consentLevel = "green";
      consentLabel = "ALL CONSENTS SIGNED";
    } else if (form.status === "pending_patient" || form.status === "pending_witness") {
      consentLevel = "amber";
      consentLabel = "CONSENT PENDING";
    }

    return {
      id: form.id,
      patientName: form.patientName,
      uhid: form.uhid,
      procedure: form.operation,
      surgeon: doctor?.name || "Unknown",
      scheduledTime: new Date(form.scheduledDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      consentLevel,
      consentLabel,
      surgicalConsent: form.status === "signed" ? "signed" : form.status === "pending_patient" ? "pending" : "none",
      anesthesiaConsent: form.anesthesiaStatus,
      videoKyc: form.videoKycStatus,
    };
  });

  const badgeColors = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  const borderColors = {
    green: "border-l-green-500",
    amber: "border-l-amber-500",
    red: "border-l-red-500",
  };

  function getSubIcon(status: string) {
    if (status === "signed" || status === "recorded") return { icon: "check", color: "text-green-400" };
    if (status === "pending") return { icon: "pending", color: "text-amber-400" };
    return { icon: "none", color: "text-gray-500" };
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)]">
      {/* Top bar */}
      <div className="bg-[var(--color-dark-card)] border-b border-gray-700/50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">MG</span>
          </div>
          <span className="text-white font-semibold">MGMCRI</span>
        </div>

        <h1 className="text-white text-lg font-bold tracking-wide">
          Operating Theatre &mdash; Live Status
        </h1>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-white text-sm font-mono font-medium">
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-gray-400 text-xs">
              {currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            <X className="w-4 h-4" /> Exit
          </Link>
        </div>
      </div>

      {/* Surgery cards */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-6">
          {surgeries.map(surgery => (
            <div
              key={surgery.id}
              className={`bg-[var(--color-dark-card)] rounded-xl border border-gray-700/50 overflow-hidden border-l-4 ${borderColors[surgery.consentLevel]}`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-white text-xl font-bold">{surgery.patientName}</h2>
                    <p className="text-gray-400 text-sm font-mono mt-0.5">{surgery.uhid}</p>
                  </div>
                  <span className={`${badgeColors[surgery.consentLevel]} text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide`}>
                    {surgery.consentLabel}
                  </span>
                </div>

                {/* Procedure details */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm w-24 shrink-0">Procedure</span>
                    <span className="text-gray-200 text-sm font-medium">{surgery.procedure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm w-24 shrink-0">Surgeon</span>
                    <span className="text-gray-200 text-sm">{surgery.surgeon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm w-24 shrink-0">Scheduled</span>
                    <span className="text-gray-200 text-sm font-mono">{surgery.scheduledTime}</span>
                  </div>
                </div>

                {/* Sub-items */}
                <div className="border-t border-gray-700/50 pt-4 space-y-2.5">
                  {[
                    { label: "Surgical Consent", status: surgery.surgicalConsent },
                    { label: "Anesthesia Consent", status: surgery.anesthesiaConsent },
                    { label: "Video KYC", status: surgery.videoKyc },
                  ].map(item => {
                    const { color } = getSubIcon(item.status);
                    let statusText = "Not Started";
                    let statusIcon = "---";
                    if (item.status === "signed" || item.status === "recorded") {
                      statusText = item.status === "recorded" ? "Recorded" : "Signed";
                      statusIcon = "\u2705";
                    } else if (item.status === "pending") {
                      statusText = "Pending";
                      statusIcon = "\u23F3";
                    }

                    return (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{item.label}</span>
                        <span className={`text-sm font-medium ${color}`}>
                          {statusIcon} {statusText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
