import { motion } from "framer-motion";
import {
  Book, Code, Shield, Zap, Terminal,
  FileText, ExternalLink, BookOpen,
  FlaskConical, Brain, ScanSearch, Layers
} from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";

/* ─── existing docs sections (unchanged) ────────────────── */
const sections = [
  {
    icon: Book,
    tag: "Getting Started · Intro",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    title: "Getting Started",
    content:
      "StegoInsight uses advanced deep learning models to detect steganographic content hidden within digital media. Simply upload your files and our AI will analyze them for hidden data patterns.",
    highlights: ["Upload & analyze", "Deep learning detection", "Real-time results"],
  },
  {
    icon: Code,
    tag: "Integration · API",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    title: "API Reference",
    content:
      "Integrate StegoInsight into your pipeline via our FAST API. Send files for analysis and receive structured JSON reports with risk scores, detected techniques, and confidence levels.",
    highlights: ["REST API", "JSON responses", "Multiple formats"],
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
    tag: "Features · Detection",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    title: "Supported Techniques",
    items: [
      "Binary classification: Stego vs Non-Stego",
      "Confidence score for prediction",
      "Visualization of embedding artifacts (heatmaps)",
      "Detection of common steganographic manipulation patterns"
    ],
    highlights: ["Classification", "Confidence scoring", "Heatmap visualization"],
  },
  {
    icon: Zap,
    tag: "Pricing · Tiers",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    title: "Rate Limits",
    content:
      "Free tier: 10 scans/day. Pro tier: 500 scans/day. Enterprise: Unlimited with dedicated infrastructure and SLA guarantees.",
    highlights: ["Free tier available", "Flexible pricing", "Enterprise scale"],
  },
];

/* ─── research papers data ───────────────────────────────── */
const papers = [
  {
    id: "P1",
    icon: Brain,
    tag: "Survey · 2024",
    tagColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    title: "Comprehensive Survey on Image Steganalysis Using Deep Learning",
    authors: "Kheddar et al.",
    venue: "ScienceDirect · 2024",
    abstract:
      "Investigates recent developments in deep learning–based steganalysis, tracing the evolution from traditional SVM and ensemble classifiers to CNN-based architectures that achieve superior detection accuracy across modern steganographic algorithms.",
    highlights: ["CNN steganalysis evolution", "SVM vs. deep learning comparison", "Multi-algorithm evaluation"],
    url: "https://www.sciencedirect.com/science/article/pii/S2590005624000195",
    year: 2024,
  },
  {
    id: "P2",
    icon: Layers,
    tag: "Architecture · 2025",
    tagColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    title: "Deep Learning-Driven Multi-Layered Steganographic Framework for Enhanced Data Security",
    authors: "Nature Scientific Reports",
    venue: "Scientific Reports · Feb 2025",
    abstract:
      "Proposes a multi-layered framework combining Huffman coding, LSB embedding, and a deep learning encoder–decoder. Evaluated on Tiny ImageNet, COCO, and CelebA; demonstrates superior imperceptibility and robustness against steganalysis attacks.",
    highlights: ["Huffman + LSB + DL encoder", "COCO & CelebA benchmarks", "Resistance to steganalysis"],
    url: "https://www.nature.com/articles/s41598-025-89189-5",
    year: 2025,
  },
  {
    id: "P3",
    icon: ScanSearch,
    tag: "Detection · 2022",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    title: "Detection of Image Steganography Using Deep Learning and Ensemble Classifiers",
    authors: "Korus et al.",
    venue: "MDPI Electronics · May 2022",
    abstract:
      "Analyzes JPEG steganography detection using DCTR and Gabor filter residuals on the BOSS database. Achieved 99.9% accuracy for nsF5 at 0.4 bpnzac density. Ensemble classifiers shown as a strong alternative to deep learning-only approaches.",
    highlights: ["BOSS database evaluation", "99.9% accuracy on nsF5", "DCTR + GFR feature spaces"],
    url: "https://www.mdpi.com/2079-9292/11/10/1565",
    year: 2022,
  },
  {
    id: "P4",
    icon: FlaskConical,
    tag: "Robustness · 2025",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    title: "Deep Learning for Steganalysis: Evaluating Model Robustness Against Image Transformations",
    authors: "Frontiers in AI · 2025",
    venue: "Frontiers in Artificial Intelligence · Mar 2025",
    abstract:
      "Benchmarks Xu-Net, Yedroudj-Net, SRNet, ResNet, and EfficientNet against compression, resizing, and Gaussian noise attacks. SRNet leads in multi-scale spatial analysis; EfficientNet shows best generalization via compound scaling.",
    highlights: ["5-model benchmark", "Gaussian noise & JPEG compression", "Transformer future directions"],
    url: "https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1532895/full",
    year: 2025,
  },
  {
    id: "P5",
    icon: Brain,
    tag: "Fine-Tuning · 2024",
    tagColor: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    title: "Enhancing Steganography Detection: Fine-Tuning SRNet for Spread Spectrum Image Steganography",
    authors: "MDPI Sensors · Dec 2024",
    venue: "MDPI Sensors · Dec 2024",
    abstract:
      "Fine-tunes the SRNet model on Spread Spectrum Image Steganography (SSIS) datasets. Demonstrates significant detection gains on SSIS while revealing trade-offs in detection performance across WOW, HILL, and S-UNIWARD techniques.",
    highlights: ["SRNet fine-tuning", "SSIS dataset focus", "WOW · HILL · S-UNIWARD comparison"],
    url: "https://www.mdpi.com/1424-8220/24/23/7815",
    year: 2024,
  },
  {
    id: "P6",
    icon: Layers,
    tag: "Survey · 2024",
    tagColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    title: "Image Steganography Techniques Resisting Statistical Steganalysis: A Systematic Literature Review",
    authors: "PMC · PLOS ONE · 2024",
    venue: "PLOS ONE · Sep 2024",
    abstract:
      "Systematic review of 61 papers (2011–2022) from ACM, IEEE, ScienceDirect, and Wiley. Finds GAN-based steganography dominant for resisting statistical steganalysis, with exponential growth observed between 2018 and 2022.",
    highlights: ["GAN-based steganography dominant", "61 papers reviewed", "ACM + IEEE + Wiley sources"],
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11404826/",
    year: 2024,
  },
];

