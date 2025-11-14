
import { GoogleGenAI, Type } from "@google/genai";
import { Priority } from '../types';

// This is a placeholder for a real API key, which should be stored in environment variables.
// The prompt specifies to use process.env.API_KEY, so we'll use that.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. AI features will be disabled. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface AISuggestion {
    material: string;
    color: string;
    priority: Priority;
}

export const getPrintingSuggestions = async (pieceName: string, equipmentContext: string): Promise<AISuggestion | null> => {
    if (!API_KEY) {
        // Mock response if API key is not available
        console.log("Mocking AI suggestion due to missing API key.");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return {
            material: 'PETG',
            color: '#FFA500',
            priority: '1',
        };
    }
    
    const prompt = `You are a 3D printing expert in an industrial manufacturing setting, specifically a brewery. 
    A request has been made for a part with the following details:
    - Part Name: "${pieceName}"
    - Equipment Context: "${equipmentContext || 'Not specified'}"

    Based on this, suggest the most suitable printing material, a functional filament color (e.g., bright for visibility, dark for grease resistance), and a priority level.
    Priority: 1 for critical parts that stop production, 2 for important but non-critical parts, 3 for convenience or non-urgent parts.

    Respond ONLY with a JSON object in the specified format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        material: {
                            type: Type.STRING,
                            description: "The suggested filament material (e.g., PLA, PETG, ABS, TPU)."
                        },
                        color: {
                            type: Type.STRING,
                            description: "The suggested hex color code for the filament."
                        },
                        priority: {
                            type: Type.STRING,
                            description: "The suggested priority level as a string: '1', '2', or '3'."
                        }
                    },
                    required: ["material", "color", "priority"]
                },
            },
        });

        const jsonText = response.text.trim();
        const suggestion = JSON.parse(jsonText) as AISuggestion;
        
        // Validate priority value
        if (!['1', '2', '3'].includes(suggestion.priority)) {
            suggestion.priority = '2'; // Default to medium if invalid
        }

        return suggestion;
    } catch (error) {
        console.error("Error fetching suggestions from Gemini API:", error);
        return null;
    }
};
