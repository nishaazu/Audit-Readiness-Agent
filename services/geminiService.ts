import { GoogleGenAI, Type } from "@google/genai";
import { OutletScoreResult } from '../types';
import { SYSTEM_PROMPT } from '../constants';

// Initialize Gemini Client
// In a real app, strict env var checks would happen here.
// For this generated code, we assume process.env.API_KEY is available or handled by the framework.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateImprovementPlan = async (scoreData: OutletScoreResult): Promise<{ gaps: string[], plan: string, nextReview: string }> => {
  
  const model = "gemini-2.5-flash"; // Using fast model for responsiveness

  const prompt = `
    Analyze the following audit data for outlet "${scoreData.outletName}" and generate the "Gaps Identified" and "Improvement Plan" exactly as defined in the system prompt.
    
    Current Score: ${scoreData.overallScore}%
    Status: ${scoreData.status}

    Component Data:
    1. Material Compliance: Score ${scoreData.components.material.score}% 
       (Expired: ${scoreData.components.material.details.expired}, Non-Compliant: ${scoreData.components.material.details.nonCompliant})
    2. Menu Compliance: Score ${scoreData.components.menu.score}%
       (Non-Compliant: ${scoreData.components.menu.details.nonCompliant}, Partial: ${scoreData.components.menu.details.partial})
    3. Documentation: Score ${scoreData.components.documentation.score}%
       (Categories: ${JSON.stringify(scoreData.components.documentation.details.categories)})
    4. Alerts: Score ${scoreData.components.alerts.score}%
       (High: ${scoreData.components.alerts.details.high}, Medium: ${scoreData.components.alerts.details.medium}, Low: ${scoreData.components.alerts.details.low})

    Return a JSON object with:
    - gaps_identified: string[] (2-4 concise gap statements)
    - improvement_plan: string (The full formatted text plan as per the template)
    - next_review_date: string (YYYY-MM-DD based on logic)
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gaps_identified: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvement_plan: { type: Type.STRING },
            next_review_date: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const json = JSON.parse(text);
    return {
      gaps: json.gaps_identified || [],
      plan: json.improvement_plan || "No plan generated.",
      nextReview: json.next_review_date || new Date().toISOString().split('T')[0]
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if API fails (graceful degradation)
    return {
      gaps: ["Error analyzing gaps due to connectivity."],
      plan: "Could not generate improvement plan. Please check system logs.",
      nextReview: new Date().toISOString().split('T')[0]
    };
  }
};
