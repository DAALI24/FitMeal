import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { GymInstructor, TrainingSpecialty } from "@/types";
import { sessionsApi, openRazorpayCheckout } from "@/lib/api";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Award,
  Dumbbell,
  Filter,
  CheckCircle,
  Video,
  Users,
  ChevronDown,
  Zap,
  BadgeCheck,
  Calendar,
  IndianRupee,
} from "lucide-react";

// ── Instructor data ───────────────────────────────────────────────────────────

const instructors: GymInstructor[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    gender: "male",
    age: 32,
    experienceYears: 8,
    specialties: ["Weight Training", "CrossFit", "Functional Fitness"],
    certifications: ["NSCA-CSCS", "ACE Personal Trainer", "CrossFit Level 2"],
    rating: 4.9,
    reviewCount: 312,
    pricePerSession: 800,
    priceMonthly: 5500,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&crop=face",
    bio: "Former national-level powerlifter turned coach. I specialize in strength & conditioning with a science-backed, injury-prevention-first approach. Helped 300+ clients achieve personal bests.",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    languages: ["Hindi", "English"],
    isVerified: true,
    gymName: "Iron Republic Gym",
    location: "Bandra, Mumbai",
  },
  {
    id: "2",
    name: "Priya Mehta",
    gender: "female",
    age: 28,
    experienceYears: 5,
    specialties: ["Yoga", "Pilates", "Zumba"],
    certifications: ["RYT-500 Yoga Alliance", "STOTT Pilates", "Zumba Instructor"],
    rating: 4.8,
    reviewCount: 218,
    pricePerSession: 600,
    priceMonthly: 4000,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&crop=face",
    bio: "Mindful movement specialist blending yoga philosophy with modern pilates. I create a calming, empowering space for all fitness levels — from absolute beginners to advanced practitioners.",
    availability: ["Mon", "Tue", "Thu", "Sat", "Sun"],
    languages: ["English", "Hindi", "Marathi"],
    isVerified: true,
    gymName: "Zenith Wellness Studio",
    location: "Andheri West, Mumbai",
  },
  {
    id: "3",
    name: "Rahul Verma",
    gender: "male",
    age: 35,
    experienceYears: 12,
    specialties: ["Cardio & HIIT", "Boxing", "Functional Fitness"],
    certifications: ["ACSM Certified", "Boxing India Coach", "NASM Performance Enhancement"],
    rating: 4.7,
    reviewCount: 489,
    pricePerSession: 900,
    priceMonthly: 6000,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&crop=face",
    bio: "12 years forging athletes and everyday warriors. My HIIT and boxing circuits melt fat, build explosive power, and are the most fun you'll have sweating. 0 boring sessions guaranteed.",
    availability: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    languages: ["Hindi", "English"],
    isVerified: true,
    gymName: "Knockout Fitness Hub",
    location: "Connaught Place, Delhi",
  },
  {
    id: "4",
    name: "Sneha Kapoor",
    gender: "female",
    age: 30,
    experienceYears: 7,
    specialties: ["Weight Training", "Sports Nutrition", "Functional Fitness"],
    certifications: ["ISSA Certified Trainer", "Precision Nutrition Level 1", "FMS Specialist"],
    rating: 4.9,
    reviewCount: 267,
    pricePerSession: 750,
    priceMonthly: 5000,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face",
    bio: "I combine evidence-based strength training with nutrition coaching for holistic body transformation. Specialise in female physiology, postpartum recovery, and PCOS fitness management.",
    availability: ["Mon", "Wed", "Fri"],
    languages: ["English", "Hindi", "Punjabi"],
    isVerified: true,
    gymName: "FitHer Wellness Centre",
    location: "Koramangala, Bangalore",
  },
  {
    id: "5",
    name: "Vikram Singh",
    gender: "male",
    age: 27,
    experienceYears: 3,
    specialties: ["Calisthenics", "Yoga", "Cardio & HIIT"],
    certifications: ["ACE Personal Trainer", "Yoga Vidya 200-hr"],
    rating: 4.6,
    reviewCount: 94,
    pricePerSession: 500,
    priceMonthly: 3200,
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop&crop=face",
    bio: "Passionate about minimalist training — no equipment, maximum results. My calisthenics programs build real-world strength and mobility you can use everywhere.",
    availability: ["Mon", "Tue", "Thu", "Sun"],
    languages: ["English", "Hindi"],
    isVerified: false,
    gymName: "Urban Athletics Club",
    location: "Powai, Mumbai",
  },
  {
    id: "6",
    name: "Ananya Rao",
    gender: "female",
    age: 33,
    experienceYears: 9,
    specialties: ["Pilates", "Zumba", "Cardio & HIIT"],
    certifications: ["Peak Pilates Faculty", "Zumba Education Specialist", "ACSM Exercise Physiologist"],
    rating: 4.8,
    reviewCount: 341,
    pricePerSession: 700,
    priceMonthly: 4800,
    image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&h=400&fit=crop&crop=face",
    bio: "Dance your way to fitness! My Zumba sessions are cardio parties, while my clinical pilates program is trusted by physiotherapists for rehabilitation and core rebuilding.",
    availability: ["Tue", "Wed", "Fri", "Sat", "Sun"],
    languages: ["Telugu", "English", "Hindi"],
    isVerified: true,
    gymName: "Dance & Flow Studio",
    location: "Jubilee Hills, Hyderabad",
  },
  {
    id: "7",
    name: "Karan Malhotra",
    gender: "male",
    age: 38,
    experienceYears: 14,
    specialties: ["CrossFit", "Weight Training", "Sports Nutrition"],
    certifications: ["CrossFit Level 3 Trainer", "NSCA-CSCS", "Precision Nutrition Level 2"],
    rating: 5.0,
    reviewCount: 156,
    pricePerSession: 1200,
    priceMonthly: 8000,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop&crop=face",
    bio: "Elite CrossFit coach and competitive athlete. I've trained Olympians and complete beginners with the same intensity. My programming is periodized, precise, and produces visible results in 6 weeks.",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    languages: ["English", "Hindi"],
    isVerified: true,
    gymName: "Elite Performance Centre",
    location: "DLF Phase 4, Gurgaon",
  },
  {
    id: "8",
    name: "Divya Nair",
    gender: "female",
    age: 26,
    experienceYears: 4,
    specialties: ["Yoga", "Zumba", "Cardio & HIIT"],
    certifications: ["RYT-200 Yoga Alliance", "Zumba B1", "ACE Group Fitness"],
    rating: 4.7,
    reviewCount: 132,
    pricePerSession: 450,
    priceMonthly: 2800,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face",
    bio: "Affordable, energetic, and beginner-friendly. I love making fitness accessible and fun for everyone, especially those who think working out is boring or too hard.",
    availability: ["Mon", "Tue", "Thu", "Sat", "Sun"],
    languages: ["Malayalam", "Tamil", "English", "Hindi"],
    isVerified: true,
    gymName: "Flex & Flow Fitness",
    location: "Indiranagar, Bangalore",
  },
];

