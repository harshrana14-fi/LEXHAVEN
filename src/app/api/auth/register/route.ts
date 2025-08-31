// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, generateToken } from '@/lib/auth';
import { z } from 'zod';

const studentProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  university: z.string().min(1, 'University is required'),
  graduationYear: z.number().min(2020).max(2030),
  gpa: z.number().min(0).max(4).optional(),
  skills: z.array(z.string()).default([]),
  resume: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
});

const companyProfileSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
});

const baseRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'company']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate base fields
    const baseData = baseRegistrationSchema.parse(body);
    
    // Validate profile based on role
    let profileData;
    if (baseData.role === 'student') {
      profileData = studentProfileSchema.parse(body.profile);
    } else {
      profileData = companyProfileSchema.parse(body.profile);
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(baseData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const userData = {
      ...baseData,
      profile: profileData,
    };

    const user = await createUser(userData);
    
    // Type cast the _id to string (assuming it's a MongoDB ObjectId)
    const userId = (user._id as any)?.toString() || user._id;
    const token = generateToken(userId, user.role);

    const response = NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: userId,
          email: user.email,
          role: user.role,
          profile: user.profile,
          isVerified: user.isVerified,
        }
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}