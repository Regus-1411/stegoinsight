import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Scan, FileSearch, CheckCircle } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { useAnalysis } from "@/context/AnalysisContext";
import { analyzeFile } from "@/lib/api";

const stages = [
  { icon: FileSearch, label: "Parsing file structure..." },
  { icon: Scan, label: "Running steganalysis models..." },
  { icon: Shield, label: "Generating risk assessment..." },
  { icon: CheckCircle, label: "Analysis complete!" },
];

const ProcessingPage = () => {
  const navigate = useNavigate();
  const { pendingFiles, setResults, setIsAnalyzing, setError } = useAnalysis();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!pendingFiles || pendingFiles.length === 0) {
      navigate("/upload", { replace: true });
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const runAnalysis = async () => {
      setIsAnalyzing(true);
      setError(null);
      setCurrentStage(0);
      setProgress(5);

      try {
        const allResults = [];
        const totalFiles = pendingFiles.length;

        for (let i = 0; i < totalFiles; i++) {
          setCurrentStage(0);
          setProgress(Math.round(((i * 3) / (totalFiles * 3)) * 90) + 5);

          setCurrentStage(1);
          const result = await analyzeFile(pendingFiles[i]);
          allResults.push(result);

          setCurrentStage(2);
          setProgress(Math.round((((i + 1) * 3) / (totalFiles * 3)) * 90) + 5);
        }

        setCurrentStage(3);
        setProgress(100);
        setResults(allResults);
        setIsAnalyzing(false);
        setTimeout(() => navigate("/dashboard"), 800);
      } catch (err) {
        setError(err.message || "Analysis failed");
        setIsAnalyzing(false);
        setCurrentStage(3);
        setProgress(100);
        setTimeout(() => navigate("/dashboard"), 1200);
      }
    };

    runAnalysis();
  }, [pendingFiles, navigate, setResults, setIsAnalyzing, setError]);

  return (
    <SiteLayout>
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" />
              <motion.div
                className="absolute left-0 right-0 h-1 bg-primary/60"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Analyzing Your File</h2>

          <div className="space-y-3 mb-8">
            {stages.map((stage, i) => {
              const StageIcon = stage.icon;
              const isActive = i === currentStage;
              const isDone = i < currentStage;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm transition-all ${isDone ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                >
                  <StageIcon className={`w-4 h-4 shrink-0 ${isActive ? "animate-pulse" : ""}`} />
                  <span>{stage.label}</span>
                  {isDone && <CheckCircle className="w-3.5 h-3.5 text-primary ml-auto" />}
                </div>
              );
            })}
          </div>

          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full gradient-cyan rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-muted-foreground text-xs mt-2">{Math.round(progress)}% complete</p>
        </motion.div>
      </div>
    </SiteLayout>
  );
};

export default ProcessingPage;
