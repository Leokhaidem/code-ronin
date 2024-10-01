"use client";
import ReactMarkDown from "react-markdown";
import axios from "axios";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCode, FaRobot } from "react-icons/fa";
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
  //  const [codeResult, setCodeResult] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Today we will explore Merge Sort. Do you know the basic principle behind merge sort?",
    },
  ]);
  const [userInput, setUserInput] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // if (!userInput) return;

    const userMessage: ChatMessage = { role: "user", content: userInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    // console.log(codeResult);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput, code: code, statusId: 0}),
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

  const getSubmission = async (tokenId: string) => {
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}`,
      params: {
        base64_encoded: 'true',
        fields: '*'
      },
      headers: {
  'x-rapidapi-key': 'd14b19724emsh66233dccadb2f12p115f09jsncd0ecd390471',
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

  const handleCodeSubmit = async () => {
    const newSourceCode = btoa(code);
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'x-rapidapi-key': 'd14b19724emsh66233dccadb2f12p115f09jsncd0ecd390471',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
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
        // setCodeResult(submission.status.id);
        console.log("Submission status:", submission.status);
      } while (submission.status.id <= 2);

      console.log(`Code result before fetch: ${submission.status.id}`);
      
      const cresponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput, code: code, statusId: submission.status.id}),
      });

      if (!cresponse.ok) {
        throw new Error(`HTTP error! status: ${cresponse.status}`);
      }

      const data = await cresponse.json();
      const botMessage: ChatMessage = { role: "bot", content: data.reply };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      // setCodeResult(0);

      if (submission.status.id === 3) {
        console.log("Code executed successfully");
        // setCodeResult(submission.status.id);
        console.log("Output:", atob(submission.stdout || ""));

      } else {
        console.error("Execution error:", submission.status.description);
        console.error("Compiler output:", atob(submission.compile_output || ""));
        console.error("Execution output:", atob(submission.stdout || ""));
        throw new Error(submission.status.description);
      }
    } catch (error) {
      console.error("Error submitting or running code:", error);
      // const errorMessage: ChatMessage = { 
      //   role: "bot", 
      //   content: `Error running code: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for more details.` 
      // };
      // setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md"
      >
        {/* ... header content */}
      {/* </motion.header> */} 

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
        >
          <div className="p-2 bg-indigo-50">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">
              Current Topic: Merge Sort
            </h2>
          </div>

          <div className="flex">
            <div className="w-2/5 p-4 border-r border-indigo-100">
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
                    <ReactMarkDown
                      className={`inline-block rounded-lg p-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </ReactMarkDown>
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
                
              </form>
            </div>

            <div className="w-3/5 p-4">
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
              <Button className="mt-4" variant="outline" onClick={handleCodeSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}