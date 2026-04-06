import { GoogleGenAI, Type } from "@google/genai";
import { CaseStudy, Decision, Critique } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateCritique(caseStudy: CaseStudy, decision: Decision): Promise<Critique> {
  const prompt = `
    As a top-tier McKinsey partner, critique the following business case decision.
    
    CASE:
    Title: ${caseStudy.title}
    Company: ${caseStudy.company}
    Situation: ${caseStudy.situation}
    Problem: ${caseStudy.problem}
    Data: ${caseStudy.partialData}
    
    USER DECISION:
    1. Problem Definition: ${decision.problemDefinition}
    2. Metric: ${decision.metric}
    3. Root Causes: ${decision.rootCauses}
    4. Hypotheses: ${decision.hypotheses}
    5. Action: ${decision.action}
    
    Provide a detailed critique in JSON format based on the following dimensions:
    - Structural: Logical flow and MECE (Mutually Exclusive, Collectively Exhaustive) structure.
    - Evidence: Use of provided data and logical inference.
    - Bias: Identification of cognitive biases or logical fallacies.
    - Strategic: Alignment with long-term value creation.
    - Implementation: Feasibility and tactical clarity.
    - Correctness Analysis: 
        - isCorrect: Boolean indicating if the strategic direction is sound.
        - explanation: Why the answer is correct or incorrect.
        - suggestions: Specific guidance and suggestions for improvement.
    - Mastery Impact:
        - domain: The primary domain being exercised.
        - impactDescription: Detailed explanation of how this specific case improves mastery in that domain.
        - frameworksUsed: List of frameworks from the case that were successfully applied.
        - skillsDeveloped: Specific skills (e.g., "Quantitative Analysis", "Market Sizing", "Competitive Positioning") developed.
    - Top 1% Perspective: A high-level insight that separates a good answer from a great one.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structural: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["score", "feedback"]
            },
            evidence: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["score", "feedback"]
            },
            bias: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["score", "feedback"]
            },
            strategic: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["score", "feedback"]
            },
            implementation: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["score", "feedback"]
            },
            correctnessAnalysis: {
              type: Type.OBJECT,
              properties: {
                isCorrect: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING },
                suggestions: { type: Type.STRING }
              },
              required: ["isCorrect", "explanation", "suggestions"]
            },
            masteryImpact: {
              type: Type.OBJECT,
              properties: {
                domain: { type: Type.STRING },
                impactDescription: { type: Type.STRING },
                frameworksUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                skillsDeveloped: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["domain", "impactDescription", "frameworksUsed", "skillsDeveloped"]
            },
            topOnePercent: { type: Type.STRING },
            overallScore: { type: Type.NUMBER }
          },
          required: ["structural", "evidence", "bias", "strategic", "implementation", "correctnessAnalysis", "masteryImpact", "topOnePercent", "overallScore"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Critique Error:", error);
    // Fallback mock critique
    return {
      structural: { score: 7, feedback: "Solid structure but could be more MECE." },
      evidence: { score: 6, feedback: "Good use of data, but missed the ARPU gap." },
      bias: { score: 8, feedback: "Avoided confirmation bias well." },
      strategic: { score: 7, feedback: "Aligned with growth, but risky for margins." },
      implementation: { score: 5, feedback: "Tactics are a bit vague." },
      correctnessAnalysis: {
        isCorrect: true,
        explanation: "Your direction is sound because it prioritizes long-term retention over short-term gains.",
        suggestions: "Try to quantify the impact on churn more specifically."
      },
      masteryImpact: {
        domain: caseStudy.domain,
        impactDescription: "This case forces you to balance short-term revenue with long-term platform health.",
        frameworksUsed: caseStudy.frameworks,
        skillsDeveloped: ["Platform Strategy", "ARPU Optimization"]
      },
      topOnePercent: "Consider the platform play rather than just the content play.",
      overallScore: 6.6
    };
  }
}

export async function generateNewCase(domain: string, difficulty: string): Promise<CaseStudy> {
  const prompt = `Generate a new business case study for a ${difficulty} level in the domain of ${domain}. 
  Return a JSON object with: title, company, domain, frameworks (array), situation, problem, partialData.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            domain: { type: Type.STRING },
            frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
            situation: { type: Type.STRING },
            problem: { type: Type.STRING },
            partialData: { type: Type.STRING }
          },
          required: ["title", "company", "domain", "frameworks", "situation", "problem", "partialData"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return { ...data, id: Math.random().toString(36).substr(2, 9), difficulty };
  } catch (error) {
    console.error("AI Case Generation Error:", error);
    throw error;
  }
}
