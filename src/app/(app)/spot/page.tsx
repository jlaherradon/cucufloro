"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DynamicMapPicker } from "@/components/map-picker-dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const featureList = ["COVERED", "SECURITY", "ELECTRIC", "LARGE"] as const;
const schema = z.object({
  addressText: z.string().min(3),
  floor: z.string().optional(),
  width: z.coerce.number().positive(),
  length: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  active: z.boolean().default(true),
  features: z.array(z.string()),
  lat: z.number(),
  lon: z.number()
});

type FormType = z.infer<typeof schema>;

export default function SpotPage() {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { active: true, features: [], lat: 40.4168, lon: -3.7038 }
  });

  const mineQ = useQuery({ queryKey: ["my-spot"], queryFn: async () => (await api.get("/spots/mine")).data, retry: false });
  useEffect(() => {
    if (mineQ.data) reset(mineQ.data);
  }, [mineQ.data, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormType) => {
      if (mineQ.data?.id) return (await api.put(`/spots/${mineQ.data.id}`, values)).data;
      return (await api.post("/spots", values)).data;
    }
  });

  const lat = watch("lat");
  const lon = watch("lon");
  const selectedFeatures = watch("features");

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Dirección</Label><Input {...register("addressText")} /></div>
        <div><Label>Piso</Label><Input {...register("floor")} /></div>
        <div><Label>Ancho</Label><Input type="number" step="0.01" {...register("width")} /></div>
        <div><Label>Largo</Label><Input type="number" step="0.01" {...register("length")} /></div>
        <div><Label>Alto</Label><Input type="number" step="0.01" {...register("height")} /></div>
      </div>
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-4">
          {featureList.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={(checked) => {
                  setValue(
                    "features",
                    checked ? [...selectedFeatures, feature] : selectedFeatures.filter((f) => f !== feature)
                  );
                }}
              />
              {feature}
            </label>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={watch("active")} onCheckedChange={(v) => setValue("active", !!v)} /> Activa
      </label>
      <DynamicMapPicker lat={lat} lon={lon} onChange={(nextLat, nextLon) => { setValue("lat", nextLat); setValue("lon", nextLon); }} />
      <p className="text-sm text-muted-foreground">Lat: {lat.toFixed(5)} | Lon: {lon.toFixed(5)}</p>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Guardando..." : "Guardar plaza"}</Button>
      {mutation.isError && <p className="text-sm text-red-600">No se pudo guardar la plaza.</p>}
      {mutation.isSuccess && <p className="text-sm text-green-600">Plaza guardada correctamente.</p>}
    </form>
  );
}
