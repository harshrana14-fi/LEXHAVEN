import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// define schema if not defined yet
const ApplicationSchema = new mongoose.Schema(
  {
    // define your fields based on what you store
    // example:
    status: { type: String, default: 'pending' },
    reviewNotes: String,
    updatedAt: Date,
  },
  { collection: 'applications' }
);

// re-use model if already compiled (important for Next.js hot reload)
const Application =
  mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

// GET - Get specific application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB(); // ensures mongoose is connected
    
    const { id } = await params; // Await the params Promise

    const application = await Application.findById(id).lean();

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { message: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PUT - Update application status (for company dashboard)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, notes } = await request.json();
    const { id } = await params; // Await the params Promise

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.reviewNotes = notes;
    }

    const updated = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Application status updated successfully',
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { message: 'Failed to update application status' },
      { status: 500 }
    );
  }
}

// DELETE - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params; // Await the params Promise

    const deleted = await Application.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { message: 'Failed to delete application' },
      { status: 500 }
    );
  }
}