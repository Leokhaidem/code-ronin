"use client"

import { useState, useRef } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Send } from "lucide-react"
import { motion } from "framer-motion"

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
]

export default function CodeEditor() {
  const [language, setLanguage] = useState("javascript")
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // JavaScript-specific features
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
    })

    // Add custom completions for JavaScript
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model, position) => { // context, token are additional parameters
        const suggestions = [
          {
            label: "console.log",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "console.log($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          },
          // Add more custom suggestions here
        ]
        return { suggestions }
      },
    })

    // Add custom completions for Python
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "print($1)",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          },
          // Add more custom suggestions here
        ]
        return { suggestions }
      },
    })
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleRunCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      console.log("Running code:", code)
      // Implement code execution logic here
    }
  }

  const handleSubmitCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      console.log("Submitting code: ", code);
    //   console.log("Submitting code:", code)
      // Implement code submission logic here
    }
  }
  const defaultText = language === "javascript" ? "// Start coding here" : "# Start coding here"
  const [codeWritten, setCodeWritten] = useState(defaultText);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <Select onValueChange={handleLanguageChange} defaultValue={language}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border rounded-lg overflow-hidden"
      >
        <Editor
          height="400px"
          language={language}
          defaultValue={defaultText}
          value={codeWritten}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
          onChange={(value) => setCodeWritten(value || "")}
          onMount={handleEditorDidMount}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-4 flex justify-end space-x-4"
      >
        <Button onClick={handleRunCode} className="flex items-center">
          <Play className="mr-2 h-4 w-4" />
          Run
        </Button>
        <Button onClick={handleSubmitCode} className="flex items-center">
          <Send className="mr-2 h-4 w-4" />
          Submit
        </Button>
      </motion.div>
    </motion.div>
  )
}