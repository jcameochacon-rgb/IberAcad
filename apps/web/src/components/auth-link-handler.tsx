"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/env";

/**
 * Enlaces de invitación y de recuperación que llegan con los datos en el
 * fragmento (#...): el servidor no los ve, así que se resuelven aquí y se
 * envía a la persona a la ventana para elegir su contraseña (o a pedir otro
 * enlace).
 */
export function AuthLinkHandler() {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const params = new URLSearchParams(hash);
    if (params.get("error") || params.get("error_code")) {
      window.history.replaceState(null, "", window.location.pathname);
      router.replace("/login?error=enlace");
      return;
    }
    const access = params.get("access_token");
    const refresh = params.get("refresh_token");
    // Invitación (cuenta nueva) y recuperación: en ambos casos la persona
    // debe elegir su contraseña.
    const type = params.get("type");
    if ((type !== "recovery" && type !== "invite") || !access || !refresh)
      return;
    if (!getSupabaseConfig()) return;
    window.history.replaceState(null, "", window.location.pathname);
    createClient()
      .auth.setSession({ access_token: access, refresh_token: refresh })
      .then(({ error }) =>
        router.replace(error ? "/login?error=enlace" : "/actualizar-clave"),
      )
      .catch(() => router.replace("/login?error=enlace"));
  }, [router]);
  return null;
}
