"use client";
import { Sidebar } from "@/components/Sidebar";
import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared: Procedure-specific risk database (Orthopaedic focus)       */
/* ------------------------------------------------------------------ */
const PROCEDURE_DATABASE: Record<string, { category: string; risks: string[] }> = {
  "Total Knee Replacement": {
    category: "Orthopaedics",
    risks: ["Infection (superficial / deep / prosthetic joint)", "Deep Vein Thrombosis (DVT)", "Pulmonary Embolism", "Implant loosening / failure", "Periprosthetic fracture", "Stiffness / reduced range of motion", "Nerve damage (peroneal nerve palsy)", "Vascular injury", "Leg length discrepancy", "Persistent pain", "Allergic reaction to implant materials", "Blood loss requiring transfusion", "Wound dehiscence"],
  },
  "Total Hip Replacement": {
    category: "Orthopaedics",
    risks: ["Dislocation of prosthesis", "Infection (superficial / deep / prosthetic joint)", "Deep Vein Thrombosis (DVT)", "Pulmonary Embolism", "Leg length discrepancy", "Periprosthetic fracture", "Implant loosening / wear", "Sciatic nerve injury", "Heterotopic ossification", "Blood loss requiring transfusion", "Vascular injury"],
  },
  "ACL Reconstruction": {
    category: "Orthopaedics",
    risks: ["Graft failure / re-rupture", "Infection", "Stiffness / arthrofibrosis", "Anterior knee pain", "Nerve damage (saphenous / peroneal)", "DVT / PE", "Donor site morbidity (patellar tendon / hamstring)", "Residual instability", "Hardware irritation", "Tunnel widening"],
  },
  "Rotator Cuff Repair": {
    category: "Orthopaedics",
    risks: ["Re-tear of repaired tendon", "Stiffness / frozen shoulder", "Nerve injury (axillary / suprascapular)", "Infection", "Anchor / suture failure", "Deltoid detachment", "Complex Regional Pain Syndrome (CRPS)", "Persistent weakness", "DVT / PE"],
  },
  "Spinal Fusion": {
    category: "Orthopaedics",
    risks: ["Non-union / pseudarthrosis", "Adjacent segment disease", "Nerve root injury / paralysis", "Spinal cord injury", "Dural tear / CSF leak", "Infection (superficial / deep / discitis)", "Hardware failure / loosening", "Blood loss requiring transfusion", "DVT / PE", "Chronic pain at graft site", "Urinary retention"],
  },
  "Laminectomy / Discectomy": {
    category: "Orthopaedics",
    risks: ["Recurrent disc herniation", "Dural tear / CSF leak", "Nerve root injury", "Infection", "Epidural haematoma", "Instability requiring fusion", "Incomplete symptom relief", "Cauda equina syndrome", "DVT / PE"],
  },
  "Open Reduction Internal Fixation (ORIF)": {
    category: "Orthopaedics",
    risks: ["Infection", "Non-union / malunion", "Hardware failure / breakage", "Nerve / vascular injury", "Compartment syndrome", "Blood loss", "Stiffness / reduced mobility", "Re-fracture after hardware removal", "Wound complications", "DVT / PE"],
  },
  "Arthroscopy (Knee)": {
    category: "Orthopaedics",
    risks: ["Infection", "DVT / PE", "Nerve / vascular injury", "Stiffness", "Haemarthrosis", "Cartilage damage (iatrogenic)", "Persistent pain / swelling", "Incomplete symptom relief", "Instrument breakage"],
  },
  "Arthroscopy (Shoulder)": {
    category: "Orthopaedics",
    risks: ["Stiffness / frozen shoulder", "Nerve injury (axillary / musculocutaneous)", "Infection", "Anchor failure", "Recurrent instability", "Chondrolysis", "CRPS", "Portal site complications"],
  },
  "Wound Debridement": {
    category: "Orthopaedics",
    risks: ["Infection / sepsis", "Bleeding", "Nerve damage", "Incomplete debridement requiring repeat surgery", "Wound healing failure", "Need for skin graft / flap", "Pain", "Scarring"],
  },
  "External Fixator Application": {
    category: "Orthopaedics",
    risks: ["Pin site infection", "Pin loosening / breakage", "Malunion / non-union", "Nerve / vascular injury", "Joint stiffness", "Compartment syndrome", "Re-fracture after removal", "Chronic pain"],
  },
  "Bone Cement Spacer Insertion": {
    category: "Orthopaedics",
    risks: ["Bone cement implantation syndrome", "Spacer dislocation / fracture", "Persistent infection", "Allergic reaction to cement", "Fracture around spacer", "Blood loss", "DVT / PE", "Joint stiffness"],
  },
  "Amputation": {
    category: "Orthopaedics",
    risks: ["Phantom limb pain", "Wound infection / dehiscence", "Stump neuroma", "Revision surgery required", "Bleeding / haematoma", "DVT / PE", "Psychological impact", "Contracture of proximal joint", "Bone overgrowth (in children)"],
  },
  "Tendon Repair": {
    category: "Orthopaedics",
    risks: ["Re-rupture", "Adhesion formation / stiffness", "Infection", "Nerve injury", "Suture granuloma", "Weakness / incomplete recovery", "CRPS", "Wound complications"],
  },
  "Hip Hemiarthroplasty": {
    category: "Orthopaedics",
    risks: ["Dislocation", "Periprosthetic fracture", "Infection", "DVT / PE", "Leg length discrepancy", "Acetabular erosion", "Implant loosening", "Blood loss requiring transfusion", "Sciatic nerve injury"],
  },
  "Carpal Tunnel Release": {
    category: "Orthopaedics",
    risks: ["Incomplete symptom relief", "Pillar pain", "Scar tenderness", "Nerve injury (median / palmar cutaneous branch)", "Infection", "CRPS", "Grip weakness (temporary)", "Recurrence", "Bowstringing of flexor tendons"],
  },
  "Trigger Finger Release": {
    category: "Orthopaedics",
    risks: ["Infection", "Digital nerve injury", "Incomplete release", "Stiffness", "Bowstringing", "Recurrence", "Wound complications"],
  },
  "Ilizarov / Ring Fixator": {
    category: "Orthopaedics",
    risks: ["Pin site infection", "Wire breakage", "Premature consolidation", "Delayed union / non-union", "Joint subluxation", "Nerve / vascular injury", "Equinus deformity", "Muscle contracture", "Prolonged treatment time"],
  },
};

const PROCEDURE_NAMES = Object.keys(PROCEDURE_DATABASE);

function getProcedureRisks(procedureName: string): string[] {
  // Exact match
  if (PROCEDURE_DATABASE[procedureName]) return PROCEDURE_DATABASE[procedureName].risks;
  // Partial match
  const lower = procedureName.toLowerCase();
  for (const [name, data] of Object.entries(PROCEDURE_DATABASE)) {
    if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
      return data.risks;
    }
  }
  return [];
}

/* ------------------------------------------------------------------ */
/*  Shared: Auto-fill complications based on age, gender, comorbidities */
/* ------------------------------------------------------------------ */
const COMORBIDITY_OPTIONS = [
  "Diabetes Mellitus",
  "Hypertension",
  "Coronary Artery Disease",
  "Chronic Kidney Disease",
  "COPD / Asthma",
  "Obesity (BMI > 30)",
  "Liver Disease",
  "Bleeding Disorders",
  "Immunocompromised",
  "Previous DVT / PE",
  "Stroke History",
  "Thyroid Disorder",
];

function getAutoComplications(age: string, gender: string, comorbidities: string[]): string[] {
  const ageNum = parseInt(age) || 0;
  const risks: string[] = [];

  // Age-based
  if (ageNum >= 65) {
    risks.push("Delayed wound healing (elderly)");
    risks.push("Higher risk of post-op delirium");
    risks.push("Increased fall risk post-procedure");
  } else if (ageNum >= 50) {
    risks.push("Age-related slower recovery");
  }
  if (ageNum < 18) {
    risks.push("Growth plate / developmental considerations");
  }

  // Gender-based
  if (gender === "Female" && ageNum >= 15 && ageNum <= 50) {
    risks.push("Pregnancy must be ruled out before procedure");
  }
  if (gender === "Female" && ageNum >= 50) {
    risks.push("Osteoporosis-related fracture risk");
  }
  if (gender === "Male" && ageNum >= 50) {
    risks.push("Higher cardiovascular event risk");
  }

  // Comorbidity-based
  if (comorbidities.includes("Diabetes Mellitus")) {
    risks.push("Impaired wound healing / surgical site infection");
    risks.push("Hypoglycemia / hyperglycemia peri-operatively");
  }
  if (comorbidities.includes("Hypertension")) {
    risks.push("Intra-operative blood pressure fluctuations");
    risks.push("Higher bleeding risk");
  }
  if (comorbidities.includes("Coronary Artery Disease")) {
    risks.push("Risk of myocardial infarction peri-operatively");
    risks.push("Cardiac arrhythmias under anaesthesia");
  }
  if (comorbidities.includes("Chronic Kidney Disease")) {
    risks.push("Electrolyte imbalance / fluid overload");
    risks.push("Drug clearance issues — dose adjustments needed");
  }
  if (comorbidities.includes("COPD / Asthma")) {
    risks.push("Bronchospasm during / after anaesthesia");
    risks.push("Post-op respiratory failure / prolonged ventilation");
  }
  if (comorbidities.includes("Obesity (BMI > 30)")) {
    risks.push("Difficult airway / intubation");
    risks.push("Deep vein thrombosis (DVT)");
    risks.push("Wound dehiscence");
  }
  if (comorbidities.includes("Liver Disease")) {
    risks.push("Coagulopathy / excessive bleeding");
    risks.push("Impaired drug metabolism");
  }
  if (comorbidities.includes("Bleeding Disorders")) {
    risks.push("Uncontrolled hemorrhage");
    risks.push("Need for blood product transfusion");
  }
  if (comorbidities.includes("Immunocompromised")) {
    risks.push("Severe post-operative infection");
    risks.push("Delayed / impaired healing");
  }
  if (comorbidities.includes("Previous DVT / PE")) {
    risks.push("Recurrent deep vein thrombosis");
    risks.push("Pulmonary embolism");
  }
  if (comorbidities.includes("Stroke History")) {
    risks.push("Risk of recurrent cerebrovascular event");
  }
  if (comorbidities.includes("Thyroid Disorder")) {
    risks.push("Thyroid storm / myxedema coma risk");
  }

  return risks;
}

/* ─── Shared Patient Demographics Section ─── */
function PatientDemographicsSection({
  age, gender, comorbidities, customComorbidity, procedureName,
  onAgeChange, onGenderChange, onToggleComorbidity, onCustomComorbidityChange, onAddCustomComorbidity,
  onProcedureChange, onProcedureSelect,
  autoRisks, procedureRisks, onApplyAutoRisks, onApplyProcedureRisks,
  customComplication, onCustomComplicationChange, onAddCustomComplication,
  selectedComplications, onToggleComplication,
  inputClass,
  tamilLabels,
}: {
  age: string;
  gender: string;
  comorbidities: string[];
  customComorbidity: string;
  procedureName: string;
  onAgeChange: (v: string) => void;
  onGenderChange: (v: string) => void;
  onToggleComorbidity: (c: string) => void;
  onCustomComorbidityChange: (v: string) => void;
  onAddCustomComorbidity: () => void;
  onProcedureChange: (v: string) => void;
  onProcedureSelect: (v: string) => void;
  autoRisks: string[];
  procedureRisks: string[];
  onApplyAutoRisks: () => void;
  onApplyProcedureRisks: () => void;
  customComplication: string;
  onCustomComplicationChange: (v: string) => void;
  onAddCustomComplication: () => void;
  selectedComplications: string[];
  onToggleComplication: (c: string) => void;
  inputClass: string;
  tamilLabels?: boolean;
}) {
  const [showProcedureDropdown, setShowProcedureDropdown] = useState(false);
  const filtered = procedureName
    ? PROCEDURE_NAMES.filter(p => p.toLowerCase().includes(procedureName.toLowerCase()))
    : PROCEDURE_NAMES;

  // Merge all possible complications for checkbox display
  const allProcedureComplications = procedureRisks;
  const allProfileComplications = autoRisks;

  return (
    <div className="bg-blue-50/50 border border-blue-200/60 rounded-lg p-5 space-y-5">
      <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
        {tamilLabels ? "நோயாளி விவரங்கள் — Patient Demographics" : "Patient Demographics"}
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {tamilLabels ? "வயது / Age" : "Age"}
          </label>
          <input
            className={`${inputClass} w-full`}
            type="number"
            placeholder="e.g. 45"
            value={age}
            onChange={e => onAgeChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {tamilLabels ? "பாலினம் / Gender" : "Gender"}
          </label>
          <select
            className={`${inputClass} w-full`}
            value={gender}
            onChange={e => onGenderChange(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div />
      </div>

      {/* Procedure name with dropdown */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {tamilLabels ? "செயல்முறை பெயர் / Procedure Name" : "Procedure Name (type to search)"}
        </label>
        <input
          className={`${inputClass} w-full`}
          placeholder="e.g. Total Knee Replacement"
          value={procedureName}
          onChange={e => { onProcedureChange(e.target.value); setShowProcedureDropdown(true); }}
          onFocus={() => setShowProcedureDropdown(true)}
          onBlur={() => setTimeout(() => setShowProcedureDropdown(false), 200)}
        />
        {showProcedureDropdown && filtered.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filtered.map(p => (
              <button
                key={p}
                onMouseDown={() => { onProcedureSelect(p); setShowProcedureDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 hover:text-teal-800 transition-colors border-b border-gray-50 last:border-0"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comorbidities with checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {tamilLabels ? "ஏற்கனவே உள்ள நோய்கள் / Existing Comorbidities" : "Existing Comorbidities"}
        </label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[...COMORBIDITY_OPTIONS, ...comorbidities.filter(c => !COMORBIDITY_OPTIONS.includes(c))].map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={comorbidities.includes(c)}
                onChange={() => onToggleComorbidity(c)}
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)]"
              />
              <span className={`text-xs ${comorbidities.includes(c) ? "text-gray-900 font-medium" : "text-gray-600"}`}>{c}</span>
              {!COMORBIDITY_OPTIONS.includes(c) && (
                <span className="text-[9px] text-blue-500 font-medium">(custom)</span>
              )}
            </label>
          ))}
        </div>
        {/* Add another comorbidity */}
        <div className="flex items-center gap-2 mt-3">
          <input
            className={`${inputClass} flex-1`}
            placeholder={tamilLabels ? "வேறு நோய் சேர் / Add another comorbidity..." : "Add another comorbidity..."}
            value={customComorbidity}
            onChange={e => onCustomComorbidityChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onAddCustomComorbidity()}
          />
          <button
            onClick={onAddCustomComorbidity}
            disabled={!customComorbidity.trim()}
            className="text-[10px] font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            + Add Another
          </button>
        </div>
      </div>

      {/* ── Complications Section ── */}
      {(allProcedureComplications.length > 0 || allProfileComplications.length > 0 || selectedComplications.length > 0) && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {tamilLabels ? "சிக்கல்கள் / Complications" : "Complications"}
            <span className="text-[10px] font-normal text-gray-400 ml-2 normal-case">(check all that apply)</span>
          </label>

          {/* Procedure-specific complications */}
          {allProcedureComplications.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {tamilLabels ? "செயல்முறை சார்ந்த சிக்கல்கள் / Procedure-specific" : "Procedure-specific Complications"}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-teal-50/50 border border-teal-100 rounded-lg p-3">
                {allProcedureComplications.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedComplications.includes(c)}
                      onChange={() => onToggleComplication(c)}
                      className="w-4 h-4 rounded border-teal-300 text-teal-600"
                    />
                    <span className={`text-xs ${selectedComplications.includes(c) ? "text-teal-900 font-medium" : "text-teal-700"}`}>{c}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={onApplyProcedureRisks}
                className="mt-1.5 text-[10px] font-semibold text-teal-600 hover:text-teal-800 transition-colors"
              >
                {tamilLabels ? "அனைத்தையும் தேர்வு / Select All" : "Select All"}
              </button>
            </div>
          )}

          {/* Profile-based complications */}
          {allProfileComplications.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {tamilLabels ? "நோயாளி சுயவிவர சிக்கல்கள் / Based on patient profile" : "Based on Age, Gender & Comorbidities"}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-amber-50/50 border border-amber-100 rounded-lg p-3">
                {allProfileComplications.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedComplications.includes(c)}
                      onChange={() => onToggleComplication(c)}
                      className="w-4 h-4 rounded border-amber-300 text-amber-600"
                    />
                    <span className={`text-xs ${selectedComplications.includes(c) ? "text-amber-900 font-medium" : "text-amber-700"}`}>{c}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={onApplyAutoRisks}
                className="mt-1.5 text-[10px] font-semibold text-amber-600 hover:text-amber-800 transition-colors"
              >
                {tamilLabels ? "அனைத்தையும் தேர்வு / Select All" : "Select All"}
              </button>
            </div>
          )}

          {/* Custom-added complications shown as checked boxes */}
          {selectedComplications.filter(c => !allProcedureComplications.includes(c) && !allProfileComplications.includes(c)).length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {tamilLabels ? "கைமுறையாக சேர்க்கப்பட்ட / Manually Added" : "Manually Added"}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-gray-50 border border-gray-200 rounded-lg p-3">
                {selectedComplications.filter(c => !allProcedureComplications.includes(c) && !allProfileComplications.includes(c)).map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => onToggleComplication(c)}
                      className="w-4 h-4 rounded border-gray-300 text-gray-600"
                    />
                    <span className="text-xs text-gray-900 font-medium">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add another complication */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {tamilLabels ? "கூடுதல் சிக்கல் சேர் / Add Another Complication" : "Add Another Complication"}
        </label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder={tamilLabels ? "சிக்கல் தட்டச்சு செய்..." : "Type any complication and press Add..."}
            value={customComplication}
            onChange={e => onCustomComplicationChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onAddCustomComplication()}
          />
          <button
            onClick={onAddCustomComplication}
            disabled={!customComplication.trim()}
            className="text-[10px] font-semibold bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            + Add Another
          </button>
        </div>
      </div>

      {/* Summary count */}
      {selectedComplications.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between">
          <p className="text-xs font-medium text-gray-700">
            {tamilLabels
              ? `${selectedComplications.length} சிக்கல்கள் தேர்ந்தெடுக்கப்பட்டன`
              : `${selectedComplications.length} complication${selectedComplications.length === 1 ? "" : "s"} selected`}
          </p>
          <span className="text-[10px] text-gray-400">These will appear on the consent form</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template A — Consent for Procedure / Surgery, High Risk Consent   */
/* ------------------------------------------------------------------ */
function SurgeryConsentTemplate() {
  const [form, setForm] = useState({
    patientGuardianName: "",
    procedureName: "",
    indication: "",
    patientName: "",
    age: "",
    gender: "",
    comorbidities: [] as string[],
    customComorbidity: "",
    customComplication: "",
    unableReason: "",
    guardianName: "",
    relationship: "",
    risks: ["Infection", "Bleeding / Haematoma", "Graft Failure", "Nerve Damage", "Vascular Damage", "Joint Stiffness"],
    surgeonName: "",
    sigPatientName: "",
    sigPatientDate: "",
    sigWitnessName: "",
    sigWitnessDate: "",
    sigSurgeonName: "",
    sigSurgeonDate: "",
    reviewPatientName: "",
    reviewDate: "",
    selectedComplications: [] as string[],
  });

  const autoRisks = getAutoComplications(form.age, form.gender, form.comorbidities);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(c: string) {
    setForm(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(c)
        ? prev.comorbidities.filter(x => x !== c)
        : [...prev.comorbidities, c],
    }));
  }

  function toggleComplication(c: string) {
    setForm(prev => ({
      ...prev,
      selectedComplications: prev.selectedComplications.includes(c)
        ? prev.selectedComplications.filter(x => x !== c)
        : [...prev.selectedComplications, c],
    }));
  }

  function applyAutoRisks() {
    setForm(prev => ({
      ...prev,
      risks: [...prev.risks, ...autoRisks],
      selectedComplications: [...new Set([...prev.selectedComplications, ...autoRisks])],
    }));
  }

  function updateRisk(index: number, value: string) {
    setForm(prev => {
      const risks = [...prev.risks];
      risks[index] = value;
      return { ...prev, risks };
    });
  }

  const inputClass = "border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors";
  const inlineInput = `${inputClass} inline-block`;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Hospital Header */}
      <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">CITY GENERAL HOSPITAL</h1>
              <p className="text-teal-100 text-sm">A Unit of Demo Medical University &mdash; Chennai</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-center text-base font-bold uppercase tracking-wide text-gray-900">
            Consent Form for Procedure / Surgery, High Risk Consent
          </h2>
          <p className="text-center text-xs text-gray-500 mt-1 italic">
            (The contents of this form have been explained to me in my spoken language)
          </p>
          <p className="text-center text-xs text-red-500 font-semibold mt-1">
            (USE NO ABBREVIATION)
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              This consent form should be signed by the patient (18 years or older) or by a parent / guardian of the patient who is under 18 years of age
              or is unable to consent. A patient over 18 years of age may also sign this consent on behalf of another if they are appointed to do so by the other patient.
            </p>
          </div>

          {/* Authorization section */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>I,</span>
              <input
                className={`${inlineInput} w-64`}
                placeholder="Patient / Guardian Name"
                value={form.patientGuardianName}
                onChange={e => update("patientGuardianName", e.target.value)}
              />
            </p>

            <p>
              hereby authorize the performance of the following operation(s),
              procedure(s) or treatment(s) hereinafter referred to as procedures:
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Procedure Name</label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Name of the procedure / operation"
                value={form.procedureName}
                onChange={e => update("procedureName", e.target.value)}
              />
            </div>

            <p className="flex flex-wrap items-baseline gap-1">
              <span>for</span>
              <input
                className={`${inlineInput} w-80`}
                placeholder="Indication / Reason"
                value={form.indication}
                onChange={e => update("indication", e.target.value)}
              />
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name of the Patient</label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Patient full name"
                value={form.patientName}
                onChange={e => update("patientName", e.target.value)}
              />
            </div>
          </div>

          {/* Patient Demographics + Auto Complications */}
          <PatientDemographicsSection
            age={form.age} gender={form.gender} comorbidities={form.comorbidities}
            customComorbidity={form.customComorbidity} procedureName={form.procedureName}
            onAgeChange={v => update("age", v)} onGenderChange={v => update("gender", v)}
            onToggleComorbidity={toggleComorbidity}
            onCustomComorbidityChange={v => update("customComorbidity", v)}
            onAddCustomComorbidity={() => { if (form.customComorbidity.trim()) { toggleComorbidity(form.customComorbidity.trim()); update("customComorbidity", ""); } }}
            onProcedureChange={v => update("procedureName", v)}
            onProcedureSelect={v => update("procedureName", v)}
            autoRisks={autoRisks} procedureRisks={getProcedureRisks(form.procedureName)}
            onApplyAutoRisks={applyAutoRisks}
            onApplyProcedureRisks={() => setForm(prev => ({ ...prev, risks: [...prev.risks, ...getProcedureRisks(prev.procedureName)] }))}
            customComplication={form.customComplication}
            onCustomComplicationChange={v => update("customComplication", v)}
            onAddCustomComplication={() => { if (form.customComplication.trim()) { setForm(prev => ({ ...prev, risks: [...prev.risks, prev.customComplication.trim()], customComplication: "" })); } }}
            selectedComplications={form.selectedComplications}
            onToggleComplication={toggleComplication}
            inputClass={inputClass}
          />

          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                The patient is unable to give consent because
              </label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Reason (leave blank if patient is consenting)"
                value={form.unableReason}
                onChange={e => update("unableReason", e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span>and I</span>
              <input
                className={`${inlineInput} w-48`}
                placeholder="Guardian name"
                value={form.guardianName}
                onChange={e => update("guardianName", e.target.value)}
              />
              <span>(</span>
              <input
                className={`${inlineInput} w-40`}
                placeholder="Relationship"
                value={form.relationship}
                onChange={e => update("relationship", e.target.value)}
              />
              <span>to the patient)</span>
            </div>

            <p className="text-gray-700">therefore consent for the patient to undergo the above Procedure.</p>
          </div>

          {/* Information paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              I have been informed of the benefits and the reason for doing the procedure as indicated by the clinical observations
              and or diagnostics performed. I recognize that the practice of medicine is as much an art as science and therefore
              acknowledge that no guarantee has been or can be made regarding the likelihood of success or outcome.
            </p>
          </div>

          {/* Complications section */}
          <div className="space-y-3">
            <p className="text-sm text-gray-800 font-medium">
              The procedure, benefit and risk and/or possible complications has been explained to me as outlined below:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {form.risks.map((risk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 w-5">{i + 1}.</span>
                  <input
                    className={`${inputClass} flex-1`}
                    value={risk}
                    onChange={e => updateRisk(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional paragraphs */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              I have also been told about the alternatives available for this procedure / surgery including the advantages
              and disadvantages of the alternatives.
            </p>
          </div>

          {/* Surgeon authorization */}
          <div className="flex flex-wrap items-baseline gap-1 text-sm text-gray-800">
            <span>I authorize Dr.</span>
            <input
              className={`${inlineInput} w-56`}
              placeholder="Surgeon Name"
              value={form.surgeonName}
              onChange={e => update("surgeonName", e.target.value)}
            />
            <span>and such associates and assistants as may be signed by him/her to perform the above procedure.</span>
          </div>

          {/* Bold warning paragraph */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-xs text-gray-800 leading-relaxed font-semibold">
              As with any procedure I am aware that risks such as change in blood pressure, anesthetic allergic reactions,
              blood loss, infection, heart failure, cardiac arrest including death, paralysis, ICU care, post-operative period
              etc. may arise necessitating attention. I also state that my or my family shall not hold the hospital or its doctors
              responsible for any consequences whatsoever arising out of the above said procedure being performed on me / patient.
            </p>
          </div>

          {/* Acknowledgment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              I acknowledge that I have had an opportunity to discuss and understand this procedure, its risks, benefits,
              alternatives and consequences of not having the procedure. All my questions have been answered to my satisfaction.
            </p>
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              Signatures
            </h3>

            {/* Patient / Guardian */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Patient / Guardian Name</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Full name"
                  value={form.sigPatientName}
                  onChange={e => update("sigPatientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigPatientDate}
                  onChange={e => update("sigPatientDate", e.target.value)}
                />
              </div>
            </div>

            {/* Witness */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Witness</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Witness name"
                  value={form.sigWitnessName}
                  onChange={e => update("sigWitnessName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigWitnessDate}
                  onChange={e => update("sigWitnessDate", e.target.value)}
                />
              </div>
            </div>

            {/* Surgeon */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Surgeon</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Surgeon name"
                  value={form.sigSurgeonName}
                  onChange={e => update("sigSurgeonName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigSurgeonDate}
                  onChange={e => update("sigSurgeonDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Review of Consent in Case of Postponement */}
          <div className="border-t-2 border-gray-300 pt-5 mt-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Review of Consent in Case of Postponement
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Patient / Guardian Name</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Full name"
                  value={form.reviewPatientName}
                  onChange={e => update("reviewPatientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.reviewDate}
                  onChange={e => update("reviewDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white border border-t-0 border-[var(--color-border)] rounded-b-lg px-8 py-5 flex items-center justify-between">
        <button className="border border-[var(--color-border)] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Save as Custom Template
        </button>
        <button className="bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
          Use This Template
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template B — Consent Form for Anaesthesia                         */
/* ------------------------------------------------------------------ */
function AnaesthesiaConsentTemplate() {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    comorbidities: [] as string[],
    customComorbidity: "",
    customComplication: "",
    procedure: "",
    anaesthesiaType: "",
    patientNameFull: "",
    generalAnaesthesia: false,
    spinalEpidural: false,
    nerveBlocks: false,
    monitoredCare: false,
    specificRisk: "",
    sigPatientName: "",
    sigPatientDate: "",
    sigParentName: "",
    sigParentDate: "",
    sigAnaesthesiologistName: "",
    sigAnaesthesiologistDate: "",
    selectedComplications: [] as string[],
  });

  const autoRisks = getAutoComplications(form.age, form.gender, form.comorbidities);

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(c: string) {
    setForm(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(c)
        ? prev.comorbidities.filter(x => x !== c)
        : [...prev.comorbidities, c],
    }));
  }

  function toggleComplication(c: string) {
    setForm(prev => ({
      ...prev,
      selectedComplications: prev.selectedComplications.includes(c)
        ? prev.selectedComplications.filter(x => x !== c)
        : [...prev.selectedComplications, c],
    }));
  }

  const inputClass = "border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors";
  const inlineInput = `${inputClass} inline-block`;

  const anaesthesiaTypes = [
    {
      field: "generalAnaesthesia",
      label: "GENERAL ANAESTHESIA",
      description: "Includes administration of drugs and/or gases via a tube placed into the trachea (windpipe).",
      risks: "Nausea, vomiting, sore throat, injury to teeth and dental prostheses, hoarseness, injury to lips or teeth, aspiration, awareness under anaesthesia",
    },
    {
      field: "spinalEpidural",
      label: "SPINAL OR EPIDURAL ANAESTHESIA",
      description: "Includes needle injection into spinal canal or epidural space.",
      risks: "Backache, headaches, buzzing in ears, convulsions, infection, persistent numbness, paralysis or degrees of weakness, bladder retention",
    },
    {
      field: "nerveBlocks",
      label: "NERVE BLOCKS",
      description: "Includes needle injection near major or motor nerves.",
      risks: "Headache, backache, buzzing in the ears, convulsions, infection, persistent numbness, paralysis",
    },
    {
      field: "monitoredCare",
      label: "MONITORED ANAESTHESIA CARE",
      description: "Includes local anaesthetics with or without intravenous sedatives.",
      risks: null,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
        {/* Hospital Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">CITY GENERAL HOSPITAL</h1>
              <p className="text-teal-100 text-sm">A Unit of Demo Medical University &mdash; Chennai</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-center text-base font-bold uppercase tracking-wide text-gray-900">
            Consent Form for Anaesthesia
          </h2>
          <p className="text-center text-xs text-gray-500 mt-1 italic">
            (The contents of this form have been explained to me in my spoken language)
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Authorization */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>I,</span>
              <input
                className={`${inlineInput} w-64`}
                placeholder="Patient Name"
                value={form.patientName}
                onChange={e => update("patientName", e.target.value)}
              />
              <span>hereby authorize the performance of the following operation(s),</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Procedures or Treatment
              </label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Name of procedure(s)"
                value={form.procedure}
                onChange={e => update("procedure", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Anaesthesia Type</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Type of anaesthesia"
                  value={form.anaesthesiaType}
                  onChange={e => update("anaesthesiaType", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name of the Patient</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Patient full name"
                  value={form.patientNameFull}
                  onChange={e => update("patientNameFull", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Patient Demographics + Auto Complications */}
          <PatientDemographicsSection
            age={form.age} gender={form.gender} comorbidities={form.comorbidities}
            customComorbidity={form.customComorbidity} procedureName={form.procedure}
            onAgeChange={v => update("age", v)} onGenderChange={v => update("gender", v)}
            onToggleComorbidity={toggleComorbidity}
            onCustomComorbidityChange={v => update("customComorbidity", v)}
            onAddCustomComorbidity={() => { if ((form.customComorbidity as string).trim()) { toggleComorbidity((form.customComorbidity as string).trim()); update("customComorbidity", ""); } }}
            onProcedureChange={v => update("procedure", v)}
            onProcedureSelect={v => update("procedure", v)}
            autoRisks={autoRisks} procedureRisks={getProcedureRisks(form.procedure)}
            onApplyAutoRisks={() => update("specificRisk", [form.specificRisk, ...autoRisks].filter(Boolean).join("; "))}
            onApplyProcedureRisks={() => update("specificRisk", [form.specificRisk, ...getProcedureRisks(form.procedure)].filter(Boolean).join("; "))}
            customComplication={form.customComplication}
            onCustomComplicationChange={v => update("customComplication", v)}
            onAddCustomComplication={() => { update("specificRisk", [form.specificRisk, (form.customComplication as string).trim()].filter(Boolean).join("; ")); update("customComplication", ""); }}
            selectedComplications={form.selectedComplications}
            onToggleComplication={toggleComplication}
            inputClass={inputClass}
          />

          {/* Consent paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              I consent to the administration of anaesthesia. I understand that all forms of anaesthesia involve additional
              risks and hazards, but I request the use of anaesthesia for the relief and protection from pain during the planned
              and additional procedure(s). I realize that anaesthesia may have to be changed, possibly without explanation to me,
              from what has been planned.
            </p>
          </div>

          {/* Anaesthesia type checkboxes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              Type of Anaesthesia
            </h3>

            {anaesthesiaTypes.map(type => (
              <label
                key={type.field}
                className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                  (form as Record<string, unknown>)[type.field]
                    ? "border-[var(--color-primary)] bg-teal-50/50 ring-1 ring-[var(--color-primary)]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={(form as Record<string, unknown>)[type.field] as boolean}
                    onChange={e => update(type.field, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                    {type.risks && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                        <p className="text-xs text-amber-800">
                          <span className="font-semibold">Complications:</span> {type.risks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}

            {/* Specific Risk */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Specific Risk (additional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                rows={3}
                placeholder="Any additional specific risks to document..."
                value={form.specificRisk}
                onChange={e => update("specificRisk", e.target.value)}
              />
            </div>
          </div>

          {/* Consent paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              I hereby consent to the anaesthetic service checked above and authorize that it be administered by
              Anaesthesiologist of all cadres who are instructed to provide anaesthetic services at this hospital.
              I understand that monitoring devices may be utilized as deemed
              necessary and I consent to their use. I have been given the opportunity to ask questions and all my
              questions have been answered to my satisfaction.
            </p>
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              Signatures
            </h3>

            {/* Patient / Guardian */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Patient / Guardian Name</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Full name"
                  value={form.sigPatientName}
                  onChange={e => update("sigPatientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigPatientDate}
                  onChange={e => update("sigPatientDate", e.target.value)}
                />
              </div>
            </div>

            {/* Parent */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Parent</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Parent name"
                  value={form.sigParentName}
                  onChange={e => update("sigParentName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigParentDate}
                  onChange={e => update("sigParentDate", e.target.value)}
                />
              </div>
            </div>

            {/* Anaesthesiologist */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Anaesthesiologist</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Anaesthesiologist name"
                  value={form.sigAnaesthesiologistName}
                  onChange={e => update("sigAnaesthesiologistName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Signature</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">Sign here</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigAnaesthesiologistDate}
                  onChange={e => update("sigAnaesthesiologistDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white border border-t-0 border-[var(--color-border)] rounded-b-lg px-8 py-5 flex items-center justify-between">
        <button className="border border-[var(--color-border)] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Save as Custom Template
        </button>
        <button className="bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
          Use This Template
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template C — Surgery Consent (Tamil)                              */
/* ------------------------------------------------------------------ */
function SurgeryConsentTamilTemplate() {
  const [form, setForm] = useState({
    patientGuardianName: "",
    procedureName: "",
    diagnosis: "",
    surgeonName: "",
    age: "",
    gender: "",
    comorbidities: [] as string[],
    customComorbidity: "",
    customComplication: "",
    risks: [
      "தொற்று நோய் [Infection]",
      "இரத்தப்போக்கு [Bleeding]",
      "நரம்பு பாதிப்பு [Nerve Damage]",
      "இரத்தக்குழாய் பாதிப்பு [Vascular Damage]",
      "மயக்க மருந்து சிக்கல்கள் [Anaesthesia Complications]",
      "செயற்கை உறுப்பு தோல்வி [Implant Failure]",
    ],
    sigPatientName: "",
    sigPatientDate: "",
    sigWitnessName: "",
    sigWitnessDate: "",
    sigSurgeonName: "",
    sigSurgeonDate: "",
    reviewPatientName: "",
    reviewDate: "",
    selectedComplications: [] as string[],
  });

  const autoRisks = getAutoComplications(form.age, form.gender, form.comorbidities);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(c: string) {
    setForm(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(c)
        ? prev.comorbidities.filter(x => x !== c)
        : [...prev.comorbidities, c],
    }));
  }

  function toggleComplication(c: string) {
    setForm(prev => ({
      ...prev,
      selectedComplications: prev.selectedComplications.includes(c)
        ? prev.selectedComplications.filter(x => x !== c)
        : [...prev.selectedComplications, c],
    }));
  }

  function applyAutoRisks() {
    setForm(prev => ({
      ...prev,
      risks: [...prev.risks, ...autoRisks],
      selectedComplications: [...new Set([...prev.selectedComplications, ...autoRisks])],
    }));
  }

  function updateRisk(index: number, value: string) {
    setForm(prev => {
      const risks = [...prev.risks];
      risks[index] = value;
      return { ...prev, risks };
    });
  }

  const inputClass = "border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors";
  const inlineInput = `${inputClass} inline-block`;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
        {/* Hospital Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">CITY GENERAL HOSPITAL</h1>
              <p className="text-teal-100 text-sm">A Unit of Demo Medical University &mdash; Chennai</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-center text-base font-bold uppercase tracking-wide text-gray-900">
            பிரிவேற்கவல் / அறுவை சிகிச்சைக்கான ஒப்புதல் படிவம்
          </h2>
          <p className="text-center text-xs text-gray-500 mt-1 italic">
            (இப்படிவத்தின் உள்ளடக்கம் எனது தாய்மொழியில் எனக்கு விளக்கப்பட்டது)
          </p>
          <p className="text-center text-xs text-red-500 font-semibold mt-1">
            (சுருக்கெழுத்துக்கள் பயன்படுத்த வேண்டாம் / USE NO ABBREVIATION)
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              இந்த ஒப்புதல் படிவம் நோயாளியால் (18 வயது அல்லது அதற்கு மேல்) அல்லது 18 வயதுக்குட்பட்ட அல்லது ஒப்புதல் அளிக்க இயலாத
              நோயாளியின் பெற்றோர் / பாதுகாவலரால் கையொப்பமிடப்பட வேண்டும்.
            </p>
          </div>

          {/* Authorization section */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>நான்</span>
              <input
                className={`${inlineInput} w-64`}
                placeholder="நோயாளி / பாதுகாவலர் பெயர்"
                value={form.patientGuardianName}
                onChange={e => update("patientGuardianName", e.target.value)}
              />
            </p>

            <p>
              கீழ்க்கண்ட அறுவை சிகிச்சை / செயல்முறையை மேற்கொள்ள இதன் மூலம் அங்கீகரிக்கிறேன்:
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">அறுவை சிகிச்சை / செயல்முறை (Procedure)</label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Procedure name"
                value={form.procedureName}
                onChange={e => update("procedureName", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">நோயறிதல் (Diagnosis)</label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Diagnosis"
                value={form.diagnosis}
                onChange={e => update("diagnosis", e.target.value)}
              />
            </div>
          </div>

          {/* Patient Demographics + Auto Complications */}
          <PatientDemographicsSection
            age={form.age} gender={form.gender} comorbidities={form.comorbidities}
            customComorbidity={form.customComorbidity} procedureName={form.procedureName || ""}
            onAgeChange={v => update("age", v)} onGenderChange={v => update("gender", v)}
            onToggleComorbidity={toggleComorbidity}
            onCustomComorbidityChange={v => update("customComorbidity", v)}
            onAddCustomComorbidity={() => { if (form.customComorbidity.trim()) { toggleComorbidity(form.customComorbidity.trim()); update("customComorbidity", ""); } }}
            onProcedureChange={v => update("procedureName", v)}
            onProcedureSelect={v => update("procedureName", v)}
            autoRisks={autoRisks} procedureRisks={getProcedureRisks(form.procedureName || "")}
            onApplyAutoRisks={applyAutoRisks}
            onApplyProcedureRisks={() => setForm(prev => ({ ...prev, risks: [...prev.risks, ...getProcedureRisks(prev.procedureName || "")] }))}
            customComplication={form.customComplication}
            onCustomComplicationChange={v => update("customComplication", v)}
            onAddCustomComplication={() => { if (form.customComplication.trim()) { setForm(prev => ({ ...prev, risks: [...prev.risks, prev.customComplication.trim()], customComplication: "" })); } }}
            selectedComplications={form.selectedComplications}
            onToggleComplication={toggleComplication}
            inputClass={inputClass} tamilLabels
          />

          {/* Information paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              மருத்துவ அவதானிப்புகள் மற்றும் நோயறிதல் பரிசோதனைகளின் அடிப்படையில் இந்த செயல்முறையின் நன்மைகள் மற்றும்
              காரணங்கள் பற்றி எனக்கு தெரிவிக்கப்பட்டுள்ளது. மருத்துவம் ஒரு அறிவியல் மட்டுமல்ல, ஒரு கலையும் கூட என்பதை
              நான் அறிவேன், எனவே வெற்றி அல்லது விளைவு குறித்து எந்த உத்தரவாதமும் அளிக்கப்படவில்லை என்பதை ஒப்புக்கொள்கிறேன்.
            </p>
          </div>

          {/* Complications section */}
          <div className="space-y-3">
            <p className="text-sm text-gray-800 font-medium">
              செயல்முறை, நன்மை மற்றும் ஆபத்து மற்றும்/அல்லது சாத்தியமான சிக்கல்கள் கீழே குறிப்பிடப்பட்டுள்ளவாறு எனக்கு விளக்கப்பட்டது:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {form.risks.map((risk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 w-5">{i + 1}.</span>
                  <input
                    className={`${inputClass} flex-1`}
                    value={risk}
                    onChange={e => updateRisk(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              இந்த செயல்முறை / அறுவை சிகிச்சைக்கு மாற்று வழிகள் மற்றும் அவற்றின் நன்மைகள் மற்றும் தீமைகள் பற்றியும்
              எனக்கு தெரிவிக்கப்பட்டுள்ளது.
            </p>
          </div>

          {/* Surgeon authorization */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>நான் Dr.</span>
              <input
                className={`${inlineInput} w-56`}
                placeholder="அறுவை சிகிச்சை நிபுணர் பெயர் (Surgeon Name)"
                value={form.surgeonName}
                onChange={e => update("surgeonName", e.target.value)}
              />
              <span>மற்றும் அவரது உதவியாளர்களை மேற்கண்ட செயல்முறையை மேற்கொள்ள அங்கீகரிக்கிறேன்.</span>
            </p>
          </div>

          {/* Bold warning paragraph */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-xs text-gray-800 leading-relaxed font-semibold">
              எந்தவொரு செயல்முறையிலும் இரத்த அழுத்த மாற்றங்கள், மயக்க மருந்து ஒவ்வாமை எதிர்வினைகள்,
              இரத்தப்போக்கு, தொற்று, இதய செயலிழப்பு, இதய நிறுத்தம் மற்றும் மரணம் உட்பட, பக்கவாதம்,
              தீவிர சிகிச்சை பிரிவு (ICU) பராமரிப்பு ஆகிய ஆபத்துகள் ஏற்படலாம் என்பதை நான் அறிவேன்.
              நான் அல்லது எனது குடும்பம் மருத்துவமனை அல்லது அதன் மருத்துவர்களை மேற்கண்ட செயல்முறையின்
              விளைவுகளுக்கு பொறுப்பாக்க மாட்டோம்.
            </p>
          </div>

          {/* Acknowledgment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              இந்த செயல்முறை, அதன் ஆபத்துகள், நன்மைகள், மாற்று வழிகள் மற்றும் செயல்முறை செய்யாததன் விளைவுகள்
              பற்றி விவாதிக்கவும் புரிந்துகொள்ளவும் எனக்கு வாய்ப்பு அளிக்கப்பட்டது. எனது அனைத்து கேள்விகளுக்கும்
              திருப்திகரமாக பதிலளிக்கப்பட்டது.
            </p>
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              கையொப்பங்கள்
            </h3>

            {/* Patient / Guardian */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">நோயாளி / பாதுகாவலர் பெயர்</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Full name"
                  value={form.sigPatientName}
                  onChange={e => update("sigPatientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigPatientDate}
                  onChange={e => update("sigPatientDate", e.target.value)}
                />
              </div>
            </div>

            {/* Witness */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">சாட்சி</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Witness name"
                  value={form.sigWitnessName}
                  onChange={e => update("sigWitnessName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigWitnessDate}
                  onChange={e => update("sigWitnessDate", e.target.value)}
                />
              </div>
            </div>

            {/* Surgeon */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">அறுவை சிகிச்சை நிபுணர்</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Surgeon name"
                  value={form.sigSurgeonName}
                  onChange={e => update("sigSurgeonName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigSurgeonDate}
                  onChange={e => update("sigSurgeonDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Review of Consent in Case of Postponement */}
          <div className="border-t-2 border-gray-300 pt-5 mt-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              ஒத்திவைக்கப்பட்டால் ஒப்புதல் மறுஆய்வு
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">நோயாளி / பாதுகாவலர் பெயர்</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Full name"
                  value={form.reviewPatientName}
                  onChange={e => update("reviewPatientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.reviewDate}
                  onChange={e => update("reviewDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white border border-t-0 border-[var(--color-border)] rounded-b-lg px-8 py-5 flex items-center justify-between">
        <button className="border border-[var(--color-border)] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Save as Custom Template
        </button>
        <button className="bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
          Use This Template
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template D — Anaesthesia Consent (Tamil)                          */
/* ------------------------------------------------------------------ */
function AnaesthesiaConsentTamilTemplate() {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    comorbidities: [] as string[],
    customComorbidity: "",
    customComplication: "",
    procedure: "",
    anaesthesiaType: "",
    patientNameFull: "",
    generalAnaesthesia: false,
    spinalEpidural: false,
    nerveBlocks: false,
    monitoredCare: false,
    specificRisk: "",
    sigPatientName: "",
    sigPatientDate: "",
    sigParentName: "",
    sigParentDate: "",
    sigAnaesthesiologistName: "",
    sigAnaesthesiologistDate: "",
    selectedComplications: [] as string[],
  });

  const autoRisks = getAutoComplications(form.age, form.gender, form.comorbidities);

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(c: string) {
    setForm(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(c)
        ? prev.comorbidities.filter(x => x !== c)
        : [...prev.comorbidities, c],
    }));
  }

  function toggleComplication(c: string) {
    setForm(prev => ({
      ...prev,
      selectedComplications: prev.selectedComplications.includes(c)
        ? prev.selectedComplications.filter(x => x !== c)
        : [...prev.selectedComplications, c],
    }));
  }

  const inputClass = "border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors";
  const inlineInput = `${inputClass} inline-block`;

  const anaesthesiaTypes = [
    {
      field: "generalAnaesthesia",
      label: "பொது மயக்க மருந்து (General Anaesthesia)",
      description: "வாய் வழியாக குழாய் மூலம் மருந்துகள் மற்றும் வாயுக்கள் செலுத்துதல்",
      risks: "குமட்டல், வாந்தி, தொண்டை வலி, பல் சேதம், உணர்வின்மை",
    },
    {
      field: "spinalEpidural",
      label: "முதுகெலும்பு / எபிடூரல் மயக்கம் (Spinal/Epidural)",
      description: "முதுகெலும்பு குழாய் அல்லது எபிடூரல் இடத்தில் ஊசி செலுத்துதல்",
      risks: "முதுகுவலி, தலைவலி, வலிப்பு, தொற்று, உணர்வின்மை, பக்கவாதம்",
    },
    {
      field: "nerveBlocks",
      label: "நரம்பு தடுப்பு (Nerve Blocks)",
      description: "முக்கிய நரம்புகளுக்கு அருகில் ஊசி செலுத்துதல்",
      risks: "தலைவலி, முதுகுவலி, வலிப்பு, தொற்று, நிரந்தர உணர்வின்மை",
    },
    {
      field: "monitoredCare",
      label: "கண்காணிப்பு மயக்க பராமரிப்பு (Monitored Care)",
      description: "உள்ளூர் மயக்க மருந்துகளுடன் நரம்பு வழி மயக்க மருந்துகள்",
      risks: null,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
        {/* Hospital Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">CITY GENERAL HOSPITAL</h1>
              <p className="text-teal-100 text-sm">A Unit of Demo Medical University &mdash; Chennai</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-center text-base font-bold uppercase tracking-wide text-gray-900">
            மயக்க மருந்து செலுத்துவதற்கான ஒப்புதல் படிவம்
          </h2>
          <p className="text-center text-xs text-gray-500 mt-1 italic">
            (இப்படிவத்தின் உள்ளடக்கம் எனது தாய்மொழியில் எனக்கு விளக்கப்பட்டது)
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Authorization */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>நான்</span>
              <input
                className={`${inlineInput} w-64`}
                placeholder="நோயாளி பெயர் (Patient Name)"
                value={form.patientName}
                onChange={e => update("patientName", e.target.value)}
              />
              <span>கீழ்க்கண்ட அறுவை சிகிச்சையை மேற்கொள்ள இதன் மூலம் அங்கீகரிக்கிறேன்,</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                செயல்முறை / சிகிச்சை (Procedure)
              </label>
              <input
                className={`${inputClass} w-full`}
                placeholder="Name of procedure(s)"
                value={form.procedure}
                onChange={e => update("procedure", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">மயக்க மருந்து வகை (Anaesthesia Type)</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Type of anaesthesia"
                  value={form.anaesthesiaType}
                  onChange={e => update("anaesthesiaType", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">நோயாளி பெயர் (Patient Name)</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Patient full name"
                  value={form.patientNameFull}
                  onChange={e => update("patientNameFull", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Patient Demographics + Auto Complications */}
          <PatientDemographicsSection
            age={form.age} gender={form.gender} comorbidities={form.comorbidities}
            customComorbidity={form.customComorbidity} procedureName={form.procedure}
            onAgeChange={v => update("age", v)} onGenderChange={v => update("gender", v)}
            onToggleComorbidity={toggleComorbidity}
            onCustomComorbidityChange={v => update("customComorbidity", v)}
            onAddCustomComorbidity={() => { if ((form.customComorbidity as string).trim()) { toggleComorbidity((form.customComorbidity as string).trim()); update("customComorbidity", ""); } }}
            onProcedureChange={v => update("procedure", v)}
            onProcedureSelect={v => update("procedure", v)}
            autoRisks={autoRisks} procedureRisks={getProcedureRisks(form.procedure)}
            onApplyAutoRisks={() => update("specificRisk", [form.specificRisk, ...autoRisks].filter(Boolean).join("; "))}
            onApplyProcedureRisks={() => update("specificRisk", [form.specificRisk, ...getProcedureRisks(form.procedure)].filter(Boolean).join("; "))}
            customComplication={form.customComplication}
            onCustomComplicationChange={v => update("customComplication", v)}
            onAddCustomComplication={() => { update("specificRisk", [form.specificRisk, (form.customComplication as string).trim()].filter(Boolean).join("; ")); update("customComplication", ""); }}
            selectedComplications={form.selectedComplications}
            onToggleComplication={toggleComplication}
            inputClass={inputClass} tamilLabels
          />

          {/* Consent paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              மயக்க மருந்து செலுத்துவதற்கு நான் ஒப்புதல் அளிக்கிறேன். அனைத்து வகையான மயக்க மருந்துகளும்
              கூடுதல் ஆபத்துகள் மற்றும் அபாயங்களை உள்ளடக்கியது என்பதை நான் புரிந்துகொள்கிறேன். திட்டமிடப்பட்ட
              செயல்முறையின் போது வலியிலிருந்து நிவாரணம் மற்றும் பாதுகாப்புக்காக மயக்க மருந்தைப் பயன்படுத்துமாறு
              கோருகிறேன்.
            </p>
          </div>

          {/* Anaesthesia type checkboxes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              மயக்க மருந்து வகை
            </h3>

            {anaesthesiaTypes.map(type => (
              <label
                key={type.field}
                className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                  (form as Record<string, unknown>)[type.field]
                    ? "border-[var(--color-primary)] bg-teal-50/50 ring-1 ring-[var(--color-primary)]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={(form as Record<string, unknown>)[type.field] as boolean}
                    onChange={e => update(type.field, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                    {type.risks && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                        <p className="text-xs text-amber-800">
                          <span className="font-semibold">சிக்கல்கள்:</span> {type.risks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}

            {/* Specific Risk */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                குறிப்பிட்ட ஆபத்து (Specific Risk)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                rows={3}
                placeholder="கூடுதல் குறிப்பிட்ட ஆபத்துகள்... (Any additional specific risks)"
                value={form.specificRisk}
                onChange={e => update("specificRisk", e.target.value)}
              />
            </div>
          </div>

          {/* Consent paragraph */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              மேலே குறிப்பிடப்பட்ட மயக்க மருந்து சேவைக்கு நான் ஒப்புதல் அளிக்கிறேன், மேலும் இது
              இந்த மருத்துவமனையில் (this hospital)
              மயக்க மருந்து சேவைகளை வழங்க அறிவுறுத்தப்பட்ட அனைத்து நிலை மயக்க மருந்து நிபுணர்களால்
              (Anaesthesiologist of all cadres) செலுத்தப்படலாம் என்பதை அங்கீகரிக்கிறேன்.
              கண்காணிப்பு சாதனங்கள் தேவையெனில் பயன்படுத்தப்படலாம் என்பதை நான் புரிந்துகொள்கிறேன்.
              எனது அனைத்து கேள்விகளுக்கும் திருப்திகரமாக பதிலளிக்கப்பட்டது.
            </p>
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
              கையொப்பங்கள்
            </h3>

            {/* Patient / Guardian */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">நோயாளி / பாதுகாவலர்</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Full name"
                  value={form.sigPatientName}
                  onChange={e => update("sigPatientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigPatientDate}
                  onChange={e => update("sigPatientDate", e.target.value)}
                />
              </div>
            </div>

            {/* Parent */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">பெற்றோர்</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Parent name"
                  value={form.sigParentName}
                  onChange={e => update("sigParentName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigParentDate}
                  onChange={e => update("sigParentDate", e.target.value)}
                />
              </div>
            </div>

            {/* Anaesthesiologist */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">மயக்க மருந்து நிபுணர்</label>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="Anaesthesiologist name"
                  value={form.sigAnaesthesiologistName}
                  onChange={e => update("sigAnaesthesiologistName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">கையொப்பம்</label>
                <div className="border-b border-gray-400 h-8 flex items-end">
                  <span className="text-xs text-gray-300 italic">இங்கே கையொப்பமிடுக</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">தேதி</label>
                <input
                  type="date"
                  className={`${inputClass} w-full`}
                  value={form.sigAnaesthesiologistDate}
                  onChange={e => update("sigAnaesthesiologistDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white border border-t-0 border-[var(--color-border)] rounded-b-lg px-8 py-5 flex items-center justify-between">
        <button className="border border-[var(--color-border)] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Save as Custom Template
        </button>
        <button className="bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
          Use This Template
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template E — Consent for Blood Transfusion (English)              */
/* ------------------------------------------------------------------ */
function BloodTransfusionConsentTemplate() {
  const [form, setForm] = useState({
    relativeOf: "",
    hospitalNo: "",
    doctorName: "",
    patientName: "",
    age: "",
    gender: "",
    comorbidities: [] as string[],
    customComorbidity: "",
    customComplication: "",
    relativeName: "",
    patientSignDate: "",
    relativeSignDate: "",
    emergencyDoctorName: "",
    emergencyDoctorDate: "",
    emergencyDoctorTime: "",
    selectedComplications: [] as string[],
  });

  const autoRisks = getAutoComplications(form.age, form.gender, form.comorbidities);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(c: string) {
    setForm(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(c)
        ? prev.comorbidities.filter(x => x !== c)
        : [...prev.comorbidities, c],
    }));
  }

  function toggleComplication(c: string) {
    setForm(prev => ({
      ...prev,
      selectedComplications: prev.selectedComplications.includes(c)
        ? prev.selectedComplications.filter(x => x !== c)
        : [...prev.selectedComplications, c],
    }));
  }

  const inputClass = "border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors";
  const inlineInput = `${inputClass} inline-block`;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">CITY GENERAL HOSPITAL</h1>
              <p className="text-teal-100 text-sm">A Unit of Demo Medical University &mdash; Chennai</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-center text-base font-bold uppercase tracking-wide text-gray-900">
            Consent for Blood Transfusion
          </h2>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Main consent paragraph */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>I / relative of</span>
              <input className={`${inlineInput} w-48`} placeholder="Patient / Relative Name" value={form.relativeOf} onChange={e => update("relativeOf", e.target.value)} />
              <span>Hospital No.</span>
              <input className={`${inlineInput} w-32`} placeholder="Hospital No." value={form.hospitalNo} onChange={e => update("hospitalNo", e.target.value)} />
              <span>have been</span>
            </p>

            <p className="flex flex-wrap items-baseline gap-1">
              <span>advised by my doctor Dr.</span>
              <input className={`${inlineInput} w-64`} placeholder="Doctor Name" value={form.doctorName} onChange={e => update("doctorName", e.target.value)} />
              <span>that due to my / the patient&apos;s</span>
            </p>

            <p>
              medical condition, I / the patient might require a transfusion of either whole blood, packed red cells,
              plasma, platelets or cryoprecipitate. The doctor has explained both the risks and the benefits of
              transfusion in the language I understand.
            </p>
          </div>

          {/* Patient Demographics + Auto Complications */}
          <PatientDemographicsSection
            age={form.age} gender={form.gender} comorbidities={form.comorbidities}
            customComorbidity={form.customComorbidity} procedureName="Blood Transfusion"
            onAgeChange={v => update("age", v)} onGenderChange={v => update("gender", v)}
            onToggleComorbidity={toggleComorbidity}
            onCustomComorbidityChange={v => update("customComorbidity", v)}
            onAddCustomComorbidity={() => { if (form.customComorbidity.trim()) { toggleComorbidity(form.customComorbidity.trim()); update("customComorbidity", ""); } }}
            onProcedureChange={() => {}} onProcedureSelect={() => {}}
            autoRisks={autoRisks} procedureRisks={[]}
            onApplyAutoRisks={() => {}} onApplyProcedureRisks={() => {}}
            customComplication={form.customComplication}
            onCustomComplicationChange={v => update("customComplication", v)}
            onAddCustomComplication={() => {}}
            selectedComplications={form.selectedComplications}
            onToggleComplication={toggleComplication}
            inputClass={inputClass}
          />

          {/* Complications acknowledgment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm leading-relaxed text-gray-800">
              I understand that despite preparation and testing as per current standards, there is small chance that
              a reaction can occur. Some of these, very rarely can be fatal, while other times it may be a mild allergic
              reaction and the transfusion may have to be stopped. I also understand that despite testing there is a
              very small chance of transmission of viral infections such as HIV and Hepatitis B and C and other
              infections such as malaria.
            </p>
          </div>

          {/* Consent statement */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p>
              I have had an opportunity to ask questions and with my signature, I give consent to administering
              blood products for myself / my patient.
            </p>
          </div>

          {/* Patient & Relative signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Patient Name</label>
                <input className={`${inputClass} w-full`} placeholder="Patient full name" value={form.patientName} onChange={e => update("patientName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Signature</label>
                <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">Patient signature area</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date (DD/MM/YY)</label>
                <input className={`${inputClass} w-full`} placeholder="DD/MM/YY" value={form.patientSignDate} onChange={e => update("patientSignDate", e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Relative Name</label>
                <input className={`${inputClass} w-full`} placeholder="Relative full name" value={form.relativeName} onChange={e => update("relativeName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Signature</label>
                <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">Relative signature area</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date (DD/MM/YY)</label>
                <input className={`${inputClass} w-full`} placeholder="DD/MM/YY" value={form.relativeSignDate} onChange={e => update("relativeSignDate", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Emergency / Life-threatening section */}
          <div className="border-t border-gray-300 pt-6 mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm leading-relaxed text-gray-800">
                Because of a life threatening medical condition, I have not provided enough information and not taken
                informed consent. I have proceeded with ordering blood products to be administered to improve /
                reverse a life threatening medical condition.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name of the Doctor</label>
                <input className={`${inputClass} w-full`} placeholder="Doctor name" value={form.emergencyDoctorName} onChange={e => update("emergencyDoctorName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Signature</label>
                <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">Doctor signature area</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
                  <input className={`${inputClass} w-full`} placeholder="DD/MM/YY" value={form.emergencyDoctorDate} onChange={e => update("emergencyDoctorDate", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Time</label>
                  <input className={`${inputClass} w-full`} placeholder="HH:MM" value={form.emergencyDoctorTime} onChange={e => update("emergencyDoctorTime", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 border border-[var(--color-border)] text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Save as Custom Template
        </button>
        <Link href="/forms/new" className="flex-1 bg-[var(--color-primary)] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-center">
          Use This Template
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template F — Consent for Blood Transfusion (Tamil)                */
/* ------------------------------------------------------------------ */
function BloodTransfusionConsentTamilTemplate() {
  const [form, setForm] = useState({
    relativeOf: "",
    hospitalNo: "",
    doctorName: "",
    patientName: "",
    age: "",
    gender: "",
    comorbidities: [] as string[],
    customComorbidity: "",
    customComplication: "",
    relativeName: "",
    patientSignDate: "",
    relativeSignDate: "",
    emergencyDoctorName: "",
    emergencyDoctorDate: "",
    emergencyDoctorTime: "",
    selectedComplications: [] as string[],
  });

  const autoRisks = getAutoComplications(form.age, form.gender, form.comorbidities);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleComorbidity(c: string) {
    setForm(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(c)
        ? prev.comorbidities.filter(x => x !== c)
        : [...prev.comorbidities, c],
    }));
  }

  function toggleComplication(c: string) {
    setForm(prev => ({
      ...prev,
      selectedComplications: prev.selectedComplications.includes(c)
        ? prev.selectedComplications.filter(x => x !== c)
        : [...prev.selectedComplications, c],
    }));
  }

  const inputClass = "border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors";
  const inlineInput = `${inputClass} inline-block`;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">CITY GENERAL HOSPITAL</h1>
              <p className="text-teal-100 text-sm">A Unit of Demo Medical University &mdash; Chennai</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="text-center text-base font-bold uppercase tracking-wide text-gray-900">
            இரத்த செலுத்துதல் ஒப்புதல் படிவம்
          </h2>
          <p className="text-center text-xs text-gray-500 mt-1 italic">
            (Consent for Blood Transfusion)
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Main consent paragraph */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p className="flex flex-wrap items-baseline gap-1">
              <span>கீழ் குறிப்பிட்டுள்ள</span>
              <input className={`${inlineInput} w-48`} placeholder="நோயாளியின் பெயர்" value={form.relativeOf} onChange={e => update("relativeOf", e.target.value)} />
              <span>சிகிச்சையகம் எண்</span>
              <input className={`${inlineInput} w-32`} placeholder="எண்" value={form.hospitalNo} onChange={e => update("hospitalNo", e.target.value)} />
              <span>வீ</span>
            </p>

            <p className="flex flex-wrap items-baseline gap-1">
              <span>சிகிச்சையகத்தின் மருத்துவர் மற்றும் மருத்துவமனையின் மருத்துவர் டாக்டர்.</span>
              <input className={`${inlineInput} w-64`} placeholder="மருத்துவர் பெயர்" value={form.doctorName} onChange={e => update("doctorName", e.target.value)} />
              <span>வீ</span>
            </p>

            <p>
              நோயாளியின் குறிப்பான முறையில் இரத்தம் அளிக்க இயலுமே என்றும் / நோயாளிக்கு முழு இரத்தம் /
              கட்டிய / செவ்வமேன் / கிரியோபிரசிபிடேட் / D.I.C / சுத்தி வரி பிசின் செல்லை எவற்றின் எவர்களிடமும்
              இரத்தம் அளிக்கும் தேவை ஏற்படக்கூடும் என்றும் மருத்துவர் என்னிடம் விளக்கியுள்ளார்.
            </p>
          </div>

          {/* Patient Demographics + Auto Complications */}
          <PatientDemographicsSection
            age={form.age} gender={form.gender} comorbidities={form.comorbidities}
            customComorbidity={form.customComorbidity} procedureName="Blood Transfusion"
            onAgeChange={v => update("age", v)} onGenderChange={v => update("gender", v)}
            onToggleComorbidity={toggleComorbidity}
            onCustomComorbidityChange={v => update("customComorbidity", v)}
            onAddCustomComorbidity={() => { if (form.customComorbidity.trim()) { toggleComorbidity(form.customComorbidity.trim()); update("customComorbidity", ""); } }}
            onProcedureChange={() => {}} onProcedureSelect={() => {}}
            autoRisks={autoRisks} procedureRisks={[]}
            onApplyAutoRisks={() => {}} onApplyProcedureRisks={() => {}}
            customComplication={form.customComplication}
            onCustomComplicationChange={v => update("customComplication", v)}
            onAddCustomComplication={() => {}}
            selectedComplications={form.selectedComplications}
            onToggleComplication={toggleComplication}
            inputClass={inputClass} tamilLabels
          />

          {/* Complications acknowledgment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm leading-relaxed text-gray-800">
              தற்போது நடைமுறை பரிசோதனைகள் மற்றும் ஏற்பாடுகளின் பின் கூடுமானவரை ஒரு சிறிய நிகழ்தகவு
              இருப்பதும் என்று புரிந்து கொள்கிறேன். இவற்றால் மிக அரிதாக உயிர்ச்சேதமான எதிர்விளைவுகள்
              ஏற்படலாம் அல்லது எதிர்வினையால் சிற்றுணர்ச்சி ஏற்படலாம், மேலும் இரத்த செலுத்துதலை நிறுத்த
              வேண்டியிருக்கலாம். மேலும் மற்ற சோதனைகள் இருப்பினும் HIV / Malaria / Hepatitis
              B மற்றும் C போன்ற தொற்றுநோய்கள் ஏற்படும் நிகழ்தகவு உள்ளது என்றும் அறிந்து கொள்கிறேன்.
            </p>
          </div>

          {/* Consent statement */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p>
              எனது மருத்துவரிடம் இரத்த செலுத்துதல் மற்றும் சாரி அறிவுக்கிடைமே போதுமான கேள்விகளைக்
              கேட்டிருக்கிறேன். நோய்க்கு இரத்தம் செலுத்த முழு முன்னணி ஒப்புதல் அளிக்கிறேன்.
            </p>
          </div>

          {/* Patient & Relative signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">நோயாளியின் பெயர்</label>
                <input className={`${inputClass} w-full`} placeholder="நோயாளியின் முழு பெயர்" value={form.patientName} onChange={e => update("patientName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">கையொப்பம்</label>
                <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">கையொப்பம்</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">தேதி</label>
                <input className={`${inputClass} w-full`} placeholder="நாள்/மாதம்/ஆண்டு" value={form.patientSignDate} onChange={e => update("patientSignDate", e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">உறவினர் பெயர்</label>
                <input className={`${inputClass} w-full`} placeholder="உறவினர் முழு பெயர்" value={form.relativeName} onChange={e => update("relativeName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">கையொப்பம்</label>
                <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">கையொப்பம்</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">தேதி</label>
                <input className={`${inputClass} w-full`} placeholder="நாள்/மாதம்/ஆண்டு" value={form.relativeSignDate} onChange={e => update("relativeSignDate", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Emergency / Life-threatening section */}
          <div className="border-t border-gray-300 pt-6 mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm leading-relaxed text-gray-800">
                நோயாளியின் ஆபத்தான உடல் நிலையை கொண்டு என்னால் உரிய தகவல் நேரத்தில் போதிய
                ஒப்புதல் பெறும் நிலையில் இல்லை. எனவே நான் உயிரச் காப்பாற்ற / உடல் நிலையை மேம்படுத்த
                இரத்தம் / இரத்தப் பொருட்கள் செலுத்த பெற ஏற்பாடுகள் மேற்கொண்டுள்ளேன்.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">மருத்துவர் பெயர்</label>
                <input className={`${inputClass} w-full`} placeholder="மருத்துவர் பெயர்" value={form.emergencyDoctorName} onChange={e => update("emergencyDoctorName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">கையொப்பம்</label>
                <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">மருத்துவர் கையொப்பம்</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">தேதி</label>
                  <input className={`${inputClass} w-full`} placeholder="நாள்/மாதம்/ஆண்டு" value={form.emergencyDoctorDate} onChange={e => update("emergencyDoctorDate", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">நேரம்</label>
                  <input className={`${inputClass} w-full`} placeholder="மணி:நிமிடம்" value={form.emergencyDoctorTime} onChange={e => update("emergencyDoctorTime", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 border border-[var(--color-border)] text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Save as Custom Template
        </button>
        <Link href="/forms/new" className="flex-1 bg-[var(--color-primary)] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-center">
          Use This Template
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder for other templates                                   */
/* ------------------------------------------------------------------ */
function ComingSoon({ id }: { id: string }) {
  const nameMap: Record<string, string> = {
    "surgery-consent-tamil": "அறுவை சிகிச்சைக்கான ஒப்புதல் படிவம் (Surgical Consent - Tamil)",
    "anaesthesia-consent-tamil": "மயக்க மருந்து ஒப்புதல் (Anaesthesia Consent - Tamil)",
    "anaesthesia-care-plan": "Anaesthesia Care Plan",
    "pre-op-checklist": "Pre-Operative Checklist (Ward)",
    "nurses-consent-record": "Nurses Consent Record",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          {nameMap[id] || "Template"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Template preview coming soon. This form is being digitized from the hospital records.
        </p>
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          &larr; Back to Templates
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                               */
/* ------------------------------------------------------------------ */
export default function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 bg-[var(--color-card)]">
        {/* Breadcrumb */}
        <div className="px-8 py-4 border-b border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/dashboard" className="hover:text-[var(--color-primary)]">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/templates" className="hover:text-[var(--color-primary)]">Templates</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--color-text)]">
              {id === "surgery-consent" && "Surgery Consent"}
              {id === "anaesthesia-consent" && "Anaesthesia Consent"}
              {id === "surgery-consent-tamil" && "அறுவை சிகிச்சை ஒப்புதல் (Tamil)"}
              {id === "anaesthesia-consent-tamil" && "மயக்க மருந்து ஒப்புதல் (Tamil)"}
              {id === "blood-transfusion-consent" && "Blood Transfusion Consent"}
              {id === "blood-transfusion-consent-tamil" && "இரத்த செலுத்துதல் ஒப்புதல் (Tamil)"}
              {!["surgery-consent", "anaesthesia-consent", "surgery-consent-tamil", "anaesthesia-consent-tamil", "blood-transfusion-consent", "blood-transfusion-consent-tamil"].includes(id) && "Preview"}
            </span>
          </div>
        </div>

        {id === "surgery-consent" && <SurgeryConsentTemplate />}
        {id === "anaesthesia-consent" && <AnaesthesiaConsentTemplate />}
        {id === "surgery-consent-tamil" && <SurgeryConsentTamilTemplate />}
        {id === "anaesthesia-consent-tamil" && <AnaesthesiaConsentTamilTemplate />}
        {id === "blood-transfusion-consent" && <BloodTransfusionConsentTemplate />}
        {id === "blood-transfusion-consent-tamil" && <BloodTransfusionConsentTamilTemplate />}
        {!["surgery-consent", "anaesthesia-consent", "surgery-consent-tamil", "anaesthesia-consent-tamil", "blood-transfusion-consent", "blood-transfusion-consent-tamil"].includes(id) && <ComingSoon id={id} />}
      </main>
    </div>
  );
}
