import { GoogleGenerativeAI } from "@google/generative-ai";
import type { User } from "@/types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (apiKey && apiKey !== "") {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateUserBio(user: User): Promise<string> {
  if (!genAI) {
    return `${user.name} works at ${user.company.name} as a professional focused on ${user.company.catchPhrase.toLowerCase()}. They bring expertise and innovation to their role.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a brief professional bio (2-3 sentences) for this person based on their information:

Name: ${user.name}
Company: ${user.company.name}
Company Mission: ${user.company.catchPhrase}
Location: ${user.address.city}

Make it sound professional and engaging, focusing on their potential role and expertise.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return `${user.name} works at ${user.company.name} as a professional focused on ${user.company.catchPhrase.toLowerCase()}. They bring expertise and innovation to their role.`;
  }
}

export async function chatWithAI(user: User, question: string): Promise<string> {
  if (!genAI) {
    return "AI chat is not available. Please add a Gemini API key to enable this feature.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful assistant with information about this person:

Name: ${user.name}
Username: ${user.username}
Email: ${user.email}
Phone: ${user.phone}
Website: ${user.website}
Company: ${user.company.name}
Company Mission: ${user.company.catchPhrase}
Location: ${user.address.city}, ${user.address.zipcode}

User question: ${question}

Provide a helpful, concise response based on the available information. If you don't have the specific information, say so politely.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}
