"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TldResult {
  tld: string;
  available: boolean;
  price: string;
  renewalPrice: string;
  popular?: boolean;
  premium?: boolean;
}

interface CartItem {
  domain: string;
  price: string;
  tld: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POPULAR_TLDS: { tld: string; price: string; renewal: string; flag?: string; desc: string }[] = [
  { tld: ".com",    price: "₦4,500",  renewal: "₦5,200",  flag: "🌍", desc: "Most trusted globally" },
  { tld: ".ng",     price: "₦2,800",  renewal: "₦3,200",  flag: "🇳🇬", desc: "Nigeria's official TLD" },
  { tld: ".com.ng", price: "₦1,500",  renewal: "₦1,800",  flag: "🇳🇬", desc: "Nigerian businesses" },
  { tld: ".org",    price: "₦5,000",  renewal: "₦5,500",  flag: "🌐", desc: "Organizations & NGOs" },
  { tld: ".net",    price: "₦4,800",  renewal: "₦5,000",  flag: "🌐", desc: "Tech & networks" },
  { tld: ".io",     price: "₦18,000", renewal: "₦19,000", flag: "⚡", desc: "Startups & SaaS" },
  { tld: ".africa", price: "₦6,500",  renewal: "₦7,000",  flag: "🌍", desc: "Pan-African identity" },
  { tld: ".co",     price: "₦8,000",  renewal: "₦9,000",  flag: "🚀", desc: "Modern & minimal" },
  { tld: ".store",  price: "₦3,200",  renewal: "₦3,800",  flag: "🛒", desc: "E-commerce brands" },
  { tld: ".tech",   price: "₦9,500",  renewal: "₦10,000", flag: "💡", desc: "Tech companies" },
  { tld: ".online", price: "₦3,500",  renewal: "₦4,000",  flag: "🔗", desc: "Online presence" },
  { tld: ".app",    price: "₦12,000", renewal: "₦13,000", flag: "📱", desc: "Mobile & web apps" },
];

const FAKE_TAKEN = ["google", "facebook", "amazon", "apple", "microsoft", "twitter", "netflix"];

function simulateSearch(name: string): TldResult[] {
  const clean = name.toLowerCase().replace(/\..+$/, "").trim();
  const isTaken = FAKE_TAKEN.includes(clean) || clean.length < 3;

  return POPULAR_TLDS.slice(0, 8).map((t, i) => ({
    tld: t.tld,
    available: isTaken ? i > 2 : Math.random() > 0.25,
    price: t.price,
    renewalPrice: t.renewal,
    popular: [".com", ".ng", ".com.ng"].includes(t.tld),
    premium: t.tld === ".io" || t.tld === ".co",
  }));
}

const SUGGESTIONS = [
  "techstartup", "swiftpay", "agrihub", "naijabiz",
  "cloudforge", "paystack", "afritech", "lagosbiz",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DomainsPage() {
  const [query, setQuery]           = useState("");
  const [searching, setSearching]   = useState(false);
  const [results, setResults]       = useState<TldResult[] | null>(null);
  const [searchedName, setSearchedName] = useState("");
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [addedPulse, setAddedPulse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const clean = query.toLowerCase().replace(/\s+/g, "").replace(/\..+$/, "");
    setSearching(true);
    setResults(null);
    setTimeout(() => {
      setSearchedName(clean);
      setResults(simulateSearch(clean));
      setSearching(false);
    }, 900);
  }

  function addToCart(domain: string, price: string, tld: string) {
    if (cart.find(c => c.domain === domain)) return;
    setCart(prev => [...prev, { domain, price, tld }]);
    setAddedPulse(domain);
    setTimeout(() => setAddedPulse(null), 600);
  }

  function removeFromCart(domain: string) {
    setCart(prev => prev.filter(c => c.domain !== domain));
  }

  const availableCount = results?.filter(r => r.available).length ?? 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #080c14;
          --surface:   #0d1321;
          --surface-2: #111827;
          --border:    rgba(255,255,255,0.07);
          --amber:     #f59e0b;
          --amber-lt:  #fcd34d;
          --amber-dim: rgba(245,158,11,0.12);
          --green:     #10b981;
          --green-dim: rgba(16,185,129,0.1);
          --red:       #ef4444;
          --red-dim:   rgba(239,68,68,0.1);
          --text:      #f1f5f9;
          --muted:     #64748b;
          --muted-2:   #94a3b8;
          --font-disp: 'Syne', sans-serif;
          --font-serif:'Instrument Serif', serif;
          --font-body: 'DM Sans', sans-serif;
          --radius:    12px;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--amber); border-radius: 2px; }

