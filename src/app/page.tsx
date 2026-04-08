"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FileText, Shield, Smartphone, CheckCircle, ArrowRight, Video, MessageCircle, CheckCheck, Lock, Fingerprint, ClipboardList, Send, Receipt, Database, Users } from "lucide-react";

function WhatsAppDemo() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const messages = [
    { from: "staff" as const, text: "ID: APL-4521\nAnanya Reddy\nLap Cholecystectomy\n9900145678", delay: 0 },
    { from: "bot" as const, text: "✅ Found patient APL-4521\n\nForm created from Lap Surgery template\n📤 Sending to +91 99001 45678...", delay: 1400 },
    { from: "bot" as const, text: "✅ Consent link delivered\n\nPatient will receive:\n🔗 Secure consent form\n📋 Procedure details\n🎥 Video KYC prompt\n✍️ Signature pad", delay: 2600 },
    { from: "bot" as const, text: "🔔 Update:\n👁️ Ananya opened the link\n✅ Reviewed procedure\n🎥 Video KYC recorded\n✍️ Signed\n\n✅ Consent #APL-4521 complete", delay: 4000 },
  ];

  useEffect(() => {
    if (!started || step >= messages.length) return;
    const timer = setTimeout(() => setStep(s => s + 1), messages[step].delay || 1000);
    return () => clearTimeout(timer);
  }, [step, started, messages.length]);

  useEffect(() => {
    const el = chatEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, [step]);

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-200">
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
                ▶ Play Demo
              </button>
              <p className="text-[11px] text-gray-500 mt-2">See the assistant send a consent form</p>
            </div>
          )}

          {started && messages.slice(0, step).map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "staff" ? "justify-end" : "justify-start"}`} style={{ animation: "fadeSlideUp 0.3s ease-out" }}>
              <div className={`max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-sm text-[12px] leading-relaxed ${
                msg.from === "staff" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"
              }`}>
                {msg.from === "bot" && <p className="text-[9px] font-bold text-[#075e54] mb-0.5">ConsentFlow Bot</p>}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end gap-0.5 mt-0.5">
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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-[var(--color-dark)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">ConsentFlow</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</a>
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              Doctor Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — dark */}
      <section className="bg-[var(--color-dark)] pt-20 pb-28 relative overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40V0h40' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] px-3 py-1.5 rounded-full text-sm font-medium mb-8">
                <Shield className="w-3.5 h-3.5" />
                IT Act 2000 Compliant
              </div>
              <h1 className="text-[3.2rem] font-bold leading-[1.1] tracking-tight text-white mb-6">
                Digital consent<br />
                with video proof.
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Doctors create consent forms. Medical assistants send them to patients via WhatsApp. Patients review, record a video KYC, and sign — all from their phone.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/login" className="bg-[var(--color-primary)] text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-[var(--color-primary-hover)] transition-all flex items-center gap-2">
                  Doctor Login <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/sign/cf-002" className="text-gray-400 hover:text-white px-4 py-3.5 font-medium transition-colors flex items-center gap-2 text-sm">
                  Try patient view →
                </Link>
              </div>
            </div>

            {/* WhatsApp demo on right */}
            <div className="flex justify-center">
              <WhatsAppDemo />
            </div>
          </div>
        </div>
      </section>

      {/* How it works — the real flow */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl font-bold">Three roles. One flow. Zero paper.</h2>
          </div>

          <div className="grid grid-cols-3 gap-0 relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-[16.7%] right-[16.7%] h-px bg-[var(--color-border)]" />

            {[
              {
                role: "Doctor",
                icon: ClipboardList,
                color: "bg-teal-50 text-[var(--color-primary)] border-teal-200",
                steps: [
                  "Logs into ConsentFlow",
                  "Picks a procedure template",
                  "Fills in patient-specific details — risks, diagnosis, surgeon notes",
                  "Saves the consent form",
                ],
              },
              {
                role: "Medical Assistant",
                icon: Send,
                color: "bg-orange-50 text-[var(--color-accent)] border-orange-200",
                steps: [
                  "Opens WhatsApp bot (or dashboard)",
                  "Sends: Patient ID, Name, Procedure, WhatsApp number",
                  "Bot generates a secure consent link",
                  "Link delivered to patient's WhatsApp instantly",
                ],
              },
              {
                role: "Patient",
                icon: Fingerprint,
                color: "bg-purple-50 text-purple-600 border-purple-200",
                steps: [
                  "Receives WhatsApp link on their phone",
                  "Reviews procedure, risks, and alternatives",
                  "Records 3-sec video: \"I agree to this procedure\"",
                  "Draws digital signature + witness co-signs",
                ],
              },
            ].map((block, i) => (
              <div key={block.role} className="text-center px-8">
                <div className={`w-24 h-24 rounded-2xl border-2 ${block.color} flex items-center justify-center mx-auto mb-5 relative bg-white`}>
                  <block.icon className="w-10 h-10" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-dark)] text-white rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-bold text-lg mb-4">{block.role}</h3>
                <ul className="text-left space-y-2.5">
                  {block.steps.map((s, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video KYC + Signature — side by side */}
      <section className="bg-[var(--color-card)] border-y border-[var(--color-border)] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">What makes it different</p>
            <h2 className="text-3xl font-bold">Not just a signature. Video proof of consent.</h2>
            <p className="text-[var(--color-text-secondary)] mt-3 max-w-2xl mx-auto">Patients record a short video saying they agree — with their face visible. Combined with a digital signature, this gives hospitals irrefutable proof that holds up legally.</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Video KYC card */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="bg-[var(--color-dark)] p-6">
                <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white">
                    <div className="w-14 h-14 border-3 border-white/60 rounded-full flex items-center justify-center mx-auto mb-2" style={{ animation: "pulse-ring 2s ease-in-out infinite" }}>
                      <Video className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    REC 0:03
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-xs text-center">&ldquo;I, Ananya Reddy, agree to this procedure&rdquo;</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Video KYC</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Patient records a 3-second video with their face visible, stating consent aloud. Timestamped and stored with the form.</p>
              </div>
            </div>

            {/* Signature card */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="bg-[var(--color-dark)] p-6">
                <div className="aspect-video bg-white rounded-xl flex flex-col items-center justify-center relative border-2 border-dashed border-gray-300">
                  <p className="text-2xl font-serif italic text-gray-400 mb-2">Ananya Reddy</p>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] text-gray-400">
                    <span>Patient Signature</span>
                    <span>7 Apr 2026, 2:30 PM</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Digital Signature</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Touch-friendly signature pad works on any device. Witness co-signs on the same screen. Legally valid under IT Act 2000.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl font-bold">Built for Indian hospitals</h2>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              { icon: MessageCircle, title: "WhatsApp Delivery", desc: "Medical assistants send consent links via WhatsApp bot. No app download needed for patients.", color: "bg-green-50 text-green-700" },
              { icon: Video, title: "Video KYC Consent", desc: "3-second video recording with face visible. Strongest proof of informed consent available.", color: "bg-red-50 text-red-700" },
              { icon: Fingerprint, title: "Digital Signature", desc: "Draw-to-sign on any device. Patient + witness + doctor signatures on one form.", color: "bg-purple-50 text-purple-700" },
              { icon: ClipboardList, title: "Procedure Templates", desc: "Pre-built templates for common surgeries. Doctors customize risks and benefits per patient.", color: "bg-teal-50 text-teal-700" },
              { icon: Smartphone, title: "Multi-Language", desc: "Forms available in English, Hindi, Tamil. Patient reads in the language they understand.", color: "bg-blue-50 text-blue-700" },
              { icon: Lock, title: "Full Audit Trail", desc: "Every view, sign, and download logged with timestamps. QR code on every form for verification.", color: "bg-amber-50 text-amber-700" },
            ].map(f => (
              <div key={f.title} className="border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary)]/30 transition-colors group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — per form */}
      <section id="pricing" className="bg-[var(--color-dark)] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl font-bold text-white">Pay per consent form</h2>
            <p className="text-gray-400 mt-3">No monthly fees. You pay only for what you use.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "Essential",
                price: "₹500",
                unit: "per form",
                desc: "For clinics and small hospitals",
                features: [
                  "Video KYC consent",
                  "Digital signature",
                  "WhatsApp delivery",
                  "PDF export",
                  "4-month storage of video & data",
                ],
                storage: "₹50/form/month after 4 months",
                cta: "Doctor Login",
                primary: false,
              },
              {
                name: "Professional",
                price: "₹1,000",
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
                storage: "₹25/form/month after 1 year",
                cta: "Doctor Login",
                primary: true,
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
                primary: false,
              },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-7 ${p.primary ? "bg-white ring-2 ring-[var(--color-primary)] relative" : "bg-[var(--color-dark-card)] border border-gray-700/50"}`}>
                {p.primary && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">Recommended</div>}
                <h3 className={`font-bold text-lg ${p.primary ? "text-[var(--color-text)]" : "text-white"}`}>{p.name}</h3>
                <p className={`text-sm mb-5 ${p.primary ? "text-[var(--color-muted)]" : "text-gray-400"}`}>{p.desc}</p>
                <div className="mb-1">
                  <span className={`text-4xl font-bold ${p.primary ? "text-[var(--color-text)]" : "text-white"}`}>{p.price}</span>
                  <span className={`text-sm ml-1 ${p.primary ? "text-[var(--color-muted)]" : "text-gray-400"}`}>{p.unit}</span>
                </div>
                <p className={`text-xs mb-6 ${p.primary ? "text-[var(--color-muted)]" : "text-gray-500"}`}>
                  <Database className="w-3 h-3 inline mr-1" />
                  Storage: {p.storage}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.primary ? "text-[var(--color-text-secondary)]" : "text-gray-300"}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 ${p.primary ? "text-[var(--color-primary)]" : "text-[var(--color-primary)]"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className={`block text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  p.primary
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                    : "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include: Video KYC, HIPAA compliance, IT Act 2000 compliance, encrypted storage, QR verification
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 border-t border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Replace paper consent today.</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 text-lg">Doctor creates. Assistant sends. Patient signs. That&apos;s it.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-lg hover:shadow-teal-500/20">
            Doctor Login <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-dark)] py-10 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-white">ConsentFlow</span>
          </div>
          <p className="text-sm text-gray-500">&copy; 2026 ConsentFlow. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
