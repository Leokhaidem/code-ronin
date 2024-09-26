'use client';
import { useState, useEffect, ReactEventHandler, KeyboardEventHandler } from 'react';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

interface Messages {
  text: string;
  role: string;
  timeStamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Messages[]>([]); // array for messages
  const [userInput, setUserInput] = useState(''); // user input
  const [chat, setChat] = useState<any>(null); // chat object
  const [error, setError] = useState(""); // error message
  const [code, setCode] = useState('// Write your code here');

  // Make sure to store your API_KEY safely
  const API_KEY =process.env.GOOGLE_APIKEY; //process.env.NEXT_PUBLIC_API_KEY;
  const MODEL_NAME = 'gemini-1.5-flash';

  // Initialize the GoogleGenerativeAI object
 

  // Initialize the chat session
  useEffect(() => {
    const genAI = new GoogleGenerativeAI(API_KEY!);

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const initChat = async () => {
      try {
        const newChat = await genAI
        .startChat({
          model: MODEL_NAME,
          generationConfig,
          safetySettings,
          history: messages.map((msg) => ({
            text: msg.text,
            role: msg.role,
          })),
        });
        setChat(newChat);
      } catch (error) {
        setError('Failed to initialize chat. Please try again.');
      }
    };

    initChat();
  }, [messages, API_KEY]);

  // Handle sending user messages and receiving bot responses
  const handleSendMessage = async () => {
    try {
      const userMessage = {
        text: userInput,
        role: 'user',
        timeStamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      // if (chat) {
      //   const result = await chat.sendMessage({text:userInput,});
      //   const botMessage = {
      //     text: result.response.text || 'No response from bot', // Assuming the API returns the response text directly
      //     role: 'bot',
      //     timeStamp: new Date(),
      //   };
      //   setMessages((prevMessages) => [...prevMessages, botMessage]);
      // }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send the message. Please try again.');
    }
  };

  // Handle 'Enter' key press
  // const handleKeyPress = (e: KeyboardEventHandler<HTMLInputElement>) => {
  //   if (e.key === 'Enter'/*  && userInput */) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  return (
    <div className="flex h-screen">
      {/* Chatbot section */}
      <div className="w-1/3 bg-gray-100 p-4 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">AI Coding Assistant</h2>
        <div className="chat-window h-5/6 overflow-y-auto mb-4 bg-white p-4 rounded shadow-md">
          {messages.length === 0 ? (
            <p className="text-gray-500">Start chatting with the AI assistant...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`p-2 rounded-lg inline-block ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {msg.text}
                </span>
                <p className='text-xs mt-1'>
                  {msg.role=== "bot"? "Bot":"You"} -{" "}
                  {msg.timeStamp.toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Chat input */}
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            placeholder="Type a message..."
            // onKeyDown={handleKeyPress}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>

      {/* Code editor section */}
      <div className="w-2/3 bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Code Editor</h2>
        <textarea
          className="w-full h-full border border-gray-300 p-4 rounded-lg"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
    </div>
  );
}
