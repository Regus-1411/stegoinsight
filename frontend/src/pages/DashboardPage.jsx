import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle, FileImage, BarChart3, Clock, Brain, ArrowLeft, PieChart as PieChartIcon, Grid3X3 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/SiteLayout";
import { useAnalysis } from "@/context/AnalysisContext";

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

/* ───── Pie Chart Colors ───── */
const PIE_COLORS = {
  STEGO: "#06d6d0",    // cyan
  COVER: "#6366f1",    // indigo
  High: "#ef4444",     // red
  Medium: "#f59e0b",   // amber
  Low: "#22c55e",      // green
};

/* ───── Heatmap color helper ───── */
function heatColor(score) {
  const abs = Math.min(Math.abs(score), 1);
  if (score > 0) {
    // warm: transparent → orange → red
    const r = Math.round(220 + 35 * abs);
    const g = Math.round(80 * (1 - abs));
    const b = Math.round(30 * (1 - abs));
    return `rgba(${r},${g},${b},${0.25 + abs * 0.65})`;
  }
  // cool: transparent → blue
  const r = Math.round(30 * (1 - abs));
  const g = Math.round(100 * (1 - abs));
  const b = Math.round(180 + 75 * abs);
  return `rgba(${r},${g},${b},${0.25 + abs * 0.55})`;
}

/* ───── Custom Tooltip for Pie ───── */
const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="glass-strong rounded-xl px-4 py-2.5 text-xs shadow-lg border border-border">
      <p className="font-semibold text-foreground">{name}</p>
      <p className="text-muted-foreground mt-0.5">{value} file{value !== 1 ? "s" : ""}</p>
    </div>
  );
};

