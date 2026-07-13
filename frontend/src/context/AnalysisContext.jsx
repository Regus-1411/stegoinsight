import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
    const [pendingFiles, setPendingFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const reset = () => {
        setPendingFiles([]);
        setResults([]);
        setIsAnalyzing(false);
        setError(null);
    };

    return (
        <AnalysisContext.Provider
            value={{ pendingFiles, setPendingFiles, results, setResults, isAnalyzing, setIsAnalyzing, error, setError, reset }}
        >
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const ctx = useContext(AnalysisContext);
    if (!ctx) throw new Error("useAnalysis must be used inside <AnalysisProvider>");
    return ctx;
}
