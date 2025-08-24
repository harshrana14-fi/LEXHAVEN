"use client"
import { useState, useEffect, SetStateAction } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Sample images - replace these URLs with your actual images
const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&crop=center",
    title: "Legal Education Excellence",
    subtitle: "Access premium courses and resources"
  },
  {
    url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center", 
    title: "Professional Network",
    subtitle: "Connect with top law firms and professionals"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    title: "Career Growth",
    subtitle: "Build your legal career with confidence"
  },
  {
    url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center",
    title: "Expert Guidance", 
    subtitle: "Learn from industry-leading professionals"
  }
]

export default function LoginPage() {
  const { signIn, signInWithGoogle, signInWithLinkedIn, user } = useAuth(); 
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000) 

    return () => clearInterval(interval)
  }, [])

  // Redirect user if already authenticated
  useEffect(() => {
    if (user) {
      const redirectPath = getRedirectPath(user.userType);
      router.push(redirectPath);
    }
  }, [user, router])

  // Helper function to determine redirect path based on user type
  const getRedirectPath = (userType: string) => {
    switch (userType?.toLowerCase()) {
      case "student":
        return "/dashboard/user";
      case "company":
      case "firm":
        return "/dashboard/firm";
      default:
        // Fallback - you might want to redirect to a profile completion page
        console.warn(`Unknown user type: ${userType}. Redirecting to student dashboard.`);
        return "/dashboard/user";
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn(email, password)
      
      // Wait a moment for user context to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user type from the authentication result first, then fallback to user context
      const userType = result?.userType || result?.user?.userType || user?.userType;
      
      console.log('Login result:', result);
      console.log('User type detected:', userType);
      
      if (userType) {
        const redirectPath = getRedirectPath(userType);
        console.log('Redirecting to:', redirectPath);
        router.push(redirectPath);
      } else {
        // If no user type is found, there might be an issue with the authentication
        setError('Unable to determine account type. Please contact support.');
        console.error('No user type found in authentication result:', result);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "Google" | "LinkedIn") => {
    setIsLoading(true)
    setError('')
    
    try {
      let result;
      if (provider === "Google") {
        result = await signInWithGoogle()
      } else {
        result = await signInWithLinkedIn()
      }
      
      // Wait a moment for user context to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user type from the authentication result first, then fallback to user context
      const userType = result?.userType || result?.user?.userType || user?.userType;
      
      console.log('Social login result:', result);
      console.log('User type detected:', userType);
      
      if (userType) {
        const redirectPath = getRedirectPath(userType);
        console.log('Redirecting to:', redirectPath);
        router.push(redirectPath);
      } else {
        // For social logins, the user might need to complete their profile
        // Redirect to a profile completion page or show an error
        setError('Please complete your profile setup or contact support.');
        console.error('No user type found in social login result:', result);
      }
    } catch (err: any) {
      console.error('Social login error:', err);
      setError(`Failed to sign in with ${provider}: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    )
  }

  const goToImage = (index: SetStateAction<number>) => {
    setCurrentImageIndex(index)
  }

  // Don't render the login form if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        {/* Image Container */}
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentImageIndex 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentImageIndex 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
          ))}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-20">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">LEXHAVEN</h1>
              <h2 className="text-2xl font-semibold mb-2">
                {carouselImages[currentImageIndex].title}
              </h2>
              <p className="text-lg opacity-90">
                {carouselImages[currentImageIndex].subtitle}
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>

              {/* Arrow Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={prevImage}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-8 lg:hidden">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">LEXHAVEN</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-200 rounded-lg py-3 px-4 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center space-x-3 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-200 rounded-lg py-3 px-4 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center space-x-3 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Login with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">Or login with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have account? </span>
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}