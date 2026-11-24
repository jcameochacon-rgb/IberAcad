import "server-only";
import { headers } from "next/headers";
import { siteOrigin } from "@/lib/env";

export async function siteOriginForRequest(): Promise<string | null> {
  const configured = siteOrigin();
  if (
    configured &&
    !configured.includes("localhost") &&
    !configured.includes("127.0.0.1")
  )
    return configured;

  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost || requestHeaders.get("host");
  if (!host) return configured;
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProto === "https" ||
    host.includes(".") ||
    host.includes("vercel.app")
      ? "https:"
      : "http:";
  try {
    const origin = new URL(`${protocol}//${host}`).origin;
    if (
      origin === "http://localhost:3000" ||
      origin.startsWith("http://127.0.0.1:")
    )
      return origin;
    return origin.startsWith("https://") ? origin : configured;
  } catch {
    return configured;
  }
}
