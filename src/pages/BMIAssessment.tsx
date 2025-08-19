import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  User,
  Target,
  FileText,
  Zap,
  Activity,
  Calendar,
  Weight,
  Ruler,
  Heart
} from "lucide-react";

const BMIAssessment = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    goal: "",
    dietaryPreference: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: ""
  });
  const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
  const [showDietPlan, setShowDietPlan] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMedicalFiles(Array.from(event.target.files));
    }
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      return (weightInKg / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
    return { category: "Obese", color: "text-red-600" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'age', 'height', 'weight', 'gender', 'goal', 'dietaryPreference'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate AI processing
    toast({
      title: "Generating Your Diet Plan",
      description: "Our AI is analyzing your health data...",
    });

    setTimeout(() => {
      setShowDietPlan(true);
      toast({
        title: "Diet Plan Ready!",
        description: "Your personalized diet plan has been generated.",
      });
    }, 2000);
  };

  const bmi = calculateBMI();
  const bmiData = bmi ? getBMICategory(parseFloat(bmi)) : null;

  if (showDietPlan) {
    return (
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-health">
            <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-2xl lg:text-3xl flex items-center justify-center">
                <Zap className="h-6 w-6 mr-2" />
                Your Personalized Diet Plan
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Based on your health assessment and medical information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {/* Health Summary */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-primary" />
                      Health Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>BMI:</span>
                        <span className={bmiData?.color}>{bmi} ({bmiData?.category})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Goal:</span>
                        <span className="text-primary">{formData.goal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Activity Level:</span>
                        <span>{formData.activityLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diet Type:</span>
                        <span className="text-primary capitalize">{formData.dietaryPreference}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-5 w-5 mr-2 text-primary" />
                      Daily Targets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="text-primary">1800 kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span>120g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water:</span>
                        <span>3L</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Meal Plan */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                    Today's Meal Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Breakfast</h4>
                      <p className="text-sm">
                        {formData.dietaryPreference === 'vegetarian' || formData.dietaryPreference === 'vegan' 
                          ? 'Oatmeal with berries and nuts' 
                          : 'Scrambled eggs with whole grain toast'}
                      </p>
                      <Badge variant="secondary" className="mt-2">350 kcal</Badge>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Lunch</h4>
                      <p className="text-sm">
                        {formData.dietaryPreference === 'vegetarian' 
                          ? 'Paneer tikka with quinoa salad'
                          : formData.dietaryPreference === 'vegan'
                          ? 'Chickpea curry with brown rice'
                          : 'Grilled chicken salad with quinoa'}
                      </p>
                      <Badge variant="secondary" className="mt-2">450 kcal</Badge>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Snack</h4>
                      <p className="text-sm">
                        {formData.dietaryPreference === 'vegan'
                          ? 'Almond yogurt with fruits'
                          : 'Greek yogurt with fruits'}
                      </p>
                      <Badge variant="secondary" className="mt-2">200 kcal</Badge>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Dinner</h4>
                      <p className="text-sm">
                        {formData.dietaryPreference === 'vegetarian'
                          ? 'Grilled tofu with roasted vegetables'
                          : formData.dietaryPreference === 'vegan'
                          ? 'Lentil curry with steamed broccoli'
                          : 'Baked salmon with vegetables'}
                      </p>
                      <Badge variant="secondary" className="mt-2">400 kcal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <p className="text-sm">Based on your goal to lose weight, focus on portion control and regular exercise.</p>
                    </div>
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm">Consider increasing your water intake to 3-4 liters per day for better metabolism.</p>
                    </div>
                    {formData.medicalConditions && (
                      <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                        <p className="text-sm">Note: Your medical conditions have been considered in this plan. Consult with a nutritionist for detailed guidance.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="shadow-health">
                  <a href="/restaurants">Find Recommended Restaurants</a>
                </Button>
                <Button variant="outline" onClick={() => setShowDietPlan(false)}>
                  Modify Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Complete Your <span className="text-primary">Health Assessment</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Tell us about yourself to get a personalized diet plan powered by AI
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Personal Information */}
            <Card className="shadow-health">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic details about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      min="16"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Gender *</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Dietary Preference *</Label>
                  <RadioGroup
                    value={formData.dietaryPreference}
                    onValueChange={(value) => handleInputChange('dietaryPreference', value)}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="vegetarian" />
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-vegetarian" id="non-vegetarian" />
                      <Label htmlFor="non-vegetarian">Non-Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegan" id="vegan" />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Physical Measurements */}
            <Card className="shadow-health">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ruler className="h-5 w-5 mr-2 text-primary" />
                  Physical Measurements
                </CardTitle>
                <CardDescription>Your current height and weight</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="e.g., 170"
                      min="100"
                      max="250"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="e.g., 70.5"
                      min="30"
                      max="300"
                      required
                    />
                  </div>
                </div>

                {bmi && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Your BMI:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{bmi}</span>
                        <div className={`text-sm ${bmiData?.color}`}>{bmiData?.category}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Goals & Activity */}
            <Card className="shadow-health">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Goals & Activity Level
                </CardTitle>
                <CardDescription>What do you want to achieve?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goal">Primary Goal *</Label>
                  <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose-weight">Lose Weight</SelectItem>
                      <SelectItem value="gain-weight">Gain Weight</SelectItem>
                      <SelectItem value="maintain-weight">Maintain Weight</SelectItem>
                      <SelectItem value="build-muscle">Build Muscle</SelectItem>
                      <SelectItem value="improve-health">Improve Overall Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                      <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very">Very active (hard exercise 6-7 days/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="shadow-health">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Medical Information
                </CardTitle>
                <CardDescription>Help us understand your health conditions (optional but recommended)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="medical-files">Upload Medical Certificates</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-primary" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG files only</p>
                      </div>
                      <input
                        id="medical-files"
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {medicalFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Uploaded files:</p>
                      <div className="space-y-1">
                        {medicalFiles.map((file, index) => (
                          <Badge key={index} variant="secondary">
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="conditions">Medical Conditions</Label>
                  <Textarea
                    id="conditions"
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    placeholder="List any medical conditions you have (e.g., diabetes, hypertension, thyroid issues)"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Food Allergies/Intolerances</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="List any food allergies or intolerances"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    placeholder="List any medications you are currently taking"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button type="submit" size="lg" className="shadow-health">
              <Zap className="mr-2 h-5 w-5" />
              Generate My Diet Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BMIAssessment;