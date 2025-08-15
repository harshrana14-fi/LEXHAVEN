"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const WhosUsingSection = () => {
  const [showDetails, setShowDetails] = useState(false);

  const userCategories = [
    {
      title: "Students and Professionals",
      subtitle: "Unlock Your Potential: Compete, build a strong resume, grow your network, and get hired faster!",
      image: "/images/student1.jpg", // unified to `image`
      details: [
        "Participate in nationwide competitions, hackathons, and challenges.",
        "Access premium learning programs, workshops, and mentorship.",
        "Showcase your profile to top recruiters across industries.",
        "Gain certifications and credentials that boost employability."
      ]
    },
    {
      title: "Companies and Recruiters",
      subtitle: "Hire smarter: Discover top talent, engage them effectively, and boost your employer brand.",
      image: "/images/firm1.jpg",
      details: [
        "Post jobs, internships, and exclusive hiring challenges.",
        "Access a verified talent pool with advanced search filters.",
        "Leverage AI-driven candidate recommendations.",
        "Showcase your organization to a nationwide audience."
      ]
    },
    {
      title: "Colleges",
      subtitle: "Bridge academia and industry by empowering students with real-world opportunities.",
      image: "/images/cllg.jpeg",
      details: [
        "Offer students access to top competitions, internships, and jobs.",
        "Collaborate with leading companies for recruitment drives.",
        "Track and showcase student achievements at scale.",
        "Build strong academia-industry partnerships."
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
        Who's using LEXHAVEN?
      </h2>
      
      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {userCategories.map((category, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            {/* Image */}
            <div className="h-48 relative w-full">
              <Image 
                src={category.image} 
                alt={category.title} 
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{category.title}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{category.subtitle}</p>
              
              {/* Details */}
              {showDetails && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-3">
                    {category.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Know How Button */}
      <div className="flex justify-center">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-blue-500 px-8 py-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Know How
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default WhosUsingSection;
