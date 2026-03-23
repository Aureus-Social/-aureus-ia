"use client";
import { useState, useEffect, useRef } from "react";
import { t, langNames, type Lang } from "./translations";
import { cL, getTools, getStrategies, getServices, getHubFeatures } from "./content-data";
import { termsContent } from "./terms-content";
import { privacyContent } from "./privacy-content";
import { bookingT, timeSlots } from "./booking";

const tickerData = [
  { s: "XAUUSD", p: "5,216.59", c: "+1.22%", up: true },
  { s: "EURUSD", p: "1.1806", c: "+0.02%", up: true },
  { s: "BTCUSD", p: "67,921", c: "+0.36%", up: true },
  { s: "US500", p: "6,012.8", c: "-0.32%", up: false },
  { s: "GBPUSD", p: "1.3477", c: "-0.04%", up: false },
  { s: "USDJPY", p: "155.88", c: "-0.12%", up: false },
  { s: "XAGUSD", p: "89.54", c: "+1.40%", up: true },
];

const reviewsData = [
  { n: "Marc D.", r: "Independent Trader", t_txt: "Aureus IA has completely transformed my analytical approach. The AI indicators detect patterns I would never have seen. Exceptional." },
  { n: "Sophie L.", r: "Financial Analyst", t_txt: "The coaching with our founder is incredibly valuable. 13 years of expertise distilled into actionable insights. The platform is next-level." },
  { n: "Thomas B.", r: "Portfolio Manager", t_txt: "Finally an AI tool that delivers real analytical depth. The institutional-grade approach is exactly what I needed." },
  { n: "Elena K.", r: "Data Scientist", t_txt: "From a technical standpoint, the AI models behind Aureus IA are impressive. Pattern recognition accuracy is truly remarkable." },
  { n: "Pierre V.", r: "Day Trader", t_txt: "The Discovery Day was a game-changer. A full day of immersion that gave me a completely new perspective on market analysis." },
];

const indicators = [
  { n: "Trend Matrix Pro", d: "Multi-timeframe trend detection", c: "#C9A84C" },
  { n: "Volume Surge AI", d: "Institutional volume analysis", c: "#2ECC71" },
  { n: "Fibonacci Neural", d: "AI-optimized Fibonacci levels", c: "#3498DB" },
  { n: "Order Flow Scanner", d: "Real-time order flow mapping", c: "#E67E22" },
  { n: "Momentum Pulse", d: "Dynamic momentum oscillator", c: "#9B59B6" },
  { n: "Support/Resistance AI", d: "Auto-detected key levels", c: "#E74C3C" },
  { n: "Divergence Hunter", d: "Hidden divergence detection", c: "#1ABC9C" },
  { n: "Volatility Shield", d: "Smart volatility filter", c: "#F39C12" },
  { n: "Candlestick AI", d: "Pattern recognition engine", c: "#E74C3C" },
  { n: "Correlation Radar", d: "Cross-asset correlation map", c: "#3498DB" },
  { n: "Risk Manager Pro", d: "Dynamic position sizing", c: "#2ECC71" },
];

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

function FI({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return <div ref={ref} className={`fi ${visible ? "v" : ""} ${className}`}>{children}</div>;
}

function SH({ tag, title, desc }: { tag: string; title: string; desc?: string }) {
  return (
    <div className="sh">
      <span className="tag">{tag}</span>
      <h2 className="st2">{title}</h2>
      <div className="sl" />
      {desc && <p className="sd" dangerouslySetInnerHTML={{ __html: desc }} />}
    </div>
  );
}

function Ticker() {
  const d = [...tickerData, ...tickerData];
  return (
    <div className="tk"><div className="tki">
      {d.map((tk, i) => (
        <span key={i}><span className="ts">{tk.s}</span>{" "}<span className="tp">{tk.p}</span>{" "}<span className={tk.up ? "tu" : "td2"}>{tk.c}</span></span>
      ))}
    </div></div>
  );
}

function Typewriter({ lang }: { lang: Lang }) {
  const L = t[lang];
  const words = [L.hero_tw1, L.hero_tw2, L.hero_tw3, L.hero_tw4, L.hero_tw5];
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => { setWi(0); setCi(0); setDel(false); }, [lang]);
  useEffect(() => {
    const tm = setTimeout(() => {
      if (!del) {
        if (ci < words[wi].length) setCi(ci + 1);
        else setTimeout(() => setDel(true), 2200);
      } else {
        if (ci > 0) setCi(ci - 1);
        else { setDel(false); setWi((wi + 1) % words.length); }
      }
    }, del ? 45 : 85);
    return () => clearTimeout(tm);
  }, [ci, del, wi, words]);
  return <span className="gld" id="tw">{words[wi].substring(0, ci)}</span>;
}

function LiveChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = c.width, H = c.height;
    const data: number[] = [];
    let price = 2650 + Math.random() * 50;
    for (let i = 0; i < 200; i++) { price += (Math.random() - 0.48) * 4; data.push(price); }
    let raf: number;
    const draw = () => {
      price += (Math.random() - 0.48) * 3; data.push(price);
      if (data.length > 300) data.shift();
      const mn = Math.min(...data) - 5, mx = Math.max(...data) + 5, rn = mx - mn;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(201,168,76,.18)"); g.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath(); ctx.moveTo(0, H);
      data.forEach((v, i) => ctx.lineTo((i / (data.length - 1)) * W, H - ((v - mn) / rn) * H));
      ctx.lineTo(W, H); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      data.forEach((v, i) => { const x = (i / (data.length - 1)) * W, y = H - ((v - mn) / rn) * H; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.strokeStyle = "#C9A84C"; ctx.lineWidth = 2.5; ctx.stroke();
      const ly = H - ((data[data.length - 1] - mn) / rn) * H;
      ctx.beginPath(); ctx.arc(W, ly, 5, 0, Math.PI * 2); ctx.fillStyle = "#C9A84C"; ctx.fill();
      ctx.beginPath(); ctx.arc(W, ly, 12, 0, Math.PI * 2); ctx.fillStyle = "rgba(201,168,76,.2)"; ctx.fill();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={720} height={260} style={{ width: "100%", height: 130, display: "block", borderRadius: 8 }} />;
}

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // ── Particles ──
    const N = 70;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.6 + .5,
      pulse: Math.random() * Math.PI * 2,
    }));

    // ── Multi-instrument price lines ──
    const makeWave = (seed: number, amp: number, freq: number, base: number) =>
      Array.from({ length: 160 }, (_, i) =>
        base + Math.sin(i * freq + seed) * amp + Math.cos(i * freq * .7 + seed * 1.3) * (amp * .4) + (Math.random() - .5) * 6
      );
    let waves = [
      { data: makeWave(0, 55, .13, H * .38), color: "rgba(201,168,76,", lw: 1.8 },
      { data: makeWave(2, 35, .18, H * .55), color: "rgba(52,152,219,",  lw: 1.2 },
      { data: makeWave(5, 28, .22, H * .70), color: "rgba(46,204,113,",  lw: 1.0 },
    ];

    // ── Order blocks (institutional zones) ──
    const blocks = Array.from({ length: 6 }, () => ({
      x: Math.random() * W * .85 + W * .05,
      y: Math.random() * H * .5 + H * .15,
      w: 40 + Math.random() * 80,
      h: 12 + Math.random() * 30,
      bull: Math.random() > .5,
      a: 0,
    }));

    // ── Candles ──
    const CANDLES = 32;
    const candles = Array.from({ length: CANDLES }, (_, i) => {
      const o = 280 + Math.random() * 200;
      const cl = o + (Math.random() - .5) * 70;
      return { o, c: cl, h: Math.max(o, cl) + Math.random() * 35, l: Math.min(o, cl) - Math.random() * 25, bull: cl >= o };
    });

    // ── Horizontal price levels ──
    const levels = [H * .22, H * .38, H * .52, H * .68, H * .78];

    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Price levels (dashed)
      levels.forEach((y, i) => {
        ctx.setLineDash([4, 12]);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(201,168,76,${i === 1 ? .06 : .025})`; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
      });

      // Vertical grid
      for (let i = 1; i < 9; i++) {
        ctx.beginPath(); ctx.moveTo(W * i / 9, 0); ctx.lineTo(W * i / 9, H);
        ctx.strokeStyle = "rgba(201,168,76,.015)"; ctx.lineWidth = 1; ctx.stroke();
      }

      // Candles
      const cw = Math.max(6, W / (CANDLES * 1.6));
      candles.forEach((cd, i) => {
        const x = (i / (CANDLES - 1)) * W * .92 + W * .04;
        const sy = H / 600;
        const col = cd.bull ? "rgba(46,204,113,.055)" : "rgba(231,76,60,.042)";
        ctx.strokeStyle = col; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(x, H - cd.h * sy); ctx.lineTo(x, H - cd.l * sy); ctx.stroke();
        ctx.fillStyle = col;
        const top = H - Math.max(cd.o, cd.c) * sy;
        ctx.fillRect(x - cw/2, top, cw, Math.max(1, Math.abs(cd.c - cd.o) * sy));
      });

      // Order blocks (pulsing)
      blocks.forEach(b => {
        b.a = .035 + .025 * Math.abs(Math.sin(frame * .018 + b.x * .002));
        ctx.fillStyle = b.bull ? `rgba(46,204,113,${b.a})` : `rgba(231,76,60,${b.a})`;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = b.bull ? `rgba(46,204,113,${b.a * 3})` : `rgba(231,76,60,${b.a * 3})`;
        ctx.lineWidth = .6;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // Multi-instrument waves with glow
      waves.forEach((wave, wi) => {
        const offset = frame * (.018 + wi * .006);
        // Glow pass
        ctx.beginPath();
        wave.data.forEach((v, i) => {
          const x = (i / (wave.data.length - 1)) * W;
          const y = v + Math.sin((i * .08) + offset) * 8;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = wave.color + (wi === 0 ? ".12)" : ".06)");
        ctx.lineWidth = wave.lw * 4; ctx.filter = "blur(3px)"; ctx.stroke(); ctx.filter = "none";
        // Sharp line
        ctx.beginPath();
        wave.data.forEach((v, i) => {
          const x = (i / (wave.data.length - 1)) * W;
          const y = v + Math.sin((i * .08) + offset) * 8;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = wave.color + (wi === 0 ? ".22)" : ".12)");
        ctx.lineWidth = wave.lw; ctx.stroke();
        // Gradient fill under first wave
        if (wi === 0) {
          const grad = ctx.createLinearGradient(0, wave.data[0] - 40, 0, H);
          grad.addColorStop(0, "rgba(201,168,76,.06)");
          grad.addColorStop(1, "rgba(201,168,76,0)");
          ctx.beginPath();
          wave.data.forEach((v, i) => {
            const x = (i / (wave.data.length - 1)) * W;
            const y = v + Math.sin((i * .08) + offset) * 8;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
          ctx.fillStyle = grad; ctx.fill();
        }
      });

      // Particles + neural network connections
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += .025;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const pa = .25 + .45 * Math.abs(Math.sin(p.pulse));
        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        gradient.addColorStop(0, `rgba(201,168,76,${pa * .3})`);
        gradient.addColorStop(1, "rgba(201,168,76,0)");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient; ctx.fill();
        // Core
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${pa})`; ctx.fill();
      });
      // Connections
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 140) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${(.10 - d/1600) * .7})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }

      // Scanning line
      const scanX = (frame * 1.2) % (W + 100) - 50;
      const scanGrad = ctx.createLinearGradient(scanX - 40, 0, scanX + 2, 0);
      scanGrad.addColorStop(0, "rgba(201,168,76,0)");
      scanGrad.addColorStop(1, "rgba(201,168,76,.06)");
      ctx.fillStyle = scanGrad; ctx.fillRect(scanX - 40, 0, 42, H);

      // Floating data tags
      if (frame % 120 === 0) {
        waves[0].data = makeWave(frame * .01, 55, .13, H * .38);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function LiveTicker() {
  const [prices, setPrices] = useState([
    { s: "XAUUSD", p: 5216.59, c: +1.22, prev: 5216.59 },
    { s: "EURUSD", p: 1.0842, c: -0.18, prev: 1.0842 },
    { s: "GBPUSD", p: 1.2631, c: +0.31, prev: 1.2631 },
    { s: "BTCUSD", p: 67842, c: +2.14, prev: 67842 },
  ]);
  useEffect(() => {
    const iv = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const np = +(p.p * (1 + (Math.random() - .5) * .00018)).toFixed(p.s === "XAUUSD" ? 2 : p.s === "BTCUSD" ? 0 : 4);
        return { ...p, prev: p.p, p: np, c: +(p.c + (Math.random() - .5) * .035).toFixed(2) };
      }));
    }, 900);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 14 }}>
      {prices.map((p, i) => {
        const up = p.p >= p.prev;
        return (
          <div key={i} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.025)", border: `1px solid ${up ? "rgba(46,204,113,.12)" : "rgba(231,76,60,.12)"}`, transition: "border-color .3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--g)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>{p.s}</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: up ? "#2ECC71" : "#E74C3C", padding: "1px 5px", borderRadius: 3, background: up ? "rgba(46,204,113,.1)" : "rgba(231,76,60,.1)" }}>{p.c >= 0 ? "+" : ""}{p.c}%</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: up ? "#e8f8f0" : "#fde8e8", fontFamily: "'JetBrains Mono',monospace", marginTop: 3, transition: "color .2s" }}>{p.p.toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );
}
function Reviews() {
  const [cur, setCur] = useState(0);
  useEffect(() => { const iv = setInterval(() => setCur(c => (c + 1) % reviewsData.length), 5000); return () => clearInterval(iv); }, []);
  const r = reviewsData[cur];
  return (
    <div className="rv">
      <div className="rvq">&ldquo;</div>
      <p className="rvt">{r.t_txt}</p>
      <div className="rvs">★★★★★</div>
      <div className="rvn">{r.n}</div>
      <div className="rvr">{r.r}</div>
      <div className="rvd">{reviewsData.map((_, i) => (<button key={i} className={`rvdt ${i === cur ? "act" : ""}`} onClick={() => setCur(i)} />))}</div>
    </div>
  );
}

