import { TrendingUp, Users, Building, Star } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      icon: <Building className="w-8 h-8" />,
      number: "500+",
      label: "Partner Law Firms",
      description: "Top-tier legal organizations"
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "10,000+",
      label: "Active Students",
      description: "Aspiring legal professionals"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: "95%",
      label: "Success Rate",
      description: "Students placed successfully"
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: "4.9/5",
      label: "User Rating",
      description: "From student feedback"
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</p>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Stats