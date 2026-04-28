"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState, useRef, useEffect } from "react";
import { Send, CheckCheck, Bot, Phone, ExternalLink, Copy, QrCode, Settings, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  from: "staff" | "bot" | "patient";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  isLink?: boolean;
  linkUrl?: string;
}

const DEMO_CONVERSATIONS: Message[] = [];

export default function WhatsAppBot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: "👋 Welcome to ConsentFlow Bot!\n\nI can help you send consent forms to patients via WhatsApp.\n\nSend me patient details in this format:\n\n📝 Patient Name\n🏥 Procedure\n📱 Patient Phone Number\n\nOr just type them naturally!", time: "10:00 AM" },
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("chat");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function addMessage(msg: Omit<Message, "id">) {
    setMessages(prev => [...prev, { ...msg, id: msgId.current++ }]);
  }

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    addMessage({ from: "staff", text, time: now, status: "sent" });

    // Simulate bot processing
    setIsTyping(true);

    setTimeout(() => {
      // Update sent to delivered
      setMessages(prev => prev.map(m => m.from === "staff" && m.status === "sent" ? { ...m, status: "delivered" as const } : m));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.from === "staff" && m.status === "delivered" ? { ...m, status: "read" as const } : m));
    }, 1000);

    // Parse message - try to extract name, procedure, phone
    const phoneMatch = text.match(/(\+?91[\s-]?\d{5}[\s-]?\d{5}|\d{10})/);
    const hasComma = text.includes(",");

    setTimeout(() => {
      setIsTyping(false);

      if (phoneMatch && hasComma) {
        const parts = text.split(",").map(s => s.trim());
        const name = parts[0] || "Patient";
        const procedure = parts[1] || "Surgical Procedure";
        const phone = phoneMatch[0];
        const consentId = `cf-${Date.now().toString(36)}`;
        const link = `${window.location.origin}/sign/${consentId}`;

        addMessage({
          from: "bot",
          text: `✅ Got it! Creating consent form:\n\n👤 Patient: ${name}\n🏥 Procedure: ${procedure}\n📱 Phone: ${phone}\n\n📤 Sending consent link to patient...`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });

        // Simulate sending to patient
        setTimeout(() => {
          addMessage({
            from: "bot",
            text: `✅ Consent form sent to ${phone}!\n\nThe patient will receive this message:\n\n━━━━━━━━━━━━━━━━\n🏥 *Apollo Hospitals*\n\nDear ${name},\n\nYour doctor has prepared a consent form for *${procedure}*.\n\nPlease review and sign:\n👉 ${link}\n\nThis link expires in 48 hours.\n━━━━━━━━━━━━━━━━\n\n📊 Track status in your dashboard.`,
            time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            isLink: true,
            linkUrl: "/sign/cf-002",
          });
        }, 1500);

        // Simulate patient response
        setTimeout(() => {
          addMessage({
            from: "bot",
            text: `📱 Update: ${name} opened the consent link.\nStatus: 👁️ Viewing form...`,
            time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          });
        }, 5000);

      } else if (text.toLowerCase().includes("status") || text.toLowerCase().includes("pending")) {
        addMessage({
          from: "bot",
          text: `📊 *Pending Consents:*\n\n1. Ananya Reddy — Lap. Cholecystectomy\n   ⏳ Sent 2 hours ago, not yet opened\n   📱 +91 99001 45678\n\n2. Mohammed Farhan — Cardiac Cath.\n   ✍️ Patient signed, waiting for witness\n   📱 +91 98765 43210\n\nReply with a number to send a reminder.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      } else if (text === "1" || text === "2") {
        addMessage({
          from: "bot",
          text: `🔔 Reminder sent! The patient will receive a follow-up message.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      } else if (text.toLowerCase().includes("help")) {
        addMessage({
          from: "bot",
          text: `📖 *ConsentFlow Bot Commands:*\n\n1️⃣ Send consent: Type patient details\n   Format: Name, Procedure, Phone\n   Example: Rajesh Kumar, Knee Replacement, 9841233456\n\n2️⃣ Check status: Type "status" or "pending"\n\n3️⃣ Send reminder: Type patient number after status\n\n4️⃣ Quick send: Forward a patient contact card`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      } else {
        addMessage({
          from: "bot",
          text: `I couldn't parse that. Please send in this format:\n\n*Name, Procedure, Phone*\n\nExample:\nAnanya Reddy, Laparoscopic Cholecystectomy, 9900145678\n\nOr type "help" for all commands.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      }
    }, 1500);
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col pt-14 md:pt-0">
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">WhatsApp Bot</h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">Send consent forms to patients via WhatsApp</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-success)] bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
                Bot Online
              </span>
            </div>
          </div>

          <div className="flex gap-1 border-b border-[var(--color-border)]">
            <button onClick={() => setActiveTab("chat")} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "chat" ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-text-secondary)]"}`}>
              <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Live Chat</span>
            </button>
            <button onClick={() => setActiveTab("settings")} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "settings" ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-text-secondary)]"}`}>
              <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Setup</span>
            </button>
          </div>
        </div>

        {activeTab === "chat" && (
          <div className="flex-1 flex overflow-hidden p-8 pt-6 gap-6">
            {/* Chat window */}
            <div className="flex-1 flex flex-col bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-3 bg-[#075e54]">
                <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">ConsentFlow Bot</p>
                  <p className="text-xs text-green-200">online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='a' patternUnits='userSpaceOnUse' width='60' height='60'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23f0f0f0' stroke-width='.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23e5ddd5' /%3E%3Crect width='100%25' height='100%25' fill='url(%23a)' /%3E%3C/svg%3E\")" }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === "staff" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                      msg.from === "staff"
                        ? "bg-[#dcf8c6] rounded-tr-none"
                        : msg.from === "patient"
                        ? "bg-white rounded-tl-none"
                        : "bg-white rounded-tl-none"
                    }`}>
                      {msg.from === "bot" && (
                        <p className="text-[10px] font-semibold text-[var(--color-primary)] mb-0.5">ConsentFlow Bot</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      {msg.isLink && msg.linkUrl && (
                        <a href={msg.linkUrl} target="_blank" className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--color-primary)] bg-blue-50 px-2 py-1 rounded hover:underline">
                          <ExternalLink className="w-3 h-3" /> Open Patient Link
                        </a>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">{msg.time}</span>
                        {msg.from === "staff" && msg.status && (
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.status === "read" ? "text-blue-500" : "text-gray-400"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-2 border-t border-[var(--color-border)] bg-[#f0f0f0] flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Type patient details: Name, Procedure, Phone"
                  className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white border-none focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-[#075e54] text-white rounded-full flex items-center justify-center hover:bg-[#064e46] disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick actions sidebar */}
            <div className="w-72 space-y-4">
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3">Quick Send</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">Try sending a consent form. Paste this into the chat:</p>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 text-sm">
                  <p className="font-mono text-xs">Ananya Reddy, Laparoscopic Cholecystectomy, 9900145678</p>
                </div>
                <button
                  onClick={() => setInput("Ananya Reddy, Laparoscopic Cholecystectomy, 9900145678")}
                  className="w-full mt-2 flex items-center justify-center gap-2 text-xs font-medium text-[var(--color-primary)] bg-blue-50 py-2 rounded-lg hover:bg-blue-100"
                >
                  <Copy className="w-3 h-3" /> Paste to Chat
                </button>
              </div>

              <div className="bg-white border border-[var(--color-border)] rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3">Other Commands</h3>
                <div className="space-y-2">
                  {[
                    { cmd: "status", desc: "View pending consents" },
                    { cmd: "help", desc: "See all commands" },
                  ].map(c => (
                    <button
                      key={c.cmd}
                      onClick={() => { setInput(c.cmd); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 border border-[var(--color-border)] transition-colors"
                    >
                      <p className="text-sm font-medium">{c.cmd}</p>
                      <p className="text-xs text-[var(--color-muted)]">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[var(--color-border)] rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Bot Stats (Today)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">Forms Sent</span><span className="font-medium">--</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">Opened</span><span className="font-medium">--</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">Signed</span><span className="font-medium">--</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">Avg. Time to Sign</span><span className="font-medium">--</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex-1 overflow-auto p-8 pt-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white border border-[var(--color-border)] rounded-t-lg overflow-hidden">
                {/* Header — template style */}
                <div className="bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-7 h-7" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold tracking-wide">WHATSAPP BOT CONFIGURATION</h1>
                      <p className="text-green-100 text-sm">ConsentFlow &mdash; WhatsApp Business Integration</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-8">
                  {/* Section 1: Business API */}
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">WhatsApp Business API</h2>
                    <div className="space-y-4 text-sm leading-relaxed text-gray-800">
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span>WhatsApp Business Phone:</span>
                        <input className="border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors w-48" defaultValue="+91 44 2829 3333" />
                        <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 ml-1">VERIFIED</span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-1">
                        <span>API Provider:</span>
                        <select className="border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors">
                          <option>Twilio</option>
                          <option>Gupshup</option>
                          <option>Wati</option>
                          <option>Meta Cloud API (Direct)</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-1">
                        <span>API Key:</span>
                        <input type="password" className="border-b border-gray-400 bg-transparent outline-none px-1 py-0.5 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] transition-colors w-64" defaultValue="sk-xxxxxxxxxxxx" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Consent Form Message Template */}
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">Consent Form Message</h2>
                    <div className="bg-[#ece5dd] rounded-xl p-4 space-y-3">
                      <div className="bg-white rounded-lg rounded-tl-none px-3 py-2.5 shadow-sm max-w-[90%]">
                        <p className="text-[9px] font-bold text-[#075e54] mb-1">ConsentFlow Bot</p>
                        <div className="text-sm leading-relaxed space-y-2">
                          <p>🏥 <strong><input className="border-b border-gray-300 bg-transparent outline-none px-0.5 font-bold text-sm text-gray-900 focus:border-[var(--color-primary)] transition-colors w-40" defaultValue="City General Hospital" /></strong></p>
                          <p>Dear <input className="border-b border-gray-300 bg-transparent outline-none px-0.5 text-sm text-gray-900 focus:border-[var(--color-primary)] transition-colors w-28 italic" defaultValue="{{patient_name}}" />,</p>
                          <p>Your doctor has prepared a consent form for <strong><input className="border-b border-gray-300 bg-transparent outline-none px-0.5 font-bold text-sm text-gray-900 focus:border-[var(--color-primary)] transition-colors w-36 italic" defaultValue="{{procedure_name}}" /></strong>.</p>
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <p>Surgeon: <input className="border-b border-gray-300 bg-transparent outline-none px-0.5 text-xs text-gray-900 focus:border-[var(--color-primary)] transition-colors w-28 italic" defaultValue="{{surgeon_name}}" /></p>
                            <p>Scheduled: <input className="border-b border-gray-300 bg-transparent outline-none px-0.5 text-xs text-gray-900 focus:border-[var(--color-primary)] transition-colors w-28 italic" defaultValue="{{scheduled_date}}" /></p>
                          </div>
                          <p>Please review and sign here:</p>
                          <p className="text-[var(--color-primary)]">👉 <span className="italic text-xs">{"{{consent_link}}"}</span></p>
                          <p className="text-xs text-gray-500">⏰ This link expires in <input className="border-b border-gray-300 bg-transparent outline-none px-0.5 text-xs text-gray-900 focus:border-[var(--color-primary)] transition-colors w-10 text-center" defaultValue="48" /> hours.</p>
                          <p className="text-xs text-gray-500">Questions? Call us at <input className="border-b border-gray-300 bg-transparent outline-none px-0.5 text-xs text-gray-900 focus:border-[var(--color-primary)] transition-colors w-32 italic" defaultValue="{{hospital_phone}}" /></p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">Edit fields directly above. Variables like {"{{patient_name}}"} are filled automatically.</p>
                  </div>

                  {/* Section 3: Reminder Message Template */}
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">Reminder Message</h2>
                    <div className="bg-[#ece5dd] rounded-xl p-4 space-y-3">
                      <div className="bg-white rounded-lg rounded-tl-none px-3 py-2.5 shadow-sm max-w-[90%]">
                        <p className="text-[9px] font-bold text-[#075e54] mb-1">ConsentFlow Bot</p>
                        <div className="text-sm leading-relaxed space-y-2">
                          <p>🔔 Reminder: Your consent form for <strong><input className="border-b border-gray-300 bg-transparent outline-none px-0.5 font-bold text-sm text-gray-900 focus:border-[var(--color-primary)] transition-colors w-36 italic" defaultValue="{{procedure_name}}" /></strong> is still pending.</p>
                          <p>Please sign before your procedure on <input className="border-b border-gray-300 bg-transparent outline-none px-0.5 text-sm text-gray-900 focus:border-[var(--color-primary)] transition-colors w-28 italic" defaultValue="{{scheduled_date}}" />:</p>
                          <p className="text-[var(--color-primary)]">👉 <span className="italic text-xs">{"{{consent_link}}"}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Auto-Reminders */}
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">Auto-Reminders</h2>
                    <div className="space-y-3">
                      {[
                        { label: "Send reminder if not signed after 4 hours", defaultChecked: true },
                        { label: "Send 2nd reminder after 24 hours", defaultChecked: true },
                        { label: "Notify doctor if not signed after 48 hours", defaultChecked: true },
                        { label: "Send day-before-procedure reminder", defaultChecked: false },
                      ].map(r => (
                        <label key={r.label} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked={r.defaultChecked} className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)]" />
                          <span className="text-sm text-gray-700">{r.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: QR Code */}
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">QR Code for Staff</h2>
                    <div className="flex items-center gap-6">
                      <div className="w-28 h-28 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                        <QrCode className="w-16 h-16 text-gray-300" />
                      </div>
                      <div className="text-sm text-gray-600 space-y-1.5">
                        <p>1. Open WhatsApp on your phone</p>
                        <p>2. Scan this QR code</p>
                        <p>3. Start sending consent forms!</p>
                        <p className="text-[var(--color-primary)] font-medium flex items-center gap-1 mt-2">
                          <Phone className="w-3.5 h-3.5" /> Or message +91 44 2829 3333
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons — template style */}
              <div className="flex gap-3 mt-6">
                <button className="flex-1 border border-[var(--color-border)] text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Reset to Default
                </button>
                <button className="flex-1 bg-[var(--color-primary)] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
