"use client";
import axios from "axios";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCode, FaRobot, FaMicrophone } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

export default function LearningPage() {
  const [code, setCode] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Today we will explore Merge Sort. Do you know the basic principle behind merge sort?",
    },
  ]);
  const [userInput, setUserInput] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [codeResult, setCodeResult] = useState<number>(0);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput) return;

    const userMessage: ChatMessage = { role: "user", content: userInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput, code: code, statusId: codeResult }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = { role: "bot", content: data.reply };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: "bot", content: "Sorry, there was an error processing your request." };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setUserInput("");
  };

  const handleCodeSubmit = async () => {
    const newSourceCode = btoa(code);
    
    const getSubmission = async (tokenId: string) => {
      const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}`,
        params: {
          base64_encoded: 'true',
          fields: '*'
        },
        headers: {
          'x-rapidapi-key': '39f3c52513mshbff838acd348120p198a15jsn1088ec846558',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        console.error("Error fetching submission:", error);
        throw error;
      }
    };

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        "x-rapidapi-key": "39f3c52513mshbff838acd348120p198a15jsn1088ec846558",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: 102,
        source_code: newSourceCode,
        stdin: btoa(""),
      },
    };
      
    try {
      const response = await axios.request(options);
      console.log("Submission created:", response.data);
      
      let submission;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        submission = await getSubmission(response.data.token);
        console.log("Submission status:", submission.status);
        await setCodeResult(submission.status.id);
      } while (submission.status.id <= 2);

      console.log(`Code result before fetch: ${codeResult}`);
      
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput, code: code, statusId: submission.status.id }),
      });

      if (!chatResponse.ok) {
        throw new Error(`HTTP error! status: ${chatResponse.status}`);
      }

      const data = await chatResponse.json();
      const botMessage: ChatMessage = { role: "bot", content: data.reply };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      setCodeResult(0);

      if (submission.status.id === 3) {
        console.log("Code executed successfully");
        console.log("Output:", atob(submission.stdout || ""));
      } else {
        console.error("Execution error:", submission.status.description);
        console.error("Compiler output:", atob(submission.compile_output || ""));
        console.error("Execution output:", atob(submission.stdout || ""));
        throw new Error(submission.status.description);
      }
    } catch (error) {
      console.error("Error submitting or running code:", error);
      const errorMessage: ChatMessage = { 
        role: "bot", 
        content: `Error running code: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for more details.` 
      };
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md"
      >
        {/* ... header content */}
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 bg-indigo-50">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">
              Current Topic: Merge Sort
            </h2>
            <p className="text-gray-600">
              Let&apos;s dive deeper into how Merge Sort works.
            </p>
          </div>

          <div className="flex">
            <div className="w-2/5 p-6 border-r border-indigo-100">
              <div className="flex items-center mb-4">
                <FaRobot className="text-indigo-500 mr-2" />
                <h3 className="text-xl font-semibold">AI Tutor</h3>
              </div>

              <div
                ref={chatContainerRef}
                className="h-[calc(100vh-380px)] overflow-auto mb-4"
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg p-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-800"
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserInput(e.target.value)
                  }
                  placeholder="Ask a question..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
                <Button variant="outline">
                  <FaMicrophone />
                </Button>
              </form>
            </div>

            <div className="w-3/5 p-6">
              <div className="flex items-center mb-4">
                <FaCode className="text-indigo-500 mr-2" />
                <h3 className="text-xl font-semibold">Code Editor</h3>
              </div>
              <MonacoEditor
                height="calc(100vh - 380px)"
                language="cpp"
                theme="vs-light"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
              <Button variant="link" onClick={handleCodeSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}