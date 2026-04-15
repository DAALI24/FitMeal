import heroBackground from "@/assets/hero-background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Bot,
  Users,
  Shield,
  Utensils,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Trophy,
  Dumbbell,
  CloudLightning,
  IndianRupee,
  Heart,
  TrendingUp,
  Activity,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Bot,
    title: "AI-Powered Diet Plans",
    description: "Personalized meal plans based on your health conditions, BMI, and fitness goals",
    color: "bg-primary/10 text-primary",
    link: "/bmi-assessment",
  },
  {
    icon: Shield,
    title: "Medical Integration",
    description: "Upload medical certificates and conditions for hyper-accurate recommendations",
    color: "bg-blue-100 text-blue-600",
    link: "/bmi-assessment",
  },
  {
    icon: Utensils,
    title: "Restaurant & Cloud Kitchens",
    description: "Order from 10+ partner restaurants or 3 exclusive delivery-only cloud kitchens",
    color: "bg-orange-100 text-orange-600",
    link: "/restaurants",
  },
  {
    icon: Users,
    title: "Expert Nutritionists",
    description: "Chat and video-consult with certified nutritionists for professional guidance",
    color: "bg-teal-100 text-teal-600",
    link: "/nutritionist",
  },
  {
    icon: Dumbbell,
    title: "Certified Gym Coaches",
    description: "Browse 8+ verified instructors filtered by specialty, gender & experience",
    color: "bg-purple-100 text-purple-600",
    link: "/gym-instructors",
  },
  {
    icon: CloudLightning,
    title: "Cloud Kitchens",
    description: "Macro-tracked, delivery-only kitchens open late. Keto, bulk, weight-loss menus",
    color: "bg-rose-100 text-rose-600",
    link: "/restaurants",
  },
];

const stats = [
  { value: "50,000+", label: "Active Users", icon: Users },
  { value: "98%",     label: "Satisfaction Rate", icon: Star },
  { value: "10+",     label: "Partner Restaurants", icon: Utensils },
  { value: "8+",      label: "Expert Coaches", icon: Dumbbell },
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    description: "Everything you need to get started",
    features: [
      "AI-generated personalized diet plans",
      "Basic health assessment",
      "Restaurant & cloud kitchen access",
      "Food ordering + order tracking",
      "Browse gym instructors",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    gradient: "",
  },
  {
    name: "Premium",
    price: "₹1,000",
    period: "/3 months",
    description: "Enhanced support with expert consultations",
    features: [
      "Everything in Free",
      "1 video call with certified nutritionist",
      "15 days text chat support",
      "1 gym instructor session included",
      "Priority customer support",
      "Advanced meal & macro tracking",
    ],
    buttonText: "Start Premium",
    buttonVariant: "default" as const,
    popular: true,
    gradient: "bg-gradient-primary",
  },
  {
    name: "Pro",
    price: "₹2,999",
    period: "/3 months",
    description: "Complete health solution, priority access",
    features: [
      "Everything in Premium",
      "Priority in-person nutritionist appointments",
      "3 nutritionist sessions included",
      "3 gym instructor sessions included",
      "Unlimited AI consultations",
      "Custom meal & workout planning",
      "₹1,000/session after initial 3",
    ],
    buttonText: "Go Pro",
    buttonVariant: "default" as const,
    popular: false,
    gradient: "",
  },
];

