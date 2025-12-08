import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
const JWT_ISSUER = 'adblock-shop';
const JWT_AUDIENCE = 'adblock-shop-users';

if (!JWT_SECRET && typeof window === 'undefined') {
  console.warn('NEXTAUTH_SECRET (or AUTH_SECRET) is not set; auth tokens will fail.');
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash?: string | null) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export interface JwtSessionPayload {
  sub: string;
  email: string;
  name: string;
  provider: string;
}

export async function signSession(payload: JwtSessionPayload) {
  if (!JWT_SECRET) throw new Error('Missing NEXTAUTH_SECRET');
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifySession(token: string) {
  if (!JWT_SECRET) throw new Error('Missing NEXTAUTH_SECRET');
  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET), {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
  return payload as JwtSessionPayload;
}

export async function ensureOAuthUser(email: string, name: string, provider: 'google') {
  const existing = await db.getUserByEmail(email);
  if (existing) return existing;
  return db.createUser({ email, name, provider, passwordHash: null });
}
