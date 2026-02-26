import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

const SiteFooter = () => {
    return (
        <footer className="border-t border-border py-12 mt-20">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="text-lg font-display font-bold">
                                Stego<span className="text-primary">Insight</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            AI-powered steganography detection platform. Uncover hidden threats in images, audio, and documents with advanced deep learning models.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Product</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/upload" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Upload</Link>
                            <Link to="/dashboard" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Dashboard</Link>
                            <Link to="/docs" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Documentation</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Company</h4>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">About</a>
                            <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-border text-center text-muted-foreground text-xs">
                    © 2025 StegoInsight. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
