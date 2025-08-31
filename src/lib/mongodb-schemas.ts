// lib/mongodb-schemas.ts
// MongoDB Schema definitions for the application

export interface ApplicationDocument {
  _id?: string;
  internshipId: string;
  internshipTitle: string;
  firmName: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  };
  educationInfo: {
    university: string;
    degree: string;
    year: string;
    cgpa?: string;
    lawSchool?: string;
  };
  experience: {
    previousInternships?: string;
    relevantExperience?: string;
    skills: string[];
  };
  documents: {
    coverLetter: string;
    resumePath?: string;
    transcriptsPath?: string;
  };
  additionalInfo: {
    availability?: string;
    expectedDuration?: string;
    motivation: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  reviewNotes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface InternshipDocument {
  _id?: string;
  title: string;
  firmName: string;
  location?: string;
  stipend?: string;
  roleDescription?: string;
  requirements?: string[];
  responsibilities?: string[];
  contactEmail?: string;
  applicationCount?: number;
  postedAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// MongoDB Collection Indexes
export const mongoIndexes = {
  applications: [
    { key: { internshipId: 1 } },
    { key: { firmName: 1 } },
    { key: { status: 1 } },
    { key: { appliedAt: -1 } },
    { key: { 'personalInfo.email': 1 } },
    { key: { internshipId: 1, 'personalInfo.email': 1 }, unique: true } // Prevent duplicate applications
  ],
  internships: [
    { key: { firmName: 1 } },
    { key: { title: 'text', roleDescription: 'text', firmName: 'text' } }, // Text search
    { key: { postedAt: -1 } },
    { key: { isActive: 1 } }
  ]
};

// Database initialization function
export async function initializeDatabase(db: any) {
  try {
    // Create indexes for applications collection
    const applicationsCollection = db.collection('applications');
    for (const index of mongoIndexes.applications) {
      await applicationsCollection.createIndex(index.key, index.unique ? { unique: true } : {});
    }

    // Create indexes for internships collection
    const internshipsCollection = db.collection('internships');
    for (const index of mongoIndexes.internships) {
      await internshipsCollection.createIndex(index.key);
    }

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
  }
}