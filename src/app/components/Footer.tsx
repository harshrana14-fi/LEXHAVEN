// components/Footer.tsx
'use client';
import Link from 'next/link'
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:-translate-y-1"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Intern-Portal
              </h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              India's premier platform connecting law students with top internship opportunities, skills development, and career growth in the legal sector.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              {[
                { name: 'Browse Internships', href: '/internships' },
                { name: 'Post Internship', href: '/post-internship' },
                { name: 'Legal Events', href: '/events' },
                { name: 'Competitions', href: '/competitions' },
                { name: 'CV Builder', href: '/cv-builder' },
                { name: 'Skill Assessment', href: '/assessment' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
            <div className="space-y-3">
              {[
                { name: 'Learning Materials', href: '/learning' },
                { name: 'Legal Guides', href: '/guides' },
                { name: 'Career Advice', href: '/career-advice' },
                { name: 'Interview Tips', href: '/interview-tips' },
                { name: 'Legal News', href: '/news' },
                { name: 'Blog', href: '/blog' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">hello@legalconnect.in</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-6">Get the latest internship opportunities and legal career insights delivered to your inbox.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 LegalConnect. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer