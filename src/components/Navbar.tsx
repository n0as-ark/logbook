import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";

const navLinks = [
{ to: "/", label: "Home" },
{ to: "/blog", label: "Blog" },
{ to: "/about", label: "About" }];


const Navbar = () => {
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/">
          <img 
            src={dark ? "/logbook/ark-logo-dark.png" : "/logbook/noas_ark_logo.png"}
            alt="Noa's Ark" 
            style={{ height: '36px', width: 'auto' }} 
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm transition-colors ${
            location.pathname === link.to ?
            "text-primary" :
            "text-muted-foreground hover:text-foreground"}`
            }>
            
              {link.label}
            </Link>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Toggle theme">
            
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Toggle theme">
            
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Toggle menu">
            
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen &&
      <div className="md:hidden border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col gap-2">
            {navLinks.map((link) =>
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm py-1 transition-colors ${
            location.pathname === link.to ?
            "text-primary" :
            "text-muted-foreground hover:text-foreground"}`
            }>
            
                {link.label}
              </Link>
          )}
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;
