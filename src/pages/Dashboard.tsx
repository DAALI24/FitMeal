import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import {
  Brain,
  Flame,
  Dumbbell,
  Utensils,
  Target,
  TrendingUp,
  Droplets,
  Moon,
  Zap,
  Scale,
  CheckCircle,
  Plus,
  CalendarDays,
  Award,
  ScanLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { loadDashboard, saveDashboard, addWeightEntry } from "@/lib/aiService";
import type { WorkoutDay } from "@/types";

// ── helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number, digits = 0) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits });
}

// ── Calorie Donut ─────────────────────────────────────────────────────────────

function CalorieDonut({
  consumed,
  target,
}: {
  consumed: number;
  target: number;
}) {
  const pct = Math.min((consumed / target) * 100, 100);
  const over = consumed > target;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={over ? "#ef4444" : "#10b981"}
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold">{fmt(consumed)}</span>
          <span className="text-xs text-muted-foreground">of {fmt(target)}</span>
          <span className="text-xs text-muted-foreground">kcal</span>
        </div>
      </div>
      <p className={`text-sm font-medium mt-1 ${over ? "text-red-500" : "text-green-600"}`}>
        {over ? `${fmt(consumed - target)} over` : `${fmt(target - consumed)} remaining`}
      </p>
    </div>
  );
}

// ── Workout Card ──────────────────────────────────────────────────────────────

