import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, workspaceContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          'Hello Anas! Gemini AI is integrated into your workspace. Add GEMINI_API_KEY in your environment variables to activate live AI answers. Your tasks, finance, and study hub still work locally.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are Google's Gemini AI, integrated directly into Muhammed Anas P K's personal Academic & Life Management dashboard and FinTech workspace.
You have real-time access to his live workspace state:
- DOB: 13-02-2004
- Academic courses: B.Ed English, MA Arabic (Distance), Fiqhul Usra (Islamic PG), Certified Training Course
- Qualifications: BA English Literature (Calicut University), Diploma in Counselling Psychology (TSSR Council), Plus Two Commerce, SSLC
- Financial Ledger: Net Tally (Savings + Receivables - Payables), bank account details at SBI, UPI/GPay ID
- Tasks: Action Task Scheduler, Finishing Tasks, General Tasks
- Design Studio: Client projects, deadlines, design statuses
- Travels & Events ledger

WORKSPACE REAL-TIME DATA:
${JSON.stringify(workspaceContext ?? {}, null, 2)}

GUIDELINES:
1. Always be helpful, precise, friendly, and motivating.
2. If Anas asks about his pending tasks, finances, exams, or clients, answer with high specificity using the workspace data above.
3. If he asks in Malayalam (either Malayalam script or Manglish), respond warmly and naturally in Malayalam with clear formatting. If he asks in English, reply in English.
4. You can calculate budgets, plan study sessions, draft emails to clients, suggest design ideas, or help with academic coursework.
5. Format your answers cleanly with markdown bullets, bold headers, and concise tables where useful.`;

    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: { systemInstruction },
    });

    const reply = response.text || "I'm sorry, I couldn't generate a response at this moment.";
    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API Error:', message);
    return NextResponse.json(
      {
        error: message,
        reply: `An error occurred while connecting to Gemini: ${message}`,
      },
      { status: 500 }
    );
  }
}

