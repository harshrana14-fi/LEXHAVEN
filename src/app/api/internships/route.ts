import { NextResponse } from 'next/server';
import mongoose from '@/lib/mongoose';
import Internship from '@/models/Internship';


export async function GET(request: Request) {
const url = new URL(request.url);
const q = url.searchParams.get('q') || undefined;
const location = url.searchParams.get('location') || undefined;
const filter: any = {};
if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { firmName: new RegExp(q, 'i') }, { roleDescription: new RegExp(q, 'i') }];
if (location) filter.location = new RegExp(location, 'i');


await mongoose; // ensure connection
const internships = await Internship.find(filter).sort({ createdAt: -1 }).limit(200);
return NextResponse.json(internships);
}


export async function POST(request: Request) {
const body = await request.json();
await mongoose;
try {
const internship = await Internship.create(body);
return NextResponse.json(internship, { status: 201 });
} catch (err: any) {
return NextResponse.json({ error: err.message || 'Invalid' }, { status: 400 });
}
}