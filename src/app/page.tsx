// app/page.tsx
import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/Hero'
import Features from '@/app/components/Features'
import Stats from '@/app/components/Stats'
import RecentInternships from '@/app/components/recentinternhipevents'
import UpcomingEvents from '@/app/components/UpcomingEvents'
import Footer from '@/app/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <RecentInternships />
      <UpcomingEvents />
      <Footer />
    </div>
  )
}