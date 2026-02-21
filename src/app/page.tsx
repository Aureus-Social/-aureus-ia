"use client";
import { useState, useEffect, useRef } from "react";
import { t, langNames, type Lang } from "./translations";
import { termsContent } from "./terms-content";
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
    return dt >= today && dow !== 0 && dow !== 6;
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

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
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
      <section id="hero"><div className="hbg" /><div className="hmesh" />
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
          <div className="hl">
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
          <div className="dci">✦</div>
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
          <FI key={i}><div className="ic"><div className="icb" style={{ background: ind.c }} /><div className="icd" style={{ background: ind.c, boxShadow: `0 0 10px ${ind.c}66` }} /><div className="icn">{ind.n}</div><div className="icdesc">{ind.d}</div></div></FI>
        ))}</div>
      </div></section>

      {/* PRICING */}
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
        <FI><div style={{ background: "linear-gradient(145deg,var(--c1),var(--c2))", border: "1px solid rgba(201,168,76,.08)", borderRadius: 20, overflow: "hidden", padding: 4 }}>
          <iframe
            src={`https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&importance=2,3&features=datepicker,timezone,timesremaining,filters&countries=72,22,17,25,39,5,32&calType=week&timeZone=15&lang=${lang === "fr" ? "4" : lang === "nl" ? "8" : lang === "de" ? "2" : lang === "es" ? "9" : lang === "pt" ? "10" : lang === "ru" ? "6" : lang === "ar" ? "7" : "1"}`}
            width="100%"
            height="600"
            style={{ border: "none", borderRadius: 16, background: "#0A0A0F" }}
            allowFullScreen
          />
        </div></FI>
        <FI><p style={{ textAlign: "center", fontSize: 11, color: "var(--tm)", marginTop: 16 }}>
          Data provided by <a href="https://www.investing.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--g)" }}>Investing.com</a>
        </p></FI>
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
        <div><div className="fh">{L.ft_platform}</div><a href="#services">{L.nav_services}</a><a href="#hub">Brussels Hub</a><a href="#indicators">{L.nav_indicators}</a><a href="#discovery">Discovery Day</a><a href="#pricing">{L.nav_pricing}</a></div>
        <div><div className="fh">{L.ft_legal}</div><a href="https://fr.trustpilot.com/review/aureus-ia.com" target="_blank" rel="noopener noreferrer">⭐ Trustpilot</a><a href="#" onClick={e => { e.preventDefault(); setShowTerms(true); }}>{L.ft_privacy}</a><a href="#" onClick={e => { e.preventDefault(); setShowTerms(true); }}>{L.ft_terms}</a></div>
        <div><div className="fh">{L.ft_contact}</div><p style={{ fontSize: 12, color: "var(--td)", lineHeight: 1.65 }}>Pl. Marcel Broodthaers 8<br />1060 Saint-Gilles, Belgium<br />info@aureus-ia.com<br />+32 491 70 94 13</p></div>
      </div><div className="fb">{L.ft_copy}</div></footer>

      {/* WHATSAPP */}
      <a href="https://wa.me/32491709413" target="_blank" rel="noopener noreferrer" className="wa">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      {/* TERMS MODAL */}
      {showTerms && <TermsModal lang={lang} onClose={() => setShowTerms(false)} />}

      {/* BOOKING MODAL */}
      {showBooking && <BookingModal lang={lang} onClose={() => setShowBooking(false)} />}
    </div>
  );
}
