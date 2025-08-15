// components/Hero.tsx
import Link from 'next/link'
import {
  Search,
  ArrowRight,
  Star,
  Building,
  Briefcase,
  GraduationCap,
  Trophy
} from 'lucide-react'

const Hero = () => {
  const cards = [
    {
      title: "Internships",
      desc: "Gain Courtroom Experience",
      person: "/images/lawyer1.jpeg", 
      icon: <Briefcase className="w-6 h-6 text-yellow-600" />
    },
    {
      title: "Mentorships",
      desc: "Guidance from Top Advocates",
      person: "/3d/mentor-person.png",
      bg: "https://images.unsplash.com/photo-1603570415915-0a4b9c9c631b",
      icon: <GraduationCap className="w-6 h-6 text-white/80" />
    },
    {
      title: "Jobs",
      desc: "Join Leading Law Firms",
      person: "/3d/job-person.png",
      bg: "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8",
      icon: <Building className="w-8 h-8 text-white/80" />
    },
    {
      title: "Practice",
      desc: "Refine Legal Skills Daily",
      person: "/3d/practice-person.png",
      bg: "https://images.unsplash.com/photo-1589820296156-2454bb8b2c2c",
      icon: null
    },
    {
      title: "Competitions",
      desc: "Battle in Moot Courts",
      person: "/3d/competition-person.png",
      bg: "https://images.unsplash.com/photo-1580933908360-2b1f3b28e8e4",
      icon: <Trophy className="w-6 h-6 text-yellow-200" />
    },
    {
      title: "More",
      desc: "Explore Legal Resources",
      person: "/3d/more-person.png",
      bg: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      icon: null
    }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 text-blue-700 rounded-full text-sm font-semibold backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2 fill-current" />
              India&apos;s #1 Legal Career Platform
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-slate-900">Unlock Your</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Legal Career
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                Explore opportunities from top law firms, join prestigious moot courts,
                gain practical experience through internships, and connect with mentors
                who have shaped landmark cases.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <p className="text-slate-700 font-medium">
                    "Just Secured My Dream Law Internship!"
                  </p>
                  <p className="text-slate-500 text-sm">- Kunal, Law Student</p>
                </div>
                <div className="ml-auto">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    PRO
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/internships"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/post-internship"
                className="group border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm bg-white/60 hover:bg-white/80 transform hover:-translate-y-1"
              >
                For Law Firms
              </Link>
            </div>
          </div>

          {/* Right Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`group relative rounded-3xl p-6 text-white cursor-pointer overflow-hidden transform-gpu transition-transform duration-300 hover:scale-105`}
                style={{
                  perspective: '1000px',
                  gridColumn: i === 4 || i === 5 ? 'span 2' : undefined,
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${card.bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Text stays above image */}
                <div
                  className="relative z-20 space-y-2 transform-gpu transition-transform duration-300 group-hover:translate-z-6"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.desc}</p>
                </div>

                {card.icon && <div className="absolute bottom-4 right-4 z-20">{card.icon}</div>}

                {/* Person Image */}
                <img
                  src={card.person}
                  alt={card.title}
                  className="absolute bottom-0 right-0 w-28 md:w-36 lg:w-44 transform-gpu transition-transform duration-500 group-hover:scale-110 pointer-events-none z-10"
                  style={{
                    objectFit: 'contain',
                    transform: 'translateZ(60px)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Find Your Perfect Opportunity</h2>
            <p className="text-slate-600">Search from internships, jobs, moot courts, and legal events</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-2 shadow-2xl border border-white/50">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search law internships, firms, or skills..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-lg focus:outline-none text-slate-700 placeholder-slate-400"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Who's Using Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Who&apos;s Using Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-2">Law Students & Professionals</h3>
              <ul className="text-slate-600 space-y-2">
                <li>⚖️ Access top legal internships & clerkships</li>
                <li>🏆 Participate in moot courts & debates</li>
                <li>📚 Upskill with workshops & mentorships</li>
                <li>💼 Showcase your profile to recruiters</li>
              </ul>
            </div>
            <div className="bg-white/70 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-2">Law Firms & Recruiters</h3>
              <ul className="text-slate-600 space-y-2">
                <li>🔍 Find skilled law graduates</li>
                <li>📄 Post jobs & internships</li>
                <li>⚡ Streamline hiring with AI tools</li>
                <li>🌐 Connect with talent nationwide</li>
              </ul>
            </div>
            <div className="bg-white/70 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-2">Law Colleges & Universities</h3>
              <ul className="text-slate-600 space-y-2">
                <li>🎯 Offer top competitions & job opportunities</li>
                <li>🤝 Partner with firms for placements</li>
                <li>📊 Track student performance</li>
                <li>🏛 Foster academia-industry collaboration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trusted By */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 font-medium mb-8">Trusted by leading law firms & institutions</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            <img src="/logos/firm1.png" alt="Firm 1" className="h-10" />
            <img src="/logos/firm2.png" alt="Firm 2" className="h-10" />
            <img src="/logos/firm3.png" alt="Firm 3" className="h-10" />
            <img src="/logos/firm4.png" alt="Firm 4" className="h-10" />
            <img src="/logos/firm5.png" alt="Firm 5" className="h-10" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
