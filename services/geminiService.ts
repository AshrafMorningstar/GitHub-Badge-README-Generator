import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Searches for the latest GitHub Achievements using Google Search Grounding.
 * Uses gemini-2.5-flash for speed.
 */
export const fetchLatestAchievementsData = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "List all current available GitHub Achievements, how to earn them, their tiers (bronze, silver, gold), and list the retired ones. Be specific and up to date.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) return "Could not retrieve search data.";
    return text;
  } catch (error) {
    console.error("Search failed:", error);
    return "Search unavailable. Using internal knowledge.";
  }
};

/**
 * Generates the README markdown using the Thinking model for complex structuring.
 * Uses gemini-3-pro-preview with a high thinking budget.
 */
export const generateReadmeText = async (
  contextData: string, 
  repoName: string,
  heroImageUrl: string | null
): Promise<string> => {
  const prompt = `
    You are an expert technical writer and UI designer.
    Create a stunning, visually engaging, and exceptionally well-organized README.md file for a GitHub repository titled "${repoName}".
    
    The design must feel premium, modern, and effortless to navigate. Prioritize clarity and visual appeal over plain text.
    
    ${heroImageUrl ? `IMPORTANT: At the very top of the README, insert this image: ![Hero](${heroImageUrl})` : ''}

    Here is the latest data about GitHub Achievements to reference:
    ${contextData}

    ### Core Design & Structure Mandates:

    1. **Hero Header:** Start with a large, centered title using emojis and stylish markdown. Add a concise, motivational tagline and a visually distinct badges count.
    2. **Visual Navigation (TOC):** Create a "✨ Quick Navigation" section.
    3. **Premium Table Design for Active Badges:**
       - Section Title: "## 🎯 Active Achievements You Can Earn"
       - Table Structure: Badge (Emoji + Bold Name), How to Earn, Tiers & Status.
       - Use colors/emojis: ✅ Active, 🌱 Base, 🥉 Bronze, 🥈 Silver, 🥇 Gold.
    4. **Status-Specific Sections:**
       - Retired Badges: "## 📜 Retired & Legacy Badges" (simpler table).
       - Profile Highlights: "## 🌟 Profile Highlights" (e.g. Pro, Star).
    5. **Interactive & Clear Guides:**
       - Title: "## 🛠️ Detailed Earning Guides"
       - Use collapsible <details> sections for major badges.
    6. **FAQ:** Format as "Q: ... A: ...".

    Output raw Markdown code only. Do not wrap in markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for pro model
      }
    });

    return response.text || "# Error generating content";
  } catch (error) {
    console.error("Text generation failed:", error);
    throw new Error("Failed to generate markdown content.");
  }
};

/**
 * Generates a Hero Image for the README.
 * Uses gemini-3-pro-image-preview.
 */
export const generateReadmeHero = async (): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: 'A premium, dark-mode inspired 3D visualization of GitHub Achievement badges (Mars, Quickdraw, Pull Shark) floating in space, hero header style, digital art, high quality, neon accents, wide aspect ratio.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K" // 2K Resolution as requested
        },
      },
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
