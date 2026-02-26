/**
 * IntroScreen.jsx
 * ─────────────────────────────────────────────────────────────
 * Cinematic intro splash for StegoInsight.
 * Drop this anywhere in your app and wrap your main content:
 *
 *   <IntroScreen onComplete={() => setShowApp(true)} />
 *
 * Props:
 *   onComplete  — called when intro finishes (auto or via skip)
 *   duration    — total ms before auto-advance (default: 9000)
 *
 * Dependencies: framer-motion  →  npm install framer-motion
 * Fonts loaded via index.html / global CSS (Orbitron + JetBrains Mono)
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ── Timing map (ms from intro start) ──────────────────────── */
const T = {
  GRID_IN:         300,   // background grid fades in
  RING_1:          800,   // first ring expands
  RING_2:          1200,  // second ring
  RING_3:          1600,  // third ring
  LOGO_IN:         2000,  // logo mark appears
  SCAN_START:      2800,  // horizontal scan beam fires
  SCAN_END:        4400,  // scan beam exits
  LOGO_TEXT:       3200,  // "STEGOSHIELD" letter-by-letter
  TAGLINE:         4800,  // tagline fades in
  STATUS_1:        5400,  // status line 1
  STATUS_2:        6200,  // status line 2
  STATUS_3:        7000,  // status line 3 — "SYSTEM READY"
  ENTER_BTN:       7600,  // Enter App button appears
  AUTO_EXIT:       9200,  // auto-advance
  EXIT_DURATION:    800,  // curtain wipe duration
};

const LOGO_TEXT   = "STEGOINSIGHT";
const LOGO_ACCENT = 5; // chars before accent split → "STEGO" | "SHIELD"

const STATUS_LINES = 
 [
  "Machine Learning–based steganography detection",
  "Binary classification using Logistic Regression (Stego vs Non-Stego)",
  "Probability-based prediction with interpretable confidence scores",
  "No deep learning or neural networks involved",
  "Fast and explainable results",
  "Visual output using confidence meters and risk indicators"

];

