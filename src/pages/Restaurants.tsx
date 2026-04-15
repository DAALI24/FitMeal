import greenGardenBistro from "@/assets/green-garden-bistro.jpg";
import fitFoodCo from "@/assets/fit-food-co.jpg";
import spiceRoute from "@/assets/spice-route.jpg";
import oliveBranchKitchen from "@/assets/olive-branch-kitchen.jpg";
import harvestTable from "@/assets/harvest-table.jpg";
import pureEnergyBar from "@/assets/pure-energy-bar.jpg";
import zenBowlHouse from "@/assets/zen-bowl-house.jpg";
import bellaVitaTrattoria from "@/assets/bella-vita-trattoria.jpg";
import freshAmigos from "@/assets/fresh-amigos.jpg";
import plantParadise from "@/assets/plant-paradise.jpg";

import quinoaPowerBowl from "@/assets/quinoa-power-bowl.jpg";
import grilledSalmon from "@/assets/grilled-salmon.jpg";
import proteinSmoothieBowl from "@/assets/protein-smoothie-bowl.jpg";
import dalTadka from "@/assets/dal-tadka.jpg";
import mediterraneanHummusBowl from "@/assets/mediterranean-hummus-bowl.jpg";
import greekSalad from "@/assets/greek-salad.jpg";
import chickenWrap from "@/assets/chicken-wrap.jpg";
import pokeBowl from "@/assets/poke-bowl.jpg";
import greenSmoothieBowl from "@/assets/green-smoothie-bowl.jpg";
import zucchiniNoodles from "@/assets/zucchini-noodles.jpg";
import quinoaBurritoBowl from "@/assets/quinoa-burrito-bowl.jpg";
import buddhaBowl from "@/assets/buddha-bowl.jpg";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ordersApi, openRazorpayCheckout } from "@/lib/api";
import type { Restaurant, MenuItem } from "@/types";
import {
  MapPin, Star, Clock, Filter, Search, ShoppingCart, Heart,
  Leaf, Award, Plus, Minus, ArrowLeft, CloudLightning,
  Zap, Flame, IndianRupee, CheckCircle,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const restaurants: Restaurant[] = [
  {
    id: "1", name: "Green Garden Bistro", cuisine: "Healthy",
    rating: 4.8, reviewCount: 312, deliveryTime: "25-35 min", distance: "2.1 km",
    image: greenGardenBistro, isPartner: true, healthScore: 95, priceRange: "₹₹",
    isCloudKitchen: false, address: "12, Turner Road, Bandra West, Mumbai",
    specialties: ["Low-calorie", "Gluten-free options"],
    menu: [
      { id: "1", name: "Quinoa Power Bowl", description: "Quinoa, grilled chicken, avocado, mixed greens, tahini dressing", price: 350, calories: 450, protein: 35, carbs: 42, fat: 12, category: "Fit & Fresh Bowls", image: quinoaPowerBowl, isRecommended: true, nutritionMatch: 98, isVeg: false, tags: ["High-protein", "Gluten-free"] },
      { id: "2", name: "Grilled Salmon Plate", description: "Fresh salmon with steamed vegetables and brown rice", price: 450, calories: 400, protein: 42, carbs: 38, fat: 10, category: "Lean & Clean Mains", image: grilledSalmon, isRecommended: true, nutritionMatch: 95, isVeg: false, tags: ["Omega-3", "High-protein"] },
      { id: "3", name: "Rainbow Buddha Bowl", description: "Mixed vegetables, chickpeas, quinoa, herb dressing", price: 320, calories: 380, protein: 18, carbs: 55, fat: 9, category: "Fit & Fresh Bowls", image: buddhaBowl, isRecommended: true, nutritionMatch: 92, isVeg: true, tags: ["Vegan", "High-fiber"] },
      { id: "4", name: "Green Goddess Smoothie", description: "Spinach, banana, mango, protein powder, coconut water", price: 180, calories: 220, protein: 20, carbs: 32, fat: 3, category: "Energy Elixirs", image: greenSmoothieBowl, isRecommended: true, nutritionMatch: 88, isVeg: true, tags: ["Detox"] },
      { id: "5", name: "Grilled Chicken Wrap", description: "Whole wheat wrap with grilled chicken and fresh vegetables", price: 280, calories: 420, protein: 30, carbs: 45, fat: 11, category: "Lean & Clean Mains", image: chickenWrap, isRecommended: false, nutritionMatch: 78, isVeg: false, tags: [] },
    ],
  },
  {
    id: "2", name: "Fit Food Co.", cuisine: "Continental",
    rating: 4.6, reviewCount: 189, deliveryTime: "30-40 min", distance: "1.8 km",
    image: fitFoodCo, isPartner: true, healthScore: 92, priceRange: "₹₹₹",
    isCloudKitchen: false, address: "45, Linking Road, Bandra West, Mumbai",
    specialties: ["High-protein", "Post-workout meals"],
    menu: [
      { id: "6", name: "Protein Smoothie Bowl", description: "Blended berries, protein powder, topped with nuts and seeds", price: 280, calories: 350, protein: 28, carbs: 40, fat: 8, category: "Power Breakfast", image: proteinSmoothieBowl, isRecommended: true, nutritionMatch: 92, isVeg: true, tags: ["High-protein"] },
      { id: "7", name: "Muscle Builder Plate", description: "Grilled chicken breast, sweet potato, and steamed broccoli", price: 420, calories: 520, protein: 48, carbs: 45, fat: 10, category: "High Protein Heroes", image: grilledSalmon, isRecommended: true, nutritionMatch: 90, isVeg: false, tags: ["High-protein", "Bulk"] },
      { id: "8", name: "Energy Bomb Salad", description: "Kale, quinoa, nuts, seeds, and superfood dressing", price: 320, calories: 380, protein: 15, carbs: 42, fat: 16, category: "Superfood Sensations", image: greekSalad, isRecommended: true, nutritionMatch: 94, isVeg: true, tags: ["Superfood"] },
    ],
  },
  {
    id: "3", name: "Spice Route", cuisine: "Indian",
    rating: 4.4, reviewCount: 241, deliveryTime: "35-45 min", distance: "3.2 km",
    image: spiceRoute, isPartner: false, healthScore: 78, priceRange: "₹₹",
    isCloudKitchen: false, address: "78, Hill Road, Bandra, Mumbai",
    specialties: ["Home-style", "Low oil"],
    menu: [
      { id: "9", name: "Dal Tadka with Brown Rice", description: "Traditional lentil curry with healthy brown rice", price: 220, calories: 380, protein: 16, carbs: 58, fat: 7, category: "Wholesome Classics", image: dalTadka, isRecommended: false, nutritionMatch: 75, isVeg: true, tags: ["Vegan"] },
      { id: "10", name: "Tandoori Chicken Salad", description: "Grilled tandoori chicken over fresh mixed greens", price: 340, calories: 420, protein: 38, carbs: 20, fat: 12, category: "Healthy Tandoor", image: chickenWrap, isRecommended: true, nutritionMatch: 82, isVeg: false, tags: ["High-protein"] },
    ],
  },
  {
    id: "4", name: "Olive Branch Kitchen", cuisine: "Mediterranean",
    rating: 4.7, reviewCount: 178, deliveryTime: "25-35 min", distance: "2.5 km",
    image: oliveBranchKitchen, isPartner: true, healthScore: 89, priceRange: "₹₹₹",
    isCloudKitchen: false, address: "22, Pali Hill, Bandra West, Mumbai",
    specialties: ["Heart-healthy", "Olive oil based"],
    menu: [
      { id: "11", name: "Mediterranean Hummus Bowl", description: "Fresh hummus, vegetables, olives, and whole grain pita", price: 290, calories: 360, protein: 14, carbs: 48, fat: 12, category: "Heart Healthy Classics", image: mediterraneanHummusBowl, isRecommended: true, nutritionMatch: 90, isVeg: true, tags: ["Vegan", "Heart-healthy"] },
      { id: "12", name: "Greek Village Salad", description: "Tomatoes, cucumber, feta, olives, and olive oil dressing", price: 320, calories: 280, protein: 10, carbs: 22, fat: 18, category: "Aegean Fresh", image: greekSalad, isRecommended: true, nutritionMatch: 88, isVeg: true, tags: ["Low-carb"] },
      { id: "13", name: "Grilled Fish Platter", description: "Mediterranean herbs, grilled vegetables, and quinoa", price: 480, calories: 440, protein: 40, carbs: 38, fat: 12, category: "Mediterranean Mains", image: grilledSalmon, isRecommended: true, nutritionMatch: 91, isVeg: false, tags: ["Omega-3"] },
    ],
  },
  {
    id: "5", name: "Harvest Table", cuisine: "Farm Fresh",
    rating: 4.5, reviewCount: 144, deliveryTime: "30-40 min", distance: "3.8 km",
    image: harvestTable, isPartner: true, healthScore: 93, priceRange: "₹₹₹",
    isCloudKitchen: false, address: "5, Carter Road, Bandra West, Mumbai",
    specialties: ["Organic", "Farm-to-table"],
    menu: [
      { id: "14", name: "Farm Fresh Salad", description: "Seasonal vegetables, organic greens, herb vinaigrette", price: 350, calories: 260, protein: 8, carbs: 30, fat: 12, category: "Garden to Table", image: greekSalad, isRecommended: true, nutritionMatch: 96, isVeg: true, tags: ["Organic", "Vegan"] },
      { id: "15", name: "Organic Chicken Bowl", description: "Free-range chicken, roasted vegetables, ancient grains", price: 420, calories: 480, protein: 40, carbs: 50, fat: 12, category: "Organic Essentials", image: quinoaPowerBowl, isRecommended: true, nutritionMatch: 94, isVeg: false, tags: ["Organic", "Free-range"] },
    ],
  },
  {
    id: "6", name: "Pure Energy Bar", cuisine: "Juice & Smoothies",
    rating: 4.6, reviewCount: 207, deliveryTime: "15-25 min", distance: "1.2 km",
    image: pureEnergyBar, isPartner: true, healthScore: 96, priceRange: "₹₹",
    isCloudKitchen: false, address: "3, Chapel Road, Bandra West, Mumbai",
    specialties: ["Cold-pressed juices", "Protein smoothies"],
    menu: [
      { id: "17", name: "Green Machine Smoothie", description: "Kale, spinach, apple, ginger, coconut water", price: 200, calories: 180, protein: 5, carbs: 40, fat: 2, category: "Detox Delights", image: greenSmoothieBowl, isRecommended: true, nutritionMatch: 95, isVeg: true, tags: ["Detox", "Vegan"] },
      { id: "18", name: "Protein Power Smoothie", description: "Berries, banana, protein powder, almond milk", price: 250, calories: 320, protein: 30, carbs: 38, fat: 5, category: "Muscle Fuel", image: proteinSmoothieBowl, isRecommended: true, nutritionMatch: 93, isVeg: true, tags: ["High-protein"] },
      { id: "19", name: "Acai Wonder Bowl", description: "Acai, granola, fresh fruits, coconut flakes", price: 320, calories: 380, protein: 10, carbs: 62, fat: 12, category: "Superfood Bowls", image: proteinSmoothieBowl, isRecommended: true, nutritionMatch: 89, isVeg: true, tags: ["Superfood", "Vegan"] },
    ],
  },
  {
    id: "7", name: "Zen Bowl House", cuisine: "Asian Fusion",
    rating: 4.5, reviewCount: 163, deliveryTime: "30-40 min", distance: "2.8 km",
    image: zenBowlHouse, isPartner: true, healthScore: 87, priceRange: "₹₹",
    isCloudKitchen: false, address: "88, Waterfield Road, Bandra, Mumbai",
    specialties: ["Poke bowls", "Japanese-inspired"],
    menu: [
      { id: "20", name: "Hawaiian Poke Bowl", description: "Fresh tuna, brown rice, avocado, sesame dressing", price: 450, calories: 520, protein: 35, carbs: 55, fat: 15, category: "Zen Bowls", image: pokeBowl, isRecommended: true, nutritionMatch: 91, isVeg: false, tags: ["Omega-3"] },
      { id: "21", name: "Buddha's Blessing Bowl", description: "Tofu, vegetables, quinoa, miso dressing", price: 380, calories: 420, protein: 18, carbs: 52, fat: 12, category: "Mindful Meals", image: buddhaBowl, isRecommended: true, nutritionMatch: 88, isVeg: true, tags: ["Vegan"] },
    ],
  },
  {
    id: "8", name: "Bella Vita Trattoria", cuisine: "Italian",
    rating: 4.3, reviewCount: 122, deliveryTime: "35-45 min", distance: "3.5 km",
    image: bellaVitaTrattoria, isPartner: false, healthScore: 76, priceRange: "₹₹₹",
    isCloudKitchen: false, address: "19, Mount Mary Road, Bandra, Mumbai",
    specialties: ["Healthy Italian", "Zucchini pasta"],
    menu: [
      { id: "23", name: "Zucchini Noodles Primavera", description: "Spiralized zucchini with fresh vegetables and herb sauce", price: 320, calories: 280, protein: 10, carbs: 30, fat: 12, category: "Healthy Italian", image: zucchiniNoodles, isRecommended: true, nutritionMatch: 85, isVeg: true, tags: ["Low-carb", "Gluten-free"] },
      { id: "24", name: "Grilled Chicken Caprese", description: "Grilled chicken with tomatoes, mozzarella, and basil", price: 380, calories: 420, protein: 38, carbs: 15, fat: 18, category: "Light & Fresh", image: chickenWrap, isRecommended: true, nutritionMatch: 80, isVeg: false, tags: [] },
    ],
  },
  {
    id: "9", name: "Fresh Amigos", cuisine: "Mexican",
    rating: 4.4, reviewCount: 198, deliveryTime: "25-35 min", distance: "2.7 km",
    image: freshAmigos, isPartner: true, healthScore: 84, priceRange: "₹₹",
    isCloudKitchen: false, address: "55, Pali Naka, Bandra West, Mumbai",
    specialties: ["Quinoa bowls", "Low-calorie Mexican"],
    menu: [
      { id: "26", name: "Quinoa Burrito Bowl", description: "Quinoa, black beans, vegetables, avocado, salsa", price: 340, calories: 450, protein: 18, carbs: 68, fat: 10, category: "Fiesta Bowls", image: quinoaBurritoBowl, isRecommended: true, nutritionMatch: 89, isVeg: true, tags: ["Vegan", "High-fiber"] },
    ],
  },
  {
    id: "10", name: "Plant Paradise", cuisine: "Vegan",
    rating: 4.7, reviewCount: 256, deliveryTime: "30-40 min", distance: "2.3 km",
    image: plantParadise, isPartner: true, healthScore: 98, priceRange: "₹₹",
    isCloudKitchen: false, address: "34, St. Andrews Road, Bandra, Mumbai",
    specialties: ["100% Vegan", "Raw food options"],
    menu: [
      { id: "29", name: "Rainbow Buddha Bowl", description: "Colorful vegetables, chickpeas, quinoa, tahini dressing", price: 320, calories: 380, protein: 18, carbs: 58, fat: 10, category: "Plant Power Bowls", image: buddhaBowl, isRecommended: true, nutritionMatch: 97, isVeg: true, tags: ["Vegan", "High-fiber"] },
      { id: "30", name: "Green Goddess Smoothie", description: "Spinach, mango, coconut, plant protein", price: 250, calories: 280, protein: 20, carbs: 38, fat: 5, category: "Wellness Wonders", image: greenSmoothieBowl, isRecommended: true, nutritionMatch: 95, isVeg: true, tags: ["Vegan", "Detox"] },
    ],
  },

  // ── Cloud Kitchens ─────────────────────────────────────────────────────────
  {
    id: "ck1", name: "Macro Kitchen", cuisine: "High-Protein Meals",
    rating: 4.8, reviewCount: 89, deliveryTime: "20-30 min", distance: "Online",
    image: fitFoodCo, isPartner: true, healthScore: 96, priceRange: "₹₹",
    isCloudKitchen: true, address: "Delivery only — Andheri East, Mumbai",
    specialties: ["Macro-tracked meals", "Bodybuilder diet", "Keto-friendly"],
    menu: [
      { id: "ck1-1", name: "Lean Bulk Plate", description: "250g chicken breast, 200g sweet potato, 150g broccoli, tracked macros", price: 390, calories: 580, protein: 55, carbs: 52, fat: 10, category: "Bodybuilder Meals", image: grilledSalmon, isRecommended: true, nutritionMatch: 99, isVeg: false, tags: ["High-protein", "Macro-tracked"] },
      { id: "ck1-2", name: "Keto Steak Bowl", description: "Grilled steak, cauliflower rice, avocado, olive oil", price: 520, calories: 640, protein: 50, carbs: 12, fat: 42, category: "Keto Zone", image: quinoaPowerBowl, isRecommended: true, nutritionMatch: 97, isVeg: false, tags: ["Keto", "Low-carb"] },
      { id: "ck1-3", name: "Vegan Protein Bowl", description: "Tempeh, lentils, quinoa, nutritional yeast sauce", price: 310, calories: 480, protein: 38, carbs: 58, fat: 10, category: "Plant Protein", image: buddhaBowl, isRecommended: true, nutritionMatch: 95, isVeg: true, tags: ["Vegan", "High-protein"] },
    ],
  },
  {
    id: "ck2", name: "Night Owl Kitchen", cuisine: "Late-Night Healthy",
    rating: 4.6, reviewCount: 134, deliveryTime: "25-40 min", distance: "Online",
    image: zenBowlHouse, isPartner: true, healthScore: 88, priceRange: "₹₹",
    isCloudKitchen: true, address: "Delivery only — Powai, Mumbai",
    specialties: ["Open till 2 AM", "Low-cal comfort food", "Post-party meals"],
    menu: [
      { id: "ck2-1", name: "Midnight Protein Wrap", description: "Whole wheat wrap, grilled chicken, jalapeños, greek yoghurt sauce", price: 280, calories: 440, protein: 35, carbs: 48, fat: 10, category: "Night Fuel", image: chickenWrap, isRecommended: true, nutritionMatch: 90, isVeg: false, tags: ["High-protein", "Midnight delivery"] },
      { id: "ck2-2", name: "Detox Noodle Soup", description: "Rice noodles, broth, bok choy, ginger — gut-healing", price: 260, calories: 320, protein: 14, carbs: 55, fat: 4, category: "Recovery Food", image: zucchiniNoodles, isRecommended: true, nutritionMatch: 88, isVeg: true, tags: ["Low-fat", "Gut health"] },
      { id: "ck2-3", name: "Acai Power Bowl", description: "Thick acai base, granola, honey, mixed berries", price: 290, calories: 380, protein: 10, carbs: 66, fat: 8, category: "Sweet & Healthy", image: proteinSmoothieBowl, isRecommended: true, nutritionMatch: 85, isVeg: true, tags: ["Antioxidant", "Vegan"] },
    ],
  },
  {
    id: "ck3", name: "Tiffin Box", cuisine: "Indian Meal Prep",
    rating: 4.9, reviewCount: 311, deliveryTime: "30-45 min", distance: "Online",
    image: harvestTable, isPartner: true, healthScore: 91, priceRange: "₹",
    isCloudKitchen: true, address: "Delivery only — Dadar, Mumbai",
    specialties: ["Weekly meal prep", "Traditional home food", "Custom calorie targets"],
    menu: [
      { id: "ck3-1", name: "7-Day Meal Plan Box", description: "21 meals — breakfast, lunch, dinner. Custom calories. Weekly delivery.", price: 2800, calories: 1800, protein: 140, carbs: 210, fat: 55, category: "Meal Prep Plans", image: dalTadka, isRecommended: true, nutritionMatch: 98, isVeg: false, tags: ["Meal prep", "Best value"] },
      { id: "ck3-2", name: "Desi Protein Thali", description: "Dal makhni (low-fat), tandoori roti, paneer tikka, salad", price: 320, calories: 480, protein: 28, carbs: 62, fat: 12, category: "Healthy Thalis", image: dalTadka, isRecommended: true, nutritionMatch: 92, isVeg: true, tags: ["High-protein veg"] },
      { id: "ck3-3", name: "Weight Loss Dabba", description: "Multigrain roti, sabzi, dal, salad — 400-cal controlled portion", price: 220, calories: 400, protein: 18, carbs: 55, fat: 10, category: "Calorie Controlled", image: greekSalad, isRecommended: true, nutritionMatch: 95, isVeg: true, tags: ["Weight loss", "Low-cal"] },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

type CartState = Record<string, number>;

function getCartTotal(cart: CartState, menu: MenuItem[]): number {
  return menu.reduce((sum, item) => sum + (item.price * (cart[item.id] ?? 0)), 0);
}

function getCartItemCount(cart: CartState): number {
  return Object.values(cart).reduce((s, c) => s + c, 0);
}

// ── Nutrition bar ─────────────────────────────────────────────────────────────

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span><span>{value}g</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

// ── Restaurant list view ──────────────────────────────────────────────────────

const Restaurants = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [viewMode, setViewMode] = useState<"all" | "dine-in" | "cloud">("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartState>({});
  const [paying, setPaying] = useState(false);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "all" || r.cuisine.toLowerCase() === selectedCuisine;
    const matchesView =
      viewMode === "all" ||
      (viewMode === "cloud" && r.isCloudKitchen) ||
      (viewMode === "dine-in" && !r.isCloudKitchen);
    return matchesSearch && matchesCuisine && matchesView;
  });

  const addToCart = (item: MenuItem) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }));
    toast({ title: "Added to cart", description: item.name });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if ((next[itemId] ?? 0) > 1) next[itemId]--;
      else delete next[itemId];
      return next;
    });
  };

  const handleCheckout = async () => {
    if (!selectedRestaurant) return;
    const total = getCartTotal(cart, selectedRestaurant.menu);
    if (total === 0) return;
    setPaying(true);

    await openRazorpayCheckout({
      amount: total,
      description: `Order from ${selectedRestaurant.name}`,
      onSuccess: (paymentId) => {
        const items = selectedRestaurant.menu
          .filter((m) => (cart[m.id] ?? 0) > 0)
          .map((m) => ({
            menuItem: m,
            quantity: cart[m.id],
            restaurantId: selectedRestaurant.id,
            restaurantName: selectedRestaurant.name,
          }));

        ordersApi.create({
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          items,
          totalAmount: total,
          paymentId,
          paymentMethod: "Razorpay",
        });

        setPaying(false);
        setCart({});
        toast({
          title: "Order placed!",
          description: `Your order from ${selectedRestaurant.name} is confirmed. Payment ID: ${paymentId}`,
        });
        setSelectedRestaurant(null);
      },
      onDismiss: () => setPaying(false),
    });
  };

  // ── Single restaurant menu view ───────────────────────────────────────────

  if (selectedRestaurant) {
    const total = getCartTotal(cart, selectedRestaurant.menu);
    const itemCount = getCartItemCount(cart);
    const categories = Array.from(new Set(selectedRestaurant.menu.map((m) => m.category)));

    return (
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Card className="shadow-health mb-8 overflow-hidden">
            <div className="relative h-52">
              <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">{selectedRestaurant.name}</h1>
                    {selectedRestaurant.isPartner && (
                      <Badge className="bg-primary text-xs">
                        <Award className="h-3 w-3 mr-1" />Partner
                      </Badge>
                    )}
                    {selectedRestaurant.isCloudKitchen && (
                      <span className="badge-cloud flex items-center gap-1">
                        <CloudLightning className="h-3 w-3" />Cloud Kitchen
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{selectedRestaurant.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selectedRestaurant.deliveryTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedRestaurant.distance}</span>
                    <span className="flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-green-400" />Health {selectedRestaurant.healthScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="px-6 py-4">
              <Button variant="outline" onClick={() => { setSelectedRestaurant(null); setCart({}); }} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Back to Restaurants
              </Button>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Menu */}
            <div className="lg:col-span-2 space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-lg font-bold mb-4 text-foreground/80 border-b border-border pb-2">{category}</h2>
                  <div className="space-y-3">
                    {selectedRestaurant.menu
                      .filter((m) => m.category === category)
                      .map((item) => (
                        <Card key={item.id} className={`border-2 transition-all ${item.isRecommended ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <h3 className="font-semibold">{item.name}</h3>
                                      {item.isRecommended && (
                                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20 border">
                                          {item.nutritionMatch}% Match
                                        </Badge>
                                      )}
                                      {item.isVeg && (
                                        <span className="text-xs text-green-600 font-medium border border-green-500 px-1.5 py-0.5 rounded">Veg</span>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {item.tags.map((t) => (
                                        <span key={t} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>
                                      ))}
                                    </div>
                                    {/* Macros */}
                                    <div className="grid grid-cols-3 gap-1.5 w-full max-w-xs mb-2">
                                      <MacroBar label="Protein" value={item.protein} max={60} color="bg-blue-400" />
                                      <MacroBar label="Carbs" value={item.carbs} max={80} color="bg-orange-400" />
                                      <MacroBar label="Fat" value={item.fat} max={40} color="bg-yellow-400" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
                                  </div>

                                  {/* Cart controls */}
                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="font-bold text-base">₹{item.price}</span>
                                    <div className="flex items-center gap-1.5">
                                      {(cart[item.id] ?? 0) > 0 && (
                                        <>
                                          <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => removeFromCart(item.id)}>
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="font-semibold w-5 text-center text-sm">{cart[item.id]}</span>
                                        </>
                                      )}
                                      <Button size="sm" className="h-7 shadow-health px-2.5" onClick={() => addToCart(item)}>
                                        <Plus className="h-3 w-3 mr-1" />Add
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart */}
            <div>
              <Card className="shadow-health sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Your Order
                    {itemCount > 0 && (
                      <Badge className="ml-auto bg-primary text-xs">{itemCount}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {itemCount === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedRestaurant.menu.map((item) => {
                        const qty = cart[item.id] ?? 0;
                        if (!qty) return null;
                        return (
                          <div key={item.id} className="flex justify-between items-start text-sm">
                            <div className="min-w-0 pr-2">
                              <p className="font-medium line-clamp-1">{item.name}</p>
                              <p className="text-xs text-muted-foreground">₹{item.price} × {qty}</p>
                            </div>
                            <p className="font-semibold flex-shrink-0">₹{item.price * qty}</p>
                          </div>
                        );
                      })}

                      <div className="border-t pt-3 space-y-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Subtotal</span>
                          <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Delivery fee</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-1 border-t">
                          <span>Total</span>
                          <span>₹{total}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full shadow-health"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={paying}
                      >
                        {paying ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <IndianRupee className="mr-2 h-4 w-4" />
                            Pay ₹{total} via Razorpay
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Secured by Razorpay · Test mode
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Restaurant listing ────────────────────────────────────────────────────

  const cloudKitchens = filteredRestaurants.filter((r) => r.isCloudKitchen);
  const dineIn = filteredRestaurants.filter((r) => !r.isCloudKitchen);

  return (
    <div className="min-h-screen bg-gradient-card pb-16">
      {/* Page header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(24_95%_53%/0.3),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Flame className="h-4 w-4" />
            Healthy Restaurants + Cloud Kitchens
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Eat Smart, <span className="text-yellow-300">Feel Great</span>
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Order from partner restaurants or explore our exclusive cloud kitchens — all macro-tracked and health-scored.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="shadow-health mb-8">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search restaurants or cuisines…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger className="w-full md:w-52">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {["all","healthy","continental","indian","mediterranean","farm fresh","juice & smoothies","asian fusion","italian","mexican","vegan","high-protein meals","late-night healthy","indian meal prep"].map((c) => (
                    <SelectItem key={c} value={c}>{c === "all" ? "All Cuisines" : c.replace(/\b\w/g, (l) => l.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View toggle */}
            <div className="mt-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                <TabsList>
                  <TabsTrigger value="all">All ({restaurants.length})</TabsTrigger>
                  <TabsTrigger value="dine-in" className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5" />
                    Dine-In & Delivery ({restaurants.filter((r) => !r.isCloudKitchen).length})
                  </TabsTrigger>
                  <TabsTrigger value="cloud" className="flex items-center gap-1.5">
                    <CloudLightning className="h-3.5 w-3.5" />
                    Cloud Kitchens ({restaurants.filter((r) => r.isCloudKitchen).length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Cloud kitchen spotlight */}
        {(viewMode === "all" || viewMode === "cloud") && cloudKitchens.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-gradient-cloud text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                <CloudLightning className="h-4 w-4" />
                Cloud Kitchens
              </div>
              <p className="text-muted-foreground text-sm">Delivery-only · Macro-tracked · No physical location needed</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cloudKitchens.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} isCloud />
              ))}
            </div>
          </div>
        )}

        {/* Dine-in / delivery */}
        {(viewMode === "all" || viewMode === "dine-in") && dineIn.length > 0 && (
          <div>
            {viewMode === "all" && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 bg-gradient-primary text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                  <Leaf className="h-4 w-4" />
                  Restaurants & Cafes
                </div>
                <p className="text-muted-foreground text-sm">Dine-in · Takeaway · Delivery</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dineIn.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
              ))}
            </div>
          </div>
        )}

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No results found</p>
            <p className="text-muted-foreground mt-1">Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Restaurant card ───────────────────────────────────────────────────────────

function RestaurantCard({
  restaurant,
  onClick,
  isCloud = false,
}: {
  restaurant: Restaurant;
  onClick: () => void;
  isCloud?: boolean;
}) {
  return (
    <Card
      className={`group card-lift cursor-pointer overflow-hidden shadow-card transition-all duration-300 ${
        isCloud ? "hover:border-cloud/40 hover:shadow-[0_10px_30px_-5px_hsl(348_83%_58%/0.2)]" : "hover:border-primary/40 hover:shadow-health"
      }`}
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {restaurant.isPartner && (
            <Badge className="bg-primary text-xs shadow-sm">
              <Award className="h-2.5 w-2.5 mr-1" />Partner
            </Badge>
          )}
          {isCloud && (
            <span className="badge-cloud flex items-center gap-1 shadow-sm">
              <CloudLightning className="h-3 w-3" />Cloud Kitchen
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="text-xs backdrop-blur-sm">
            <Leaf className="h-2.5 w-2.5 mr-1 text-green-500" />
            {restaurant.healthScore}%
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3">
          {isCloud && (
            <span className="flex items-center gap-1 bg-cloud/90 text-white text-xs px-2 py-0.5 rounded-full">
              <Zap className="h-3 w-3" />Delivery only
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-base">{restaurant.name}</h3>
          <span className="text-muted-foreground text-sm">{restaurant.priceRange}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{restaurant.cuisine}</p>

        {restaurant.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.specialties.slice(0, 2).map((s) => (
              <span key={s} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{s}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
            <span className="text-xs">({restaurant.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            {isCloud ? (
              <><CloudLightning className="h-3.5 w-3.5 text-cloud" /><span>Online</span></>
            ) : (
              <><MapPin className="h-3.5 w-3.5" /><span>{restaurant.distance}</span></>
            )}
          </div>
        </div>

        <Button className={`w-full ${isCloud ? "bg-gradient-cloud text-white hover:opacity-90" : "shadow-health"}`}>
          <Heart className="h-3.5 w-3.5 mr-2" />
          View Menu
        </Button>
      </CardContent>
    </Card>
  );
}

export default Restaurants;
