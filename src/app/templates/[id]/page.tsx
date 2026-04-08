"use client";
import { Sidebar } from "@/components/Sidebar";
import { use, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Template A — Consent for Procedure / Surgery, High Risk Consent   */
/* ------------------------------------------------------------------ */
function SurgeryConsentTemplate() {
  const [form, setForm] = useState({
    patientGuardianName: "",
    procedureName: "",
    indication: "",
    patientName: "",
    unableReason: "",
    guardianName: "",
    relationship: "",
    risks: ["Infection", "Bleeding / Haematoma", "Graft Failure", "Nerve Damage", "Vascular Damage", "Joint Stiffness"],
    surgeonName: "",
    // Signature section
    sigPatientName: "",
    sigPatientDate: "",
    sigWitnessName: "",
    sigWitnessDate: "",
    sigSurgeonName: "",
    sigSurgeonDate: "",
    // Postponement review
    reviewPatientName: "",
    reviewDate: "",
  });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
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
              <h1 className="text-lg font-bold tracking-wide">MAHATMA GANDHI MEDICAL COLLEGE &amp; RESEARCH INSTITUTE</h1>
              <p className="text-teal-100 text-sm">Sri Balaji Vidyapeeth (Deemed to be University) &mdash; Pondicherry</p>
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

          {/* Risk section */}
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
              etc. may arise necessitating attention. I also state that my or my family shall not hold MGMCRI or its doctors
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
    procedure: "",
    anaesthesiaType: "",
    patientNameFull: "",
    // Checkboxes for anaesthesia types
    generalAnaesthesia: false,
    spinalEpidural: false,
    nerveBlocks: false,
    monitoredCare: false,
    specificRisk: "",
    // Signatures
    sigPatientName: "",
    sigPatientDate: "",
    sigParentName: "",
    sigParentDate: "",
    sigAnaesthesiologistName: "",
    sigAnaesthesiologistDate: "",
  });

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
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
              <h1 className="text-lg font-bold tracking-wide">MAHATMA GANDHI MEDICAL COLLEGE &amp; RESEARCH INSTITUTE</h1>
              <p className="text-teal-100 text-sm">Sri Balaji Vidyapeeth (Deemed to be University) &mdash; Pondicherry</p>
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
                          <span className="font-semibold">Risks:</span> {type.risks}
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
              Anaesthesiologist of all cadres who are instructed to provide anaesthetic services at Mahatma Gandhi
              Medical College &amp; Research Institute. I understand that monitoring devices may be utilized as deemed
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
          Template preview coming soon. This form is being digitized from the MGMCRI hospital records.
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
      <main className="flex-1 overflow-auto bg-[var(--color-card)]">
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
              {id !== "surgery-consent" && id !== "anaesthesia-consent" && "Preview"}
            </span>
          </div>
        </div>

        {id === "surgery-consent" && <SurgeryConsentTemplate />}
        {id === "anaesthesia-consent" && <AnaesthesiaConsentTemplate />}
        {id !== "surgery-consent" && id !== "anaesthesia-consent" && <ComingSoon id={id} />}
      </main>
    </div>
  );
}
