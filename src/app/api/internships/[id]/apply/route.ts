// app/api/internships/[id]/apply/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Internship from '@/models/Internship';
import Application from '@/models/Application';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB();
    console.log('Database connected successfully');

    const { id: internshipId } = await params; // Await the params Promise
    console.log('Processing application for internship ID:', internshipId);

    // Validate internship ID format (if using MongoDB ObjectId)
    if (!internshipId || internshipId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid internship ID format' },
        { status: 400 }
      );
    }

    // Parse form data with error handling
    const formData = await request.formData();
    console.log('Form data received, parsing...');

    let personalInfo, educationInfo, experience, additionalInfo;
    
    try {
      personalInfo = JSON.parse(formData.get('personalInfo') as string);
      educationInfo = JSON.parse(formData.get('educationInfo') as string);
      experience = JSON.parse(formData.get('experience') as string);
      additionalInfo = JSON.parse(formData.get('additionalInfo') as string);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON data in form submission' },
        { status: 400 }
      );
    }

    const coverLetter = formData.get('coverLetter') as string;

    // Validate required fields
    if (!personalInfo?.fullName || !personalInfo?.email || !coverLetter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resumeFile = formData.get('resume') as File | null;
    const transcriptsFile = formData.get('transcripts') as File | null;

    // Check if internship exists
    console.log('Looking up internship...');
    const internship = await Internship.findById(internshipId).lean() as any;
    if (!internship) {
      console.log('Internship not found for ID:', internshipId);
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }
    console.log('Internship found:', internship.title);

    // Process file uploads with size limits
    let resumeBase64: string | undefined;
    let resumeFileName: string | undefined;
    if (resumeFile) {
      console.log('Processing resume file:', resumeFile.name, 'Size:', resumeFile.size);
      
      // Check file size (limit to 5MB)
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Resume file too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      try {
        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        resumeBase64 = buffer.toString('base64');
        resumeFileName = resumeFile.name;
      } catch (fileError) {
        console.error('Error processing resume file:', fileError);
        return NextResponse.json(
          { error: 'Failed to process resume file' },
          { status: 400 }
        );
      }
    }

    let transcriptsBase64: string | undefined;
    let transcriptsFileName: string | undefined;
    if (transcriptsFile) {
      console.log('Processing transcripts file:', transcriptsFile.name, 'Size:', transcriptsFile.size);
      
      // Check file size (limit to 5MB)
      if (transcriptsFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Transcripts file too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      try {
        const buffer = Buffer.from(await transcriptsFile.arrayBuffer());
        transcriptsBase64 = buffer.toString('base64');
        transcriptsFileName = transcriptsFile.name;
      } catch (fileError) {
        console.error('Error processing transcripts file:', fileError);
        return NextResponse.json(
          { error: 'Failed to process transcripts file' },
          { status: 400 }
        );
      }
    }

    // Check for existing application from same email
    const existingApplication = await Application.findOne({
      internshipId: internship._id.toString(),
      'personalInfo.email': personalInfo.email
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this internship' },
        { status: 409 }
      );
    }

    // Create application document
    const applicationDoc = {
      internshipId: internship._id.toString(),
      internshipTitle: internship.title,
      firmName: internship.firmName,
      personalInfo: {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address || ''
      },
      educationInfo: {
        university: educationInfo.university,
        degree: educationInfo.degree,
        year: educationInfo.year,
        cgpa: educationInfo.cgpa || '',
        lawSchool: educationInfo.lawSchool || ''
      },
      experience: {
        previousInternships: experience.previousInternships || '',
        relevantExperience: experience.relevantExperience || '',
        skills: Array.isArray(experience.skills) ? experience.skills : []
      },
      documents: {
        coverLetter: coverLetter,
        resumeData: resumeBase64,
        resumeFileName: resumeFileName,
        transcriptsData: transcriptsBase64,
        transcriptsFileName: transcriptsFileName,
      },
      additionalInfo: {
        availability: additionalInfo.availability || '',
        expectedDuration: additionalInfo.expectedDuration || '',
        motivation: additionalInfo.motivation
      },
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Creating application document...');
    
    // Save application with better error handling
    let result;
    try {
      result = await Application.create(applicationDoc);
      console.log('Application created successfully with ID:', result._id);
    } catch (dbError: any) {
      console.error('Database error creating application:', dbError);
      
      // Handle specific MongoDB validation errors
      if (dbError.name === 'ValidationError') {
        const validationErrors = Object.values(dbError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { error: 'Validation error', details: validationErrors },
          { status: 400 }
        );
      }
      
      throw dbError; // Re-throw if not a validation error
    }

    // Update internship application count
    try {
      await Internship.updateOne(
        { _id: internship._id },
        {
          $inc: { applicationCount: 1 },
          $set: { updatedAt: new Date() },
        }
      );
      console.log('Internship application count updated');
    } catch (updateError) {
      console.error('Error updating internship count:', updateError);
      // Don't fail the request if count update fails
    }

    return NextResponse.json(
      { 
        message: 'Application submitted successfully', 
        applicationId: result._id,
        status: 'success'
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('Unexpected error in application submission:', err);
    console.error('Error stack:', err.stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}