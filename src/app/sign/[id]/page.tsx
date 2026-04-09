"use client";
import { SAMPLE_FORMS } from "@/lib/data";
import { SignaturePad } from "@/components/SignaturePad";
import { VideoConsent } from "@/components/VideoConsent";
import { useToast } from "@/components/Toast";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, FileText, Shield } from "lucide-react";

export default function PatientSign() {
  const { toast } = useToast();
  const { id } = useParams();
  const form = SAMPLE_FORMS.find(f => f.id === id) || SAMPLE_FORMS[0];
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState({ anesthesia: false, blood: false, photo: false, understood: false });
  const [patientSig, setPatientSig] = useState("");
  const [witnessSig, setWitnessSig] = useState("");
  const [witnessName, setWitnessName] = useState("");
  const [witnessRelation, setWitnessRelation] = useState("");
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("procedure");
  const [language, setLanguage] = useState("English");
  const [signMode, setSignMode] = useState<"aadhaar" | "manual">("aadhaar");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarSendingOtp, setAadhaarSendingOtp] = useState(false);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);

  const allAgreed = agreed.anesthesia && agreed.understood;
  const canSubmit = (signMode === "aadhaar" ? aadhaarVerified : patientSig) && witnessSig && witnessName && videoBlob;

  const sections = [
    { key: "procedure", title: "What is this procedure?", content: form.procedureDescription },
    { key: "benefits", title: "Expected Benefits", content: form.benefits },
    { key: "risks", title: "Risks & Possible Complications", content: form.risks },
    { key: "alternatives", title: "Alternative Treatments", content: form.alternatives },
    { key: "consequences", title: "What happens if I don't have this procedure?", content: form.consequences },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--color-card)] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Consent Submitted</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">A copy has been sent to your registered mobile number</p>
          <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:bg-[var(--color-primary-hover)] flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Download PDF Copy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-card)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--color-border)] py-4">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold text-[var(--color-primary)]">MGMCRI</h1>
            <p className="text-xs text-[var(--color-muted)]">Operation Consent Form</p>
          </div>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="text-xs border border-[var(--color-border)] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
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
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-0 mb-8">
          {["Review Info", "Read & Consent", "Sign"].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 < step ? "bg-[var(--color-success)] text-white"
                  : i + 1 === step ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 text-gray-500"
                }`}>
                  {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs mt-1 ${i + 1 === step ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}>{label}</span>
              </div>
              {i < 2 && <div className={`w-20 h-0.5 mx-2 mb-5 ${i + 1 < step ? "bg-[var(--color-success)]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Review */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <h2 className="font-semibold text-sm text-[var(--color-muted)] uppercase tracking-wide mb-3">Your Information</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><span className="text-[var(--color-muted)]">Name:</span> <strong>{form.patientName}</strong></p>
                <p><span className="text-[var(--color-muted)]">DOB:</span> <strong>{new Date(form.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></p>
                <p><span className="text-[var(--color-muted)]">UHID:</span> <strong>{form.patientId}</strong></p>
                <p><span className="text-[var(--color-muted)]">Blood Group:</span> <strong>{form.bloodGroup}</strong></p>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <h2 className="font-semibold text-sm text-[var(--color-muted)] uppercase tracking-wide mb-3">Procedure Details</h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-[var(--color-muted)]">Operation:</span> <strong>{form.operation}</strong></p>
                <p><span className="text-[var(--color-muted)]">Surgeon:</span> <strong>{form.surgeon}</strong></p>
                <p><span className="text-[var(--color-muted)]">Date:</span> <strong>{new Date(form.scheduledDate).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong></p>
                <p><span className="text-[var(--color-muted)]">Anesthesia:</span> <strong>{form.anesthesia}</strong></p>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Read & Consent */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
              {sections.map((section) => (
                <div key={section.key} className="border-b border-[var(--color-border)] last:border-0">
                  <button
                    onClick={() => setExpanded(expanded === section.key ? null : section.key)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left"
                  >
                    <span className="font-medium text-sm">{section.title}</span>
                    {expanded === section.key ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {expanded === section.key && (
                    <div className="px-5 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 space-y-3">
              <h3 className="font-semibold text-sm mb-2">Additional Consents</h3>
              {[
                { key: "anesthesia" as const, label: "I consent to general anesthesia administration" },
                { key: "blood" as const, label: "I consent to blood transfusion if medically necessary" },
                { key: "photo" as const, label: "I allow medical photography for clinical records" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed[key]} onChange={e => setAgreed(prev => ({ ...prev, [key]: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)]" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>

            <div className="bg-white border-2 border-[var(--color-primary)] rounded-lg p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed.understood} onChange={e => setAgreed(prev => ({ ...prev, understood: e.target.checked }))} className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[var(--color-primary)]" />
                <span className="text-sm font-semibold">I confirm that I have read and understood all the information above. I have had the opportunity to ask questions and all my questions have been answered to my satisfaction.</span>
              </label>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="border border-[var(--color-border)] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} disabled={!allAgreed} className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed">
                Proceed to Sign
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sign */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Sign Your Consent</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{form.operation} — {form.surgeon}</p>
            </div>

            {/* Aadhaar eSign */}
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Verify Identity with Aadhaar</h3>
                  <p className="text-xs text-[var(--color-muted)]">Legally valid electronic signature under IT Act 2000, Section 3A</p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <label className={`flex-1 flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${signMode === "aadhaar" ? "border-[var(--color-primary)] bg-teal-50/50" : "border-[var(--color-border)]"}`}>
                  <input type="radio" name="signMode" checked={signMode === "aadhaar"} onChange={() => setSignMode("aadhaar")} className="w-4 h-4 text-[var(--color-primary)]" />
                  <div>
                    <span className="text-sm font-medium">Aadhaar eSign</span>
                    <span className="ml-1.5 text-[10px] bg-teal-100 text-[var(--color-primary)] font-semibold px-1.5 py-0.5 rounded-full">Recommended</span>
                  </div>
                </label>
                <label className={`flex-1 flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${signMode === "manual" ? "border-[var(--color-primary)] bg-teal-50/50" : "border-[var(--color-border)]"}`}>
                  <input type="radio" name="signMode" checked={signMode === "manual"} onChange={() => setSignMode("manual")} className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm font-medium">Manual Signature</span>
                </label>
              </div>

              {signMode === "aadhaar" && (
                <div className="mt-4 space-y-4">
                  {!aadhaarVerified ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Aadhaar Number</label>
                        <div className="flex gap-3">
                          <input
                            className="flex-1 border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono tracking-widest"
                            value={aadhaarNumber}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
                              setAadhaarNumber(digits);
                            }}
                            placeholder="XXXX XXXX XXXX"
                            maxLength={12}
                            disabled={aadhaarOtpSent}
                          />
                          <button
                            type="button"
                            disabled={aadhaarNumber.length !== 12 || aadhaarOtpSent || aadhaarSendingOtp}
                            onClick={() => {
                              setAadhaarSendingOtp(true);
                              setTimeout(() => {
                                setAadhaarOtpSent(true);
                                setAadhaarSendingOtp(false);
                              }, 1500);
                            }}
                            className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {aadhaarSendingOtp ? "Sending..." : aadhaarOtpSent ? "OTP Sent" : "Send OTP"}
                          </button>
                        </div>
                        {aadhaarOtpSent && !aadhaarVerified && (
                          <p className="text-xs text-[var(--color-primary)] mt-1.5">OTP sent to mobile linked with Aadhaar</p>
                        )}
                      </div>

                      {aadhaarOtpSent && (
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Enter OTP</label>
                          <div className="flex gap-3">
                            <input
                              className="flex-1 border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono tracking-[0.5em] text-center"
                              value={aadhaarOtp}
                              onChange={e => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                                setAadhaarOtp(digits);
                              }}
                              placeholder="------"
                              maxLength={6}
                            />
                            <button
                              type="button"
                              disabled={aadhaarOtp.length !== 6 || aadhaarVerifying}
                              onClick={() => {
                                setAadhaarVerifying(true);
                                setTimeout(() => {
                                  setAadhaarVerified(true);
                                  setAadhaarVerifying(false);
                                }, 2000);
                              }}
                              className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {aadhaarVerifying ? "Verifying..." : "Verify"}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Aadhaar Verified — {form.patientName}</p>
                        <p className="text-xs text-green-600 mt-0.5">XXXX-XXXX-{aadhaarNumber.slice(-4)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {signMode === "manual" && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <SignaturePad label="Patient Signature" onSave={setPatientSig} height={200} />
              <div className="flex justify-between mt-3 text-sm text-[var(--color-muted)]">
                <span>Patient: {form.patientName}</span>
                <span>Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
            )}

            {/* Video KYC */}
            <VideoConsent onRecorded={setVideoBlob} patientName={form.patientName} />

            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
              <SignaturePad label="Witness Signature" onSave={setWitnessSig} height={150} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Witness Name *</label>
                  <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={witnessName} onChange={e => setWitnessName(e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Relationship</label>
                  <select className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={witnessRelation} onChange={e => setWitnessRelation(e.target.value)}>
                    <option value="">Select</option>
                    <option>Family Member</option>
                    <option>Nurse</option>
                    <option>Hospital Staff</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--color-muted)] text-center">
              This digital signature is legally binding under the Information Technology Act, 2000
            </p>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="border border-[var(--color-border)] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Back</button>
              <button
                onClick={() => {
                  setSubmitting(true);
                  setTimeout(() => {
                    setSubmitting(false);
                    setSubmitted(true);
                    toast({ type: "success", message: "Consent submitted successfully!" });
                  }, 2000);
                }}
                disabled={!canSubmit || submitting}
                className="bg-[var(--color-success)] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {submitting ? "Submitting..." : "Submit Consent"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
