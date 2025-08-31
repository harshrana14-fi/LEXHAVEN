// components/Navbar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Scale,
  User,
  Briefcase,
  Calendar,
  BookOpen,
  Trophy,
  PenTool,
  Search,
  Plus,
  Building,
  ChevronDown,
  Settings,
  Users,
  Target,
  BarChart3,
  Award,
  MessageSquare,
  FileText,
  Bell,
  Globe,
  Shield,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    {
      name: "Internships",
      href: "/browseinternships",
    },
    {
      name: "Jobs",
      href: "/jobs",
    },
    {
      name: "Competitions",
      href: "/competitions",
    },
    {
      name: "Practice",
      href: "/practice",
    },
    {
      name: "Mentorships",
      href: "/mentorships",
      children: [
        {
          name: "Find Mentors",
          href: "/mentors",
          desc: "Connect with senior advocates & legal experts",
          icon: <User className="w-4 h-4" />,
        },
        {
          name: "1-on-1 Sessions",
          href: "/sessions",
          desc: "Personalized career guidance sessions",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          name: "Group Mentoring",
          href: "/group-mentoring",
          desc: "Collaborative learning with peers",
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: "Industry Experts",
          href: "/experts",
          desc: "Connect with specialized professionals",
          icon: <Award className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Resources",
      href: "#",
      icon: <Globe className="w-4 h-4" />,
      children: [
        {
          name: "Events & Webinars",
          href: "/events",
          desc: "Join live legal sessions & networking events",
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          name: "Legal Library",
          href: "/resources",
          desc: "Comprehensive study materials & case studies",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: "CV Builder",
          href: "/cv-builder",
          desc: "Create professional legal profiles",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          name: "Career Guidance",
          href: "/career-guidance",
          desc: "Strategic career planning tools",
          icon: <Target className="w-4 h-4" />,
        },
        {
          name: "News & Insights",
          href: "/news",
          desc: "Latest legal industry developments",
          icon: <Bell className="w-4 h-4" />,
        },
      ],
    },
  ];

  const hostDropdownItems = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Opportunity",
      description: "Create engaging opportunities for legal community",
      href: "#",
      color: "from-amber-400 to-orange-500",
      hasNested: true,
      nested: [
        {
          icon: <Trophy className="w-4 h-4" />,
          title: "Competition",
          description: "Moot courts, debates & legal contests",
          href: "/host-competition",
          badge: "Popular",
        },
        {
          icon: <Calendar className="w-4 h-4" />,
          title: "Event",
          description: "Webinars, workshops & conferences",
          href: "/host-event",
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: "Course",
          description: "Legal education & training programs",
          href: "/host-course",
        },
        {
          icon: <Award className="w-4 h-4" />,
          title: "Hackathon",
          description: "Legal tech innovation challenges",
          href: "/host-hackathon",
          badge: "New",
        },
        {
          icon: <MessageSquare className="w-4 h-4" />,
          title: "Workshop",
          description: "Interactive skill development sessions",
          href: "/host-workshop",
        },
        {
          icon: <FileText className="w-4 h-4" />,
          title: "Seminar",
          description: "Knowledge sharing & networking",
          href: "/host-seminar",
        },
      ],
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Jobs & Internships",
      description: "Recruit top legal talent for your organization",
      href: "/post-job",
      color: "from-blue-400 to-indigo-500",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Assessments",
      description: "Evaluate candidates with custom tests",
      href: "/create-assessment",
      color: "from-purple-400 to-violet-500",
      badge: "Pro",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Organizer Dashboard",
      description: "Manage all your listings & analytics",
      href: "/dashboard",
      color: "from-slate-400 to-slate-600",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setActiveNestedDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveDropdown(null);
    setActiveNestedDropdown(null);
    setIsMenuOpen(false);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setActiveNestedDropdown(null);
  };

  const toggleNestedDropdown = (name: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setActiveNestedDropdown(activeNestedDropdown === name ? null : name);
  };

  const handleOpportunityClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleNestedDropdown("opportunity", event);
  };

  const handleOpportunityHover = () => {
    setActiveNestedDropdown("opportunity");
  };

  const handleOpportunityLeave = (event: React.MouseEvent) => {
    // Only close if not moving to the nested dropdown
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('[data-nested-dropdown="opportunity"]')) {
      setTimeout(() => {
        setActiveNestedDropdown(null);
      }, 150);
    }
  };

  return (
    <nav
      className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-lg shadow-slate-900/5"
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo Section */}
          <div className="flex items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToHome();
              }}
              className="group flex items-center space-x-3"
            >
              <div className="relative">
                <img
                  src="/images/logobg1.png"
                  alt="LEXHAVEN"
                  className="h-45 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    className={`flex items-center space-x-2 px-4 py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 group ${
                      activeDropdown === item.name
                        ? "text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm"
                        : ""
                    }`}
                  >
                    <span className="text-slate-400 group-hover:text-blue-500 transition-colors duration-300">
                      {item.icon}
                    </span>
                    <span className="font-semibold">{item.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-all duration-300 ${
                        activeDropdown === item.name ? "rotate-180 text-blue-500" : "text-slate-400"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 group"
                  >
                    <span className="text-slate-400 group-hover:text-blue-500 transition-colors duration-300">
                      {item.icon}
                    </span>
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                )}

                {item.children && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-3 w-80 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-4 pb-4 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                        {item.icon}
                        <span>{item.name}</span>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Explore {item.name.toLowerCase()} opportunities
                      </p>
                    </div>
                    <div className="mt-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-start space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 transition-all duration-300 mx-2 rounded-xl group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors duration-300">
                            <div className="text-slate-600 group-hover:text-blue-600 transition-colors duration-300">
                              {child.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                              {child.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {child.desc}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Host Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => toggleDropdown("host")}
                className={`flex items-center space-x-2 px-5 py-3 text-slate-700 hover:text-white font-semibold transition-all duration-300 text-sm rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 ${
                  activeDropdown === "host"
                    ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 shadow-lg -translate-y-0.5"
                    : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Host</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeDropdown === "host" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "host" && (
                <div className="absolute top-full right-0 mt-3 w-96 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-6 pb-4 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span>Host with LEXHAVEN</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Create opportunities and engage with the legal community
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {hostDropdownItems.map((item, index) => (
                      <div key={item.title} className="relative mx-2">
                        {item.hasNested ? (
                          <div className="relative">
                            <button
                              onClick={handleOpportunityClick}
                              onMouseEnter={handleOpportunityHover}
                              onMouseLeave={handleOpportunityLeave}
                              className="flex items-center justify-between w-full space-x-4 px-4 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 transition-all duration-300 rounded-xl group"
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                >
                                  <div className="text-white">{item.icon}</div>
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.title}
                                  </div>
                                  <div className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                  6 types
                                </span>
                                <ChevronRight
                                  className={`w-4 h-4 text-slate-400 transition-all duration-300 ${
                                    activeNestedDropdown === "opportunity" ? "rotate-90 text-blue-500" : ""
                                  }`}
                                />
                              </div>
                            </button>

                            {/* Nested Opportunity Dropdown - positioned to the right */}
                            {activeNestedDropdown === "opportunity" && (
                              <div
                                data-nested-dropdown="opportunity"
                                className="absolute left-full top-0 ml-2 w-80 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-4 z-60 animate-in fade-in slide-in-from-left-2 duration-300"
                                onMouseEnter={() => setActiveNestedDropdown("opportunity")}
                                onMouseLeave={() => setActiveNestedDropdown(null)}
                              >
                                <div className="px-4 pb-3 border-b border-slate-100">
                                  <h4 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-amber-500" />
                                    <span>Opportunity Types</span>
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Choose the perfect format for your event
                                  </p>
                                </div>
                                <div className="mt-3 grid grid-cols-1 gap-1 px-2">
                                  {item.nested?.map((nestedItem) => (
                                    <Link
                                      key={nestedItem.title}
                                      href={nestedItem.href}
                                      className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/30 transition-all duration-300 rounded-xl group"
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setActiveNestedDropdown(null);
                                      }}
                                    >
                                      <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md group-hover:bg-blue-50 transition-all duration-300">
                                        <div className="text-blue-600 group-hover:text-blue-700">{nestedItem.icon}</div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 text-sm flex items-center space-x-2">
                                          <span>{nestedItem.title}</span>
                                          {nestedItem.badge && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                              nestedItem.badge === "New" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-amber-100 text-amber-700"
                                            }`}>
                                              {nestedItem.badge}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                                          {nestedItem.description}
                                        </div>
                                      </div>
                                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="flex items-center space-x-4 px-4 py-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 transition-all duration-300 rounded-xl group"
                            onClick={() => {
                              setActiveDropdown(null);
                              setActiveNestedDropdown(null);
                            }}
                          >
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                            >
                              <div className="text-white">{item.icon}</div>
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                                {item.title}
                              </div>
                              <div className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                                {item.description}
                              </div>
                            </div>
                            {item.badge && (
                              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                                {item.badge}
                              </div>
                            )}
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              href="/auth"
              className="ml-4 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-slate-600"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button className="p-2.5 text-slate-700 hover:text-blue-600 transition-colors duration-200 rounded-xl hover:bg-slate-50">
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-blue-600 transition-colors duration-200 rounded-xl hover:bg-slate-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/60 bg-white/98 backdrop-blur-xl mt-2 rounded-2xl shadow-2xl mx-2 mb-4">
            {/* Mobile Search */}
            <div className="px-4 py-4 border-b border-slate-200/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search legal opportunities..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="px-2 py-4 space-y-2 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full text-left px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 rounded-xl font-semibold transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-slate-400">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="ml-6 space-y-1 mt-2 pl-4 border-l-2 border-blue-100">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="flex items-center space-x-3 px-3 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition-colors duration-200"
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMenuOpen(false);
                              }}
                            >
                              <span className="text-slate-400">{child.icon}</span>
                              <div>
                                <div className="font-medium">{child.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {child.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 rounded-xl font-semibold transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-slate-400">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}

              <div className="border-t border-slate-200/60 pt-4 mt-4 space-y-3">
                <button
                  onClick={() => toggleDropdown("host-mobile")}
                  className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 rounded-xl font-semibold transition-colors duration-200 border border-slate-200"
                >
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Host</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === "host-mobile" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === "host-mobile" && (
                  <div className="ml-4 space-y-2">
                    {hostDropdownItems.map((item) => (
                      <div key={item.title}>
                        {item.hasNested ? (
                          <>
                            <button
                              onClick={() => toggleNestedDropdown("opportunity-mobile")}
                              className="flex items-center justify-between w-full space-x-3 px-3 py-3 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}
                                >
                                  <div className="text-white text-sm">{item.icon}</div>
                                </div>
                                <div className="text-left">
                                  <div className="font-semibold text-slate-800 text-sm">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  activeNestedDropdown === "opportunity-mobile" ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {activeNestedDropdown === "opportunity-mobile" && (
                              <div className="ml-6 space-y-1 mt-2">
                                {item.nested?.map((nestedItem) => (
                                  <Link
                                    key={nestedItem.title}
                                    href={nestedItem.href}
                                    className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setActiveNestedDropdown(null);
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    <div className="p-2 rounded bg-white shadow-sm">
                                      <div className="text-blue-600 text-xs">{nestedItem.icon}</div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-slate-800 text-sm flex items-center space-x-2">
                                        <span>{nestedItem.title}</span>
                                        {nestedItem.badge && (
                                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                            nestedItem.badge === "New" 
                                              ? "bg-green-100 text-green-700" 
                                              : "bg-amber-100 text-amber-700"
                                          }`}>
                                            {nestedItem.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {nestedItem.description}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className="flex items-center space-x-3 px-3 py-3 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}
                            >
                              <div className="text-white text-sm">{item.icon}</div>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-800 text-sm flex items-center space-x-2">
                                <span>{item.title}</span>
                                {item.badge && (
                                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/auth"
                  className="block w-full text-center bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;