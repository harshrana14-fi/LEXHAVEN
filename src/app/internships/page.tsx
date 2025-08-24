"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, MapPin, DollarSign, Calendar, Clock, Search, Filter, Briefcase, Scale, Eye, Users, Award, ChevronDown, X, ExternalLink } from "lucide-react";

interface Internship {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  stipend: string;
  created_at: string;
  duration?: string;
  requirements?: string;
  practice_areas?: string[];
  application_deadline?: string;
  contact_email?: string;
  firm_size?: string;
  about_firm?: string;
  status?: string;
  is_paid?: boolean;
}

export default function BrowseInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPracticeArea, setSelectedPracticeArea] = useState("");
  const [selectedFirmSize, setSelectedFirmSize] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Get unique values for filters
  const [locations, setLocations] = useState<string[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [firmSizes, setFirmSizes] = useState<string[]>([]);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInternships(data);
        setFilteredInternships(data);
        
        // Extract unique values for filters
        const uniqueLocations = [...new Set(data.map(i => i.location).filter(Boolean))];
        const uniquePracticeAreas = [...new Set(data.flatMap(i => i.practice_areas || []))];
        const uniqueFirmSizes = [...new Set(data.map(i => i.firm_size).filter(Boolean))];
        
        setLocations(uniqueLocations);
        setPracticeAreas(uniquePracticeAreas);
        setFirmSizes(uniqueFirmSizes);
      }
      setLoading(false);
    };

    fetchInternships();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...internships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((internship) => internship.location === selectedLocation);
    }

    // Practice area filter
    if (selectedPracticeArea) {
      filtered = filtered.filter((internship) =>
        internship.practice_areas?.includes(selectedPracticeArea)
      );
    }

    // Firm size filter
    if (selectedFirmSize) {
      filtered = filtered.filter((internship) => internship.firm_size === selectedFirmSize);
    }

    // Paid filter
    if (showPaidOnly) {
      filtered = filtered.filter((internship) => internship.is_paid);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "company":
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "deadline":
        filtered.sort((a, b) => {
          if (!a.application_deadline) return 1;
          if (!b.application_deadline) return -1;
          return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
        });
        break;
    }

    setFilteredInternships(filtered);
  }, [internships, searchTerm, selectedLocation, selectedPracticeArea, selectedFirmSize, showPaidOnly, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedPracticeArea("");
    setSelectedFirmSize("");
    setShowPaidOnly(false);
    setSortBy("newest");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlineSoon = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Legal Internships</h1>
                <p className="text-slate-600 mt-1">Discover exceptional opportunities in the legal profession</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{filteredInternships.length}</div>
              <div className="text-sm text-slate-600">Available Positions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search internships, companies, or descriptions..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company A-Z</option>
              <option value="deadline">Deadline Soon</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Practice Area</label>
                  <select
                    value={selectedPracticeArea}
                    onChange={(e) => setSelectedPracticeArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Practice Areas</option>
                    {practiceAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Firm Size</label>
                  <select
                    value={selectedFirmSize}
                    onChange={(e) => setSelectedFirmSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Firm Sizes</option>
                    {firmSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPaidOnly}
                      onChange={(e) => setShowPaidOnly(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Paid Only</span>
                  </label>
                </div>
              </div>

              {(searchTerm || selectedLocation || selectedPracticeArea || selectedFirmSize || showPaidOnly) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center px-3 py-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading internships...</p>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No internships found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or check back later for new opportunities</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInternships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-2xl font-bold text-slate-800 mr-4">{internship.title}</h2>
                        <div className="flex items-center space-x-2">
                          {internship.is_paid && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                              PAID
                            </span>
                          )}
                          {internship.application_deadline && isDeadlineSoon(internship.application_deadline) && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                              DEADLINE SOON
                            </span>
                          )}
                          {internship.application_deadline && isDeadlinePassed(internship.application_deadline) && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                              EXPIRED
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-slate-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">{internship.company}</span>
                        </div>
                        {internship.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{internship.location}</span>
                          </div>
                        )}
                        {internship.stipend && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{internship.stipend}</span>
                          </div>
                        )}
                      </div>

                      {/* Practice Areas */}
                      {internship.practice_areas && internship.practice_areas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {internship.practice_areas.map((area, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-slate-700 leading-relaxed">
                      {expandedCard === internship.id
                        ? internship.description
                        : `${internship.description?.substring(0, 200)}${internship.description && internship.description.length > 200 ? '...' : ''}`
                      }
                    </p>
                    {internship.description && internship.description.length > 200 && (
                      <button
                        onClick={() => setExpandedCard(expandedCard === internship.id ? null : internship.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                      >
                        {expandedCard === internship.id ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* Additional Details (when expanded) */}
                  {expandedCard === internship.id && (
                    <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
                      {internship.requirements && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">Requirements</h4>
                          <p className="text-slate-700">{internship.requirements}</p>
                        </div>
                      )}
                      
                      {internship.about_firm && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">About the Firm</h4>
                          <p className="text-slate-700">{internship.about_firm}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      {internship.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{internship.duration}</span>
                        </div>
                      )}
                      
                      {internship.firm_size && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{internship.firm_size}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {formatDate(internship.created_at)}</span>
                      </div>

                      {internship.application_deadline && (
                        <div className={`flex items-center space-x-1 ${
                          isDeadlineSoon(internship.application_deadline) 
                            ? 'text-orange-600 font-medium' 
                            : isDeadlinePassed(internship.application_deadline)
                            ? 'text-red-600'
                            : ''
                        }`}>
                          <Calendar className="h-4 w-4" />
                          <span>Apply by {formatDate(internship.application_deadline)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {internship.contact_email && (
                        <a
                          href={`mailto:${internship.contact_email}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </a>
                      )}
                      
                      <button
                        onClick={() => setExpandedCard(expandedCard === internship.id ? null : internship.id)}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {expandedCard === internship.id ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}