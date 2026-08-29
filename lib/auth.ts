import { createHash } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "rawae_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "Rawae@2026";
}

export function sessionToken(): string {
  return createHash("sha256")
    .update(`rawae-session:${adminPassword()}`)
    .digest("hex");
}

export function verifyPassword(password: string): boolean {
  return password === adminPassword();
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === sessionToken();
}
