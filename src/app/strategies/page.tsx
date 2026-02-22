"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── TOOLS DATA (11 indicators) ── */
const tools = [
  { id: 1, name: "LT Trade BP Symbol", role: "Identification instantanée", desc: "Affiche en temps réel l'instrument traité. Élimine les erreurs d'exécution dans un environnement multi-actifs et multi-écrans.", icon: "🎯", color: "#C9A84C" },
  { id: 2, name: "LT Trade Breakout Signal", role: "Rupture structurelle", desc: "Détecte les entrées potentielles via Engulfing + Order Blocks et Market Structure Shifts (MSS). Anticipe les zones d'accumulation/distribution.", icon: "⚡", color: "#2ECC71" },
  { id: 3, name: "LT Trade Daily H/L", role: "Liquidité de la veille", desc: "Trace le plus haut/bas de la veille — zones où se cachent les poches de liquidité visées par les institutions pour les stop hunts.", icon: "📊", color: "#3498DB" },
  { id: 4, name: "LT Trade GMC-OB", role: "Order Blocks en temps réel", desc: "IA spécialisée dans la reconnaissance des Order Blocks dès leur formation. Timing ultra-précis pour anticiper les retours de prix.", icon: "🧊", color: "#E67E22" },
  { id: 5, name: "OB Zone Pro", role: "Validation volumétrique", desc: "Mesure la solidité d'un OB via le volume institutionnel. Code couleur vert (haussier) / rouge (baissier) pour filtrer le bruit.", icon: "🔬", color: "#9B59B6" },
  { id: 6, name: "LT Trade ShowPips", role: "Performance en direct", desc: "Affiche pips, pourcentage et valeur monétaire en temps réel. Favorise la discipline émotionnelle et le suivi multi-trades.", icon: "💰", color: "#F39C12" },
  { id: 7, name: "LT Trade Trend Corridor", role: "Élasticité du marché", desc: "Canal adaptatif basé sur volume et volatilité. Indique la zone maximale de mouvement et la tendance via l'inclinaison.", icon: "📈", color: "#1ABC9C" },
  { id: 8, name: "AP LT Trade", role: "Zones extrêmes IA", desc: "IA d'analyse comportementale mesurant la pression achat/vente. Identifie les véritables extrêmes institutionnels, pas le simple bruit.", icon: "🧠", color: "#E74C3C" },
  { id: 9, name: "LT Trade Momentum", role: "Force du mouvement", desc: "Mesure la force réelle derrière un mouvement en pondérant flux d'ordres et volume effectif des gros acteurs. Déclencheur final.", icon: "🚀", color: "#C9A84C" },
  { id: 10, name: "LT Trade WorkTime", role: "Session asiatique", desc: "Surligne les fenêtres horaires de session. L'Asie crée un range 'tampon' que Londres/NY viennent balayer avant le vrai mouvement.", icon: "🌏", color: "#3498DB" },
  { id: 11, name: "LT Trade Davits Pivot", role: "Pivots × Fibonacci", desc: "Fusionne points pivots et ratios Fibonacci pour cartographier les niveaux d'intervention utilisés par les desks professionnels.", icon: "🎯", color: "#9B59B6" },
];

