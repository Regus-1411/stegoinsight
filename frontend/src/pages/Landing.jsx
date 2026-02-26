import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Upload, BarChart3, FileSearch, Zap, Lock, Brain, Eye } from "lucide-react";
import heroImage from "@/assets/stego-hero.webp";
import SiteLayout from "@/components/layout/SiteLayout";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Detection",
    description: "Machine learning models trained on millions of steganographic samples for industry-leading accuracy.",
  },
  {
    icon: Eye,
    title: "Multi-Format Analysis",
    description: "Detect hidden data of any format of image.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Lightning-fast analysis with GPU-accelerated inference and batch processing support.",
  },
  {
    icon: BarChart3,
    title: "Clear Visual Results",
    description: "Prediction results are displayed using intuitive visualizations like heatmaps and confidence meters for better clarity and understanding."
  }
];

const steps = [
  { num: "01", icon: Upload, title: "Upload", desc: "Drag & drop your files for analysis" },
  { num: "02", icon: Upload, title: "Model", desc: "Processing of image & ML model Prediction" },
  { num: "03", icon: FileSearch, title: "Analyze", desc: "AI explain the prediction results" },
  { num: "04", icon: BarChart3, title: "Results", desc: "Get detailed visualized reports and insights" },
];

const Landing = () => {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">AI-Powered Stegnography Detection</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                AI-Powered Prediction
                <br />of&ensp;
                <span className="text-gradient-cyan">Steganographic</span>
                <br />
                Images Instantly
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                Uncover concealed data in images using advanced machine learning models. Protect your organization from invisible threats.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/upload">
                  <Button variant="cyber" size="lg">Start Scanning</Button>
                </Link>
                <Link to="/docs">
                  <Button variant="cyberOutline" size="lg">Read Docs</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-border glow-cyan">
                <img
                  src={heroImage}
                  alt="StegoInsight AI cybersecurity dashboard"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to uncover hidden threats in your files.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6 text-center relative group hover:border-primary/30 transition-all"
              >
                <span className="text-5xl font-display font-bold text-primary/10 absolute top-4 right-4">{step.num}</span>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:glow-cyan transition-shadow">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why StegoInsight?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built for cybersecurity professionals who demand accuracy, speed, and reliability.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 group hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-cyan transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-14 text-center border border-primary/20 glow-cyan"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to predict hidden data in images?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start predicting hidden data in images today.
            </p>
            <Link to="/upload">
              <Button variant="cyber" size="lg">Upload Your Image</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Landing;
