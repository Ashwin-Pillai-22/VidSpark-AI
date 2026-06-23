
import { GoogleGenAI, Type } from "@google/genai";
import { IdeaRequest, VideoIdea, VideoDuration } from "../types";

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

/**
 * GEMINI PROVIDER (Default)
 */
async function generateWithGemini(params: IdeaRequest, prompt: string, lengthInstruction: string): Promise<any[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are the world's most detailed scriptwriter. ${lengthInstruction}`,
      temperature: 0.8,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 24576 },
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            visuals: { type: Type.STRING },
            script: { type: Type.STRING },
            hashtags: { type: Type.STRING }
          },
          required: ["title", "hook", "visuals", "script", "hashtags"]
        }
      }
    }
  });

  const jsonString = response.text?.trim();
  if (!jsonString) throw new Error("No data returned from Gemini");
  return JSON.parse(jsonString);
}

/**
 * OPENAI PROVIDER
 */
async function generateWithOpenAI(params: IdeaRequest, prompt: string): Promise<any[]> {
  const apiKey = (process.env as any).OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY in environment.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a viral script generator. Return ONLY a JSON array of 4 objects with keys: title, hook, visuals, script, hashtags." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(`OpenAI Error: ${data.error.message}`);
  
  // OpenAI usually wraps the array in an object if you ask for json_object
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : (parsed.ideas || parsed.scripts || Object.values(parsed)[0]);
}

/**
 * PERPLEXITY PROVIDER
 */
async function generateWithPerplexity(params: IdeaRequest, prompt: string): Promise<any[]> {
  const apiKey = (process.env as any).PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error("Missing PERPLEXITY_API_KEY in environment.");

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-large-128k-online",
      messages: [
        { role: "system", content: "You are a viral script generator. Return ONLY a valid JSON array of objects." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(`Perplexity Error: ${data.error.message}`);
  
  const content = data.choices[0].message.content;
  // Perplexity doesn't always support json_mode strictly, so we clean the output
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Perplexity failed to return a valid JSON array.");
  return JSON.parse(jsonMatch[0]);
}

/**
 * MASTER GENERATOR
 */
export const generateIdeas = async (params: IdeaRequest): Promise<VideoIdea[]> => {
  const provider = ((process.env as any).AI_PROVIDER || 'gemini').toLowerCase();

  let lengthInstruction = "";
  if (params.duration === VideoDuration.SHORT) {
    lengthInstruction = "High-retention 9:16 vertical short script, 150-250 words.";
  } else if (params.duration === VideoDuration.MEDIUM) {
    lengthInstruction = "Standard 16:9 landscape video script, 2000+ words.";
  } else {
    lengthInstruction = "Deep dive 16:9 documentary/essay script, 4500+ words.";
  }

  const prompt = `
    Act as a world-class viral video strategist. Generate 4 distinct, creative, and high-performing video ideas for ${params.platform}.
    
    Topic: ${params.topic}
    Mood: ${params.mood}
    Format: ${params.duration}
    
    CRITICAL SCRIPT INSTRUCTIONS:
    - Write the full script with dialogue.
    - Insert [SFX: specific sound description] frequently between lines to indicate audio cues for retention.
    - Insert [Meme: specific meme name/reference] to indicate funny meme overlays or cuts.
    - Use (Visual: camera angle/action) for visual direction.
    - Be generous with SFX and Memes to keep the video engaging.

    Return a JSON array of objects with keys: title, hook, visuals, script, hashtags.
    ${lengthInstruction}
  `;

  try {
    let rawIdeas: any[];

    switch (provider) {
      case 'openai':
        rawIdeas = await generateWithOpenAI(params, prompt);
        break;
      case 'perplexity':
        rawIdeas = await generateWithPerplexity(params, prompt);
        break;
      case 'gemini':
      default:
        rawIdeas = await generateWithGemini(params, prompt, lengthInstruction);
        break;
    }

    return rawIdeas.map((idea: any) => ({
      ...idea,
      id: generateId(),
      platform: params.platform,
      topic: params.topic,
      timestamp: Date.now()
    }));

  } catch (error: any) {
    console.error(`${provider.toUpperCase()} Generation Error:`, error);
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_NOT_FOUND");
    }
    throw error;
  }
};
