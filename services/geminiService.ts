import { GoogleGenAI, Chat } from "@google/genai";
import { KNOWLEDGE_BASE } from '../constants';
import { ImageFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are a friendly and professional AI assistant for the Adamawa State Scholarship Trust Fund (ADSSTF). Your primary goal is to answer questions based ONLY on the provided knowledge base.

Here is the knowledge base:
---
${KNOWLEDGE_BASE}
---

When a user asks a question, follow these rules:
1.  Carefully analyze the user's question.
2.  Formulate your answer strictly using the information from the knowledge base above. Do not use any external knowledge.
3.  If the user's question cannot be answered using the knowledge base, you MUST respond with: "I'm sorry, but I can only answer questions related to the Adamawa State Scholarship Trust Fund based on the information I have. Could you please ask something else?"
4.  Do not invent information.
5.  Be concise and clear in your responses.
6.  If the user greets you or makes small talk, respond politely and briefly, then gently guide them back to asking questions about the ADSSTF.`;

export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const getChatResponse = async (chat: Chat, newMessage: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};

// Fix: Add and export `analyzeImage` function to handle multimodal queries with text and an image, resolving the export error.
export const analyzeImage = async (prompt: string, image: ImageFile): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    };
    const textPart = {
      text: prompt,
    };
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Sorry, something went wrong while analyzing the image. Please try again.";
  }
};
