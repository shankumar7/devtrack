import { NextRequest } from "next/server";

/**
 * Extracts the true client IP address from a NextRequest securely.
 *
 * This function prioritizes the trusted `req.ip` property provided by
 * the Next.js Edge runtime (which strips spoofed IPs). If `req.ip` is
 * unavailable (e.g. during local development), it safely falls back to
 * `x-forwarded-for` and extracts only the first valid IP.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Trust req.ip first. Vercel/Next.js sets this securely.
  if (req.ip) {
    return req.ip;
  }

  // 2. Fallback to x-forwarded-for, extracting the first IP safely.
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  // 3. Fallback to x-real-ip
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // 4. Default to unknown
  return "unknown";
}
