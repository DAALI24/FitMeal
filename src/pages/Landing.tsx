import heroBackground from "@/assets/hero-background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Bot,
  Video,
  Calendar,
  Users,
  Shield,
  Utensils,
  CheckCircle,
  Star,
  ArrowRight,
  Heart,
  Zap,
  Trophy
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Diet Plans",
      description: "Get personalized meal plans based on your health conditions and goals"
    },
    {
      icon: Shield,
      title: "Medical Integration",
      description: "Upload medical certificates and conditions for accurate recommendations"
    },
    {
      icon: Utensils,
      title: "Restaurant Partnerships",
      description: "Order healthy meals directly from recommended restaurants"
    },
    {
      icon: Users,
      title: "Expert Nutritionists",
      description: "Connect with certified nutritionists for professional guidance"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "",
      description: "Perfect for getting started with AI-powered nutrition",
      features: [
        "AI-generated personalized diet plans",
        "Basic health assessment",
        "Restaurant recommendations",
        "Food ordering platform",
        "Order tracking"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "₹1,000",
      period: "/3 months",
      description: "Enhanced support with nutritionist consultation",
      features: [
        "Everything in Free",
        "1 video call with certified nutritionist",
        "15 days text chat support",
        "Priority customer support",
        "Advanced meal tracking"
      ],
      buttonText: "Start Premium",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro",
      price: "₹2,999",
      period: "/3 months",
      description: "Complete nutrition solution with priority access",
      features: [
        "Everything in Premium",
        "Priority in-person appointments",
        "First 3 sessions included",
        "Unlimited AI consultations",
        "Custom meal planning",
        "₹1,000/session after initial 3"
      ],
      buttonText: "Go Pro",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Nutrition Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Your Health, Your Food,{" "}
              <span className="text-primary-glow">Perfectly Planned</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Get personalized diet plans based on your medical conditions, consult with certified nutritionists, 
              and order healthy meals from top restaurants - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
                <Link to="/bmi-assessment">
                  Start Your Health Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need for <span className="text-primary">Healthy Living</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines AI technology, medical expertise, and food delivery 
              to create the ultimate health and nutrition experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-health">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How <span className="text-primary">FitMeal</span> Works
          </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Health Assessment</h3>
              <p className="text-muted-foreground">
                Enter your BMI details, upload medical certificates, and set your health goals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI-Powered Plan</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your data and creates a personalized diet plan tailored to your needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Order & Track</h3>
              <p className="text-muted-foreground">
                Order recommended meals from partner restaurants and track your progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Health Plan</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From AI-powered free plans to premium nutritionist consultations, 
              we have the perfect solution for your health journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary border-2 shadow-health' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? 'shadow-health' : ''}`}
                  >
                    <Link to="/bmi-assessment">{plan.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who have already started their journey to better health with our AI-powered platform.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
            <Link to="/bmi-assessment">
              <Trophy className="mr-2 h-5 w-5" />
              Start Your Free Assessment
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;