const testimonials = [
  {
    name: "Kavya R.",
    role: "Lost 12 kg in 4 months",
    quote: "FitMeal's AI diet plan combined with the gym coach I booked through the platform completely changed my life. The cloud kitchen meals are genuinely delicious.",
    rating: 5,
    avatar: "K",
  },
  {
    name: "Aryan S.",
    role: "Competitive cyclist",
    quote: "The macro tracking in the restaurant menus is incredible. I can finally order food knowing exactly what I'm eating. The nutritionist chat feature is a game-changer.",
    rating: 5,
    avatar: "A",
  },
  {
    name: "Preethi M.",
    role: "Managing PCOS",
    quote: "Being able to upload my medical reports and get an AI plan tailored to PCOS is something I've never seen before. The Tiffin Box cloud kitchen is my weekly staple now.",
    rating: 5,
    avatar: "P",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const Landing = () => (
  <div className="min-h-screen">
    {/* ── Hero ─────────────────────────────────────────────────────────── */}
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/85" />
      </div>

      {/* Floating decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 animate-float hidden lg:block" />
      <div className="absolute bottom-20 right-16 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 animate-float hidden lg:block" style={{ animationDelay: "1s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Zap className="h-4 w-4 mr-2 text-yellow-300" />
            AI-Powered Nutrition + Fitness Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Health, Your Food,{" "}
            <span className="text-yellow-300">Perfectly Planned</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/85 mb-10 max-w-3xl mx-auto leading-relaxed">
            AI diet plans tailored to your medical conditions, expert nutritionists, certified gym coaches, cloud kitchens — and now pay seamlessly with Razorpay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow font-semibold text-base h-12 px-8">
              <Link to="/bmi-assessment">
                Start Your Health Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 h-12 px-8">
              <Link to="/gym-instructors">
                <Dumbbell className="mr-2 h-5 w-5" />
                Find a Coach
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats strip ──────────────────────────────────────────────────── */}
    <section className="bg-gradient-primary py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-6 w-6 text-white/70" />
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-sm text-white/75">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ─────────────────────────────────────────────────────── */}
    <section id="features" className="py-20 bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything for <span className="text-primary">Healthy Living</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One platform combining AI technology, medical expertise, certified coaches, and food delivery.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, link }) => (
            <Link key={title} to={link}>
              <Card className="group card-lift h-full border-2 hover:border-primary/40 shadow-card hover:shadow-health transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ── How it works ─────────────────────────────────────────────────── */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How <span className="text-primary">FitMeal</span> Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Four simple steps to a healthier you</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-primary opacity-30" />
          {[
            { n: "1", title: "Complete Health Assessment", desc: "Enter your BMI, upload medical certificates, set your goals", icon: Activity },
            { n: "2", title: "Get Your AI Plan",            desc: "Our AI creates a personalized diet and workout plan tailored to you", icon: Bot },
            { n: "3", title: "Find Your Team",              desc: "Book a nutritionist or gym coach — online or in-person", icon: Users },
            { n: "4", title: "Order & Track",               desc: "Order macro-tracked meals and monitor your progress daily", icon: TrendingUp },
          ].map(({ n, title, desc, icon: Icon }) => (
            <div key={n} className="text-center relative">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-health relative z-10">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-xs font-bold text-primary mb-2">STEP {n}</div>
              <h3 className="text-base font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Gym coaches preview ───────────────────────────────────────────── */}
    <section className="py-20 bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-fitness/10 text-fitness rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Dumbbell className="h-4 w-4" />
            New Feature
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Meet Your <span className="text-gradient-fitness">Fitness Coaches</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            8 verified instructors covering everything from CrossFit to Yoga. Filter by gender, speciality, and experience. Book and pay in seconds.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { name: "Arjun Sharma", specialty: "CrossFit & Weight Training", exp: "8 years", price: "₹800/session", gender: "Male", badge: "bg-blue-500" },
            { name: "Priya Mehta", specialty: "Yoga & Pilates", exp: "5 years", price: "₹600/session", gender: "Female", badge: "bg-pink-500" },
            { name: "Karan Malhotra", specialty: "CrossFit & Sports Nutrition", exp: "14 years", price: "₹1,200/session", gender: "Male", badge: "bg-blue-500" },
          ].map((coach) => (
            <Card key={coach.name} className="group card-lift shadow-card hover:shadow-fitness border-border hover:border-fitness/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-fitness rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {coach.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{coach.name}</h3>
                    <p className="text-xs text-muted-foreground">{coach.exp} experience</p>
                  </div>
                  <span className={`ml-auto text-white text-xs px-2 py-0.5 rounded-full ${coach.badge}`}>{coach.gender}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{coach.specialty}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{coach.price}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-fitness text-white shadow-fitness">
            <Link to="/gym-instructors">
              Browse All Coaches
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>

    {/* ── Payment highlight ─────────────────────────────────────────────── */}
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-muted/50 border border-border rounded-2xl p-8 lg:p-12">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-health">
            <IndianRupee className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Secure Payments via Razorpay</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Pay for restaurant orders and gym coaching sessions seamlessly using Razorpay — UPI, cards, net banking, wallets all supported.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallets"].map((method) => (
              <span key={method} className="flex items-center gap-1.5 px-4 py-2 bg-background border border-border rounded-full text-sm font-medium">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── Testimonials ─────────────────────────────────────────────────── */}
    <section className="py-20 bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Loved by <span className="text-primary">Health Seekers</span>
          </h2>
          <p className="text-muted-foreground">Real stories from real users</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="shadow-card border-border hover:shadow-health transition-all">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-primary">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* ── Pricing ──────────────────────────────────────────────────────── */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Health Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you want professional guidance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden shadow-card transition-all hover:-translate-y-1 ${
                plan.popular ? "border-primary border-2 shadow-health" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
              )}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-4 py-1 shadow-health">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8 pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-end justify-center gap-1 mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground pb-1">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.popular ? "shadow-health" : ""}`}
                >
                  <Link to="/bmi-assessment">{plan.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ──────────────────────────────────────────────────────────── */}
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(24_95%_53%/0.2),transparent_70%)]" />
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Health?
        </h2>
        <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
          Join 50,000+ users who have already started their journey to better health with our AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow font-semibold h-12 px-8">
            <Link to="/bmi-assessment">
              <Trophy className="mr-2 h-5 w-5" />
              Start Free Assessment
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 h-12 px-8">
            <Link to="/admin">
              Are you a Restaurant / Coach?
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  </div>
);

export default Landing;
