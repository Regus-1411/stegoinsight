import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, FileImage, Download, Eye, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/SiteLayout";

const scanResults = [
  { file: "image_sample.png", type: "Image", risk: "High", technique: "LSB Substitution", confidence: 94 },
  { file: "audio_clip.wav", type: "Audio", risk: "Low", technique: "None Detected", confidence: 12 },
  { file: "document.pdf", type: "Document", risk: "Medium", technique: "Whitespace Encoding", confidence: 67 },
];

const stats = [
  { icon: FileImage, label: "Files Scanned", value: "3" },
  { icon: AlertTriangle, label: "Threats Found", value: "2" },
  { icon: BarChart3, label: "Avg Confidence", value: "57.7%" },
  { icon: Clock, label: "Scan Duration", value: "7.2s" },
];

const riskColor = (risk) => {
  switch (risk) {
    case "High": return "text-destructive";
    case "Medium": return "text-warning";
    case "Low": return "text-success";
    default: return "text-muted-foreground";
  }
};

const riskBg = (risk) => {
  switch (risk) {
    case "High": return "bg-destructive/10 border-destructive/20";
    case "Medium": return "bg-warning/10 border-warning/20";
    case "Low": return "bg-success/10 border-success/20";
    default: return "bg-muted";
  }
};

const DashboardPage = () => {
  return (
    <SiteLayout>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Analysis Dashboard</h1>
            <p className="text-muted-foreground text-sm">Scan results and threat assessment report</p>
          </div>
          <div className="flex gap-3">
            <Button variant="cyberOutline" size="sm">
              <Eye className="w-4 h-4 mr-2" /> View Report
            </Button>
            <Button variant="cyber" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold font-display">{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Results table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Scan Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">File</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technique</th>
                  <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((result, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{result.file}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{result.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${riskBg(result.risk)}`}>
                        {result.risk === "High" ? <AlertTriangle className="w-3 h-3" /> : result.risk === "Low" ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        <span className={riskColor(result.risk)}>{result.risk}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{result.technique}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full gradient-cyan rounded-full"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{result.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div >
    </SiteLayout >
  );
};

export default DashboardPage;