/* ── Easing presets ─────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];         // expo out — snappy but smooth
const easeIn = [0.4, 0, 1, 1];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function IntroScreen({ onComplete, duration = T.AUTO_EXIT }) {

  const navigate = useNavigate();
  const [phase, setPhase]         = useState("idle"); // idle | running | exiting | done
  const [rings, setRings]         = useState([]);      // [1,2,3] progressively
  const [showLogo, setShowLogo]   = useState(false);
  const [scanActive, setScan]     = useState(false);
  const [chars, setChars]         = useState([]);      // revealed logo chars
  const [showTag, setShowTag]     = useState(false);
  const [statusIdx, setStatus]    = useState(-1);      // -1 = none shown
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting]     = useState(false);

  const timerRefs = useRef([]);

  /* register all timers so skip can clear them */
  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timerRefs.current.push(id);
  };

  const clearAll = () => timerRefs.current.forEach(clearTimeout);

  /* ── Start sequence ──────────────────────────────────────── */
  useEffect(() => {
    setPhase("running");

    after(T.RING_1,    () => setRings(r => [...r, 1]));
    after(T.RING_2,    () => setRings(r => [...r, 2]));
    after(T.RING_3,    () => setRings(r => [...r, 3]));
    after(T.LOGO_IN,   () => setShowLogo(true));
    after(T.SCAN_START,() => setScan(true));
    after(T.SCAN_END,  () => setScan(false));

    /* letter-by-letter reveal */
    LOGO_TEXT.split("").forEach((_, i) => {
      after(T.LOGO_TEXT + i * 55, () =>
        setChars(c => [...c, i])
      );
    });

    after(T.TAGLINE,   () => setShowTag(true));
    after(T.STATUS_1,  () => setStatus(0));
    after(T.STATUS_2,  () => setStatus(1));
    after(T.STATUS_3,  () => setStatus(2));
    after(T.ENTER_BTN, () => setShowEnter(true));
    after(T.AUTO_EXIT, () => exit());

    return clearAll;
  }, []);

  /* ── Exit sequence ───────────────────────────────────────── */
  const exit = () => {
    clearAll();
    setExiting(true);
    setTimeout(() => {
      setPhase("done");
      onComplete?.();
      navigate("/landing");
    }, T.EXIT_DURATION + 100);
  };

  if (phase === "done") return null;

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: T.EXIT_DURATION / 1000, ease: easeIn }}
          style={styles.root}
        >
          {/* ── Background video ──────────────────────────── */}
          <video
            style={styles.video}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://videos.pexels.com/video-files/3129674/3129674-sd_640_360_30fps.mp4" type="video/mp4" />
          </video>

          {/* ── Video overlay gradient ──────────────────── */}
          <div style={styles.videoOverlay} />

          {/* ── Skip button ────────────────────────────────── */}
          <motion.button
            style={styles.skipBtn}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            onClick={exit}
            whileHover={{ color: "#00c8ff", borderColor: "#00c8ff" }}
          >
            SKIP INTRO ›
          </motion.button>

          {/* ── Animated background grid ───────────────────── */}
          <motion.div
            style={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: T.GRID_IN / 1000, duration: 1.2 }}
          />

          {/* ── Ambient glow orbs ──────────────────────────── */}
          <div style={{ ...styles.orb, ...styles.orbTL }} />
          <div style={{ ...styles.orb, ...styles.orbBR }} />

          {/* ── Expanding rings ────────────────────────────── */}
          {rings.map(r => (
            <Ring key={r} delay={0} size={r * 160 + 200} />
          ))}

          {/* ── Center stage ───────────────────────────────── */}
          <div style={styles.center}>

            {/* Logo mark (hexagon shield) */}
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  style={styles.logoMark}
                  initial={{ scale: 0, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.7, ease }}
                >
                  <ShieldIcon scanActive={scanActive} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan beam */}
            <AnimatePresence>
              {scanActive && (
                <motion.div
                  style={styles.scanBeam}
                  initial={{ scaleX: 0, opacity: 0, originX: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease }}
                />
              )}
            </AnimatePresence>

            {/* Logo wordmark — letter by letter */}
            <div style={styles.wordmark} aria-label={LOGO_TEXT}>
              {LOGO_TEXT.split("").map((char, i) => (
                <motion.span
                  key={i}
                  style={{
                    ...styles.wordChar,
                    color: i < LOGO_ACCENT ? "#e8f4ff" : "#00c8ff",
                    textShadow: i >= LOGO_ACCENT
                      ? "0 0 20px rgba(0,200,255,.6), 0 0 40px rgba(0,200,255,.3)"
                      : "none",
                  }}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={
                    chars.includes(i)
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{ duration: 0.35, ease }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Separator line */}
            <AnimatePresence>
              {showTag && (
                <motion.div
                  style={styles.separator}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease }}
                />
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {showTag && (
                <motion.p
                  style={styles.tagline}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease }}
                >
                  AI-POWERED STEGANOGRAPHY DETECTION
                </motion.p>
              )}
            </AnimatePresence>

            {/* Status lines */}
            <div style={styles.statusBlock}>
              {STATUS_LINES.map((line, i) => (
                <StatusLine
                  key={i}
                  text={line}
                  visible={statusIdx >= i}
                  isFinal={i === STATUS_LINES.length - 1}
                />
              ))}
            </div>

            {/* Enter App button */}
            <AnimatePresence>
              {showEnter && (
                <motion.button
                  style={styles.enterBtn}
                  initial={{ opacity: 0, y: 16, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease }}
                  onClick={exit}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 0 40px rgba(0,200,255,.45), 0 0 80px rgba(0,200,255,.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <EnterBtnContent />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Corner decorations ──────────────────────────── */}
          {["tl","tr","bl","br"].map(pos => (
            <motion.div
              key={pos}
              style={{ ...styles.corner, ...styles[`corner_${pos}`] }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + ["tl","tr","bl","br"].indexOf(pos) * 0.1, duration: 0.5, ease }}
            />
          ))}

          {/* ── Curtain exit overlay ────────────────────────── */}
          <AnimatePresence>
            {exiting && (
              <motion.div
                style={styles.curtain}
                initial={{ scaleY: 0, originY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: T.EXIT_DURATION / 1000, ease: easeIn }}
              />
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

/** Expanding pulse ring */
function Ring({ size }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: "50%",
        border: "1px solid rgba(0,200,255,0.15)",
        top: "50%", left: "50%",
        x: "-50%", y: "-50%",
        pointerEvents: "none",
      }}
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 0 }}
      transition={{ duration: 2.5, ease: [0.0, 0.6, 0.4, 1] }}
    />
  );
}

