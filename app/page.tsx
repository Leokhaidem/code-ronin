'use client'

import { motion } from 'framer-motion'
import { FaRobot, FaCode, FaComments, FaMicrophone } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter();
  const features = [
    { icon: FaRobot, title: 'AI-Powered Learning', description: 'Socratic method tailored to your pace' },
    { icon: FaCode, title: 'Interactive Code Editor', description: 'Write and test DSA in real-time' },
    { icon: FaComments, title: 'Intelligent Chatbot', description: 'Get guidance through chat interactions' },
    { icon: FaMicrophone, title: 'Voice Functionality', description: 'Learn DSA through voice conversations' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-800">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-indigo-600">CodeRonin</h1>
        </motion.div>
        <nav>
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-4"
          >
            <li><Button variant="ghost" className="text-gray-600 hover:text-indigo-600">Features</Button></li>
            <li><Button variant="ghost" className="text-gray-600 hover:text-indigo-600">Pricing</Button></li>
            <li><Button variant="ghost" className="text-gray-600 hover:text-indigo-600">About</Button></li>
            <li><Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white" onClick={() => router.push('/authPage')}>Log In</Button></li>
          </motion.ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-indigo-800">Master DSA with AI Guidance</h2>
          <p className="text-xl mb-8 text-gray-600">Experience the Socratic method in Data Structures and Algorithms learning</p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Start Learning</Button>
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white">
              Explore Features
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <feature.icon className="text-indigo-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-indigo-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-between mb-16"
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 text-indigo-800">Interactive Learning Environment</h2>
            <p className="text-xl mb-6 text-gray-600">
              Engage with our AI tutor in a dynamic code editor. Receive real-time feedback and guidance as you tackle DSA challenges.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Try Demo Editor</Button>
          </div>
          <div className="md:w-1/2 relative h-64 w-full">
            <Image
              src="/placeholder.svg?height=256&width=512"
              alt="CodeRonin Interactive Editor"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-indigo-800">Ready to Elevate Your DSA Skills?</h2>
          <p className="text-xl mb-8 text-gray-600">Join CodeRonin and experience a revolutionary way to master Data Structures and Algorithms</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => router.push('/authPage')}>Get Started for Free</Button>
        </motion.div>
      </main>

      <footer className="bg-indigo-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 CodeRonin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}