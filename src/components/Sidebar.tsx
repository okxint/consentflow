"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, FileText, BarChart3, Settings, MessageCircle, ClipboardCheck, Monitor, Menu, X } from "lucide-react";
import { getCurrentDoctor, getHospital } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/whatsapp", label: "WhatsApp Bot", icon: MessageCircle },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ot-board", label: "OT Board", icon: Monitor },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const doctor = getCurrentDoctor();
  const hospital = getHospital(doctor.hospitalId);

  return (
    <>
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavClick}>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">ConsentFlow</span>
        </Link>
      </div>
      <nav className="flex-1 p-3">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "#" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-semibold">{doctor.initials}</div>
          <div>
            <p className="text-sm font-medium">{doctor.name}</p>
            <p className="text-xs text-[var(--color-muted)]">{hospital.name}</p>
            <p className="text-[10px] text-gray-400">{hospital.id}.consentflow.app</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const doctor = getCurrentDoctor();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm">ConsentFlow</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-semibold">
          {doctor.initials}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-white flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 border-r border-[var(--color-border)] bg-white flex-col min-h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}

export function MobileHeader() {
  // This is handled internally by the Sidebar component now.
  // Exported for potential standalone usage.
  return null;
}