function WorkoutCard({ day }: { day: WorkoutDay }) {
  const [open, setOpen] = useState(false);
  const INTENSITY_STYLES = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-red-100 text-red-800 border-red-200",
  } as const;
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
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${INTENSITY_STYLES[day.intensity]}`}>
            {day.intensity}
          </span>
          <span className="text-xs text-muted-foreground">{day.duration}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="divide-y divide-border">
          {day.exercises.map((ex, i) => (
            <div key={i} className="px-4 py-2.5 flex flex-wrap gap-x-5 gap-y-0.5 text-sm">
              <span className="font-medium">{ex.name}</span>
              <span className="text-muted-foreground">{ex.sets} × {ex.reps}</span>
              <span className="text-muted-foreground">Rest {ex.rest}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(loadDashboard);
  const [newWeight, setNewWeight] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "workout" | "meal" | "progress">("overview");

  const { analysis, bioData, nutritionLogs, weightHistory, currentStreak } = dashboard;
  const today = new Date().toISOString().split("T")[0]!;
  const todayLog = nutritionLogs.find((l) => l.date === today);
  const calorieTarget = analysis?.dailyCalorieTarget ?? 2000;

  // no data guard
  if (!analysis || !bioData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-fitness/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-fitness" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Analysis Yet</h2>
          <p className="text-muted-foreground mb-6">
            Complete your AI body analysis to unlock your personalized dashboard with
            workout plans, meal plans, calorie tracking, and progress charts.
          </p>
          <Button
            className="bg-gradient-to-r from-fitness to-primary"
            onClick={() => navigate("/ai-analysis")}
          >
            <Brain className="h-4 w-4 mr-2" />
            Start AI Analysis
          </Button>
        </div>
      </div>
    );
  }

  // weight log
  const handleAddWeight = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w < 20 || w > 500) { toast.error("Enter a valid weight (20–500 kg)"); return; }
    const updated = addWeightEntry(dashboard, w);
    setDashboard(updated);
    setNewWeight("");
    toast.success(`Weight logged: ${w} kg`);
  };

  // weekly calorie chart data
  const weeklyCalData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0]!;
    const log = nutritionLogs.find((l) => l.date === dateStr);
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      calories: log?.totalCalories ?? 0,
      target: calorieTarget,
    };
  });

  // weight chart data
  const weightChartData = [...weightHistory]
    .reverse()
    .slice(-14)
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      weight: w.weightKg,
    }));

  // macro radial data
  const macroRadial = [
    { name: "Protein", value: todayLog?.totalProtein ?? 0, fill: "#3b82f6", target: analysis.macros.protein },
    { name: "Carbs", value: todayLog?.totalCarbs ?? 0, fill: "#eab308", target: analysis.macros.carbs },
    { name: "Fat", value: todayLog?.totalFat ?? 0, fill: "#f97316", target: analysis.macros.fat },
  ];

  // today's workout
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayWorkout = analysis.workoutPlan.find((d) => d.day === weekDays[new Date().getDay()]);

  // ── tabs ────────────────────────────────────────────────────────────────────

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp },
    { id: "workout" as const, label: "Workout", icon: Dumbbell },
    { id: "meal" as const, label: "Meal Plan", icon: Utensils },
    { id: "progress" as const, label: "Progress", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-fitness/5 to-background pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  {currentStreak > 0 ? `🔥 ${currentStreak}-day streak` : "Start your streak today"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Hey, {bioData.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {analysis.bodyType} · {analysis.bmiCategory} · {analysis.fitnessLevel}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="border-fitness/30 text-fitness hover:bg-fitness/5"
                onClick={() => navigate("/ai-analysis")}
              >
                <Brain className="h-3.5 w-3.5 mr-1.5" />
                Re-analyse
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-green-500/30 text-green-700 hover:bg-green-500/5"
                onClick={() => navigate("/food-scanner")}
              >
                <ScanLine className="h-3.5 w-3.5 mr-1.5" />
                Scan Food
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 overflow-x-auto pb-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === id
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── OVERVIEW TAB ───────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Calorie + today's stats */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Today&apos;s Calories
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-2">
                  <CalorieDonut
                    consumed={todayLog?.totalCalories ?? 0}
                    target={calorieTarget}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    Macro Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  {macroRadial.map(({ name, value, fill, target }) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{name}</span>
                        <span className="text-muted-foreground">{value}g / {target}g</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min((value / target) * 100, 100)}%`, background: fill }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Flame, label: "Daily Target", value: `${fmt(calorieTarget)} kcal`, color: "text-orange-500" },
                { icon: Droplets, label: "Hydration", value: `${(analysis.hydrationTarget / 1000).toFixed(1)}L`, color: "text-blue-500" },
                { icon: Scale, label: "Current Weight", value: weightHistory[0] ? `${weightHistory[0].weightKg}kg` : `${bioData.weightKg}kg`, color: "text-purple-500" },
                { icon: Moon, label: "Sleep Target", value: "7–9 hrs", color: "text-indigo-500" },
              ].map(({ icon: Icon, label, value, color }) => (
                <Card key={label} className="card-lift">
                  <CardContent className="pt-4 pb-3 text-center">
                    <Icon className={`h-6 w-6 mx-auto mb-1.5 ${color}`} />
                    <div className="font-bold text-sm">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today's workout preview */}
            {todayWorkout && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-fitness" />
                    Today&apos;s Workout — {todayWorkout.focus}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`text-xs ${
                      todayWorkout.intensity === "High" ? "bg-red-100 text-red-800 border-red-200" :
                      todayWorkout.intensity === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                      "bg-green-100 text-green-800 border-green-200"
                    } border`}>
                      {todayWorkout.intensity} Intensity
                    </Badge>
                    <span className="text-xs text-muted-foreground">{todayWorkout.duration}</span>
                    <span className="text-xs text-muted-foreground">{todayWorkout.exercises.length} exercises</span>
                  </div>
                  <div className="space-y-1">
                    {todayWorkout.exercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-fitness flex-shrink-0" />
                        <span>{ex.name} — {ex.sets} × {ex.reps}</span>
                      </div>
                    ))}
                    {todayWorkout.exercises.length > 3 && (
                      <button
                        className="text-xs text-primary hover:underline mt-1"
                        onClick={() => setActiveTab("workout")}
                      >
                        +{todayWorkout.exercises.length - 3} more exercises →
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Goals */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.goals.map((g, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{analysis.estimatedTimeline}</span>
                </div>
              </CardContent>
            </Card>

            {/* Weekly calories chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Weekly Calorie Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={weeklyCalData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                    />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Consumed" />
                    <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── WORKOUT TAB ────────────────────────────────────────────────────── */}
        {activeTab === "workout" && (
          <div className="space-y-3 animate-fade-in-up">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold">7-Day Workout Plan</h2>
              <Badge variant="outline">{analysis.fitnessLevel}</Badge>
            </div>
            {analysis.workoutPlan.map((day) => (
              <WorkoutCard key={day.day} day={day} />
            ))}
          </div>
        )}

        {/* ── MEAL PLAN TAB ──────────────────────────────────────────────────── */}
        {activeTab === "meal" && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold">7-Day Meal Plan</h2>
              <Badge variant="outline">{calorieTarget} kcal/day</Badge>
            </div>

            {/* Macro summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Protein", value: `${analysis.macros.protein}g`, color: "text-blue-600" },
                { label: "Carbs", value: `${analysis.macros.carbs}g`, color: "text-yellow-600" },
                { label: "Fat", value: `${analysis.macros.fat}g`, color: "text-orange-600" },
              ].map(({ label, value, color }) => (
                <Card key={label} className="text-center">
                  <CardContent className="py-3">
                    <div className={`text-xl font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-muted-foreground">{label} / day</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Meal cards */}
            {analysis.mealPlan.map((day) => {
              const meals = [
                { label: "Breakfast", data: day.breakfast, icon: "🌅" },
                { label: "Lunch", data: day.lunch, icon: "☀️" },
                { label: "Dinner", data: day.dinner, icon: "🌙" },
                { label: "Snacks", data: day.snacks, icon: "🍎" },
              ] as const;
              return (
                <Card key={day.day}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{day.day}</span>
                      <span className="text-muted-foreground font-normal text-xs">{day.totalCalories} kcal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {meals.map(({ label, data, icon }) => (
                      <div key={label} className="flex gap-3 items-start bg-muted/20 rounded-lg px-3 py-2">
                        <span className="text-base flex-shrink-0">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                          <p className="text-sm font-medium truncate">{data.name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-orange-600">{data.calories}</div>
                          <div className="text-xs text-muted-foreground">kcal</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── PROGRESS TAB ──────────────────────────────────────────────────── */}
        {activeTab === "progress" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Log weight */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4 text-purple-500" />
                  Log Today&apos;s Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`${bioData.weightKg} kg`}
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddWeight(); }}
                    className="max-w-[140px]"
                  />
                  <Button size="sm" onClick={handleAddWeight} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Log
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weight chart */}
            {weightChartData.length > 1 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Weight History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={weightChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        fill="url(#weightGrad)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Weight (kg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Log at least 2 weights to see your progress chart</p>
              </div>
            )}

            {/* Nutrition history */}
            {nutritionLogs.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-green-500" />
                    Recent Nutrition Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nutritionLogs.slice(0, 7).map((log) => {
                      const pct = Math.min((log.totalCalories / calorieTarget) * 100, 100);
                      return (
                        <div key={log.date}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">
                              {new Date(log.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                            <span className="text-muted-foreground">
                              {log.totalCalories} / {calorieTarget} kcal
                              ({log.entries.length} items)
                            </span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-fitness" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.insights.map((ins, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-fitness flex-shrink-0 mt-0.5">✦</span>
                      <span className="text-muted-foreground">{ins}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
