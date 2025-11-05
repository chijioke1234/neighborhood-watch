
import { GoogleGenAI, Type } from "@google/genai";
import { IncidentAnalysis, IncidentCategory, IncidentSeverity } from '../types';

// FIX: Per coding guidelines, the API key must be sourced exclusively from `process.env.API_KEY` without fallbacks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        severity: {
            type: Type.STRING,
            enum: [IncidentSeverity.LOW, IncidentSeverity.MEDIUM, IncidentSeverity.HIGH],
            description: 'The assessed severity of the incident.'
        },
        category: {
            type: Type.STRING,
            enum: [
                IncidentCategory.SUSPICIOUS_ACTIVITY,
                IncidentCategory.THEFT,
                IncidentCategory.VANDALISM,
                IncidentCategory.TRAFFIC,
                IncidentCategory.LOST_PET,
                IncidentCategory.OTHER
            ],
            description: 'The category that best fits the incident.'
        },
        summary: {
            type: Type.STRING,
            description: 'A concise, one-sentence summary of the incident for a community feed.'
        }
    },
    required: ['severity', 'category', 'summary']
};

export const analyzeIncident = async (description: string): Promise<IncidentAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following neighborhood watch report and classify it. Description: "${description}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonString = response.text.trim();
        const analysisResult = JSON.parse(jsonString);
        
        // Ensure the returned values match our enums
        const category = Object.values(IncidentCategory).find(c => c === analysisResult.category) || IncidentCategory.OTHER;
        const severity = Object.values(IncidentSeverity).find(s => s === analysisResult.severity) || IncidentSeverity.UNKNOWN;

        return {
            category,
            severity,
            summary: analysisResult.summary
        };

    } catch (error) {
        console.error("Error analyzing incident with Gemini:", error);
        // Fallback in case of API error
        return {
            category: IncidentCategory.OTHER,
            severity: IncidentSeverity.UNKNOWN,
            summary: "Could not analyze incident. Please review."
        };
    }
};


export const generateSafetyTip = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a single, concise, and actionable safety tip for a neighborhood watch community. Make it friendly and proactive. Do not include a title or preamble.",
            config: {
                // To prevent overly long responses
                maxOutputTokens: 100,
                // FIX: Added thinkingConfig as it is required for gemini-2.5-flash when maxOutputTokens is set.
                thinkingConfig: { thinkingBudget: 50 },
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating safety tip:", error);
        return "Always double-check that your doors and windows are locked before leaving the house or going to bed.";
    }
};