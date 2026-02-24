"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { AppShell } from "@/components/app-shell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthenticated } = useRequireAuth();

  if (!hydrated) return <div className="p-8">Cargando sesión...</div>;
  if (!isAuthenticated) return null;

  return <AppShell>{children}</AppShell>;
}
