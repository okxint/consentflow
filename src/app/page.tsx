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

/* ─── WhatsApp Demo ─── */
function WhatsAppDemo() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const messages = [
    { from: "staff" as const, text: "ID: APL-4521\nAnanya Reddy\nLap Cholecystectomy\n9900145678", delay: 0 },
    { from: "bot" as const, text: "\u2705 Found patient APL-4521\n\nForm created from Lap Surgery template\n\ud83d\udce4 Sending to +91 99001 45678...", delay: 1400 },
    { from: "bot" as const, text: "\u2705 Consent link delivered\n\nPatient will receive:\n\ud83d\udd17 Secure consent form\n\ud83d\udccb Procedure details\n\ud83c\udfa5 Video KYC prompt\n\u270d\ufe0f Signature pad", delay: 2600 },
    { from: "bot" as const, text: "\ud83d\udd14 Update:\n\ud83d\udc41\ufe0f Ananya opened the link\n\u2705 Reviewed procedure\n\ud83c\udfa5 Video KYC recorded\n\u270d\ufe0f Signed\n\n\u2705 Consent #APL-4521 complete", delay: 4000 },
  ];

  useEffect(() => {
    if (!started || step >= messages.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), messages[step].delay || 1000);
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
              <p className="text-[11px] text-gray-500 mt-2">See the assistant send a consent form</p>
            </div>
          )}

          {started && messages.slice(0, step).map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "staff" ? "justify-end" : "justify-start"}`} style={{ animation: "fadeSlideUp 0.3s ease-out" }}>
              <div className={`max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-sm text-[12px] leading-relaxed ${msg.from === "staff" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
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
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
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
            Doctor Login
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gray-50/50 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div className="max-w-lg">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3.5 py-1.5 rounded-full text-sm font-medium text-gray-700 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                IT Act 2000 Compliant
              </div>

              <h1 className="text-[2.75rem] leading-[1.15] tracking-tight text-gray-900 mb-6">
                <span className="font-normal">Digital Consent.</span>
                <br />
                <span className="italic font-normal">With Video Proof.</span>
              </h1>

              <p className="text-base font-light text-gray-500 leading-[1.6] mb-10 max-w-md">
                Doctors create consent forms. Assistants send them via WhatsApp. Patients review, record a video KYC, and sign — all from their phone.
              </p>

              <Link href="/login" className="inline-flex items-center gap-2 bg-gray-900 text-white h-11 px-8 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors">
                Doctor Login <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Checkmarks row */}
              <div className="flex items-center gap-5 mt-6">
                {["IT Act 2000", "Video KYC", "22 Languages"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — WhatsApp demo */}
            <div className="flex justify-center">
              <WhatsAppDemo />
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
              {/* Step 1 — Left */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div>
                  <TimelineCard
                    number="01"
                    badge="2 MINUTES"
                    heading="Doctor Creates Form"
                    description="Select a procedure template. Customize risks, diagnosis, and notes for the specific patient. Save and it's ready to send."
                  >
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-500" />
                          <div className="h-2.5 bg-gray-200 rounded w-28" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                          <div className="h-2.5 bg-gray-200 rounded w-36" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                          <div className="h-2.5 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <div className="h-7 bg-gray-900 rounded-full w-20" />
                          <div className="h-7 bg-gray-100 rounded-full w-16 border border-gray-200" />
                        </div>
                      </div>
                    </div>
                  </TimelineCard>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Step 2 — Right */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div className="hidden md:block" />
                <div>
                  <TimelineCard
                    number="02"
                    badge="INSTANT"
                    heading="Assistant Sends via WhatsApp"
                    description="The medical assistant sends the patient's details to the ConsentFlow bot. A secure consent link is delivered to the patient's WhatsApp instantly."
                  >
                    <div className="bg-[#ece5dd] rounded-xl p-3 border border-gray-200/60">
                      <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-[80%] text-[11px] leading-relaxed">
                        <p className="text-[9px] font-bold text-[#075e54] mb-0.5">ConsentFlow Bot</p>
                        <p className="text-gray-700">Consent link sent to<br />+91 99001 45678</p>
                      </div>
                    </div>
                  </TimelineCard>
                </div>
              </div>

              {/* Step 3 — Left */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div>
                  <TimelineCard
                    number="03"
                    badge="3 SECONDS"
                    heading="Patient Records Video KYC"
                    description="Patient opens the link, reviews the procedure details, then records a 3-second video saying they consent. Face visible, timestamped, stored securely."
                  >
                    <div className="bg-gray-900 rounded-xl p-4 aspect-video flex items-center justify-center relative overflow-hidden">
                      <div className="w-12 h-12 border-2 border-white/50 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-white/70" />
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-semibold">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        REC
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/70">
                        &ldquo;I agree to this procedure&rdquo;
                      </div>
                    </div>
                  </TimelineCard>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Step 4 — Right */}
              <div className="md:grid md:grid-cols-2 md:gap-16 relative">
                <div className="absolute left-1/2 top-8 w-3 h-3 rounded-full bg-teal-500 -translate-x-1/2 border-2 border-white shadow-md hidden md:block z-10" />
                <div className="hidden md:block" />
                <div>
                  <TimelineCard
                    number="04"
                    badge="DONE"
                    heading="Signed, Sealed, Stored"
                    description="The consent form is complete with video KYC, digital signature, and witness co-sign. A QR code is generated for instant verification anytime."
                  >
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Consent Complete
                        </div>
                        <div className="h-2 bg-gray-200 rounded w-full" />
                        <div className="h-2 bg-gray-200 rounded w-3/4" />
                        <p className="text-[10px] text-gray-400 italic mt-1">Ananya Reddy</p>
                      </div>
                      <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-[8px] text-gray-400 font-mono">QR</span>
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

          <div className="grid md:grid-cols-3 gap-6">
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
                  <span className="text-sm ml-1 text-gray-400">{p.unit}</span>
                </div>
                <p className="text-xs text-gray-400 mb-6 flex items-center gap-1">
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

          <p className="text-center text-xs text-gray-400 mt-8">
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
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900">ConsentFlow</span>
          </div>
          <p className="text-sm text-gray-400">&copy; 2026 ConsentFlow. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
