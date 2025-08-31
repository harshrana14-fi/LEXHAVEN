// app/apply/page.tsx
'use client';

import React, { Suspense } from 'react';

// Separate component that uses useSearchParams
function ApplyPageContent() {
  const { useEffect, useState } = React;
  const axios = require('axios');
  const { useSearchParams, useRouter } = require('next/navigation');
  const { 
    Building2, 
    MapPin, 
    DollarSign, 
    User, 
    Mail, 
    Phone, 
    GraduationCap, 
    FileText, 
    Upload, 
    Calendar, 
    Award, 
    Briefcase, 
    ArrowLeft, 
    Send, 
    CheckCircle, 
    AlertCircle,
    Home,
    X,
    ChevronRight,
    ChevronLeft
  } = require('lucide-react');

  const searchParams = useSearchParams();
  const router = useRouter();
  const internshipId = searchParams.get('id');

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [application, setApplication] = useState<Application>({
    internshipId: internshipId || '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
    },
    educationInfo: {
      university: '',
      degree: '',
      year: '',
      cgpa: '',
      lawSchool: '',
    },
    experience: {
      previousInternships: '',
      relevantExperience: '',
      skills: [],
    },
    documents: {
      resume: null,
      coverLetter: '',
      transcripts: null,
    },
    additionalInfo: {
      availability: '',
      expectedDuration: '',
      motivation: '',
    },
  });

  useEffect(() => {
    if (internshipId) {
      fetchInternship();
    } else {
      setLoading(false);
    }
  }, [internshipId]);

  async function fetchInternship() {
    try {
      const res = await axios.get(`/api/internships/${internshipId}`);
      setInternship(res.data);
    } catch (error) {
      console.error('Error fetching internship:', error);
      setMessage({ type: 'error', text: 'Failed to load internship details' });
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (section: keyof Application, field: string, value: any) => {
    setApplication(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [field]: value
      }
    }));
  };

  const handleSkillsChange = (skills: string) => {
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    handleInputChange('experience', 'skills', skillsArray);
  };

  const handleFileUpload = (field: 'resume' | 'transcripts', file: File) => {
    handleInputChange('documents', field, file);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          application.personalInfo.fullName &&
          application.personalInfo.email &&
          application.personalInfo.phone
        );
      case 2:
        return !!(
          application.educationInfo.university &&
          application.educationInfo.degree &&
          application.educationInfo.year
        );
      case 3:
        return !!(application.documents.coverLetter);
      case 4:
        return !!(application.additionalInfo.motivation);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function handleSubmit() {
    if (!validateStep(4)) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // Validate file sizes before uploading
      if (application.documents.resume && application.documents.resume.size > 5 * 1024 * 1024) {
        throw new Error('Resume file is too large. Maximum size is 5MB.');
      }
      
      if (application.documents.transcripts && application.documents.transcripts.size > 5 * 1024 * 1024) {
        throw new Error('Transcripts file is too large. Maximum size is 5MB.');
      }

      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all application data with validation
      if (!internshipId) {
        throw new Error('Invalid internship ID');
      }
      
      formData.append('internshipId', internshipId);
      formData.append('personalInfo', JSON.stringify(application.personalInfo));
      formData.append('educationInfo', JSON.stringify(application.educationInfo));
      formData.append('experience', JSON.stringify(application.experience));
      formData.append('additionalInfo', JSON.stringify(application.additionalInfo));
      formData.append('coverLetter', application.documents.coverLetter);

      // Add files if they exist
      if (application.documents.resume) {
        formData.append('resume', application.documents.resume);
      }
      if (application.documents.transcripts) {
        formData.append('transcripts', application.documents.transcripts);
      }

      console.log('Submitting application for internship:', internshipId);

      // Submit to API (removed conflicting timeout mechanisms)
      const response = await axios.post(`/api/internships/${internshipId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for large files
      });

      console.log('Application submitted successfully:', response.data);
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/browseinternships');
      }, 3000);

    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data.error || 'Invalid application data. Please check your inputs.';
            if (data.details) {
              errorMessage += ` Details: ${data.details.join(', ')}`;
            }
            break;
          case 404:
            errorMessage = 'Internship not found. It may have been removed.';
            break;
          case 409:
            errorMessage = 'You have already applied for this internship.';
            break;
          case 413:
            errorMessage = 'Files are too large. Please reduce file sizes and try again.';
            break;
          case 500:
            errorMessage = data.error || 'Server error. Please try again later.';
            if (process.env.NODE_ENV === 'development' && data.details) {
              console.error('Server error details:', data.details);
            }
            break;
          default:
            errorMessage = data.error || `Unexpected error (${status}). Please try again.`;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        // Error setting up request
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Internship Not Found</h2>
          <p className="text-gray-600 mb-4">The internship you're trying to apply for doesn't exist.</p>
          <button 
            onClick={() => router.push('/browseinternships')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Apply for Internship</h1>
                <p className="text-sm text-gray-600">{internship.title} at {internship.firmName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="/" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Home className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Internship Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h2>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {internship.firmName}
                </span>
                {internship.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {internship.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {internship.stipend || 'Not disclosed'}
                </span>
              </div>
              {internship.roleDescription && (
                <p className="text-gray-700 text-sm">{internship.roleDescription}</p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <div className="ml-2 text-sm">
                  <span className={`font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step === 1 && 'Personal Info'}
                    {step === 2 && 'Education'}
                    {step === 3 && 'Documents'}
                    {step === 4 && 'Additional Info'}
                  </span>
                </div>
                {step < 4 && <ChevronRight className="h-4 w-4 text-gray-400 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={application.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={application.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={application.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={application.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Education Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University/College *
                  </label>
                  <input
                    type="text"
                    value={application.educationInfo.university}
                    onChange={(e) => handleInputChange('educationInfo', 'university', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your university name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <select
                    value={application.educationInfo.degree}
                    onChange={(e) => handleInputChange('educationInfo', 'degree', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    required
                  >
                    <option value="">Select degree</option>
                    <option value="LLB">LLB</option>
                    <option value="BA LLB">BA LLB</option>
                    <option value="BBA LLB">BBA LLB</option>
                    <option value="LLM">LLM</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Year *
                  </label>
                  <select
                    value={application.educationInfo.year}
                    onChange={(e) => handleInputChange('educationInfo', 'year', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    required
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CGPA/Percentage
                  </label>
                  <input
                    type="text"
                    value={application.educationInfo.cgpa}
                    onChange={(e) => handleInputChange('educationInfo', 'cgpa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter CGPA or percentage"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Law School/Department
                  </label>
                  <input
                    type="text"
                    value={application.educationInfo.lawSchool}
                    onChange={(e) => handleInputChange('educationInfo', 'lawSchool', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter law school/department name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Internships (write 'None' if not applicable)
                  </label>
                  <textarea
                    value={application.experience.previousInternships}
                    onChange={(e) => handleInputChange('experience', 'previousInternships', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Describe your previous legal internships"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience(write 'None' if not applicable)
                  </label>
                  <textarea
                    value={application.experience.relevantExperience}
                    onChange={(e) => handleInputChange('experience', 'relevantExperience', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Any other relevant experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={application.experience.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g. Legal Research, Contract Drafting, Client Communication"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Documents & Cover Letter</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={application.documents.coverLetter}
                    onChange={(e) => handleInputChange('documents', 'coverLetter', e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Write your cover letter explaining why you're interested in this internship and what you can contribute..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume (PDF)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('resume', file);
                        }}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label 
                        htmlFor="resume-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                      >
                        {application.documents.resume ? application.documents.resume.name : 'Click to upload resume'}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF files only</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Transcripts (PDF)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('transcripts', file);
                        }}
                        className="hidden"
                        id="transcripts-upload"
                      />
                      <label 
                        htmlFor="transcripts-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                      >
                        {application.documents.transcripts ? application.documents.transcripts.name : 'Click to upload transcripts'}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF files only (Optional)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={application.additionalInfo.availability}
                    onChange={(e) => handleInputChange('additionalInfo', 'availability', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  >
                    <option value="">Select availability</option>
                    <option value="Immediate">Immediate</option>
                    <option value="Within 2 weeks">Within 2 weeks</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="After semester ends">After semester ends</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Duration
                  </label>
                  <select
                    value={application.additionalInfo.expectedDuration}
                    onChange={(e) => handleInputChange('additionalInfo', 'expectedDuration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  >
                    <option value="">Select duration</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want this internship? *
                </label>
                <textarea
                  value={application.additionalInfo.motivation}
                  onChange={(e) => handleInputChange('additionalInfo', 'motivation', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Explain your motivation and what you hope to gain from this internship..."
                  required
                />
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">Application Summary</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Name:</strong> {application.personalInfo.fullName}</p>
                  <p><strong>Email:</strong> {application.personalInfo.email}</p>
                  <p><strong>University:</strong> {application.educationInfo.university}</p>
                  <p><strong>Degree:</strong> {application.educationInfo.degree} - {application.educationInfo.year}</p>
                  {application.documents.resume && <p><strong>Resume:</strong> {application.documents.resume.name}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !validateStep(4)}
                className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span>{message.text}</span>
              </div>
              {message.type === 'success' && (
                <p className="mt-2 text-sm">You will be redirected to the browse page shortly.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ApplyPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading application form...</p>
      </div>
    </div>
  );
}

// Type definitions
type Internship = {
  _id: string;
  title: string;
  firmName: string;
  location?: string;
  stipend?: string;
  roleDescription?: string;
  requirements?: string[];
  responsibilities?: string[];
  contactEmail?: string;
};

type Application = {
  internshipId: string;
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
    resume: File | null;
    coverLetter: string;
    transcripts: File | null;
  };
  additionalInfo: {
    availability: string;
    expectedDuration: string;
    motivation: string;
  };
};

// Main component wrapped with Suspense
export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplyPageLoading />}>
      <ApplyPageContent />
    </Suspense>
  );
}