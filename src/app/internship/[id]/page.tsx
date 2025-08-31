import InternshipModel from '@/models/Internship';
import mongoose from '@/lib/mongoose';
import { Scale, Building2, MapPin, DollarSign, FileText, CheckCircle, Mail, ArrowLeft, Calendar, Clock, Users, Award, Target, Briefcase, ExternalLink, Send, Phone, Globe, Home, Menu } from 'lucide-react';
import Link from 'next/link';

// Define the internship type
interface Internship {
  _id: string;
  title: string;
  firmName: string;
  location?: string;
  stipend?: string;
  roleDescription?: string;
  requirements?: string[];
  responsibilities?: string[];
  contactEmail?: string;
}

export default async function Details({ params }: { params: Promise<{ id: string }> }) {
  await mongoose;
  
  // Await the params Promise
  const { id } = await params;
  
  const internshipDoc = await InternshipModel.findById(id).lean();
  
  if (!internshipDoc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Legal Internship Portal</h1>
            </div>
            <p className="text-slate-300 text-lg">Professional Legal Career Platform</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Internship Not Found</h2>
            <p className="text-slate-600 mb-6">The internship you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/browse"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse All Internships
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Type assertion to ensure TypeScript knows the structure
  const internship: Internship = internshipDoc as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-18">
            {/* Logo + Brand */}
            <div className="flex items-center">
              <div className="relative">
                <img
                  src="/images/logobg1.png"
                  alt="LEXHAVEN"
                  className="h-45 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* User Actions */}
              <div className="flex items-center gap-2">
                <Link href="/">
                  <button className="p-2 text-gray-600 hover:text-blue-700 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                    <Home className="h-5 w-5" />
                  </button>
                </Link>
              </div>

              {/* Mobile Menu */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-20"></div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/browseinternships"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Position Header */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-3">{internship.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <span className="font-medium text-lg">{internship.firmName}</span>
                      </div>
                      {internship.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          <span>{internship.location}</span>
                        </div>
                      )}
                      {internship.stipend && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          <span className="font-medium">{internship.stipend}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-blue-300" />
                      <div className="text-xs text-blue-200">Posted</div>
                      <div className="text-sm font-semibold">Recently</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-6 border-b border-slate-200">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Briefcase className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Position Type</div>
                    <div className="font-semibold text-slate-800">Internship</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Experience</div>
                    <div className="font-semibold text-slate-800">Entry Level</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Duration</div>
                    <div className="font-semibold text-slate-800">Summer/Semester</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Field</div>
                    <div className="font-semibold text-slate-800">Legal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Overview */}
            {internship.roleDescription && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Position Overview</h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
                    {internship.roleDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Requirements */}
            {internship.requirements && internship.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Requirements</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {internship.requirements.map((requirement: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {internship.responsibilities && internship.responsibilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Key Responsibilities</h2>
                </div>
                <div className="space-y-4">
                  {internship.responsibilities.map((responsibility: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-slate-700 font-medium leading-relaxed">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                <h3 className="text-xl font-semibold mb-2">Ready to Apply?</h3>
                <p className="text-blue-100">Take the next step in your legal career</p>
              </div>
              
              <div className="p-6 space-y-4">
                <Link
                  href={`/apply?id=${internship._id}`}
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Apply Now
                </Link>
                
                <div className="text-center text-sm text-slate-600">
                  <p className="mb-2">Questions about this position?</p>
                  <div className="space-y-2">
                    {internship.contactEmail && (
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <Mail className="h-4 w-4" />
                        <a 
                          href={`mailto:${internship.contactEmail}`}
                          className="hover:underline font-medium"
                        >
                          {internship.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Firm Information */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">About {internship.firmName}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Organization</div>
                    <div className="font-semibold text-slate-800">{internship.firmName}</div>
                  </div>
                  
                  {internship.location && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Location</div>
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {internship.location}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Industry</div>
                    <div className="font-semibold text-slate-800">Legal Services</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Position Details</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Position ID</span>
                    <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                      {internship._id.toString().slice(-8).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Compensation</span>
                    <span className="font-semibold text-green-700">
                      {internship.stipend || 'To be discussed'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Application Deadline</span>
                    <span className="font-semibold text-slate-800">Open</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Share This Position</h3>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm">
                    Copy Link
                  </button>
                  <button className="flex-1 bg-slate-50 text-slate-700 py-2 px-3 rounded-lg font-medium hover:bg-slate-100 transition-colors text-sm">
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}