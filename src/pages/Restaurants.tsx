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

// Food images
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
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Star,
  Clock,
  Filter,
  Search,
  ShoppingCart,
  Heart,
  Leaf,
  Award,
  Plus,
  Minus,
  DollarSign
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: string;
  image: string;
  isRecommended: boolean;
  nutritionMatch: number;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  image: string;
  isPartner: boolean;
  healthScore: number;
  priceRange: string;
  menu: MenuItem[];
}

const Restaurants = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const restaurants: Restaurant[] = [
    {
      id: "1",
      name: "Green Garden Bistro",
      cuisine: "Healthy",
      rating: 4.8,
      deliveryTime: "25-35 min",
      distance: "2.1 km",
      image: greenGardenBistro,
      isPartner: true,
      healthScore: 95,
      priceRange: "₹₹",
      menu: [
        {
          id: "1",
          name: "Quinoa Power Bowl",
          description: "Quinoa, grilled chicken, avocado, mixed greens, and tahini dressing",
          price: 350,
          calories: 450,
          category: "Fit & Fresh Bowls",
          image: quinoaPowerBowl,
          isRecommended: true,
          nutritionMatch: 98
        },
        {
          id: "2",
          name: "Grilled Salmon Plate",
          description: "Fresh salmon with steamed vegetables and brown rice",
          price: 450,
          calories: 400,
          category: "Lean & Clean Mains",
          image: grilledSalmon,
          isRecommended: true,
          nutritionMatch: 95
        },
        {
          id: "3",
          name: "Rainbow Buddha Bowl",
          description: "Mixed vegetables, chickpeas, quinoa, and herb dressing",
          price: 320,
          calories: 380,
          category: "Fit & Fresh Bowls",
          image: buddhaBowl,
          isRecommended: true,
          nutritionMatch: 92
        },
        {
          id: "4",
          name: "Green Goddess Smoothie",
          description: "Spinach, banana, mango, protein powder, and coconut water",
          price: 180,
          calories: 220,
          category: "Energy Elixirs",
          image: greenSmoothieBowl,
          isRecommended: true,
          nutritionMatch: 88
        },
        {
          id: "5",
          name: "Grilled Chicken Wrap",
          description: "Whole wheat wrap with grilled chicken and fresh vegetables",
          price: 280,
          calories: 420,
          category: "Lean & Clean Mains",
          image: chickenWrap,
          isRecommended: false,
          nutritionMatch: 78
        }
      ]
    },
    {
      id: "2",
      name: "Fit Food Co.",
      cuisine: "Continental",
      rating: 4.6,
      deliveryTime: "30-40 min",
      distance: "1.8 km",
      image: fitFoodCo,
      isPartner: true,
      healthScore: 92,
      priceRange: "₹₹₹",
      menu: [
        {
          id: "6",
          name: "Protein Smoothie Bowl",
          description: "Blended berries, protein powder, topped with nuts and seeds",
          price: 280,
          calories: 350,
          category: "Power Breakfast",
          image: proteinSmoothieBowl,
          isRecommended: true,
          nutritionMatch: 92
        },
        {
          id: "7",
          name: "Muscle Builder Plate",
          description: "Grilled chicken breast, sweet potato, and steamed broccoli",
          price: 420,
          calories: 520,
          category: "High Protein Heroes",
          image: grilledSalmon,
          isRecommended: true,
          nutritionMatch: 90
        },
        {
          id: "8",
          name: "Energy Bomb Salad",
          description: "Kale, quinoa, nuts, seeds, and superfood dressing",
          price: 320,
          calories: 380,
          category: "Superfood Sensations",
          image: greekSalad,
          isRecommended: true,
          nutritionMatch: 94
        }
      ]
    },
    {
      id: "3",
      name: "Spice Route",
      cuisine: "Indian",
      rating: 4.4,
      deliveryTime: "35-45 min",
      distance: "3.2 km",
      image: spiceRoute,
      isPartner: false,
      healthScore: 78,
      priceRange: "₹₹",
      menu: [
        {
          id: "9",
          name: "Dal Tadka with Brown Rice",
          description: "Traditional lentil curry with healthy brown rice",
          price: 220,
          calories: 380,
          category: "Wholesome Classics",
          image: dalTadka,
          isRecommended: false,
          nutritionMatch: 75
        },
        {
          id: "10",
          name: "Tandoori Chicken Salad",
          description: "Grilled tandoori chicken over fresh mixed greens",
          price: 340,
          calories: 420,
          category: "Healthy Tandoor",
          image: chickenWrap,
          isRecommended: true,
          nutritionMatch: 82
        }
      ]
    },
    {
      id: "4",
      name: "Olive Branch Kitchen",
      cuisine: "Mediterranean",
      rating: 4.7,
      deliveryTime: "25-35 min",
      distance: "2.5 km",
      image: oliveBranchKitchen,
      isPartner: true,
      healthScore: 89,
      priceRange: "₹₹₹",
      menu: [
        {
          id: "11",
          name: "Mediterranean Hummus Bowl",
          description: "Fresh hummus, vegetables, olives, and whole grain pita",
          price: 290,
          calories: 360,
          category: "Heart Healthy Classics",
          image: mediterraneanHummusBowl,
          isRecommended: true,
          nutritionMatch: 90
        },
        {
          id: "12",
          name: "Greek Village Salad",
          description: "Tomatoes, cucumber, feta, olives, and olive oil dressing",
          price: 320,
          calories: 280,
          category: "Aegean Fresh",
          image: greekSalad,
          isRecommended: true,
          nutritionMatch: 88
        },
        {
          id: "13",
          name: "Grilled Fish Platter",
          description: "Mediterranean herbs, grilled vegetables, and quinoa",
          price: 480,
          calories: 440,
          category: "Mediterranean Mains",
          image: grilledSalmon,
          isRecommended: true,
          nutritionMatch: 91
        }
      ]
    },
    {
      id: "5",
      name: "Harvest Table",
      cuisine: "Farm Fresh",
      rating: 4.5,
      deliveryTime: "30-40 min",
      distance: "3.8 km",
      image: harvestTable,
      isPartner: true,
      healthScore: 93,
      priceRange: "₹₹₹",
      menu: [
        {
          id: "14",
          name: "Farm Fresh Salad",
          description: "Seasonal vegetables, organic greens, and herb vinaigrette",
          price: 350,
          calories: 260,
          category: "Garden to Table",
          image: greekSalad,
          isRecommended: true,
          nutritionMatch: 96
        },
        {
          id: "15",
          name: "Organic Chicken Bowl",
          description: "Free-range chicken, roasted vegetables, and ancient grains",
          price: 420,
          calories: 480,
          category: "Organic Essentials",
          image: quinoaPowerBowl,
          isRecommended: true,
          nutritionMatch: 94
        },
        {
          id: "16",
          name: "Seasonal Veggie Wrap",
          description: "Fresh seasonal vegetables in a whole grain tortilla",
          price: 280,
          calories: 320,
          category: "Harvest Wraps",
          image: chickenWrap,
          isRecommended: true,
          nutritionMatch: 87
        }
      ]
    },
    {
      id: "6",
      name: "Pure Energy Bar",
      cuisine: "Juice & Smoothies",
      rating: 4.6,
      deliveryTime: "15-25 min",
      distance: "1.2 km",
      image: pureEnergyBar,
      isPartner: true,
      healthScore: 96,
      priceRange: "₹₹",
      menu: [
        {
          id: "17",
          name: "Green Machine Smoothie",
          description: "Kale, spinach, apple, ginger, and coconut water",
          price: 200,
          calories: 180,
          category: "Detox Delights",
          image: greenSmoothieBowl,
          isRecommended: true,
          nutritionMatch: 95
        },
        {
          id: "18",
          name: "Protein Power Smoothie",
          description: "Berries, banana, protein powder, and almond milk",
          price: 250,
          calories: 320,
          category: "Muscle Fuel",
          image: proteinSmoothieBowl,
          isRecommended: true,
          nutritionMatch: 93
        },
        {
          id: "19",
          name: "Acai Wonder Bowl",
          description: "Acai, granola, fresh fruits, and coconut flakes",
          price: 320,
          calories: 380,
          category: "Superfood Bowls",
          image: proteinSmoothieBowl,
          isRecommended: true,
          nutritionMatch: 89
        }
      ]
    },
    {
      id: "7",
      name: "Zen Bowl House",
      cuisine: "Asian Fusion",
      rating: 4.5,
      deliveryTime: "30-40 min",
      distance: "2.8 km",
      image: zenBowlHouse,
      isPartner: true,
      healthScore: 87,
      priceRange: "₹₹",
      menu: [
        {
          id: "20",
          name: "Hawaiian Poke Bowl",
          description: "Fresh tuna, brown rice, avocado, and sesame dressing",
          price: 450,
          calories: 520,
          category: "Zen Bowls",
          image: pokeBowl,
          isRecommended: true,
          nutritionMatch: 91
        },
        {
          id: "21",
          name: "Buddha's Blessing Bowl",
          description: "Tofu, vegetables, quinoa, and miso dressing",
          price: 380,
          calories: 420,
          category: "Mindful Meals",
          image: buddhaBowl,
          isRecommended: true,
          nutritionMatch: 88
        },
        {
          id: "22",
          name: "Teriyaki Salmon Bowl",
          description: "Grilled salmon, brown rice, and steamed vegetables",
          price: 420,
          calories: 480,
          category: "Protein Paradise",
          image: grilledSalmon,
          isRecommended: true,
          nutritionMatch: 92
        }
      ]
    },
    {
      id: "8",
      name: "Bella Vita Trattoria",
      cuisine: "Italian",
      rating: 4.3,
      deliveryTime: "35-45 min",
      distance: "3.5 km",
      image: bellaVitaTrattoria,
      isPartner: false,
      healthScore: 76,
      priceRange: "₹₹₹",
      menu: [
        {
          id: "23",
          name: "Zucchini Noodles Primavera",
          description: "Spiralized zucchini with fresh vegetables and herb sauce",
          price: 320,
          calories: 280,
          category: "Healthy Italian",
          image: zucchiniNoodles,
          isRecommended: true,
          nutritionMatch: 85
        },
        {
          id: "24",
          name: "Grilled Chicken Caprese",
          description: "Grilled chicken with tomatoes, mozzarella, and basil",
          price: 380,
          calories: 420,
          category: "Light & Fresh",
          image: chickenWrap,
          isRecommended: true,
          nutritionMatch: 80
        },
        {
          id: "25",
          name: "Quinoa Risotto",
          description: "Creamy quinoa with mushrooms and herbs",
          price: 350,
          calories: 380,
          category: "Guilt-Free Classics",
          image: quinoaPowerBowl,
          isRecommended: false,
          nutritionMatch: 78
        }
      ]
    },
    {
      id: "9",
      name: "Fresh Amigos",
      cuisine: "Mexican",
      rating: 4.4,
      deliveryTime: "25-35 min",
      distance: "2.7 km",
      image: freshAmigos,
      isPartner: true,
      healthScore: 84,
      priceRange: "₹₹",
      menu: [
        {
          id: "26",
          name: "Quinoa Burrito Bowl",
          description: "Quinoa, black beans, vegetables, avocado, and salsa",
          price: 340,
          calories: 450,
          category: "Fiesta Bowls",
          image: quinoaBurritoBowl,
          isRecommended: true,
          nutritionMatch: 89
        },
        {
          id: "27",
          name: "Grilled Fish Tacos",
          description: "Fresh fish, cabbage slaw, and lime crema",
          price: 320,
          calories: 380,
          category: "Clean & Lean",
          image: chickenWrap,
          isRecommended: true,
          nutritionMatch: 86
        },
        {
          id: "28",
          name: "Mexican Quinoa Salad",
          description: "Quinoa, corn, beans, peppers, and cilantro dressing",
          price: 290,
          calories: 350,
          category: "Healthy Fiesta",
          image: greekSalad,
          isRecommended: true,
          nutritionMatch: 88
        }
      ]
    },
    {
      id: "10",
      name: "Plant Paradise",
      cuisine: "Vegan",
      rating: 4.7,
      deliveryTime: "30-40 min",
      distance: "2.3 km",
      image: plantParadise,
      isPartner: true,
      healthScore: 98,
      priceRange: "₹₹",
      menu: [
        {
          id: "29",
          name: "Rainbow Buddha Bowl",
          description: "Colorful vegetables, chickpeas, quinoa, and tahini dressing",
          price: 320,
          calories: 380,
          category: "Plant Power Bowls",
          image: buddhaBowl,
          isRecommended: true,
          nutritionMatch: 97
        },
        {
          id: "30",
          name: "Green Goddess Smoothie",
          description: "Spinach, mango, coconut, and plant protein",
          price: 250,
          calories: 280,
          category: "Wellness Wonders",
          image: greenSmoothieBowl,
          isRecommended: true,
          nutritionMatch: 95
        },
        {
          id: "31",
          name: "Chickpea Curry Bowl",
          description: "Spiced chickpeas with brown rice and vegetables",
          price: 290,
          calories: 420,
          category: "Comfort Classics",
          image: dalTadka,
          isRecommended: true,
          nutritionMatch: 92
        },
        {
          id: "32",
          name: "Avocado Toast Deluxe",
          description: "Whole grain bread, smashed avocado, and superfood toppings",
          price: 220,
          calories: 320,
          category: "Plant Paradise Favorites",
          image: chickenWrap,
          isRecommended: true,
          nutritionMatch: 90
        }
      ]
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "all" || restaurant.cuisine.toLowerCase() === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [menuItem.id]: (prev[menuItem.id] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: `${menuItem.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[menuItemId] > 1) {
        newCart[menuItemId]--;
      } else {
        delete newCart[menuItemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  if (selectedRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Restaurant Header */}
          <Card className="shadow-health mb-8">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img 
                src={selectedRestaurant.image} 
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{selectedRestaurant.name}</h1>
                  {selectedRestaurant.isPartner && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Award className="h-3 w-3 mr-1" />
                      Partner
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedRestaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedRestaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedRestaurant.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="h-4 w-4" />
                    <span>Health Score: {selectedRestaurant.healthScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedRestaurant(null)}
                className="mb-4"
              >
                ← Back to Restaurants
              </Button>
            </CardContent>
          </Card>

          {/* Menu */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-health">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                    Recommended for Your Diet Plan
                  </CardTitle>
                  <CardDescription>
                    These items match your nutritional goals and dietary requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRestaurant.menu.map((item) => (
                      <Card key={item.id} className={`border-2 ${item.isRecommended ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                {item.isRecommended && (
                                  <Badge variant="default" className="text-xs">
                                    {item.nutritionMatch}% Match
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-3">{item.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ₹{item.price}
                                </span>
                                <span>{item.calories} cal</span>
                                <Badge variant="outline">{item.category}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {cart[item.id] && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="font-medium">{cart[item.id]}</span>
                                </div>
                              )}
                              <Button
                                size="sm"
                                onClick={() => addToCart(item)}
                                className="shadow-health"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart Summary */}
            <div>
              <Card className="shadow-health sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                    Your Order ({getTotalItems()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getTotalItems() === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedRestaurant.menu.map((item) => {
                        const quantity = cart[item.id];
                        if (!quantity) return null;
                        return (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price} × {quantity}</p>
                            </div>
                            <p className="font-medium">₹{item.price * quantity}</p>
                          </div>
                        );
                      })}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Total:</span>
                          <span>₹{selectedRestaurant.menu.reduce((total, item) => {
                            const quantity = cart[item.id] || 0;
                            return total + (item.price * quantity);
                          }, 0)}</span>
                        </div>
                      </div>
                      <Button className="w-full shadow-health" size="lg">
                        Proceed to Checkout
                      </Button>
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

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-primary">Healthy</span> Restaurants Near You
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover restaurants that match your diet plan and health goals
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-health mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search restaurants or cuisines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="continental">Continental</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="farm fresh">Farm Fresh</SelectItem>
                    <SelectItem value="juice & smoothies">Juice & Smoothies</SelectItem>
                    <SelectItem value="asian fusion">Asian Fusion</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              className="shadow-health hover:shadow-glow transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
                <div className="absolute top-4 left-4">
                  {restaurant.isPartner && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Award className="h-3 w-3 mr-1" />
                      Partner
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">
                    <Leaf className="h-3 w-3 mr-1" />
                    {restaurant.healthScore}%
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <span className="text-muted-foreground">{restaurant.priceRange}</span>
                </div>
                
                <p className="text-muted-foreground mb-4">{restaurant.cuisine}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 shadow-health">
                  View Menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;