function FAQ({ lang }: { lang: Lang }) {
  const L = t[lang];
  const [open, setOpen] = useState<number | null>(null);
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    q: L[`faq${i + 1}_q` as keyof typeof L] || "",
    a: L[`faq${i + 1}_a` as keyof typeof L] || "",
  })).filter(f => f.q);
  return (
    <>{faqs.map((f, i) => (
      <div key={i} className={`fq ${open === i ? "op" : ""}`} onClick={() => setOpen(open === i ? null : i)}>
        <div className="fqq"><h4>{f.q}</h4><span className="fqi">+</span></div>
        <div className="fqa"><p>{f.a}</p></div>
      </div>
    ))}</>
  );
}

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const fullNames: Record<Lang, string> = { en:"English", fr:"Français", nl:"Nederlands", de:"Deutsch", es:"Español", pt:"Português", ru:"Русский", ar:"العربية" };
  return (
    <div className="lang-sw">
      <button className="lang-btn" onClick={() => setOpen(!open)}>{langNames[lang]} <span style={{ fontSize: 8 }}>▼</span></button>
      {open && <div className="lang-dd">{(Object.keys(langNames) as Lang[]).map(l => (
        <button key={l} className={`lang-opt ${l === lang ? "act" : ""}`} onClick={() => { setLang(l); setOpen(false); }}>{langNames[l]} — {fullNames[l]}</button>
      ))}</div>}
    </div>
  );
}

function BookingModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const B = bookingT[lang] || bookingT.en;
  const months = B.months.split(",");
  const weekdays = B.weekdays.split(",");
  const [step, setStep] = useState(1);
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [selTime, setSelTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const [sending, setSending] = useState(false);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelectable = (d: number) => {
    const dt = new Date(viewYear, viewMonth, d);
    const dow = dt.getDay();
    if (dt < today || dow === 0 || dow === 6) return false;
    const mm = dt.getMonth(), dd = dt.getDate(), yy = dt.getFullYear();
    const fixed = [[0,1],[4,1],[6,21],[7,15],[10,1],[10,11],[11,25]];
    if (fixed.some(([m,dy]) => mm === m && dd === dy)) return false;
    const a=yy%19,b=Math.floor(yy/100),c=yy%100,dv=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-dv-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m2=Math.floor((a+11*h+22*l)/451),em=(h+l-7*m2+114),eM=Math.floor(em/31)-1,eD=em%31+1;
    const easter = new Date(yy, eM, eD);
    const easterMon = new Date(yy, eM, eD + 1);
    const ascension = new Date(yy, eM, eD + 39);
    const whitMon = new Date(yy, eM, eD + 50);
    const moving = [easterMon, ascension, whitMon];
    if (moving.some(h => h.getMonth() === mm && h.getDate() === dd)) return false;
    return true;
  };

  const fmtDate = (d: Date) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  const handleConfirm = async () => {
    if (!selDate || !selTime || !name || !email) return;
    setSending(true);
    const dateStr = fmtDate(selDate);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "33a6936d-07a7-42c6-8181-70957b972e41",
          subject: `🗓️ Aureus IA — Nouvelle Réservation: ${dateStr} à ${selTime}`,
          from_name: "Aureus IA Booking",
          Date: dateStr,
          Heure: selTime,
          Durée: "30 minutes — Free Consultation",
          Nom: name,
          Email: email,
          Téléphone: phone || "Non renseigné",
        }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else throw new Error("fail");
    } catch {
      const subject = encodeURIComponent(`Aureus IA — Booking: ${dateStr} at ${selTime}`);
      const body = encodeURIComponent(`Réservation:\n\nDate: ${dateStr}\nHeure: ${selTime}\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone || "N/A"}`);
      window.open(`mailto:info@aureus-ia.com?subject=${subject}&body=${body}`, "_self");
      setDone(true);
    }
    setSending(false);
  };

  const canPrev = viewMonth > today.getMonth() || viewYear > today.getFullYear();

  if (done) return (
    <div className="modal-overlay" onClick={onClose}><div className="modal-box bk-box" onClick={e => e.stopPropagation()}>
      <div style={{ padding: "60px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: "var(--g)", marginBottom: 12 }}>{B.success}</h3>
        <p style={{ color: "var(--td)", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{B.successMsg}</p>
        <p style={{ color: "var(--g)", fontSize: 15, fontWeight: 600, margin: "16px 0" }}>{selDate && fmtDate(selDate)} — {selTime}</p>
        <button className="bk-confirm" onClick={onClose}>{B.close}</button>
      </div>
    </div></div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}><div className="modal-box bk-box" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <div>
          <h3>{B.title}</h3>
          <p style={{ fontSize: 12, color: "var(--td)", marginTop: 4 }}>{B.duration}</p>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>

      {/* STEPS INDICATOR */}
      <div className="bk-steps">
        {[B.step1, B.step2, B.step3].map((s, i) => (
          <div key={i} className={`bk-step ${step === i + 1 ? "act" : ""} ${step > i + 1 ? "done" : ""}`}>{s}</div>
        ))}
      </div>

      <div className="modal-body" style={{ padding: "24px 32px" }}>
        {/* STEP 1: DATE */}
        {step === 1 && <div>
          <div className="bk-cal-nav">
            <button className="bk-nav-btn" disabled={!canPrev} onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); }}>‹</button>
            <span className="bk-cal-title">{months[viewMonth]} {viewYear}</span>
            <button className="bk-nav-btn" onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); }}>›</button>
          </div>
          <div className="bk-cal-grid">
            {weekdays.map(w => <div key={w} className="bk-cal-wk">{w}</div>)}
            {cells.map((d, i) => d === null ? <div key={i} /> : (
              <button key={i} disabled={!isSelectable(d)}
                className={`bk-cal-day ${selDate && selDate.getDate() === d && selDate.getMonth() === viewMonth && selDate.getFullYear() === viewYear ? "sel" : ""} ${!isSelectable(d) ? "off" : ""}`}
                onClick={() => setSelDate(new Date(viewYear, viewMonth, d))}>
                {d}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <button className="bk-next" disabled={!selDate} onClick={() => setStep(2)}>{B.next}</button>
          </div>
        </div>}

        {/* STEP 2: TIME */}
        {step === 2 && <div>
          <p style={{ fontSize: 13, color: "var(--td)", marginBottom: 4 }}>{selDate && fmtDate(selDate)}</p>
          <div className="bk-time-grid">
            {timeSlots.map(ts => (
              <button key={ts} className={`bk-time ${selTime === ts ? "sel" : ""}`} onClick={() => setSelTime(ts)}>{ts}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button className="bk-back" onClick={() => setStep(1)}>{B.back}</button>
            <button className="bk-next" disabled={!selTime} onClick={() => setStep(3)}>{B.next}</button>
          </div>
        </div>}

        {/* STEP 3: DETAILS */}
        {step === 3 && <div>
          <div className="bk-summary">
            <span>📅 {selDate && fmtDate(selDate)}</span>
            <span>🕐 {selTime}</span>
            <span>⏱ 30 min</span>
          </div>
          <input className="cfi" placeholder={B.name} value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 12 }} />
          <input className="cfi" placeholder={B.email} type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 12 }} />
          <input className="cfi" placeholder={B.phone} type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginBottom: 20 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="bk-back" onClick={() => setStep(2)}>{B.back}</button>
            <button className="bk-confirm" disabled={!name || !email || sending} onClick={handleConfirm}>{sending ? "Envoi..." : B.confirm}</button>
          </div>
        </div>}
      </div>
    </div></div>
  );
}

function TermsModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const L = t[lang];
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{L.terms_title}</h3><button className="modal-close" onClick={onClose}>{L.terms_close}</button></div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: termsContent }} />
      </div>
    </div>
  );
}

function PrivacyModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const L = t[lang];
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{L.ft_privacy}</h3><button className="modal-close" onClick={onClose}>{L.terms_close}</button></div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: privacyContent }} />
      </div>
    </div>
  );
}

const cookieBannerT: Record<string, { msg: string; accept: string; decline: string; more: string }> = {
  en: { msg: "We use cookies to improve your experience.", accept: "Accept All", decline: "Necessary Only", more: "Privacy Policy" },
  fr: { msg: "Nous utilisons des cookies pour améliorer votre expérience.", accept: "Tout Accepter", decline: "Nécessaires Uniquement", more: "Politique de Confidentialité" },
  nl: { msg: "Wij gebruiken cookies om uw ervaring te verbeteren.", accept: "Alles Accepteren", decline: "Alleen Noodzakelijk", more: "Privacybeleid" },
  de: { msg: "Wir verwenden Cookies zur Verbesserung Ihrer Erfahrung.", accept: "Alle Akzeptieren", decline: "Nur Notwendige", more: "Datenschutz" },
  es: { msg: "Usamos cookies para mejorar su experiencia.", accept: "Aceptar Todo", decline: "Solo Necesarias", more: "Política de Privacidad" },
  pt: { msg: "Usamos cookies para melhorar sua experiência.", accept: "Aceitar Tudo", decline: "Apenas Necessários", more: "Política de Privacidade" },
  ru: { msg: "Мы используем cookies для улучшения опыта.", accept: "Принять Все", decline: "Только Необходимые", more: "Конфиденциальность" },
  ar: { msg: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك.", accept: "قبول الكل", decline: "الضرورية فقط", more: "سياسة الخصوصية" },
};

function CookieBanner({ lang, onPrivacy }: { lang: Lang; onPrivacy: () => void }) {
  const [visible, setVisible] = useState(true);
  const B = cookieBannerT[lang] || cookieBannerT.en;
  if (!visible) return null;
  return (
    <div className="cookie-banner">
      <div className="cookie-inner">
        <p className="cookie-msg">🍪 {B.msg} <a href="#" onClick={e => { e.preventDefault(); onPrivacy(); }} style={{ color: "var(--g)", textDecoration: "underline" }}>{B.more}</a></p>
        <div className="cookie-btns">
          <button className="cookie-decline" onClick={() => setVisible(false)}>{B.decline}</button>
          <button className="cookie-accept" onClick={() => setVisible(false)}>{B.accept}</button>
        </div>
      </div>
    </div>
  );
}

function ContactForm({ lang }: { lang: Lang }) {
  const L = t[lang];
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cMsg, setCMsg] = useState("");
  const handleSend = async () => {
    if (!cName || !cEmail || !cMsg) return;
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "33a6936d-07a7-42c6-8181-70957b972e41",
          subject: `📩 Aureus IA — Message de ${cName}`,
          from_name: "Aureus IA Contact",
          Nom: cName, Email: cEmail, Message: cMsg,
        }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); setCName(""); setCEmail(""); setCMsg(""); setTimeout(() => setSent(false), 3000); }
      else throw new Error("fail");
    } catch {
      const subject = encodeURIComponent(`Aureus IA — Message de ${cName}`);
      const body = encodeURIComponent(`Nom: ${cName}\nEmail: ${cEmail}\n\n${cMsg}`);
      window.open(`mailto:info@aureus-ia.com?subject=${subject}&body=${body}`, "_self");
      setSent(true); setTimeout(() => setSent(false), 3000);
    }
    setSending(false);
  };
  return (
    <div className="cf">
      <div className="cfr"><input className="cfi" placeholder={L.ct_name} value={cName} onChange={e => setCName(e.target.value)} /><input className="cfi" placeholder={L.ct_email} value={cEmail} onChange={e => setCEmail(e.target.value)} /></div>
      <textarea className="cfi" placeholder={L.ct_msg} rows={5} style={{ resize: "vertical" }} value={cMsg} onChange={e => setCMsg(e.target.value)} />
      <button className="cfb" disabled={sending || !cName || !cEmail || !cMsg} onClick={handleSend}>{sending ? "Envoi..." : sent ? L.ct_sent : L.ct_send}</button>
    </div>
  );
}

/* ── DATA MOVED TO content-data.ts ── */

