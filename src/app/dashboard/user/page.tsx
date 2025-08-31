// src/app/dashboard/user/page.tsx (Updated for MongoDB - Chat System Removed)
'use client'
import React, { useState } from 'react'
import { User, FileText, Briefcase, Target, Users, BarChart3, Trophy, Star,
  Bookmark, Clock, GraduationCap, BookOpen, Award, Settings, Crown,
  UserCog, Bell, ChevronDown, X
} from 'lucide-react'
import Hero from '../../components/Hero'
import { useAuth } from '@/hooks/useAuth'

const Dashboard = () => {
  const { user, loading } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Get user display info
  const getDisplayName = () => {
    if (!user?.profile) return 'User'
    
    if (user.role === 'student') {
      return `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() || 'Student'
    } else {
      return user.profile.companyName || 'Company'
    }
  }

  const getSubtitle = () => {
    if (!user?.profile) return 'Professional'
    
    if (user.role === 'student') {
      return user.profile.university || 'Student'
    } else {
      return user.profile.industry || 'Company'
    }
  }

  const firstName = getDisplayName().split(' ')[0] || 'User'

  // Profile menu items
  const profileMenuItems = [
    { icon: User, label: "View Profile", href: "/profile" },
    { icon: FileText, label: "Applications", href: "/applications" },
    { icon: FileText, label: "Resume Builder", href: "/resume" },
    { icon: Briefcase, label: "My Jobs & Internships", href: "/my-jobs" },
    { icon: Target, label: "My Opportunities", href: "/opportunities" },
    { icon: Users, label: "Referrals", href: "/referrals" },
    { icon: BarChart3, label: "My Rounds", href: "/rounds" },
    { icon: Trophy, label: "Nominations", href: "/nominations" },
    { icon: Star, label: "Watchlist", href: "/watchlist" },
    { icon: Bookmark, label: "Bookmarked", href: "/bookmarks" },
    { icon: Clock, label: "Recently Viewed", href: "/recent" },
    { icon: GraduationCap, label: "Mentor Sessions", href: "/mentors" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: Award, label: "Certificates", href: "/certificates" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Crown, label: "LEXHAVEN Pro", href: "/pro", premium: true },
    { icon: UserCog, label: "Organizer Dashboard", href: "/organizer" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">Please log in to access your dashboard.</p>
          <a href="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Navbar */}
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
                    className="h-10 object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </a>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <a href="/dashboard/user" className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg border border-blue-100">
                  Dashboard
                </a>
                <a href="/internships" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Internships
                </a>
                <a href="/competitions" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Competitions
                </a>
                <a href="/webinars" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Webinars
                </a>
                <a href="/courses" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Courses
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
                    3
                  </span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl h-9 w-9 flex items-center justify-center text-sm font-semibold shadow-sm">
                    {firstName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-slate-900">{getDisplayName()}</div>
                    <div className="text-xs text-slate-500 font-medium">{getSubtitle()}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Animated Dropdown */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Executive Welcome */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-1 h-8 bg-slate-900 rounded-full"></div>
                <div>
                  <span className="text-slate-600 text-sm font-medium tracking-wider uppercase">Dashboard Overview</span>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-light text-slate-900 mb-2">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                Your comprehensive legal career platform. Manage applications, track opportunities, 
                and advance your professional development with precision and efficiency.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-light text-slate-900">{getSubtitle()}</div>
                <div className="text-sm text-slate-500">Member since {new Date().getFullYear()}</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-light text-slate-700">{firstName.charAt(0)}</span>
              </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <a href="/browseinternships">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors duration-200 flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Browse Opportunities</span>
                </button>
                </a>
                <button className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>My Applications</span>
                </button>
                <button className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Progress Report</span>
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Hero/>
    </div>
  )
}

export default Dashboard