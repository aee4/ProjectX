import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Shield, LogOut } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isAdmin?: boolean;
  currentView?: "dashboard" | "timetable";
  onViewChange?: (view: "dashboard" | "timetable") => void;
  onLogout?: () => void;
}

const Header = ({ isAdmin = false, currentView, onViewChange, onLogout }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
  };

  const navLinks = isAdmin
    ? [
        { path: "/admin", label: "Dashboard", view: "dashboard" as const },
        { path: "/admin", label: "Timetable", view: "timetable" as const },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/login", label: "Login" },
        { path: "/about", label: "About Us" },
        { path: "/timetable", label: "Timetable" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 items-center justify-between py-3">
        {/* Logo & Brand */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-navy-light text-primary-foreground shadow-primary transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg overflow-hidden">
            <img 
              src="/favicon.ico" 
              alt="ProjectX Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground leading-tight tracking-wide uppercase">Central University</span>
            <span className="text-xl font-bold text-foreground leading-tight tracking-tight">ProjectX</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1.5">
            {navLinks.map((link) => {
              if (isAdmin && link.view) {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => onViewChange?.(link.view)}
                    className={cn(
                      "nav-link rounded-full",
                      isActive && "active bg-card shadow-sm"
                    )}
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "nav-link rounded-full",
                    location.pathname === link.path && "active bg-card shadow-sm"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          {/* Admin Badge & Logout */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-xs font-semibold text-secondary">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {isAdmin && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/10 border border-secondary/30">
              <Shield className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-semibold text-secondary">Admin</span>
            </div>
          )}
          <button 
            className="p-2.5 rounded-xl bg-muted/50 text-foreground transition-colors hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              if (isAdmin && link.view) {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      onViewChange?.(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    location.pathname === link.path 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors text-destructive hover:bg-destructive/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