/* ── TOOL MODAL ── */
function ToolModal({ tool, lang, onClose }: { tool: any; lang: Lang; onClose: () => void }) {
  const CL = cL[lang] || cL.en;
  useEffect(() => { if (tool) document.body.style.overflow = "hidden"; else document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [tool]);
  if (!tool) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.75)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--c1)", borderRadius: 22, maxWidth: 680, width: "100%", maxHeight: "85vh", overflow: "auto", border: `1px solid ${tool.color}30`, boxShadow: `0 32px 80px rgba(0,0,0,.6)` }}>
        <div style={{ padding: "32px 32px 24px", borderBottom: `1px solid ${tool.color}15`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${tool.color},transparent)`, opacity: .5 }} />
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "var(--td)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `${tool.color}15`, border: `1px solid ${tool.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{tool.icon}</div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "var(--tx)" }}>{tool.name}</h3>
              <div style={{ fontSize: 11, color: tool.color, letterSpacing: 2, textTransform: "uppercase" as const, fontWeight: 600, marginTop: 4 }}>{tool.role}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "24px 32px 32px" }}>
          <p style={{ fontSize: 15, color: "var(--td)", lineHeight: 1.85, marginBottom: 24 }}>{tool.full}</p>
          <div style={{ background: `${tool.color}08`, borderRadius: 14, padding: "20px 22px", border: `1px solid ${tool.color}15`, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: tool.color, letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 14 }}>{CL.instit}</div>
            {tool.utility.map((u: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ color: tool.color, fontSize: 14, marginTop: 1 }}>▸</span>
                <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{u}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(231,76,60,.06)", borderRadius: 14, padding: "18px 22px", border: "1px solid rgba(231,76,60,.12)" }}>
            <div style={{ fontSize: 10, color: "#E74C3C", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 10 }}>{CL.trap}</div>
            <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{tool.trap}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HubModal({ hub, lang, onClose }: { hub: any; lang: Lang; onClose: () => void }) {
  const CL = cL[lang] || cL.en;
  useEffect(() => { if (hub) document.body.style.overflow = "hidden"; else document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [hub]);
  if (!hub) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.75)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--c1)", borderRadius: 22, maxWidth: 640, width: "100%", maxHeight: "85vh", overflow: "auto", border: `1px solid ${hub.color}30`, boxShadow: `0 32px 80px rgba(0,0,0,.6)` }}>
        <div style={{ padding: "32px 32px 24px", borderBottom: `1px solid ${hub.color}15`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${hub.color},transparent)`, opacity: .5 }} />
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "var(--td)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `${hub.color}15`, border: `1px solid ${hub.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{hub.icon}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "var(--tx)" }}>{hub.title}</h3>
          </div>
        </div>
        <div style={{ padding: "24px 32px 32px" }}>
          <p style={{ fontSize: 15, color: "var(--td)", lineHeight: 1.85, marginBottom: 24 }}>{hub.full}</p>
          <div style={{ background: `${hub.color}08`, borderRadius: 14, padding: "20px 22px", border: `1px solid ${hub.color}15`, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: hub.color, letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 14 }}>{CL.included}</div>
            {hub.features.map((f: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ color: hub.color, fontSize: 14, marginTop: 1 }}>▸</span>
                <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{f}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(46,204,113,.06)", borderRadius: 14, padding: "18px 22px", border: "1px solid rgba(46,204,113,.12)" }}>
            <div style={{ fontSize: 10, color: "#2ECC71", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 10 }}>{CL.aureus_plus}</div>
            <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{hub.bonus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const L = t[lang];
  const CL = cL[lang] || cL.en;
  const tools = getTools(lang);
  const strategies = getStrategies(lang);
  const services = getServices(lang);
  const hubFeatures = getHubFeatures(lang);
  const isRtl = lang === "ar";

  useEffect(() => { setTimeout(() => setLoading(false), 1800); const onScroll = () => { const s = window.scrollY, d = document.documentElement.scrollHeight - window.innerHeight; setScrollPct(d > 0 ? (s / d) * 100 : 0); setScrolled(s > 60); }; window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);

  const navLinks = [
    { label: L.nav_services, href: "#services" },
    { label: L.nav_hub, href: "#hub" },
    { label: L.nav_indicators, href: "#indicators" },
    { label: L.nav_pricing, href: "#pricing" },
    { label: L.nav_team, href: "#team" },
    { label: L.nav_reviews, href: "#reviews" },
    { label: L.nav_faq, href: "#faq" },
    { label: L.nav_calendar, href: "#calendar" },
    { label: "Strategies", href: "#strategies" },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* LOADER */}
      <div id="loader" className={loading ? "" : "hide"}><div className="lr"><span>A</span></div><div className="lt">Aureus IA</div></div>
      <div id="sp" style={{ width: `${scrollPct}%` }} />

      {/* NAVBAR */}
      <nav id="nb" className={scrolled ? "sc" : ""}>
        <Ticker />
        <div className="ni">
          <a href="#" className="logo"><div className="lc">A</div><div><div className="lo-t">AUREUS IA</div><div className="lo-s">Market Analysis Experts</div></div></a>
          <div className="nl">
            {navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
            <a href="#contact" className="nc">{L.nav_cta}</a>
            <LangSwitcher lang={lang} setLang={setLang} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangSwitcher lang={lang} setLang={setLang} />
            <button className="bur" onClick={() => setMobileMenu(!mobileMenu)}><span /><span /><span /></button>
          </div>
        </div>
        <div id="mob" className={`mm ${mobileMenu ? "op" : ""}`}>
          {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenu(false)}>{l.label}</a>)}
          <a href="#contact" onClick={() => setMobileMenu(false)}>{L.nav_cta}</a>
        </div>
      </nav>

      {/* HERO — MAXIMUM IMPACT */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", paddingTop: 130, paddingBottom: 80 }}>
        <HeroCanvas />
        {/* Trading floor video */}
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .05, zIndex: 0, filter: "sepia(.7) hue-rotate(8deg) contrast(1.2)" }}>
          <source src="https://videos.pexels.com/video-files/3945078/3945078-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        {/* Depth layers */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 120% 80% at 50% -15%, rgba(201,168,76,.12), transparent 55%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 15% 80%, rgba(201,168,76,.04), transparent)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,6,11,.95) 0%, rgba(6,6,11,.1) 20%, rgba(6,6,11,.1) 80%, rgba(6,6,11,.98) 100%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(6,6,11,.92) 0%, rgba(6,6,11,.3) 45%, transparent 100%)", zIndex: 1 }} />
        {/* Bottom vignette */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg, var(--bg), transparent)", zIndex: 1 }} />

        <div className="hg" style={{ position: "relative", zIndex: 2 }}>
          {/* LEFT — Text */}
          <div>
            {/* Live badge */}
            <div className="hbd" style={{ marginBottom: 32 }}>
              <span className="hdt" />
              <span>{L.hero_badge}</span>
            </div>

            {/* Massive headline */}
            <h1 style={{ fontSize: "clamp(52px,8vw,108px)", lineHeight: .98, marginBottom: 32, letterSpacing: "-2px" }}>
              <span style={{ display: "block", color: "var(--tx)", fontWeight: 700 }}>{L.hero_title}</span>
              <span style={{
                display: "block",
                background: "linear-gradient(120deg, #8a6a1a 0%, #C9A84C 25%, #f5e090 50%, #C9A84C 75%, #8a6a1a 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                animation: "shimmer 4s linear infinite",
              }}>
                <Typewriter lang={lang} />
              </span>
            </h1>

            <p className="hp" style={{ fontSize: "clamp(15px,1.7vw,19px)", maxWidth: 520, lineHeight: 1.95, color: "rgba(240,237,230,.75)" }}>{L.hero_desc}</p>

            {/* CTAs */}
            <div className="hbt" style={{ gap: 16, marginBottom: 0 }}>
              <a href="#pricing" className="bg2" style={{ padding: "16px 38px", fontSize: 14, fontWeight: 800, letterSpacing: 1, boxShadow: "0 8px 40px rgba(201,168,76,.35), inset 0 1px 0 rgba(255,255,255,.15)", textTransform: "uppercase" as const }}>
                {L.hero_btn1}
              </a>
              <a href="#hub" className="bo" style={{ padding: "16px 30px", fontSize: 14, letterSpacing: .5 }}>{L.hero_btn2}</a>
            </div>

            {/* Trust bar */}
            <div className="hero-trust" style={{ marginTop: 36, paddingTop: 28 }}>
              {[
                { icon: "🏛️", label: "Brussels Hub — NOW OPEN" },
                { icon: "✓", label: "BCE BE 1028.230.781" },
                { icon: "✓", label: "200+ Professionals" },
                { icon: "✓", label: "13 Years Expertise" },
              ].map((item, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(240,237,230,.55)", letterSpacing: .3 }}>
                  <span style={{ color: "var(--g)", fontSize: 10 }}>{item.icon}</span>
                  {item.label}
                  {i < 3 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(201,168,76,.4)", margin: "0 6px" }} />}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Chart card */}
          <div>
            <div className="cc" style={{
              boxShadow: "0 50px 120px rgba(0,0,0,.7), 0 0 100px rgba(201,168,76,.08), inset 0 1px 0 rgba(201,168,76,.15)",
              border: "1px solid rgba(201,168,76,.18)",
              backdropFilter: "blur(24px) saturate(1.4)",
              background: "rgba(8,8,12,.88)",
              borderRadius: 24,
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ECC71", animation: "pls 2s infinite" }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--g)", fontWeight: 700, letterSpacing: 2 }}>LIVE • XAUUSD</span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>
                    5,216<span style={{ fontSize: 20, color: "var(--td)" }}>.59</span>
                    <span style={{ fontSize: 13, color: "#2ECC71", fontFamily: "'JetBrains Mono',monospace", marginLeft: 10, fontWeight: 700 }}>▲ +1.22%</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, color: "var(--tm)", letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 4 }}>AI Confidence</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, color: "var(--g)" }}>94.2%</div>
                  <div style={{ display: "flex", gap: 3, justifyContent: "flex-end", marginTop: 4 }}>
                    {[90,75,85,95,70,88,94].map((v,i) => (
                      <div key={i} style={{ width: 3, height: v/10, borderRadius: 2, background: `rgba(201,168,76,${.3+v/200})`, alignSelf: "flex-end" }} />
                    ))}
                  </div>
                </div>
              </div>

              <LiveChart />

              <div className="cctg" style={{ marginTop: 10 }}>
                <span className="cct">📈 Trend: Bullish</span>
                <span className="cct">📊 Volume: High</span>
                <span className="cct">⚡ RSI: 62.4</span>
                <span className="cct">🎯 OB Detected</span>
              </div>

              <div className="ccai" style={{ marginTop: 12 }}>
                <span className="ccaid" />
                <span style={{ fontSize: 11 }}>{L.chart_ai} <b style={{ color: "var(--g)" }}>{L.chart_ai2}</b> {L.chart_ai3}</span>
              </div>

              <LiveTicker />

              {/* Bottom stats */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(201,168,76,.07)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
                {[["11", "Indicators"], ["6", "Strategies"], ["200+", "Clients"], ["13+", "Years"]].map(([v, l2], i) => (
                  <div key={i} style={{ textAlign: "center", padding: "10px 4px", borderRight: i < 3 ? "1px solid rgba(201,168,76,.06)" : "none" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "var(--g)", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 8, color: "var(--td)", letterSpacing: 1.2, textTransform: "uppercase" as const, marginTop: 3 }}>{l2}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating label under card */}
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: "rgba(201,168,76,.4)", letterSpacing: 2, textTransform: "uppercase" as const, fontFamily: "'JetBrains Mono',monospace" }}>
              ● LIVE MARKET DATA • AUREUS IA ENGINE
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .5 }}>
          <div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const }}>Scroll</div>
          <div style={{ width: 1, height: 40, background: "linear-gradient(var(--g),transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>
      {/* STATS */}
      <section style={{ padding: "0 28px" }}><div className="stats">
        {[{ v: "13+", l: L.stat1 }, { v: "200+", l: L.stat2 }, { v: "11", l: L.stat3 }, { v: "24/7", l: L.stat4 }].map((s, i) => (
          <div key={i} className="stat"><div className="stv">{s.v}</div><div className="stl">{s.l}</div></div>
        ))}
      </div></section>

      {/* SERVICES */}
      {/* NYC SKYLINE BANNER */}
      <FI><div style={{ position: "relative", height: 280, overflow: "hidden", margin: "60px 0 0" }}>
        <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80" alt="NYC Financial District" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) sepia(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,var(--bg),transparent 20%,transparent 80%,var(--bg))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 700, color: "var(--tx)", textAlign: "center" }}>The <span className="gld">Institutional</span> Edge</div>
          <div style={{ fontSize: 13, color: "var(--td)", letterSpacing: 3, textTransform: "uppercase" as const }}>Wall Street Technology • Brussels Expertise</div>
        </div>
      </div></FI>

      <section id="services"><div className="mx">
        <FI><SH tag={L.svc_tag} title={L.svc_title} /></FI>
        <div className="g4">
          {services.map((s, idx) => (
            <FI key={idx}><div className="sc2" style={{ cursor: "pointer" }} onClick={() => setSelectedService(s)}><span className="si">{s.icon}</span><h3 className="sct">{s.title}</h3><p className="scd">{s.full.slice(0,120)}…</p><div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 1.5, fontWeight: 600, marginTop: 12, opacity: .7 }}>{CL.see_details}</div></div></FI>
          ))}
        </div>
      </div></section>

      {/* BRUSSELS HUB */}
      <section id="hub" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag={L.hub_tag} title={L.hub_title} desc={L.hub_desc} /></FI>
        <FI><div className="hub">
          <div className="hl" style={{ position: "relative", overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80" alt="Trading screens" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 16, opacity: 0.7 }} />
            <div style={{ fontSize: 44 }}>🇧🇪</div>
            <div className="ha">Place Marcel<br />Broodthaers 8</div>
            <div className="hcy">{L.hub_city}</div>
            {[L.hub_tr1, L.hub_tr2, L.hub_tr3, L.hub_tr4].map((tr, i) => <div key={i} className="htr">{tr}</div>)}
          </div>
          <div className="hr2">
            <div style={{ fontSize: 11, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 16 }}>{L.hub_options}</div>
            <div className="ho"><div className="hoh"><span className="hot">{L.hub_o1_t}</span><span className="hop">€48.40/h</span></div><div className="hod">{L.hub_o1_d}</div></div>
            <div className="ho"><div className="hoh"><span className="hot">{L.hub_o2_t}</span><span className="hop">Custom</span></div><div className="hod">{L.hub_o2_d}</div></div>
            <div className="ho fl" style={{ position: "relative" }}><span className="hbdg">EXCLUSIVE</span><div className="hoh"><span className="hot">{L.hub_o3_t}</span><span className="hop">{L.hub_o3_price}</span></div><div className="hod">{L.hub_o3_d}</div></div>
            <div className="hopn"><span className="hopd" /><span style={{ fontSize: 11, fontWeight: 700, color: "var(--gr)" }}>{L.hub_open}</span><span style={{ fontSize: 11, color: "var(--td)", marginLeft: 10 }}>{L.hub_hours}</span></div>
          </div>
        </div></FI>
        <div className="hfg">
          {hubFeatures.map((f, i) => (
            <FI key={i}><div className="hf" style={{ cursor: "pointer" }} onClick={() => setSelectedHub(f)}><div className="hfi">{f.icon}</div><div><div className="hft">{f.title}</div><div className="hfd">{f.full.slice(0,80)}…</div><div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 1.5, fontWeight: 600, marginTop: 8, opacity: .7 }}>{CL.see_details}</div></div></div></FI>
          ))}
        </div>
      </div></section>

      {/* DISCOVERY DAY */}
      <section id="discovery"><div className="mx">
        <FI><div className="dc">
          <img src="/beinjamin.webp" alt="Benjamin Franklin $100" style={{ width: 200, height: 200, objectFit: "cover", borderRadius: "50%", margin: "0 auto 24px", display: "block", border: "3px solid rgba(201,168,76,.3)" }} />
          <h2 className="dct"><span className="gld">{L.disc_title}</span></h2>
          <p className="dcp">{L.disc_desc}</p>
          <div className="dcc">{[L.disc_c1, L.disc_c2, L.disc_c3, L.disc_c4].map((c, i) => <span key={i} className="dcch">{c}</span>)}</div>
          <a href="#contact" className="bg2">{L.disc_btn}</a>
          <p className="dcn">{L.disc_note}</p>
        </div></FI>
      </div></section>

      {/* INDICATORS */}
      <section id="indicators" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag={L.ind_tag} title={L.ind_title} /></FI>
        <div className="ig">{indicators.map((ind, i) => (
          <FI key={i}><div className="ic" style={{ cursor: "pointer" }} onClick={() => setSelectedTool(tools[i])}><div className="icb" style={{ background: ind.c }} /><div className="icd" style={{ background: ind.c, boxShadow: `0 0 10px ${ind.c}66` }} /><div className="icn">{ind.n}</div><div className="icdesc">{ind.d}</div><div style={{ fontSize: 9, color: ind.c, letterSpacing: 1.5, fontWeight: 600, marginTop: 8, opacity: .7 }}>{CL.see_details}</div></div></FI>
        ))}</div>
      </div></section>

      {/* ═══════ STRATEGIES — TOOLS + DOW + 6 STRATEGIES ═══════ */}
      <section id="strategies" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag={CL.tools_tag} title={CL.tools_title} desc={CL.tools_desc} /></FI>
        
        {/* 11 TOOLS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14, marginBottom: 80 }}>
          {tools.map((td, i) => (
            <FI key={td.id}><div style={{ background: "var(--c1)", borderRadius: 14, padding: "24px 20px", border: "1px solid rgba(201,168,76,.05)", cursor: "pointer", transition: "all .4s", position: "relative", overflow: "hidden" }}
              onClick={() => setSelectedTool(td)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,.18)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,.05)"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${td.color},transparent)`, opacity: .4 }} />
              <div style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderRadius: "50%", background: `${td.color}15`, border: `1px solid ${td.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: td.color, fontFamily: "'JetBrains Mono',monospace" }}>{td.id}</div>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{td.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, marginBottom: 3 }}>{td.name}</div>
              <div style={{ fontSize: 9, color: td.color, letterSpacing: 2, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 10 }}>{td.role}</div>
              <div style={{ fontSize: 12, color: "var(--td)", lineHeight: 1.7, marginBottom: 12 }}>{td.full.slice(0, 120)}…</div>
              <div style={{ fontSize: 9, color: td.color, letterSpacing: 1.5, fontWeight: 600, opacity: .7 }}>{CL.see_details}</div>
            </div></FI>
          ))}
        </div>

        {/* DOW THEORY */}
        <FI><div style={{ maxWidth: 800, margin: "0 auto 80px", background: "var(--c1)", borderRadius: 18, padding: "36px 32px", border: "1px solid rgba(201,168,76,.08)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, textAlign: "center", marginBottom: 20}}>{CL.dow_title.includes("Dow") ? <>{CL.dow_title.split("Dow")[0]}<span className="gld">Dow</span>{CL.dow_title.split("Dow")[1]}</> : CL.dow_title}</div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,transparent,var(--g),transparent)", margin: "0 auto 24px" }} />
          <p style={{ fontSize: 14, color: "var(--td)", lineHeight: 1.85, marginBottom: 20, textAlign: "center" }}>{CL.dow_desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{n:"AP LT Trade AI",r:"Indicateur d'excès pertinent",id:8},{n:"Momentum",r:"Confirmation de retournement",id:9},{n:"Order Blocks",r:"Zones de réaction haute probabilité",id:4},{n:"Trend Corridor",r:"Canal d'élasticité cohérent",id:7}].map((d,i) => (
              <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(201,168,76,.03)", border: "1px solid rgba(201,168,76,.06)", cursor: "pointer", transition: "all .3s" }}
                onClick={() => setSelectedTool(tools.find(t => t.id === d.id))}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,.03)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 13, fontWeight: 700, color: "var(--g)" }}>{d.n}</div><span style={{ fontSize: 9, color: "var(--g)", opacity: .6 }}>DÉTAILS →</span></div>
                <div style={{ fontSize: 11, color: "var(--td)" }}>→ {d.r}</div>
              </div>
            ))}
          </div>
        </div></FI>

        {/* 6 STRATEGIES */}
        {strategies.map((s, si) => (
          <FI key={s.id}><div style={{ marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, border: `1px solid ${s.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.id}</div>
              <div><h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.15 }}>{s.name}</h3><p style={{ fontSize: 11, color: s.color, letterSpacing: 1, marginTop: 2 }}>{s.sub}</p></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
              <div style={{ order: si % 2 === 0 ? 1 : 2 }}>
                <div style={{ background: "var(--c1)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(201,168,76,.08)", marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 6 }}>{CL.obj}</div>
                  <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{s.obj}</p>
                </div>
                <div style={{ background: "var(--c1)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(201,168,76,.08)", marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 12 }}>{CL.proc}</div>
                  {s.steps.map((st, sti) => (
                    <div key={sti} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <div style={{ minWidth: 22, height: 22, borderRadius: "50%", background: sti === s.steps.length - 1 ? "linear-gradient(135deg,var(--g),var(--gd))" : "rgba(201,168,76,.08)", border: `1px solid ${sti === s.steps.length - 1 ? "transparent" : "rgba(201,168,76,.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: sti === s.steps.length - 1 ? "var(--bg)" : "var(--g)", fontFamily: "'JetBrains Mono',monospace" }}>{sti + 1}</div>
                      <p style={{ fontSize: 12, color: "var(--td)", lineHeight: 1.6 }}>{st}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {s.filters.map((f, fi) => <span key={fi} style={{ padding: "4px 12px", borderRadius: 20, background: `${s.color}10`, border: `1px solid ${s.color}25`, fontSize: 10, color: s.color, fontWeight: 600 }}>✓ {f}</span>)}
                </div>
                <div style={{ background: `${s.color}08`, borderRadius: 12, padding: "14px 18px", border: `1px solid ${s.color}20` }}>
                  <div style={{ fontSize: 9, color: s.color, letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 8 }}>{CL.example}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[[CL.pair, s.ex.pair], [CL.tf, s.ex.tf], [CL.type, s.ex.type], [CL.sl, s.ex.sl], [CL.tp, s.ex.tp]].map(([l, v], ei) => (
                      <div key={ei} style={{ fontSize: 11, color: "var(--td)" }}><span style={{ color: "var(--tm)", fontSize: 9 }}>{l}: </span><span style={{ fontWeight: 600, color: "var(--tx)" }}>{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ order: si % 2 === 0 ? 2 : 1 }}>
                <div style={{ background: "var(--c1)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(201,168,76,.08)", aspectRatio: "16/10" }}>
                  <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "var(--tm)" }}>{s.ex.pair} • {s.ex.tf} — {s.name}</div>
              </div>
            </div>
          </div></FI>
        ))}
      </div></section>

      {/* PRICING */}
      {/* TRADING FLOOR BANNER */}
      <FI><div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1920&q=80" alt="Trading Floor" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.25) sepia(0.2)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,var(--bg),transparent 15%,transparent 85%,var(--bg))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,3vw,36px)", fontWeight: 700, color: "var(--tx)", textAlign: "center" }} dangerouslySetInnerHTML={{ __html: CL.powered }} />
          <div style={{ fontSize: 12, color: "var(--td)", letterSpacing: 2 }}>{CL.powered_sub}</div>
        </div>
      </div></FI>

      <section id="pricing"><div className="mx">
        <FI><SH tag={L.pr_tag} title={L.pr_title} /></FI>
        <div className="pg">
          {[
            { n: CL.free_consult, dur: "30 min", pr: CL.free, per: "", feat: [CL.p1f1, CL.p1f2, CL.p1f3, CL.p1f4, CL.p1f5], pop: false, btn: CL.plan_btn_schedule, action: "book" },
            { n: CL.discovery_day, dur: CL.full_day, pr: CL.free, per: "", feat: [CL.p2f1, CL.p2f2, CL.p2f3, CL.p2f4, CL.p2f5], pop: true, btn: CL.plan_btn_book, action: "book" },
            { n: CL.ai_access, dur: CL.monthly_sub, pr: "€300", per: "/mo", feat: [CL.p3f1, CL.p3f2, CL.p3f3, CL.p3f4, CL.p3f5], pop: false, btn: CL.plan_btn_contact, action: "contact", apiNote: CL.api_note },
          ].map((p, i) => (
            <FI key={i}><div className={`pc ${p.pop ? "pop" : ""}`}><div className="pi">
              {p.pop && <div className="ppb">{CL.popular}</div>}
              <div className="pn">{p.n}</div>
              <div className="pdu">⏱ {p.dur}</div>
              <div className="ppr">{p.pr} {p.per && <span className="pper">{p.per}</span>}</div>
              {p.feat.map((f, fi) => <div key={fi} className="pf">{f}</div>)}
              {p.apiNote && <div style={{ fontSize: 11, color: "var(--g)", padding: "8px 12px", background: "rgba(201,168,76,.06)", borderRadius: 8, border: "1px solid rgba(201,168,76,.1)", marginTop: 4, textAlign: "center" as const, fontWeight: 600 }}>{p.apiNote}</div>}

              <button className={`pbt ${p.pop ? "gd" : "ot"}`} onClick={() => { if (p.action === "book") setShowBooking(true); else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>{p.btn}</button>
            </div></div></FI>
          ))}
        </div>
      </div></section>

      {/* TEAM */}
      <section id="team" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag={L.team_tag} title={L.team_title} /></FI>
        <FI><div className="tc"><div className="tav"><div className="tavi">L</div></div><div className="tn">our founder</div><div className="tr2">{L.team_role}</div><p className="tbio">{L.team_bio}</p></div></FI>
      </div></section>

      {/* REVIEWS */}
      <section id="reviews"><div className="mx">
        <FI><SH tag={L.rev_tag} title={L.rev_title} /></FI>
        <FI><Reviews /></FI>
      </div></section>

      {/* FAQ */}
      <section id="faq" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx" style={{ maxWidth: 780 }}>
        <FI><SH tag={L.faq_tag} title={L.faq_title} /></FI>
        <FAQ lang={lang} />
      </div></section>

      {/* CONTACT */}
      {/* ECONOMIC CALENDAR */}
      <section id="calendar" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag={L.cal_tag} title={L.cal_title} desc={L.cal_desc} /></FI>
        <FI><div className="cal-container"><div className="cal-wrap">
          <iframe
            src={`https://www.widgets.investing.com/economic-calendar?theme=darkTheme&dateFrom=${new Date().toISOString().split("T")[0]}&countries=72,22,17,25,39,5,32&importance=2,3`}
            width="100%"
            height="638"
            style={{ border: "none", borderRadius: 16 }}
            allowFullScreen
          />
        </div></div></FI>
        <FI><div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          {[
            { name: "Forex Factory", url: "https://www.forexfactory.com/calendar" },
            { name: "Investing.com", url: "https://www.investing.com/economic-calendar/" },
            { name: "Trading Economics", url: "https://tradingeconomics.com/calendar" },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--g)", padding: "8px 18px", border: "1px solid rgba(201,168,76,.15)", borderRadius: 8, transition: "all .3s" }}>{s.name} ↗</a>
          ))}
        </div></FI>
      </div></section>

      <section id="contact"><div className="mx" style={{ maxWidth: 660 }}>
        <FI><SH tag={L.ct_tag} title={L.ct_title} desc={L.ct_desc} /></FI>
        <FI><ContactForm lang={lang} /></FI>
        <FI><div className="ci">
          <div><div className="cii">📍</div><div className="cil">Address</div><div className="civ">Pl. Marcel Broodthaers 8<br />1060 Saint-Gilles, Brussels</div></div>
          <div><div className="cii">✉️</div><div className="cil">Email</div><div className="civ">info@aureus-ia.com</div></div>
          <div><div className="cii">📞</div><div className="cil">Phone</div><div className="civ">+32 491 70 94 13</div></div>
        </div></FI>
      </div></section>

      {/* FOOTER */}
      <footer><div className="fg">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,var(--g),var(--gd))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "var(--bg)", fontFamily: "'Cormorant Garamond',serif" }}>A</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>AUREUS IA</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--tm)", lineHeight: 1.65, whiteSpace: "pre-line" }}>{L.ft_disc}</p>
        </div>
        <div><div className="fh">{L.ft_platform}</div><a href="#services">{L.nav_services}</a><a href="#hub">Brussels Hub</a><a href="#indicators">{L.nav_indicators}</a><a href="#strategies">Strategies</a><a href="#discovery">Discovery Day</a><a href="#pricing">{L.nav_pricing}</a></div>
        <div><div className="fh">{L.ft_legal}</div><a href="https://fr.trustpilot.com/review/aureus-ia.com" target="_blank" rel="noopener noreferrer">⭐ Trustpilot</a><a href="#" onClick={e => { e.preventDefault(); setShowPrivacy(true); }}>{L.ft_privacy}</a><a href="#" onClick={e => { e.preventDefault(); setShowTerms(true); }}>{L.ft_terms}</a></div>
        <div><div className="fh">{L.ft_contact}</div><p style={{ fontSize: 12, color: "var(--td)", lineHeight: 1.65 }}>Pl. Marcel Broodthaers 8<br />1060 Saint-Gilles, Belgium<br />info@aureus-ia.com<br />+32 491 70 94 13</p></div>
      </div><div className="fb">{L.ft_copy}</div></footer>

      {/* TOOL DETAIL MODAL */}
      <ToolModal tool={selectedTool} lang={lang} onClose={() => setSelectedTool(null)} />
      <HubModal hub={selectedHub} lang={lang} onClose={() => setSelectedHub(null)} />
      <HubModal hub={selectedService} lang={lang} onClose={() => setSelectedService(null)} />

      {/* WHATSAPP */}
      <a href="https://wa.me/32491709413" target="_blank" rel="noopener noreferrer" className="wa">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      {/* TERMS MODAL */}
      {showTerms && <TermsModal lang={lang} onClose={() => setShowTerms(false)} />}

      {/* PRIVACY MODAL */}
      {showPrivacy && <PrivacyModal lang={lang} onClose={() => setShowPrivacy(false)} />}

      {/* BOOKING MODAL */}
      {showBooking && <BookingModal lang={lang} onClose={() => setShowBooking(false)} />}

      {/* COOKIE BANNER */}
      <CookieBanner lang={lang} onPrivacy={() => setShowPrivacy(true)} />
    </div>
  );
}
