
// app/api/chat/route.ts
import { NextResponse } from 'next/server';
// Import Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

// const conversationHistory: string[] = [];

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    console.log(message);
    if (!message) {
      return NextResponse.json({ response: 'Message is required' }, { status: 400 });
    }

    // Initialize Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model you want to use (in this case, "gemini-1.5-flash")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // conversationHistory.push(`User: ${question}`);
    // Generate content based on the user message
    const result = await model.generateContent(message);

    // Extract the AI response from the result
    const aiResponse = result.response.text(); // Adjust according to the response format
    console.log(aiResponse)

    // conversationHistory.push(`AI: ${aiResponse}`);
    // Send the Gemini API response back to the client
    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error fetching AI response from Gemini API:', error);
    return NextResponse.json({ response: 'Error fetching AI response from Gemini API' }, { status: 500 });
  }
}
