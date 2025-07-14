"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, BookOpen, Zap, Shield, Star, Heart, Lightbulb } from "lucide-react"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
          <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements - removed particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen">
          {/* Enhanced Hero Section */}
          <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0 lg:pr-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 animate-fade-in-up border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Your thoughts, beautifully organized
              </span>
              <div className="ml-2 flex space-x-1">
                <Star className="w-3 h-3 text-yellow-400 animate-pulse" />
                <Heart className="w-3 h-3 text-pink-400 animate-pulse animation-delay-500" />
                <Lightbulb className="w-3 h-3 text-blue-400 animate-pulse animation-delay-1000" />
              </div>
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Notes</span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                {" "}
                Reimagined
              </span>
            </h1>

            <p className="text-xl mb-12 max-w-2xl animate-fade-in-up animation-delay-400 leading-relaxed">
              <span className="bg-gradient-to-r from-white/90 to-purple-200/90 bg-clip-text text-transparent">
                Experience note-taking like never before. Beautiful, fast, and intuitive - capture your ideas with style
                and never lose track of your thoughts. Transform your creativity into organized brilliance.
              </span>
            </p>

            {/* Enhanced Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: BookOpen,
                  title: "Rich Text Editor",
                  desc: "Beautiful writing experience",
                  gradient: "from-purple-400 to-pink-400",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Instant sync & search",
                  gradient: "from-blue-400 to-cyan-400",
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  desc: "Your data, protected",
                  gradient: "from-green-400 to-emerald-400",
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center space-y-4 animate-fade-in-up group cursor-pointer"
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="w-8 h-8 group-hover:animate-pulse text-white" />
                  </div>
                  <div className="text-center">
                    <h3
                      className={`font-semibold text-lg mb-1 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-up animation-delay-1000">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <p className="text-white/90 italic">"This is the most beautiful notes app I've ever used!"</p>
                  <p className="text-white/60 text-sm">- John Doe, Creative Director</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Auth Forms */}
          <div className="flex-1 max-w-md w-full animate-fade-in-up animation-delay-800">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105">
              <div className="p-8">
                <div className="flex space-x-1 mb-8 bg-white/5 rounded-xl p-1">
                  <Button
                    variant="ghost"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 rounded-lg transition-all duration-300 ${
                      isLogin
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 rounded-lg transition-all duration-300 ${
                      !isLogin
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Sign Up
                  </Button>
                </div>

                <div className="transition-all duration-500 transform">
                  {isLogin ? (
                    <LoginForm onSuccess={() => router.push("/dashboard")} />
                  ) : (
                    <RegisterForm onSuccess={() => setIsLogin(true)} />
                  )}
                </div>
              </div>
            </Card>

            {/* Social proof */}
            <div className="mt-8 text-center animate-fade-in-up animation-delay-1200">
              <p className="text-white/60 text-sm mb-4">Trusted by creative minds worldwide</p>
              <div className="flex justify-center space-x-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
