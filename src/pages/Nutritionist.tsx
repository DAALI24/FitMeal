import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Stethoscope, UserCheck } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "nutritionist";
  timestamp: Date;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  responses: string[];
}

const Nutritionist = () => {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      specialty: "Weight Management & Metabolism",
      experience: "12 years experience",
      responses: [
        "That's a great question! Based on your health profile, I'd recommend focusing on lean proteins and complex carbohydrates.",
        "For weight management, portion control is key. Try using smaller plates and eating slowly to recognize satiety cues.",
        "Excellent! Adding more vegetables to your diet will provide essential vitamins and minerals. Aim for colorful variety.",
        "Hydration is crucial for metabolism. Try to drink at least 8 glasses of water daily, more if you're active.",
        "I understand your concerns about meal planning. Start with preparing just 2-3 meals per week to build the habit.",
        "That's normal! Cravings often indicate nutritional needs. Try having a balanced snack with protein and healthy fats.",
        "Great progress! Consistency is more important than perfection. Small sustainable changes lead to lasting results.",
        "For better energy levels, try eating balanced meals every 3-4 hours and avoid skipping breakfast.",
        "I recommend incorporating omega-3 rich foods like salmon, walnuts, and chia seeds for heart and brain health.",
        "Remember, everyone's journey is unique. Focus on how you feel rather than just the numbers on the scale."
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Sports Nutrition & Performance",
      experience: "8 years experience",
      responses: [
        "For optimal athletic performance, timing your nutrition around workouts is crucial. What's your training schedule?",
        "Pre-workout meals should be rich in carbs and moderate in protein, consumed 2-3 hours before training.",
        "Post-workout nutrition is vital for recovery. Aim for a 3:1 or 4:1 carb-to-protein ratio within 30 minutes.",
        "Hydration during exercise is key. For sessions over an hour, consider electrolyte replacement drinks.",
        "Creatine supplementation can enhance strength and power output in high-intensity activities.",
        "Don't neglect micronutrients - iron, B vitamins, and antioxidants support energy production and recovery.",
        "Periodizing your nutrition based on training phases can maximize both performance and body composition.",
        "Quality sleep and nutrition go hand in hand for athletic recovery and hormone optimization.",
        "Consider working with a sports dietitian for personalized meal timing and supplementation strategies.",
        "Remember, consistency in nutrition habits often trumps perfection in achieving long-term athletic goals."
      ]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Plant-Based & Digestive Health",
      experience: "10 years experience",
      responses: [
        "Plant-based diets can provide all essential nutrients when well-planned. Let's ensure you're getting complete proteins.",
        "Fiber is crucial for gut health. Aim for 25-35g daily from fruits, vegetables, legumes, and whole grains.",
        "B12 supplementation is essential for vegans and important for vegetarians. Have you checked your levels?",
        "Fermented foods like kimchi, sauerkraut, and kefir support beneficial gut bacteria and digestion.",
        "Iron absorption from plants is enhanced by vitamin C. Pair spinach with citrus or bell peppers.",
        "Digestive issues can often be managed through elimination diets and gradual food reintroduction.",
        "Prebiotics feed beneficial gut bacteria. Include foods like garlic, onions, Jerusalem artichokes, and oats.",
        "Anti-inflammatory foods like turmeric, ginger, and leafy greens can help reduce digestive inflammation.",
        "Mindful eating practices - chewing thoroughly and eating slowly - can significantly improve digestion.",
        "The gut-brain connection is real. Managing stress through nutrition and lifestyle can improve digestive health."
      ]
    },
    {
      id: 4,
      name: "Dr. James Thompson",
      specialty: "Diabetes & Heart Health",
      experience: "15 years experience",
      responses: [
        "Blood sugar management is about consistent meal timing and balanced macronutrients. How's your current routine?",
        "The Mediterranean diet pattern has strong evidence for heart health and diabetes prevention.",
        "Portion control using the plate method works well: half vegetables, quarter protein, quarter complex carbs.",
        "Regular blood glucose monitoring helps identify which foods affect your levels most significantly.",
        "Omega-3 fatty acids from fish, flax, and walnuts support heart health and may improve insulin sensitivity.",
        "Soluble fiber from oats, beans, and apples can help lower cholesterol and stabilize blood sugar.",
        "Limiting processed foods and added sugars is one of the most impactful changes for metabolic health.",
        "Regular physical activity improves insulin sensitivity and cardiovascular health alongside proper nutrition.",
        "Stress management is crucial as cortisol can affect blood sugar levels and heart health.",
        "Consistent meal timing helps regulate insulin response and can improve long-term glucose control."
      ]
    },
    {
      id: 5,
      name: "Dr. Lisa Park",
      specialty: "Women's Health & Hormones",
      experience: "11 years experience",
      responses: [
        "Hormonal health is closely tied to nutrition. Let's discuss how your current diet supports hormone balance.",
        "Iron needs increase during menstruation. Include lean meats, spinach, lentils, and pair with vitamin C.",
        "Calcium and vitamin D are crucial throughout life stages. Are you getting adequate sunlight and dairy/alternatives?",
        "During pregnancy, folate requirements increase significantly. Dark leafy greens and fortified grains help.",
        "PCOS management benefits from balanced blood sugar through low-glycemic foods and regular meals.",
        "Menopause brings changing nutritional needs. Phytoestrogen-rich foods like soy may help with symptoms.",
        "Healthy fats support hormone production. Include avocados, nuts, seeds, and fatty fish in your diet.",
        "Stress eating is common but managing cortisol through nutrition and lifestyle supports overall hormone health.",
        "Bone health becomes increasingly important with age. Weight-bearing exercise plus nutrition work together.",
        "Each woman's nutritional needs are unique based on life stage, activity level, and health history."
      ]
    }
  ];

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(doctors[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);

  // Initialize messages when doctor changes
  const initializeChat = (doctor: Doctor) => {
    setMessages([
      {
        id: 1,
        text: `Hello! I'm ${doctor.name}, specializing in ${doctor.specialty}. How can I help you today?`,
        sender: "nutritionist",
        timestamp: new Date(),
      },
    ]);
    setResponseIndex(0);
  };

  // Initialize chat on component mount
  useEffect(() => {
    initializeChat(selectedDoctor);
  }, []);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    initializeChat(doctor);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add nutritionist response after a short delay
    setTimeout(() => {
      const nutritionistMessage: Message = {
        id: messages.length + 2,
        text: selectedDoctor.responses[responseIndex % selectedDoctor.responses.length],
        sender: "nutritionist",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, nutritionistMessage]);
      setResponseIndex(prev => (prev + 1) % selectedDoctor.responses.length);
    }, 1000);

    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Nutritionist Consultation
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a specialist and get personalized nutritional advice
          </p>
        </div>

        {/* Doctor Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Your Nutritionist</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedDoctor.id === doctor.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{doctor.name}</h3>
                      <p className="text-xs text-muted-foreground">{doctor.experience}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">{selectedDoctor.name}</div>
                <div className="text-sm text-muted-foreground">{selectedDoctor.specialty} • Online</div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.sender === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Stethoscope className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-3">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This is a demo consultation. For real appointments, upgrade to our paid plans.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center">
            <h3 className="font-semibold mb-2">Diet Plan Review</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get your current diet plan reviewed by our expert
            </p>
            <Button variant="outline" size="sm">
              Schedule Review
            </Button>
          </Card>

          <Card className="p-4 text-center">
            <h3 className="font-semibold mb-2">Meal Planning</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create personalized meal plans for your goals
            </p>
            <Button variant="outline" size="sm">
              Start Planning
            </Button>
          </Card>

          <Card className="p-4 text-center">
            <h3 className="font-semibold mb-2">Health Assessment</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Complete health evaluation and recommendations
            </p>
            <Button variant="outline" size="sm">
              Begin Assessment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Nutritionist;