import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
    { label: "Home", path: "/landing" },
    { label: "Upload", path: "/upload" },
    { label: "Docs", path: "/docs" },
];

const SiteNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 md:pt-8"
        >
            {/* Glassy floating navbar */}
            <div className="backdrop-blur-lg bg-background/30 border border-white/15 rounded-full shadow-lg shadow-primary/10 px-2 py-3 md:px-8 md:py-4">
                <div className="flex items-center justify-between gap-6 md:gap-12">
                    
                    {/* Logo */}
                    <Link 
                        to="/landing" 
                        className="flex items-center gap-2.5 group shrink-0"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300"
                        >
                            <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </motion.div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-bold  w-<12> tracking-tight group-hover:text-primary transition-colors duration-200">
                                StegoInsight
                            </span>
                            <span className="text-[0.5rem] text-muted-foreground font-mono tracking-widest">
                            
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <motion.div
                                key={link.path}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        isActive(link.path)
                                            ? "text-primary bg-primary/20 border border-primary/40"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-cyan-500/10 -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/upload">
                                <Button 
                                    variant="cyber" 
                                    size="sm"
                                    className="rounded-full shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300"
                                >
                                    Get Started
                                    <span className="ml-1.5">→</span>
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 text-foreground hover:text-primary transition-all duration-200" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu - Floating dropdown */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-4 backdrop-blur-lg bg-background/40 border border-white/10 rounded-3xl shadow-lg shadow-primary/10 overflow-hidden mx-auto w-11/12 md:hidden"
                >
                    <div className="px-6 py-6 flex flex-col gap-3">
                        {navLinks.map((link, idx) => (
                            <motion.div
                                key={link.path}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <Link
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        isActive(link.path)
                                            ? "text-primary bg-primary/20 border border-primary/40"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24 }}
                            className="pt-2 mt-2 border-t border-white/5"
                        >
                            <Link to="/upload" onClick={() => setIsOpen(false)}>
                                <Button 
                                    variant="cyber" 
                                    size="sm" 
                                    className="w-full rounded-lg shadow-md shadow-primary/30"
                                >
                                    Get Started →
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default SiteNavbar;
