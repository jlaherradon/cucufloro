"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const spotQ = useQuery({ queryKey: ["my-spot"], queryFn: async () => (await api.get("/spots/mine")).data, retry: false });
  const prefQ = useQuery({ queryKey: ["preferences"], queryFn: async () => (await api.get("/preferences")).data, retry: false });
  const matchesQ = useQuery({ queryKey: ["matches"], queryFn: async () => (await api.get("/matches")).data });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Mi plaza</CardTitle></CardHeader>
        <CardContent>{spotQ.isLoading ? "Cargando..." : spotQ.data ? "Configurada" : "Sin configurar"}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Preferencias</CardTitle></CardHeader>
        <CardContent>{prefQ.isLoading ? "Cargando..." : prefQ.data ? "Configuradas" : "Sin configurar"}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Matches</CardTitle></CardHeader>
        <CardContent>{matchesQ.isLoading ? "Cargando..." : `${matchesQ.data?.length ?? 0} activos`}</CardContent>
      </Card>
    </div>
  );
}
