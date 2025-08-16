import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export enum UserRole {
  USER = 'USER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
    return jwt.verify(token, secret) as JWTPayload
  } catch {
    return null
  }
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = {
    [UserRole.USER]: 0,
    [UserRole.SELLER]: 1,
    [UserRole.ADMIN]: 2
  }
  return hierarchy[userRole] >= hierarchy[requiredRole]
}

export function canAccessResource(userRole: UserRole, resourceOwnerRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === resourceOwnerRole
}