/* ───── Custom Legend ───── */
const CustomLegend = ({ payload }) => (
  <div className="flex justify-center gap-5 mt-3">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-2 text-xs">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
        <span className="text-muted-foreground">{entry.value}</span>
      </div>
    ))}
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { results, error, reset } = useAnalysis();

  useEffect(() => {
    if ((!results || results.length === 0) && !error) {
      navigate("/upload", { replace: true });
    }
  }, [results, error, navigate]);

  if ((!results || results.length === 0) && !error) return null;

  const filesScanned = results.length;
  const threatsFound = results.filter((r) => r.prediction === "STEGO").length;
  const avgConfidence = filesScanned > 0
    ? (results.reduce((sum, r) => sum + (r.confidence || 0), 0) / filesScanned * 100).toFixed(1)
    : "0.0";
  const totalDuration = results.reduce((sum, r) => sum + (r.scan_duration || 0), 0).toFixed(1);

  /* ── Confidence bar data ── */
  const confidenceBarData = useMemo(() =>
    results.map((r) => ({
      name: (r.file_name || "File").length > 15 ? (r.file_name || "File").slice(0, 12) + "…" : (r.file_name || "File"),
      confidence: Math.round((r.confidence || 0) * 100),
      fullName: r.file_name,
      prediction: r.prediction,
    })),
    [results]);

  const riskPieData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    results.forEach((r) => { if (counts[r.risk_level] !== undefined) counts[r.risk_level]++; });
    return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [results]);

  /* ── Heatmap data ── */
  const heatmapData = useMemo(() => {
    // collect all unique feature names across all results
    const featureSet = new Set();
    results.forEach((r) => (r.top_features || []).forEach((f) => featureSet.add(f.feature)));
    const features = [...featureSet];

    const rows = results.map((r) => {
      const scores = {};
      (r.top_features || []).forEach((f) => { scores[f.feature] = f.influence_score; });
      return { fileName: r.file_name, scores };
    });

    // find the max absolute score for normalization
    let maxAbs = 0;
    rows.forEach((row) => Object.values(row.scores).forEach((s) => { if (Math.abs(s) > maxAbs) maxAbs = Math.abs(s); }));

    return { features, rows, maxAbs: maxAbs || 1 };
  }, [results]);

  const stats = [
    { icon: FileImage, label: "Files Scanned", value: String(filesScanned) },
    { icon: AlertTriangle, label: "Threats Found", value: String(threatsFound) },
    { icon: BarChart3, label: "Avg Confidence", value: `${avgConfidence}%` },
    { icon: Clock, label: "Scan Duration", value: `${totalDuration}s` },
  ];

  const handleNewScan = () => {
    reset();
    navigate("/upload");
  };

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
            <Button variant="cyberOutline" size="sm" onClick={handleNewScan}>
              <ArrowLeft className="w-4 h-4 mr-2" /> New Scan
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 mb-8 border border-destructive/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* ─── Stats ─── */}
        {filesScanned > 0 && (
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
        )}

        {/* ─── Pie Charts ─── */}
        {filesScanned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            {/* Confidence per File */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-sm">Confidence per File</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={confidenceBarData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 18%)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="glass-strong rounded-xl px-4 py-2.5 text-xs shadow-lg border border-border">
                          <p className="font-semibold text-foreground">{d.fullName}</p>
                          <p className="text-muted-foreground mt-0.5">{d.confidence}% confidence · {d.prediction}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="confidence" radius={[0, 6, 6, 0]} animationDuration={800}>
                    {confidenceBarData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.prediction === "STEGO" ? "#06d6d0" : "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Confidence Meter */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-sm">Confidence Meter</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {results.map((r, idx) => {
                  const pct = Math.round((r.confidence || 0) * 100);
                  const meterColor = pct <= 35 ? "#9fef44ff" : pct <= 80 ? "#eab308" : "#c52222ff";
                  const label = pct <= 35 ? "Low" : pct <= 80 ? "Medium" : "High";

                  // Gauge configuration
                  const cx = 100, cy = 94, R = 72;
                  // Map 0-100 to -180 to 0 degrees (Left to Right TOP arc)
                  const needleAngle = -180 + (pct / 100) * 180;

                  // Helper for arc path: x1,y1 to x2,y2
                  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
                    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
                    return {
                      x: centerX + radius * Math.cos(angleInRadians),
                      y: centerY + radius * Math.sin(angleInRadians)
                    };
                  };

                  const describeArc = (x, y, radius, startAngle, endAngle) => {
                    const start = polarToCartesian(x, y, radius, endAngle);
                    const end = polarToCartesian(x, y, radius, startAngle);
                    const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                    return [
                      "M", start.x, start.y,
                      "A", radius, radius, 0, arcSweep, 0, end.x, end.y
                    ].join(" ");
                  };

                  // Generate tick marks
                  const ticks = [];
                  for (let t = 0; t <= 100; t += 10) {
                    const deg = -180 + (t / 100) * 180;
                    const a = deg * Math.PI / 180;
                    const isMajor = t % 20 === 0;
                    const outerR = R + 4;
                    const innerR = isMajor ? R - 8 : R - 4;
                    ticks.push(
                      <line
                        key={t}
                        x1={cx + innerR * Math.cos(a)}
                        y1={cy + innerR * Math.sin(a)}
                        x2={cx + outerR * Math.cos(a)}
                        y2={cy + outerR * Math.sin(a)}
                        stroke={t <= 35 ? "#72ef44ff" : t <= 80 ? "#eab308" : "#c52222ff"}
                        strokeWidth={isMajor ? 1.5 : 0.8}
                        strokeOpacity={0.6}
                      />
                    );
                    if (isMajor) {
                      const labelR = R - 18;
                      ticks.push(
                        <text
                          key={`l${t}`}
                          x={cx + labelR * Math.cos(a)}
                          y={cy + labelR * Math.sin(a)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="hsl(220 10% 45%)"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {t}
                        </text>
                      );
                    }
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <svg width="220" height="135" viewBox="0 0 200 120">
                        <defs>
                          <filter id={`glow-${idx}`}>
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Region Segments */}
                        {/* Red: 0-35% (-180 to -117) */}
                        <path d={describeArc(cx, cy, R, -180, -117)} fill="none" stroke="#5bef44ff" strokeWidth="12" strokeLinecap="butt" strokeOpacity="0.2" />
                        {/* Yellow: 35-80% (-117 to -36) */}
                        <path d={describeArc(cx, cy, R, -117, -36)} fill="none" stroke="#eab308" strokeWidth="12" strokeLinecap="butt" strokeOpacity="0.2" />
                        {/* Green: 80-100% (-36 to 0) */}
                        <path d={describeArc(cx, cy, R, -36, 0)} fill="none" stroke="#c52222ff" strokeWidth="12" strokeLinecap="butt" strokeOpacity="0.2" />

                        {/* Active filled segment (glow effect) */}
                        <path
                          d={describeArc(cx, cy, R, -180, needleAngle)}
                          fill="none"
                          stroke={meterColor}
                          strokeWidth="12"
                          strokeLinecap="round"
                          style={{ filter: `drop-shadow(0 0 6px ${meterColor}66)` }}
                        />

                        {/* Ticks */}
                        {ticks}

                        {/* Central score and label */}
                        <text x={cx} y={cy - 10} textAnchor="middle" fill={meterColor} fontSize="28" fontWeight="900" fontFamily="monospace" style={{ filter: `drop-shadow(0 0 8px ${meterColor}44)` }}>
                          {pct}%
                        </text>
                        <text x={cx} y={cy + 10} textAnchor="middle" fill="hsl(220 10% 50%)" fontSize="10" fontFamily="sans-serif" fontWeight="700" letterSpacing="1.5">
                          {label.toUpperCase()}
                        </text>

                        {/* Needle */}
                        <g
                          style={{
                            transform: `rotate(${needleAngle}deg)`,
                            transformOrigin: `${cx}px ${cy}px`,
                            transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          }}
                        >
                          <line x1={cx} y1={cy} x2={cx + R + 5} y2={cy} stroke={meterColor} strokeWidth="3" strokeLinecap="round" />
                          <circle cx={cx} cy={cy} r="6" fill="hsl(220 10% 20%)" stroke={meterColor} strokeWidth="2" />
                        </g>
                      </svg>
                      <p className="text-xs text-muted-foreground mt-0 truncate max-w-[170px] text-center font-semibold" title={r.file_name}>
                        {r.file_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Feature Influence Heatmap ─── */}
        {heatmapData.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-2xl p-6 mb-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <Grid3X3 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-sm">Feature Influence Heatmap</h2>
            </div>

            {/* color legend */}
            <div className="flex items-center gap-3 mb-5 text-xs text-muted-foreground">
              <span>Negative</span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{
                background: "linear-gradient(to right, rgba(30,100,255,0.8), rgba(100,116,139,0.3), rgba(255,80,30,0.8))"
              }} />
              <span>Positive</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider sticky left-0 bg-background/80 backdrop-blur z-10 min-w-[120px]">
                      File
                    </th>
                    {heatmapData.features.map((f) => (
                      <th key={f} className="px-2 py-2 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                        <span className="block truncate max-w-[100px]" title={f}>{f}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.rows.map((row, ri) => (
                    <tr key={ri}>
                      <td className="px-3 py-2 text-xs font-medium truncate max-w-[140px] sticky left-0 bg-background/80 backdrop-blur z-10 border-t border-border/30" title={row.fileName}>
                        {row.fileName}
                      </td>
                      {heatmapData.features.map((f) => {
                        const raw = row.scores[f];
                        const normalized = raw !== undefined ? raw / heatmapData.maxAbs : 0;
                        return (
                          <td key={f} className="px-1 py-1.5 border-t border-border/30">
                            <div
                              className="rounded-lg px-2 py-2 text-center text-[11px] font-mono font-medium transition-all hover:scale-105 cursor-default"
                              style={{ backgroundColor: raw !== undefined ? heatColor(normalized) : "transparent" }}
                              title={`${f}: ${raw !== undefined ? raw.toFixed(6) : "N/A"}`}
                            >
                              {raw !== undefined ? (raw > 0 ? "+" : "") + raw.toFixed(4) : "—"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── Results Table ─── */}
        {filesScanned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl overflow-hidden mb-10"
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
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technique</th>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{result.file_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${riskBg(result.risk_level)}`}>
                          {result.risk_level === "High" ? <AlertTriangle className="w-3 h-3" /> : result.risk_level === "Low" ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          <span className={riskColor(result.risk_level)}>{result.risk_level}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{result.technique}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full gradient-cyan rounded-full" style={{ width: `${Math.round((result.confidence || 0) * 100)}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{Math.round((result.confidence || 0) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── AI Explanation ─── */}
        {results.some((r) => r.llm_explanation) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">AI Explanation</h2>
            </div>
            {results.map((result, i) =>
              result.llm_explanation ? (
                <div key={i} className="glass rounded-2xl p-6">
                  <p className="text-sm font-semibold text-primary mb-2">{result.file_name}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border mb-3 ${riskBg(result.risk_level)}`}>
                    <span className={riskColor(result.risk_level)}>{result.prediction}</span>
                  </span>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-2">{result.llm_explanation}</p>

                  {result.top_features && result.top_features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Top Contributing Features</p>
                      <div className="flex flex-wrap gap-2">
                        {result.top_features.map((f, fi) => (
                          <span key={fi} className="glass rounded-lg px-3 py-1.5 text-xs">
                            <span className="font-medium">{f.feature}</span>
                            <span className="text-muted-foreground ml-1.5">{f.influence_score > 0 ? "+" : ""}{f.influence_score.toFixed(4)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null
            )}
          </motion.div>
        )}
      </div>
    </SiteLayout>
  );
};

export default DashboardPage;
