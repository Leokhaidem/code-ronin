'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaRobot, FaMicrophone, FaUser, FaMap, FaChevronLeft, FaChevronRight, FaPlay, FaPaperPlane } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function LearningPage() {
  const [code, setCode] = useState('// Write your code here')
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', content: 'Hello! What DSA concept would you like to learn today?' }
  ])
  const [userInput, setUserInput] = useState('')

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: userInput }])
      // Simulate bot response (replace with actual API call)
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'bot', content: 'I understand you want to learn about ' + userInput + '. Let\'s start with the basics.' }])
      }, 1000)
      try {
        // Make a request to your API route
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userInput }),
        });
  
        const data = await response.json();
        console.log(data)
        // Update chat messages with the bot's response
        setChatMessages(prev => [
          ...prev.slice(0, prev.length - 1), // Remove the 'Thinking...' message
          { role: 'bot', content: data.response }
        ]);
      } catch (error) {
        console.error('Error:', error);
        setChatMessages(prev => [
          ...prev.slice(0, prev.length - 1),
          { role: 'bot', content: 'Sorry, something went wrong.' }
        ]);
      }
      setUserInput('')
    }
  }

  const handleRunCode = () => {
    // Implement code execution logic here
    console.log('Running code:', code)
  }

  const handleSubmitCode = () => {
    // Implement code submission logic here
    console.log('Submitting code:', code)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">CodeRonin</h1>
          <nav className="flex space-x-4">
            <Button variant="ghost" className="flex items-center">
              <FaUser className="mr-2" /> Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center">
              <FaMap className="mr-2" /> Learning Roadmap
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Current Topic and Question */}
          <div className="p-6 bg-indigo-50">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">Current Topic: Binary Search Trees</h2>
            <p className="text-gray-600">
              Implement a function to insert a node into a binary search tree.
            </p>
          </div>

          <div className="flex">
            {/* Chatbot */}
            <div className="w-2/5 p-6 border-r border-indigo-100">
              <div className="flex items-center mb-4">
                <FaRobot className="text-indigo-500 mr-2" />
                <h3 className="text-xl font-semibold">AI Tutor</h3>
              </div>
              <div className="h-[calc(100vh-380px)] overflow-auto mb-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg p-2 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
                <Button variant="outline">
                  <FaMicrophone />
                </Button>
              </form>
            </div>

            {/* Code Editor */}
            <div className="w-3/5 p-6">
              <div className="flex items-center mb-4">
                <FaCode className="text-indigo-500 mr-2" />
                <h3 className="text-xl font-semibold">Code Editor</h3>
              </div>
              <MonacoEditor
                height="calc(100vh - 380px)"
                language="javascript"
                theme="vs-light"
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
              <div className="flex justify-between mt-4 items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    aria-label="Previous question"
                  >
                    <FaChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    aria-label="Next question"
                  >
                    <FaChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center h-10"
                    onClick={handleRunCode}
                  >
                    <FaPlay className="mr-2 h-4 w-4" /> Run
                  </Button>
                  <Button
                    variant="default"
                    className="flex items-center h-10"
                    onClick={handleSubmitCode}
                  >
                    <FaPaperPlane className="mr-2 h-4 w-4" /> Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}