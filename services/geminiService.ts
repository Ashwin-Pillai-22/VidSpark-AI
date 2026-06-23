
import { GoogleGenAI, Type } from "@google/genai";
import { IdeaRequest, VideoIdea, VideoDuration } from "../types";

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const generateIdeas = async (params: IdeaRequest): Promise<VideoIdea[]> => {
  // CRITICAL: Create a new instance right before the call to pick up the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let lengthInstruction = "";
    if (params.duration === VideoDuration.SHORT) {
      lengthInstruction = `
        FORMAT: High-retention vertical short (9:16).
        STRUCTURE: 
        1. 0-3s: Aggressive visual and audio hook. 
        2. 3-15s: Fast-paced core value/story. 
        3. 15-50s: Rapid delivery with 3-5 sub-points. 
        4. 50-60s: Loop-able ending or clear CTA.
        Total word count: 150-250 words.
      `;
    } else if (params.duration === VideoDuration.MEDIUM) {
      lengthInstruction = `
        FORMAT: Professional landscape standard video (16:9).
        STRUCTURE:
        1. Narrative Intro: Set the stakes.
        2. Core Deep Dive: 6+ logical chapters using data, stories, and analogies.
        3. Mid-roll hook: Re-engagement point.
        4. Conclusion: Tactical takeaways.
        TARGET: 2000+ words. STRICT MANDATE: No summaries.
      `;
    } else if (params.duration === VideoDuration.LONG) {
      lengthInstruction = `
        FORMAT: Masterclass Documentary / Essay style (16:9).
        STRUCTURE:
        1. Cinematic Prelude: Philosophical or high-impact start.
        2. 12+ Comprehensive Chapters: Historical context, technical deep dives, case studies, future projections.
        3. Interstitial visual directives for slow-burn pacing.
        4. Grand Manifesto Conclusion.
        TARGET: 4500+ words. ZERO TRUNCATION.
      `;
    }

    const prompt = `
      Act as a world-class viral video strategist and head scriptwriter. Generate exactly 4 distinct, creative, and high-performing video ideas for **${params.platform}** based on the following:
      
      - **Topic:** ${params.topic}
      - **Mood/Vibe:** ${params.mood}
      - **Duration Category:** ${params.duration}

      ${lengthInstruction}

      FORMATTING RULES: Use Speaker: "Dialog", [SFX: Sound], (Visual: Action). 
      Return as a JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the world's most detailed scriptwriter. You specialize in viral content adapted to specific video lengths. You NEVER provide summaries. You provide the FULL script.",
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
    if (!jsonString) throw new Error("No data returned from AI");

    const rawIdeas = JSON.parse(jsonString);

    return rawIdeas.map((idea: any) => ({
      ...idea,
      id: generateId(),
      platform: params.platform,
      topic: params.topic,
      timestamp: Date.now()
    }));

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    // Check for the specific "entity not found" error which implies API key issues
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_NOT_FOUND");
    }
    
    if (error instanceof Error) {
        throw new Error(`Failed to generate scripts: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating your content.");
  }
};