// ── Helper components ─────────────────────────────────────────────────────────

const SPECIALTY_COLORS: Record<string, string> = {
  "Weight Training":    "bg-orange-100 text-orange-700 border-orange-200",
  "Yoga":               "bg-purple-100 text-purple-700 border-purple-200",
  "CrossFit":           "bg-red-100 text-red-700 border-red-200",
  "Cardio & HIIT":      "bg-pink-100 text-pink-700 border-pink-200",
  "Pilates":            "bg-teal-100 text-teal-700 border-teal-200",
  "Zumba":              "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Boxing":             "bg-slate-100 text-slate-700 border-slate-200",
  "Calisthenics":       "bg-blue-100 text-blue-700 border-blue-200",
  "Functional Fitness": "bg-green-100 text-green-700 border-green-200",
  "Sports Nutrition":   "bg-indigo-100 text-indigo-700 border-indigo-200",
};

function SpecialtyBadge({ label }: { label: string }) {
  const cls = SPECIALTY_COLORS[label] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const GymInstructors = () => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm]       = useState("");
  const [genderFilter, setGenderFilter]   = useState<"all" | "male" | "female">("all");
  const [expFilter, setExpFilter]         = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortBy, setSortBy]               = useState("rating");
  const [selected, setSelected]           = useState<GymInstructor | null>(null);
  const [bookingOpen, setBookingOpen]     = useState(false);
  const [bookingType, setBookingType]     = useState<"session" | "monthly">("session");
  const [sessionMode, setSessionMode]     = useState<"online" | "in-person">("online");
  const [paying, setPaying]               = useState(false);

  const allSpecialties = useMemo(
    () => Array.from(new Set(instructors.flatMap((i) => i.specialties))).sort(),
    []
  );

  const filtered = useMemo(() => {
    let list = [...instructors];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.specialties.some((s) => s.toLowerCase().includes(q)) ||
          i.gymName.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }
    if (genderFilter !== "all") list = list.filter((i) => i.gender === genderFilter);
    if (specialtyFilter !== "all") list = list.filter((i) => i.specialties.includes(specialtyFilter as TrainingSpecialty));
    if (expFilter !== "all") {
      list = list.filter((i) => {
        if (expFilter === "0-3")  return i.experienceYears <= 3;
        if (expFilter === "4-7")  return i.experienceYears >= 4 && i.experienceYears <= 7;
        if (expFilter === "8-12") return i.experienceYears >= 8 && i.experienceYears <= 12;
        if (expFilter === "13+")  return i.experienceYears >= 13;
        return true;
      });
    }

    list.sort((a, b) => {
      if (sortBy === "rating")       return b.rating - a.rating;
      if (sortBy === "price_asc")    return a.pricePerSession - b.pricePerSession;
      if (sortBy === "price_desc")   return b.pricePerSession - a.pricePerSession;
      if (sortBy === "experience")   return b.experienceYears - a.experienceYears;
      if (sortBy === "reviews")      return b.reviewCount - a.reviewCount;
      return 0;
    });

    return list;
  }, [searchTerm, genderFilter, expFilter, specialtyFilter, sortBy]);

  const bookingPrice = selected
    ? bookingType === "session"
      ? selected.pricePerSession
      : selected.priceMonthly
    : 0;

  const handleBook = async () => {
    if (!selected) return;
    setPaying(true);
    await openRazorpayCheckout({
      amount: bookingPrice,
      description: `${bookingType === "session" ? "1 Session" : "Monthly Plan"} with ${selected.name}`,
      onSuccess: (paymentId) => {
        sessionsApi.book({
          instructorId: selected.id,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: sessionMode,
          price: bookingPrice,
        });
        setPaying(false);
        setBookingOpen(false);
        toast({
          title: "Booking Confirmed!",
          description: `Your ${sessionMode} session with ${selected.name} is booked. Payment ID: ${paymentId}`,
        });
      },
      onDismiss: () => setPaying(false),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-fitness opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(262_83%_70%/0.3),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Dumbbell className="h-4 w-4" />
            Certified Gym Instructors
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Find Your Perfect <br className="hidden sm:block" />
            <span className="text-yellow-300">Fitness Coach</span>
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-8">
            Browse verified instructors, filter by specialty, experience &amp; gender — then book &amp; pay in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
            {[["8+", "Expert Coaches"], ["1,200+", "Happy Clients"], ["4.8★", "Average Rating"], ["Online & In-Person", "Flexible Booking"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs opacity-80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Filters ────────────────────────────────────────────────────── */}
        <Card className="shadow-fitness mb-8 border-fitness/20">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, specialty, gym…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Gender */}
              <Select value={genderFilter} onValueChange={(v) => setGenderFilter(v as typeof genderFilter)}>
                <SelectTrigger>
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>

              {/* Experience */}
              <Select value={expFilter} onValueChange={setExpFilter}>
                <SelectTrigger>
                  <Award className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="0-3">0–3 years</SelectItem>
                  <SelectItem value="4-7">4–7 years</SelectItem>
                  <SelectItem value="8-12">8–12 years</SelectItem>
                  <SelectItem value="13+">13+ years</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <ChevronDown className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price_asc">Price: Low → High</SelectItem>
                  <SelectItem value="price_desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialty pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSpecialtyFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  specialtyFilter === "all"
                    ? "bg-fitness text-white border-fitness"
                    : "bg-muted text-muted-foreground border-border hover:border-fitness/50"
                }`}
              >
                All Specialties
              </button>
              {allSpecialties.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecialtyFilter(specialtyFilter === s ? "all" : s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    specialtyFilter === s
                      ? "bg-fitness text-white border-fitness"
                      : "bg-muted text-muted-foreground border-border hover:border-fitness/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Results count ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> instructor{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-1.5">
            {genderFilter !== "all" && (
              <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setGenderFilter("all")}>
                {genderFilter} ×
              </Badge>
            )}
            {expFilter !== "all" && (
              <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setExpFilter("all")}>
                {expFilter} yrs ×
              </Badge>
            )}
            {specialtyFilter !== "all" && (
              <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setSpecialtyFilter("all")}>
                {specialtyFilter} ×
              </Badge>
            )}
          </div>
        </div>

        {/* ── Instructor grid ──────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-xl font-medium mb-2">No instructors found</p>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((instructor) => (
              <Card
                key={instructor.id}
                className="group card-lift shadow-card hover:shadow-fitness border-border hover:border-fitness/30 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelected(instructor)}
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {instructor.isVerified && (
                      <span className="flex items-center gap-1 bg-fitness text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        <BadgeCheck className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      instructor.gender === "female"
                        ? "bg-pink-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {instructor.gender}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {instructor.rating}
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-base leading-tight">{instructor.name}</h3>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {instructor.location}
                    </p>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Experience & reviews */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Award className="h-3.5 w-3.5" />
                      {instructor.experienceYears} yrs exp
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {instructor.reviewCount} reviews
                    </span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1">
                    {instructor.specialties.slice(0, 2).map((s) => (
                      <SpecialtyBadge key={s} label={s} />
                    ))}
                    {instructor.specialties.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        +{instructor.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{instructor.availability.join(", ")}</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-1 border-t border-border">
                    <div>
                      <span className="text-base font-bold text-foreground">₹{instructor.pricePerSession}</span>
                      <span className="text-xs text-muted-foreground ml-1">/session</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-fitness text-white hover:opacity-90 shadow-fitness text-xs h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(instructor);
                        setBookingOpen(true);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail dialog ────────────────────────────────────────────────── */}
      <Dialog open={!!selected && !bookingOpen} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">{selected.name}</DialogTitle>
                <DialogDescription className="sr-only">Instructor profile</DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                {/* Top hero */}
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                        <p className="text-white/80 text-sm flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {selected.gymName} · {selected.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-white bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{selected.rating}</span>
                          <span className="text-white/70 text-xs">({selected.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground leading-relaxed">{selected.bio}</p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Experience", value: `${selected.experienceYears} yrs` },
                    { label: "Age", value: `${selected.age} yrs` },
                    { label: "Languages", value: selected.languages.join(", ") },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-sm font-semibold">{value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <Dumbbell className="h-4 w-4 text-fitness" />
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.specialties.map((s) => <SpecialtyBadge key={s} label={s} />)}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-fitness" />
                    Certifications
                  </h4>
                  <div className="space-y-1.5">
                    {selected.certifications.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-fitness" />
                    Available Days
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
                      <span
                        key={day}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selected.availability.includes(day)
                            ? "bg-fitness text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-xl p-4 text-center border-fitness/30 bg-fitness/5">
                    <IndianRupee className="h-5 w-5 text-fitness mx-auto mb-1" />
                    <div className="text-2xl font-bold">₹{selected.pricePerSession}</div>
                    <div className="text-xs text-muted-foreground">Per Session</div>
                  </div>
                  <div className="border rounded-xl p-4 text-center border-primary/30 bg-primary/5">
                    <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-2xl font-bold">₹{selected.priceMonthly}</div>
                    <div className="text-xs text-muted-foreground">Monthly Plan</div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-fitness text-white shadow-fitness"
                  size="lg"
                  onClick={() => setBookingOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book a Session
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Booking dialog ───────────────────────────────────────────────── */}
      <Dialog open={bookingOpen} onOpenChange={(o) => { setBookingOpen(o); if (!o) setPaying(false); }}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-fitness" />
                  Book with {selected.name}
                </DialogTitle>
                <DialogDescription>
                  Choose your plan and session mode, then pay securely.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Plan toggle */}
                <div>
                  <p className="text-sm font-medium mb-2">Plan</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([["session", "Single Session", selected.pricePerSession], ["monthly", "Monthly Plan", selected.priceMonthly]] as const).map(([type, label, price]) => (
                      <button
                        key={type}
                        onClick={() => setBookingType(type as "session" | "monthly")}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          bookingType === type
                            ? "border-fitness bg-fitness/5"
                            : "border-border hover:border-fitness/40"
                        }`}
                      >
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="text-lg font-bold mt-0.5">₹{price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode toggle */}
                <div>
                  <p className="text-sm font-medium mb-2">Session Mode</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([["online", Video, "Online"], ["in-person", Users, "In-Person"]] as const).map(([mode, Icon, label]) => (
                      <button
                        key={mode}
                        onClick={() => setSessionMode(mode as "online" | "in-person")}
                        className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                          sessionMode === mode
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instructor</span>
                    <span className="font-medium">{selected.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mode</span>
                    <span className="font-medium capitalize">{sessionMode}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2 mt-1">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-fitness text-base">₹{bookingPrice}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-fitness text-white shadow-fitness"
                  size="lg"
                  onClick={handleBook}
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
                      Pay ₹{bookingPrice} via Razorpay
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secured by Razorpay · Test mode (no real charge)
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GymInstructors;
