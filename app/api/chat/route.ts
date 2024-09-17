
// import type { NextApiRequest, NextApiResponse } from 'next';
// // Import Google Generative AI
// import { GoogleGenerativeAI } from "@google/generative-ai";


// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
// type Data = {
//   response: string;
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
//   const { message } = req.body;

//   try {
//     // Initialize Google Generative AI with your API key
//     const genAI = new GoogleGenerativeAI(apiKey);

//     // Get the model you want to use (in this case, "gemini-1.5-flash")
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate content based on the user message
//     const result = await model.generateContent(message);

//     // Extract the AI response from the result
//     const aiResponse = result.response.text(); // Adjust according to the response format

//     res.status(200).json({ response: aiResponse });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ response: 'Error fetching AI response from Gemini API' });
//   }
// }

// import type { NextApiRequest, NextApiResponse } from 'next';
// // Import Google Generative AI
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

// type Data = {
//   response: string;
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
//   // Check if request method is POST
//   if (req.method !== 'POST') {
//     return res.status(405).json({ response: 'Only POST requests are allowed' });
//   }

//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ response: 'Question is required' });
//   }

//   try {
//     // Initialize Google Generative AI with your API key
//     const genAI = new GoogleGenerativeAI(apiKey);

//     // Get the model you want to use (in this case, "gemini-1.5-flash")
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate content based on the user input (question)
//     const result = await model.generateContent(question);
//     console.log("fine here")

//     // Extract the AI response from the result
//     const aiResponse = result.response.text() ; // Adjust according to the response structure

//     // Send response back to client
//     res.status(200).json({ response: aiResponse });
//   } catch (error) {
//     console.error('Error fetching AI response from Gemini API:', error);
//     res.status(500).json({ response: 'Error fetching AI response from Gemini API' });
//   }
// }
// import { NextApiRequest, NextApiResponse } from 'next';

// // Replace with your actual Gemini API endpoint and key
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/{model=gemini-1.5-flash/*}:generateAnswer';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;  // Make sure to add this to your .env file

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Only POST requests are allowed' });
//   }

//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ message: 'Question is required' });
//   }

//   try {
//     // Make a request to the Gemini API
//     const response = await fetch(GEMINI_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GEMINI_API_KEY}`, // If Gemini requires an API key
//       },
//       body: JSON.stringify({
//         prompt: question,  // Adjust this according to the API's expected input format
//         max_tokens: 150,  // Optional: Based on the API's request format
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to get response from Gemini API');
//     }

//     const data = await response.json();
//     const aiResponse = data.answer?.text || 'No response from AI'; 
//     // Send the Gemini API response back to the client
//     return res.status(200).json({ answer:aiResponse});
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// app/api/chat/route.ts
// app/api/chat/route.ts
// import { NextResponse } from 'next/server';

// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/{model=models/gemini-1.5-flash}:generateAnswer';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

// export async function POST(request: Request) {
//   try {
//     const { question } = await request.json();

//     if (!question) {
//       return NextResponse.json({ message: 'Question is required' }, { status: 400 });
//     }

//     const response = await fetch(GEMINI_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GEMINI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         prompt: question,
//         max_tokens: 150,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to get response from Gemini API');
//     }

//     const data = await response.json();
//     const aiResponse = data.answer?.text || 'No response from AI';

//     return NextResponse.json({ answer: aiResponse });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }

// app/api/chat/route.ts
import { NextResponse } from 'next/server';
// Import Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

const conversationHistory: string[] = [];

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json({ response: 'Message is required' }, { status: 400 });
    }

    // Initialize Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model you want to use (in this case, "gemini-1.5-flash")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    conversationHistory.push(`User: ${question}`);
    // Generate content based on the user message
    const result = await model.generateContent(conversationHistory.join(" "));

    // Extract the AI response from the result
    const aiResponse = result.response.text(); // Adjust according to the response format
    console.log(aiResponse)

    conversationHistory.push(`AI: ${aiResponse}`);
    // Send the Gemini API response back to the client
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error fetching AI response from Gemini API:', error);
    return NextResponse.json({ response: 'Error fetching AI response from Gemini API' }, { status: 500 });
  }
}
