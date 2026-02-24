"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DynamicMapPicker } from "@/components/map-picker-dynamic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  homeLat: z.number(),
  homeLon: z.number(),
  radiusMeters: z.coerce.number().min(100)
});

type FormType = z.infer<typeof schema>;

export default function PreferencesPage() {
  const { register, watch, setValue, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { homeLat: 40.4168, homeLon: -3.7038, radiusMeters: 1500 }
  });

  const query = useQuery({ queryKey: ["preferences"], queryFn: async () => (await api.get("/preferences")).data, retry: false });
  useEffect(() => {
    if (query.data) reset(query.data);
  }, [query.data, reset]);

  const mutation = useMutation({ mutationFn: async (values: FormType) => (await api.put("/preferences", values)).data });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <div className="max-w-sm">
        <Label>Radio (metros)</Label>
        <Input type="number" {...register("radiusMeters")} />
      </div>
      <DynamicMapPicker
        lat={watch("homeLat")}
        lon={watch("homeLon")}
        radius={watch("radiusMeters")}
        onChange={(lat, lon) => {
          setValue("homeLat", lat);
          setValue("homeLon", lon);
        }}
      />
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Guardando..." : "Guardar preferencias"}</Button>
    </form>
  );
}
