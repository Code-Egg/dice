import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DiceType, AiFortune } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getRollFortune = async (roll: number, diceType: DiceType): Promise<AiFortune> => {
  const ai = getAiClient();
  if (!ai) {
    return {
      text: "The stars are silent (API Key missing).",
      tone: 'neutral'
    };
  }

  try {
    const prompt = `
      The user rolled a ${roll} on a ${diceType}-sided die in a game of chance.
      Act as a mystical Dungeon Master or Fortune Teller.
      Provide a very short, witty, or dramatic interpretation of this result (max 15 words).
      
      Return ONLY a JSON object with this structure (no markdown):
      {
        "text": "Your interpretation string here",
        "tone": "lucky" | "neutral" | "ominous"
      }
      
      Examples:
      Roll 1 on D6: {"text": "A critical failure! Stumble and fall.", "tone": "ominous"}
      Roll 6 on D6: {"text": "Perfection! The gods smile upon you.", "tone": "lucky"}
      Roll 21 on D21: {"text": "Unimaginable power courses through your veins!", "tone": "lucky"}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);

    return {
      text: result.text || "Destiny is unclear.",
      tone: result.tone || "neutral"
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "The mists of time obscure your fate.",
      tone: "neutral"
    };
  }
};