/* ── STRATEGIES DATA (6 strategies) ── */
const strategies = [
  {
    id: 1,
    name: "OB Momentum Corridor",
    subtitle: "Order Blocks validés + AP LT Trade AI + Momentum + Trend Corridor",
    objective: "Capturer un mouvement après retest d'Order Block, en profitant du flux institutionnel.",
    steps: [
      "Identifier l'Order Block validé (OB Zone Pro vert/rouge)",
      "Attendre le retour du prix dans l'OB",
      "Observer l'AP LT Trade AI en zone extrême",
      "Attendre le croisement Momentum dans le sens de la position",
      "Entrée à la clôture de la bougie de croisement",
      "SL derrière le dernier extrême, TP bande opposée du Corridor",
    ],
    filters: ["OB validé IA", "AP LT Trade extrême", "Croisement Momentum", "Trend Corridor"],
    example: { pair: "XAUUSD", tf: "M15", type: "Long", sl: "sous 3404", tp: "bande haute + ADR High 3440+" },
    image: "/strategy1.png",
    color: "#C9A84C",
  },
  {
    id: 2,
    name: "Corridor Re-Entry & Liquidity Grab",
    subtitle: "Trend Corridor + Momentum + AP LT Trade avec prise de liquidités",
    objective: "Entrer après que le marché ait effectué une prise de liquidités au-delà des bandes du Corridor.",
    steps: [
      "Observer la sortie complète du prix hors du Trend Corridor",
      "Confirmer la prise de liquidités (cassure d'un swing high/low)",
      "Surveiller la sortie simultanée du Momentum hors des bandes",
      "Attendre la réintégration : clôture à l'intérieur du Corridor",
      "Entrée + croisement Momentum confirmé",
      "SL derrière le dernier extrême, TP bande opposée",
    ],
    filters: ["Sortie Corridor", "Liquidity Grab", "Réintégration", "Croisement Momentum"],
    example: { pair: "EUR/USD", tf: "M15", type: "Short", sl: "au-dessus de la mèche haute", tp: "bande basse du Corridor" },
    image: "/strategy2.png",
    color: "#2ECC71",
  },
  {
    id: 3,
    name: "Scalping Directionnel MM200",
    subtitle: "MM200 M15 + AP LT Trade AI + exécution M1",
    objective: "Capturer des mouvements rapides en M1 dans le sens de la tendance M15 confirmée par la MM200.",
    steps: [
      "M15 : Vérifier la position du prix vs MM200 → biais directionnel",
      "M1 : Attendre l'AP LT Trade AI en zone extrême (survente/surachat)",
      "M1 : Vérifier la micro-structure Dow (HH/HL ou LH/LL)",
      "M1 : Attendre le croisement Momentum dans le sens du biais",
      "Entrée à la clôture de la bougie de confirmation",
      "SL sous le dernier creux/sommet, TP bande opposée du Corridor",
    ],
    filters: ["MM200 filtre M15", "AP LT Trade extrême M1", "Structure Dow", "Momentum M1"],
    example: { pair: "GBP/USD", tf: "M15→M1", type: "Multi-UT", sl: "sous le creux local", tp: "bande haute / sommet précédent" },
    image: "/strategy3.png",
    color: "#3498DB",
  },
  {
    id: 4,
    name: "Scalping Multi-TF Extrêmes",
    subtitle: "AP LT Trade AI M15 + Trend Corridor + Momentum → exécution M1",
    objective: "Exploiter les déséquilibres majeurs détectés en M15 pour des entrées haute précision en M1.",
    steps: [
      "M15 : Identifier une extrême sur AP LT Trade AI (liquidity grab)",
      "M15 : Vérifier la structure Dow et l'OB Pro si disponible",
      "M1 : Observer la sortie des bandes du Corridor ET du Momentum",
      "M1 : Attendre le croisement prix/Momentum en dehors des bandes",
      "M1 : Entrée à la clôture de la bougie réintégrant le Corridor",
      "SL derrière le dernier extrême M1, TP bande opposée M1",
    ],
    filters: ["Extrême M15", "Sortie Corridor M1", "Croisement Momentum", "Réintégration"],
    example: { pair: "XAU/USD", tf: "M15→M1", type: "Short", sl: "au-dessus de la mèche haute", tp: "bande basse / OB acheteur" },
    image: "/strategy4.png",
    color: "#E67E22",
  },
  {
    id: 5,
    name: "Prise de Liquidité de la Veille",
    subtitle: "Daily H/L + AP LT Trade AI + Trend Corridor + Momentum",
    objective: "Exploiter la chasse de liquidité au-delà des extrêmes de la veille pour des retournements intraday.",
    steps: [
      "Repérer les niveaux clés : plus haut / plus bas de la veille",
      "Attendre que le prix dépasse légèrement un de ces niveaux",
      "Confirmer l'AP LT Trade AI en zone extrême",
      "Observer la sortie prix + Momentum des bandes du Corridor",
      "Attendre le croisement + clôture à l'intérieur du Corridor",
      "SL derrière le spike, TP bande opposée M15",
    ],
    filters: ["Daily H/L cassé", "Stop Hunt confirmé", "AP LT Trade extrême", "Réintégration Corridor"],
    example: { pair: "EUR/USD", tf: "M15", type: "Short", sl: "au-dessus du spike (1.1060)", tp: "bande basse M15" },
    image: "/strategy5.png",
    color: "#9B59B6",
  },
  {
    id: 6,
    name: "Swing Trading Extrême",
    subtitle: "AP LT Trade AI + Engulfing + Momentum + Trend Corridor",
    objective: "Identifier un point de retournement majeur pour un mouvement swing sur plusieurs jours/semaines.",
    steps: [
      "Détecter un pic extrême sur AP LT Trade AI (surachat/survente)",
      "Confirmer la sortie du prix ET Momentum hors du Corridor",
      "Attendre le croisement prix/Momentum en dehors des bandes",
      "Chercher une Engulfing (haussière/baissière) → nouvel Order Block",
      "Entrée à la clôture de l'Engulfing validée",
      "SL derrière la zone clé, TP 1 bande opposée, TP 2 liquidité majeure",
    ],
    filters: ["Extrême AP LT Trade", "Engulfing", "Croisement hors bandes", "OB Pro validé"],
    example: { pair: "BTC/USD", tf: "M15+", type: "Swing Long", sl: "sous la mèche basse", tp: "bande haute / Daily High" },
    image: "/strategy6.png",
    color: "#E74C3C",
  },
];

