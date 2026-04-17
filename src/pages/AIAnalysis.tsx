import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Brain,
  Camera,
  Upload,
  User,
  Flame,
  Dumbbell,
  Utensils,
  Target,
  Lightbulb,
  Clock,
  Droplets,
  Moon,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Sparkles,
  Key,
  AlertCircle,
} from "lucide-react";
import {
  analyzeBodyWithAI,
  fileToBase64,
  loadDashboard,
  saveDashboard,
  hasApiKey,
  setApiKey,
  getApiKey,
} from "@/lib/aiService";
import type {
  UserBioData,
  AIBodyAnalysis,
  ActivityLevel,
  FitnessGoal,
  Gender,
  WorkoutDay,
  MealPlanDay,
} from "@/types";

// ── helpers ───────────────────────────────────────────────────────────────────

const INTENSITY_COLORS = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-red-100 text-red-800 border-red-200",
} as const;

const BMI_COLORS: Record<string, string> = {
  Underweight: "text-blue-600",
  "Normal weight": "text-green-600",
  Overweight: "text-yellow-600",
  Obese: "text-red-600",
};

// ── sub-components ────────────────────────────────────────────────────────────

function WorkoutCard({ day }: { day: WorkoutDay }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">{day.day}</span>
          <span className="text-xs text-muted-foreground">{day.focus}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${INTENSITY_COLORS[day.intensity]}`}
          >
            {day.intensity}
          </span>
          <span className="text-xs text-muted-foreground">{day.duration}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="divide-y divide-border animate-fade-in-up">
          {day.exercises.map((ex, i) => (
            <div key={i} className="px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="font-medium w-full sm:w-auto">{ex.name}</span>
              <span className="text-muted-foreground">{ex.sets} sets × {ex.reps}</span>
              <span className="text-muted-foreground">Rest: {ex.rest}</span>
              {ex.notes && <span className="text-xs text-muted-foreground italic">{ex.notes}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MealCard({ day }: { day: MealPlanDay }) {
  const [open, setOpen] = useState(false);
  const meals = [
    { label: "Breakfast", data: day.breakfast, icon: "🌅" },
    { label: "Lunch", data: day.lunch, icon: "☀️" },
    { label: "Dinner", data: day.dinner, icon: "🌙" },
    { label: "Snacks", data: day.snacks, icon: "🍎" },
  ] as const;
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-sm">{day.day}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{day.totalCalories} kcal</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="divide-y divide-border animate-fade-in-up">
          {meals.map(({ label, data, icon }) => (
            <div key={label} className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{icon}</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-sm font-medium mb-1">{data.name}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>🔥 {data.calories} kcal</span>
                <span>💪 {data.protein}g P</span>
                <span>🌾 {data.carbs}g C</span>
                <span>🥑 {data.fat}g F</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsView({ result, bio }: { result: AIBodyAnalysis; bio: UserBioData }) {
  const [workoutTab, setWorkoutTab] = useState<"workout" | "meal">("workout");
  const navigate = useNavigate();

  const macroTotal = result.macros.protein * 4 + result.macros.carbs * 4 + result.macros.fat * 9;
  const proteinPct = Math.round((result.macros.protein * 4 / macroTotal) * 100);
  const carbsPct = Math.round((result.macros.carbs * 4 / macroTotal) * 100);
  const fatPct = Math.round((result.macros.fat * 9 / macroTotal) * 100);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header card */}
      <div className="bg-gradient-to-br from-fitness/10 via-primary/5 to-transparent border border-fitness/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {bio.photoBase64 && (
            <img
              src={`data:${bio.photoMimeType};base64,${bio.photoBase64}`}
              alt="Your photo"
              className="w-20 h-20 rounded-2xl object-cover shadow-card border-2 border-fitness/30 flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-fitness" />
              <h2 className="text-xl font-bold">Analysis Complete</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Personalized plan for <span className="font-medium text-foreground">{bio.name}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-fitness/10 text-fitness border-fitness/20 border">
                {result.bodyType}
              </Badge>
              <Badge className={`border ${BMI_COLORS[result.bmiCategory] ?? "text-foreground"} bg-transparent`}>
                {result.bmiCategory}
              </Badge>
              <Badge variant="outline">{result.fitnessLevel}</Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-fitness/30 text-fitness hover:bg-fitness/5"
            onClick={() => navigate("/dashboard")}
          >
            View Dashboard →
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: "Daily Target", value: `${result.dailyCalorieTarget}`, unit: "kcal", color: "text-orange-500" },
          { icon: Flame, label: "TDEE", value: `${result.tdee}`, unit: "kcal", color: "text-red-500" },
          { icon: Droplets, label: "Hydration", value: `${Math.round(result.hydrationTarget / 1000)}`, unit: "L/day", color: "text-blue-500" },
          { icon: Moon, label: "Sleep Goal", value: "7–9", unit: "hrs", color: "text-purple-500" },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <Card key={label} className="card-lift text-center p-4">
            <Icon className={`h-6 w-6 mx-auto mb-1 ${color}`} />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{unit}</div>
            <div className="text-xs font-medium mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      {/* Macros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Utensils className="h-4 w-4 text-fitness" />
            Daily Macro Targets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Protein", value: result.macros.protein, unit: "g", pct: proteinPct, color: "bg-blue-500" },
            { label: "Carbs", value: result.macros.carbs, unit: "g", pct: carbsPct, color: "bg-yellow-500" },
            { label: "Fat", value: result.macros.fat, unit: "g", pct: fatPct, color: "bg-orange-500" },
          ].map(({ label, value, unit, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{value}{unit} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Goals & Insights */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Your Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.goals.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.insights.map((ins, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-yellow-500 flex-shrink-0">•</span>
                  <span className="text-muted-foreground">{ins}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
        <Clock className="h-5 w-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Estimated Timeline</p>
          <p className="text-sm text-muted-foreground">{result.estimatedTimeline}</p>
        </div>
      </div>

      {/* Plans */}
      <div>
        <div className="flex gap-2 mb-4">
          <Button
            variant={workoutTab === "workout" ? "default" : "outline"}
            size="sm"
            onClick={() => setWorkoutTab("workout")}
            className="flex items-center gap-1.5"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Workout Plan
          </Button>
          <Button
            variant={workoutTab === "meal" ? "default" : "outline"}
            size="sm"
            onClick={() => setWorkoutTab("meal")}
            className="flex items-center gap-1.5"
          >
            <Utensils className="h-3.5 w-3.5" />
            Meal Plan
          </Button>
        </div>

        {workoutTab === "workout" ? (
          <div className="space-y-2">
            {result.workoutPlan.map((day) => (
              <WorkoutCard key={day.day} day={day} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {result.mealPlan.map((day) => (
              <MealCard key={day.day} day={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AIAnalysis() {
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderately_active");
  const [goal, setGoal] = useState<FitnessGoal>("weight_loss");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());

  // photo state
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // analysis state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AIBodyAnalysis | null>(null);
  const [currentBio, setCurrentBio] = useState<UserBioData | null>(null);

  const loadingSteps = [
    "Uploading your photo securely…",
    "Analyzing body composition…",
    "Calculating nutrition targets…",
    "Building 7-day workout plan…",
    "Crafting personalized meal plan…",
    "Finalizing your health insights…",
  ];

  // ── photo handlers ──────────────────────────────────────────────────────────

  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  }, []);

  // ── submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photo) { toast.error("Please upload your body photo — it's required for analysis"); return; }
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!age || Number(age) < 10 || Number(age) > 100) { toast.error("Please enter a valid age (10–100)"); return; }
    if (!heightCm || Number(heightCm) < 100 || Number(heightCm) > 250) { toast.error("Please enter a valid height (100–250 cm)"); return; }
    if (!weightKg || Number(weightKg) < 30 || Number(weightKg) > 300) { toast.error("Please enter a valid weight (30–300 kg)"); return; }

    if (apiKeyInput.trim()) setApiKey(apiKeyInput.trim());

    setLoading(true);
    setLoadingStep(0);
    setResult(null);

    // animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 1200);

    try {
      const { base64, mimeType } = await fileToBase64(photo);
      const bio: UserBioData = {
        name: name.trim(),
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        goal,
        medicalConditions: medicalConditions.trim(),
        photoBase64: base64,
        photoMimeType: mimeType,
      };
      setCurrentBio(bio);

      const analysis = await analyzeBodyWithAI(bio);

      // persist to dashboard
      const dashboard = loadDashboard();
      saveDashboard({ ...dashboard, bioData: bio, analysis, lastUpdated: new Date().toISOString() });

      setResult(analysis);
      toast.success("Analysis complete! Your personalized plan is ready.");
    } catch (err) {
      console.error(err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-fitness/10 via-primary/5 to-background pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-fitness/10 border border-fitness/20 rounded-full px-4 py-1.5 mb-4">
            <Brain className="h-4 w-4 text-fitness" />
            <span className="text-sm font-medium text-fitness">AI Body Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Your Personalized{" "}
            <span className="bg-gradient-to-r from-fitness to-primary bg-clip-text text-transparent">
              Fitness Blueprint
            </span>
          </h1>
          <p className="text-muted-foreground">
            Upload your photo, share your stats, and let our AI craft a custom workout + meal
            plan tailored to your body type and goals.
          </p>
          {!hasApiKey() && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              Demo Mode — enter an Anthropic API key for real AI analysis
            </div>
          )}
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* If result is available, show results */}
        {result && currentBio ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Results</h2>
              <Button variant="outline" size="sm" onClick={() => { setResult(null); setCurrentBio(null); }}>
                Re-analyse
              </Button>
            </div>
            <ResultsView result={result} bio={currentBio} />
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Key */}
            <Card className="border-dashed border-yellow-300 bg-yellow-50/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Anthropic API Key <span className="font-normal text-yellow-700">(optional — enables real AI)</span>
                    </p>
                    <Input
                      type="password"
                      placeholder="sk-ant-api03-..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="text-sm bg-white"
                    />
                    <p className="text-xs text-yellow-700 mt-1">
                      Leave blank to use demo mode with realistic sample data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Body Photo <span className="text-destructive">*</span>{" "}
                <span className="text-xs font-normal text-muted-foreground">(required for AI analysis)</span>
              </Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer ${
                  isDragging
                    ? "border-fitness bg-fitness/5"
                    : photoPreview
                    ? "border-fitness/40 bg-fitness/5"
                    : "border-border hover:border-fitness/40 hover:bg-fitness/5"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                {photoPreview ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-xl object-cover shadow-card border-2 border-fitness/30"
                    />
                    <div>
                      <p className="font-medium text-sm text-fitness flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        Photo uploaded!
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{photo?.name}</p>
                      <p className="text-xs text-muted-foreground">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-14 h-14 bg-fitness/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Camera className="h-7 w-7 text-fitness" />
                    </div>
                    <p className="font-medium mb-1">Drop your photo here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, or WebP · Max 10 MB · Full-body photo recommended
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Fields */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Alex Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min={10}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      min={100}
                      max={250}
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      min={30}
                      max={300}
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Activity Level</Label>
                    <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (desk job)</SelectItem>
                        <SelectItem value="lightly_active">Lightly Active (1-3×/wk)</SelectItem>
                        <SelectItem value="moderately_active">Moderately Active (3-5×/wk)</SelectItem>
                        <SelectItem value="very_active">Very Active (6-7×/wk)</SelectItem>
                        <SelectItem value="extremely_active">Extremely Active (athlete)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Primary Goal</Label>
                    <Select value={goal} onValueChange={(v) => setGoal(v as FitnessGoal)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="athletic_performance">Athletic Performance</SelectItem>
                        <SelectItem value="flexibility">Flexibility & Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="medical">Medical Conditions / Injuries</Label>
                  <Textarea
                    id="medical"
                    placeholder="e.g. knee injury, diabetes, hypertension — or leave blank if none"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Loading state */}
            {loading && (
              <Card className="border-fitness/20 bg-fitness/5 animate-fade-in-up">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-fitness to-primary rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-fitness">AI Analysis in Progress</p>
                    <p className="text-sm text-muted-foreground mt-1">{loadingSteps[loadingStep]}</p>
                  </div>
                  <Progress value={((loadingStep + 1) / loadingSteps.length) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Step {loadingStep + 1} of {loadingSteps.length}</span>
                    <span>{Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !photo}
              className="w-full h-12 text-base bg-gradient-to-r from-fitness to-primary hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⚙</span>
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate My Personalized Plan
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Your photo is processed locally and sent directly to the AI model — never stored on our servers.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
