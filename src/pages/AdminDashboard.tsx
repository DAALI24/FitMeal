import { useState, type ElementType } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  restaurantAdminApi,
  instructorAdminApi,
  type RestaurantAdminProfile,
  type InstructorAdminProfile,
} from "@/lib/api";
import {
  UtensilsCrossed,
  Dumbbell,
  Settings,
  Plus,
  Trash2,
  Save,
  BarChart3,
  Users,
  Star,
  IndianRupee,
  CloudLightning,
  CheckCircle,
  Edit3,
  TrendingUp,
  Package,
  Clock,
  Zap,
  ShieldCheck,
} from "lucide-react";

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "primary",
}: {
  icon: ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: "primary" | "fitness" | "admin" | "accent";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    fitness: "bg-fitness/10 text-fitness",
    admin:   "bg-admin/10 text-admin",
    accent:  "bg-accent/10 text-accent",
  };
  return (
    <Card className="shadow-card">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Role selector ─────────────────────────────────────────────────────────────

function RoleSelector({ onSelect }: { onSelect: (role: "restaurant" | "instructor") => void }) {
  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-admin/10 text-admin rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <ShieldCheck className="h-4 w-4" />
            Admin Portal
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Welcome to <span className="text-gradient-admin">FitMeal Admin</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your listings, pricing, and offerings in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="group card-lift cursor-pointer border-2 hover:border-primary/50 shadow-card hover:shadow-health"
            onClick={() => onSelect("restaurant")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-health group-hover:animate-float">
                <UtensilsCrossed className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Restaurant Owner</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Manage your menu, pricing, cloud kitchen settings, and offerings.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["Menu Management", "Pricing", "Cloud Kitchen", "Analytics"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card
            className="group card-lift cursor-pointer border-2 hover:border-fitness/50 shadow-card hover:shadow-fitness"
            onClick={() => onSelect("instructor")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-fitness rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-fitness group-hover:animate-float">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Gym Instructor</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Set your rates, specialties, availability, and certification details.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["Session Pricing", "Monthly Plans", "Specialties", "Schedule"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Restaurant admin panel ─────────────────────────────────────────────────────

function RestaurantAdmin() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<RestaurantAdminProfile>(restaurantAdminApi.getProfile);
  const [newItem, setNewItem] = useState({ name: "", price: "", calories: "", category: "" });
  const [newSpecialty, setNewSpecialty] = useState("");

  const save = () => {
    restaurantAdminApi.saveProfile(profile);
    toast({ title: "Profile saved!", description: "Your restaurant listing has been updated." });
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) return;
    setProfile((prev) => ({
      ...prev,
      menu: [
        ...prev.menu,
        {
          id: `${Date.now()}`,
          name: newItem.name,
          price: Number(newItem.price),
          calories: Number(newItem.calories) || 0,
          category: newItem.category || "Main Course",
          isAvailable: true,
        },
      ],
    }));
    setNewItem({ name: "", price: "", calories: "", category: "" });
  };

  const removeMenuItem = (id: string) =>
    setProfile((prev) => ({ ...prev, menu: prev.menu.filter((m) => m.id !== id) }));

  const toggleAvailability = (id: string) =>
    setProfile((prev) => ({
      ...prev,
      menu: prev.menu.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m)),
    }));

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    setProfile((prev) => ({ ...prev, specialties: [...prev.specialties, newSpecialty.trim()] }));
    setNewSpecialty("");
  };

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-sm">Manage everything about your restaurant listing</p>
          </div>
          <Button onClick={save} className="shadow-health">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Menu Items" value={profile.menu.length} color="primary" />
          <StatCard icon={CheckCircle} label="Available Items" value={profile.menu.filter((m) => m.isAvailable).length} color="fitness" />
          <StatCard icon={Star} label="Avg. Rating" value="4.7" sub="Based on 312 reviews" color="accent" />
          <StatCard icon={TrendingUp} label="Orders Today" value={24} sub="+18% from yesterday" color="admin" />
        </div>

        <Tabs defaultValue="details">
          <TabsList className="mb-6 bg-muted/60">
            <TabsTrigger value="details">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Details
            </TabsTrigger>
            <TabsTrigger value="menu">
              <UtensilsCrossed className="h-3.5 w-3.5 mr-1.5" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="cloud">
              <CloudLightning className="h-3.5 w-3.5 mr-1.5" />
              Cloud Kitchen
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* ── Details tab ───────────────────────────────────────────────── */}
          <TabsContent value="details">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Restaurant Name", key: "restaurantName", placeholder: "e.g. Green Garden Bistro" },
                    { label: "Cuisine Type", key: "cuisine", placeholder: "e.g. Mediterranean" },
                    { label: "Address", key: "address", placeholder: "Full address" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-sm font-medium block mb-1.5">{label}</label>
                      <Input
                        placeholder={placeholder}
                        value={(profile as Record<string, string>)[key] as string}
                        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Delivery Time</label>
                      <Select
                        value={profile.deliveryTime}
                        onValueChange={(v) => setProfile((p) => ({ ...p, deliveryTime: v }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["15-25 min","20-30 min","25-35 min","30-40 min","35-45 min","45-60 min"].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Price Range</label>
                      <Select
                        value={profile.priceRange}
                        onValueChange={(v) => setProfile((p) => ({ ...p, priceRange: v }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["₹","₹₹","₹₹₹","₹₹₹₹"].map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Specialties & Tags</CardTitle>
                  <CardDescription>Tags help users discover your restaurant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a specialty (e.g. Vegan-friendly)"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSpecialty()}
                    />
                    <Button size="sm" variant="outline" onClick={addSpecialty}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {profile.specialties.map((s, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => setProfile((p) => ({ ...p, specialties: p.specialties.filter((_, idx) => idx !== i) }))}
                      >
                        {s} ×
                      </Badge>
                    ))}
                    {profile.specialties.length === 0 && (
                      <p className="text-sm text-muted-foreground">No specialties added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Menu tab ──────────────────────────────────────────────────── */}
          <TabsContent value="menu">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                  Menu Management
                </CardTitle>
                <CardDescription>Add, edit pricing, and toggle item availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add item form */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/40 rounded-xl border border-dashed border-border">
                  <Input
                    placeholder="Item name *"
                    value={newItem.name}
                    onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Price (₹) *"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))}
                  />
                  <Input
                    placeholder="Calories"
                    type="number"
                    value={newItem.calories}
                    onChange={(e) => setNewItem((p) => ({ ...p, calories: e.target.value }))}
                  />
                  <Button onClick={addMenuItem} className="shadow-health">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {/* Menu list */}
                {profile.menu.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No menu items yet. Add your first item above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.menu.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          item.isAvailable ? "bg-background border-border" : "bg-muted/50 border-dashed opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isAvailable ? "bg-green-500" : "bg-muted-foreground"}`} />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.calories} cal · {item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-2">
                          <span className="font-semibold text-sm">₹{item.price}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:text-primary"
                            onClick={() => toggleAvailability(item.id)}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:text-destructive"
                            onClick={() => removeMenuItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Cloud Kitchen tab ─────────────────────────────────────────── */}
          <TabsContent value="cloud">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CloudLightning className="h-4 w-4 text-cloud" />
                    Cloud Kitchen Mode
                  </CardTitle>
                  <CardDescription>
                    Enable to operate as a delivery-only kitchen — no physical dine-in space required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-cloud/5 border border-cloud/20 rounded-xl">
                    <div>
                      <p className="font-medium text-sm">Cloud Kitchen Active</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Delivery-only mode</p>
                    </div>
                    <button
                      onClick={() => setProfile((p) => ({ ...p, isCloudKitchen: !p.isCloudKitchen }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        profile.isCloudKitchen ? "bg-cloud" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          profile.isCloudKitchen ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {profile.isCloudKitchen && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-green-700">
                          <strong>Cloud Kitchen enabled!</strong> Your listing will appear in the Cloud Kitchens section on the Restaurants page with a special badge.
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {[
                          "Lower overhead — no rent for dining space",
                          "Focus purely on delivery quality",
                          "Appear in dedicated cloud kitchen filter",
                          "Priority listing for late-night orders",
                        ].map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-cloud flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Delivery Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Minimum Order Value (₹)</label>
                    <Input type="number" placeholder="e.g. 200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Delivery Radius (km)</label>
                    <Input type="number" placeholder="e.g. 8" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Delivery Fee (₹)</label>
                    <Input type="number" placeholder="e.g. 40" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Operating Hours</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="time" defaultValue="09:00" />
                      <Input type="time" defaultValue="23:00" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Analytics tab ─────────────────────────────────────────────── */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Today", value: "₹12,400", change: "+18%", positive: true },
                      { label: "This Week", value: "₹78,200", change: "+12%", positive: true },
                      { label: "This Month", value: "₹3,10,500", change: "-3%", positive: false },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{row.value}</span>
                          <Badge variant={row.positive ? "default" : "destructive"} className="text-xs">
                            {row.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4 text-fitness" />
                    Top Performing Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Quinoa Power Bowl", orders: 89, revenue: "₹31,150" },
                      { name: "Grilled Salmon", orders: 74, revenue: "₹33,300" },
                      { name: "Buddha Bowl", orders: 61, revenue: "₹19,520" },
                    ].map((item, i) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">{item.revenue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Instructor admin panel ─────────────────────────────────────────────────────

function InstructorAdmin() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<InstructorAdminProfile>(instructorAdminApi.getProfile);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCert, setNewCert] = useState("");

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

  const save = () => {
    instructorAdminApi.saveProfile(profile);
    toast({ title: "Profile saved!", description: "Your instructor listing has been updated." });
  };

  const toggleDay = (day: string) =>
    setProfile((p) => ({
      ...p,
      availability: p.availability.includes(day)
        ? p.availability.filter((d) => d !== day)
        : [...p.availability, day],
    }));

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-fitness rounded-lg flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-sm">Control your rates, availability, and profile</p>
          </div>
          <Button onClick={save} className="bg-gradient-fitness text-white shadow-fitness">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Clients" value={47} color="fitness" />
          <StatCard icon={Clock} label="Sessions Completed" value={312} color="primary" />
          <StatCard icon={Star} label="Avg. Rating" value="4.8" sub="216 reviews" color="accent" />
          <StatCard icon={IndianRupee} label="Monthly Earnings" value="₹94,200" sub="+22% this month" color="admin" />
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 bg-muted/60">
            <TabsTrigger value="profile">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <IndianRupee className="h-3.5 w-3.5 mr-1.5" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Profile tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", placeholder: "Your name" },
                    { label: "Gym / Studio Name", key: "gymName", placeholder: "e.g. Iron Republic Gym" },
                    { label: "Location", key: "location", placeholder: "e.g. Bandra, Mumbai" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-sm font-medium block mb-1.5">{label}</label>
                      <Input
                        placeholder={placeholder}
                        value={(profile as Record<string, string>)[key] as string}
                        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell potential clients about your training philosophy…"
                      value={profile.bio}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Specialties */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">Specialties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add specialty"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSpecialty.trim()) {
                            setProfile((p) => ({ ...p, specialties: [...p.specialties, newSpecialty.trim()] }));
                            setNewSpecialty("");
                          }
                        }}
                      />
                      <Button size="sm" variant="outline" onClick={() => {
                        if (newSpecialty.trim()) {
                          setProfile((p) => ({ ...p, specialties: [...p.specialties, newSpecialty.trim()] }));
                          setNewSpecialty("");
                        }
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((s, i) => (
                        <Badge
                          key={i}
                          className="cursor-pointer bg-fitness/10 text-fitness hover:bg-destructive/10 hover:text-destructive border-0"
                          onClick={() => setProfile((p) => ({ ...p, specialties: p.specialties.filter((_, idx) => idx !== i) }))}
                        >
                          {s} ×
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add certification"
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newCert.trim()) {
                            setProfile((p) => ({ ...p, certifications: [...p.certifications, newCert.trim()] }));
                            setNewCert("");
                          }
                        }}
                      />
                      <Button size="sm" variant="outline" onClick={() => {
                        if (newCert.trim()) {
                          setProfile((p) => ({ ...p, certifications: [...p.certifications, newCert.trim()] }));
                          setNewCert("");
                        }
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      {profile.certifications.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/40 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            {c}
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setProfile((p) => ({ ...p, certifications: p.certifications.filter((_, idx) => idx !== i) }))}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Pricing tab */}
          <TabsContent value="pricing">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-fitness" />
                    Session & Plan Rates
                  </CardTitle>
                  <CardDescription>Set competitive prices to attract more clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Price Per Session (₹)</label>
                    <Input
                      type="number"
                      value={profile.pricePerSession}
                      onChange={(e) => setProfile((p) => ({ ...p, pricePerSession: Number(e.target.value) }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Platform avg: ₹650/session</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Monthly Plan Price (₹)</label>
                    <Input
                      type="number"
                      value={profile.priceMonthly}
                      onChange={(e) => setProfile((p) => ({ ...p, priceMonthly: Number(e.target.value) }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Usually 4–5× session price</p>
                  </div>

                  <div className="p-4 bg-muted/40 rounded-xl space-y-3 mt-2">
                    <p className="text-sm font-semibold">Session Modes Offered</p>
                    {[
                      { key: "offerOnline" as const, icon: Zap, label: "Online Sessions", desc: "Video call via Zoom / Google Meet" },
                      { key: "offerInPerson" as const, icon: Users, label: "In-Person Sessions", desc: "At your gym or client's location" },
                    ].map(({ key, icon: Icon, label, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-fitness" />
                          <div>
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setProfile((p) => ({ ...p, [key]: !p[key] }))}
                          className={`relative w-10 h-5 rounded-full transition-colors ${profile[key] ? "bg-fitness" : "bg-muted"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${profile[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Preview Listing</CardTitle>
                  <CardDescription>How clients see your pricing card</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-xl p-5 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg">{profile.name || "Your Name"}</h3>
                      <p className="text-sm text-muted-foreground">{profile.gymName || "Your Gym"} · {profile.location || "Your Location"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3 text-center border-fitness/30 bg-fitness/5">
                        <div className="text-xl font-bold text-fitness">₹{profile.pricePerSession}</div>
                        <div className="text-xs text-muted-foreground">Per Session</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center border-primary/30 bg-primary/5">
                        <div className="text-xl font-bold text-primary">₹{profile.priceMonthly}</div>
                        <div className="text-xs text-muted-foreground">Monthly Plan</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.specialties.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-fitness/10 text-fitness text-xs rounded-full border border-fitness/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule tab */}
          <TabsContent value="schedule">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-fitness" />
                  Availability
                </CardTitle>
                <CardDescription>Select days you are available for sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-3">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                        profile.availability.includes(day)
                          ? "bg-gradient-fitness text-white border-fitness shadow-fitness"
                          : "border-border bg-background hover:border-fitness/40"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {profile.availability.length === 0 ? "None" : profile.availability.join(", ")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Earnings This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Session Revenue", value: "₹64,200", share: 68 },
                      { label: "Monthly Plan Revenue", value: "₹30,000", share: 32 },
                    ].map((row) => (
                      <div key={row.label} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-semibold">{row.value}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-fitness rounded-full"
                            style={{ width: `${row.share}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Client Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "New Clients This Month", value: "12" },
                      { label: "Returning Clients", value: "35" },
                      { label: "Avg. Session Rating", value: "4.9 ★" },
                      { label: "Completion Rate", value: "94%" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center p-3 bg-muted/40 rounded-lg text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-semibold">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [role, setRole] = useState<"restaurant" | "instructor" | null>(null);

  if (!role) return <RoleSelector onSelect={setRole} />;
  if (role === "restaurant") return <RestaurantAdmin />;
  return <InstructorAdmin />;
};

export default AdminDashboard;