/* ─── animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
const DocsPage = () => {
  return (
    <SiteLayout>
      <div className="container mx-auto px-6 py-16 max-w-4xl">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 glass rounded-2xl p-6 group border border-border hover:border-blue-400/50 hover:bg-blue-400/5 transition-all duration-300"
          style={{ willChange: "transform" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">

            {/* Icon column */}
            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
              <FileText className="w-5 h-5 text-primary" />
            </div>

            {/* Content column */}
            <div className="flex-1 min-w-0">

              {/* Tag */}
              <div className="mb-2 flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center text-[0.65rem] font-mono font-medium tracking-widest px-2 py-0.5 rounded-full border text-indigo-400 bg-indigo-400/10 border-indigo-400/20">
                  OVERVIEW · DOCUMENTATION
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold leading-snug mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
                Documentation
              </h1>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Steganography is the art of concealing information within innocuous digital media. With StegoInsight, you can detect hidden data, assess risk, and understand the techniques used (Random Forest, Logistic Regression etc.). Our AI analyzes media and returns confidence scores, visual heatmaps, and a detailed report.
              </p>

              {/* Highlight pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[0.65rem] font-mono tracking-wide text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full">
                  Advanced Detection
                </span>
                <span className="text-[0.65rem] font-mono tracking-wide text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full">
                  Risk Assessment
                </span>
                <span className="text-[0.65rem] font-mono tracking-wide text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full">
                  Detailed Reports
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Existing docs sections ── */}
        <div className="space-y-8 mb-20">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="glass rounded-2xl p-6 group border border-border hover:border-blue-400/50 hover:bg-blue-400/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>

              {section.content && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {section.content}
                </p>
              )}

              {section.code && (
                <div className="bg-background rounded-xl p-4 border border-border overflow-x-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-mono">API Example</span>
                  </div>
                  <pre className="text-xs font-mono text-foreground/80 whitespace-pre">
                    {section.code}
                  </pre>
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

        {/* ══════════════════════════════════════════════
            RESEARCH PAPERS SECTION
        ══════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold group-hover:text-primary transition-colors duration-200">Research Papers</h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                Peer-reviewed studies on steganography and AI-based detection underpinning StegoInsight.
              </p>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="mt-6 mb-8 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        </motion.div>

        {/* Papers grid */}
        <div className="space-y-5">
          {papers.map((paper, i) => (
            <motion.div
              key={paper.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="glass rounded-2xl p-6 group border border-border hover:border-blue-400/50 hover:bg-blue-400/5 transition-all duration-300"
              style={{ willChange: "transform" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Icon column */}
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                  <paper.icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content column */}
                <div className="flex-1 min-w-0">

                  {/* Tag + year */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`inline-flex items-center text-[0.65rem] font-mono font-medium
                        tracking-widest px-2 py-0.5 rounded-full border ${paper.tagColor}`}
                    >
                      {paper.tag}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{paper.venue}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold leading-snug mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
                    {paper.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-xs text-muted-foreground font-mono mb-3">{paper.authors}</p>

                  {/* Abstract */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {paper.abstract}
                  </p>

                  {/* Highlight pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-[0.65rem] font-mono tracking-wide
                          text-muted-foreground bg-muted/40 border border-border
                          px-2 py-0.5 rounded-full"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Read paper link */}
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium
                      text-primary hover:text-primary/80 transition-colors duration-150
                      border border-primary/25 hover:border-primary/50
                      bg-primary/5 hover:bg-primary/10
                      px-3 py-1.5 rounded-lg"
                  >
                    <ExternalLink className="w-3 h-3" />
                    READ PAPER
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Papers footer note */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 text-xs text-muted-foreground/60 font-mono text-center"
        >
          All papers are publicly accessible. StegoInsight is not affiliated with any of the listed authors or institutions.
        </motion.p>

      </div>
    </SiteLayout>
  );
};

export default DocsPage;/*import { motion } from "framer-motion";
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
    content: "Integrate StegoInsight into your pipeline via our  API. Send files for analysis and receive structured JSON reports with risk scores, detected techniques, and confidence levels.",
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
          <p className="text-muted-foreground mt-4">Everything you need to integrate and use StegoInsight.</p>
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

export default DocsPage;*/