        /* animations */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
          100% { box-shadow: 0 0 0 14px rgba(245,158,11,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-6px); }
        }
        @keyframes addPop {
          0%  { transform:scale(1); }
          40% { transform:scale(1.12); }
          100%{ transform:scale(1); }
        }
        @keyframes resultIn {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0); }
        }

        .fade-up   { animation: fadeUp  0.55s ease both; }
        .fade-in   { animation: fadeIn  0.4s  ease both; }
        .slide-dn  { animation: slideDown 0.3s ease both; }

        /* ── Layout ── */
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        /* ── Nav ── */
        nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(8,12,20,0.9); backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo { font-family: var(--font-disp); font-weight: 800; font-size: 1.2rem; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo-mark { width: 28px; height: 28px; border-radius: 7px; background: var(--amber); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
        .nav-links a { color: var(--muted-2); text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--amber); }
        .nav-cta { padding: 8px 18px; background: var(--amber); color: #000; border-radius: 8px; font-weight: 700; font-size: 0.82rem; text-decoration: none; font-family: var(--font-disp); transition: background 0.2s; }
        .nav-cta:hover { background: var(--amber-lt); }
        @media(max-width:700px) { .nav-links { display:none; } }

        /* ── Cart badge ── */
        .cart-btn {
          position: relative; padding: 8px 16px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; color: var(--muted-2); font-size: 0.82rem;
          font-family: var(--font-disp); font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 6px; transition: all 0.2s;
        }
        .cart-btn:hover { border-color: var(--amber); color: var(--amber); }
        .cart-badge {
          position: absolute; top: -6px; right: -6px;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--amber); color: #000; font-size: 0.65rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          animation: pulse-ring 0.5s ease;
        }

        /* ── Hero ── */
        .hero {
          padding: 80px 24px 64px; text-align: center;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,158,11,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(16,185,129,0.05) 0%, transparent 60%);
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 100px;
          background: var(--amber-dim); border: 1px solid rgba(245,158,11,0.2);
          color: var(--amber); font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 22px;
        }
        .hero-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--amber); animation: pulse-ring 2s ease infinite; }
        .hero-headline {
          font-family: var(--font-disp); font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 800; letter-spacing: -0.03em; line-height: 1.08;
          margin-bottom: 14px; position: relative;
        }
        .hero-headline em {
          font-style: italic; font-family: var(--font-serif);
          font-weight: 400; color: var(--amber);
          background: linear-gradient(135deg, var(--amber) 0%, #fb923c 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          color: var(--muted-2); font-size: 1rem; max-width: 480px;
          margin: 0 auto 36px; line-height: 1.65; font-weight: 300;
        }

        /* ── Search box ── */
        .search-box {
          max-width: 680px; margin: 0 auto;
          background: var(--surface); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; display: flex; align-items: center;
          padding: 6px 6px 6px 18px; gap: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-box:focus-within {
          border-color: var(--amber);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15), 0 20px 60px rgba(0,0,0,0.5);
        }
        .search-icon { color: var(--muted); font-size: 1rem; flex-shrink: 0; }
        .search-input {
          flex: 1; background: none; border: none; outline: none;
          color: var(--text); font-size: 1.05rem; font-family: var(--font-body);
          min-width: 0;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-btn {
          padding: 11px 24px; background: var(--amber); color: #000;
          border: none; border-radius: 9px; font-weight: 700; font-size: 0.875rem;
          font-family: var(--font-disp); cursor: pointer; white-space: nowrap;
          transition: background 0.2s, transform 0.15s; flex-shrink: 0;
        }
        .search-btn:hover:not(:disabled) { background: var(--amber-lt); transform: scale(1.02); }
        .search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* spinner */
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* quick suggestions */
        .suggestions {
          display: flex; flex-wrap: wrap; gap: 7px;
          justify-content: center; margin-top: 14px;
        }
        .suggestion {
          padding: 4px 12px; background: rgba(255,255,255,0.04);
          border: 1px solid var(--border); border-radius: 100px;
          font-size: 0.78rem; color: var(--muted); cursor: pointer;
          transition: all 0.2s; font-weight: 400;
        }
        .suggestion:hover { background: var(--amber-dim); border-color: var(--amber); color: var(--amber); }

        /* ── Results section ── */
        .results-wrap {
          max-width: 760px; margin: 48px auto 0;
          animation: fadeIn 0.4s ease;
        }
        .results-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .results-title {
          font-family: var(--font-disp); font-size: 1rem; font-weight: 700;
          color: var(--text); letter-spacing: -0.01em;
        }
        .results-title span { color: var(--amber); }
        .results-meta { font-size: 0.78rem; color: var(--muted); }
        .results-meta strong { color: var(--green); }

        .result-row {
          display: flex; align-items: center; gap: 12px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 11px; padding: 14px 16px; margin-bottom: 8px;
          transition: border-color 0.2s, transform 0.15s;
          animation: resultIn 0.35s ease both;
        }
        .result-row:hover { border-color: rgba(255,255,255,0.12); transform: translateX(2px); }
        .result-row.available:hover { border-color: rgba(16,185,129,0.3); }

        .result-tld {
          font-family: var(--font-disp); font-size: 0.95rem; font-weight: 700;
          min-width: 90px; color: var(--text);
        }
        .result-domain {
          flex: 1; font-size: 0.9rem; color: var(--muted-2);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .result-domain strong { color: var(--text); }

        .badge {
          padding: 3px 9px; border-radius: 5px; font-size: 0.68rem;
          font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          white-space: nowrap; flex-shrink: 0;
        }
        .badge-popular { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(245,158,11,0.2); }
        .badge-premium  { background: rgba(139,92,246,0.12); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2); }
        .badge-avail    { background: var(--green-dim); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }
        .badge-taken    { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239,68,68,0.15); }

        .result-price {
          text-align: right; min-width: 80px;
        }
        .result-price-main { font-family: var(--font-disp); font-size: 0.95rem; font-weight: 700; color: var(--text); }
        .result-price-yr   { font-size: 0.7rem; color: var(--muted); }

        .add-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700;
          font-family: var(--font-disp); cursor: pointer; border: none;
          transition: all 0.2s; flex-shrink: 0; white-space: nowrap;
        }
        .add-btn-avail {
          background: var(--amber); color: #000;
        }
        .add-btn-avail:hover { background: var(--amber-lt); transform: scale(1.04); }
        .add-btn-avail.added {
          background: var(--green); color: #fff;
          animation: addPop 0.5s ease;
        }
        .add-btn-avail.pulse { animation: addPop 0.4s ease; }
        .add-btn-taken {
          background: rgba(255,255,255,0.04); color: var(--muted);
          border: 1px solid var(--border); cursor: not-allowed;
        }

        /* ── TLD browser section ── */
        .section { padding: 72px 0; }
        .section-label {
          display: inline-block; padding: 3px 11px;
          background: var(--amber-dim); border: 1px solid rgba(245,158,11,0.2);
          border-radius: 4px; font-size: 0.7rem; color: var(--amber);
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px;
        }
        .section-title {
          font-family: var(--font-disp); font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 10px;
        }
        .section-sub { color: var(--muted-2); font-size: 0.95rem; font-weight: 300; line-height: 1.6; max-width: 480px; }

        .tld-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px; margin-top: 40px;
        }
        .tld-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px; cursor: pointer;
          transition: all 0.2s; display: flex; flex-direction: column; gap: 10px;
        }
        .tld-card:hover {
          border-color: rgba(245,158,11,0.35);
          background: var(--surface-2);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .tld-card-top { display: flex; align-items: center; justify-content: space-between; }
        .tld-card-flag { font-size: 1.3rem; }
        .tld-card-name { font-family: var(--font-disp); font-size: 1.05rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
        .tld-card-desc { font-size: 0.8rem; color: var(--muted); font-weight: 300; line-height: 1.4; }
        .tld-card-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
        .tld-card-price { font-family: var(--font-disp); font-size: 1rem; font-weight: 700; color: var(--amber); }
        .tld-card-yr { font-size: 0.72rem; color: var(--muted); margin-left: 2px; font-family: var(--font-body); }
        .tld-card-search {
          padding: 5px 12px; background: rgba(255,255,255,0.05);
          border: 1px solid var(--border); border-radius: 6px;
          font-size: 0.72rem; color: var(--muted-2); font-weight: 600;
          font-family: var(--font-disp); transition: all 0.2s; cursor: pointer;
        }
        .tld-card:hover .tld-card-search { background: var(--amber-dim); border-color: rgba(245,158,11,0.3); color: var(--amber); }

        /* ── How it works ── */
        .steps-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1px; background: var(--border); border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden; margin-top: 40px;
        }
        .step-card {
          background: var(--surface); padding: 32px 28px;
          display: flex; flex-direction: column; gap: 12px;
          transition: background 0.2s;
        }
        .step-card:hover { background: var(--surface-2); }
        .step-num {
          font-family: var(--font-disp); font-size: 2.2rem; font-weight: 800;
          color: rgba(245,158,11,0.2); line-height: 1;
        }
        .step-title { font-family: var(--font-disp); font-size: 1rem; font-weight: 700; color: var(--text); }
        .step-desc  { font-size: 0.875rem; color: var(--muted-2); line-height: 1.6; font-weight: 300; }

        /* ── Cart drawer ── */
        .cart-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 90; animation: fadeIn 0.2s ease;
          backdrop-filter: blur(4px);
        }
        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(380px, 100vw); background: var(--surface);
          border-left: 1px solid rgba(255,255,255,0.1);
          z-index: 100; display: flex; flex-direction: column;
          animation: slideRight 0.3s ease;
          box-shadow: -20px 0 60px rgba(0,0,0,0.4);
        }
        @keyframes slideRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .cart-header {
          padding: 20px 24px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .cart-title { font-family: var(--font-disp); font-size: 1rem; font-weight: 700; }
        .cart-close {
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--border);
          color: var(--muted); cursor: pointer; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .cart-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }
        .cart-body { flex: 1; overflow-y: auto; padding: 16px; }
        .cart-empty { text-align: center; padding: 48px 16px; color: var(--muted); font-size: 0.875rem; }
        .cart-item {
          display: flex; align-items: center; gap: 10px;
          padding: 12px; background: var(--surface-2);
          border: 1px solid var(--border); border-radius: 9px; margin-bottom: 8px;
        }
        .cart-item-domain { flex: 1; font-size: 0.875rem; color: var(--text); font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cart-item-price { font-family: var(--font-disp); font-size: 0.875rem; font-weight: 700; color: var(--amber); white-space: nowrap; }
        .cart-item-remove {
          width: 24px; height: 24px; border-radius: 5px; background: none;
          border: none; color: var(--muted); cursor: pointer; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .cart-item-remove:hover { background: var(--red-dim); color: var(--red); }
        .cart-footer {
          padding: 16px; border-top: 1px solid var(--border);
        }
        .cart-total {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid var(--border); margin-bottom: 12px;
        }
        .cart-total-label { font-size: 0.875rem; color: var(--muted); }
        .cart-total-val { font-family: var(--font-disp); font-size: 1.1rem; font-weight: 800; color: var(--text); }
        .cart-checkout-btn {
          width: 100%; padding: 13px; background: var(--amber); color: #000;
          border: none; border-radius: 9px; font-weight: 700; font-size: 0.9rem;
          font-family: var(--font-disp); cursor: pointer; transition: all 0.2s;
        }
        .cart-checkout-btn:hover { background: var(--amber-lt); transform: translateY(-1px); }

        /* ── Footer ── */
        footer {
          background: var(--surface); border-top: 1px solid var(--border);
          padding: 28px 24px; text-align: center;
          color: var(--muted); font-size: 0.8rem;
        }
        footer a { color: var(--amber); text-decoration: none; }

        /* surface-2 var */
        .surface-2 { background: #111827; }
      `}</style>


      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="fade-up" style={{ position: "relative" }}>
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            Over 500 TLD extensions available
          </div>

          <h1 className="hero-headline">
            Find the perfect<br />
            domain for your <em>brand</em>
          </h1>

          <p className="hero-sub">
            Search availability across 500+ extensions. Register .ng, .com, .africa
            and more — paid in Naira via Flutterwave.
          </p>

          {/* Search */}
          <form className="search-box" onSubmit={handleSearch}
            style={{ animationDelay: "0.15s" }}>
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="yourname, yourbrand, yourstartup…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="search-btn" disabled={searching}>
              {searching
                ? <><span className="spinner" /> Checking…</>
                : "Search →"}
            </button>
          </form>

          {/* Suggestions */}
          <div className="suggestions">
            <span style={{ color: "var(--muted)", fontSize: "0.78rem", alignSelf: "center" }}>Try:</span>
            {SUGGESTIONS.map(s => (
              <button key={s} className="suggestion"
                onClick={() => { setQuery(s); }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      {results && (
        <div className="container results-wrap">
          <div className="results-header">
            <div className="results-title">
              Results for <span>{searchedName}</span>
            </div>
            <div className="results-meta">
              <strong>{availableCount} available</strong> of {results.length} checked
            </div>
          </div>

          {results.map((r, i) => {
            const full = `${searchedName}${r.tld}`;
            const inCart = cart.some(c => c.domain === full);

            return (
              <div
                key={r.tld}
                className={`result-row ${r.available ? "available" : ""}`}
                style={{ animationDelay: `${i * 0.055}s` }}
              >
                {/* TLD */}
                <div className="result-tld">{r.tld}</div>

                {/* Domain */}
                <div className="result-domain">
                  <strong>{searchedName}</strong>{r.tld}
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {r.popular  && <span className="badge badge-popular">Popular</span>}
                  {r.premium  && <span className="badge badge-premium">Premium</span>}
                  <span className={`badge ${r.available ? "badge-avail" : "badge-taken"}`}>
                    {r.available ? "Available" : "Taken"}
                  </span>
                </div>

                {/* Price */}
                {r.available && (
                  <div className="result-price">
                    <div className="result-price-main">{r.price}</div>
                    <div className="result-price-yr">/yr</div>
                  </div>
                )}

                {/* CTA */}
                {r.available ? (
                  <button
                    className={`add-btn add-btn-avail ${inCart ? "added" : ""} ${addedPulse === full ? "pulse" : ""}`}
                    onClick={() => addToCart(full, r.price, r.tld)}
                  >
                    {inCart ? "✓ Added" : "Add →"}
                  </button>
                ) : (
                  <button className="add-btn add-btn-taken" disabled>Taken</button>
                )}
              </div>
            );
          })}

          {cart.length > 0 && (
            <div style={{
              marginTop: 20, padding: "14px 18px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 10, display: "flex",
              alignItems: "center", justifyContent: "space-between",
              gap: 12, animation: "fadeIn 0.3s ease",
            }}>
              <span style={{ color: "var(--green)", fontSize: "0.875rem", fontWeight: 500 }}>
                🛒 {cart.length} domain{cart.length !== 1 ? "s" : ""} in cart
              </span>
              <button onClick={() => setCartOpen(true)}
                style={{
                  padding: "7px 16px", background: "var(--green)", color: "#fff",
                  border: "none", borderRadius: 7, fontWeight: 700, fontSize: "0.8rem",
                  fontFamily: "var(--font-disp)", cursor: "pointer",
                }}>
                View Cart →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TLD BROWSER ── */}
      <section className="section" style={{ background: "#0a0f1a", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 0 }}>
            <span className="section-label">All Extensions</span>
            <h2 className="section-title">Browse by TLD</h2>
            <p className="section-sub">
              From Nigerian-specific extensions to global TLDs — find the one that fits your brand identity.
            </p>
          </div>

          <div className="tld-grid">
            {POPULAR_TLDS.map(t => (
              <div key={t.tld} className="tld-card"
                onClick={() => { setQuery(query.replace(/\..+$/, "") + t.tld); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <div className="tld-card-top">
                  <span className="tld-card-flag">{t.flag}</span>
                  <span className="tld-card-name">{t.tld}</span>
                </div>
                <div className="tld-card-desc">{t.desc}</div>
                <div className="tld-card-bottom">
                  <div>
                    <span className="tld-card-price">{t.price}</span>
                    <span className="tld-card-yr">/yr</span>
                  </div>
                  <span className="tld-card-search">Search →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-label">Process</span>
            <h2 className="section-title">Register in 3 steps</h2>
          </div>

          <div className="steps-grid">
            {[
              { n: "01", title: "Search your domain", desc: "Type your brand name above and instantly check availability across 500+ extensions." },
              { n: "02", title: "Add to cart", desc: "Pick your preferred TLD, choose your registration period, and add extras like privacy protection." },
              { n: "03", title: "Pay in Naira", desc: "Checkout with Flutterwave — card, bank transfer, USSD, or mobile money. No forex hassle." },
              { n: "04", title: "Go live instantly", desc: "Your domain is active within minutes. Point to any server or use our free DNS manager." },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "48px 24px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)",
        }} />
        <h2 style={{
          fontFamily: "var(--font-disp)", fontSize: "clamp(1.6rem,3.5vw,2.2rem)",
          fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 10, position: "relative",
        }}>
          Still searching for the right name?
        </h2>
        <p style={{ color: "var(--muted-2)", marginBottom: 24, fontWeight: 300, position: "relative" }}>
          Our team can help you find the perfect domain for your brand. Talk to us.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <a href="/client/support" style={{
            padding: "12px 28px", background: "var(--amber)", color: "#000",
            borderRadius: 9, fontWeight: 700, fontSize: "0.875rem",
            fontFamily: "var(--font-disp)", textDecoration: "none",
          }}>
            Chat with Support
          </a>
          <a href="/hosting" style={{
            padding: "12px 28px", background: "transparent", color: "var(--text)",
            border: "1px solid var(--border)", borderRadius: 9,
            fontWeight: 600, fontSize: "0.875rem",
            fontFamily: "var(--font-disp)", textDecoration: "none",
          }}>
            View Hosting Plans
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        © 2025 HostForge Technologies Ltd · Lagos, Nigeria ·{" "}
        <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
      </footer>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <div className="cart-title">🛒 Your Cart ({cart.length})</div>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🛒</div>
                  No domains added yet.<br />Search and add some above.
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.domain} className="cart-item">
                    <div className="cart-item-domain">{item.domain}</div>
                    <div className="cart-item-price">{item.price}<span style={{ fontSize: "0.68rem", color: "var(--muted)", fontWeight: 400 }}>/yr</span></div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.domain)}>✕</button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span className="cart-total-label">Total (1 year)</span>
                  <span className="cart-total-val">
                    ₦{cart.reduce((sum, item) => {
                      const num = parseInt(item.price.replace(/[₦,]/g, ""), 10);
                      return sum + num;
                    }, 0).toLocaleString()}
                  </span>
                </div>
                <button className="cart-checkout-btn"
                  onClick={() => window.location.href = "/checkout"}>
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}