'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGoogle } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function AuthPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (authMode === 'signin') {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: callbackUrl
      })

      if (result?.error) {
        setError('Invalid email or password')
        setIsLoading(false)
      } else {
        router.push('/dashboard') // Redirect to dashboard on successful sign-in
      }
    } else {
      // Handle sign-up
      const username = formData.get('username') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username }),
        })

        if (response.ok) {
          // Automatically sign in after successful registration
          await signIn('credentials', { redirect: false, email, password })
          router.push('/dashboard')
        } else {
          const data = await response.json()
          setError(data.message || 'Failed to create account')
        }
      } catch (error) {
        setError('An error occurred. Please try again.')
      }
    }

    setIsLoading(false)
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to CodeRonin</CardTitle>
            <CardDescription className="text-center">
              {authMode === 'signin' ? 'Sign in to start learning' : 'Create an account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.form onSubmit={handleSubmit} className="space-y-4" variants={itemVariants}>
              {error && (
                <motion.div className="text-red-500 text-center" variants={itemVariants}>
                  {error}
                </motion.div>
              )}
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" required />
              </motion.div>
              {authMode === 'signup' && (
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" type="text" placeholder="Choose a username" required />
                </motion.div>
              )}
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" required />
              </motion.div>
              {authMode === 'signup' && (
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" required />
                </motion.div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
              </Button>
            </motion.form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle className="mr-2 h-4 w-4" />
                {authMode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
              </Button>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.p className="text-sm text-gray-500" variants={itemVariants}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <Button
                variant="link"
                className="p-0 text-blue-500 hover:text-blue-700"
                onClick={toggleAuthMode}
              >
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </Button>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}