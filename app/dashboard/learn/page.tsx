'use client'

import Chatbot from "@/components/Chatbot"
import CodeEditor from "@/components/CodeEditor"


export default function LearningPage() {

  return (
    <div className="flex h-screen mt-8">
      <Chatbot />
      <CodeEditor />
    </div>
  )
}