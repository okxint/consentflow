"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Upload, Download, Plus, Trash2, CheckCircle, AlertCircle, Send } from "lucide-react";

interface BulkRow {
  patientName: string;
  uhid: string;
  procedure: string;
  phone: string;
  template: string;
  language: string;
}

const emptyRow = (): BulkRow => ({
  patientName: "",
  uhid: "",
  procedure: "",
  phone: "",
  template: "Surgery Consent",
  language: "English",
});

interface CsvRow extends BulkRow {
  valid: boolean;
  error?: string;
}

export default function BulkCreate() {
  const [activeTab, setActiveTab] = useState<"quick" | "csv">("quick");
  const [rows, setRows] = useState<BulkRow[]>([emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
  const [csvData, setCsvData] = useState<CsvRow[] | null>(null);
  const [csvFileName, setCsvFileName] = useState("");

  const filledCount = rows.filter(r => r.patientName.trim() && r.procedure.trim()).length;

  function updateRow(index: number, field: keyof BulkRow, value: string) {
    setRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addRow() {
    setRows(prev => [...prev, emptyRow()]);
  }

  function removeRow(index: number) {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter((_, i) => i !== index));
  }

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      // Skip header
      const dataLines = lines.slice(1);
      const parsed: CsvRow[] = dataLines.map(line => {
        const parts = line.split(",").map(s => s.trim());
        const row: CsvRow = {
          patientName: parts[0] || "",
          uhid: parts[1] || "",
          procedure: parts[2] || "",
          phone: parts[3] || "",
          template: parts[4] || "Surgery Consent",
          language: parts[5] || "English",
          valid: true,
        };
        if (!row.patientName || !row.procedure) {
          row.valid = false;
          row.error = "Missing required fields";
        }
        if (row.phone && !/^\+?\d[\d\s-]{8,}$/.test(row.phone)) {
          row.valid = false;
          row.error = "Invalid phone number";
        }
        return row;
      });
      setCsvData(parsed);
    };
    reader.readAsText(file);
  }

  const inputClass = "w-full border border-[var(--color-border)] rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]";

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[var(--color-card)]">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Bulk Consent Creation</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Create multiple consent forms at once</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 max-w-xs">
            <button
              onClick={() => setActiveTab("quick")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "quick" ? "bg-white shadow text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
            >
              Quick Entry
            </button>
            <button
              onClick={() => setActiveTab("csv")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "csv" ? "bg-white shadow text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
            >
              CSV Upload
            </button>
          </div>

          {activeTab === "quick" && (
            <div className="space-y-4">
              <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wide">
                        <th className="px-3 py-3 font-medium w-8">#</th>
                        <th className="px-3 py-3 font-medium">Patient Name</th>
                        <th className="px-3 py-3 font-medium">UHID</th>
                        <th className="px-3 py-3 font-medium">Procedure</th>
                        <th className="px-3 py-3 font-medium">Phone Number</th>
                        <th className="px-3 py-3 font-medium">Template</th>
                        <th className="px-3 py-3 font-medium">Language</th>
                        <th className="px-3 py-3 font-medium w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="px-3 py-2 text-xs text-[var(--color-muted)]">{i + 1}</td>
                          <td className="px-3 py-2">
                            <input className={inputClass} placeholder="Name" value={row.patientName} onChange={e => updateRow(i, "patientName", e.target.value)} />
                          </td>
                          <td className="px-3 py-2">
                            <input className={inputClass} placeholder="UHID" value={row.uhid} onChange={e => updateRow(i, "uhid", e.target.value)} />
                          </td>
                          <td className="px-3 py-2">
                            <input className={inputClass} placeholder="Procedure" value={row.procedure} onChange={e => updateRow(i, "procedure", e.target.value)} />
                          </td>
                          <td className="px-3 py-2">
                            <input className={inputClass} placeholder="+91..." value={row.phone} onChange={e => updateRow(i, "phone", e.target.value)} />
                          </td>
                          <td className="px-3 py-2">
                            <select className={inputClass} value={row.template} onChange={e => updateRow(i, "template", e.target.value)}>
                              <option>Surgery Consent</option>
                              <option>Anaesthesia Consent</option>
                              <option>High Risk Consent</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <select className={inputClass} value={row.language} onChange={e => updateRow(i, "language", e.target.value)}>
                              <option>English</option>
                              <option>Tamil</option>
                              <option>Hindi</option>
                              <option>Telugu</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <button onClick={() => removeRow(i)} className="p-1 hover:bg-gray-100 rounded" title="Remove">
                              <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={addRow} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                  <span className="text-sm text-[var(--color-muted)]">{filledCount} of {rows.length} rows filled</span>
                </div>
                <button
                  disabled={filledCount === 0}
                  onClick={() => alert(`Creating ${filledCount} consent forms and sending via WhatsApp...`)}
                  className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" /> Create All & Send via WhatsApp
                </button>
              </div>
            </div>
          )}

          {activeTab === "csv" && (
            <div className="space-y-6">
              {/* Upload area */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-8">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-10 text-center hover:border-[var(--color-primary)] transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">
                      {csvFileName ? csvFileName : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">CSV file only</p>
                  </div>
                  <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
                </label>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Expected format:</p>
                  <div className="bg-gray-50 border border-[var(--color-border)] rounded-lg p-3 font-mono text-xs text-[var(--color-text-secondary)]">
                    Name, UHID, Procedure, Phone, Template, Language
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-xs text-[var(--color-primary)] font-medium mt-2 hover:underline">
                    <Download className="w-3 h-3" /> Download sample CSV
                  </button>
                </div>
              </div>

              {/* Preview table */}
              {csvData && (
                <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Preview ({csvData.length} rows)</h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> {csvData.filter(r => r.valid).length} valid
                      </span>
                      {csvData.filter(r => !r.valid).length > 0 && (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {csvData.filter(r => !r.valid).length} errors
                        </span>
                      )}
                    </div>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wide">
                        <th className="px-4 py-3 font-medium w-10"></th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">UHID</th>
                        <th className="px-4 py-3 font-medium">Procedure</th>
                        <th className="px-4 py-3 font-medium">Phone</th>
                        <th className="px-4 py-3 font-medium">Template</th>
                        <th className="px-4 py-3 font-medium">Language</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.map((row, i) => (
                        <tr key={i} className={`border-b border-[var(--color-border)] last:border-0 ${!row.valid ? "bg-red-50" : ""}`}>
                          <td className="px-4 py-3">
                            {row.valid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <span title={row.error}><AlertCircle className="w-4 h-4 text-red-500" /></span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{row.patientName || <span className="text-red-400">Missing</span>}</td>
                          <td className="px-4 py-3 text-sm">{row.uhid || "--"}</td>
                          <td className="px-4 py-3 text-sm">{row.procedure || <span className="text-red-400">Missing</span>}</td>
                          <td className="px-4 py-3 text-sm">{row.phone || "--"}</td>
                          <td className="px-4 py-3 text-sm">{row.template}</td>
                          <td className="px-4 py-3 text-sm">{row.language}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-4 border-t border-[var(--color-border)] flex justify-end">
                    <button
                      disabled={csvData.filter(r => r.valid).length === 0}
                      onClick={() => alert(`Creating ${csvData.filter(r => r.valid).length} consent forms...`)}
                      className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Create All
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
