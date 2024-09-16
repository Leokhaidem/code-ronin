'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGoogle, FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const socialButtons = [
    { icon: FaGoogle, label: 'Google', color: 'bg-red-500 hover:bg-red-600' },
    { icon: FaGithub, label: 'GitHub', color: 'bg-gray-800 hover:bg-gray-900' },
    { icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: FaFacebook, label: 'Facebook', color: 'bg-blue-500 hover:bg-blue-600' },
  ]

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to CodeRonin</CardTitle>
          <CardDescription className="text-center">
            {authMode === 'signin' ? 'Sign in to start learning' : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="Choose a username" required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" required />
                </div>
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm your password" required />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="social">
              <div className="grid grid-cols-2 gap-4">
                {socialButtons.map((button, index) => (
                  <motion.div
                    key={button.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full ${button.color} text-white transition-all duration-300 transform hover:scale-105`}
                    >
                      <button.icon className="mr-2 h-4 w-4" />
                      {button.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 text-blue-500 hover:text-blue-700"
              onClick={toggleAuthMode}
            >
              {authMode === 'signin' ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}