/* ── INTERSECTION OBSERVER HOOK ── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FI({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(36px)", transition: `all .9s cubic-bezier(.16,1,.3,1) ${delay}ms` }} className={className}>
      {children}
    </div>
  );
}

/* ── TOOL CARD ── */
function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  return (
    <FI delay={index * 60}>
      <div style={{
        background: "var(--c1)", borderRadius: 16, padding: "28px 22px",
        border: "1px solid rgba(201,168,76,.05)", position: "relative", overflow: "hidden",
        transition: "all .4s", cursor: "default",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,.18)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgba(0,0,0,.35)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,.05)";
          (e.currentTarget as HTMLElement).style.transform = "none";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${tool.color},transparent)`, opacity: .4 }} />
        
        {/* Number badge */}
        <div style={{ position: "absolute", top: 14, right: 14, width: 28, height: 28, borderRadius: "50%", background: `${tool.color}15`, border: `1px solid ${tool.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tool.color, fontFamily: "'JetBrains Mono',monospace" }}>
          {tool.id}
        </div>

        <div style={{ fontSize: 28, marginBottom: 14 }}>{tool.icon}</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, marginBottom: 4, color: "var(--tx)" }}>{tool.name}</div>
        <div style={{ fontSize: 10, color: tool.color, letterSpacing: 2, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 12 }}>{tool.role}</div>
        <div style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.75 }}>{tool.desc}</div>
      </div>
    </FI>
  );
}

