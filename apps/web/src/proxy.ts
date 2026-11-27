import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@iberdrola/shared";
import { getSupabaseConfig } from "@/lib/env";
export async function proxy(request: NextRequest) {
  // Si el correo de recuperación aterriza en la portada (por ejemplo cuando la
  // dirección de redirección no está autorizada en Supabase), reenvía el código
  // al flujo de recuperación en lugar de dejar a la persona en la portada.
  if (request.nextUrl.pathname === "/") {
    const code = request.nextUrl.searchParams.get("code");
    const tokenHash = request.nextUrl.searchParams.get("token_hash");
    if (code && code.length < 2048) {
      const target = new URL("/auth/callback", request.url);
      target.searchParams.set("code", code);
      target.searchParams.set("next", "/actualizar-clave");
      return NextResponse.redirect(target);
    }
    if (
      tokenHash &&
      tokenHash.length < 2048 &&
      request.nextUrl.searchParams.get("type") === "recovery"
    ) {
      const target = new URL("/auth/confirm", request.url);
      target.searchParams.set("token_hash", tokenHash);
      target.searchParams.set("type", "recovery");
      target.searchParams.set("next", "/actualizar-clave");
      return NextResponse.redirect(target);
    }
    return NextResponse.next();
  }
  let response = NextResponse.next({ request });
  const noCache = (r: NextResponse) => {
    r.headers.set("Cache-Control", "private, no-store, max-age=0");
    r.headers.set("Pragma", "no-cache");
    return r;
  };
  const redirect = (path: string) => {
    const redirected = NextResponse.redirect(new URL(path, request.url));
    response.cookies
      .getAll()
      .forEach((cookie) => redirected.cookies.set(cookie));
    return noCache(redirected);
  };
  const env = getSupabaseConfig();
  if (!env)
    return request.nextUrl.pathname.startsWith("/panel") ||
      request.nextUrl.pathname === "/actualizar-clave"
      ? redirect("/configurar")
      : noCache(response);
  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  try {
    const { data, error } = await supabase.auth.getClaims();
    const protectedPath =
      request.nextUrl.pathname.startsWith("/panel") ||
      ["/actualizar-clave", "/acceso-pendiente"].includes(
        request.nextUrl.pathname,
      );
    if (protectedPath && (error || !data?.claims?.sub))
      return redirect("/login");
  } catch {
    return redirect("/login?error=servicio");
  }
  return noCache(response);
}
export const config = {
  matcher: [
    "/",
    "/panel/:path*",
    "/login",
    "/actualizar-clave",
    "/acceso-pendiente",
    "/auth/:path*",
  ],
};
