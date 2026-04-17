// ─── Core domain types ────────────────────────────────────────────────────────

export type Gender = "male" | "female" | "other";

export type UserRole = "user" | "restaurant_owner" | "gym_instructor" | "admin";

export type SubscriptionTier = "free" | "premium" | "pro";

// ─── Nutrition / Food ────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  image: string;
  isRecommended: boolean;
  nutritionMatch: number;
  isVeg: boolean;
  tags: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  distance: string;
  image: string;
  isPartner: boolean;
  healthScore: number;
  priceRange: string;
  isCloudKitchen: boolean;
  address: string;
  menu: MenuItem[];
  specialties: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

// ─── Gym / Fitness ────────────────────────────────────────────────────────────

export type TrainingSpecialty =
  | "Weight Training"
  | "Yoga"
  | "CrossFit"
  | "Cardio & HIIT"
  | "Pilates"
  | "Zumba"
  | "Boxing"
  | "Calisthenics"
  | "Functional Fitness"
  | "Sports Nutrition";

export interface GymInstructor {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  experienceYears: number;
  specialties: TrainingSpecialty[];
  certifications: string[];
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  priceMonthly: number;
  image: string;
  bio: string;
  availability: string[];
  languages: string[];
  isVerified: boolean;
  gymName: string;
  location: string;
}

export interface TrainingSession {
  id: string;
  instructorId: string;
  userId: string;
  date: string;
  duration: number;
  type: "online" | "in-person";
  status: "upcoming" | "completed" | "cancelled";
  price: number;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  paymentMethod: string;
  paymentId?: string;
}

// ─── Admin / Owner ────────────────────────────────────────────────────────────

export interface RestaurantOwner {
  id: string;
  name: string;
  email: string;
  restaurantId: string;
  joinedAt: string;
}

export interface InstructorProfile extends GymInstructor {
  totalEarnings: number;
  sessionsCompleted: number;
  upcomingSessions: number;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ─── AI Analysis ─────────────────────────────────────────────────────────────

export type BodyType = "Ectomorph" | "Mesomorph" | "Endomorph" | "Ecto-Mesomorph" | "Meso-Endomorph";
export type FitnessGoal = "weight_loss" | "muscle_gain" | "maintenance" | "athletic_performance" | "flexibility";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";

export interface UserBioData {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  medicalConditions: string;
  photoBase64: string;
  photoMimeType: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes: string;
  }>;
  duration: string;
  intensity: "Low" | "Medium" | "High";
}

export interface MealPlanDay {
  day: string;
  breakfast: { name: string; calories: number; protein: number; carbs: number; fat: number };
  lunch: { name: string; calories: number; protein: number; carbs: number; fat: number };
  dinner: { name: string; calories: number; protein: number; carbs: number; fat: number };
  snacks: { name: string; calories: number; protein: number; carbs: number; fat: number };
  totalCalories: number;
}

export interface AIBodyAnalysis {
  bodyType: BodyType;
  bmiCategory: string;
  fitnessLevel: string;
  dailyCalorieTarget: number;
  tdee: number;
  macros: { protein: number; carbs: number; fat: number };
  workoutPlan: WorkoutDay[];
  mealPlan: MealPlanDay[];
  goals: string[];
  insights: string[];
  estimatedTimeline: string;
  hydrationTarget: number;
  sleepRecommendation: string;
  analysisDate: string;
}

export interface FoodScanResult {
  foodName: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  healthScore: number;
  insights: string[];
  micronutrients: string[];
  timestamp: string;
  imageBase64?: string;
}

export interface DailyNutritionLog {
  date: string;
  entries: FoodScanResult[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntakeMl: number;
}

export interface WeightEntry {
  date: string;
  weightKg: number;
}

export interface UserDashboardData {
  bioData: UserBioData | null;
  analysis: AIBodyAnalysis | null;
  nutritionLogs: DailyNutritionLog[];
  weightHistory: WeightEntry[];
  currentStreak: number;
  lastUpdated: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
