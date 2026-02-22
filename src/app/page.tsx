"use client";
import { useState, useEffect, useRef } from "react";
import { t, langNames, type Lang } from "./translations";
import { termsContent } from "./terms-content";
import { privacyContent } from "./privacy-content";
import { bookingT, timeSlots } from "./booking";

const tickerData = [
  { s: "XAUUSD", p: "2,687.45", c: "+1.24%", up: true },
  { s: "EURUSD", p: "1.0842", c: "+0.15%", up: true },
  { s: "BTCUSD", p: "97,432", c: "+3.21%", up: true },
  { s: "US500", p: "6,012.8", c: "-0.32%", up: false },
  { s: "GBPUSD", p: "1.2634", c: "+0.08%", up: true },
  { s: "USDJPY", p: "149.82", c: "-0.45%", up: false },
  { s: "XAGUSD", p: "31.42", c: "+2.10%", up: true },
];

const reviewsData = [
  { n: "Marc D.", r: "Independent Trader", t_txt: "Aureus IA has completely transformed my analytical approach. The AI indicators detect patterns I would never have seen. Exceptional." },
  { n: "Sophie L.", r: "Financial Analyst", t_txt: "The coaching with Lucas is incredibly valuable. 13 years of expertise distilled into actionable insights. The platform is next-level." },
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

  const handleConfirm = () => {
    if (!selDate || !selTime || !name || !email) return;
    const dateStr = fmtDate(selDate);
    const subject = encodeURIComponent(`Aureus IA — Booking Request: ${dateStr} at ${selTime}`);
    const body = encodeURIComponent(
      `New booking request:\n\nDate: ${dateStr}\nTime: ${selTime}\nDuration: 30 minutes — Free Consultation\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\n---\nSent from aureus-ia.com booking system`
    );
    window.open(`mailto:info@aureus-ia.com?subject=${subject}&body=${body}`, "_self");
    setDone(true);
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
            <button className="bk-confirm" disabled={!name || !email} onClick={handleConfirm}>{B.confirm}</button>
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
  return (
    <div className="cf">
      <div className="cfr"><input className="cfi" placeholder={L.ct_name} /><input className="cfi" placeholder={L.ct_email} /></div>
      <textarea className="cfi" placeholder={L.ct_msg} rows={5} style={{ resize: "vertical" }} />
      <button className="cfb" onClick={() => { setSent(true); setTimeout(() => setSent(false), 2500); }}>{sent ? L.ct_sent : L.ct_send}</button>
    </div>
  );
}

/* ── TOOLS DETAIL DATA ── */
const toolsDetail = [
  { id: 1, name: "LT Trade BP Symbol", role: "Identification instantanée", icon: "🎯", color: "#C9A84C",
    full: "Cet outil, simple en apparence, a pourtant une importance clé dans un environnement de trading institutionnel. Le LT Trade BP Symbol affiche en temps réel l'indice, la paire de devises ou la matière première sur laquelle le trader intervient.",
    utility: ["Sécurité opérationnelle : élimine les erreurs d'exécution dues à la confusion entre instruments", "Clarté analytique : vérifie en un coup d'œil que toutes les analyses se rapportent au bon actif", "Compatibilité multi-écrans : idéal pour les traders disposant de 4 à 6 écrans"],
    trap: "Ne pas considérer cet outil comme décoratif. Une mauvaise identification d'actif peut ruiner une session entière." },
  { id: 2, name: "LT Trade Breakout Signal", role: "Rupture structurelle", icon: "⚡", color: "#2ECC71",
    full: "Module de détection avancée des points d'entrée via Engulfing créateur d'Order Block et Market Structure Shift (MSS), signalant un basculement de la dynamique institutionnelle.",
    utility: ["Anticiper les zones d'accumulation/distribution créées par les banques et fonds", "Identifier les mouvements propulsés par de véritables flux de capitaux", "Toujours contextualiser dans une lecture globale de la narrative de marché"],
    trap: "Prendre un signal isolé sans vérifier la structure supérieure (H1/H4)." },
  { id: 3, name: "LT Trade Daily H/L", role: "Liquidité de la veille", icon: "📊", color: "#3498DB",
    full: "Trace automatiquement le plus haut et le plus bas de la journée précédente, zones où se trouvent souvent d'importantes poches de liquidités (ordres stop, ordres limit).",
    utility: ["Les institutions visent ces niveaux pour provoquer des liquidity grabs (stop hunts)", "Permet de savoir si la liquidité du haut ou du bas de la veille a été prise", "Oriente fortement le biais directionnel de la journée"],
    trap: "Supposer qu'une prise de liquidité entraîne toujours un retournement immédiat." },
  { id: 4, name: "LT Trade GMC-OB", role: "Order Blocks temps réel", icon: "🧊", color: "#E67E22",
    full: "IA spécialisée dans la reconnaissance des Order Blocks au moment même de leur formation. Scanne en continu l'activité des bougies et identifie un déplacement institutionnel.",
    utility: ["Timing ultra-précis : connaître un OB dès sa naissance", "Lecture des intentions algorithmiques bancaires", "Confirmer avec Momentum et AP LT Trade avant exécution"],
    trap: "Entrer sur le premier retour sans validation multi-outils. Un OB n'est pas forcément respecté sans volume suffisant." },
  { id: 5, name: "OB Zone Pro", role: "Validation volumétrique", icon: "🔬", color: "#9B59B6",
    full: "Complément indispensable du GMC-OB. Mesure la solidité d'un OB via le volume institutionnel. Code couleur : Vert (haussier) / Rouge (baissier).",
    utility: ["Évite de trader des OB « faibles » ou non institutionnels", "Filtre le bruit pour se concentrer sur les zones à forte probabilité", "Utiliser en tandem avec LT Trade GMC-OB"],
    trap: "Négliger les étapes intermédiaires du code couleur. Un OB peut se renforcer ou disparaître." },
  { id: 6, name: "LT Trade ShowPips", role: "Performance en direct", icon: "💰", color: "#F39C12",
    full: "Module visuel affichant pips gagnés/perdus, pourcentage de gain/perte et équivalent monétaire en euros. Essentiel pour la discipline émotionnelle.",
    utility: ["Favorise la discipline émotionnelle et la sécurisation partielle", "Facilite le suivi multi-trades en scalping", "Surveiller le gain en fonction du Risk-to-Reward initial"],
    trap: "Laisser l'affichage influencer la décision prématurément. Restez sur le plan." },
  { id: 7, name: "LT Trade Trend Corridor", role: "Élasticité du marché", icon: "📈", color: "#1ABC9C",
    full: "Canal adaptatif évoluant avec le marché en fonction du volume et de la volatilité. Indique la zone maximale de mouvement et la tendance via l'inclinaison.",
    utility: ["Le prix tend statistiquement à revenir vers l'autre bande", "Le corridor « respire » avec le marché, évitant les entrées prématurées", "Utiliser l'autre bande comme objectif de Take Profit"],
    trap: "Penser que toute sortie de bande entraîne un retournement. La validation contextuelle est essentielle." },
  { id: 8, name: "AP LT Trade", role: "Zones extrêmes IA", icon: "🧠", color: "#E74C3C",
    full: "Module phare d'Aureus AI. IA d'analyse comportementale mesurant la pression d'achat/vente en croisant volumes, volatilité, vitesse de mouvement et micro-liquidités.",
    utility: ["Identifie les zones de surachat/survente extrême", "Filtre les faux signaux des indicateurs techniques classiques", "Combiner avec le contexte structurel (Dow Theory)"],
    trap: "Confondre un extrême institutionnel avec une simple fluctuation technique." },
  { id: 9, name: "LT Trade Momentum", role: "Force du mouvement", icon: "🚀", color: "#C9A84C",
    full: "Mesure la force réelle derrière un mouvement en pondérant flux d'ordres et volume effectif des gros acteurs. Déclencheur final de vos entrées.",
    utility: ["Agit comme déclencheur final basé sur un changement mesurable d'énergie", "Attendre le croisement Momentum + prix dans le sens de l'opportunité", "Valider dans un contexte structurel favorable (Dow Theory)"],
    trap: "Entrer uniquement sur un croisement sans contexte. Toujours confirmer avec un autre outil." },
  { id: 10, name: "LT Trade WorkTime", role: "Session asiatique", icon: "🌏", color: "#3498DB",
    full: "Surligne les fenêtres horaires de session. L'Asie crée un range « tampon » que Londres/NY viennent balayer pour créer le vrai mouvement du jour.",
    utility: ["L'Asie cadre un range ; Londres/NY balayent ces extrêmes (stop hunt)", "Sweep d'un bord + AP LT Trade AI extrême → signal d'entrée", "Si le bord touche un pivot ou Daily H/L, la probabilité augmente"],
    trap: "Paramétrage horaire approximatif. Toujours aligner WorkTime sur le fuseau du broker." },
  { id: 11, name: "LT Trade Davits Pivot", role: "Pivots × Fibonacci", icon: "🎯", color: "#9B59B6",
    full: "Fusionne points pivots et ratios Fibonacci pour cartographier des niveaux d'intervention massivement suivis par les desks professionnels.",
    utility: ["Pivots = repères publics massivement suivis → réactions collectives", "Fibonacci ajoute des paliers naturels de respiration/accumulation", "Confluence pivot + OB validé + Daily H/L = probabilité maximale"],
    trap: "Trader un pivot seul sans contexte (Dow/IA/OB). Ignorer la volatilité de session." },
];

const strategiesData = [
  { id: 1, name: "OB Momentum Corridor", sub: "Order Blocks + AP LT Trade AI + Momentum + Trend Corridor", obj: "Capturer un mouvement après retest d'Order Block, en profitant du flux institutionnel.", steps: ["Identifier l'Order Block validé (OB Zone Pro vert/rouge)", "Attendre le retour du prix dans l'OB", "Observer l'AP LT Trade AI en zone extrême", "Attendre le croisement Momentum", "Entrée à la clôture de la bougie de croisement", "SL derrière le dernier extrême, TP bande opposée"], filters: ["OB validé IA", "AP LT Trade extrême", "Croisement Momentum", "Trend Corridor"], ex: { pair: "XAUUSD", tf: "M15", type: "Long", sl: "sous 3404", tp: "ADR High 3440+" }, img: "/strategy1.png", color: "#C9A84C" },
  { id: 2, name: "Corridor Re-Entry & Liquidity Grab", sub: "Trend Corridor + Momentum + AP LT Trade + prise de liquidités", obj: "Entrer après que le marché ait effectué une prise de liquidités au-delà des bandes du Corridor.", steps: ["Sortie complète du prix hors du Trend Corridor", "Confirmer la prise de liquidités (cassure swing H/L)", "Sortie simultanée du Momentum hors des bandes", "Réintégration : clôture à l'intérieur du Corridor", "Entrée + croisement Momentum confirmé", "SL derrière l'extrême, TP bande opposée"], filters: ["Sortie Corridor", "Liquidity Grab", "Réintégration", "Croisement Momentum"], ex: { pair: "EUR/USD", tf: "M15", type: "Short", sl: "au-dessus mèche haute", tp: "bande basse Corridor" }, img: "/strategy2.png", color: "#2ECC71" },
  { id: 3, name: "Scalping Directionnel MM200", sub: "MM200 M15 + AP LT Trade AI + exécution M1", obj: "Mouvements rapides en M1 dans le sens de la tendance M15 confirmée par la MM200.", steps: ["M15 : position du prix vs MM200 → biais", "M1 : AP LT Trade AI en zone extrême", "M1 : micro-structure Dow (HH/HL ou LH/LL)", "M1 : croisement Momentum dans le sens du biais", "Entrée à la clôture de confirmation", "SL sous creux/sommet, TP bande opposée"], filters: ["MM200 filtre M15", "AP LT Trade M1", "Structure Dow", "Momentum M1"], ex: { pair: "GBP/USD", tf: "M15→M1", type: "Multi-UT", sl: "sous creux local", tp: "bande haute" }, img: "/strategy3.png", color: "#3498DB" },
  { id: 4, name: "Scalping Multi-TF Extrêmes", sub: "AP LT Trade AI M15 + Trend Corridor + Momentum → M1", obj: "Exploiter les déséquilibres M15 pour des entrées haute précision en M1.", steps: ["M15 : extrême AP LT Trade AI (liquidity grab)", "M15 : structure Dow + OB Pro si disponible", "M1 : sortie des bandes Corridor ET Momentum", "M1 : croisement prix/Momentum hors bandes", "M1 : entrée à la réintégration du Corridor", "SL derrière extrême M1, TP bande opposée"], filters: ["Extrême M15", "Sortie Corridor M1", "Croisement Momentum", "Réintégration"], ex: { pair: "XAU/USD", tf: "M15→M1", type: "Short", sl: "au-dessus mèche haute", tp: "bande basse / OB" }, img: "/strategy4.png", color: "#E67E22" },
  { id: 5, name: "Prise de Liquidité de la Veille", sub: "Daily H/L + AP LT Trade AI + Trend Corridor + Momentum", obj: "Exploiter la chasse de liquidité au-delà des extrêmes de la veille.", steps: ["Repérer plus haut / plus bas de la veille", "Prix dépasse légèrement un de ces niveaux", "AP LT Trade AI en zone extrême", "Sortie prix + Momentum des bandes du Corridor", "Croisement + clôture à l'intérieur du Corridor", "SL derrière le spike, TP bande opposée M15"], filters: ["Daily H/L cassé", "Stop Hunt confirmé", "AP LT Trade extrême", "Réintégration Corridor"], ex: { pair: "XAU/USD", tf: "M15", type: "Long", sl: "sous mèche du sweep", tp: "bande haute" }, img: "/strategy5.png", color: "#9B59B6" },
  { id: 6, name: "Swing Trading Extrême", sub: "AP LT Trade AI + Engulfing + Momentum + Trend Corridor", obj: "Point de retournement majeur pour un mouvement swing sur plusieurs jours/semaines.", steps: ["Pic extrême AP LT Trade AI (surachat/survente)", "Sortie prix ET Momentum hors Corridor", "Croisement prix/Momentum en dehors des bandes", "Engulfing (haussière/baissière) → nouvel OB", "Entrée à la clôture de l'Engulfing validée", "SL derrière zone clé, TP1 bande opposée, TP2 liquidité"], filters: ["Extrême AP LT Trade", "Engulfing", "Croisement hors bandes", "OB Pro validé"], ex: { pair: "BTC/USD", tf: "M15+", type: "Swing", sl: "sous mèche basse", tp: "Daily High" }, img: "/strategy6.png", color: "#E74C3C" },
];

function ToolModal({ tool, onClose }: { tool: any; onClose: () => void }) {
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
            <div style={{ fontSize: 10, color: tool.color, letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 14 }}>🏛️ Utilité Institutionnelle</div>
            {tool.utility.map((u: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ color: tool.color, fontSize: 14, marginTop: 1 }}>▸</span>
                <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{u}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(231,76,60,.06)", borderRadius: 14, padding: "18px 22px", border: "1px solid rgba(231,76,60,.12)" }}>
            <div style={{ fontSize: 10, color: "#E74C3C", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 10 }}>⚠️ Piège à Éviter</div>
            <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{tool.trap}</p>
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
  const L = t[lang];
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

      {/* HERO */}
      <section id="hero"><div className="hbg" /><div className="hmesh" /><div className="hero-img" />
        <div className="hg">
          <div>
            <div className="hbd"><span className="hdt" /><span>{L.hero_badge}</span></div>
            <h1>{L.hero_title}<br /><Typewriter lang={lang} /></h1>
            <p className="hp">{L.hero_desc}</p>
            <div className="hbt"><a href="#pricing" className="bg2">{L.hero_btn1}</a><a href="#hub" className="bo">{L.hero_btn2}</a></div>
          </div>
          <div>
            <div className="cc">
              <div className="cch">
                <div><div className="ccs">XAUUSD • Gold</div><div className="ccp">2,687.<span style={{ fontSize: 22, color: "var(--td)" }}>45</span></div></div>
                <div style={{ textAlign: isRtl ? "left" : "right" }}><div className="ccpc">▲ +1.24%</div><div style={{ fontSize: 10, color: "var(--tm)", marginTop: 6, fontFamily: "'JetBrains Mono',monospace" }}>{L.chart_conf}</div></div>
              </div>
              <LiveChart />
              <div className="cctg"><span className="cct">Trend: Bullish</span><span className="cct">Volume: High</span><span className="cct">RSI: 62.4</span></div>
              <div className="ccai"><span className="ccaid" /><span>{L.chart_ai} <b>{L.chart_ai2}</b> {L.chart_ai3}</span></div>
            </div>
          </div>
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
          {[{ i: "🧠", t2: L.svc1_t, d: L.svc1_d }, { i: "🖥️", t2: L.svc2_t, d: L.svc2_d }, { i: "🎯", t2: L.svc3_t, d: L.svc3_d }, { i: "🏢", t2: L.svc4_t, d: L.svc4_d }].map((s, idx) => (
            <FI key={idx}><div className="sc2"><span className="si">{s.i}</span><h3 className="sct">{s.t2}</h3><p className="scd">{s.d}</p></div></FI>
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
          {[{ i: "🖥️", t2: L.hub_f1_t, d: L.hub_f1_d }, { i: "📶", t2: L.hub_f2_t, d: L.hub_f2_d }, { i: "🧠", t2: L.hub_f3_t, d: L.hub_f3_d }, { i: "☕", t2: L.hub_f4_t, d: L.hub_f4_d }, { i: "🔒", t2: L.hub_f5_t, d: L.hub_f5_d }, { i: "🤝", t2: L.hub_f6_t, d: L.hub_f6_d }].map((f, i) => (
            <FI key={i}><div className="hf"><div className="hfi">{f.i}</div><div><div className="hft">{f.t2}</div><div className="hfd">{f.d}</div></div></div></FI>
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
          <FI key={i}><div className="ic" style={{ cursor: "pointer" }} onClick={() => setSelectedTool(toolsDetail[i])}><div className="icb" style={{ background: ind.c }} /><div className="icd" style={{ background: ind.c, boxShadow: `0 0 10px ${ind.c}66` }} /><div className="icn">{ind.n}</div><div className="icdesc">{ind.d}</div><div style={{ fontSize: 9, color: ind.c, letterSpacing: 1.5, fontWeight: 600, marginTop: 8, opacity: .7 }}>VOIR DÉTAILS →</div></div></FI>
        ))}</div>
      </div></section>

      {/* ═══════ STRATEGIES — TOOLS + DOW + 6 STRATEGIES ═══════ */}
      <section id="strategies" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag="Arsenal" title="Tools & Strategies" desc="11 outils IA institutionnels et 6 stratégies éprouvées. Cliquez sur chaque outil pour découvrir les détails." /></FI>
        
        {/* 11 TOOLS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14, marginBottom: 80 }}>
          {toolsDetail.map((td, i) => (
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
              <div style={{ fontSize: 9, color: td.color, letterSpacing: 1.5, fontWeight: 600, opacity: .7 }}>VOIR DÉTAILS →</div>
            </div></FI>
          ))}
        </div>

        {/* DOW THEORY */}
        <FI><div style={{ maxWidth: 800, margin: "0 auto 80px", background: "var(--c1)", borderRadius: 18, padding: "36px 32px", border: "1px solid rgba(201,168,76,.08)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, textAlign: "center", marginBottom: 20 }}>La <span className="gld">Théorie de Dow</span> — Le Socle</div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,transparent,var(--g),transparent)", margin: "0 auto 24px" }} />
          <p style={{ fontSize: 14, color: "var(--td)", lineHeight: 1.85, marginBottom: 20, textAlign: "center" }}>La structure du marché agit comme un <strong style={{ color: "var(--g)" }}>GPS institutionnel</strong>. Sans elle, les signaux deviennent contradictoires. Avec elle, chaque outil prend son sens.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{n:"AP LT Trade AI",r:"Indicateur d'excès pertinent",id:8},{n:"Momentum",r:"Confirmation de retournement",id:9},{n:"Order Blocks",r:"Zones de réaction haute probabilité",id:4},{n:"Trend Corridor",r:"Canal d'élasticité cohérent",id:7}].map((d,i) => (
              <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(201,168,76,.03)", border: "1px solid rgba(201,168,76,.06)", cursor: "pointer", transition: "all .3s" }}
                onClick={() => setSelectedTool(toolsDetail.find(t => t.id === d.id))}
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
        {strategiesData.map((s, si) => (
          <FI key={s.id}><div style={{ marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, border: `1px solid ${s.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.id}</div>
              <div><h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.15 }}>{s.name}</h3><p style={{ fontSize: 11, color: s.color, letterSpacing: 1, marginTop: 2 }}>{s.sub}</p></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
              <div style={{ order: si % 2 === 0 ? 1 : 2 }}>
                <div style={{ background: "var(--c1)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(201,168,76,.08)", marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 6 }}>Objectif</div>
                  <p style={{ fontSize: 13, color: "var(--td)", lineHeight: 1.7 }}>{s.obj}</p>
                </div>
                <div style={{ background: "var(--c1)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(201,168,76,.08)", marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 12 }}>Process</div>
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
                  <div style={{ fontSize: 9, color: s.color, letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 8 }}>Exemple de Trade</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[["Paire", s.ex.pair], ["TF", s.ex.tf], ["Type", s.ex.type], ["SL", s.ex.sl], ["TP", s.ex.tp]].map(([l, v], ei) => (
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
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,3vw,36px)", fontWeight: 700, color: "var(--tx)", textAlign: "center" }}>Powered by <span className="gld">13 Years</span> of Market Data</div>
          <div style={{ fontSize: 12, color: "var(--td)", letterSpacing: 2 }}>AI • Analytics • Excellence</div>
        </div>
      </div></FI>

      <section id="pricing"><div className="mx">
        <FI><SH tag={L.pr_tag} title={L.pr_title} /></FI>
        <div className="pg">
          {[
            { n: L.pr1_n, dur: "30 min", pr: "Free", per: "", feat: [L.pr1_f1, L.pr1_f2, L.pr1_f3, L.pr1_f4], pop: false, btn: L.pr1_btn },
            { n: L.pr2_n, dur: "1 hour", pr: "€48.40", per: "/session", feat: [L.pr2_f1, L.pr2_f2, L.pr2_f3, L.pr2_f4], pop: true, btn: L.pr2_btn },
            { n: L.pr3_n, dur: "1 hour", pr: "€96.80", per: "/session", feat: [L.pr3_f1, L.pr3_f2, L.pr3_f3, L.pr3_f4], pop: false, btn: L.pr3_btn },
            { n: L.pr4_n, dur: "Full day", pr: L.pr4_price, per: "", feat: [L.pr4_f1, L.pr4_f2, L.pr4_f3, L.pr4_f4], pop: false, btn: L.pr4_btn },
          ].map((p, i) => (
            <FI key={i}><div className={`pc ${p.pop ? "pop" : ""}`}><div className="pi">
              {p.pop && <div className="ppb">POPULAR</div>}
              <div className="pn">{p.n}</div>
              <div className="pdu">⏱ {p.dur}</div>
              <div className="ppr">{p.pr} {p.per && <span className="pper">{p.per}</span>}</div>
              {p.feat.map((f, fi) => <div key={fi} className="pf">{f}</div>)}
              <button className={`pbt ${p.pop ? "gd" : "ot"}`} onClick={() => { if (i === 0) setShowBooking(true); }}>{p.btn}</button>
            </div></div></FI>
          ))}
        </div>
      </div></section>

      {/* TEAM */}
      <section id="team" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag={L.team_tag} title={L.team_title} /></FI>
        <FI><div className="tc"><div className="tav"><div className="tavi">L</div></div><div className="tn">Lucas</div><div className="tr2">{L.team_role}</div><p className="tbio">{L.team_bio}</p></div></FI>
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
      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />

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
