// models/Application.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  internshipId: string;
  internshipTitle: string;
  firmName: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  educationInfo: {
    university: string;
    degree: string;
    year: string;
    cgpa: string;
    lawSchool: string;
  };
  experience: {
    previousInternships: string;
    relevantExperience: string;
    skills: string[];
  };
  documents: {
    coverLetter: string;
    resumeData?: string;
    resumeFileName?: string;
    transcriptsData?: string;
    transcriptsFileName?: string;
  };
  additionalInfo: {
    availability: string;
    expectedDuration: string;
    motivation: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'under_review';
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema<IApplication> = new Schema({
  internshipId: {
    type: String,
    required: [true, 'Internship ID is required'],
    index: true
  },
  internshipTitle: {
    type: String,
    required: [true, 'Internship title is required']
  },
  firmName: {
    type: String,
    required: [true, 'Firm name is required']
  },
  personalInfo: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ''
    }
  },
  educationInfo: {
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      enum: ['LLB', 'BA LLB', 'BBA LLB', 'LLM', 'Other']
    },
    year: {
      type: String,
      required: [true, 'Current year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate']
    },
    cgpa: {
      type: String,
      trim: true,
      default: ''
    },
    lawSchool: {
      type: String,
      trim: true,
      default: ''
    }
  },
  experience: {
    previousInternships: {
      type: String,
      trim: true,
      default: ''
    },
    relevantExperience: {
      type: String,
      trim: true,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    }
  },
  documents: {
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [50, 'Cover letter must be at least 50 characters'],
      maxlength: [5000, 'Cover letter cannot exceed 5000 characters']
    },
    resumeData: {
      type: String, // Base64 encoded file data
      default: undefined
    },
    resumeFileName: {
      type: String,
      default: undefined
    },
    transcriptsData: {
      type: String, // Base64 encoded file data
      default: undefined
    },
    transcriptsFileName: {
      type: String,
      default: undefined
    }
  },
  additionalInfo: {
    availability: {
      type: String,
      enum: ['', 'Immediate', 'Within 2 weeks', 'Within 1 month', 'After semester ends'],
      default: ''
    },
    expectedDuration: {
      type: String,
      enum: ['', '1 month', '2 months', '3 months', '6 months', 'Flexible'],
      default: ''
    },
    motivation: {
      type: String,
      required: [true, 'Motivation is required'],
      minlength: [20, 'Motivation must be at least 20 characters'],
      maxlength: [2000, 'Motivation cannot exceed 2000 characters']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'under_review'],
    default: 'pending',
    index: true
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // We're handling timestamps manually
  collection: 'applications'
});

// Compound index for preventing duplicate applications
ApplicationSchema.index({ internshipId: 1, 'personalInfo.email': 1 }, { unique: true });

// Index for querying applications by status
ApplicationSchema.index({ status: 1, appliedAt: -1 });

// Pre-save middleware to update updatedAt
ApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;