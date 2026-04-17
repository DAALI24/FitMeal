import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ScanLine,
  Camera,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  Star,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { scanFoodWithAI, fileToBase64, loadDashboard, addFoodEntry, hasApiKey } from "@/lib/aiService";
import type { FoodScanResult, DailyNutritionLog } from "@/types";

// ── Health Score Ring ─────────────────────────────────────────────────────────

function HealthScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8 ? "text-green-500" : score >= 5 ? "text-yellow-500" : "text-red-500";
  const strokeColor =
    score >= 8 ? "#22c55e" : score >= 5 ? "#eab308" : "#ef4444";
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={strokeColor} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>
      <span className="text-xs font-medium mt-1 text-muted-foreground">Health Score</span>
    </div>
  );
}

// ── Scan Result Card ──────────────────────────────────────────────────────────

function ScanResultCard({
  result,
  onAddToLog,
  added,
}: {
  result: FoodScanResult;
  onAddToLog: () => void;
  added: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const macros = [
    { label: "Protein", value: result.protein, unit: "g", icon: Beef, color: "bg-blue-500", pct: Math.round((result.protein * 4 / result.calories) * 100) },
    { label: "Carbs", value: result.carbs, unit: "g", icon: Wheat, color: "bg-yellow-500", pct: Math.round((result.carbs * 4 / result.calories) * 100) },
    { label: "Fat", value: result.fat, unit: "g", icon: Droplet, color: "bg-orange-500", pct: Math.round((result.fat * 9 / result.calories) * 100) },
    { label: "Fiber", value: result.fiber, unit: "g", icon: Leaf, color: "bg-green-500", pct: 0 },
  ];

  return (
    <Card className="overflow-hidden animate-fade-in-up border-primary/20">
      <div className="bg-gradient-to-r from-primary/5 to-fitness/5 px-5 py-4">
        <div className="flex items-start gap-4">
          {result.imageBase64 && (
            <img
              src={`data:image/jpeg;base64,${result.imageBase64}`}
              alt={result.foodName}
              className="w-20 h-20 rounded-xl object-cover shadow-card border-2 border-primary/20 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight">{result.foodName}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{result.portionSize}</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 rounded-full px-3 py-1">
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{result.calories}</span>
                <span className="text-xs">kcal</span>
              </div>
              {result.sugar > 0 && (
                <Badge variant="outline" className="text-xs">
                  Sugar: {result.sugar}g
                </Badge>
              )}
            </div>
          </div>
          <HealthScoreRing score={result.healthScore} />
        </div>
      </div>

      <CardContent className="pt-4 pb-3">
        {/* Macro bars */}
        <div className="space-y-2 mb-4">
          {macros.map(({ label, value, unit, color, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs font-medium w-12 text-muted-foreground">{label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-700`}
                  style={{ width: label === "Fiber" ? `${Math.min(value * 5, 100)}%` : `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold w-12 text-right">{value}{unit}</span>
            </div>
          ))}
        </div>

        {/* Toggle details */}
        <button
          className="text-xs text-primary flex items-center gap-1 hover:underline mb-3"
          onClick={() => setShowDetails((o) => !o)}
        >
          {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {showDetails ? "Hide" : "Show"} insights & micronutrients
        </button>

        {showDetails && (
          <div className="space-y-3 animate-fade-in-up">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                AI Insights
              </p>
              <ul className="space-y-1">
                {result.insights.map((ins, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{ins}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Micronutrients
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.micronutrients.map((m, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={onAddToLog}
          disabled={added}
          className={`w-full mt-2 ${added ? "bg-green-500 hover:bg-green-500" : "bg-gradient-to-r from-primary to-fitness hover:opacity-90"}`}
          size="sm"
        >
          {added ? (
            <>✓ Added to Today&apos;s Log</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1.5" />
              Add to Today&apos;s Log
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Daily Log Summary ─────────────────────────────────────────────────────────

function DailyLogSection({ log, calorieTarget, onRemove }: {
  log: DailyNutritionLog;
  calorieTarget: number;
  onRemove: (ts: string) => void;
}) {
  const pct = Math.min(Math.round((log.totalCalories / calorieTarget) * 100), 100);
  const remaining = calorieTarget - log.totalCalories;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Today&apos;s Nutrition Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calorie ring summary */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Calories</span>
            <span className="text-sm text-muted-foreground">
              {log.totalCalories} / {calorieTarget} kcal
            </span>
          </div>
          <Progress value={pct} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1.5">
            {remaining > 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over target`}
          </p>
        </div>

        {/* Macro summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Protein", value: log.totalProtein, unit: "g", color: "text-blue-600" },
            { label: "Carbs", value: log.totalCarbs, unit: "g", color: "text-yellow-600" },
            { label: "Fat", value: log.totalFat, unit: "g", color: "text-orange-600" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="bg-muted/20 rounded-lg p-2">
              <div className={`text-lg font-bold ${color}`}>{value}{unit}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Food entries */}
        {log.entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No food logged yet today. Scan your first meal!
          </p>
        ) : (
          <div className="space-y-2">
            {log.entries.map((entry, i) => (
              <div
                key={entry.timestamp + i}
                className="flex items-center justify-between bg-muted/20 rounded-lg px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.foodName}</p>
                  <p className="text-xs text-muted-foreground">{entry.portionSize}</p>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-orange-600">{entry.calories} kcal</span>
                  <button
                    onClick={() => onRemove(entry.timestamp)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FoodScanner() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [added, setAdded] = useState(false);
  const [dashboard, setDashboard] = useState(loadDashboard);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dashboard_data = dashboard;
  const todayLog: DailyNutritionLog = (() => {
    const today = new Date().toISOString().split("T")[0]!;
    return dashboard_data.nutritionLogs.find((l) => l.date === today) ?? {
      date: today,
      entries: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      waterIntakeMl: 0,
    };
  })();

  const calorieTarget = dashboard.analysis?.dailyCalorieTarget ?? 2000;

  // ── photo handling ──────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10 MB"); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setResult(null);
    setAdded(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  // ── scan ────────────────────────────────────────────────────────────────────

  const handleScan = async () => {
    if (!photo) { toast.error("Please upload a food photo first"); return; }
    setLoading(true);
    try {
      const { base64, mimeType } = await fileToBase64(photo);
      const res = await scanFoodWithAI(base64, mimeType);
      setResult(res);
      toast.success("Food analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLog = () => {
    if (!result) return;
    const updated = addFoodEntry(dashboard, result);
    setDashboard(updated);
    setAdded(true);
    toast.success(`${result.foodName} added to today's log!`);
  };

  const handleRemove = (timestamp: string) => {
    const today = new Date().toISOString().split("T")[0]!;
    const logs = dashboard.nutritionLogs.map((log) => {
      if (log.date !== today) return log;
      const entries = log.entries.filter((e) => e.timestamp !== timestamp);
      return {
        ...log,
        entries,
        totalCalories: entries.reduce((s, e) => s + e.calories, 0),
        totalProtein: entries.reduce((s, e) => s + e.protein, 0),
        totalCarbs: entries.reduce((s, e) => s + e.carbs, 0),
        totalFat: entries.reduce((s, e) => s + e.fat, 0),
      };
    });
    const updated = { ...dashboard, nutritionLogs: logs };
    setDashboard(updated);
    import("@/lib/aiService").then(({ saveDashboard }) => saveDashboard(updated));
    toast.success("Entry removed");
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-500/10 via-primary/5 to-background pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
            <ScanLine className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">AI Food Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Snap Your Meal,{" "}
            <span className="bg-gradient-to-r from-green-600 to-primary bg-clip-text text-transparent">
              Know Your Macros
            </span>
          </h1>
          <p className="text-muted-foreground">
            Upload a photo of any food and our AI will instantly estimate calories, protein,
            carbs, fat, and give you personalized nutrition insights.
          </p>
          {!hasApiKey() && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              Demo Mode — enter your API key on the AI Analysis page for real scans
            </div>
          )}
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Upload area */}
        <Card>
          <CardContent className="pt-5">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer ${
                isDragging
                  ? "border-green-500 bg-green-500/5"
                  : photoPreview
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-border hover:border-green-500/40 hover:bg-green-500/5"
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
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={photoPreview}
                    alt="Food preview"
                    className="w-32 h-32 rounded-xl object-cover shadow-card border-2 border-green-500/30"
                  />
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-green-700 flex items-center gap-1.5 justify-center sm:justify-start">
                      <Camera className="h-4 w-4" />
                      Photo ready to scan
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{photo?.name}</p>
                    <p className="text-xs text-muted-foreground">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Camera className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-semibold mb-1">Drop your food photo here</p>
                  <p className="text-sm text-muted-foreground">or click to browse · JPG, PNG, WebP · Max 10 MB</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Tip: Take a top-down photo with good lighting for best results
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handleScan}
              disabled={!photo || loading}
              className="w-full mt-4 h-12 text-base bg-gradient-to-r from-green-600 to-primary hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙</span>
                  Analyzing food…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ScanLine className="h-5 w-5" />
                  Scan &amp; Analyze
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Scan result */}
        {result && (
          <ScanResultCard result={result} onAddToLog={handleAddToLog} added={added} />
        )}

        {/* Daily log */}
        <DailyLogSection
          log={todayLog}
          calorieTarget={calorieTarget}
          onRemove={handleRemove}
        />

        {/* Quick tip cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { emoji: "📸", title: "Best Results", tip: "Take a clear, well-lit top-down photo of your entire plate" },
            { emoji: "🎯", title: "Portion Matters", tip: "Include a reference object (spoon, hand) to help estimate portions" },
            { emoji: "🔄", title: "Track Daily", tip: "Log every meal consistently for accurate calorie tracking" },
          ].map(({ emoji, title, tip }) => (
            <div key={title} className="bg-muted/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{emoji}</div>
              <p className="text-sm font-semibold mb-1">{title}</p>
              <p className="text-xs text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
