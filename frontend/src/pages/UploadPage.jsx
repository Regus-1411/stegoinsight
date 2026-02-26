import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, FileAudio, FileText, X, Shield } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";

const acceptedTypes = [
  { icon: FileImage, label: "Images", formats: "PNG, JPG, BMP, TIFF" },
  /*{ icon: FileAudio, label: "Audio", formats: "WAV, MP3, FLAC" },
  { icon: FileText, label: "Documents", formats: "PDF, DOCX" },*/
];

const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (files.length > 0) {
      navigate("/processing");
    }
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Upload Files for Analysis</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload images of any format to scan for hidden steganographic content.
          </p>
        </motion.div>

        {/* Accepted formats */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {acceptedTypes.map((type) => (
            <div key={type.label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <type.icon className="w-5 h-5 text-primary" />
              <div>
                <span className="text-xs font-semibold">{type.label}</span>
                <p className="text-[10px] text-muted-foreground">{type.formats}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`max-w-2xl mx-auto glass rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging ? "border-primary/60 glow-cyan-strong" : "border-border hover:border-primary/30"
            }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-float">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
          <p className="text-muted-foreground text-xs">Maximum file size: 50MB</p>
        </motion.div>

        {/* File list */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-6 space-y-2"
          >
            {files.map((file, i) => (
              <div key={i} className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="pt-4 text-center">
              <Button variant="cyber" size="lg" onClick={handleAnalyze}>
                Analyze {files.length} File{files.length > 1 ? "s" : ""}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </SiteLayout>
  );
};

export default UploadPage;
