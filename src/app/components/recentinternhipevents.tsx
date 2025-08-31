import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongoose';
import InternshipModel, { Internship } from '@/models/Internship';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign, Building, ArrowRight, Briefcase, Clock } from 'lucide-react';

export default async function RecentPage() {
  await connectDB(); // ✅ ensures the DB connection is ready

  const internships = await InternshipModel.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean() as any[];

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Internship Posts</h1>
            <p className="text-xl text-gray-600">Discover the newest opportunities from top law firms and organizations</p>
          </div>
          <Link
            href="/internships"
            className="group hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>Browse All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {internships.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Internships Yet</h3>
              <p className="text-gray-600">Be the first to discover new opportunities when they're posted!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <div
                key={String(internship._id)}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{getTimeAgo(internship.createdAt)}</span>
                  </div>
                </div>

                <h2 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {internship.title}
                </h2>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {internship.roleDescription}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">{internship.firmName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{internship.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{internship.stipend || 'Stipend not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Posted {formatDate(internship.createdAt)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Link
                    href={`/internship/${String(internship._id)}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {internships.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/browseinternships"
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Browse All Internships</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export { RecentPage as RecentInternships };