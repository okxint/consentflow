"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Upload, Video, Circle, Play, RotateCcw } from "lucide-react";
import { SignaturePad } from "@/components/SignaturePad";
import { useToast } from "@/components/Toast";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";

export default function NewForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [videoState, setVideoState] = useState<"idle" | "recording" | "recorded">("idle");
  const [videoTimer, setVideoTimer] = useState(0);
  const videoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const stopTimer = useCallback(() => {
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  function startRecording() {
    setVideoState("recording");
    setVideoTimer(0);
    videoIntervalRef.current = setInterval(() => {
      setVideoTimer(prev => prev + 1);
    }, 1000);
  }

  function stopRecording() {
    stopTimer();
    setVideoState("recorded");
  }

  function reRecord() {
    setVideoState("idle");
    setVideoTimer(0);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const [form, setForm] = useState({
    patientName: "", patientId: "", dob: "", gender: "", phone: "", emergencyName: "", emergencyPhone: "", bloodGroup: "",
    patientLanguage: "English",
    operation: "", scheduledDate: "", surgeon: "Dr. Priya Sharma", anesthesia: "", duration: "", operatingRoom: "",
    diagnosis: "", procedureDescription: "", benefits: "", risks: "", alternatives: "", consequences: "",
    includeAnesthesia: true, includeBloodTransfusion: false, allowPhotography: false, includePostOp: true, verballyCounseled: false,
    doctorSignatureMode: "saved" as "saved" | "draw" | "upload",
    anesthesiologistName: "Dr. ",
    anesthesiaRisks: "Nausea, vomiting, sore throat, dental damage, allergic reaction, aspiration, awareness during anesthesia, nerve damage",
    asaClassification: "",
    npoConfirmed: false,
  });

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.patientName.trim()) errs.patientName = "Patient name is required";
    if (!form.phone.trim()) errs.phone = "Contact number is required";
    if (!form.operation.trim()) errs.operation = "Procedure name is required";
    if (!form.diagnosis.trim()) errs.diagnosis = "Diagnosis is required";
    if (!form.risks.trim()) errs.risks = "Risks must be listed";
    if (!form.anesthesia.trim()) errs.anesthesia = "Anesthesia type is required";
    if (!form.scheduledDate.trim()) errs.scheduledDate = "Scheduled date is required";
    return errs;
  }

  function handleSubmit(draft: boolean) {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast({ type: "error", message: "Please fill all required fields" });
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ type: "success", message: draft ? "Saved as draft!" : "Consent form sent to patient for signature!" });
      router.push("/dashboard");
    }, 1500);
  }

  const inputBase = "w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";
  const inputClass = (field?: string) => `${inputBase} ${field && errors[field] ? "border-red-500" : "border-[var(--color-border)]"}`;
  const labelClass = "block text-sm font-medium mb-1.5";
  const errorMsg = (field: string) => errors[field] ? <p role="alert" className="text-xs text-red-500 mt-1">{errors[field]}</p> : null;

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 bg-[var(--color-card)]">
        <div className="px-8 py-4 border-b border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/dashboard" className="hover:text-[var(--color-primary)]">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--color-text)]">New Form</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-1">Create New Consent Form</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8">Fill in the details to generate a consent form for the patient</p>

          <div className="space-y-8">
            {/* Patient Information */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div data-field="patientName"><label className={labelClass}>Patient Name *</label><input className={inputClass("patientName")} aria-required="true" value={form.patientName} onChange={e => update("patientName", e.target.value)} placeholder="Full name" />{errorMsg("patientName")}</div>
                <div><label className={labelClass}>Patient ID / UHID</label><input className={inputClass()} value={form.patientId} onChange={e => update("patientId", e.target.value)} placeholder="APL-2026-XXXX" /></div>
                <div><label className={labelClass}>Date of Birth *</label><input type="date" className={inputClass()} aria-required="true" value={form.dob} onChange={e => update("dob", e.target.value)} /></div>
                <div><label className={labelClass}>Gender *</label>
                  <select className={inputClass()} aria-required="true" value={form.gender} onChange={e => update("gender", e.target.value)}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div data-field="phone"><label className={labelClass}>Contact Number *</label><input className={inputClass("phone")} aria-required="true" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91" />{errorMsg("phone")}</div>
                <div><label className={labelClass}>Blood Group</label>
                  <select className={inputClass()} value={form.bloodGroup} onChange={e => update("bloodGroup", e.target.value)}>
                    <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                  </select>
                </div>
                <div><label className={labelClass}>Emergency Contact</label><input className={inputClass()} value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} placeholder="Name" /></div>
                <div><label className={labelClass}>Emergency Phone</label><input className={inputClass()} value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} placeholder="+91" /></div>
              </div>
            </section>

            {/* Patient Language */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Language</h2>
              <div>
                <label className={labelClass}>Select the language the patient is most comfortable with *</label>
                <select className={inputClass()} value={form.patientLanguage} onChange={e => update("patientLanguage", e.target.value)}>
                  {[
                    "English", "Hindi (हिन्दी)", "Tamil (தமிழ்)", "Telugu (తెలుగు)", "Kannada (ಕನ್ನಡ)",
                    "Malayalam (മലയാളം)", "Bengali (বাংলা)", "Marathi (मराठी)", "Gujarati (ગુજરાતી)",
                    "Punjabi (ਪੰਜਾਬੀ)", "Odia (ଓଡ଼ିଆ)", "Assamese (অসমীয়া)", "Urdu (اردو)",
                    "Konkani (कोंकणी)", "Manipuri (মৈতৈলোন্)", "Bodo (बड़ो)", "Sindhi (سنڌي)",
                    "Nepali (नेपाली)", "Sanskrit (संस्कृतम्)", "Dogri (डोगरी)", "Maithili (मैथिली)",
                    "Santali (ᱥᱟᱱᱛᱟᱞᱤ)"
                  ].map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <p className="text-xs text-[var(--color-muted)] mt-2">The consent form will be translated to the selected language before sending to the patient</p>
              </div>
            </section>

            {/* Operation Details */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Operation Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2" data-field="operation"><label className={labelClass}>Operation / Procedure Name *</label><input className={inputClass("operation")} aria-required="true" value={form.operation} onChange={e => update("operation", e.target.value)} placeholder="e.g. Laparoscopic Cholecystectomy" />{errorMsg("operation")}</div>
                <div data-field="scheduledDate"><label className={labelClass}>Scheduled Date & Time *</label><input type="datetime-local" className={inputClass("scheduledDate")} aria-required="true" value={form.scheduledDate} onChange={e => update("scheduledDate", e.target.value)} />{errorMsg("scheduledDate")}</div>
                <div><label className={labelClass}>Operating Surgeon</label><input className={inputClass()} value={form.surgeon} onChange={e => update("surgeon", e.target.value)} /></div>
                <div data-field="anesthesia"><label className={labelClass}>Anesthesia Type *</label>
                  <select className={inputClass("anesthesia")} aria-required="true" value={form.anesthesia} onChange={e => update("anesthesia", e.target.value)}>
                    <option value="">Select</option><option>General</option><option>Spinal</option><option>Local</option><option>Regional</option><option>Sedation</option>
                  </select>
                  {errorMsg("anesthesia")}
                </div>
                <div><label className={labelClass}>Estimated Duration</label><input className={inputClass()} value={form.duration} onChange={e => update("duration", e.target.value)} placeholder="e.g. 1.5 hours" /></div>
              </div>
            </section>

            {/* Clinical Information */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Clinical Information</h2>
              <div className="space-y-4">
                <div data-field="diagnosis"><label className={labelClass}>Diagnosis *</label><textarea className={inputClass("diagnosis")} rows={2} value={form.diagnosis} onChange={e => update("diagnosis", e.target.value)} placeholder="Primary diagnosis" />{errorMsg("diagnosis")}</div>
                <div><label className={labelClass}>Procedure Description (Patient-friendly) *</label><textarea className={inputClass()} rows={4} value={form.procedureDescription} onChange={e => update("procedureDescription", e.target.value)} placeholder="Explain in simple language what will happen during the procedure" /></div>
                <div><label className={labelClass}>Expected Benefits</label><textarea className={inputClass()} rows={2} value={form.benefits} onChange={e => update("benefits", e.target.value)} /></div>
                <div data-field="risks">
                  <label className={labelClass}>Material Risks & Complications *</label>
                  <textarea className={inputClass("risks")} rows={3} value={form.risks} onChange={e => update("risks", e.target.value)} placeholder="List each risk clearly" />
                  {errors.risks ? errorMsg("risks") : <p className="text-xs text-[var(--color-muted)] mt-1">These will be shown to the patient. Be clear and specific.</p>}
                </div>
                <div><label className={labelClass}>Alternative Treatments</label><textarea className={inputClass()} rows={2} value={form.alternatives} onChange={e => update("alternatives", e.target.value)} /></div>
                <div><label className={labelClass}>Consequences of Not Having Procedure</label><textarea className={inputClass()} rows={2} value={form.consequences} onChange={e => update("consequences", e.target.value)} /></div>
              </div>
            </section>

            {/* Doctor's Video Explanation */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Doctor&apos;s Video Explanation <span className="text-sm font-normal text-[var(--color-muted)]">(Recommended)</span></h2>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 mt-2">
                Record yourself explaining the procedure to the patient. Courts consider this the strongest evidence of informed consent <span className="text-xs text-[var(--color-muted)]">(Samira Kohli v. Dr. Prabha Manchanda, 2008)</span>.
              </p>

              {videoState === "idle" && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 transition-colors">
                    <Video className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-sm font-medium">Record Explanation</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">Click to start recording</p>
                </button>
              )}

              {videoState === "recording" && (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                    <Video className="w-16 h-16 text-gray-600" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                      <Circle className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                      <span className="text-white text-xs font-mono font-medium">REC {formatTime(videoTimer)}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-[var(--color-border)] rounded-lg p-4">
                    <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Suggested Talking Points</p>
                    <ul className="space-y-1.5">
                      {[
                        "Explain the procedure in simple terms",
                        "Mention key risks and complications",
                        "Describe alternatives available",
                        "Confirm patient had opportunity to ask questions",
                      ].map(point => (
                        <li key={point} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                          <span className="text-[var(--color-primary)] mt-0.5">&#8226;</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <Circle className="w-4 h-4 fill-white" />
                    Stop Recording
                  </button>
                </div>
              )}

              {videoState === "recorded" && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Video explanation recorded ({formatTime(videoTimer)})</p>
                      <p className="text-xs text-green-600 mt-0.5">Will be attached to the consent form</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 border border-[var(--color-border)] rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Playback
                    </button>
                    <button
                      type="button"
                      onClick={reRecord}
                      className="flex-1 border border-[var(--color-border)] rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Re-record
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Additional Options */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Options</h2>
              <div className="space-y-3">
                {/* Include anesthesia consent toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => update("includeAnesthesia", !form.includeAnesthesia)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.includeAnesthesia ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.includeAnesthesia ? "left-5" : "left-1"}`} />
                  </button>
                  <span className="text-sm">Include anesthesia consent</span>
                </label>

                {/* Anesthesia Consent Sub-Form */}
                {form.includeAnesthesia && (
                  <div className="ml-13 border border-teal-200 bg-teal-50/30 rounded-lg p-4 space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--color-primary)]">Anesthesia Consent Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Anesthesiologist Name *</label>
                        <input className={inputClass()} value={form.anesthesiologistName} onChange={e => update("anesthesiologistName", e.target.value)} placeholder="Dr. " />
                      </div>
                      <div>
                        <label className={labelClass}>Type of Anesthesia</label>
                        <input className={`${inputClass} bg-gray-50`} value={form.anesthesia || "Not selected"} readOnly />
                        <p className="text-xs text-[var(--color-muted)] mt-1">Referenced from Operation Details above</p>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Anesthesia-Specific Risks *</label>
                      <textarea className={inputClass()} rows={3} value={form.anesthesiaRisks} onChange={e => update("anesthesiaRisks", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>ASA Physical Status Classification *</label>
                        <select className={inputClass()} value={form.asaClassification} onChange={e => update("asaClassification", e.target.value)}>
                          <option value="">Select ASA Class</option>
                          <option value="ASA I">ASA I - Normal healthy patient</option>
                          <option value="ASA II">ASA II - Mild systemic disease</option>
                          <option value="ASA III">ASA III - Severe systemic disease</option>
                          <option value="ASA IV">ASA IV - Life-threatening disease</option>
                          <option value="ASA V">ASA V - Moribund patient</option>
                          <option value="ASA VI">ASA VI - Brain-dead organ donor</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={form.npoConfirmed} onChange={e => update("npoConfirmed", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)]" />
                          <span className="text-sm">Patient has been nil per oral for required duration</span>
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] italic">Note: This will generate a separate anesthesia consent form attached to the main surgical consent</p>
                  </div>
                )}

                {/* Remaining toggles */}
                {[
                  { field: "includeBloodTransfusion", label: "Include blood transfusion consent" },
                  { field: "allowPhotography", label: "Allow photography/recording for medical purposes" },
                  { field: "includePostOp", label: "Include post-operative care instructions" },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => update(field, !(form as Record<string, unknown>)[field])}
                      className={`w-10 h-6 rounded-full transition-colors relative ${(form as Record<string, unknown>)[field] ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${(form as Record<string, unknown>)[field] ? "left-5" : "left-1"}`} />
                    </button>
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input type="checkbox" checked={form.verballyCounseled} onChange={e => update("verballyCounseled", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)]" />
                  <span className="text-sm font-medium">Patient has been verbally counseled about this procedure</span>
                </label>
              </div>
            </section>

            {/* Doctor's Signature */}
            <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Doctor&apos;s Signature</h2>
              <div className="space-y-3">
                {[
                  { value: "saved", label: "Use saved signature" },
                  { value: "draw", label: "Draw new signature" },
                  { value: "upload", label: "Upload signature image" },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="doctorSignatureMode"
                      value={opt.value}
                      checked={form.doctorSignatureMode === opt.value}
                      onChange={() => update("doctorSignatureMode", opt.value)}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>

              {form.doctorSignatureMode === "saved" && (
                <div className="mt-4 border border-[var(--color-border)] rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                  <p className="text-xl font-serif italic text-gray-500">Dr. Priya Sharma</p>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Saved</span>
                </div>
              )}

              {form.doctorSignatureMode === "draw" && (
                <div className="mt-4">
                  <SignaturePad label="Doctor Signature" onSave={() => {}} height={150} />
                </div>
              )}

              {form.doctorSignatureMode === "upload" && (
                <div className="mt-4 border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">PNG or JPG, max 2MB</p>
                  <input type="file" accept="image/png,image/jpeg" className="hidden" />
                </div>
              )}
            </section>

            {/* Actions */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Send to Patient</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  disabled={sending}
                  onClick={() => handleSubmit(false)}
                  className="border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)] hover:bg-blue-50/50 transition-colors text-center disabled:opacity-50"
                >
                  {sending ? (
                    <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2"><div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" /></div>
                  ) : (
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <p className="text-sm font-medium">{sending ? "Sending..." : "Send via SMS"}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">Text link to patient</p>
                </button>
                <button
                  disabled={sending}
                  onClick={() => {
                    const errs = validate();
                    if (Object.keys(errs).length > 0) {
                      setErrors(errs);
                      toast({ type: "error", message: "Please fill all required fields" });
                      const firstKey = Object.keys(errs)[0];
                      const el = document.querySelector(`[data-field="${firstKey}"]`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      return;
                    }
                    setSending(true);
                    setTimeout(() => {
                      setSending(false);
                      toast({ type: "success", message: "Consent form saved! Redirecting to WhatsApp Bot..." });
                      router.push("/whatsapp");
                    }, 1500);
                  }}
                  className="border-2 border-[#25d366] rounded-lg p-4 hover:bg-green-50/50 transition-colors text-center relative disabled:opacity-50"
                >
                  <span className="absolute -top-2 -right-2 bg-[#25d366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-[#25d366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <p className="text-sm font-medium">Send via WhatsApp</p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">Instant delivery</p>
                </button>
                <button
                  disabled={sending}
                  onClick={() => handleSubmit(false)}
                  className="border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)] hover:bg-blue-50/50 transition-colors text-center disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                  <p className="text-sm font-medium">Copy Link</p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">Share manually</p>
                </button>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border)]">
                <button disabled={sending} onClick={() => handleSubmit(true)} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium disabled:opacity-50">
                  Save as Draft instead
                </button>
                <p className="text-xs text-[var(--color-muted)]">Patient will receive a secure link to review & sign</p>
              </div>
            </div>

            <div className="h-8" />
          </div>
        </div>
      </main>
    </div>
  );
}
