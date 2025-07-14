"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        setSuccess("Successfully logged in!")
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-200 animate-fade-in-up">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {success && (
            <Alert className="bg-gradient-to-r from-green-600 to-green-500 border border-green-700 text-white flex items-center gap-3 p-4 rounded-xl shadow-lg animate-fade-in-up transition-all duration-500">
              <CheckCircle className="w-5 h-5 text-white" />
              <AlertDescription className="font-medium">{success}</AlertDescription>
            </Alert>
        )}


        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/90 font-medium">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
                placeholder="Enter your email"
                required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/90 font-medium">
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
                placeholder="Enter your password"
                required
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 h-12 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
        >
          {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
          ) : (
              "Sign In to Your Notes"
          )}
        </Button>

        <div className="text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 cursor-pointer transition-all duration-300">
            Sign up above
          </span>
          </p>
        </div>
      </form>
  )
}
