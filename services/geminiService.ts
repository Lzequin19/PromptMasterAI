import { GoogleGenAI, Type } from "@google/genai";
import { PromptAnalysis } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const evaluatePrompt = async (userPrompt: string): Promise<PromptAnalysis> => {
  if (!apiKey) throw new Error("API Key faltante");

  const modelId = "gemini-2.5-flash"; // Good balance of speed and reasoning for this task

  const prompt = `
    Actúa como un Instructor Experto en Ingeniería de Prompts (Prompt Engineering). 
    Tu tarea es analizar el siguiente prompt proporcionado por un usuario.
    
    PROMPT DEL USUARIO:
    "${userPrompt}"

    Debes evaluar el prompt basándote en las siguientes dimensiones (escala 0-10):
    1. Objetivo: ¿Está clara la intención?
    2. Contexto: ¿Hay suficiente información de fondo?
    3. Rol: ¿Se asigna una persona o rol a la IA?
    4. Formato de Salida: ¿Se especifica cómo debe ser la respuesta?
    5. Instrucciones: ¿Son claros los pasos a seguir?
    6. Ejemplos (Few-Shot): ¿Se incluyen ejemplos? (Si no es necesario, puntúa neutral o alto si el prompt es simple, pero bajo si es complejo y faltan).
    7. Restricciones: ¿Se dice qué NO hacer?

    Genera una respuesta JSON estructurada que incluya:
    - Puntajes numéricos para cada categoría.
    - Una lista de fortalezas.
    - Una lista de debilidades/fallas.
    - Sugerencias concretas y educativas para mejorarlo.
    - Una lista de "Cambios Clave" realizados en la optimización.
    - Una versión OPTIMIZADA del prompt. **IMPORTANTE: El prompt optimizado DEBE estar estructurado en formato JSON** con claves claras (ej: "rol", "contexto", "tarea", "instrucciones", "formato_salida", "restricciones"). Esto ayuda a modularizar y clarificar la petición a la IA.
    - Una breve explicación general.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scores: {
              type: Type.OBJECT,
              properties: {
                objective: { type: Type.NUMBER, description: "Puntaje de claridad de objetivo 0-10" },
                context: { type: Type.NUMBER, description: "Puntaje de contexto 0-10" },
                role: { type: Type.NUMBER, description: "Puntaje de asignación de rol 0-10" },
                format: { type: Type.NUMBER, description: "Puntaje de formato de salida 0-10" },
                instructions: { type: Type.NUMBER, description: "Puntaje de instrucciones paso a paso 0-10" },
                examples: { type: Type.NUMBER, description: "Puntaje de uso de ejemplos 0-10" },
                constraints: { type: Type.NUMBER, description: "Puntaje de restricciones negativas 0-10" },
                overall: { type: Type.NUMBER, description: "Puntaje general promedio 0-10" },
              },
              required: ["objective", "context", "role", "format", "instructions", "examples", "constraints", "overall"]
            },
            feedback: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["strengths", "weaknesses"]
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de mejoras concretas aplicadas"
            },
            key_changes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Título corto del cambio (ej: 'Rol Añadido')" },
                  description: { type: Type.STRING, description: "Explicación de por qué este cambio mejora el prompt" },
                  type: { type: Type.STRING, enum: ["addition", "modification", "removal"] }
                },
                required: ["title", "description", "type"]
              },
              description: "Lista explicativa de los cambios realizados entre el original y el optimizado"
            },
            optimizedPrompt: {
              type: Type.STRING,
              description: "La versión reescrita del prompt estructurada estrictamente como un objeto JSON (con claves role, context, task, etc)."
            },
            explanation: {
              type: Type.STRING,
              description: "Resumen educativo de por qué se hicieron los cambios"
            }
          },
          required: ["scores", "feedback", "suggestions", "optimizedPrompt", "explanation", "key_changes"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No se recibió respuesta del modelo");
    
    return JSON.parse(jsonText) as PromptAnalysis;

  } catch (error) {
    console.error("Error evaluating prompt:", error);
    throw error;
  }
};