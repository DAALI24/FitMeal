import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Calculator,
  UtensilsCrossed,
  Package,
  User,
  Menu,
  X,
  Stethoscope,
  Dumbbell,
  ShieldCheck,
  Brain,
  ScanLine,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/",               label: "Home",             icon: Heart },
  { path: "/ai-analysis",    label: "AI Analysis",      icon: Brain },
  { path: "/food-scanner",   label: "Food Scanner",     icon: ScanLine },
  { path: "/dashboard",      label: "Dashboard",        icon: LayoutDashboard },
  { path: "/restaurants",    label: "Restaurants",      icon: UtensilsCrossed },
  { path: "/nutritionist",   label: "Nutritionist",     icon: Stethoscope },
  { path: "/gym-instructors",label: "Gym Coaches",      icon: Dumbbell },
  { path: "/orders",         label: "Orders",           icon: Package },
];

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-health">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              FitMeal
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-0.5 overflow-x-auto">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive(path)
                    ? "bg-gradient-primary text-white shadow-health"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button asChild variant="outline" size="sm" className="border-admin/30 text-admin hover:bg-admin/5 hover:border-admin">
              <Link to="/admin">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Admin
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/login">
                <User className="h-3.5 w-3.5 mr-1.5" />
                Login
              </Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md animate-fade-in-up">
          <div className="px-3 pt-2 pb-4 space-y-0.5">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 items-center space-x-2.5 ${
                  isActive(path)
                    ? "bg-gradient-primary text-white"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex gap-2">
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-admin bg-admin/5 hover:bg-admin/10 border border-admin/20 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Portal
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 bg-muted hover:bg-muted/80 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
