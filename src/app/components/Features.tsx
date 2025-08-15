import { Briefcase, Users, BookOpen, Trophy, PenTool, Calendar, Target, Shield } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Premium Internships",
      description: "Access exclusive internship opportunities from top law firms and legal departments across India.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Legal Events & Webinars",
      description: "Join exclusive webinars, workshops, and networking events with legal professionals.",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning Resources",
      description: "Comprehensive legal guides, case studies, and materials to enhance your legal knowledge.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "CV Builder & Tools",
      description: "Professional resume builder tailored for legal careers with expert templates.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Legal Competitions",
      description: "Participate in moot courts, case competitions, and legal challenges to showcase skills.",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Skill Development",
      description: "Personalized skill assessments and courses to develop legal expertise and career readiness.",
      gradient: "from-green-500 to-green-600"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for Your
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Legal Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From finding the perfect internship to building essential skills, we provide comprehensive support for your legal career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Features