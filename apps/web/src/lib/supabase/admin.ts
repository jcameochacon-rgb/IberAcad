import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@iberdrola/shared";
import { getAdminConfig } from "@/lib/env";

/** Cliente con clave de servicio. Solo para acciones de servidor de Dirección. */
export function createAdminClient() {
  const config = getAdminConfig();
  if (!config) return null;
  return createClient<Database>(config.url, config.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
