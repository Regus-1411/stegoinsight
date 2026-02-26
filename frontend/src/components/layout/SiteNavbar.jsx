import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";

const navLinks = [
    { label: "Home", path: "/" },
    { label: "Upload", path: "/upload" },
    // { label: "Dashboard", path: "/dashboard" },
    { label: "Docs", path: "/docs" },
];

const SiteNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="text-xl font-display font-bold tracking-tight">
                        Stego<span className="text-primary">Insight</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {/*<Button variant="cyberOutline" size="sm">Sign In</Button>*/}
                    <Button variant="cyber" size="sm">Get Started</Button>
                </div>

                <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden glass-strong border-t border-border px-6 py-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${location.pathname === link.path ? "text-primary bg-primary/10" : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex gap-2 mt-2">
                        <Button variant="cyberOutline" size="sm" className="flex-1">Sign In</Button>
                        <Button variant="cyber" size="sm" className="flex-1">Get Started</Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default SiteNavbar;
