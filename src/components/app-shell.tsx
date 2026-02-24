"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  ["/dashboard", "Dashboard"],
  ["/spot", "Mi plaza"],
  ["/preferences", "Preferencias"],
  ["/matches", "Matches"],
  ["/chat", "Chat"]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-r bg-muted/40 p-4">
        <h1 className="mb-4 text-lg font-bold">Parking Swap</h1>
        <nav className="space-y-1">
          {items.map(([href, label]) => (
            <Link key={href} href={href} className={cn("block rounded p-2 text-sm", pathname.startsWith(href) && "bg-primary text-white")}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main>
        <header className="flex items-center justify-end border-b p-4">
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
