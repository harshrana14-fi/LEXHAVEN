// components/Hero.tsx
import Link from 'next/link'
import { Search, ArrowRight, Star, Users, Building, Award, Briefcase, GraduationCap, Trophy } from 'lucide-react'
import React from 'react'

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 text-blue-700 rounded-full text-sm font-semibold backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2 fill-current" />
              India&apos;s #1 Legal Career Platform
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-slate-900">Unlock Your</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Legal Career
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                Explore opportunities from top law firms, join prestigious moot courts, gain practical experience through internships, 
                and connect with mentors who have shaped landmark cases.
              </p>
            </div>

            {/* Testimonial */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <p className="text-slate-700 font-medium">"Just Secured My Dream Law Internship!"</p>
                  <p className="text-slate-500 text-sm">- Kunal, Law Student</p>
                </div>
                <div className="ml-auto">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    PRO
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
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
            {[
              { title: "Internships", desc: "Gain Courtroom Experience", img: "https://tse4.mm.bing.net/th/id/OIP.E3Y68GCTPC9CZ10HrigAEgHaE7?pid=Api&P=0&h=220", color: "from-emerald-400 to-teal-500", },
              { title: "Mentorships", desc: "Guidance from Top Advocates", img: "https://i.pinimg.com/originals/80/11/44/801144eaaf4a208d99b75f72e6538913.jpg", color: "from-orange-400 to-red-500", },
              { title: "Jobs", desc: "Join Leading Law Firms", img: "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8", color: "from-blue-400 to-indigo-600",},
              { title: "Practice", desc: "Refine Legal Skills Daily", img: "https://tse2.mm.bing.net/th/id/OIP.4jdTPVOLFxe_ZEayyQaDXgHaEc?pid=Api&P=0&h=220", color: "from-purple-400 to-violet-600", icon: null },
              { title: "Competitions", desc: "Battle in Moot Courts", img: "/images/helloo.jpg", color: "from-yellow-400 via-orange-400 to-red-500", icon: <Trophy className="w-6 h-6 text-yellow-200" /> },
              { title: "More ➞", desc: "Explore Legal Resources", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba", color: "from-pink-400 to-rose-500", icon: null }
            ].map((card, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer overflow-hidden relative ${i === 4 || i === 5 ? "col-span-2" : ""}`}
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${card.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative z-10 space-y-2">
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.desc}</p>
                </div>
                {card.icon && <div className="absolute bottom-4 right-4">{card.icon}</div>}
              </div>
            ))}
          </div>
        </div>

       

        {/* Who's Using Section */}
<div className="mt-20">
 <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  Who&apos;s Using Our Platform?
</h2>
  <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12">
    Empowering the entire legal ecosystem — from aspiring lawyers to top law firms — 
    with opportunities, tools, and connections.
  </p>

  <div className="grid md:grid-cols-3 gap-8">
    {/* Card 1 */}
    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Law Students & Professionals</h3>
      <ul className="text-slate-600 space-y-2 flex-1">
        <li>• Access top legal internships & clerkships</li>
        <li>• Participate in moot courts & debates</li>
        <li>• Upskill with workshops & mentorships</li>
        <li>• Showcase your profile to recruiters</li>
      </ul>
    </div>

    {/* Card 2 */}
    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Law Firms & Recruiters</h3>
      <ul className="text-slate-600 space-y-2 flex-1">
        <li>• Find skilled law graduates</li>
        <li>• Post jobs & internships</li>
        <li>• Streamline hiring with AI tools</li>
        <li>• Connect with talent nationwide</li>
      </ul>
    </div>

    {/* Card 3 */}
    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Law Colleges & Universities</h3>
      <ul className="text-slate-600 space-y-2 flex-1">
        <li>• Offer top competitions & job opportunities</li>
        <li>• Partner with firms for placements</li>
        <li>• Track student performance</li>
        <li>• Foster academia-industry collaboration</li>
      </ul>
    </div>
  </div>
</div>


        {/* Trusted By */}
<div className="mt-20 text-center overflow-hidden">
  <p className="text-slate-500 font-medium mb-12">
    Trusted by leading law firms & institutions
  </p>

  <div className="relative w-full overflow-hidden">
    <div className="flex animate-scroll gap-12 opacity-80">
      {/* Duplicate set for infinite loop */}
      {[...Array(2)].map((_, setIndex) => (
        <React.Fragment key={setIndex}>
          <img src="https://www.khaitanco.com/images/b-cele-logo.png" alt="Firm 1" className="h-10" />
          <img src="https://www.nyagrik.com/_next/image?url=%2Fnyagriklogo.png&w=128&q=75" alt="Firm 2" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14337638%2F954031_vaultprofileimage_1.gif&w=384&q=75" alt="Firm 3" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14351101%2Fcravath-logo-color-300x300-01.jpg&w=384&q=75" alt="Firm 4" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14342886%2Fquinn-emanuel.jpg&w=384&q=75" alt="Firm 5" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14337638%2F954031_vaultprofileimage_1.gif&w=384&q=75" alt="Firm 6" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F20741%2Fjonesday_logo.jpg&w=384&q=75" alt="Firm 7" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14351472%2Flogo-300x300.jpg&w=384&q=75" alt="Firm 8" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14339961%2Fgoodwin_logo.jpg&w=384&q=75" alt="Firm 9" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14346426%2Fmayer_brown_4c.jpg&w=384&q=75" alt="Firm 10" className="h-10" />
          <img src="https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14352900%2Fvault-gd-monogram-300x300-0625.jpg&w=384&q=75" alt="Firm 11" className="h-10" />
        </React.Fragment>
      ))}
    </div>
  </div>
</div>
      </div>
    </section>
  )
}

export default Hero
