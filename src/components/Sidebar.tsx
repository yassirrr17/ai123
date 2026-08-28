"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOut } from "@/app/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/customers", label: "Customers", icon: "group" },
  { href: "/dashboard/automation", label: "Automation Rules", icon: "bolt" },
  { href: "/dashboard/templates", label: "Email Templates", icon: "mail" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "insights" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export function Sidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-outline-variant/60 bg-surface-container-lowest">
      <div className="flex items-center gap-2 px-6 py-5 font-bold">
        <span className="material-symbols-outlined text-primary">speed</span>
        ReviewFlow AI
      </div>
      <div className="px-6 pb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        {businessName}
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined !text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logOut} className="p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container"
        >
          <span className="material-symbols-outlined !text-lg">logout</span>
          Log out
        </button>
      </form>
    </aside>
  );
}
