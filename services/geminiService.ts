import { GoogleGenAI, Part, Content } from "@google/genai";
import { Message } from '../types';

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getTutorSystemInstruction = (courseName: string) => `You are a compassionate, Socratic AI math tutor. The user is currently studying ${courseName}. Your goal is to guide the user to solve the problem themselves, not to give them the answer.
- When you first see a problem, identify it and suggest the very first concrete step as a question.
- In subsequent turns, analyze the user's response.
- If the user is correct, affirm them and guide them to the next step.
- If the user is incorrect, gently correct them and explain the concept they missed.
- If the user asks "why" or a similar question, explain the reasoning for the previous step in a clear, concise way before prompting them to continue.
- Maintain a patient, encouraging, and slightly informal tone, like a friendly teacher.
- Never, under any circumstance, solve more than one step ahead of the user. Do not give the final answer.
- When the user has correctly arrived at the final answer and the problem is fully solved, end your final message with the token [SOLVED] on a new line.
- Format mathematical expressions using LaTeX within single dollar signs for inline math (e.g., $x^2+y^2=r^2$) and double dollar signs for block math (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$).
`;

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const startTutoringSession = async (imageFile: File, courseName: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = "Here is a math problem. Start the tutoring session by identifying the problem and guiding me through the very first step.";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            systemInstruction: getTutorSystemInstruction(courseName),
        },
    });

    return response.text;
}

export interface GeneratedProblemResponse {
    problemStatement: string;
    firstStep: string;
}

export const startGeneratedSession = async (courseName: string): Promise<GeneratedProblemResponse> => {
    const prompt = `You are a compassionate, Socratic AI math tutor. Generate a single, representative math problem for a student in a ${courseName} course. The problem should be challenging but solvable.
Then, start the tutoring session by guiding the user through the very first step as a question.

IMPORTANT: Structure your response with the problem statement and the first step separated by '|||'.
For example:
Problem: $\\int 2x \\cos(x^2) dx$|||Great! Let's tackle this integral. It looks like a good candidate for a special technique. Have you heard of u-substitution? What might be a good choice for 'u' here?`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            thinkingConfig: {
                thinkingBudget: 32768,
            },
        }
    });

    const responseText = response.text;
    const parts = responseText.split('|||');

    if (parts.length < 2) {
        console.error("Gemini response did not follow the expected format:", responseText);
        return {
            problemStatement: "The AI couldn't generate a problem in the correct format. Please try again.",
            firstStep: "Sorry, I seem to have gotten stuck generating a problem. Would you like to try again?",
        };
    }

    const problem = parts[0].replace('Problem:', '').trim();
    const firstStep = parts[1].trim();
    
    return { problemStatement: problem, firstStep };
}


interface TutoringResponse {
    text: string;
    isCompleted: boolean;
}

export const continueTutoring = async (chatHistory: Message[], courseName: string): Promise<TutoringResponse> => {
    const contents: Content[] = chatHistory.map(message => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text }],
    }));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: contents,
        config: {
            systemInstruction: getTutorSystemInstruction(courseName),
            thinkingConfig: {
                thinkingBudget: 32768,
            },
        },
    });

    let responseText = response.text;
    const isCompleted = responseText.includes('[SOLVED]');
    if (isCompleted) {
        responseText = responseText.replace('[SOLVED]', '').trim();
    }

    return { text: responseText, isCompleted };
}