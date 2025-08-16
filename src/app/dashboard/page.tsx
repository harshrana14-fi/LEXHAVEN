'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  User, FileText, Briefcase, Target, Users, BarChart3, Trophy, Star,
  Bookmark, Clock, GraduationCap, BookOpen, Award, Settings, Crown,
  UserCog, Bell, ChevronDown, X, TrendingUp, Calendar,
  Shield, Zap, Globe, MessageCircle, Send, Search, Minus, Maximize2
} from 'lucide-react'
import Hero from '../components/Hero'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const Dashboard = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [university, setUniversity] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setFullName(data.fullName || currentUser.displayName || null)
            setUniversity(data.university || 'Student')
          } else {
            setFullName(currentUser.displayName || null)
            setUniversity('Student')
          }
        } catch (error) {
          console.error('Error fetching Firestore profile:', error)
        }
      } else {
        setUser(null)
        setFullName(null)
        setUniversity(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const firstName =
    fullName?.split(' ')[0] ||
    user?.displayName?.split(' ')[0] ||
    'Student'

  // Sample chat users data
  const [chatUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Associate at Baker McKenzie',
      avatar: 'SJ',
      online: true,
      lastSeen: 'Online now',
      unread: 2
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Legal Counsel at Microsoft',
      avatar: 'MC',
      online: false,
      lastSeen: '2 hours ago',
      unread: 0
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Partner at Skadden',
      avatar: 'ER',
      online: true,
      lastSeen: 'Online now',
      unread: 1
    },
    {
      id: 4,
      name: 'David Thompson',
      title: 'In-House Counsel at Goldman Sachs',
      avatar: 'DT',
      online: false,
      lastSeen: '1 day ago',
      unread: 0
    },
    {
      id: 5,
      name: 'Lisa Park',
      title: 'Legal Director at Amazon',
      avatar: 'LP',
      online: true,
      lastSeen: 'Online now',
      unread: 3
    }
  ])

  // Initialize sample messages
  useEffect(() => {
    const sampleMessages = {
      1: [
        { id: 1, sender: 'Sarah Johnson', content: 'Hi! I saw your profile and wanted to connect. Are you interested in corporate law opportunities?', timestamp: '10:30 AM', isMe: false },
        { id: 2, sender: 'You', content: 'Yes, absolutely! I\'d love to learn more about your experience at Baker McKenzie.', timestamp: '10:35 AM', isMe: true },
        { id: 3, sender: 'Sarah Johnson', content: 'Great! We have some exciting openings coming up. Would you be available for a quick call this week?', timestamp: '10:45 AM', isMe: false }
      ],
      3: [
        { id: 1, sender: 'Emily Rodriguez', content: 'Congratulations on your recent achievement! I\'d love to discuss potential mentorship opportunities.', timestamp: '2:15 PM', isMe: false }
      ],
      5: [
        { id: 1, sender: 'Lisa Park', content: 'Hey! Are you attending the Legal Tech Summit next month?', timestamp: 'Yesterday', isMe: false },
        { id: 2, sender: 'You', content: 'I\'m planning to! Are you speaking there?', timestamp: 'Yesterday', isMe: true },
        { id: 3, sender: 'Lisa Park', content: 'Yes, I\'m giving a keynote on AI in legal practice. We should definitely meet up there!', timestamp: 'Yesterday', isMe: false }
      ]
    }
    setMessages(sampleMessages)
  }, [])

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedChat])

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    const message = {
      id: Date.now(),
      sender: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), message]
    }))
    setNewMessage('')
  }

  // Handle chat user selection
  const handleChatSelect = (chatUser) => {
    setSelectedChat(chatUser)
  }

  // Profile menu items
  const profileMenuItems = [
    { icon: User, label: "View Profile", href: "/profile" },
    { icon: FileText, label: "Applications", href: "/applications" },
    { icon: FileText, label: "Resume Builder", href: "/resume" },
    { icon: Briefcase, label: "My Jobs & Internships", href: "/my-jobs" },
    { icon: Target, label: "My Opportunities", href: "/opportunities" },
    { icon: Users, label: "Referrals", href: "/referrals" },
    { icon: BarChart3, label: "My Rounds", href: "/rounds" },
    { icon: Trophy, label: "Nominations", href: "/nominations" },
    { icon: Star, label: "Watchlist", href: "/watchlist" },
    { icon: Bookmark, label: "Bookmarked", href: "/bookmarks" },
    { icon: Clock, label: "Recently Viewed", href: "/recent" },
    { icon: GraduationCap, label: "Mentor Sessions", href: "/mentors" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: Award, label: "Certificates", href: "/certificates" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Crown, label: "LEXHAVEN Pro", href: "/pro", premium: true },
    { icon: UserCog, label: "Organizer Dashboard", href: "/organizer" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <a href="/" className="group flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/images/logobg1.png"
                    alt="LEXHAVEN Logo"
                    className="h-50 object-contain transition-all duration-300 group-hover:scale-105 "
                  />
                </div>
              </a>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <a href="/dashboard" className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg border border-blue-100">
                  Dashboard
                </a>
                <a href="/internships" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Internships
                </a>
                <a href="/competitions" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Competitions
                </a>
                <a href="/webinars" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Webinars
                </a>
                <a href="/courses" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                  Courses
                </a>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Chat Button */}
              <div className="relative">
                <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {chatUsers.reduce((sum, user) => sum + user.unread, 0)}
                  </span>
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    3
                  </span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl h-9 w-9 flex items-center justify-center text-sm font-semibold shadow-sm">
                    {firstName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-slate-900">{fullName || 'User'}</div>
                    <div className="text-xs text-slate-500 font-medium">{university || 'Student'}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Animated Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{fullName || 'User'}</div>
                        <div className="text-xs text-slate-500">{user?.email || 'Email not available'}</div>
                      </div>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="max-h-96 overflow-y-auto py-2">
                      {profileMenuItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-sm hover:bg-slate-50 transition-all duration-200 group ${
                            item.premium 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${
                            item.premium 
                              ? 'bg-amber-100 group-hover:bg-amber-200' 
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="flex-1 font-medium">{item.label}</span>
                          {item.premium && (
                            <div className="flex items-center space-x-1">
                              <Crown className="h-3 w-3" />
                              <span className="text-xs font-semibold">PRO</span>
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">
            {/* Chat Users List */}
            <div className="w-80 border-r border-slate-200 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Chat Users */}
              <div className="flex-1 overflow-y-auto">
                {chatUsers.map((chatUser) => (
                  <button
                    key={chatUser.id}
                    onClick={() => handleChatSelect(chatUser)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors duration-200 border-b border-slate-50 ${
                      selectedChat?.id === chatUser.id ? 'bg-blue-50 border-blue-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {chatUser.avatar}
                        </div>
                        {chatUser.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{chatUser.name}</h3>
                          {chatUser.unread > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2 font-medium">
                              {chatUser.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{chatUser.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{chatUser.lastSeen}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {selectedChat.avatar}
                      </div>
                      {selectedChat.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{selectedChat.name}</h3>
                      <p className="text-xs text-slate-500">{selectedChat.title}</p>
                      <p className="text-xs text-slate-400">{selectedChat.lastSeen}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {(messages[selectedChat.id] || []).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.isMe
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isMe ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage(e)
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
                    <p className="text-slate-500">Choose from your existing conversations or start a new one.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Executive Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Executive Welcome */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-1 h-8 bg-slate-900 rounded-full"></div>
                <div>
                  <span className="text-slate-600 text-sm font-medium tracking-wider uppercase">Dashboard Overview</span>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-light text-slate-900 mb-2">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                Your comprehensive legal career platform. Manage applications, track opportunities, 
                and advance your professional development with precision and efficiency.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-light text-slate-900">{university || 'Professional'}</div>
                <div className="text-sm text-slate-500">Member since {new Date().getFullYear()}</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-light text-slate-700">{firstName.charAt(0)}</span>
              </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors duration-200 flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Browse Opportunities</span>
                </button>
                <button className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>My Applications</span>
                </button>
                <button className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Progress Report</span>
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Hero/>
    </div>
  )
}

export default Dashboard