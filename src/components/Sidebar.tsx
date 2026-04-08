"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePlus, FileText, Users, BarChart3, Settings, MessageCircle, Siren, ClipboardCheck, Layers, Monitor } from "lucide-react";
import { getCurrentDoctor, getHospital } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms/new", label: "New Form", icon: FilePlus },
  { href: "/forms/bulk", label: "Bulk Create", icon: Layers },
  { href: "/whatsapp", label: "WhatsApp Bot", icon: MessageCircle },
  { href: "/emergency", label: "Emergency", icon: Siren },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ot-board", label: "OT Board", icon: Monitor },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const doctor = getCurrentDoctor();
  const hospital = getHospital(doctor.hospitalId);

  return (
    <aside className="w-60 border-r border-[var(--color-border)] bg-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
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
            <p className="text-xs text-[var(--color-muted)]">{hospital.name.length > 20 ? "MGMCRI" : hospital.name}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
