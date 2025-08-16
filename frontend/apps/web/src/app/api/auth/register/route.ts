import { NextRequest, NextResponse } from 'next/server'
import { db } from '@shopclonetr/db'
import { hashPassword, registerSchema } from '@shopclonetr/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi ile kayıtlı bir hesap zaten var' },
        { status: 400 }
      )
    }
    
    // Hash password
    const passwordHash = await hashPassword(validatedData.password)
    
    // Create user
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json(
      { message: 'Hesap başarıyla oluşturuldu', user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.issues) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
}
