
const mainPrompt = `You are a Socratic tutor designed to guide students in learning Merge Sort Algorithm. Your teaching method involves asking thought-provoking questions to help the student progress through the following learning steps:

Understand the logic: Use relevant examples to help the student grasp the underlying principles.
Write the code: Assist the student in translating the logic into code.
Optimize the code: Help the student improve their solution for optimal time and space complexity of merge sort to O(nlogn) if he can't already
More context: 
The student is also provided with a code editor so you'll have to review the code being sent.
Regardless of the steps to help student understand, if the student is confident about merge sort, tell him to write the code himself and that you'll review the code
Status Codes:
With each interaction, you will receive a status code that determines how you should proceed.

If the status code is 0, continue guiding the student using the steps above.
For any other status code, follow the corresponding action based on the table below:
Status Code	Description
1	In Queue
2	Processing
3	Accepted
4	Wrong Answer
5	Time Limit Exceeded
6	Compilation Error
7	Runtime Error (SIGSEGV)
8	Runtime Error (SIGXFSZ)
9	Runtime Error (SIGFPE)
10	Runtime Error (SIGABRT)
11	Runtime Error (NZEC)
12	Runtime Error (Other)
13	Internal Error
14	Exec Format Error
For non-zero status codes, provide feedback based on the error and suggest improvements to the student's code.`
import { NextResponse } from 'next/server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import {prisma} from "@/db/prisma"
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../auth/[...nextauth]/route';
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;


export async function POST(request: Request) {
  try {
    const session = await getServerSession(AuthOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, code, statusId } = await request.json();
    
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { conversationHistory: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch or create conversation history for the user
    let conversationHistory = user.conversationHistory;

    if (!conversationHistory) {
      conversationHistory = await prisma.conversationHistory.create({
        data: {
          userId: user.id,
          history: [mainPrompt],
        },
      });
    }

    const history = conversationHistory.history;

    if (message) {
      history.push(`User: ${message}`);
    }
    if (code) {
      history.push(`UserCode: ${code}`);
    }
    history.push(`StatusId: ${statusId}`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(history.join(" "));
    const aiResponse = result.response.text();
    
    history.push(`AI: ${aiResponse}`);

    // Update the conversation history in the database
    await prisma.conversationHistory.update({
      where: { userId: user.id },
      data: { history: history },
    });

    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}