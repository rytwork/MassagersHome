import { getAdminAuth } from "./firebase-admin";
import type { AuthUser } from "./types";

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function isAdminEmail(email: string | null | undefined) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && adminEmails.includes(email.toLowerCase()));
}

export async function requireAuthUser(request: Request): Promise<AuthUser> {
  const token = getBearerToken(request);

  if (!token) {
    throw new Error("Sign in is required.");
  }

  const decoded = await getAdminAuth().verifyIdToken(token);
  const email = decoded.email ?? null;

  return {
    uid: decoded.uid,
    email,
    name: decoded.name,
    isAdmin: decoded.admin === true || isAdminEmail(email),
  };
}

export async function requireAdminUser(request: Request) {
  const user = await requireAuthUser(request);

  if (!user.isAdmin) {
    throw new Error("Admin access is required.");
  }

  return user;
}
