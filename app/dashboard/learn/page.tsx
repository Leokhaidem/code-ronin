'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaRobot, 
  FaMicrophone, 
  // FaUser, 
  // FaMap, 
  // FaChevronLeft, 
  // FaChevronRight, 
  // FaPlay, 
  // FaPaperPlane 
} from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type ChatMessage = {
  role: 'user' | 'bot';
  content: string;
};

export default function LearningPage() {
  const [code, setCode] = useState<string>(''); 
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Today we will explore Merge Sort. Do you know the basic principle behind merge sort?' }
  ]);
  const [userInput, setUserInput] = useState<string>('');

   // Create a ref for the chat container
   const chatContainerRef = useRef<HTMLDivElement>(null);

   // Scroll to the bottom whenever chatMessages changes
   useEffect(() => {
     if (chatContainerRef.current) {
       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
     }
   }, [chatMessages]); // This effect will run every time chatMessages changes

  // const handleCodeChange = (value: string | undefined) => {
  //   if (value !== undefined) {
  //     setCode(value);
  //   }
  // };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    // Send message to AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput , code: code}),
    });

    const data = await response.json();
    const botMessage: ChatMessage = { role: 'bot', content: data.reply };

    setChatMessages((prevMessages) => [...prevMessages, botMessage]);
    // if (data.code) {
    //   setCode(data.code);  // This updates the code editor content
    // }
    
    // if (data.response.includes('understood merge sort')) {
    //   const finalMessage: ChatMessage = { role: 'bot', content: "Great! It seems like you have a solid understanding of merge sort." };
    //   setChatMessages((prevMessages) => [...prevMessages, finalMessage]);
    // }

    setUserInput('');  // Clear input after submission
  };

  // const handleRunCode = () => {
  //   console.log('Running code:', code);
  // };

  // const handleSubmitCode = () => {
  //   console.log('Submitting code:', code);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white shadow-md">
        {/* ... header content */}
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-indigo-50">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">Current Topic: Merge Sort</h2>
            <p className="text-gray-600">Let&apos;s dive deeper into how Merge Sort works.</p>
          </div>

          <div className="flex">
            <div className="w-2/5 p-6 border-r border-indigo-100">
              <div className="flex items-center mb-4"><FaRobot className="text-indigo-500 mr-2" /><h3 className="text-xl font-semibold">AI Tutor</h3></div>
              
              {/* Chat container */}
              <div ref={chatContainerRef} className="h-[calc(100vh-380px)] overflow-auto mb-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block rounded-lg p-2 max-w-[80%] ${message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <Input value={userInput} onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)} placeholder="Ask a question..." className="flex-1" />
                <Button type="submit">Send</Button>
                <Button variant="outline"><FaMicrophone /></Button>
              </form>
            </div>

            {/* Code editor section */}
            <div className="w-3/5 p-6">
              <div className="flex items-center mb-4"><FaCode className="text-indigo-500 mr-2" /><h3 className="text-xl font-semibold">Code Editor</h3></div>
              <MonacoEditor height="calc(100vh - 380px)" language="cpp" theme="vs-light" value={code} onChange={(value) => setCode(value || '')} options={{ minimap: { enabled: false }, fontSize: 14 }} />
              {/* Additional buttons for run/submit code */}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}