import Link from 'next/link'
import { MapPin, Clock, Users, ArrowRight, Building } from 'lucide-react'

const RecentInternships = () => {
  const internships = [
    {
      id: 1,
      company: "Khaitan & Co",
      title: "Legal Research Intern",
      location: "New Delhi",
      duration: "3 months",
      applicants: 45,
      type: "Corporate Law",
      stipend: "₹25,000/month",
      logo: "KC"
    },
    {
      id: 2,
      company: "AZB & Partners",
      title: "Litigation Associate Intern",
      location: "Mumbai",
      duration: "6 months",
      applicants: 32,
      type: "Litigation",
      stipend: "₹30,000/month",
      logo: "AZB"
    },
    {
      id: 3,
      company: "Cyril Amarchand Mangaldas",
      title: "M&A Legal Intern",
      location: "Bangalore",
      duration: "4 months",
      applicants: 68,
      type: "M&A",
      stipend: "₹35,000/month",
      logo: "CAM"
    },
    {
      id: 4,
      company: "Shardul Amarchand Mangaldas",
      title: "IP Law Intern",
      location: "Chennai",
      duration: "3 months",
      applicants: 29,
      type: "IP Law",
      stipend: "₹28,000/month",
      logo: "SAM"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Internships</h2>
            <p className="text-xl text-gray-600">Discover amazing opportunities from top law firms</p>
          </div>
          <Link
            href="/internships"
            className="group hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {internship.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                      {internship.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{internship.company}</p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {internship.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{internship.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{internship.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{internship.applicants} applicants</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span className="text-sm font-semibold text-green-600">{internship.stipend}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-500 text-sm">Posted 2 days ago</span>
                <Link
                  href={`/internships/${internship.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/internships"
            className="group inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>View All Internships</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
export default RecentInternships