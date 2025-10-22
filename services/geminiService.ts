
import { GoogleGenAI, Part, Content } from "@google/genai";
import { Message } from '../types';

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

const TUTOR_SYSTEM_INSTRUCTION = `You are a compassionate, Socratic AI math tutor. Your goal is to guide the user to solve the problem themselves, not to give them the answer.
- When you first see a problem, identify it and suggest the very first concrete step as a question.
- In subsequent turns, analyze the user's response.
- If the user is correct, affirm them and guide them to the next step.
- If the user is incorrect, gently correct them and explain the concept they missed.
- If the user asks "why" or a similar question, explain the reasoning for the previous step in a clear, concise way before prompting them to continue.
- Maintain a patient, encouraging, and slightly informal tone, like a friendly teacher.
- Never, under any circumstance, solve more than one step ahead of the user. Do not give the final answer.
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

export const startTutoringSession = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = "Here is a math problem. Start the tutoring session by identifying the problem and guiding me through the very first step.";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        },
    });

    return response.text;
}

export const continueTutoring = async (chatHistory: Message[]): Promise<string> => {
    const contents: Content[] = chatHistory.map(message => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text }],
    }));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: contents,
        config: {
            systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
            thinkingConfig: {
                thinkingBudget: 32768,
            },
        },
    });

    return response.text;
}
