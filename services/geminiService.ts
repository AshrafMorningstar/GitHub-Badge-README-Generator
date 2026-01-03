/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import { GoogleGenAI, Type } from "@google/genai";
import { Badge } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches a structured library of GitHub badges using Gemini JSON mode.
 * It also tries to determine ownership if a username is provided.
 */
export const fetchBadgeLibrary = async (username: string): Promise<Badge[]> => {
  const prompt = `
    Generate a comprehensive JSON list of GitHub Achievements and Profile Badges.
    Include standard achievements (Galaxy Brain, Pull Shark, YOLO, Quickdraw, Starstruck, Pair Extraordinaire), 
    retired badges (Arctic Code Vault, Mars 2020), and profile highlights (Pro, Developer Program, GitHub Star).
    
    For each badge, provide:
    - Name
    - A representative Emoji
    - Description
    - Category (Earnable, Retired, Highlight)
    - Rarity (Common, Rare, Epic, Legendary - estimate this based on difficulty)
    - How to Earn (short strategy)
    - Tiers (e.g. "Bronze, Silver, Gold" or "x1, x10, x100", or "Single Tier" if none)
    
    ${username ? `Also, based on your knowledge, mark 'isOwned' as true if the user "${username}" is likely to have it (or if it's a common default). If unsure, set false.` : "Set isOwned to false for all."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              emoji: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Earnable', 'Retired', 'Highlight', 'Custom'] },
              rarity: { type: Type.STRING, enum: ['Common', 'Rare', 'Epic', 'Legendary'] },
              howToEarn: { type: Type.STRING },
              tiers: { type: Type.ARRAY, items: { type: Type.STRING } },
              isOwned: { type: Type.BOOLEAN },
            },
            required: ["id", "name", "emoji", "description", "category", "rarity", "howToEarn", "tiers", "isOwned"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Badge[];
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Badge Library Fetch Failed:", error);
    // Fallback data if AI fails
    return [
      { id: 'galaxy-brain', name: 'Galaxy Brain', emoji: '🧠', description: 'Participate in discussions.', category: 'Earnable', rarity: 'Rare', howToEarn: 'Get 2 accepted answers in discussions.', tiers: ['Bronze', 'Silver', 'Gold'], isOwned: false },
      { id: 'pull-shark', name: 'Pull Shark', emoji: '🦈', description: 'Merge pull requests.', category: 'Earnable', rarity: 'Common', howToEarn: 'Merge 2 pull requests.', tiers: ['Bronze', 'Silver', 'Gold'], isOwned: false },
    ];
  }
};

/**
 * Generates the README markdown using the Thinking model for complex structuring.
 * Now accepts structured Badge[] data.
 */
export const generateReadmeText = async (
  badges: Badge[],
  repoName: string,
  heroImageUrl: string | null
): Promise<string> => {
  
  // Filter for the markdown generation
  const ownedBadges = badges.filter(b => b.isOwned);
  const earnableBadges = badges.filter(b => b.category === 'Earnable' && !b.isOwned);
  const retiredBadges = badges.filter(b => b.category === 'Retired');

  const dataContext = JSON.stringify({
    owned: ownedBadges.map(b => b.name),
    earnable: earnableBadges.map(b => ({ name: b.name, emoji: b.emoji, desc: b.description, tiers: b.tiers, guide: b.howToEarn })),
    retired: retiredBadges.map(b => ({ name: b.name, emoji: b.emoji })),
  }, null, 2);

  const prompt = `
    You are an expert technical writer and UI designer.
    Create a stunning, visually engaging, and exceptionally well-organized README.md file for a GitHub repository titled "${repoName}".
    
    The design must feel premium, modern, and effortless to navigate.
    
    ${heroImageUrl ? `IMPORTANT: At the very top of the README, insert this image: ![Hero](${heroImageUrl})` : ''}

    Here is the STRUCTURED DATA representing the user's current badge status and the library of badges to display:
    ${dataContext}

    ### Core Design & Structure Mandates:

    1. **Hero Header:** Start with a large, centered title using emojis and stylish markdown. Add a concise, motivational tagline and a visually distinct badges count (Owned: ${ownedBadges.length}).
    2. **Visual Navigation (TOC):** Create a "✨ Quick Navigation" section.
    3. **User Progress Section:**
       - Title: "## 👤 My Badge Collection"
       - Display the 'owned' badges as a row of badges/emojis with names. Make it look like a trophy case.
    
    4. **Premium Table Design for Active Badges (Earnable):**
       - Title: "## 🎯 Earnable Achievements"
       - **CRITICAL: TABLE STYLING**: Use a Markdown table with strictly aligned columns.
       - Columns: 
         1. **Badge** (Use \`&nbsp;\` to separate Emoji and Name, e.g., \`🦈&nbsp;**Pull Shark**\`)
         2. **Description** (Keep concise, max 10 words)
         3. **Tiers** (Center aligned)
         4. **Strategy** (Brief actionable tip)
       - Formatting: Ensure the table uses standard markdown pipe syntax.
       
    5. **Retired & Legacy Badges:**
       - Title: "## 📜 The Hall of Legends (Retired)"
       - A simpler, compact table or list for retired badges.

    6. **Interactive & Clear Guides:**
       - Title: "## 🛠️ Detailed Earning Guides"
       - Pick the top 3 most difficult 'Earnable' badges from the data and create collapsible <details> sections with specific steps.

    7. **FAQ:** Format as "Q: ... A: ...".

    Output raw Markdown code only. Do not wrap in markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
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
          imageSize: "2K"
        },
      },
    });

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