/* ── STRATEGY SECTION ── */
function StrategySection({ strategy, index }: { strategy: typeof strategies[0]; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <FI>
      <div style={{ marginBottom: 100 }}>
        {/* Strategy header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${strategy.color}20, ${strategy.color}08)`,
            border: `1px solid ${strategy.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700,
            color: strategy.color,
          }}>
            {strategy.id}
          </div>
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: "var(--tx)", lineHeight: 1.15 }}>
              {strategy.name}
            </h3>
            <p style={{ fontSize: 12, color: strategy.color, letterSpacing: 1.5, marginTop: 4 }}>{strategy.subtitle}</p>
          </div>
        </div>

        {/* Content grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* Left: details */}
          <div style={{ order: isEven ? 1 : 2 }}>
            {/* Objective */}
            <div style={{ background: "var(--c1)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(201,168,76,.08)", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 8 }}>Objectif</div>
              <p style={{ fontSize: 14, color: "var(--td)", lineHeight: 1.75 }}>{strategy.objective}</p>
            </div>

            {/* Steps */}
            <div style={{ background: "var(--c1)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(201,168,76,.08)", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 14 }}>Process</div>
              {strategy.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{
                    minWidth: 24, height: 24, borderRadius: "50%",
                    background: i === strategy.steps.length - 1 ? `linear-gradient(135deg,var(--g),var(--gd))` : "rgba(201,168,76,.08)",
                    border: `1px solid ${i === strategy.steps.length - 1 ? "transparent" : "rgba(201,168,76,.15)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                    color: i === strategy.steps.length - 1 ? "var(--bg)" : "var(--g)",
                    fontFamily: "'JetBrains Mono',monospace",
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.65 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 20 }}>
              {strategy.filters.map((f, i) => (
                <span key={i} style={{
                  padding: "5px 14px", borderRadius: 20,
                  background: `${strategy.color}10`, border: `1px solid ${strategy.color}25`,
                  fontSize: 11, color: strategy.color, fontWeight: 600, letterSpacing: .5,
                }}>
                  ✓ {f}
                </span>
              ))}
            </div>

            {/* Example trade */}
            <div style={{
              background: `linear-gradient(135deg, ${strategy.color}08, transparent)`,
              borderRadius: 14, padding: "18px 22px",
              border: `1px solid ${strategy.color}20`,
            }}>
              <div style={{ fontSize: 10, color: strategy.color, letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 10 }}>Exemple de Trade</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["Paire", strategy.example.pair],
                  ["Timeframe", strategy.example.tf],
                  ["Type", strategy.example.type],
                  ["SL", strategy.example.sl],
                  ["TP", strategy.example.tp],
                ].map(([label, val], i) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--td)" }}>
                    <span style={{ color: "var(--tm)", fontSize: 10, letterSpacing: 1 }}>{label}: </span>
                    <span style={{ fontWeight: 600, color: "var(--tx)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: chart image */}
          <div style={{ order: isEven ? 2 : 1 }}>
            <div style={{
              background: "var(--c1)", borderRadius: 18, overflow: "hidden",
              border: "1px solid rgba(201,168,76,.08)", position: "relative",
              aspectRatio: "16/10",
            }}>
              {/* Image placeholder — will be replaced */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(135deg, ${strategy.color}10, var(--c2))`,
                display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
                gap: 12,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: `${strategy.color}15`, border: `2px solid ${strategy.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: strategy.color,
                }}>
                  {strategy.id}
                </div>
                <div style={{ fontSize: 11, color: "var(--tm)", letterSpacing: 2 }}>CHART SCREENSHOT</div>
                <div style={{ fontSize: 10, color: "var(--tm)" }}>{strategy.image}</div>
              </div>
              {/* Uncomment when image is added:
              <img src={strategy.image} alt={strategy.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              */}
            </div>
            {/* Caption */}
            <div style={{ textAlign: "center" as const, marginTop: 12, fontSize: 11, color: "var(--tm)" }}>
              {strategy.example.pair} • {strategy.example.tf} — {strategy.name}
            </div>
          </div>
        </div>
      </div>
    </FI>
  );
}

/* ── MAIN PAGE ── */
export default function StrategiesPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      {/* NAVBAR (simplified) */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(6,6,11,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,.06)" : "1px solid transparent",
        transition: "all .5s",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66, padding: "0 28px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, color: "var(--tx)", textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "conic-gradient(from 0deg,var(--g),var(--gd),var(--g))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 18, color: "var(--bg)",
              fontFamily: "'Cormorant Garamond',serif",
              boxShadow: "0 0 24px rgba(201,168,76,.25)",
            }}>A</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, letterSpacing: 3 }}>AUREUS</div>
              <div style={{ fontSize: 8, color: "var(--gd)", letterSpacing: 3, textTransform: "uppercase" as const, marginTop: -2 }}>Tools & Strategies</div>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Link href="/" style={{ color: "var(--td)", fontSize: 10.5, fontWeight: 500, letterSpacing: 1.8, textTransform: "uppercase" as const, textDecoration: "none" }}>← Back to Home</Link>
            <a href="#tools" style={{ color: "var(--td)", fontSize: 10.5, fontWeight: 500, letterSpacing: 1.8, textTransform: "uppercase" as const, textDecoration: "none" }}>Tools</a>
            <a href="#strategies" style={{ color: "var(--td)", fontSize: 10.5, fontWeight: 500, letterSpacing: 1.8, textTransform: "uppercase" as const, textDecoration: "none" }}>Strategies</a>
            <Link href="/#pricing" style={{
              padding: "10px 20px", borderRadius: 6,
              background: "linear-gradient(135deg,var(--g),var(--gd))",
              color: "var(--bg)", fontWeight: 700, fontSize: 10.5, letterSpacing: 1.5,
              textDecoration: "none", textTransform: "uppercase" as const,
              boxShadow: "0 4px 16px rgba(201,168,76,.25)",
            }}>BOOK A CALL</Link>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 100 }}>
        {/* Background mesh */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -5%,rgba(201,168,76,.07),transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 35% 35% at 25% 30%,rgba(201,168,76,.04),transparent),radial-gradient(ellipse 30% 30% at 75% 60%,rgba(201,168,76,.03),transparent)" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" as const, position: "relative", zIndex: 2, padding: "0 28px" }}>
          <FI>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 50, border: "1px solid rgba(201,168,76,.2)", background: "rgba(201,168,76,.04)", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gr)", animation: "pls 2s infinite" }} />
              <span style={{ fontSize: 11, color: "var(--g)", letterSpacing: 2.5, fontWeight: 600 }}>AUREUS AI — INSTITUTIONAL METHODOLOGY</span>
            </div>
          </FI>

          <FI delay={100}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.08, margin: "0 0 24px" }}>
              The <span style={{ background: "linear-gradient(135deg,#E8D48B,#C9A84C,#A07C2A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Institutional</span> Edge
            </h1>
          </FI>

          <FI delay={200}>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "var(--td)", lineHeight: 1.8, maxWidth: 680, margin: "0 auto 16px", fontStyle: "italic" as const }}>
              Precision, Discipline, Profitability
            </p>
          </FI>

          <FI delay={300}>
            <p style={{ fontSize: 15, color: "var(--td)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 38px" }}>
              11 outils IA institutionnels. 6 stratégies éprouvées. Un arsenal complet pour décoder le marché tel qu&apos;il est réellement — un pont entre vous et les institutions.
            </p>
          </FI>

          <FI delay={400}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
              <a href="#tools" style={{
                display: "inline-block", padding: "15px 32px", borderRadius: 8,
                background: "linear-gradient(135deg,var(--g),var(--gd))",
                color: "var(--bg)", fontWeight: 700, fontSize: 14, textDecoration: "none",
                boxShadow: "0 8px 32px rgba(201,168,76,.3)", transition: "all .3s",
              }}>Discover the Arsenal</a>
              <a href="#strategies" style={{
                display: "inline-block", padding: "15px 32px", borderRadius: 8,
                border: "1px solid rgba(201,168,76,.3)", background: "rgba(201,168,76,.04)",
                color: "var(--g)", fontWeight: 600, fontSize: 14, textDecoration: "none",
                transition: "all .3s",
              }}>View Strategies →</a>
            </div>
          </FI>
        </div>
      </section>

      {/* ═══════ 11 TOOLS ═══════ */}
      <section id="tools" style={{ padding: "100px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FI>
            <div style={{ textAlign: "center" as const, marginBottom: 70 }}>
              <span style={{ fontSize: 11, color: "var(--g)", letterSpacing: 5, textTransform: "uppercase" as const, fontWeight: 600 }}>Arsenal</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, margin: "14px 0 0", lineHeight: 1.15 }}>
                11 AI-Powered Indicators
              </h2>
              <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,transparent,var(--g),transparent)", margin: "20px auto 0" }} />
              <p style={{ fontSize: 16, color: "var(--td)", textAlign: "center" as const, lineHeight: 1.8, maxWidth: 640, margin: "24px auto 0" }}>
                Chaque outil est une pièce d&apos;armure. L&apos;ensemble constitue un arsenal capable de transformer votre vision du trading.
              </p>
            </div>
          </FI>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DOW THEORY BRIDGE ═══════ */}
      <section style={{ padding: "80px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,var(--bg),transparent 15%,transparent 85%,var(--bg))" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <FI>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 700, color: "var(--tx)", marginBottom: 20 }}>
                La <span style={{ background: "linear-gradient(135deg,#E8D48B,#C9A84C,#A07C2A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Théorie de Dow</span> — Le Socle
              </div>
              <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,transparent,var(--g),transparent)", margin: "0 auto 28px" }} />
            </div>
          </FI>

          <FI delay={100}>
            <div style={{
              background: "var(--c1)", borderRadius: 18, padding: "36px 32px",
              border: "1px solid rgba(201,168,76,.08)",
            }}>
              <p style={{ fontSize: 15, color: "var(--td)", lineHeight: 1.85, marginBottom: 20 }}>
                La structure du marché agit comme un <strong style={{ color: "var(--g)" }}>GPS institutionnel</strong>. Sans elle, les signaux deviennent contradictoires. Avec elle, chaque outil prend son sens.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["AP LT Trade AI", "Indicateur d'excès pertinent"],
                  ["Momentum", "Confirmation de retournement"],
                  ["Order Blocks", "Zones de réaction haute probabilité"],
                  ["Trend Corridor", "Canal d'élasticité cohérent"],
                ].map(([tool, role], i) => (
                  <div key={i} style={{
                    padding: "14px 18px", borderRadius: 10,
                    background: "rgba(201,168,76,.03)", border: "1px solid rgba(201,168,76,.06)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--g)", marginBottom: 4 }}>{tool}</div>
                    <div style={{ fontSize: 12, color: "var(--td)" }}>→ {role}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 14, color: "var(--td)", lineHeight: 1.8, marginTop: 20, fontStyle: "italic" as const, textAlign: "center" as const }}>
                &ldquo;Nous n&apos;entrons jamais par hasard. Chaque position est le fruit d&apos;une structure claire, d&apos;une validation IA, et d&apos;un point d&apos;exécution statistiquement optimal.&rdquo;
              </p>
            </div>
          </FI>
        </div>
      </section>

      {/* ═══════ 6 STRATEGIES ═══════ */}
      <section id="strategies" style={{ padding: "100px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FI>
            <div style={{ textAlign: "center" as const, marginBottom: 80 }}>
              <span style={{ fontSize: 11, color: "var(--g)", letterSpacing: 5, textTransform: "uppercase" as const, fontWeight: 600 }}>Battle-Tested</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, margin: "14px 0 0", lineHeight: 1.15 }}>
                6 Institutional Strategies
              </h2>
              <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,transparent,var(--g),transparent)", margin: "20px auto 0" }} />
              <p style={{ fontSize: 16, color: "var(--td)", lineHeight: 1.8, maxWidth: 640, margin: "24px auto 0" }}>
                Du scalping au swing trading — chaque stratégie combine la Théorie de Dow comme filtre primaire avec les outils IA comme catalyseurs.
              </p>
            </div>
          </FI>

          {strategies.map((strategy, i) => (
            <StrategySection key={strategy.id} strategy={strategy} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section style={{ padding: "100px 28px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" as const }}>
          <FI>
            <div style={{
              background: "var(--c1)", borderRadius: 24, padding: "60px 40px",
              border: "1px solid rgba(201,168,76,.1)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(201,168,76,.06),transparent 70%)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, marginBottom: 16, lineHeight: 1.15 }}>
                  Ready to Enter the <span style={{ background: "linear-gradient(135deg,#E8D48B,#C9A84C,#A07C2A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arena</span>?
                </h3>
                <p style={{ fontSize: 15, color: "var(--td)", lineHeight: 1.8, marginBottom: 32 }}>
                  Vous tenez entre vos mains une clé rare. À vous de décider si elle ouvrira simplement une porte… ou si elle deviendra l&apos;instrument de votre propre transformation.
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
                  <Link href="/#pricing" style={{
                    display: "inline-block", padding: "16px 36px", borderRadius: 8,
                    background: "linear-gradient(135deg,var(--g),var(--gd))",
                    color: "var(--bg)", fontWeight: 700, fontSize: 14, textDecoration: "none",
                    boxShadow: "0 8px 32px rgba(201,168,76,.3)", transition: "all .3s",
                    letterSpacing: 1,
                  }}>BOOK A CALL</Link>
                  <Link href="/" style={{
                    display: "inline-block", padding: "16px 36px", borderRadius: 8,
                    border: "1px solid rgba(201,168,76,.3)", background: "rgba(201,168,76,.04)",
                    color: "var(--g)", fontWeight: 600, fontSize: 14, textDecoration: "none",
                  }}>← Back to Home</Link>
                </div>
              </div>
            </div>
          </FI>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ padding: "40px 28px 30px", borderTop: "1px solid rgba(201,168,76,.06)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" as const }}>
          <p style={{ fontSize: 12, color: "var(--tm)", lineHeight: 1.65 }}>
            AI-powered market analysis. Educational & analytical — not financial advice.
          </p>
          <p style={{ fontSize: 11, color: "var(--tm)", marginTop: 8 }}>
            © 2025 Aureus IA SPRL — BCE BE 1028.230.781 — All rights reserved
          </p>
        </div>
      </footer>

      {/* ═══════ RESPONSIVE ═══════ */}
      <style jsx global>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="order: 2"] {
            order: 1 !important;
          }
          div[style*="order: 1"] {
            order: 2 !important;
          }
        }
      `}</style>
    </>
  );
}
