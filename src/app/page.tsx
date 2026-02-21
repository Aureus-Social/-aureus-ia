"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const tickerData = [
  { s: "XAUUSD", p: "2,687.45", c: "+1.24%", up: true },
  { s: "EURUSD", p: "1.0842", c: "+0.15%", up: true },
  { s: "BTCUSD", p: "97,432", c: "+3.21%", up: true },
  { s: "US500", p: "6,012.8", c: "-0.32%", up: false },
  { s: "GBPUSD", p: "1.2634", c: "+0.08%", up: true },
  { s: "USDJPY", p: "149.82", c: "-0.45%", up: false },
  { s: "XAGUSD", p: "31.42", c: "+2.10%", up: true },
];

const reviews = [
  { n: "Marc D.", r: "Independent Trader", t: "Aureus IA has completely transformed my analytical approach. The AI indicators detect patterns I would never have seen. Exceptional." },
  { n: "Sophie L.", r: "Financial Analyst", t: "The coaching with Lucas is incredibly valuable. 13 years of expertise distilled into actionable insights. The platform is next-level." },
  { n: "Thomas B.", r: "Portfolio Manager", t: "Finally an AI tool that delivers real analytical depth. The institutional-grade approach is exactly what I needed for my portfolio." },
  { n: "Elena K.", r: "Data Scientist", t: "From a technical standpoint, the AI models behind Aureus IA are impressive. Pattern recognition accuracy is truly remarkable." },
  { n: "Pierre V.", r: "Day Trader", t: "The Discovery Day was a game-changer. A full day of immersion that gave me a completely new perspective on market analysis." },
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

const faqs = [
  { q: "Is Aureus IA a trading signal service?", a: "No. Aureus IA is strictly educational and analytical. We do not provide financial advice, investment recommendations, or trading signals of any kind." },
  { q: "What are the 11 proprietary indicators?", a: "Trend Matrix Pro, Volume Surge AI, Fibonacci Neural, Order Flow Scanner, Momentum Pulse, Support/Resistance AI, Divergence Hunter, Volatility Shield, Candlestick AI, Correlation Radar, and Risk Manager Pro." },
  { q: "Do I need prior trading experience?", a: "Not at all. Every new user starts with a free 30-minute consultation. We adapt to all levels, from beginners to experienced analysts." },
  { q: "How does remote access work?", a: "Via a secure encrypted API key. All tools run server-side. Works on any device with a browser — no installation required." },
  { q: "Is my data safe?", a: "Absolutely. GDPR-compliant, Belgian privacy law, ISO 27001 standards. All data encrypted on European servers." },
  { q: "Can I visit the Brussels hub?", a: "Yes! Place Marcel Broodthaers 8, 1060 Saint-Gilles. Book a workstation by the hour or day. Discovery Day available by invitation." },
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
      {d.map((t, i) => (
        <span key={i}>
          <span className="ts">{t.s}</span>{" "}
          <span className="tp">{t.p}</span>{" "}
          <span className={t.up ? "tu" : "td2"}>{t.c}</span>
        </span>
      ))}
    </div></div>
  );
}

