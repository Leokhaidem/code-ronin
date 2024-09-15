"use client"

// First, let's define our custom types for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

// Define a constructor for SpeechRecognition
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Now, let's update our component
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

export default function HomePage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [codeEditorContent, setCodeEditorContent] = useState('');

  // Function to handle voice input using Web Speech API
  const handleVoiceInput = useCallback(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
      } else {
        console.error('Speech recognition not supported');
      }
    }
  }, []);

  // Function to handle sending a message in the chat
  const handleSendMessage = useCallback(() => {
    if (inputText.trim() !== '') {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
      };
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
    }
  }, [inputText]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat Section on the Left */}
      <div className="w-1/3 p-6 bg-white shadow-md overflow-hidden flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Chat with AI</h1>
        {/* Chat Messages */}
        <div id="chat-container" className="flex-grow overflow-y-auto mb-4 space-y-2">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg ${
                message.isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%]`}
            >
              {message.text}
            </div>
          ))}
        </div>
        {/* Input Field and Buttons */}
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            placeholder="Type your message"
          />
          <Button onClick={handleSendMessage} variant="default">
            <Send className="h-4 w-4" />
          </Button>
          <Button onClick={handleVoiceInput} variant="outline">
            {isListening ? 'Listening...' : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {/* Code Editor Section on the Right */}
      <div className="w-2/3 p-6">
        <h1 className="text-2xl font-bold mb-4">Code Editor</h1>
        {/* Code Editor */}
        <Textarea
          value={codeEditorContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCodeEditorContent(e.target.value)}
          className="w-full h-[calc(100%-3rem)] resize-none font-mono"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
}