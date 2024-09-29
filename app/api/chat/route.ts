
// const socraticPrompt = `
//       You are a Socratic tutor helping a student understand the merge sort algorithm. 
//       Your goal is to guide the student through the learning process by asking questions 
//       and encouraging them to think deeply. Avoid explaining directly, instead focus on 
//       asking questions based on their answers.

//       Use the conversation history to ask follow-up questions that assess whether the student has a solid grasp of the key concepts behind merge sort (divide and conquer, splitting, merging, and time complexity). If the student responds correctly or provides clear explanations of how merge sort works, acknowledge that they have understood the topic.No more than 10 questions should be asked.

//       If the student insists that they have understood the topic, even without fully detailed answers, acknowledge that the student has learned the basics of merge sort.

//       Here is the conversation so far: ${conversationHistory.join(" ")}

//       Based on the user's last response, either continue asking questions to probe their understanding or, if they have demonstrated or insisted they understand, conclude that they know the basics of merge sort and tell them this -"You have understood the basics of merge sort"
//     `;

// export async function POST(request: Request) {
//   try {
//     const { message, code } = await request.json();
//     console.log(message);
//     console.log(code);
//     if (!message) {
//       return NextResponse.json({ response: 'Message is required' }, { status: 400 });
//     }

//     // Initialize Google Generative AI with your API key
//     const genAI = new GoogleGenerativeAI(apiKey);

//     // Get the model you want to use (in this case, "gemini-1.5-flash")
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     conversationHistory.push(`User: ${message}`);
//     // Generate content based on the user message
//     // const toBeSent = message + code;
//     const result = await model.generateContent(socraticPrompt);

//     // Extract the AI response from the result
//     const aiResponse = result.response.text(); // Adjust according to the response format
//     console.log(aiResponse)

//     conversationHistory.push(`AI: ${aiResponse}`);
//     // Send the Gemini API response back to the client
//     return NextResponse.json({ reply: aiResponse });
//   } catch (error) {
//     console.error('Error fetching AI response from Gemini API:', error);
//     return NextResponse.json({ response: 'Error fetching AI response from Gemini API' }, { status: 500 });
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
    const { message, code } = await request.json();
    console.log(message);
    console.log(code);

    if (!message) {
      return NextResponse.json({ response: 'Message is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    conversationHistory.push(`User: ${message}`);
    conversationHistory.push(`UserCode: ${code}`)
    console.log(conversationHistory);
    const socraticPrompt = `
      You are a Socratic tutor helping a student understand the merge sort algorithm. 
      Your goal is to guide the student through the learning process by asking questions 
      and encouraging them to think deeply. Avoid explaining directly, instead focus on 
      asking questions based on their answers.

      Use the conversation history to ask follow-up questions that assess whether the student has a solid grasp of the key concepts behind merge sort (divide and conquer, splitting, merging, and time complexity). If the student responds correctly or provides clear explanations of how merge sort works, acknowledge that they have understood the topic.No more than 10 questions should be asked.

      If the student insists that they have understood the topic, even without fully detailed answers, acknowledge that the student has learned the basics of merge sort.

      Here is the conversation so far: ${conversationHistory.join(" ")}

      Based on the user's last response, either continue asking questions to probe their understanding or, if they have demonstrated or insisted they understand, conclude that they know the basics of merge sort and tell them this -"You have understood the basics of merge sort"
    `;

    const result = await model.generateContent( socraticPrompt );
    const aiResponse = result.response.text();
    console.log(aiResponse);
    conversationHistory.push(`AI: ${aiResponse}`);

    return NextResponse.json({ reply: aiResponse});
  } catch (error) {
    console.error('Error fetching AI response from Gemini API:', error);
    return NextResponse.json({ response: 'Error fetching AI response from Gemini API' }, { status: 500 });
  }
}

// If AI deems the user has basic knowledge, display the C++ merge sort code
//   const code = `
//   #include <iostream>
//   using namespace std;

//   void merge(int arr[], int l, int m, int r) { /* Merging logic */ }
//   void mergeSort(int arr[], int l, int r) {
//       if (l < r) {
//           int m = l + (r - l) / 2;
//           mergeSort(arr, l, m);
//           mergeSort(arr, m + 1, r);
//           merge(arr, l, m, r);
//       }
//   }
//   void printArray(int A[], int size) {
//       for (int i = 0; i < size; i++) cout << A[i] << " ";
//       cout << endl;
//   }

//   int main() {
//       int arr[] = {12, 11, 13, 5, 6, 7};
//       int arr_size = sizeof(arr) / sizeof(arr[0]);
//       cout << "Given array is \\n";
//       printArray(arr, arr_size);
//       mergeSort(arr, 0, arr_size - 1);
//       cout << "\\nSorted array is \\n";
//       printArray(arr, arr_size);
//       return 0;
//   }
// `;

// Check if user has understood the basics based on AI response
// if (aiResponse.includes('understood the basics of merge sort')) {
//   // Present the C++ code and start Socratic questioning
//   socraticPrompt = `
//     The following C++ merge sort code has been presented to the student, and it is visible to them:
//     ${code}
//     Now, continue in a Socratic manner by modifying parts of the code and asking the student how the code would behave differently.
// Focus on variables, base cases, and large inputs.

// You can modify the following parts of the code:
// - Change the base case of the mergeSort function.
// - Alter how the array is split in recursive calls.
// - Modify the merge function or add new variables.

// After making these changes, ask the student how the behavior of the code changes. If the student gets the answers wrong, return to the relevant concepts.
//     If the student answers correctly, continue until they fully understand merge sort.
//   `;

// const followUpResult = await model.generateContent( socraticPrompt );
// const followUpResponse = await followUpResult.response.text();
