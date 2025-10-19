
// This is a MOCK service. It simulates calls to the Gemini API.
// In a real app, you would use `@google/genai` library here.
/*
import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: 'You are a helpful AI assistant for a service booking app called ProLink. You can help users find and book professionals like plumbers and electricians. Be friendly and concise.',
  },
});
*/

/**
 * Simulates getting a response from the Gemini AI assistant.
 * @param userMessage The user's message.
 * @returns A promise that resolves with the AI's response.
 */
export const getAIAssistantResponse = async (userMessage: string): Promise<string> => {
  console.log(`Sending to mock Gemini: "${userMessage}"`);

  // Mock API call using `chat.sendMessage`
  // const response = await chat.sendMessage({ message: userMessage });
  // const text = response.text;
  
  // In this mock, we'll use a simple logic to generate a response.
  const lowerCaseMessage = userMessage.toLowerCase();
  let responseText = "I'm sorry, I'm not sure how to help with that. I can assist with booking plumbers, electricians, and other professionals.";

  if (lowerCaseMessage.includes('plumber')) {
    responseText = "I can help with that! To find a plumber, please go to the Home screen, select the 'Plumber' category, and you'll see a list of available professionals near you.";
  } else if (lowerCaseMessage.includes('electrician')) {
    responseText = "Of course. You can find an electrician by tapping 'Home', choosing the 'Electrician' category, and then selecting a professional from the map or list.";
  } else if (lowerCaseMessage.includes('book')) {
     responseText = "To book a service, navigate to the Home screen, pick a service category, choose a professional, and tap the 'Book' button on their profile card.";
  } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    responseText = "Hello! How can I assist you with booking a service today?";
  }
  
  return new Promise(resolve => setTimeout(() => resolve(responseText), 800));
};
