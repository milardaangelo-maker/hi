import { GoogleGenAI, Type } from "@google/genai";
import { EnergyData, AuditRecord, SavingsReport } from '../types';

// Initialize Gemini Client
// CRITICAL: Using strict process.env.API_KEY usage as requested.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates energy savings advice for a customer based on their input data.
 * Uses gemini-3-flash-preview for speed.
 */
export const generateCustomerAdvice = async (data: EnergyData): Promise<SavingsReport> => {
  const prompt = `
    Analyze the following energy usage data for a Dutch household:
    - Electricity: ${data.electricityKwh} kWh/year
    - Gas: ${data.gasM3} m3/year
    - Monthly Cost: €${data.monthlyCost}
    - Household Size: ${data.householdSize} persons
    - Property Type: ${data.propertyType}

    Act as an energy consultant. Provide a JSON response with:
    1. Projected annual cost after implementing standard energy saving measures (insulation, solar panels, heat pump, behavioral changes).
    2. A list of 3 specific, actionable tips in Dutch.
    3. Estimated ROI in years for major investments.
    4. Current annual cost based on monthly * 12.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentAnnualCost: { type: Type.NUMBER },
            projectedAnnualCost: { type: Type.NUMBER },
            potentialSavings: { type: Type.NUMBER },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            roiYear: { type: Type.NUMBER }
          },
          required: ["currentAnnualCost", "projectedAnnualCost", "potentialSavings", "tips", "roiYear"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as SavingsReport;
  } catch (error) {
    console.error("Error generating advice:", error);
    // Fallback mock data in case of error to prevent app crash during demo if key is invalid
    return {
      currentAnnualCost: data.monthlyCost * 12,
      projectedAnnualCost: data.monthlyCost * 12 * 0.8,
      potentialSavings: data.monthlyCost * 12 * 0.2,
      tips: ["Controleer uw isolatie.", "Overweeg zonnepanelen.", "Zet de thermostaat een graadje lager."],
      roiYear: 3.5
    };
  }
};

/**
 * Analyzes a sales audit for staff members.
 * Uses gemini-3-pro-preview for deeper reasoning.
 */
export const analyzeAudit = async (audit: AuditRecord): Promise<string> => {
  const prompt = `
    Je bent een technische sales engineer voor energieoplossingen. Analyseer deze woningopname (audit):
    
    Klant: ${audit.clientName}
    Adres: ${audit.address}
    Woningtype: ${audit.propertyType}
    Notities van adviseur: "${audit.notes}"

    Geef een professionele samenvatting voor het verkoopteam.
    Identificeer:
    1. De grootste kansen voor verduurzaming.
    2. Mogelijke technische obstakels op basis van de notities.
    3. Een aanbevolen verkoopstrategie voor deze klant.

    Schrijf het antwoord in het Nederlands, professioneel opgemaakt met markdown bullets.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Kon geen analyse genereren.";
  } catch (error) {
    console.error("Error analyzing audit:", error);
    return "Er is een fout opgetreden bij de AI-analyse. Controleer uw API-sleutel.";
  }
};

/**
 * General chat interaction for the AI Assistant.
 */
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "Je bent 'EcoBot', een behulpzame AI-assistent in de EcoSave app. Je helpt zowel klanten met energiebesparingstips als personeel met technische vragen over audits, isolatiewaarden en warmtepompen. Antwoord altijd beknopt, behulpzaam en in het Nederlands."
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Sorry, ik begreep dat niet helemaal.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Er is een verbindingfout opgetreden met de AI service.";
  }
};
