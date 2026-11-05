import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'wicys_admin_session';
// How long a sign-in lasts.
const SESSION_HOURS = 12;

// The admin password comes only from the ADMIN_PASSWORD environment
// variable. With none set, the admin area stays locked.
export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password ? password : null;
}

function sameText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function checkAdminPassword(attempt: string): boolean {
  const password = getAdminPassword();
  return password !== null && sameText(attempt, password);
}

// Sessions are signed with this secret. Changing ADMIN_PASSWORD (or setting
// ADMIN_SESSION_SECRET) signs everyone out.
function sessionSecret(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return process.env.ADMIN_SESSION_SECRET?.trim() || `wicys-admin:${password}`;
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

// A session is "<expiry time>.<signature>", so it ends on its own and
// cannot be made up without the secret.
function makeToken(secret: string): string {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires, secret)}`;
}

function tokenIsValid(token: string, secret: string): boolean {
  const [expires, signature] = token.split('.');
  if (!expires || !signature) return false;
  if (!sameText(signature, sign(expires, secret))) return false;
  return Number(expires) > Date.now();
}

export async function verifyAdminSession(): Promise<boolean> {
  const secret = sessionSecret();
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? tokenIsValid(token, secret) : false;
}

export async function setAdminSession(): Promise<void> {
  const secret = sessionSecret();
  if (!secret) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
