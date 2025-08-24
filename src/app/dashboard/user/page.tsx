//  src/app/dashboard/user/page.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { User ,FileText, Briefcase, Target, Users, BarChart3, Trophy, Star,
  Bookmark, Clock, GraduationCap, BookOpen, Award, Settings, Crown,
  UserCog, Bell, ChevronDown, X, TrendingUp, Calendar,
  Shield, Zap, Globe, MessageCircle, Send, Search, Minus, Maximize2,
  ChevronUp, Phone, Video, MoreHorizontal, Paperclip, Smile
} from 'lucide-react'
import Hero from '../../components/Hero'
import { auth, db } from '@/lib/firebase'
import { Timestamp } from "firebase/firestore"
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore'

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState<string | null>(null)
  const [university, setUniversity] = useState<string | null>(null)
  const [userType, setUserType] = useState<string>('student') // 'student' or 'company'
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatInputRef = useRef(null)

  type ChatUser = {
  id: string
  fullName?: string
  displayName?: string
  university?: string
  companyName?: string
  userType?: string
}

type Conversation = {
  id: string
  participants: string[]
  participantNames: Record<string, string>
  lastMessage: string
  lastMessageTime?: Timestamp
  unreadCounts: Record<string, number>
}
type Message = {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp?: Timestamp
  type: "text" | "image" | "file"
}


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
            setUserType(data.userType || 'student')
          } else {
            setFullName(currentUser.displayName || null)
            setUniversity('Student')
            setUserType('student')
          }
        } catch (error) {
          console.error('Error fetching Firestore profile:', error)
        }
      } else {
        setUser(null)
        setFullName(null)
        setUniversity(null)
        setUserType('student')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fetch potential chat users based on user type
  useEffect(() => {
    if (!user || !userType) return

    const fetchChatUsers = async () => {
      try {
        // If user is a student, fetch companies/firms
        // If user is a company, fetch students
        const targetUserType = userType === 'student' ? 'company' : 'student'
        
        const usersQuery = query(
          collection(db, 'users'),
          where('userType', '==', targetUserType),
          limit(50)
        )
        
        const usersSnapshot = await getDocs(usersQuery)
        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setChatUsers(users)
      } catch (error) {
        console.error('Error fetching chat users:', error)
      }
    }

    fetchChatUsers()
  }, [user, userType])

  // Listen to conversations
  useEffect(() => {
    if (!user) return

    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    )

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
  const convos: Conversation[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Conversation, "id">),
  }))

  setConversations(convos)

  // Calculate unread count
  const totalUnread = convos.reduce((sum, convo) => {
    const unreadForUser = convo.unreadCounts?.[user?.uid || ""] || 0
    return sum + unreadForUser
  }, 0)

  setUnreadCount(totalUnread)
})


    return () => unsubscribe()
  }, [user])

  // Listen to messages for selected chat
  useEffect(() => {
  if (!selectedChat) return

  const messagesQuery = query(
    collection(db, "conversations", selectedChat.id, "messages"),
    orderBy("timestamp", "asc")
  )

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const messages: Message[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Message, "id">),
    }))
    setCurrentMessages(messages)
  })

  return () => unsubscribe()
}, [selectedChat])


  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  // Create or get conversation
  const getOrCreateConversation = async (otherUserId: string): Promise<Conversation | null> => {
  try {
    if (!user) return null

    // Check if conversation already exists
    const existingConvo = conversations.find(convo =>
      convo.participants.includes(otherUserId)
    )
    
    if (existingConvo) {
      return existingConvo
    }

    // Create new conversation
    const conversationData: Omit<Conversation, "id"> = {
      participants: [user.uid, otherUserId],
      participantNames: {
        [user.uid]: user.displayName || "User",
        [otherUserId]: chatUsers.find(u => u.id === otherUserId)?.fullName || "User"
      },
      lastMessage: "",
      lastMessageTime: serverTimestamp() as any, // Firestore Timestamp
      unreadCounts: {
        [user.uid]: 0,
        [otherUserId]: 0
      }
    }

    const docRef = await addDoc(collection(db, "conversations"), conversationData)

    return { id: docRef.id, ...conversationData }
  } catch (error) {
    console.error("Error creating conversation:", error)
    return null
  }
}


  // Handle sending messages
  const handleSendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat || !user) return

    try {
      // Add message to conversation
      await addDoc(collection(db, 'conversations', selectedChat.id, 'messages'), {
        senderId: user.uid,
        senderName: fullName || user.displayName || 'User',
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
        type: 'text'
      })

      // Update conversation's last message and unread counts
      const otherParticipant = selectedChat.participants.find(p => p !== user.uid);
if (!otherParticipant) return; // or throw error

await updateDoc(doc(db, 'conversations', selectedChat.id), {
  lastMessage: newMessage.trim(),
  lastMessageTime: serverTimestamp(),
  [`unreadCounts.${otherParticipant}`]:
    (selectedChat.unreadCounts?.[otherParticipant] || 0) + 1,
});

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Handle chat user selection
  const handleChatSelect = async (chatUser: { id: any; fullName?: string | undefined; displayName?: string | undefined; university?: string | undefined; companyName?: string | undefined; userType?: string | undefined }) => {
    const conversation = await getOrCreateConversation(chatUser.id)
    if (conversation) {
      setSelectedChat(conversation)
      
      // Mark messages as read
      if (conversation.unreadCounts?.[user.uid] > 0) {
        await updateDoc(doc(db, 'conversations', conversation.id), {
          [`unreadCounts.${user.uid}`]: 0
        })
      }
    }
  }

  // Handle conversation selection from existing conversations
  const handleConversationSelect = async (conversation: Conversation) => {
  setSelectedChat(conversation);

  // Mark messages as read
  if (conversation.unreadCounts?.[user.uid] > 0) {
    await updateDoc(doc(db, "conversations", conversation.id), {
      [`unreadCounts.${user.uid}`]: 0,
    });
  }
};


  const firstName = fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'

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
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <a href="/" className="group flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/images/logobg1.png"
                    alt="LEXHAVEN Logo"
                    className="h-50 object-contain transition-all duration-300 group-hover:scale-105"
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

      {/* Chat Button (Fixed Position) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsChatOpen(true)
            setIsChatMinimized(false)
          }}
          className="relative bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window (Bottom Right Corner) */}
      {isChatOpen && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 transition-all duration-300 ${
          isChatMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold text-sm">Messages</h3>
                {selectedChat && !isChatMinimized && (
                  <p className="text-xs text-blue-100">
                    {selectedChat.participantNames && 
                     Object.values(selectedChat.participantNames).find(name => 
                       name !== (fullName || user?.displayName || 'User')
                     )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="p-1.5 hover:bg-blue-800 rounded-lg transition-colors duration-200"
              >
                {isChatMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 hover:bg-blue-800 rounded-lg transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <div className="flex h-[calc(100%-4rem)]">
              {/* Chat Users/Conversations List */}
              <div className="w-full border-r border-slate-200 flex flex-col">
                {selectedChat ? (
                  // Chat Messages View
                  <div className="flex flex-col h-full">
                    {/* Chat Header with Back Button */}
                    <div className="p-3 border-b border-slate-100 flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                      </button>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {selectedChat.participantNames && 
                         Object.values(selectedChat.participantNames).find(name => 
                           name !== (fullName || user?.displayName || 'User')
                         )?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {selectedChat.participantNames && 
                           Object.values(selectedChat.participantNames).find(name => 
                             name !== (fullName || user?.displayName || 'User')
                           )}
                        </h4>
                        <p className="text-xs text-green-500">Online</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                            message.senderId === user?.uid
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user?.uid ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                              {message.timestamp?.toDate?.().toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t border-slate-200">
                      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                          ref={chatInputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  // Conversations/Users List
                  <div className="flex flex-col h-full">
                    {/* Search */}
                    <div className="p-3 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                      {/* Recent Conversations */}
                      {conversations.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Recent Conversations
                          </div>
                          {conversations.map((conversation) => {
  const otherParticipant = conversation.participants.find(
    (p) => p !== user?.uid
  );

  // Ensure we have a valid participant ID
  if (!otherParticipant) return null;

  const otherParticipantName =
    conversation.participantNames?.[otherParticipant] || "User";

  const unreadCount = conversation.unreadCounts?.[user?.uid ?? ""] || 0;

  return (
    <button
      key={conversation.id}
      onClick={() => handleConversationSelect(conversation)}
      className="w-full p-3 text-left hover:bg-slate-50 transition-colors duration-200 border-b border-slate-50"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {otherParticipantName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {otherParticipantName}
            </h4>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2 font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate mt-1">
            {conversation.lastMessage || "Start a conversation"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {conversation.lastMessageTime?.toDate?.().toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </button>
  );
})
                          }
                        </div>
                      )}
                      {/* Available Users to Chat With */}
                      {chatUsers.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {userType === 'student' ? 'Companies & Firms' : 'Students'}
                          </div>
                          {chatUsers
                            .filter(chatUser => !conversations.some(convo => convo.participants.includes(chatUser.id)))
                            .map((chatUser) => (
                            <button
                              key={chatUser.id}
                              onClick={() => handleChatSelect(chatUser)}
                              className="w-full p-3 text-left hover:bg-slate-50 transition-colors duration-200 border-b border-slate-50"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    {(chatUser.fullName || chatUser.displayName || 'U').charAt(0)}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                                    {chatUser.fullName || chatUser.displayName || 'User'}
                                  </h4>
                                  <p className="text-xs text-slate-500 truncate">
                                    {chatUser.university || chatUser.companyName || (userType === 'student' ? 'Company' : 'Student')}
                                  </p>
                                  <p className="text-xs text-green-500 mt-1">Available to chat</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Empty State */}
                      {conversations.length === 0 && chatUsers.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-center p-6">
                          <div>
                            <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <h4 className="text-sm font-medium text-slate-900 mb-1">No conversations yet</h4>
                            <p className="text-xs text-slate-500">
                              {userType === 'student' 
                                ? 'Connect with companies and firms to start networking' 
                                : 'Start conversations with talented students'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard