// components/Navbar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Scale, User, Briefcase, Calendar, BookOpen, Trophy, PenTool } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const navigationItems = [
    {
      name: 'Internships',
      href: '/internships',
      icon: <Briefcase className="w-4 h-4" />,
      children: [
        { name: 'Browse Internships', href: '/internships' },
        { name: 'Post Internship', href: '/post-internship' },
        { name: 'My Applications', href: '/applications' }
      ]
    },
    {
      name: 'Events',
      href: '/events',
      icon: <Calendar className="w-4 h-4" />,
      children: [
        { name: 'Webinars', href: '/webinars' },
        { name: 'Legal Workshops', href: '/workshops' },
        { name: 'Career Fairs', href: '/career-fairs' }
      ]
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: <BookOpen className="w-4 h-4" />,
      children: [
        { name: 'Learning Materials', href: '/learning' },
        { name: 'CV Builder', href: '/cv-builder' },
        { name: 'Legal Guides', href: '/guides' }
      ]
    },
    {
      name: 'Competitions',
      href: '/competitions',
      icon: <Trophy className="w-4 h-4" />
    },
    {
      name: 'Skills',
      href: '/skills',
      icon: <PenTool className="w-4 h-4" />,
      children: [
        { name: 'Skill Assessment', href: '/assessment' },
        { name: 'Courses', href: '/courses' },
        { name: 'Certifications', href: '/certifications' }
      ]
    }
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LegalConnect
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
                
                {item.children && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                  {item.children && (
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm transition-colors duration-200"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar