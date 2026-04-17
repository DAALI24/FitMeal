/**
 * AI Service — Anthropic Claude vision integration
 *
 * Uses Claude claude-3-5-sonnet for body analysis & food scanning.
 * Falls back to rich mock data when no API key is provided (Demo Mode).
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  UserBioData,
  AIBodyAnalysis,
  FoodScanResult,
  DailyNutritionLog,
  UserDashboardData,
  WeightEntry,
} from "@/types";

const STORAGE_KEYS = {
  API_KEY: "fitmeal_anthropic_key",
  DASHBOARD: "fitmeal_dashboard",
  ANALYSIS: "fitmeal_analysis",
} as const;

// ── API key management ────────────────────────────────────────────────────────

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) ?? "";
}
export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
}
export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

function getClient(): Anthropic {
  return new Anthropic({
    apiKey: getApiKey(),
    dangerouslyAllowBrowser: true,
  });
}

// ── Dashboard persistence ─────────────────────────────────────────────────────

export function loadDashboard(): UserDashboardData {
  const raw = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
  if (raw) {
    try { return JSON.parse(raw) as UserDashboardData; } catch { /* fall through */ }
  }
  return { bioData: null, analysis: null, nutritionLogs: [], weightHistory: [], currentStreak: 0, lastUpdated: "" };
}

export function saveDashboard(data: UserDashboardData): void {
  localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(data));
}

export function getTodayLog(data: UserDashboardData): DailyNutritionLog {
  const today = new Date().toISOString().split("T")[0]!;
  const existing = data.nutritionLogs.find((l) => l.date === today);
  if (existing) return existing;
  return { date: today, entries: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeMl: 0 };
}

export function addFoodEntry(data: UserDashboardData, food: FoodScanResult): UserDashboardData {
  const today = new Date().toISOString().split("T")[0]!;
  const logs = [...data.nutritionLogs];
  const idx = logs.findIndex((l) => l.date === today);
  const log = idx >= 0 ? { ...logs[idx]! } : { date: today, entries: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeMl: 0 };
  log.entries = [...log.entries, food];
  log.totalCalories += food.calories;
  log.totalProtein += food.protein;
  log.totalCarbs += food.carbs;
  log.totalFat += food.fat;
  if (idx >= 0) logs[idx] = log; else logs.unshift(log);
  const updated = { ...data, nutritionLogs: logs, lastUpdated: new Date().toISOString() };
  saveDashboard(updated);
  return updated;
}

export function addWeightEntry(data: UserDashboardData, weightKg: number): UserDashboardData {
  const today = new Date().toISOString().split("T")[0]!;
  const history = data.weightHistory.filter((w) => w.date !== today);
  const entry: WeightEntry = { date: today, weightKg };
  const updated = { ...data, weightHistory: [entry, ...history].slice(0, 30) };
  saveDashboard(updated);
  return updated;
}

// ── Image helpers ─────────────────────────────────────────────────────────────

export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve({ base64, mimeType: file.type || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Body / workout / diet analysis ───────────────────────────────────────────

const BODY_ANALYSIS_PROMPT = (bio: UserBioData) => `
You are an expert fitness coach, nutritionist, and body composition analyst.

Analyze this person's physique from the photo along with their biometric data:
- Name: ${bio.name}
- Age: ${bio.age} years
- Gender: ${bio.gender}
- Height: ${bio.heightCm} cm
- Weight: ${bio.weightKg} kg
- BMI: ${(bio.weightKg / ((bio.heightCm / 100) ** 2)).toFixed(1)}
- Activity Level: ${bio.activityLevel.replace(/_/g, " ")}
- Primary Goal: ${bio.goal.replace(/_/g, " ")}
- Medical Conditions: ${bio.medicalConditions || "None"}

Provide a comprehensive, personalized analysis. Respond ONLY with valid JSON matching this exact structure:
{
  "bodyType": "Ectomorph|Mesomorph|Endomorph|Ecto-Mesomorph|Meso-Endomorph",
  "bmiCategory": "string",
  "fitnessLevel": "string (Beginner/Intermediate/Advanced)",
  "dailyCalorieTarget": number,
  "tdee": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "workoutPlan": [
    {
      "day": "Monday",
      "focus": "string",
      "exercises": [
        { "name": "string", "sets": number, "reps": "string", "rest": "string", "notes": "string" }
      ],
      "duration": "string",
      "intensity": "Low|Medium|High"
    }
  ],
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
      "lunch": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
      "dinner": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
      "snacks": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number },
      "totalCalories": number
    }
  ],
  "goals": ["string x5"],
  "insights": ["string x4"],
  "estimatedTimeline": "string",
  "hydrationTarget": number,
  "sleepRecommendation": "string",
  "analysisDate": "${new Date().toISOString()}"
}
Include 7 days in workoutPlan and mealPlan. Make all values highly specific and realistic.`;

const FOOD_SCAN_PROMPT = `
You are a certified nutritionist and food analyst with expertise in calorie estimation.

Carefully analyze this food image and provide a detailed nutritional breakdown.
Respond ONLY with valid JSON matching this exact structure:
{
  "foodName": "string (descriptive name)",
  "portionSize": "string (e.g. '1 medium bowl, ~350g')",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "sugar": number,
  "healthScore": number (1-10),
  "insights": ["string x3 (specific nutrition tips)"],
  "micronutrients": ["string x3 (notable vitamins/minerals)"],
  "timestamp": "${new Date().toISOString()}"
}
Be precise with calorie estimates based on visible portion size. If multiple food items are visible, analyze the full plate.`;

export async function analyzeBodyWithAI(bio: UserBioData): Promise<AIBodyAnalysis> {
  if (!hasApiKey()) return generateMockBodyAnalysis(bio);

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: bio.photoMimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: bio.photoBase64,
            },
          },
          { type: "text", text: BODY_ANALYSIS_PROMPT(bio) },
        ],
      }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch?.[0]) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]) as AIBodyAnalysis;
  } catch (err) {
    console.error("AI body analysis error:", err);
    return generateMockBodyAnalysis(bio);
  }
}

export async function scanFoodWithAI(
  imageBase64: string,
  imageMimeType: string
): Promise<FoodScanResult> {
  if (!hasApiKey()) return generateMockFoodScan();

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: imageMimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          { type: "text", text: FOOD_SCAN_PROMPT },
        ],
      }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch?.[0]) throw new Error("No JSON in response");
    const result = JSON.parse(jsonMatch[0]) as FoodScanResult;
    return { ...result, imageBase64 };
  } catch (err) {
    console.error("AI food scan error:", err);
    return generateMockFoodScan();
  }
}

// ── Mock data generators ──────────────────────────────────────────────────────

function generateMockBodyAnalysis(bio: UserBioData): AIBodyAnalysis {
  const bmi = bio.weightKg / ((bio.heightCm / 100) ** 2);
  const isWeightLoss = bio.goal === "weight_loss";
  const isMuscleGain = bio.goal === "muscle_gain";
  const tdee = Math.round(
    (bio.gender === "female" ? 655 + 9.6 * bio.weightKg + 1.8 * bio.heightCm - 4.7 * bio.age
      : 66 + 13.7 * bio.weightKg + 5 * bio.heightCm - 6.8 * bio.age) *
    ({ sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55, very_active: 1.725, extremely_active: 1.9 }[bio.activityLevel] ?? 1.55)
  );
  const target = isWeightLoss ? tdee - 400 : isMuscleGain ? tdee + 250 : tdee;
  const protein = Math.round(bio.weightKg * (isMuscleGain ? 2.2 : 1.8));
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);

  return {
    bodyType: bmi < 18.5 ? "Ectomorph" : bmi < 25 ? "Mesomorph" : "Meso-Endomorph",
    bmiCategory: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese",
    fitnessLevel: bio.activityLevel === "sedentary" ? "Beginner" : bio.activityLevel === "very_active" ? "Advanced" : "Intermediate",
    dailyCalorieTarget: target,
    tdee,
    macros: { protein, carbs, fat },
    workoutPlan: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day, i) => ({
      day,
      focus: ["Push (Chest/Shoulders/Triceps)","Pull (Back/Biceps)","Legs & Core","Active Recovery / Yoga","Full Body HIIT","Cardio + Abs","Rest & Mobility"][i]!,
      exercises: i === 6 ? [
        { name: "Foam Rolling", sets: 1, reps: "10 min", rest: "-", notes: "Full body mobility" },
        { name: "Static Stretching", sets: 1, reps: "15 min", rest: "-", notes: "Focus on tight areas" },
      ] : [
        { name: ["Bench Press","Pull-ups","Squats","Cat-Cow Stretch","Burpees","Mountain Climbers","Child's Pose"][i]!, sets: 4, reps: "8-12", rest: "60s", notes: "Control the eccentric" },
        { name: ["Overhead Press","Barbell Row","Romanian Deadlift","Pigeon Pose","Jump Squats","Plank Variations","Hip Flexor Stretch"][i]!, sets: 3, reps: "10-12", rest: "45s", notes: "Full range of motion" },
        { name: ["Dips","Face Pulls","Leg Press","Thread the Needle","High Knees","Russian Twists","Seated Forward Fold"][i]!, sets: 3, reps: "12-15", rest: "30s", notes: "Squeeze at the top" },
        { name: ["Lateral Raises","Hammer Curls","Calf Raises","Warrior Pose","Box Jumps","Bicycle Crunches","Butterfly Stretch"][i]!, sets: 3, reps: "15", rest: "30s", notes: "Mind-muscle connection" },
      ],
      duration: i === 6 ? "20-30 min" : "45-60 min",
      intensity: (["High","Medium","High","Low","High","Medium","Low"] as const)[i]!,
    })),
    mealPlan: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => ({
      day,
      breakfast: { name: "Oats with whey protein, banana & almond butter", calories: Math.round(target * 0.25), protein: Math.round(protein * 0.3), carbs: Math.round(carbs * 0.3), fat: Math.round(fat * 0.2) },
      lunch: { name: "Grilled chicken breast, quinoa & roasted vegetables", calories: Math.round(target * 0.35), protein: Math.round(protein * 0.4), carbs: Math.round(carbs * 0.35), fat: Math.round(fat * 0.3) },
      dinner: { name: "Baked salmon, sweet potato & steamed broccoli", calories: Math.round(target * 0.3), protein: Math.round(protein * 0.25), carbs: Math.round(carbs * 0.25), fat: Math.round(fat * 0.35) },
      snacks: { name: "Greek yogurt with mixed berries & walnuts", calories: Math.round(target * 0.1), protein: Math.round(protein * 0.05), carbs: Math.round(carbs * 0.1), fat: Math.round(fat * 0.15) },
      totalCalories: target,
    })),
    goals: [
      isWeightLoss ? `Lose ${Math.round((bmi - 22) * ((bio.heightCm / 100) ** 2))}kg to reach healthy BMI` : isMuscleGain ? "Gain 1-1.5kg lean muscle per month" : "Maintain current body composition",
      `Hit ${target} kcal daily with ${protein}g protein`,
      `Complete all 6 active training days consistently`,
      `Drink ${Math.round(bio.weightKg * 35)}ml of water daily`,
      `Sleep 7-9 hours per night for optimal recovery`,
    ],
    insights: [
      `Your TDEE is ${tdee} kcal. ${isWeightLoss ? `A 400 kcal deficit puts you at ${target} kcal for steady fat loss.` : `A 250 kcal surplus supports clean muscle building.`}`,
      `With a BMI of ${bmi.toFixed(1)}, you're in the ${bmi < 18.5 ? "underweight" : bmi < 25 ? "healthy" : bmi < 30 ? "overweight" : "obese"} range. ${bmi > 25 ? "Focus on progressive fat loss while preserving muscle." : "Excellent baseline to build on."}`,
      `Prioritize protein at every meal — it supports muscle retention and keeps you satiated, especially important for your ${bio.goal.replace(/_/g, " ")} goal.`,
      `Your activity level suggests ${bio.activityLevel === "sedentary" ? "starting with 3 days/week and progressively adding more" : "you're already active — focus on program structure and progressive overload"}.`,
    ],
    estimatedTimeline: isWeightLoss
      ? `${Math.round((bmi - 22) * ((bio.heightCm / 100) ** 2) / 0.4)} weeks to reach target weight at a healthy pace`
      : isMuscleGain ? "12-16 weeks to see significant muscle composition changes"
      : "4-6 weeks to optimize body composition and energy levels",
    hydrationTarget: Math.round(bio.weightKg * 35),
    sleepRecommendation: "7-9 hours per night, consistent sleep/wake schedule",
    analysisDate: new Date().toISOString(),
  };
}

function generateMockFoodScan(): FoodScanResult {
  const foods = [
    { foodName: "Chicken Rice Bowl with Vegetables", portionSize: "1 large bowl (~450g)", calories: 520, protein: 38, carbs: 62, fat: 12, fiber: 6, sugar: 4, healthScore: 8, insights: ["Excellent protein-to-calorie ratio for muscle building", "Brown rice provides sustained energy and fiber", "Add more leafy greens to boost micronutrient density"], micronutrients: ["High in B6 & niacin from chicken", "Rich in manganese from brown rice", "Good source of vitamin K from vegetables"] },
    { foodName: "Avocado Toast with Poached Eggs", portionSize: "2 slices with 2 eggs (~300g)", calories: 420, protein: 18, carbs: 32, fat: 26, fiber: 8, sugar: 3, healthScore: 9, insights: ["Heart-healthy monounsaturated fats from avocado", "Complete protein source from eggs", "Whole grain bread adds complex carbohydrates"], micronutrients: ["Rich in folate from avocado", "Excellent source of choline from eggs", "Good vitamin E content"] },
    { foodName: "Dal Tadka with Roti", portionSize: "1 bowl dal + 2 rotis (~380g)", calories: 380, protein: 16, carbs: 58, fat: 8, fiber: 10, sugar: 5, healthScore: 8, insights: ["High fiber supports gut health and satiety", "Lentils provide plant-based protein and iron", "Pair with a salad for a complete meal"], micronutrients: ["Excellent source of iron and folate", "Rich in B vitamins", "Good magnesium content"] },
  ];
  const food = foods[Math.floor(Math.random() * foods.length)]!;
  return { ...food, timestamp: new Date().toISOString() };
}
