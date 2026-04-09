"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Upload, FileImage, FileText, X, Sparkles, Check, Loader2, Eye, Pencil, GripVertical, Plus, Trash2, Type, ToggleLeft, AlignLeft, List, Calendar, ChevronDown, ChevronUp, Save } from "lucide-react";
import { useToast } from "@/components/Toast";

type FieldType = "text" | "textarea" | "date" | "checkbox" | "select" | "signature";

interface DetectedField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  prefilled?: string;
  options?: string[]; // for select type
  section: string;
}

const FIELD_ICONS: Record<FieldType, typeof Type> = {
  text: Type,
  textarea: AlignLeft,
  date: Calendar,
  checkbox: ToggleLeft,
  select: List,
  signature: Pencil,
};

export default function UploadTemplate() {
  const { toast } = useToast();
  const [step, setStep] = useState<"upload" | "processing" | "review" | "customize">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateLang, setTemplateLang] = useState("English");
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const SAMPLE_DETECTED_FIELDS: DetectedField[] = [
    { id: "f1", label: "Patient / Guardian Name", type: "text", required: true, section: "Patient Information" },
    { id: "f2", label: "Patient Age", type: "text", required: true, section: "Patient Information" },
    { id: "f3", label: "Patient Gender", type: "select", required: true, options: ["Male", "Female", "Other"], section: "Patient Information" },
    { id: "f4", label: "UHID / IP Number", type: "text", required: true, section: "Patient Information" },
    { id: "f5", label: "Ward / Bed No.", type: "text", required: false, section: "Patient Information" },
    { id: "f6", label: "Date of Admission", type: "date", required: false, section: "Patient Information" },
    { id: "f7", label: "Procedure / Operation Name", type: "text", required: true, section: "Procedure Details" },
    { id: "f8", label: "Indication / Reason for Procedure", type: "textarea", required: true, section: "Procedure Details" },
    { id: "f9", label: "Diagnosis", type: "textarea", required: true, section: "Procedure Details" },
    { id: "f10", label: "Name of Surgeon", type: "text", required: true, prefilled: "Dr. ", section: "Procedure Details" },
    { id: "f11", label: "Anaesthesia Type", type: "select", required: true, options: ["General", "Spinal", "Epidural", "Local", "Regional", "Sedation"], section: "Procedure Details" },
    { id: "f12", label: "Expected Benefits", type: "textarea", required: false, section: "Risk Disclosure" },
    { id: "f13", label: "Risks / Possible Complications", type: "textarea", required: true, prefilled: "Infection, Bleeding, Nerve Damage", section: "Risk Disclosure" },
    { id: "f14", label: "Alternative Treatments Available", type: "textarea", required: false, section: "Risk Disclosure" },
    { id: "f15", label: "Consequences of Refusing Procedure", type: "textarea", required: false, section: "Risk Disclosure" },
    { id: "f16", label: "Patient has been verbally counseled", type: "checkbox", required: true, section: "Acknowledgment" },
    { id: "f17", label: "Patient understands the procedure and risks", type: "checkbox", required: true, section: "Acknowledgment" },
    { id: "f18", label: "Patient had opportunity to ask questions", type: "checkbox", required: true, section: "Acknowledgment" },
    { id: "f19", label: "Patient / Guardian Signature", type: "signature", required: true, section: "Signatures" },
    { id: "f20", label: "Witness Signature", type: "signature", required: true, section: "Signatures" },
    { id: "f21", label: "Surgeon Signature", type: "signature", required: true, section: "Signatures" },
    { id: "f22", label: "Date", type: "date", required: true, section: "Signatures" },
  ];

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }

  function startProcessing() {
    setStep("processing");
    setProgress(0);

    const steps = [
      { pct: 15, text: "Uploading document..." },
      { pct: 30, text: "Running OCR — extracting text..." },
      { pct: 50, text: "Detecting form fields and labels..." },
      { pct: 65, text: "Identifying signature blocks..." },
      { pct: 80, text: "Mapping field types (text, checkbox, date)..." },
      { pct: 90, text: "Detecting language and legal clauses..." },
      { pct: 95, text: "Generating editable template..." },
      { pct: 100, text: "Done! Template ready for review." },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].pct);
        setProgressText(steps[i].text);
        i++;
      } else {
        clearInterval(interval);
        setDetectedFields(SAMPLE_DETECTED_FIELDS);
        setTemplateName("Uploaded Consent Form");
        const sections = [...new Set(SAMPLE_DETECTED_FIELDS.map(f => f.section))];
        setExpandedSections(Object.fromEntries(sections.map(s => [s, true])));
        setTimeout(() => setStep("review"), 500);
      }
    }, 800);
  }

  function removeField(id: string) {
    setDetectedFields(prev => prev.filter(f => f.id !== id));
  }

  function updateField(id: string, updates: Partial<DetectedField>) {
    setDetectedFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }

  function addField(section: string) {
    const newId = `f-new-${Date.now()}`;
    setDetectedFields(prev => [...prev, {
      id: newId,
      label: "New Field",
      type: "text",
      required: false,
      section,
    }]);
  }

  const sections = [...new Set(detectedFields.map(f => f.section))];

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 bg-[var(--color-card)]">
        <div className="px-8 py-4 border-b border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/templates" className="hover:text-[var(--color-primary)]">Templates</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--color-text)]">Upload & Convert</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {["Upload Form", "AI Processing", "Review & Edit"].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                    (i === 0 && step === "upload") || (i === 1 && step === "processing") || (i === 2 && (step === "review" || step === "customize"))
                      ? "bg-[var(--color-primary)] text-white"
                      : i === 0 && step !== "upload"
                      ? "bg-[var(--color-success)] text-white"
                      : i === 1 && (step === "review" || step === "customize")
                      ? "bg-[var(--color-success)] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {(i === 0 && step !== "upload") || (i === 1 && (step === "review" || step === "customize"))
                      ? <Check className="w-4 h-4" />
                      : i + 1
                    }
                  </div>
                  <span className="text-xs mt-1.5 font-medium text-[var(--color-text-secondary)]">{label}</span>
                </div>
                {i < 2 && <div className={`w-24 h-0.5 mx-3 mb-5 ${
                  (i === 0 && step !== "upload") || (i === 1 && (step === "review" || step === "customize"))
                    ? "bg-[var(--color-success)]"
                    : "bg-gray-200"
                }`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-bold">Upload Your Consent Form</h1>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">Upload a photo, scan, or PDF of your hospital&apos;s existing consent form and we&apos;ll convert it into an editable digital template</p>
              </div>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-[var(--color-primary)]", "bg-teal-50/50"); }}
                onDragLeave={e => { e.currentTarget.classList.remove("border-[var(--color-primary)]", "bg-teal-50/50"); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-[var(--color-primary)]", "bg-teal-50/50"); handleFiles(e.dataTransfer.files); }}
                className="bg-white border-2 border-dashed border-[var(--color-border)] rounded-xl p-12 text-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-teal-50/30 transition-all"
              >
                <Upload className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-4" />
                <p className="font-semibold mb-1">Drop files here or click to browse</p>
                <p className="text-sm text-[var(--color-muted)]">Supports JPG, PNG, PDF — photos of paper forms work great</p>
                <p className="text-xs text-[var(--color-muted)] mt-2">Upload multiple pages if your form has more than one page</p>
                <input ref={fileRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
              </div>

              {/* Uploaded files preview */}
              {previews.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Uploaded Pages ({previews.length})</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {previews.map((preview, i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-[3/4] rounded-lg border border-[var(--color-border)] overflow-hidden bg-gray-50">
                          {files[i]?.type === "application/pdf" ? (
                            <div className="h-full flex flex-col items-center justify-center">
                              <FileText className="w-8 h-8 text-red-500 mb-1" />
                              <p className="text-xs text-[var(--color-muted)]">PDF</p>
                            </div>
                          ) : (
                            <img src={preview} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-center text-[var(--color-muted)] mt-1">Page {i + 1}</p>
                      </div>
                    ))}
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="aspect-[3/4] rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-teal-50/30 transition-all"
                    >
                      <Plus className="w-5 h-5 text-[var(--color-muted)] mb-1" />
                      <p className="text-xs text-[var(--color-muted)]">Add page</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form type hint */}
              {previews.length > 0 && (
                <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
                  <h3 className="font-semibold text-sm mb-3">What type of form is this?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Surgical Consent", icon: FileImage },
                      { label: "Anaesthesia Consent", icon: FileText },
                      { label: "Other / Custom", icon: FileText },
                    ].map(t => (
                      <button key={t.label} className="border border-[var(--color-border)] rounded-lg p-3 text-left hover:border-[var(--color-primary)] hover:bg-teal-50/30 transition-colors">
                        <t.icon className="w-5 h-5 text-[var(--color-muted)] mb-2" />
                        <p className="text-sm font-medium">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {previews.length > 0 && (
                <div className="flex justify-end">
                  <button onClick={startProcessing} className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Convert to Digital Template
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Processing */}
          {step === "processing" && (
            <div className="bg-white border border-[var(--color-border)] rounded-xl p-10 text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
              </div>
              <h2 className="text-xl font-bold mb-2">Converting your form...</h2>
              <p className="text-[var(--color-text-secondary)] text-sm mb-8">{progressText}</p>

              <div className="max-w-md mx-auto mb-6">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-2">{progress}%</p>
              </div>

              <div className="space-y-2 text-left max-w-sm mx-auto">
                {[
                  { text: "OCR text extraction", done: progress >= 30 },
                  { text: "Field detection & labeling", done: progress >= 50 },
                  { text: "Signature block identification", done: progress >= 65 },
                  { text: "Field type classification", done: progress >= 80 },
                  { text: "Template generation", done: progress >= 95 },
                ].map(s => (
                  <div key={s.text} className="flex items-center gap-2.5">
                    {s.done ? (
                      <Check className="w-4 h-4 text-[var(--color-success)]" />
                    ) : progress > 0 ? (
                      <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                    )}
                    <span className={`text-sm ${s.done ? "text-[var(--color-text)]" : "text-[var(--color-muted)]"}`}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review & Customize */}
          {(step === "review" || step === "customize") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Review Detected Fields</h1>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-1">We found {detectedFields.length} fields across {sections.length} sections. Edit, reorder, or remove as needed.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-success)] bg-green-50 px-3 py-1.5 rounded-full">
                    <Check className="w-3 h-3" /> {detectedFields.length} fields detected
                  </span>
                </div>
              </div>

              {/* Template metadata */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Template Name</label>
                    <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={templateName} onChange={e => setTemplateName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Language</label>
                    <select className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" value={templateLang} onChange={e => setTemplateLang(e.target.value)}>
                      {["English", "Hindi (हिन्दी)", "Tamil (தமிழ்)", "Telugu (తెలుగు)", "Kannada (ಕನ್ನಡ)", "Malayalam (മലയാളം)", "Bengali (বাংলা)", "Marathi (मराठी)"].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Side-by-side: Original + Detected Fields */}
              <div className="grid grid-cols-5 gap-6">
                {/* Original image preview */}
                <div className="col-span-2">
                  <div className="sticky top-8">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Original Form
                    </h3>
                    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-white">
                      {previews[0] && (
                        <img src={previews[0]} alt="Original form" className="w-full" />
                      )}
                      {!previews[0] && (
                        <div className="aspect-[3/4] flex items-center justify-center bg-gray-50">
                          <FileImage className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {previews.length > 1 && (
                      <div className="flex gap-2 mt-2">
                        {previews.map((p, i) => (
                          <div key={i} className="w-12 h-16 border border-[var(--color-border)] rounded overflow-hidden cursor-pointer hover:border-[var(--color-primary)]">
                            <img src={p} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detected fields */}
                <div className="col-span-3 space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)]" /> Detected Fields
                  </h3>

                  {sections.map(section => {
                    const sectionFields = detectedFields.filter(f => f.section === section);
                    const isExpanded = expandedSections[section] !== false;
                    return (
                      <div key={section} className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, [section]: !isExpanded }))}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{section}</span>
                            <span className="text-xs text-[var(--color-muted)] bg-gray-100 px-2 py-0.5 rounded-full">{sectionFields.length} fields</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-[var(--color-border)]">
                            {sectionFields.map(field => {
                              const FieldIcon = FIELD_ICONS[field.type];
                              return (
                                <div key={field.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 group">
                                  <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab" />
                                  <div className={`w-7 h-7 rounded flex items-center justify-center ${
                                    field.type === "signature" ? "bg-purple-50 text-purple-600"
                                    : field.type === "checkbox" ? "bg-green-50 text-green-600"
                                    : field.type === "date" ? "bg-blue-50 text-blue-600"
                                    : field.type === "select" ? "bg-amber-50 text-amber-600"
                                    : field.type === "textarea" ? "bg-orange-50 text-orange-600"
                                    : "bg-gray-50 text-gray-600"
                                  }`}>
                                    <FieldIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <input
                                    className="flex-1 text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                                    value={field.label}
                                    onChange={e => updateField(field.id, { label: e.target.value })}
                                  />
                                  <select
                                    className="text-xs border border-[var(--color-border)] rounded px-2 py-1 bg-white"
                                    value={field.type}
                                    onChange={e => updateField(field.id, { type: e.target.value as FieldType })}
                                  >
                                    <option value="text">Text</option>
                                    <option value="textarea">Long Text</option>
                                    <option value="date">Date</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="select">Dropdown</option>
                                    <option value="signature">Signature</option>
                                  </select>
                                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                                    <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} className="w-3.5 h-3.5 rounded text-[var(--color-primary)]" />
                                    <span className="text-[var(--color-muted)]">Required</span>
                                  </label>
                                  <button onClick={() => removeField(field.id)} className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  </button>
                                </div>
                              );
                            })}
                            <button
                              onClick={() => addField(section)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-primary)] hover:bg-teal-50/50 transition-colors"
                            >
                              <Plus className="w-3 h-3" /> Add field to {section}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add new section */}
                  <button
                    onClick={() => {
                      const name = prompt("Section name:");
                      if (name) {
                        addField(name);
                        setExpandedSections(prev => ({ ...prev, [name]: true }));
                      }
                    }}
                    className="w-full border-2 border-dashed border-[var(--color-border)] rounded-lg py-3 text-sm text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    + Add New Section
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between bg-white border border-[var(--color-border)] rounded-lg p-5">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  <strong>{detectedFields.length}</strong> fields in <strong>{sections.length}</strong> sections — ready to save
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("upload")} className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-gray-50">
                    Re-upload
                  </button>
                  <button className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Preview Template
                  </button>
                  <button
                    onClick={() => {
                      toast({ type: "success", message: `Template "${templateName}" saved with ${detectedFields.length} fields!` });
                      window.location.href = "/templates";
                    }}
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