/** Shield SVG with inner scan glow */
function ShieldIcon({ scanActive }) {
  return (
    <svg width="88" height="100" viewBox="0 0 88 100" fill="none">
      {/* Outer shield */}
      <path
        d="M44 4L8 18v28c0 24 16 42 36 50 20-8 36-26 36-50V18L44 4z"
        stroke="#00c8ff"
        strokeWidth="1.5"
        fill="rgba(0,200,255,0.06)"
        style={{ filter: "drop-shadow(0 0 8px rgba(0,200,255,0.4))" }}
      />
      {/* Inner shield accent */}
      <path
        d="M44 14L16 25v22c0 18 12 32 28 39 16-7 28-21 28-39V25L44 14z"
        stroke="rgba(0,200,255,0.3)"
        strokeWidth="1"
        fill="rgba(0,200,255,0.03)"
      />
      {/* AI eye / scan reticle */}
      <circle cx="44" cy="47" r="10" stroke="#00c8ff" strokeWidth="1.2"
        fill="none" style={{ filter: "drop-shadow(0 0 4px rgba(0,200,255,0.6))" }} />
      <circle cx="44" cy="47" r="4" fill="#00c8ff"
        style={{ filter: "drop-shadow(0 0 8px #00c8ff)" }} />
      {/* Cross-hair lines */}
      <line x1="44" y1="34" x2="44" y2="39" stroke="rgba(0,200,255,0.5)" strokeWidth="1" />
      <line x1="44" y1="55" x2="44" y2="60" stroke="rgba(0,200,255,0.5)" strokeWidth="1" />
      <line x1="31" y1="47" x2="36" y2="47" stroke="rgba(0,200,255,0.5)" strokeWidth="1" />
      <line x1="52" y1="47" x2="57" y2="47" stroke="rgba(0,200,255,0.5)" strokeWidth="1" />
      {/* Scan glow when active */}
      {scanActive && (
        <rect x="16" y="46" width="56" height="2" rx="1"
          fill="rgba(0,200,255,0.35)"
          style={{ filter: "drop-shadow(0 0 6px #00c8ff)", animation: "none" }}
        />
      )}
    </svg>
  );
}

