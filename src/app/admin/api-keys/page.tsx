"use client";
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://jwjtlpewwdjxdboxtbdf.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type ApiKey = {
  id: string;
  client_name: string;
  client_email: string;
  api_key: string;
  status: "active" | "suspended" | "expired";
  plan: string;
  monthly_price: number;
  api_price: number;
  created_at: string;
  expires_at: string | null;
  notes: string | null;
};

function generateKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [8, 4, 4, 4, 8];
  return segments.map(len =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  ).join("-");
}

export default function AdminApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    client_name: "", client_email: "", plan: "AI-Powered Access",
    monthly_price: 300, api_price: 5000, notes: "", expires_at: "",
  });
  const [newKey, setNewKey] = useState("");

  const fetchKeys = async () => {
    setLoading(true);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/aureus_api_keys?order=created_at.desc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      }
    });
    if (res.ok) {
      const data = await res.json();
      setKeys(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const createKey = async () => {
    if (!form.client_name || !form.client_email) return;
    const key = generateKey();
    setNewKey(key);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/aureus_api_keys`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        client_name: form.client_name,
        client_email: form.client_email,
        api_key: key,
        status: "active",
        plan: form.plan,
        monthly_price: form.monthly_price,
        api_price: form.api_price,
        notes: form.notes || null,
        expires_at: form.expires_at || null,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ client_name: "", client_email: "", plan: "AI-Powered Access", monthly_price: 300, api_price: 5000, notes: "", expires_at: "" });
      fetchKeys();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${SUPABASE_URL}/rest/v1/aureus_api_keys?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    fetchKeys();
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const g = "#C9A84C";
  const bg = "#0a0a0a";
  const c1 = "#111111";
  const tx = "#f0ede6";
  const td = "#999";

  const statusColor = (s: string) => s === "active" ? "#2ECC71" : s === "suspended" ? "#E74C3C" : "#888";
  const statusLabel = (s: string) => s === "active" ? "✓ Actif" : s === "suspended" ? "✗ Suspendu" : "⏰ Expiré";

  const totalMRR = keys.filter(k => k.status === "active").reduce((a, k) => a + k.monthly_price, 0);
  const totalARR = totalMRR * 12;
  const totalApiRevenue = keys.reduce((a, k) => a + k.api_price, 0);

  return (
    <div style={{ minHeight: "100vh", background: bg, color: tx, fontFamily: "'Inter',sans-serif", padding: "32px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: g }}>Aureus IA</div>
          <div style={{ fontSize: 13, color: td, marginTop: 2 }}>Gestion des Clés API Clients</div>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: "10px 22px", background: `linear-gradient(135deg,${g},#a07830)`,
          color: "#000", fontWeight: 700, fontSize: 13, borderRadius: 8, border: "none", cursor: "pointer",
        }}>+ Nouvelle Clé API</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { l: "Clients Actifs", v: keys.filter(k => k.status === "active").length, u: "" },
          { l: "MRR", v: `€${totalMRR.toLocaleString()}`, u: "/mois" },
          { l: "ARR Projeté", v: `€${totalARR.toLocaleString()}`, u: "/an" },
          { l: "Revenu API Total", v: `€${totalApiRevenue.toLocaleString()}`, u: "" },
        ].map((s, i) => (
          <div key={i} style={{ background: c1, borderRadius: 12, padding: "18px 20px", border: "1px solid rgba(201,168,76,.1)" }}>
            <div style={{ fontSize: 10, color: td, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: g, fontFamily: "'JetBrains Mono',monospace" }}>
              {s.v}<span style={{ fontSize: 12, color: td }}>{s.u}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New key banner */}
      {newKey && (
        <div style={{ background: "rgba(46,204,113,.08)", border: "1px solid rgba(46,204,113,.3)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "#2ECC71", fontWeight: 700, marginBottom: 4 }}>✅ CLÉ GÉNÉRÉE — À ENVOYER AU CLIENT MAINTENANT</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: tx, letterSpacing: 2 }}>{newKey}</div>
          </div>
          <button onClick={() => copyKey(newKey)} style={{ padding: "8px 16px", background: "#2ECC71", color: "#000", fontWeight: 700, borderRadius: 6, border: "none", cursor: "pointer" }}>
            {copied === newKey ? "✓ Copié !" : "Copier"}
          </button>
        </div>
      )}

      {/* Keys table */}
      <div style={{ background: c1, borderRadius: 14, border: "1px solid rgba(201,168,76,.08)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 11, color: td, display: "grid", gridTemplateColumns: "2fr 2fr 3fr 1fr 1.2fr 1.2fr 1.5fr", gap: 8 }}>
          <div>CLIENT</div><div>EMAIL</div><div>CLÉ API</div><div>STATUT</div><div>MRR</div><div>API</div><div>ACTIONS</div>
        </div>
        {loading && <div style={{ padding: 32, textAlign: "center", color: td }}>Chargement...</div>}
        {!loading && keys.length === 0 && (
          <div style={{ padding: 48, textAlign: "center", color: td }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔑</div>
            <div style={{ fontSize: 14 }}>Aucune clé API. Créez votre premier client.</div>
          </div>
        )}
        {keys.map((k, i) => (
          <div key={k.id} style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.03)", display: "grid", gridTemplateColumns: "2fr 2fr 3fr 1fr 1.2fr 1.2fr 1.5fr", gap: 8, alignItems: "center", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: tx }}>{k.client_name}</div>
            <div style={{ fontSize: 12, color: td }}>{k.client_email}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: g, letterSpacing: 1 }}>
                {k.api_key.slice(0,8)}···{k.api_key.slice(-4)}
              </span>
              <button onClick={() => copyKey(k.api_key)} style={{ fontSize: 10, padding: "2px 8px", background: "rgba(201,168,76,.1)", color: g, border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, cursor: "pointer" }}>
                {copied === k.api_key ? "✓" : "Copier"}
              </button>
            </div>
            <div style={{ fontSize: 11, color: statusColor(k.status), fontWeight: 600 }}>{statusLabel(k.status)}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: tx }}>€{k.monthly_price}/mo</div>
            <div style={{ fontSize: 12, color: td }}>€{k.api_price}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {k.status !== "active" && (
                <button onClick={() => updateStatus(k.id, "active")} style={{ fontSize: 10, padding: "3px 8px", background: "rgba(46,204,113,.15)", color: "#2ECC71", border: "1px solid rgba(46,204,113,.2)", borderRadius: 4, cursor: "pointer" }}>Activer</button>
              )}
              {k.status === "active" && (
                <button onClick={() => updateStatus(k.id, "suspended")} style={{ fontSize: 10, padding: "3px 8px", background: "rgba(231,76,60,.1)", color: "#E74C3C", border: "1px solid rgba(231,76,60,.2)", borderRadius: 4, cursor: "pointer" }}>Suspendre</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create form modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: c1, borderRadius: 18, padding: "32px 28px", width: 480, border: "1px solid rgba(201,168,76,.15)" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: g, marginBottom: 24, fontFamily: "'Cormorant Garamond',serif" }}>Nouveau Client — Clé API</div>
            {[
              { l: "Nom / Raison sociale *", k: "client_name", t: "text", ph: "ex: Jean Dupont" },
              { l: "Email *", k: "client_email", t: "email", ph: "ex: jean@gmail.com" },
              { l: "Plan", k: "plan", t: "text", ph: "AI-Powered Access" },
              { l: "Prix API (€ HTVA)", k: "api_price", t: "number", ph: "5000" },
              { l: "Abonnement mensuel (€)", k: "monthly_price", t: "number", ph: "300" },
              { l: "Expiration (optionnel)", k: "expires_at", t: "date", ph: "" },
              { l: "Notes internes", k: "notes", t: "text", ph: "ex: Broker, trading XAUUSD..." },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: td, marginBottom: 4 }}>{f.l}</div>
                <input
                  type={f.t}
                  placeholder={f.ph}
                  value={(form as any)[f.k]}
                  onChange={e => setForm(prev => ({ ...prev, [f.k]: f.t === "number" ? Number(e.target.value) : e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", background: bg, border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: tx, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={createKey} style={{ flex: 1, padding: "11px 0", background: `linear-gradient(135deg,${g},#a07830)`, color: "#000", fontWeight: 700, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13 }}>
                🔑 Générer la Clé API
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: "11px 18px", background: "rgba(255,255,255,.05)", color: td, borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
