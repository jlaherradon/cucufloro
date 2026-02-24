"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mapAuthResponse } from "@/lib/auth";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const registerSchema = loginSchema.extend({ name: z.string().min(2).optional() });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const schema = mode === "login" ? loginSchema : registerSchema;
  const { register, handleSubmit, formState } = useForm<LoginForm | RegisterForm>({
    resolver: zodResolver(schema)
  });
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: LoginForm | RegisterForm) => {
      const { data } = await api.post(mode === "login" ? "/auth/login" : "/auth/register", values);
      return mapAuthResponse(data);
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      router.push("/dashboard");
    }
  });

  return (
    <Card className="mx-auto mt-20 w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          {mode === "register" && (
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register("name")} />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register("password")} />
          </div>
          {formState.errors.root && <p className="text-sm text-red-600">{formState.errors.root.message}</p>}
          {mutation.isError && <p className="text-sm text-red-600">Error autenticando usuario.</p>}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarme"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <Link className="text-primary underline" href={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
