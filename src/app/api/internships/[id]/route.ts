// app/api/internships/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Internship from '@/models/Internship';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Await the params Promise
    const { id } = await params;
    
    const internship = await Internship.findById(id).lean();
    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json(internship);
  } catch (err) {
    console.error('Error fetching internship:', err);
    return NextResponse.json({ error: 'Failed to fetch internship' }, { status: 500 });
  }
}