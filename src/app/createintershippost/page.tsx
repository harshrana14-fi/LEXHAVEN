"use client"

import { useState, useEffect } from "react";
import { Building2, MapPin, DollarSign, Calendar, Users, Award, Clock, FileText, Plus, Eye, Briefcase, Scale, Gavel } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Define the interface for internship posts
interface InternshipPost {
  id: string;
  title: string;
  description?: string;
  company: string;
  location?: string;
  stipend?: string;
  duration?: string;
  requirements?: string;
  practice_areas?: string[];
  application_deadline?: string;
  contact_email?: string;
  firm_size?: string;
  about_firm?: string;
  created_at?: string;
}

export default function CreateInternshipPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Enhanced form fields
  const [duration, setDuration] = useState("");
  const [requirements, setRequirements] = useState("");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [firmSize, setFirmSize] = useState("");
  const [aboutFirm, setAboutFirm] = useState("");
  
  // Recent posts state with proper typing
  const [recentPosts, setRecentPosts] = useState<InternshipPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  const practiceAreaOptions = [
    "Corporate Law", "Litigation", "Criminal Law", "Family Law", "Immigration Law",
    "Intellectual Property", "Real Estate Law", "Tax Law", "Employment Law", 
    "Environmental Law", "Healthcare Law", "Securities Law", "Bankruptcy Law",
    "Labor Law", "Constitutional Law", "Contract Law", "Tort Law", "Administrative Law"
  ];

  const firmSizeOptions = [
    "Solo Practice", "Small Firm (2-10 attorneys)", "Mid-size Firm (11-50 attorneys)", 
    "Large Firm (51-200 attorneys)", "Big Law (200+ attorneys)", "In-house Legal Department"
  ];

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setRecentPosts(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const handlePracticeAreaToggle = (area: string) => {
    setPracticeAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const internshipData = {
      title,
      description,
      company,
      location,
      stipend,
      duration,
      requirements,
      practice_areas: practiceAreas,
      application_deadline: applicationDeadline,
      contact_email: contactEmail,
      firm_size: firmSize,
      about_firm: aboutFirm
    };

    const { error } = await supabase.from("internships").insert([internshipData]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Internship posted successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setStipend("");
      setDuration("");
      setRequirements("");
      setPracticeAreas([]);
      setApplicationDeadline("");
      setContactEmail("");
      setFirmSize("");
      setAboutFirm("");
      
      // Refresh recent posts
      fetchRecentPosts();
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Legal Career Portal</h1>
              <p className="text-slate-600 mt-1">Post internship opportunities for aspiring legal professionals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                activeTab === "create" 
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Plus className="h-5 w-5 inline-block mr-2" />
              Create Internship
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                activeTab === "recent" 
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Eye className="h-5 w-5 inline-block mr-2" />
              Recent Posts ({recentPosts.length})
            </button>
          </div>
        </div>

        {activeTab === "create" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Post New Legal Internship</h2>
              <p className="text-slate-600">Fill out the details below to create a comprehensive internship listing</p>
            </div>

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Position Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Legal Intern"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Law Firm/Company *</label>
                    <input
                      type="text"
                      placeholder="e.g., Smith & Associates LLP"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="City, State"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Stipend/Compensation</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g., $2,500/month or Unpaid"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={stipend}
                        onChange={(e) => setStipend(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g., 10-12 weeks"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Application Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={applicationDeadline}
                        onChange={(e) => setApplicationDeadline(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Firm Details Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Firm Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Firm Size</label>
                    <select
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={firmSize}
                      onChange={(e) => setFirmSize(e.target.value)}
                    >
                      <option value="">Select firm size</option>
                      {firmSizeOptions.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      placeholder="hr@lawfirm.com"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">About the Firm</label>
                  <textarea
                    placeholder="Brief description of your law firm, culture, and values..."
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={aboutFirm}
                    onChange={(e) => setAboutFirm(e.target.value)}
                  />
                </div>
              </div>

              {/* Practice Areas Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Gavel className="h-5 w-5 mr-2 text-blue-600" />
                  Practice Areas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {practiceAreaOptions.map((area) => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={practiceAreas.includes(area)}
                        onChange={() => handlePracticeAreaToggle(area)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description and Requirements Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Position Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                    <textarea
                      placeholder="Detailed description of the internship role, responsibilities, and learning opportunities..."
                      rows={6}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Requirements & Qualifications</label>
                    <textarea
                      placeholder="Required qualifications, preferred experience, skills, and any specific requirements..."
                      rows={4}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Publishing...</span>
                    </div>
                  ) : (
                    "Publish Internship"
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                message.includes("Error") 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {message}
              </div>
            )}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Recent Internship Posts</h2>
              <p className="text-slate-600">View and manage your recently posted internships</p>
            </div>

            {loadingPosts ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading recent posts...</p>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No internships posted yet</h3>
                <p className="text-slate-500">Your recently posted internships will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                          <span className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {post.company}
                          </span>
                          {post.location && (
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {post.location}
                            </span>
                          )}
                          {post.stipend && (
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {post.stipend}
                            </span>
                          )}
                        </div>
                        {post.practice_areas && post.practice_areas.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.practice_areas.map((area, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                {area}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        {post.created_at && formatDate(post.created_at)}
                      </div>
                    </div>
                    
                    {post.description && (
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        {post.description.length > 200 ? `${post.description.substring(0, 200)}...` : post.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex space-x-4 text-xs text-slate-500">
                        {post.duration && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.duration}
                          </span>
                        )}
                        {post.application_deadline && (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Apply by {formatDate(post.application_deadline)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}