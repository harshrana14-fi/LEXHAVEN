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
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    {
      name: "Internships",
      href: "/internships",
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
          desc: "Connect with senior advocates",
        },
        {
          name: "1-on-1 Sessions",
          href: "/sessions",
          desc: "Personalized career guidance",
        },
        {
          name: "Group Mentoring",
          href: "/group-mentoring",
          desc: "Learn with peers",
        },
        {
          name: "Industry Experts",
          href: "/experts",
          desc: "Connect with specialists",
        },
      ],
    },
    {
      name: "More",
      href: "#",
      children: [
        {
          name: "Events & Webinars",
          href: "/events",
          desc: "Join live legal sessions",
        },
        {
          name: "Legal Resources",
          href: "/resources",
          desc: "Study materials & guides",
        },
        {
          name: "CV Builder",
          href: "/cv-builder",
          desc: "Create professional profile",
        },
        {
          name: "Career Guidance",
          href: "/career-guidance",
          desc: "Plan your legal career",
        },
        {
          name: "News & Updates",
          href: "/news",
          desc: "Latest legal industry news",
        },
      ],
    },
  ];

  const hostDropdownItems = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Opportunity",
      description: "Engage your target audience",
      href: "#",
      color: "from-yellow-400 to-orange-500",
      hasNested: true,
      nested: [
        {
          icon: <Trophy className="w-4 h-4" />,
          title: "Competition",
          description: "Host moot courts, debates & contests",
          href: "/host-competition",
        },
        {
          icon: <Calendar className="w-4 h-4" />,
          title: "Event",
          description: "Organize webinars & workshops",
          href: "/host-event",
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: "Course",
          description: "Create legal courses & training",
          href: "/host-course",
        },
        {
          icon: <Award className="w-4 h-4" />,
          title: "Hackathon",
          description: "Legal innovation challenges",
          href: "/host-hackathon",
        },
        {
          icon: <MessageSquare className="w-4 h-4" />,
          title: "Workshop",
          description: "Interactive learning sessions",
          href: "/host-workshop",
        },
        {
          icon: <FileText className="w-4 h-4" />,
          title: "Seminar",
          description: "Knowledge sharing sessions",
          href: "/host-seminar",
        },
      ],
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Jobs & Internships",
      description: "Hire the Right Talent",
      href: "/post-job",
      color: "from-pink-400 to-rose-500",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Assessments",
      description: "Evaluate candidates",
      href: "/create-assessment",
      color: "from-purple-400 to-indigo-500",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Go to organizer dashboard",
      description: "Manage listing, Festivals, Assessments",
      href: "/dashboard",
      color: "from-gray-400 to-gray-600",
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

  const toggleNestedDropdown = (name: string) => {
    setActiveNestedDropdown(activeNestedDropdown === name ? null : name);
  };

  const handleOpportunityClick = () => {
    setActiveNestedDropdown(activeNestedDropdown === "opportunity" ? null : "opportunity");
  };

  return (
    <nav
      className="bg-white/98 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-50 shadow-lg shadow-slate-900/5"
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // prevent default link behavior
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group"
            >
              <img
                src="/images/logobg1.png"
                alt="LEXHAVEN Logo"
                className="w- h-50 object-contain p-2 relative z-10 transition-transform duration-300 group-hover:scale-110"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 text-slate-700 hover:text-blue-600 transition-all duration-200 font-medium text-sm rounded-xl hover:bg-blue-50/60 ${
                      activeDropdown === item.name
                        ? "text-blue-600 bg-blue-50/60"
                        : ""
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1.5 px-4 py-2.5 text-slate-700 hover:text-blue-600 transition-all duration-200 font-medium text-sm rounded-xl hover:bg-blue-50/60"
                  >
                    <span>{item.name}</span>
                  </Link>
                )}

                {item.children && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/80 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-3 hover:bg-blue-50/80 transition-colors duration-200 mx-2 rounded-xl group"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                          {child.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {child.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Host Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("host")}
                className={`flex items-center space-x-2 px-4 py-2.5 text-slate-700 hover:text-blue-600 font-medium transition-all duration-200 text-sm rounded-xl hover:bg-slate-50/80 border border-slate-200/60 hover:border-blue-200 ${
                  activeDropdown === "host"
                    ? "text-blue-600 bg-blue-50/60 border-blue-200"
                    : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Host</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "host" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "host" && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/80 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {hostDropdownItems.map((item, index) => (
                    <div key={item.title} className="relative">
                      {item.hasNested ? (
                        <button
                          onClick={handleOpportunityClick}
                          className="flex items-center justify-between w-full space-x-4 px-4 py-4 hover:bg-slate-50/80 transition-colors duration-200 mx-2 rounded-xl group"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}
                            >
                              <div className="text-white">{item.icon}</div>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </div>
                              <div className="text-sm text-slate-500 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeNestedDropdown === "opportunity" ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center space-x-4 px-4 py-4 hover:bg-slate-50/80 transition-colors duration-200 mx-2 rounded-xl group"
                          onClick={() => {
                            setActiveDropdown(null);
                            setActiveNestedDropdown(null);
                          }}
                        >
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}
                          >
                            <div className="text-white">{item.icon}</div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-sm text-slate-500 mt-0.5">
                              {item.description}
                            </div>
                          </div>
                          {index < hostDropdownItems.length - 1 &&
                            item.title === "Assessments" && (
                              <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Upgrade
                              </div>
                            )}
                        </Link>
                      )}

                      {/* Nested Opportunity Dropdown */}
                      {item.hasNested && activeNestedDropdown === "opportunity" && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.nested?.map((nestedItem) => (
                            <Link
                              key={nestedItem.title}
                              href={nestedItem.href}
                              className="flex items-center space-x-3 px-3 py-3 hover:bg-blue-50/80 transition-colors duration-200 rounded-xl group"
                              onClick={() => {
                                setActiveDropdown(null);
                                setActiveNestedDropdown(null);
                              }}
                            >
                              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                <div className="text-blue-600">{nestedItem.icon}</div>
                              </div>
                              <div>
                                <div className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors text-sm">
                                  {nestedItem.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {nestedItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button className="p-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 rounded-xl hover:bg-slate-50/80">
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 rounded-xl hover:bg-slate-50/80"
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
          <div className="lg:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-sm mt-2 rounded-2xl shadow-xl mx-2 mb-2">
            {/* Mobile Search */}
            <div className="px-4 py-4 border-b border-slate-200/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                />
              </div>
            </div>

            <div className="px-2 py-3 space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full text-left px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl font-medium transition-colors duration-200"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="ml-4 space-y-1 mt-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg text-sm transition-colors duration-200"
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMenuOpen(false);
                              }}
                            >
                              <div className="font-medium">{child.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                {child.desc}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="border-t border-slate-200/60 pt-4 mt-4 space-y-2">
                <button
                  onClick={() => toggleDropdown("host-mobile")}
                  className="flex items-center justify-between w-full px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl font-medium transition-colors duration-200"
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
                  <div className="ml-4 space-y-1">
                    {hostDropdownItems.map((item) => (
                      <div key={item.title}>
                        {item.hasNested ? (
                          <>
                            <button
                              onClick={() => toggleNestedDropdown("opportunity-mobile")}
                              className="flex items-center justify-between w-full space-x-3 px-3 py-3 hover:bg-slate-50/80 rounded-xl transition-colors duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}
                                >
                                  <div className="text-white text-sm">{item.icon}</div>
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800 text-sm">
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
                              <div className="ml-6 space-y-1 mt-1">
                                {item.nested?.map((nestedItem) => (
                                  <Link
                                    key={nestedItem.title}
                                    href={nestedItem.href}
                                    className="flex items-center space-x-2 px-2 py-2 hover:bg-blue-50/80 rounded-lg transition-colors duration-200"
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setActiveNestedDropdown(null);
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    <div className="p-1 rounded bg-blue-100">
                                      <div className="text-blue-600 text-xs">{nestedItem.icon}</div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-800 text-xs">
                                        {nestedItem.title}
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
                            className="flex items-center space-x-3 px-3 py-3 hover:bg-slate-50/80 rounded-xl transition-colors duration-200"
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
                            <div>
                              <div className="font-medium text-slate-800 text-sm">
                                {item.title}
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
                  href="/login"
                  className="block w-full text-center bg-blue-600 text-white px-3 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
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