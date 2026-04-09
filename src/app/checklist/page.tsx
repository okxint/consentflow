"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";

interface PhaseItem {
  label: string;
  checked: boolean;
  hasToggle?: boolean;
  toggleValue?: boolean;
  toggleField?: string;
  hasNA?: boolean;
  naValue?: string;
}

interface PhaseState {
  completed: boolean;
  completedAt: string;
  completedBy: string;
  verifiedBy: string;
}

export default function ChecklistPage() {
  const [signInItems, setSignInItems] = useState<PhaseItem[]>([
    { label: "Patient identity confirmed (name band checked)", checked: false },
    { label: "Procedure and site confirmed and marked", checked: false },
    { label: "Consent form signed and attached", checked: false },
    { label: "Anesthesia safety check completed", checked: false },
    { label: "Pulse oximeter on patient and functioning", checked: false },
    { label: "Known allergy?", checked: false, hasToggle: true, toggleValue: false, toggleField: "allergyDetails" },
    { label: "Difficult airway / aspiration risk?", checked: false, hasToggle: true, toggleValue: false },
    { label: "Risk of blood loss >500ml?", checked: false, hasToggle: true, toggleValue: false, toggleField: "bloodLossConfirm" },
  ]);

  const [timeOutItems, setTimeOutItems] = useState<PhaseItem[]>([
    { label: "All team members introduced by name and role", checked: false },
    { label: "Surgeon confirms: patient name, procedure, incision site", checked: false },
    { label: "Anesthesiologist confirms: patient review, concerns", checked: false },
    { label: "Nursing team confirms: sterility confirmed, equipment ready", checked: false },
    { label: "Antibiotic prophylaxis given within 60 minutes?", checked: false, hasNA: true, naValue: "" },
    { label: "Essential imaging displayed?", checked: false, hasNA: true, naValue: "" },
    { label: "Anticipated critical events discussed", checked: false },
  ]);

  const [signOutItems, setSignOutItems] = useState<PhaseItem[]>([
    { label: "Procedure name recorded as performed", checked: false },
    { label: "Instrument, sponge, and needle counts correct", checked: false },
    { label: "Specimen labeled correctly", checked: false },
    { label: "Equipment problems noted?", checked: false, hasToggle: true, toggleValue: false, toggleField: "equipmentDetails" },
    { label: "Key concerns for recovery discussed with team", checked: false },
  ]);

  const [toggleDetails, setToggleDetails] = useState<Record<string, string>>({
    allergyDetails: "",
    equipmentDetails: "",
  });

  const [bloodLossConfirmed, setBloodLossConfirmed] = useState(false);

  const [phases, setPhases] = useState<Record<string, PhaseState>>({
    signIn: { completed: false, completedAt: "", completedBy: "", verifiedBy: "" },
    timeOut: { completed: false, completedAt: "", completedBy: "", verifiedBy: "" },
    signOut: { completed: false, completedAt: "", completedBy: "", verifiedBy: "" },
  });

  function toggleItem(
    items: PhaseItem[],
    setItems: React.Dispatch<React.SetStateAction<PhaseItem[]>>,
    index: number
  ) {
    const updated = [...items];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    setItems(updated);
  }

  function toggleYesNo(
    items: PhaseItem[],
    setItems: React.Dispatch<React.SetStateAction<PhaseItem[]>>,
    index: number
  ) {
    const updated = [...items];
    updated[index] = { ...updated[index], toggleValue: !updated[index].toggleValue };
    setItems(updated);
  }

  function setNAValue(
    items: PhaseItem[],
    setItems: React.Dispatch<React.SetStateAction<PhaseItem[]>>,
    index: number,
    value: string
  ) {
    const updated = [...items];
    updated[index] = { ...updated[index], naValue: value };
    setItems(updated);
  }

  function completePhase(phaseKey: string) {
    setPhases(prev => ({
      ...prev,
      [phaseKey]: {
        ...prev[phaseKey],
        completed: true,
        completedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      },
    }));
  }

  function getProgress(items: PhaseItem[]) {
    const done = items.filter(i => i.checked).length;
    return { done, total: items.length };
  }

  const inputClass = "w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

  function renderPhase(
    title: string,
    subtitle: string,
    color: string,
    bgColor: string,
    borderColor: string,
    items: PhaseItem[],
    setItems: React.Dispatch<React.SetStateAction<PhaseItem[]>>,
    phaseKey: string
  ) {
    const { done, total } = getProgress(items);
    const phase = phases[phaseKey];
    const locked = phase.completed;

    return (
      <section className={`bg-white border rounded-lg overflow-hidden ${locked ? "opacity-80" : ""}`}>
        <div className={`${bgColor} px-6 py-4 flex items-center justify-between`}>
          <div>
            <h2 className={`text-lg font-bold ${color}`}>{title}</h2>
            <p className={`text-sm ${color} opacity-80`}>{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${color}`}>{done} of {total} completed</span>
            {locked && <Lock className={`w-4 h-4 ${color}`} />}
          </div>
        </div>
        <div className="p-6 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="space-y-2">
              <label className={`flex items-start gap-3 ${locked ? "pointer-events-none" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(items, setItems, i)}
                  disabled={locked}
                  className={`w-4 h-4 mt-0.5 rounded ${borderColor}`}
                />
                <span className={`text-sm ${item.checked ? "line-through text-[var(--color-muted)]" : ""}`}>
                  {item.label}
                </span>
              </label>

              {item.hasToggle && item.checked && (
                <div className="ml-7 space-y-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => !locked && toggleYesNo(items, setItems, i)}
                      disabled={locked}
                      className={`w-10 h-6 rounded-full transition-colors relative ${item.toggleValue ? "bg-red-400" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${item.toggleValue ? "left-5" : "left-1"}`} />
                    </button>
                    <span className="text-xs font-medium">{item.toggleValue ? "Yes" : "No"}</span>
                  </div>
                  {item.toggleValue && item.toggleField === "allergyDetails" && (
                    <input
                      className={inputClass}
                      placeholder="Specify allergies"
                      value={toggleDetails.allergyDetails}
                      onChange={e => setToggleDetails(prev => ({ ...prev, allergyDetails: e.target.value }))}
                      disabled={locked}
                    />
                  )}
                  {item.toggleValue && item.toggleField === "bloodLossConfirm" && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bloodLossConfirmed}
                        onChange={e => setBloodLossConfirmed(e.target.checked)}
                        disabled={locked}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">IV access and blood availability confirmed</span>
                    </label>
                  )}
                  {item.toggleValue && item.toggleField === "equipmentDetails" && (
                    <input
                      className={inputClass}
                      placeholder="Describe equipment problems"
                      value={toggleDetails.equipmentDetails}
                      onChange={e => setToggleDetails(prev => ({ ...prev, equipmentDetails: e.target.value }))}
                      disabled={locked}
                    />
                  )}
                </div>
              )}

              {item.hasNA && item.checked && (
                <div className="ml-7">
                  <div className="flex gap-2">
                    {["Yes", "No", "N/A"].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => !locked && setNAValue(items, setItems, i, val)}
                        disabled={locked}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${item.naValue === val ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)]"}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-[var(--color-border)] pt-4 mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Completed by</label>
                <input
                  className={inputClass}
                  value={phase.completedBy}
                  onChange={e => setPhases(prev => ({ ...prev, [phaseKey]: { ...prev[phaseKey], completedBy: e.target.value } }))}
                  disabled={locked}
                  placeholder="Name and role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Verified by</label>
                <input
                  className={inputClass}
                  value={phase.verifiedBy}
                  onChange={e => setPhases(prev => ({ ...prev, [phaseKey]: { ...prev[phaseKey], verifiedBy: e.target.value } }))}
                  disabled={locked}
                  placeholder="Name and role"
                />
              </div>
            </div>
            {locked ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Phase completed at {phase.completedAt}</span>
              </div>
            ) : (
              <button
                onClick={() => completePhase(phaseKey)}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${bgColor.includes("amber") ? "bg-amber-500 hover:bg-amber-600" : bgColor.includes("blue") ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                Complete Phase
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 bg-[var(--color-card)]">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-1">Surgical Safety Checklist</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">WHO format — NABH Required</p>

          {/* Patient Info Bar */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide">Patient</p>
              <p className="text-sm font-semibold">Rajesh Kumar</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide">Patient ID</p>
              <p className="text-sm font-semibold">APL-2026-1847</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide">Procedure</p>
              <p className="text-sm font-semibold">Lap. Cholecystectomy</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide">Date</p>
              <p className="text-sm font-semibold">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          </div>

          <div className="space-y-6">
            {renderPhase(
              "SIGN IN",
              "Before Anesthesia",
              "text-amber-800",
              "bg-amber-50",
              "border-amber-300",
              signInItems,
              setSignInItems,
              "signIn"
            )}

            {renderPhase(
              "TIME OUT",
              "Before Skin Incision",
              "text-blue-800",
              "bg-blue-50",
              "border-blue-300",
              timeOutItems,
              setTimeOutItems,
              "timeOut"
            )}

            {renderPhase(
              "SIGN OUT",
              "Before Patient Leaves OR",
              "text-green-800",
              "bg-green-50",
              "border-green-300",
              signOutItems,
              setSignOutItems,
              "signOut"
            )}
          </div>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}
