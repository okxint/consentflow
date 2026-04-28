"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Shield,
  ArrowRight,
  Video,
  MessageCircle,
  CheckCheck,
  Lock,
  Fingerprint,
  ClipboardList,
  Smartphone,
  CheckCircle,
  Database,
} from "lucide-react";

/* ─── WhatsApp Demo — Staff fills template via WA ─── */
function WhatsAppDemo() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  type Msg = { from: "staff" | "bot"; text: string; buttons?: string[]; selected?: string; checks?: { label: string; checked: boolean }[] };

  const messages: Msg[] = [
    { from: "bot", text: "👋 New consent form!\nWhat would you like to do?", buttons: ["📝 Create Form", "📊 Check Status"], selected: "📝 Create Form" },
    { from: "bot", text: "Patient name?", },
    { from: "staff", text: "Ananya Reddy" },
    { from: "bot", text: "Age & Gender?" },
    { from: "staff", text: "34 / Female" },
    { from: "bot", text: "Select procedure:", buttons: ["Total Knee Replacement", "ACL Reconstruction", "Lap Cholecystectomy", "Rotator Cuff Repair", "More..."], selected: "Lap Cholecystectomy" },
    { from: "bot", text: "⚡ Auto-detected complications for Lap Cholecystectomy.\nSelect all that apply:", checks: [
      { label: "Bile duct injury", checked: true },
      { label: "Internal bleeding", checked: true },
      { label: "Wound infection", checked: true },
      { label: "Bowel perforation", checked: false },
      { label: "Post-op pain", checked: true },
      { label: "DVT / PE", checked: false },
    ] },
    { from: "staff", text: "✅ 4 complications selected" },
    { from: "bot", text: "Any comorbidities?\nSelect all that apply:", checks: [
      { label: "Diabetes Mellitus", checked: false },
      { label: "Hypertension", checked: true },
      { label: "COPD / Asthma", checked: false },
      { label: "Coronary Artery Disease", checked: false },
      { label: "Obesity (BMI > 30)", checked: true },
      { label: "None of the above", checked: false },
    ] },
    { from: "staff", text: "✅ 2 comorbidities selected\n(Hypertension, Obesity)" },
    { from: "bot", text: "⚠️ Auto-added complications:\n• BP fluctuations\n• Higher bleeding risk\n• Difficult airway\n• DVT risk\n\nPatient phone number?" },
    { from: "staff", text: "9900145678" },
    { from: "bot", text: "✅ Form ready!\n\n👤 Ananya Reddy, 34/F\n🏥 Lap Cholecystectomy\n⚠️ 8 complications\n📱 +91 99001 45678\n\n📤 Sending to patient..." },
    { from: "bot", text: "✅ Consent sent!\nPatient will get:\n🔗 Form link\n🎥 Video KYC\n✍️ Signature pad\n\n⏰ Expires in 48hrs" },
  ];

  useEffect(() => {
    if (!started || step >= messages.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 1400);
    return () => clearTimeout(timer);
  }, [step, started, messages.length]);

  useEffect(() => {
    const el = chatEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, [step]);

  return (
    <div className="w-full max-w-[260px] sm:max-w-xs mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/10 border border-gray-200/60">
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[13px] text-white">ConsentFlow Bot</p>
            <p className="text-[10px] text-green-200">online</p>
          </div>
        </div>

        <div className="h-[340px] overflow-y-auto p-3 space-y-2 scroll-smooth" style={{ background: "#ece5dd" }}>
          {!started && (
            <div className="h-full flex flex-col items-center justify-center">
              <button
                onClick={() => { setStarted(true); setStep(1); }}
                className="bg-[#25d366] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1da851] transition-all hover:scale-105 shadow-lg shadow-green-500/20"
              >
                ▶ Play Demo
              </button>
              <p className="text-[11px] text-gray-500 mt-2 text-center">Fill consent template via WhatsApp</p>
            </div>
          )}

          {started && messages.slice(0, step).map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "staff" ? "justify-end" : "justify-start"}`} style={{ animation: "fadeSlideUp 0.3s ease-out" }}>
              <div className={`max-w-[88%] rounded-lg shadow-sm text-[11px] leading-relaxed ${msg.from === "staff" ? "bg-[#dcf8c6] rounded-tr-none px-2.5 py-1.5" : "bg-white rounded-tl-none"}`}>
                {msg.from === "bot" && (
                  <div className="px-2.5 pt-1.5">
                    <p className="text-[9px] font-bold text-[#075e54] mb-0.5">ConsentFlow Bot</p>
                  </div>
                )}
                <div className="px-2.5 pb-1">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* WhatsApp-style button list */}
                {msg.buttons && (
                  <div className="border-t border-gray-100 mt-1">
                    {msg.buttons.map((b) => (
                      <div key={b} className={`px-2.5 py-1.5 text-[11px] border-b border-gray-50 last:border-0 ${b === msg.selected ? "text-[#075e54] font-semibold bg-teal-50/60" : "text-[#075e54]"}`}>
                        {b === msg.selected && <span className="mr-1">☑</span>}
                        {b}
                      </div>
                    ))}
                  </div>
                )}

                {/* WhatsApp-style checkboxes */}
                {msg.checks && (
                  <div className="border-t border-gray-100 mt-1 px-2.5 py-1">
                    {msg.checks.map((c) => (
                      <div key={c.label} className="flex items-center gap-1.5 py-0.5">
                        <span className={`text-[10px] ${c.checked ? "text-[#25d366]" : "text-gray-300"}`}>{c.checked ? "☑" : "☐"}</span>
                        <span className={`text-[10px] ${c.checked ? "text-gray-800" : "text-gray-400"}`}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-0.5 px-2.5 pb-1">
                  <span className="text-[9px] text-gray-500">now</span>
                  {msg.from === "staff" && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}

          {started && step > 0 && step < messages.length && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {started && step >= messages.length && (
            <div className="flex justify-center pt-1">
              <button onClick={() => { setStep(0); setStarted(false); }} className="text-[11px] text-[#075e54] bg-white/80 px-3 py-1 rounded-full hover:bg-white">
                ↻ Replay
              </button>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}

/* ─── WhatsApp Template Fill Demo ─── */
function WhatsAppTemplateFillDemo() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const messages = [
    { from: "bot" as const, text: "Hello Selvam! \ud83d\udc4b\n\nDr. Vishnu has requested your consent for:\n\ud83c\udfe5 Wound Debridement\n\nI'll ask you a few questions to fill your consent form. Ready?", delay: 0 },
    { from: "patient" as const, text: "Yes, ready", delay: 1800 },
    { from: "bot" as const, text: "Great! Let's start.\n\n1\ufe0f\u20e3 What is your full name as per Aadhaar?", delay: 2800 },
    { from: "patient" as const, text: "Selvam Murugan", delay: 4000 },
    { from: "bot" as const, text: "2\ufe0f\u20e3 Date of birth? (DD/MM/YYYY)", delay: 5000 },
    { from: "patient" as const, text: "15/03/1985", delay: 6200 },
    { from: "bot" as const, text: "3\ufe0f\u20e3 Do you have any allergies?\n(medicines, food, latex, etc.)", delay: 7200 },
    { from: "patient" as const, text: "No known allergies", delay: 8400 },
    { from: "bot" as const, text: "4\ufe0f\u20e3 Blood group?", delay: 9200 },
    { from: "patient" as const, text: "B+", delay: 10200 },
    { from: "bot" as const, text: "\u2705 All details collected!\n\n\ud83d\udcc4 Generating your consent PDF...", delay: 11200 },
    { from: "bot" as const, text: "\ud83d\udcce consent_selvam_wound_debridement.pdf\n\n\u2705 Your consent form is ready!\nPlease review and sign using the link below:\n\n\ud83d\udd17 Sign now: consent.flow/s/CF-9281\n\n\u23f0 Valid for 24 hours", delay: 12800 },
  ];

  useEffect(() => {
    if (!started || step >= messages.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), messages[step].delay ? 1400 : 1000);
    return () => clearTimeout(timer);
  }, [step, started, messages.length]);

  useEffect(() => {
    const el = chatEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, [step]);

  return (
    <div className="w-full max-w-[260px] sm:max-w-xs mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/10 border border-gray-200/60">
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[13px] text-white">ConsentFlow Bot</p>
            <p className="text-[10px] text-green-200">online</p>
          </div>
        </div>

        <div className="h-72 overflow-y-auto p-3 space-y-2 scroll-smooth" style={{ background: "#ece5dd" }}>
          {!started && (
            <div className="h-full flex flex-col items-center justify-center">
              <button
                onClick={() => { setStarted(true); setStep(1); }}
                className="bg-[#25d366] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1da851] transition-all hover:scale-105 shadow-lg shadow-green-500/20"
              >
                \u25b6 Play Demo
              </button>
              <p className="text-[11px] text-gray-500 mt-2 text-center">See template filled via WhatsApp chat</p>
            </div>
          )}

          {started && messages.slice(0, step).map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "patient" ? "justify-end" : "justify-start"}`} style={{ animation: "fadeSlideUp 0.3s ease-out" }}>
              <div className={`max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-sm text-[12px] leading-relaxed ${msg.from === "patient" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
                {msg.from === "bot" && <p className="text-[9px] font-bold text-[#075e54] mb-0.5">ConsentFlow Bot</p>}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end gap-0.5 mt-0.5">
                  <span className="text-[9px] text-gray-500">now</span>
                  {msg.from === "patient" && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}

          {started && step > 0 && step < messages.length && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {started && step >= messages.length && (
            <div className="flex justify-center pt-1">
              <button onClick={() => { setStep(0); setStarted(false); }} className="text-[11px] text-[#075e54] bg-white/80 px-3 py-1 rounded-full hover:bg-white">
                \u21bb Replay
              </button>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline Step Card ─── */
function TimelineCard({
  number,
  badge,
  heading,
  description,
  children,
}: {
  number: string;
  badge: string;
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/[0.06] p-8 min-h-[420px] flex flex-col overflow-hidden">
      {/* Watermark number */}
      <span className="absolute top-4 right-6 text-7xl font-bold text-gray-100/30 select-none leading-none">
        {number}
      </span>

      {/* Badge */}
      <div className="inline-flex self-start items-center gap-1.5 bg-teal-50 border border-teal-200/60 text-teal-700 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-5">
        {badge}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-3">{heading}</h3>
      <p className="text-sm font-light text-gray-500 leading-[1.6] mb-6">{description}</p>

      {/* Mock UI area */}
      <div className="mt-auto">{children}</div>
    </div>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Floating Pill Navbar ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-full sm:max-w-2xl px-4">
        <div className="flex items-center justify-between bg-white/85 backdrop-blur-xl border border-gray-300 rounded-full px-5 py-2.5 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900">ConsentFlow</span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">How it works</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">Features</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">Pricing</a>
          </div>

          <Link href="/login" className="bg-gray-900 text-white h-9 px-3 rounded-full text-sm font-medium flex items-center hover:bg-gray-800 transition-colors">
            <span className="hidden sm:inline">Doctor </span>Login
          </Link>
        </div>
      </nav>

      {/* ── Hero — Dark Left + WhatsApp Right ── */}
      <section className="pt-28 pb-0">
        <div className="relative">
          {/* Dark background covers left half */}
          <div className="absolute inset-0 bg-[#0c1222]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40V0h40' fill='none' stroke='white' stroke-width='.5'/%3E%3C/svg%3E\")" }} />

          <div className="relative max-w-6xl mx-auto px-6 py-20 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Left — text on dark */}
              <div className="max-w-lg mx-auto md:mx-0 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full text-sm font-medium text-teal-300 mb-8">
                  <Shield className="w-3.5 h-3.5" />
                  IT Act 2000 Compliant
                </div>

                <h1 className="text-[2.75rem] leading-[1.15] tracking-tight text-white mb-6">
                  <span className="font-normal">Digital Consent.</span>
                  <br />
                  <span className="italic font-normal text-teal-300">With Video Proof.</span>
                </h1>

                <p className="text-base font-light text-gray-400 leading-[1.6] mb-10 max-w-md">
                  Doctors create consent forms. Assistants send them via WhatsApp. Patients review, record a video KYC, and sign — all from their phone.
                </p>

                <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                  <Link href="/login" className="inline-flex items-center gap-2 bg-teal-600 text-white h-11 px-8 rounded-full font-medium text-sm hover:bg-teal-700 transition-colors">
                    Doctor Login <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/sign/cf-001" className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5">
                    Try Patient View →
                  </Link>
                </div>

                <div className="flex items-center gap-5 justify-center md:justify-start flex-wrap">
                  {["IT Act 2000", "Video KYC", "22 Languages"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Both demos stacked vertically */}
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-[9px] font-bold text-teal-300">1</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Staff sends form</span>
                  </div>
                  <WhatsAppDemo />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-[9px] font-bold text-teal-300">2</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Patient fills via WhatsApp</span>
                  </div>
                  <WhatsAppTemplateFillDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — Vertical Timeline ── */}
      <section id="how-it-works" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-20">
            <h2 className="text-[2.25rem] tracking-tight text-gray-900 leading-[1.2]">
              <span className="font-normal">How it </span>
              <span className="italic font-normal">works</span>
            </h2>
            <p className="text-gray-500 font-light mt-3 max-w-lg mx-auto">
              Four simple steps from form creation to legally signed consent.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 -translate-x-1/2 hidden md:block" />

            <div className="space-y-16 md:space-y-24">
              {/* Step 1 — Left: Doctor form with animated typing */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div>
                  <TimelineCard number="01" badge="2 MINUTES" heading="Doctor Creates Form" description="Select a procedure template. Customize risks, diagnosis, and notes for the specific patient. Save and it&apos;s ready to send.">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-[11px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded bg-teal-600 flex items-center justify-center"><FileText className="w-3 h-3 text-white" /></div>
                        <span className="font-semibold text-gray-700 text-xs">New Consent Form</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><span className="text-gray-400">Patient</span><span className="font-medium text-gray-700">Selvam M</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Procedure</span><span className="font-medium text-gray-700">Wound Debridement</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Surgeon</span><span className="font-medium text-gray-700">Dr. Vishnu Vardhan</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-400">Template</span><span className="text-teal-600 font-medium">General Surgery ✓</span></div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <div className="h-7 bg-gray-900 text-white rounded-full px-4 flex items-center text-[10px] font-medium">Send via WhatsApp</div>
                        <div className="h-7 bg-white rounded-full px-3 flex items-center text-[10px] text-gray-500 border border-gray-200">Save Draft</div>
                      </div>
                    </div>
                  </TimelineCard>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Step 2 — Right: WhatsApp message flow */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div className="hidden md:block" />
                <div>
                  <TimelineCard number="02" badge="INSTANT" heading="Assistant Sends via WhatsApp" description="The medical assistant sends patient details to the ConsentFlow bot. A secure consent link is delivered to the patient&apos;s WhatsApp instantly.">
                    <div className="bg-[#ece5dd] rounded-xl p-3 space-y-2">
                      <div className="flex justify-end">
                        <div className="bg-[#dcf8c6] rounded-lg rounded-tr-none px-2.5 py-1.5 shadow-sm max-w-[75%] text-[11px]">
                          <p>Selvam M, Wound Debridement, 9900145678</p>
                          <p className="text-[9px] text-gray-500 text-right mt-0.5">10:05 AM ✓✓</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 shadow-sm max-w-[80%] text-[11px]">
                        <p className="text-[9px] font-bold text-[#075e54] mb-0.5">ConsentFlow Bot</p>
                        <p>✅ Consent form created<br/>📤 Link sent to +91 99001 45678</p>
                        <p className="text-[9px] text-gray-500 text-right mt-0.5">10:05 AM</p>
                      </div>
                      <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 shadow-sm max-w-[80%] text-[11px]">
                        <p className="text-[9px] font-bold text-[#075e54] mb-0.5">ConsentFlow Bot</p>
                        <p>📱 Patient opened the link ✓</p>
                        <p className="text-[9px] text-gray-500 text-right mt-0.5">10:12 AM</p>
                      </div>
                    </div>
                  </TimelineCard>
                </div>
              </div>

              {/* Step 3 — Left: Video KYC with animated recording */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div>
                  <TimelineCard number="03" badge="3 SECONDS" heading="Patient Records Video KYC" description="Patient opens the link, reviews the procedure, then records a 3-second video saying they consent. Face visible, timestamped.">
                    <div className="bg-gray-900 rounded-xl overflow-hidden relative">
                      <div className="aspect-video flex items-center justify-center relative">
                        {/* Animated pulse ring */}
                        <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center" style={{ animation: "pulse-ring 2s ease-in-out infinite" }}>
                          <Video className="w-6 h-6 text-white/80" />
                        </div>
                        {/* REC badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          REC 0:03
                        </div>
                        {/* Timer bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div className="h-full bg-red-500 animate-[grow_3s_ease-in-out_infinite]" style={{ width: "60%" }} />
                        </div>
                      </div>
                      {/* Prompt */}
                      <div className="bg-black/60 px-4 py-2.5 text-center">
                        <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Say aloud:</p>
                        <p className="text-white text-[12px] font-medium">&ldquo;I, Selvam, agree to this procedure&rdquo;</p>
                      </div>
                    </div>
                  </TimelineCard>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Step 4 — Right: Completed consent */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div className="hidden md:block" />
                <div>
                  <TimelineCard number="04" badge="DONE" heading="Signed, Sealed, Stored" description="Consent form is complete with video KYC, digital signature, and witness co-sign. QR code for instant verification anytime.">
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      {/* Mini consent doc */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center"><FileText className="w-3 h-3 text-white" /></div>
                            <span className="text-xs font-semibold text-gray-700">Surgical Consent</span>
                          </div>
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">COMPLETE</span>
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span>Surgical Consent — Signed</span></div>
                          <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span>Anaesthesia Consent — Signed</span></div>
                          <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span>Video KYC — Recorded</span></div>
                          <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span>Witness — Meera Kumar (Spouse)</span></div>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between bg-white">
                        <div>
                          <p className="text-[11px] font-medium text-gray-700">Selvam M</p>
                          <p className="text-[10px] text-gray-400">CGH-2026-4521 · Apr 8, 2026</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                          <span className="text-[7px] text-gray-400 font-mono leading-none text-center">QR<br/>Code</span>
                        </div>
                      </div>
                    </div>
                  </TimelineCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[2.25rem] tracking-tight text-gray-900 leading-[1.2]">
              <span className="font-normal">Built for </span>
              <span className="italic font-normal">Indian hospitals</span>
            </h2>
            <p className="text-gray-500 font-light mt-3">Everything you need, nothing you don&apos;t.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: MessageCircle, title: "WhatsApp Delivery", desc: "Medical assistants send consent links via WhatsApp bot. No app download needed for patients." },
              { icon: Video, title: "Video KYC Consent", desc: "3-second video recording with face visible. Strongest proof of informed consent available." },
              { icon: Fingerprint, title: "Digital Signature", desc: "Draw-to-sign on any device. Patient + witness + doctor signatures on one form." },
              { icon: ClipboardList, title: "Procedure Templates", desc: "Pre-built templates for common surgeries. Doctors customize risks and benefits per patient." },
              { icon: Smartphone, title: "Multi-Language", desc: "Forms available in English, Hindi, Tamil. Patient reads in the language they understand." },
              { icon: Lock, title: "Full Audit Trail", desc: "Every view, sign, and download logged with timestamps. QR code on every form for verification." },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-black/[0.06] transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm font-light text-gray-500 leading-[1.6]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[2.25rem] tracking-tight text-gray-900 leading-[1.2]">
              <span className="font-normal">Pay per </span>
              <span className="italic font-normal">consent form</span>
            </h2>
            <p className="text-gray-500 font-light mt-3">No monthly fees. You pay only for what you use.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Essential",
                price: "\u20b9500",
                unit: "per form",
                desc: "For clinics and small hospitals",
                features: [
                  "Video KYC consent",
                  "Digital signature",
                  "WhatsApp delivery",
                  "PDF export",
                  "4-month storage of video & data",
                ],
                storage: "\u20b950/form/month after 4 months",
                cta: "Doctor Login",
                popular: false,
              },
              {
                name: "Professional",
                price: "\u20b91,000",
                unit: "per form",
                desc: "For hospitals that need the full package",
                features: [
                  "Everything in Essential",
                  "Multi-language forms",
                  "Custom templates",
                  "Witness co-signing",
                  "1-year storage of video & data",
                  "Priority support",
                ],
                storage: "\u20b925/form/month after 1 year",
                cta: "Doctor Login",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                unit: "volume pricing",
                desc: "For hospital chains",
                features: [
                  "Everything in Professional",
                  "Unlimited storage",
                  "SSO & role management",
                  "API access",
                  "Custom branding",
                  "On-premise option",
                  "Dedicated support",
                ],
                storage: "Included",
                cta: "Contact Sales",
                popular: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-7 bg-white relative ${
                  p.popular
                    ? "shadow-lg shadow-black/[0.08] border-2 border-teal-500/40"
                    : "shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-200"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
                <p className="text-sm font-light text-gray-500 mb-5">{p.desc}</p>

                <div className="mb-1">
                  <span className="text-4xl font-bold text-gray-900">{p.price}</span>
                  <span className="text-sm ml-1 text-gray-500">{p.unit}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Storage: {p.storage}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-light text-gray-600">
                      <CheckCircle className="w-4 h-4 shrink-0 text-teal-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`block text-center py-2.5 rounded-full font-medium text-sm transition-colors ${
                    p.popular
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            All plans include: Video KYC, HIPAA compliance, IT Act 2000 compliance, encrypted storage, QR verification
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-[2.25rem] tracking-tight text-gray-900 leading-[1.2] mb-4">
            <span className="font-normal">Replace paper consent </span>
            <span className="italic font-normal">today.</span>
          </h2>
          <p className="text-gray-500 font-light text-lg mb-8">
            Doctor creates. Assistant sends. Patient signs. That&apos;s it.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-gray-900 text-white h-12 px-8 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Doctor Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900">ConsentFlow</span>
          </div>
          <p className="text-sm text-gray-500">&copy; 2026 ConsentFlow. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
