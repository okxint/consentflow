"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Upload, Eye, Download, CheckCircle, AlertTriangle } from "lucide-react";

const tabs = ["Hospital Profile", "Users & Roles", "Notifications", "Compliance", "Integrations"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Hospital Profile");

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="flex gap-1 border-b border-[var(--color-border)] mb-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Hospital Profile" && (
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-3 space-y-6">
                <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                  <h2 className="font-semibold mb-4">Hospital Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Hospital Name</label>
                      <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" defaultValue="Apollo Hospitals" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Address</label>
                      <textarea className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" rows={2} defaultValue="21, Greams Lane, Off Greams Road, Chennai 600006" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Phone</label>
                        <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" defaultValue="044-2829 3333" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" defaultValue="info@apollohospitals.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Registration / NABH Number</label>
                      <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" defaultValue="NABH-H-2024-0156" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                  <h2 className="font-semibold mb-4">Branding</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hospital Logo</label>
                      <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-[var(--color-muted)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-muted)]">Upload logo (PNG, SVG)</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">Max 2MB, 400x200px recommended</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Digital Seal / Stamp</label>
                      <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-[var(--color-muted)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-muted)]">Upload seal (PNG)</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">Appears on signed documents</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                  <h2 className="font-semibold mb-4">Default Consent Language</h2>
                  <textarea
                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm"
                    rows={6}
                    defaultValue={`I, the undersigned, hereby consent to the above-mentioned procedure being performed on me by the named surgeon and their team. I confirm that:\n\n1. The nature and purpose of the procedure has been explained to me.\n2. The potential risks and complications have been discussed.\n3. Alternative treatments have been explained.\n4. I have had the opportunity to ask questions.\n\nI understand that this consent is voluntary and I may withdraw it at any time before the procedure.`}
                  />
                  <p className="text-xs text-[var(--color-muted)] mt-2">This text will be used as the default consent language for all new forms. You can customize it per form.</p>
                </div>

                <div className="flex justify-end">
                  <button className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Letterhead Preview */}
              <div className="col-span-2">
                <div className="sticky top-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Letterhead Preview</h3>
                    <button className="text-xs text-[var(--color-primary)] flex items-center gap-1 hover:underline"><Eye className="w-3 h-3" /> Full Preview</button>
                  </div>
                  <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                    <div className="text-center border-b-2 border-[var(--color-primary)] pb-3 mb-4">
                      <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AH</span>
                      </div>
                      <h4 className="font-bold text-[var(--color-primary)]">Apollo Hospitals</h4>
                      <p className="text-[8px] text-[var(--color-muted)]">21, Greams Lane, Chennai 600006</p>
                      <p className="text-[8px] text-[var(--color-muted)]">Tel: 044-2829 3333 | NABH-H-2024-0156</p>
                    </div>
                    <p className="text-[9px] font-semibold text-center mb-3">INFORMED CONSENT FOR SURGICAL PROCEDURE</p>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-full" />
                      <div className="h-2 bg-gray-100 rounded w-5/6" />
                      <div className="h-2 bg-gray-100 rounded w-2/3" />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="h-6 border-b border-gray-300 mb-0.5" />
                        <p className="text-[7px] text-[var(--color-muted)]">Patient</p>
                      </div>
                      <div className="text-center">
                        <div className="h-6 border-b border-gray-300 mb-0.5" />
                        <p className="text-[7px] text-[var(--color-muted)]">Witness</p>
                      </div>
                      <div className="text-center">
                        <div className="h-6 border-b border-gray-300 mb-0.5" />
                        <p className="text-[7px] text-[var(--color-muted)]">Doctor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Integrations" && (
            <div className="space-y-6">
              {/* ABHA */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">ABHA (Ayushman Bharat Health Account)</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-[var(--color-success)] border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />Connected
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-5">Link consent records to patient ABHA IDs. Signed consents are pushed to the patient&apos;s Personal Health Record (PHR) via ABDM Health Information Exchange.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Auto-push signed consents to patient PHR</p>
                      <p className="text-xs text-[var(--color-muted)]">Automatically send signed consent documents to patient&apos;s ABHA-linked PHR</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[var(--color-primary)] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-full after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Verify patient identity via ABHA before consent</p>
                      <p className="text-xs text-[var(--color-muted)]">Require ABHA ID verification before consent form is generated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[var(--color-primary)] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-full after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">ABHA Facility ID</label>
                      <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" defaultValue="IN3410000124" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">HIP (Health Information Provider) ID</label>
                      <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" placeholder="Enter HIP ID" />
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)]">
                    Test Connection
                  </button>
                </div>
              </div>

              {/* DigiLocker */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                <h2 className="font-semibold mb-2">DigiLocker</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-5">Allow patients to access their signed consent forms in DigiLocker</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Enable DigiLocker push</p>
                      <p className="text-xs text-[var(--color-muted)]">Push signed consent documents to patient&apos;s DigiLocker account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[var(--color-primary)] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-full after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                  <div className="max-w-sm">
                    <label className="block text-sm font-medium mb-1.5">Issuer ID</label>
                    <input className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" placeholder="Enter DigiLocker Issuer ID" />
                  </div>
                </div>
              </div>

              {/* Aadhaar eSign */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                <h2 className="font-semibold mb-2">Aadhaar eSign</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-5">Enable Aadhaar-based electronic signatures for patient consent</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">eSign Provider</label>
                      <select className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm bg-white">
                        <option>eMudhra</option>
                        <option>NSDL</option>
                        <option>C-DAC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">API Key</label>
                      <input type="password" className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm" placeholder="Enter API key" />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">Cost per signature: ~&#8377;5-15</p>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Enable Aadhaar eSign for patients</p>
                      <p className="text-xs text-[var(--color-muted)]">Allow patients to sign consent forms using Aadhaar-based electronic signature</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[var(--color-primary)] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-full after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Insurance / TPA */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
                <h2 className="font-semibold mb-2">Insurance / TPA</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-5">Connect with Third Party Administrators for cashless claim documentation</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Supported TPAs</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Medi Assist", "Paramount Health Services", "Vidal Health", "FHPL (Family Health Plan)", "Raksha TPA", "Heritage Health"].map(tpa => (
                        <label key={tpa} className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" defaultChecked={tpa === "Medi Assist" || tpa === "Vidal Health"} className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                          {tpa}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                    <div>
                      <p className="text-sm font-medium">Auto-generate TPA-compatible documentation</p>
                      <p className="text-xs text-[var(--color-muted)]">Automatically create documentation in TPA-required format upon consent completion</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[var(--color-primary)] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-full after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Compliance" && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
              <h2 className="font-semibold mb-4">Regulatory Compliance</h2>
              <div className="space-y-3">
                {[
                  { label: "IT Act 2000 — Electronic signatures enabled", ok: true },
                  { label: "Consumer Protection Act 2019 — Full audit trail enabled", ok: true },
                  { label: "MCI/NMC Ethics Regulations — Informed consent workflow compliant", ok: true },
                  { label: "NABH Standards COP.5 & COP.6 — Template version control active", ok: true },
                  { label: "ABDM/ABHA Integration — Partially configured", ok: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                    {item.ok ? (
                      <CheckCircle className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)]">
                  <Download className="w-4 h-4" /> Download Compliance Certificate
                </button>
              </div>
            </div>
          )}

          {(activeTab === "Users & Roles" || activeTab === "Notifications") && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-[var(--color-card)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-[var(--color-muted)]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{activeTab}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm max-w-md mx-auto">This section is coming soon. Configure {activeTab.toLowerCase()} settings for your hospital.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
