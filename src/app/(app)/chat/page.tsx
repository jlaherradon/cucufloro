"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function ChatIndexPage() {
  const matchesQ = useQuery({ queryKey: ["matches"], queryFn: async () => (await api.get("/matches")).data });

  if (matchesQ.isLoading) return <p>Cargando chats...</p>;

  return (
    <div className="space-y-2">
      {matchesQ.data?.length ? (
        matchesQ.data.map((m: { id: string; partnerName?: string }) => (
          <Link key={m.id} href={`/chat/${m.id}`} className="block rounded border p-3 hover:bg-accent">
            Chat con {m.partnerName || `match ${m.id}`}
          </Link>
        ))
      ) : (
        <p className="text-muted-foreground">No hay chats disponibles todavía.</p>
      )}
    </div>
  );
}
