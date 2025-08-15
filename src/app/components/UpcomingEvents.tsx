import Link from 'next/link'
import { Calendar, Clock, Users, MapPin, Video, ArrowRight } from 'lucide-react'

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: "Corporate Law Career Workshop",
      description: "Learn about career opportunities in corporate law with industry experts",
      date: "Aug 25, 2025",
      time: "6:00 PM IST",
      attendees: 245,
      type: "Workshop",
      mode: "Online",
      speaker: "Senior Partner, Khaitan & Co"
    },
    {
      id: 2,
      title: "Legal Research Masterclass",
      description: "Advanced techniques for effective legal research and case analysis",
      date: "Aug 28, 2025",
      time: "4:00 PM IST",
      attendees: 189,
      type: "Masterclass",
      mode: "Hybrid",
      speaker: "Prof. Sharma, NLSIU"
    },
    {
      id: 3,
      title: "Moot Court Competition Finals",
      description: "Annual national moot court competition featuring top law schools",
      date: "Sep 2, 2025",
      time: "10:00 AM IST",
      attendees: 156,
      type: "Competition",
      mode: "Offline",
      speaker: "Supreme Court Judges Panel"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Join webinars, workshops, and competitions to boost your career</p>
          </div>
          <Link
            href="/events"
            className="group hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.type}
                </span>
                <div className="flex items-center space-x-1 text-gray-600">
                  {event.mode === "Online" ? (
                    <Video className="w-4 h-4" />
                  ) : event.mode === "Offline" ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <div className="flex space-x-1">
                      <Video className="w-4 h-4" />
                      <MapPin className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-sm">{event.mode}</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-purple-600 transition-colors">
                {event.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{event.attendees} registered</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm mb-3">
                  <span className="font-medium">Speaker:</span> {event.speaker}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/events"
            className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>View All Events</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents