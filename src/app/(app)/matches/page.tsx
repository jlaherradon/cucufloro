"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MatchesPage() {
  const qc = useQueryClient();
  const matchesQ = useQuery({ queryKey: ["matches"], queryFn: async () => (await api.get("/matches")).data });

  const act = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "accept" | "decline" }) =>
      (await api.post(`/matches/${id}/${action}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matches"] })
  });

  const recompute = useMutation({
    mutationFn: async () => (await api.post("/matches/recompute")).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matches"] })
  });

  if (matchesQ.isLoading) return <p>Cargando matches...</p>;

  return (
    <div className="space-y-4">
      <Button onClick={() => recompute.mutate()} disabled={recompute.isPending}>Recalcular matches</Button>
      {!matchesQ.data?.length ? (
        <p className="text-muted-foreground">No hay matches disponibles.</p>
      ) : (
        matchesQ.data.map((m: { id: string; status: string; score: number }) => (
          <Card key={m.id}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="font-semibold">Match #{m.id}</p>
                <p className="text-sm text-muted-foreground">Estado: {m.status} · Score: {m.score.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => act.mutate({ id: m.id, action: "accept" })}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => act.mutate({ id: m.id, action: "decline" })}>Decline</Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
