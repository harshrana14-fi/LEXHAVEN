import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Define interfaces for type safety
interface InternshipDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  firmName: string;
  applicationCount?: number;
  updatedAt?: Date;
}

// Define Application schema/model
const ApplicationSchema = new mongoose.Schema(
  {
    internshipId: mongoose.Schema.Types.ObjectId,
    internshipTitle: String,
    firmName: String,
    personalInfo: Object,
    educationInfo: Object,
    experience: Object,
    documents: {
      coverLetter: String,
      resumePath: String,
      transcriptsPath: String,
    },
    additionalInfo: Object,
    status: { type: String, default: 'pending' },
    appliedAt: Date,
    updatedAt: Date,
  },
  { collection: 'applications' }
);

const InternshipSchema = new mongoose.Schema(
  {
    title: String,
    firmName: String,
    applicationCount: { type: Number, default: 0 },
    updatedAt: Date,
  },
  { collection: 'internships' }
);

const Application =
  mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

const Internship =
  mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

// POST - Submit new application
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const internshipId = formData.get('internshipId') as string;
    const personalInfo = JSON.parse(formData.get('personalInfo') as string);
    const educationInfo = JSON.parse(formData.get('educationInfo') as string);
    const experience = JSON.parse(formData.get('experience') as string);
    const additionalInfo = JSON.parse(formData.get('additionalInfo') as string);
    const coverLetter = formData.get('coverLetter') as string;

    const resumeFile = formData.get('resume') as File | null;
    const transcriptsFile = formData.get('transcripts') as File | null;

    await connectDB(); // just ensure mongoose connection

    // Check if internship exists with proper typing
    const internship = await Internship.findById(internshipId).lean() as InternshipDocument | null;
    if (!internship) {
      return NextResponse.json(
        { message: 'Internship not found' },
        { status: 404 }
      );
    }

    // Handle file uploads
    let resumePath = null;
    let transcriptsPath = null;

    if (resumeFile) {
      const resumeBytes = await resumeFile.arrayBuffer();
      const resumeBuffer = Buffer.from(resumeBytes);

      const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
      await mkdir(uploadsDir, { recursive: true });

      const resumeFileName = `${Date.now()}-${resumeFile.name}`;
      const filePath = path.join(uploadsDir, resumeFileName);
      await writeFile(filePath, resumeBuffer);

      resumePath = `/uploads/resumes/${resumeFileName}`;
    }

    if (transcriptsFile) {
      const transcriptsBytes = await transcriptsFile.arrayBuffer();
      const transcriptsBuffer = Buffer.from(transcriptsBytes);

      const uploadsDir = path.join(process.cwd(), 'uploads', 'transcripts');
      await mkdir(uploadsDir, { recursive: true });

      const transcriptsFileName = `${Date.now()}-${transcriptsFile.name}`;
      const filePath = path.join(uploadsDir, transcriptsFileName);
      await writeFile(filePath, transcriptsBuffer);

      transcriptsPath = `/uploads/transcripts/${transcriptsFileName}`;
    }

    // Create application
    const application = await Application.create({
      internshipId,
      internshipTitle: internship.title,
      firmName: internship.firmName,
      personalInfo,
      educationInfo,
      experience,
      documents: {
        coverLetter,
        resumePath,
        transcriptsPath,
      },
      additionalInfo,
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date(),
    });

    // Update internship application count
    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { applicationCount: 1 },
      $set: { updatedAt: new Date() },
    });

    return NextResponse.json(
      {
        message: 'Application submitted successfully!',
        applicationId: application._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { message: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Get applications (for company dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firmName = searchParams.get('firmName');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    await connectDB();

    const query: any = {};
    if (firmName) query.firmName = firmName;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .sort({ appliedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Application.countDocuments(query);

    return NextResponse.json({
      applications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}