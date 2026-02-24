"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatDetailPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;
  const [text, setText] = useState("");
  const qc = useQueryClient();

  const messagesQ = useQuery({
    queryKey: ["messages", matchId],
    queryFn: async () => (await api.get(`/conversations/${matchId}/messages`)).data,
    refetchInterval: 4000
  });

  const send = useMutation({
    mutationFn: async () => (await api.post(`/conversations/${matchId}/messages`, { text })).data,
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["messages", matchId] });
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Chat del match {matchId}</h2>
      <div className="space-y-2 rounded border p-4">
        {messagesQ.data?.length ? (
          messagesQ.data.map((msg: { id: string; text: string; sentAt: string }) => (
            <div key={msg.id} className="rounded bg-muted p-2 text-sm">
              <p>{msg.text}</p>
              <p className="text-xs text-muted-foreground">{new Date(msg.sentAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">Sin mensajes aún.</p>
        )}
      </div>
      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un mensaje" />
        <Button onClick={() => send.mutate()} disabled={!text.trim() || send.isPending}>Enviar</Button>
      </div>
    </div>
  );
}