/** Typewriter status line */
function StatusLine({ text, visible, isFinal }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [visible, text]);

  if (!visible && displayed === "") return (
    <div style={styles.statusLine}>&nbsp;</div>
  );

  return (
    <motion.div
      style={{
        ...styles.statusLine,
        color: isFinal ? "#00ffaa" : "rgba(106,138,170,0.9)",
        textShadow: isFinal ? "0 0 12px rgba(0,255,170,0.5)" : "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span style={styles.prompt}>{isFinal ? "✓" : "›"}</span>
      {displayed}
      {displayed.length < text.length && (
        <span style={styles.caret}>▋</span>
      )}
    </motion.div>
  );
}

/** Enter button with animated border */
function EnterBtnContent() {
  return (
    <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "#00c8ff",
        boxShadow: "0 0 8px #00c8ff",
        animation: "pulse 1.4s ease-in-out infinite",
      }} />
      ENTER STEGOINSIGHT
      <span style={{ opacity: 0.6, fontSize: "0.9em" }}>→</span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   STYLES (inline — zero className dependencies)
══════════════════════════════════════════════════════════════ */
const styles = {
  root: {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "#020810",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  },

  video: {
    position: "absolute", inset: 0,
    width: "100%", height: "100%",
    objectFit: "cover",
    opacity: 0.5,
    pointerEvents: "none",
  },

  videoOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(135deg, rgba(2,8,16,0.7) 0%, rgba(20,40,80,0.5) 50%, rgba(2,8,16,0.7) 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },

  skipBtn: {
    position: "absolute", top: 24, right: 28, zIndex: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.72rem", letterSpacing: "0.14em",
    color: "rgba(106,138,170,0.7)",
    background: "rgba(2,8,16,0.7)", backdropFilter: "blur(10px)",
    border: "1px solid rgba(0,200,255,0.18)",
    padding: "7px 16px", borderRadius: 20,
    cursor: "pointer", transition: "color .2s, border-color .2s",
  },

  grid: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(0,200,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.035) 1px, transparent 1px)
    `,
    backgroundSize: "64px 64px",
  },

  orb: {
    position: "absolute", borderRadius: "50%", pointerEvents: "none",
    filter: "blur(80px)",
  },
  orbTL: {
    width: 600, height: 600, top: "-20%", left: "-15%",
    background: "radial-gradient(circle, rgba(0,80,255,0.08) 0%, transparent 70%)",
  },
  orbBR: {
    width: 500, height: 500, bottom: "-15%", right: "-10%",
    background: "radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)",
  },

  center: {
    position: "relative", zIndex: 5,
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 0,
  },

  logoMark: { marginBottom: 24 },

  scanBeam: {
    position: "absolute",
    top: "50%", left: "50%",
    width: "300px", height: "2px",
    marginLeft: "-150px", marginTop: "-52px",
    background: "linear-gradient(90deg, transparent, #00c8ff, transparent)",
    boxShadow: "0 0 16px 4px rgba(0,200,255,0.3)",
    borderRadius: 2,
  },

  wordmark: {
    display: "flex", alignItems: "baseline",
    fontFamily: "'Orbitron', 'JetBrains Mono', monospace",
    fontSize: "clamp(2rem, 6vw, 3.8rem)",
    fontWeight: 900, letterSpacing: "0.18em",
    marginBottom: 16,
    userSelect: "none",
  },
  wordChar: {
    display: "inline-block",
    transition: "none",
  },

  separator: {
    width: 220, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)",
    marginBottom: 12,
    transformOrigin: "center",
  },

  tagline: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.72rem", letterSpacing: "0.22em",
    color: "rgba(106,138,170,0.8)",
    marginBottom: 36, textAlign: "center",
  },

  statusBlock: {
    display: "flex", flexDirection: "column", gap: 6,
    minHeight: 80, marginBottom: 32,
    alignSelf: "flex-start", minWidth: 360,
  },

  statusLine: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.73rem", letterSpacing: "0.08em",
    display: "flex", alignItems: "center", gap: 8,
    minHeight: 20,
  },

  prompt: { color: "rgba(0,200,255,0.5)", fontWeight: 700 },

  caret: {
    display: "inline-block",
    color: "#00c8ff",
    animation: "blink 1s step-end infinite",
  },

  enterBtn: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.14em",
    color: "white",
    background: "linear-gradient(135deg, #0055cc, #00c8ff)",
    border: "none", borderRadius: 8,
    padding: "15px 40px", cursor: "pointer",
    boxShadow: "0 0 24px rgba(0,200,255,0.25), 0 0 48px rgba(0,200,255,0.1)",
    transition: "box-shadow 0.3s ease",
  },

  /* Corner decorations */
  corner: {
    position: "absolute", width: 20, height: 20, pointerEvents: "none",
  },
  corner_tl: {
    top: 24, left: 24,
    borderTop: "2px solid rgba(0,200,255,0.5)",
    borderLeft: "2px solid rgba(0,200,255,0.5)",
  },
  corner_tr: {
    top: 24, right: 24,
    borderTop: "2px solid rgba(0,200,255,0.5)",
    borderRight: "2px solid rgba(0,200,255,0.5)",
  },
  corner_bl: {
    bottom: 24, left: 24,
    borderBottom: "2px solid rgba(0,200,255,0.5)",
    borderLeft: "2px solid rgba(0,200,255,0.5)",
  },
  corner_br: {
    bottom: 24, right: 24,
    borderBottom: "2px solid rgba(0,200,255,0.5)",
    borderRight: "2px solid rgba(0,200,255,0.5)",
  },

  curtain: {
    position: "absolute", inset: 0,
    background: "#020810",
    transformOrigin: "top",
    zIndex: 20,
  },
};