function Typewriter() {
  const words = ["Market Intelligence", "Trading Analytics", "Pattern Recognition", "Risk Management", "Data Science"];
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!del) {
        if (ci < words[wi].length) setCi(ci + 1);
        else setTimeout(() => setDel(true), 2200);
      } else {
        if (ci > 0) setCi(ci - 1);
        else { setDel(false); setWi((wi + 1) % words.length); }
      }
    }, del ? 45 : 85);
    return () => clearTimeout(t);
  }, [ci, del, wi]);

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
      price += (Math.random() - 0.48) * 3;
      data.push(price);
      if (data.length > 300) data.shift();
      const mn = Math.min(...data) - 5, mx = Math.max(...data) + 5, rn = mx - mn;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(201,168,76,.18)");
      g.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath(); ctx.moveTo(0, H);
      data.forEach((v, i) => ctx.lineTo((i / (data.length - 1)) * W, H - ((v - mn) / rn) * H));
      ctx.lineTo(W, H); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = (i / (data.length - 1)) * W, y = H - ((v - mn) / rn) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
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
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);
  const r = reviews[cur];
  return (
    <div className="rv">
      <div className="rvq">&ldquo;</div>
      <p className="rvt">{r.t}</p>
      <div className="rvs">★★★★★</div>
      <div className="rvn">{r.n}</div>
      <div className="rvr">{r.r}</div>
      <div className="rvd">
        {reviews.map((_, i) => (
          <button key={i} className={`rvdt ${i === cur ? "act" : ""}`} onClick={() => setCur(i)} />
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      {faqs.map((f, i) => (
        <div key={i} className={`fq ${open === i ? "op" : ""}`} onClick={() => setOpen(open === i ? null : i)}>
          <div className="fqq"><h4>{f.q}</h4><span className="fqi">+</span></div>
          <div className="fqa"><p>{f.a}</p></div>
        </div>
      ))}
    </>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const handleSend = () => { setSent(true); setTimeout(() => setSent(false), 2500); };
  return (
    <div className="cf">
      <div className="cfr">
        <input className="cfi" placeholder="Your Name" />
        <input className="cfi" placeholder="Your Email" />
      </div>
      <textarea className="cfi" placeholder="Your Message" rows={5} style={{ resize: "vertical" }} />
      <button className="cfb" onClick={handleSend}>{sent ? "✓ Message Sent!" : "Send Message"}</button>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1800);
    const onScroll = () => {
      const s = window.scrollY;
      const d = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(d > 0 ? (s / d) * 100 : 0);
      setScrolled(s > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Services", "Hub", "Indicators", "Pricing", "Team", "Reviews", "FAQ"];

  return (
    <>
      {/* LOADER */}
      <div id="loader" className={loading ? "" : "hide"}>
        <div className="lr"><span>A</span></div>
        <div className="lt">Aureus IA</div>
      </div>

      {/* SCROLL PROGRESS */}
      <div id="sp" style={{ width: `${scrollPct}%` }} />

      {/* NAVBAR */}
      <nav id="nb" className={scrolled ? "sc" : ""}>
        <Ticker />
        <div className="ni">
          <a href="#" className="logo">
            <div className="lc">A</div>
            <div><div className="lo-t">AUREUS IA</div><div className="lo-s">Market Analysis Experts</div></div>
          </a>
          <div className="nl">
            {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>)}
            <a href="#contact" className="nc">BOOK A CALL</a>
          </div>
          <button className="bur" onClick={() => setMobileMenu(!mobileMenu)}>
            <span /><span /><span />
          </button>
        </div>
        <div id="mob" className={`mm ${mobileMenu ? "op" : ""}`}>
          {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileMenu(false)}>{l}</a>)}
          <a href="#contact" onClick={() => setMobileMenu(false)}>Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hbg" /><div className="hmesh" />
        <div className="hg">
          <div>
            <div className="hbd"><span className="hdt" /><span>LIVE AI ANALYSIS</span></div>
            <h1>The Future of<br /><Typewriter /></h1>
            <p className="hp">Institutional-grade AI analytics trusted by 200+ professionals worldwide. 11 proprietary indicators powered by 13 years of market expertise.</p>
            <div className="hbt">
              <a href="#pricing" className="bg2">Explore Plans</a>
              <a href="#hub" className="bo">Visit Our Hub →</a>
            </div>
          </div>
          <div>
            <div className="cc">
              <div className="cch">
                <div><div className="ccs">XAUUSD • Gold</div><div className="ccp">2,687.<span style={{ fontSize: 22, color: "var(--td)" }}>45</span></div></div>
                <div style={{ textAlign: "right" }}><div className="ccpc">▲ +1.24%</div><div style={{ fontSize: 10, color: "var(--tm)", marginTop: 6, fontFamily: "'JetBrains Mono',monospace" }}>Confidence: 94.2%</div></div>
              </div>
              <LiveChart />
              <div className="cctg"><span className="cct">Trend: Bullish</span><span className="cct">Volume: High</span><span className="cct">RSI: 62.4</span></div>
              <div className="ccai"><span className="ccaid" /><span>AI Engine <b>analyzing 2.4M data points</b> in real-time</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "0 28px" }}>
        <div className="stats">
          {[{ v: "13+", l: "Years Experience" }, { v: "200+", l: "Satisfied Clients" }, { v: "11", l: "AI Indicators" }, { v: "24/7", l: "Live Analysis" }].map((s, i) => (
            <div key={i} className="stat"><div className="stv">{s.v}</div><div className="stl">{s.l}</div></div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services"><div className="mx">
        <FI><SH tag="Our Services" title="How Aureus IA Works" /></FI>
        <div className="g4">
          {[
            { i: "🧠", t: "AI Market Intelligence", d: "Our proprietary AI engine analyzes millions of data points in real-time, detecting behavioral patterns and market dynamics invisible to the human eye." },
            { i: "🖥️", t: "Remote Analytical Access", d: "Connect securely from anywhere. Access all 11 institutional-grade indicators through our encrypted digital environment." },
            { i: "🎯", t: "Premium Coaching", d: "1-on-1 sessions with Lucas, 13+ years of expertise. Personalized training programs adapting to your analytical level and goals." },
            { i: "🏢", t: "Brussels Analysis Hub", d: "The world's first AI-powered market analysis coworking space. Professional workstations in our Saint-Gilles facility." },
          ].map((s, idx) => (
            <FI key={idx}><div className="sc2"><span className="si">{s.i}</span><h3 className="sct">{s.t}</h3><p className="scd">{s.d}</p></div></FI>
          ))}
        </div>
      </div></section>

      {/* BRUSSELS HUB */}
      <section id="hub" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag="Our Space" title="The Brussels Hub" desc='Located in the heart of <span style="color:var(--g);font-weight:600">Saint-Gilles, Brussels</span> — the world&#39;s first physical space dedicated to AI-powered market education and analysis.' /></FI>
        <FI><div className="hub">
          <div className="hl">
            <div style={{ fontSize: 44 }}>🇧🇪</div>
            <div className="ha">Place Marcel<br />Broodthaers 8</div>
            <div className="hcy">1060 Saint-Gilles, Brussels, Belgium</div>
            {["🚇 Metro Louise — 5 min walk", "🚋 Tram 81, 97 — direct access", "🅿️ Free street parking", "✈️ Brussels Airport — 30 min"].map((t, i) => (
              <div key={i} className="htr">{t}</div>
            ))}
          </div>
          <div className="hr2">
            <div style={{ fontSize: 11, color: "var(--g)", letterSpacing: 3, textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 16 }}>Available Options</div>
            <div className="ho"><div className="hoh"><span className="hot">Hourly Access</span><span className="hop">€48.40/h</span></div><div className="hod">Full tools, AI indicators, and expert support for focused analysis sessions.</div></div>
            <div className="ho"><div className="hoh"><span className="hot">Full Day Pass</span><span className="hop">Custom</span></div><div className="hod">8 hours of dedicated workspace. Deep research and intensive learning.</div></div>
            <div className="ho fl" style={{ position: "relative" }}><span className="hbdg">EXCLUSIVE</span><div className="hoh"><span className="hot">Discovery Day</span><span className="hop">By invitation</span></div><div className="hod">Our most exclusive experience. A full day of private immersion. Contact us.</div></div>
            <div className="hopn"><span className="hopd" /><span style={{ fontSize: 11, fontWeight: 700, color: "var(--gr)" }}>NOW OPEN</span><span style={{ fontSize: 11, color: "var(--td)", marginLeft: 10 }}>Monday–Friday • 9:00–18:00</span></div>
          </div>
        </div></FI>
        <div className="hfg">
          {[
            { i: "🖥️", t: "Pro Workstations", d: "Multi-screen setups with institutional-grade software and real-time data feeds." },
            { i: "📶", t: "Ultra-Fast Connectivity", d: "Fiber optic with redundant backup. Sub-millisecond latency for real-time analysis." },
            { i: "🧠", t: "AI Tools On-Site", d: "All 11 Aureus IA indicators pre-installed and configured. Ready from day one." },
            { i: "☕", t: "Premium Amenities", d: "Complimentary coffee, tea, refreshments. Lounge area for breaks and networking." },
            { i: "🔒", t: "Secure Environment", d: "Biometric access, encrypted networks, GDPR-compliant. Data stays protected." },
            { i: "🤝", t: "Expert Guidance", d: "Lucas and team for guidance, questions, and coaching throughout the day." },
          ].map((f, i) => (
            <FI key={i}><div className="hf"><div className="hfi">{f.i}</div><div><div className="hft">{f.t}</div><div className="hfd">{f.d}</div></div></div></FI>
          ))}
        </div>
      </div></section>

      {/* DISCOVERY DAY */}
      <section id="discovery"><div className="mx">
        <FI><div className="dc">
          <div className="dci">✦</div>
          <h2 className="dct"><span className="gld">The Discovery Day</span></h2>
          <p className="dcp">An exclusive, full-day private experience at our Brussels hub. Immerse yourself in the full power of Aureus IA&apos;s AI ecosystem alongside our founder, Lucas. Tailored to your ambitions. Limited availability.</p>
          <div className="dcc">
            <span className="dcch">Full day • Private access</span>
            <span className="dcch">All 11 AI indicators</span>
            <span className="dcch">1-on-1 with Lucas</span>
            <span className="dcch">Certificate of completion</span>
          </div>
          <a href="#contact" className="bg2">Request an Invitation</a>
          <p className="dcn">Limited to a select number of participants per session. By application only.</p>
        </div></FI>
      </div></section>

      {/* INDICATORS */}
      <section id="indicators" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag="Arsenal" title="11 AI-Powered Indicators" /></FI>
        <div className="ig">
          {indicators.map((ind, i) => (
            <FI key={i}><div className="ic">
              <div className="icb" style={{ background: ind.c }} />
              <div className="icd" style={{ background: ind.c, boxShadow: `0 0 10px ${ind.c}66` }} />
              <div className="icn">{ind.n}</div>
              <div className="icdesc">{ind.d}</div>
            </div></FI>
          ))}
        </div>
      </div></section>

      {/* PRICING */}
      <section id="pricing"><div className="mx">
        <FI><SH tag="Pricing" title="Plans & Pricing" /></FI>
        <div className="pg">
          {[
            { n: "Free Consultation", dur: "30 min", pr: "Free", per: "", feat: ["Platform discovery", "Live demo session", "Q&A with our team", "Zero commitment"], pop: false },
            { n: "AI-Powered Access", dur: "1 hour", pr: "€48.40", per: "/session", feat: ["Full AI hub access", "All 11 indicators live", "Real-time analysis", "Professional environment"], pop: true },
            { n: "Coaching Premium", dur: "1 hour", pr: "€96.80", per: "/session", feat: ["1-on-1 with Lucas", "Personalized program", "Advanced AI training", "Strategy development"], pop: false },
            { n: "Discovery Day", dur: "Full day", pr: "On request", per: "", feat: ["Private immersion", "Complete deep-dive", "Hands-on all tools", "Certificate included"], pop: false },
          ].map((p, i) => (
            <FI key={i}><div className={`pc ${p.pop ? "pop" : ""}`}><div className="pi">
              {p.pop && <div className="ppb">POPULAR</div>}
              <div className="pn">{p.n}</div>
              <div className="pdu">⏱ {p.dur}</div>
              <div className="ppr">{p.pr} {p.per && <span className="pper">{p.per}</span>}</div>
              {p.feat.map((f, fi) => <div key={fi} className="pf">{f}</div>)}
              <button className={`pbt ${p.pop ? "gd" : "ot"}`}>{p.pop ? "Book Now" : i === 0 ? "Schedule Now" : "Contact Us"}</button>
            </div></div></FI>
          ))}
        </div>
      </div></section>

      {/* TEAM */}
      <section id="team" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx">
        <FI><SH tag="Leadership" title="The Team" /></FI>
        <FI><div className="tc">
          <div className="tav"><div className="tavi">L</div></div>
          <div className="tn">Lucas</div>
          <div className="tr2">Founder &amp; Lead Trainer</div>
          <p className="tbio">With over 13 years of experience in trading and market analysis, Lucas built Aureus IA to democratize institutional-grade tools. His intensive training and personalized coaching share the discipline and methodology required for long-term analytical success.</p>
        </div></FI>
      </div></section>

      {/* REVIEWS */}
      <section id="reviews"><div className="mx">
        <FI><SH tag="Testimonials" title="What Clients Say" /></FI>
        <FI><Reviews /></FI>
      </div></section>

      {/* FAQ */}
      <section id="faq" style={{ background: "linear-gradient(180deg,transparent,rgba(201,168,76,.015),transparent)" }}><div className="mx" style={{ maxWidth: 780 }}>
        <FI><SH tag="Questions" title="Frequently Asked" /></FI>
        <FAQ />
      </div></section>

      {/* CONTACT */}
      <section id="contact"><div className="mx" style={{ maxWidth: 660 }}>
        <FI><SH tag="Get in Touch" title="Let's Connect" desc="Transparent, pedagogical, and compliant approach under Belgian and European regulations. No financial advice." /></FI>
        <FI><ContactForm /></FI>
        <FI><div className="ci">
          <div><div className="cii">📍</div><div className="cil">Address</div><div className="civ">Pl. Marcel Broodthaers 8<br />1060 Saint-Gilles, Brussels</div></div>
          <div><div className="cii">✉️</div><div className="cil">Email</div><div className="civ">info@aureus-ia.com</div></div>
          <div><div className="cii">📞</div><div className="cil">Phone</div><div className="civ">+32 491 70 94 13</div></div>
        </div></FI>
      </div></section>

      {/* FOOTER */}
      <footer>
        <div className="fg">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,var(--g),var(--gd))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "var(--bg)", fontFamily: "'Cormorant Garamond',serif" }}>A</div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>AUREUS IA</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--tm)", lineHeight: 1.65 }}>AI-powered market analysis.<br />Educational &amp; analytical — not financial advice.</p>
          </div>
          <div><div className="fh">Platform</div><a href="#services">Services</a><a href="#hub">Brussels Hub</a><a href="#indicators">Indicators</a><a href="#discovery">Discovery Day</a><a href="#pricing">Pricing</a></div>
          <div><div className="fh">Legal</div><a href="https://fr.trustpilot.com/review/aureus-ia.com" target="_blank" rel="noopener noreferrer">⭐ Trustpilot</a><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a></div>
          <div><div className="fh">Contact</div><p style={{ fontSize: 12, color: "var(--td)", lineHeight: 1.65 }}>Pl. Marcel Broodthaers 8<br />1060 Saint-Gilles, Belgium<br />info@aureus-ia.com<br />+32 491 70 94 13</p></div>
        </div>
        <div className="fb">© 2025 Aureus IA SPRL — BCE BE 1028.230.781 — All rights reserved</div>
      </footer>

      {/* WHATSAPP */}
      <a href="https://wa.me/32491709413" target="_blank" rel="noopener noreferrer" className="wa">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </>
  );
}
