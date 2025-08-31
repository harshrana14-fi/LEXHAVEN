//  src/app/dashboard/company/page.tsx (Updated for MongoDB - Chat System Removed)
'use client'
import React, { useState } from 'react'
import { 
  Building2, Users, Briefcase, FileText, Calendar, TrendingUp, 
  Filter, Plus, MoreHorizontal, Download,
  ChevronDown, X, Bell, Settings, Crown, UserCog,
  BarChart3, MapPin, Award, Target, Clock, CheckCircle,
  BookOpen, Trophy
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const CompanyDashboard = () => {
  const { user, loading } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Sample data for dashboard metrics
  const [dashboardStats] = useState({
    totalApplications: 247,
    activeInternships: 12,
    scheduledInterviews: 8,
    newMessages: 15
  })

  // Get display info
  const getDisplayName = () => {
    if (!user?.profile) return 'Company'
    return user.profile.companyName || 'Company'
  }

  const getCompanyInitials = () => {
    const name = getDisplayName()
    return name.split(' ').map((word: string) => word.charAt(0)).join('').slice(0, 2) || 'CF'
  }

  const getCompanyType = () => {
    return user?.profile?.industry || 'Law Firm'
  }

  const getCompanyLocation = () => {
    return user?.profile?.location || 'Mumbai, India'
  }

  const getCompanySize = () => {
    return user?.profile?.companySize || '50-100 employees'
  }

  // Company profile menu items
  const profileMenuItems = [
    { icon: Building2, label: "Company Profile", href: "/company/profile" },
    { icon: Users, label: "Team Management", href: "/company/team" },
    { icon: Briefcase, label: "Posted Jobs", href: "/company/jobs" },
    { icon: FileText, label: "Applications", href: "/company/applications" },
    { icon: Calendar, label: "Interviews", href: "/company/interviews" },
    { icon: BarChart3, label: "Analytics", href: "/company/analytics" },
    { icon: Target, label: "Hiring Goals", href: "/company/goals" },
    { icon: Award, label: "Company Reviews", href: "/company/reviews" },
    { icon: BookOpen, label: "Training Programs", href: "/company/training" },
    { icon: Trophy, label: "Achievements", href: "/company/achievements" },
    { icon: Settings, label: "Account Settings", href: "/company/settings" },
    { icon: Crown, label: "LEXHAVEN Pro", href: "/pro", premium: true },
    { icon: UserCog, label: "Admin Panel", href: "/admin" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading company dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'company') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">This dashboard is only accessible to company accounts.</p>
          <a href="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Company Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <a href="/" className="group flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/images/logobg1.png"
                    alt="LEXHAVEN Logo"
                    className="h-38 object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </a>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <a href="/dashboard/company" className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg border border-blue-100">
                  Dashboard
                </a>
                <a href="/post" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Post Jobs
                </a>
                <a href="/company/applications" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Applications
                </a>
                <a href="/company/analytics" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Analytics
                </a>
                <a href="/company/team" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Team
                </a>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {dashboardStats.newMessages}
                  </span>
                </button>
              </div>

              {/* Company Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl h-9 w-9 flex items-center justify-center text-sm font-semibold shadow-sm">
                    {getCompanyInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-slate-900">{getDisplayName()}</div>
                    <div className="text-xs text-slate-500 font-medium">{getCompanyType()}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Company Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{getDisplayName()}</div>
                        <div className="text-xs text-slate-500">{user?.email || 'Email not available'}</div>
                      </div>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="max-h-96 overflow-y-auto py-2">
                      {profileMenuItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-sm hover:bg-slate-50 transition-all duration-200 group ${
                            item.premium 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${
                            item.premium 
                              ? 'bg-amber-100 group-hover:bg-amber-200' 
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="flex-1 font-medium">{item.label}</span>
                          {item.premium && (
                            <div className="flex items-center space-x-1">
                              <Crown className="h-3 w-3" />
                              <span className="text-xs font-semibold">PRO</span>
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Executive Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">
                  {getCompanyInitials()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{getDisplayName()}</h1>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-medium">{getCompanyType()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{getCompanyLocation()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{getCompanySize()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
                Manage your legal talent acquisition, track applications, and build your team 
                with our comprehensive recruitment platform designed for law firms.
              </p>
            </div>
            <div className="hidden lg:block text-right">
              <div className="text-sm text-slate-500 mb-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-2xl font-light text-slate-900">Company Dashboard</div>
            </div>
          </div>
          
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap gap-3">
              <a href="/post">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Post New Job</span>
                </button>
              </a>
              <button className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>View Applications</span>
              </button>
              <button className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardStats.totalApplications}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">+12% this month</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Positions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Active Positions</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardStats.activeInternships}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">5 filled</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Scheduled Interviews */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Scheduled Interviews</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardStats.scheduledInterviews}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-600 text-sm font-medium">3 today</span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* New Messages */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">System Notifications</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardStats.newMessages}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Bell className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-600 text-sm font-medium">Pending alerts</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                      <Filter className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                      <Download className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-semibold">
                        JS
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            John Smith
                          </h4>
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                            New
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">Senior Associate - Corporate Law</p>
                        <p className="text-xs text-slate-500">Applied 2 hours ago • Harvard Law School</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                  View All Applications →
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Post New Position</div>
                    <div className="text-xs text-slate-500">Create internship or job posting</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Schedule Interview</div>
                    <div className="text-xs text-slate-500">Book candidate meetings</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">View Analytics</div>
                    <div className="text-xs text-slate-500">Hiring performance metrics</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Manage Team</div>
                    <div className="text-xs text-slate-500">Add recruiters and managers</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Interviews</h3>
              <div className="space-y-4">
                {[
                  { time: "10:00 AM", candidate: "Sarah Johnson", position: "Junior Associate" },
                  { time: "2:30 PM", candidate: "Michael Chen", position: "Legal Intern" },
                  { time: "4:00 PM", candidate: "Emma Davis", position: "Senior Associate" }
                ].map((interview, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-slate-900">{interview.time}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{interview.candidate}</div>
                      <div className="text-xs text-slate-500">{interview.position}</div>
                    </div>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors duration-200">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Hiring Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Application Rate</span>
                  <span className="text-sm font-semibold text-slate-900">92%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Interview Success</span>
                  <span className="text-sm font-semibold text-slate-900">78%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Offer Acceptance</span>
                  <span className="text-sm font-semibold text-slate-900">85%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard;