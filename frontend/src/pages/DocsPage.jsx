import { motion } from "framer-motion";
import { Book, Code, Shield, Zap, Terminal, FileText } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";

const sections = [
  {
    icon: Book,
    title: "Getting Started",
    content: "StegoInsight uses advanced deep learning models to detect steganographic content hidden within digital media. Simply upload your files and our AI will analyze them for hidden data patterns.",
  },
  {
    icon: Code,
    title: "API Reference",
    content: "Integrate StegoInsight into your pipeline via our REST API. Send files for analysis and receive structured JSON reports with risk scores, detected techniques, and confidence levels.",
    code: `POST /api/v1/analyze
Content-Type: multipart/form-data

{
  "file": <binary>,
  "options": {
    "deep_scan": true,
    "techniques": ["lsb", "dct", "spread_spectrum"]
  }
}`,
  },
  {
    icon: Shield,
    title: "Supported Techniques",
    items: [
      "LSB (Least Significant Bit) Substitution",
      "DCT Domain Hiding",
      "Spread Spectrum Steganography",
      "Whitespace Encoding",
      "Echo Hiding (Audio)",
      "Metadata Injection",
    ],
  },
  {
    icon: Zap,
    title: "Rate Limits",
    content: "Free tier: 10 scans/day. Pro tier: 500 scans/day. Enterprise: Unlimited with dedicated infrastructure and SLA guarantees.",
  },
];

const DocsPage = () => {
  return (
    <SiteLayout>
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Documentation</h1>
          </div>
          <p className="text-muted-foreground">Everything you need to integrate and use StegoInsight.</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>

              {section.content && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{section.content}</p>
              )}

              {section.code && (
                <div className="bg-background rounded-xl p-4 border border-border overflow-x-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-mono">API Example</span>
                  </div>
                  <pre className="text-xs font-mono text-foreground/80 whitespace-pre">{section.code}</pre>
                </div>
              )}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
};

export default DocsPage;
