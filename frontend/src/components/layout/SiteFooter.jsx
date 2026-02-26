import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const SiteFooter = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Product",
            links: [
                { label: "Upload", path: "/upload" },
                { label: "Dashboard", path: "/dashboard" },
                { label: "Documentation", path: "/docs" },
            ]
        },
        {
            title: "Company",
            links: [
                { label: "About", path: "#" },
                { label: "Privacy", path: "#" },
                { label: "Contact", path: "#" },
            ]
        }
    ];

    const socialLinks = [
        { icon: Github, href: "#", label: "GitHub" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Mail, href: "#", label: "Email" },
    ];

    return (
        <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-sm py-16 mt-20">
            {/* Decorative gradient */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <motion.div 
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors duration-200">
                                    StegoInsight
                                </h3>
                                <p className="text-[0.65rem] text-muted-foreground font-mono tracking-widest">
                                    AI DETECTION
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
                            AI-powered steganography detection platform. Uncover hidden threats in images, audio, and documents with advanced machine learning models.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    title={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer Links */}
                    {footerLinks.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h4 className="font-semibold text-sm mb-4 text-foreground tracking-wide">
                                {section.title}
                            </h4>
                            <div className="flex flex-col gap-3">
                                {section.links.map((link, linkIdx) => (
                                    <motion.div
                                        key={linkIdx}
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            to={link.path}
                                            className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                />

                {/* Bottom Footer */}
                <motion.div
                    className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center md:text-left">
                        <p className="text-muted-foreground text-xs font-mono tracking-widest">
                            © {currentYear} <span className="text-primary">StegoInsight</span> • All rights reserved
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors duration-200">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-primary transition-colors duration-200">
                            Privacy Policy
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default SiteFooter;
