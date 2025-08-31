"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Scale,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Search,
  Filter,
  Briefcase,
  Mail,
  User,
  MessageSquare,
  Send,
  X,
  CheckCircle,
  ExternalLink,
  Clock,
  Menu,
  Bell,
  Home,
} from "lucide-react";

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

export default function BrowsePage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await axios.get("/api/internships", { params: { q } });
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching internships:", err);
    }
    setLoading(false);
  }

  const filteredItems = items.filter((item) => {
    if (filterBy === "all") return true;
    if (filterBy === "paid")
      return item.stipend && item.stipend.toLowerCase() !== "unpaid";
    if (filterBy === "unpaid")
      return !item.stipend || item.stipend.toLowerCase() === "unpaid";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-18">
            {/* Logo + Brand */}
            <div className="flex items-center">
              <a href="#" className="group flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/images/logobg1.png"
                    alt="LEXHAVEN"
                    className="h-45 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* User Actions */}
              <div className="flex items-center gap-2">
                <a href="/">
                  <button className="p-2 text-gray-600 hover:text-blue-700 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                    <Home className="h-5 w-5" />
                  </button>
                </a>
                <a
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Register
                </a>
              </div>

              {/* Mobile Menu */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Tagline Section */}
        <div className="border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-amber-50/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-600 text-sm">
                  Connect with top law firms • Discover premium internship
                  opportunities • Build your legal career
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>All India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-36"></div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">
              Find Legal Internships
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchList()}
                className="w-full pl-10 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                placeholder="Search by position, firm, location, or keywords..."
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="pl-10 pr-8 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="all">All Positions</option>
                  <option value="paid">Paid Only</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <button
                onClick={fetchList}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>
                {filteredItems.length} internship
                {filteredItems.length !== 1 ? "s" : ""} found
              </span>
            </div>
            {filterBy !== "all" && (
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  Filter:{" "}
                  {filterBy === "paid" ? "Paid Positions" : "Unpaid Positions"}
                </span>
                <button
                  onClick={() => setFilterBy("all")}
                  className="text-blue-600 hover:text-blue-700 text-xs underline"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">
                Loading internship opportunities...
              </p>
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <InternshipCard key={item._id} internship={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
              <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No Internships Found
              </h3>
              <p className="text-slate-600 mb-6">
                {q
                  ? `No results found for "${q}". Try adjusting your search terms.`
                  : "No internship postings available at the moment."}
              </p>
              {q && (
                <button
                  onClick={() => {
                    setQ("");
                    fetchList();
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InternshipCard({ internship }: { internship: Internship }) {
  const [showModal, setShowModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
          <h2 className="text-xl font-bold mb-2">{internship.title}</h2>
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="h-4 w-4" />
            <span className="font-medium">{internship.firmName}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Location and Stipend */}
          <div className="flex flex-wrap gap-4 mb-4">
            {internship.location && (
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{internship.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span
                className={`font-medium ${
                  internship.stipend ? "text-green-700" : "text-slate-500"
                }`}
              >
                {internship.stipend || "Stipend not specified"}
              </span>
            </div>
          </div>

          {/* Role Description */}
          {internship.roleDescription && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Position Overview
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {showFullDescription
                  ? internship.roleDescription
                  : truncateText(internship.roleDescription, 200)}
                {internship.roleDescription.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-700 ml-2 text-sm font-medium"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Quick Requirements Preview */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Key Requirements
              </h3>
              <ul className="space-y-1">
                {internship.requirements.slice(0, 2).map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
                {internship.requirements.length > 2 && (
                  <li className="text-sm text-blue-600 font-medium">
                    +{internship.requirements.length - 2} more requirements
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/apply?id=${internship._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply Now
            </Link>

            <a
              href={`/internship/${internship._id}`}
              className="bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Details
            </a>
          </div>

          {/* Posted Time */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Recently posted</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
