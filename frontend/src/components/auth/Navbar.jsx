/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Menu, X, TrendingUp, User, LogOut, BarChart3, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "../theme/theme-switcher";

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const Navbar = () => {
  const { token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // Reduced threshold to 20px
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navLinks = token
    ? [
        { to: "/dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
        { to: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
        ...(role === "admin"
          ? [{ to: "/admin", label: "Admin", icon: <Shield className="h-4 w-4" /> }]
          : []),
      ]
    : [];

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center text-primary text-2xl md:text-3xl font-bold tracking-wide hover:opacity-90 transition-opacity"
            >
              <img src="/assets/Logo256x256.ico" className="mr-2 size-10" />
              <span className="gradient-text">StockGenius</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="ml-3">
                <ThemeSwitcher />
              </div>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActiveRoute(link.to) ? "default" : "ghost"}
                    className={`text-sm font-semibold transition-all ${
                      isActiveRoute(link.to)
                        ? "bg-primary text-accent-fg"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </Button>
                </Link>
              ))}
              {token ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-sm font-semibold border-destructive text-destructive hover:bg-destructive/10 ml-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="default"
                    className="text-sm font-semibold bg-primary hover:bg-primary/90 text-accent-fg transition-colors ml-2"
                  >
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/20 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Menu Dialog */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-4 right-4 left-4 z-50 bg-card rounded-lg shadow-xl border border-primary/20"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity"
                  >
                    <img src="/assets/Logo256x256.ico" className="mr-2 size-10" />
                    <span className="gradient-text">StockGenius</span>
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6 text-foreground" />
                  </button>
                </div>

                <div className="mb-4">
                  <ThemeSwitcher />
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActiveRoute(link.to)
                          ? "bg-primary text-black"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                    </Link>
                  ))}

                  {token ? (
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full mt-4 text-sm font-semibold border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mt-4"
                    >
                      <Button
                        variant="default"
                        className="w-full text-sm font-semibold bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Get Started
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
