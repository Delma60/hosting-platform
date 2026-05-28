"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  initials: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const HOSTING_PLANS: Plan[] = [
  {
    name: "Starter",
    price: "₦2,500",
    period: "/mo",
    description: "Perfect for personal projects and small websites.",
    features: ["1 Website", "10 GB SSD Storage", "100 GB Bandwidth", "Free SSL", "5 Email Accounts", "99.9% Uptime SLA"],
    highlighted: false,
  },
  {
    name: "Business",
    price: "₦7,500",
    period: "/mo",
    description: "For growing businesses that need more power.",
    features: ["Unlimited Websites", "50 GB NVMe SSD", "Unlimited Bandwidth", "Free SSL + Wildcard", "Unlimited Email", "Daily Backups", "Priority Support"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "₦18,000",
    period: "/mo",
    description: "High-performance hosting for demanding applications.",
    features: ["Unlimited Websites", "200 GB NVMe SSD", "Unlimited Bandwidth", "Premium SSL Suite", "Unlimited Email", "Hourly Backups", "Dedicated Support Manager", "DDoS Protection"],
    highlighted: false,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Chidinma Okafor",
    role: "Founder",
    company: "SwiftPay NG",
    text: "HostForge migrated our entire infrastructure in 48 hours with zero downtime. The Nigerian support team actually understands our needs.",
    initials: "CO",
  },
  {
    name: "Emeka Nwosu",
    role: "CTO",
    company: "Agrihub Africa",
    text: "Finally a hosting provider that accepts Flutterwave. No more dealing with international cards or forex issues. Speed is incredible.",
    initials: "EN",
  },
  {
    name: "Amara Diallo",
    role: "Developer",
    company: "Freelance",
    text: "I resell HostForge services to my clients with my own branding. The white-label storefront took 10 minutes to set up. Pure gold.",
    initials: "AD",
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "NVMe SSD Speed",
    desc: "Lightning-fast NVMe storage across all plans — your site loads in milliseconds, not seconds.",
  },
  {
    icon: "🌍",
    title: "Lagos & Cape Town DCs",
    desc: "Data centers on African soil mean ultra-low latency for your Nigerian and pan-African visitors.",
  },
  {
    icon: "🔒",
    title: "Free SSL on Every Plan",
    desc: "Automatic Let's Encrypt SSL with one-click installation. HTTPS secured from day one.",
  },
  {
    icon: "💳",
    title: "Pay in Naira",
    desc: "Flutterwave-powered checkout. Pay via card, bank transfer, USSD, or mobile money — zero forex fees.",
  },
  {
    icon: "🤝",
    title: "Reseller Ready",
    desc: "White-label storefronts and custom margins. Build your own hosting business on our infrastructure.",
  },
  {
    icon: "🛡️",
    title: "99.9% Uptime SLA",
    desc: "Backed by a contractual uptime guarantee. Automatic failover and 24/7 infrastructure monitoring.",
  },
];

const TLDS = [".com", ".ng", ".com.ng", ".org", ".net", ".io", ".africa", ".co"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [domain, setDomain] = useState("");
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setSearching(true);
    setTimeout(() => setSearching(false), 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080c14;
          --surface: #0d1321;
          --surface-2: #111827;
          --border: rgba(255,255,255,0.07);
          --amber: #f59e0b;
          --amber-light: #fcd34d;
          --amber-dim: rgba(245,158,11,0.12);
          --text: #f1f5f9;
          --muted: #64748b;
          --muted-2: #94a3b8;
          --green: #10b981;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }

        /* ── Scrollbar ─────────── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--amber); border-radius: 2px; }

        /* ── Animations ────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-amber {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(245,158,11,0); }
        }
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          10%      { transform: translate(-2%,-2%); }
          20%      { transform: translate(2%,2%); }
          30%      { transform: translate(-1%,1%); }
          40%      { transform: translate(1%,-1%); }
          50%      { transform: translate(-2%,2%); }
          60%      { transform: translate(2%,-2%); }
          70%      { transform: translate(-1%,-1%); }
          80%      { transform: translate(1%,1%); }
          90%      { transform: translate(-2%,0%); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%     { transform: translateY(-8px) rotate(1deg); }
          66%     { transform: translateY(4px) rotate(-0.5deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Layout helpers ─────── */
        .container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        .anim-fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }

        /* ── Noise overlay ──────── */
        .noise::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.4; mix-blend-mode: overlay;
        }

        /* ── Nav ─────────────────── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 24px;
          background: rgba(8,12,20,0.85);
          backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          max-width: 1180px; margin: 0 auto;
          height: 68px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo {
          font-family: var(--font-display); font-weight: 800; font-size: 1.35rem;
          color: var(--text); text-decoration: none; letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 8px;
        }
        .logo-mark {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--amber); display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; animation: pulse-amber 3s ease infinite;
        }
        .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-links a {
          color: var(--muted-2); text-decoration: none; font-size: 0.9rem; font-weight: 400;
          transition: color 0.2s; letter-spacing: 0.01em;
        }
        .nav-links a:hover { color: var(--text); }
        .nav-cta {
          padding: 9px 22px; background: var(--amber); color: #000;
          border-radius: 8px; font-weight: 600; font-size: 0.875rem;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
          font-family: var(--font-display);
        }
        .nav-cta:hover { background: var(--amber-light); transform: translateY(-1px); }
        .hamburger { display: none; background: none; border: 1px solid var(--border); border-radius: 6px; padding: 8px; cursor: pointer; color: var(--text); font-size: 1.1rem; }
        .mobile-menu {
          display: none; flex-direction: column; gap: 16px;
          padding: 20px 24px; border-top: 1px solid var(--border);
          background: var(--surface);
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { color: var(--muted-2); text-decoration: none; font-size: 1rem; padding: 4px 0; }

        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: flex; align-items: center; }
        }

        /* ── Hero ────────────────── */
        .hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 120px 24px 80px; overflow: hidden;
        }
        .hero-glow-1 {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
          top: -100px; left: -200px; pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        .hero-glow-2 {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
          bottom: 0; right: -100px; pointer-events: none;
          animation: float 10s ease-in-out infinite 2s;
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.035;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 100px;
          background: var(--amber-dim); border: 1px solid rgba(245,158,11,0.25);
          color: var(--amber); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 24px;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); animation: pulse-amber 2s ease infinite; }
        .hero-headline {
          font-family: var(--font-display); font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 800; line-height: 1.05; letter-spacing: -0.03em;
          text-align: center; max-width: 820px; margin-bottom: 20px;
        }
        .headline-accent {
          background: linear-gradient(135deg, var(--amber) 0%, #fb923c 50%, var(--amber-light) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 4s linear infinite;
        }
        .hero-sub {
          color: var(--muted-2); font-size: clamp(1rem, 2vw, 1.15rem);
          max-width: 560px; text-align: center; line-height: 1.7; margin-bottom: 40px;
          font-weight: 300;
        }

        /* ── Domain Search ──────── */
        .search-wrap {
          width: 100%; max-width: 640px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 6px 6px 6px 20px;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 0 0 1px transparent, 0 20px 60px rgba(0,0,0,0.5);
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .search-wrap:focus-within {
          border-color: var(--amber);
          box-shadow: 0 0 0 3px var(--amber-dim), 0 20px 60px rgba(0,0,0,0.5);
        }
        .search-input {
          flex: 1; background: none; border: none; outline: none;
          color: var(--text); font-size: 1rem; font-family: var(--font-body);
          font-weight: 400; min-width: 0;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-btn {
          padding: 12px 24px; background: var(--amber); color: #000;
          border: none; border-radius: 9px; font-weight: 700; font-size: 0.9rem;
          cursor: pointer; font-family: var(--font-display); letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s; white-space: nowrap;
          flex-shrink: 0;
        }
        .search-btn:hover { background: var(--amber-light); transform: scale(1.02); }
        .search-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .tld-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; justify-content: center; }
        .tld-tag {
          padding: 4px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border);
          border-radius: 100px; font-size: 0.78rem; color: var(--muted-2); cursor: pointer;
          transition: all 0.2s; font-weight: 400;
        }
        .tld-tag:hover { background: var(--amber-dim); border-color: var(--amber); color: var(--amber); }

        .hero-stats {
          display: flex; gap: 40px; margin-top: 56px; flex-wrap: wrap; justify-content: center;
        }
        .stat { text-align: center; }
        .stat-num {
          font-family: var(--font-display); font-size: 1.6rem; font-weight: 800;
          color: var(--text); letter-spacing: -0.02em; display: block;
        }
        .stat-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
        .stat-divider { width: 1px; background: var(--border); align-self: stretch; }

        /* ── Ticker ──────────────── */
        .ticker-wrap {
          overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: var(--surface); padding: 14px 0;
        }
        .ticker-inner { display: flex; gap: 0; animation: ticker 30s linear infinite; white-space: nowrap; }
        .ticker-item {
          padding: 0 40px; font-size: 0.82rem; color: var(--muted); letter-spacing: 0.04em;
          display: flex; align-items: center; gap: 16px; text-transform: uppercase; font-weight: 500;
        }
        .ticker-dot { color: var(--amber); }

        /* ── Section ─────────────── */
        section { padding: 96px 0; }
        .section-tag {
          display: inline-block; padding: 4px 12px; background: var(--amber-dim);
          border: 1px solid rgba(245,158,11,0.2); border-radius: 4px;
          font-size: 0.75rem; color: var(--amber); font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800; letter-spacing: -0.025em; line-height: 1.1;
          margin-bottom: 16px;
        }
        .section-sub { color: var(--muted-2); font-size: 1.05rem; line-height: 1.65; font-weight: 300; max-width: 540px; }

        /* ── Features Grid ────────── */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 16px;
          overflow: hidden; margin-top: 56px;
        }
        .feature-card {
          background: var(--surface); padding: 36px 32px;
          transition: background 0.2s; cursor: default;
        }
        .feature-card:hover { background: var(--surface-2); }
        .feature-icon {
          font-size: 1.8rem; margin-bottom: 16px;
          width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
          background: var(--amber-dim); border-radius: 12px;
        }
        .feature-title {
          font-family: var(--font-display); font-size: 1.05rem; font-weight: 700;
          margin-bottom: 8px; color: var(--text); letter-spacing: -0.01em;
        }
        .feature-desc { color: var(--muted-2); font-size: 0.9rem; line-height: 1.6; font-weight: 300; }

        /* ── Pricing ─────────────── */
        .pricing-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 20px; margin-top: 56px;
        }
        .plan-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 32px 28px;
          display: flex; flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .plan-card.featured {
          border-color: var(--amber); background: var(--surface-2);
          box-shadow: 0 0 0 1px var(--amber), 0 20px 60px rgba(245,158,11,0.1);
        }
        .plan-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          padding: 4px 14px; background: var(--amber); color: #000;
          border-radius: 100px; font-size: 0.7rem; font-weight: 700; white-space: nowrap;
          font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase;
        }
        .plan-name {
          font-family: var(--font-display); font-size: 1rem; font-weight: 700;
          color: var(--muted-2); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;
        }
        .plan-price {
          font-family: var(--font-display); font-size: 2.4rem; font-weight: 800;
          letter-spacing: -0.03em; color: var(--text); line-height: 1;
        }
        .plan-period { color: var(--muted); font-size: 0.9rem; font-weight: 400; }
        .plan-desc { color: var(--muted-2); font-size: 0.88rem; margin: 12px 0 24px; font-weight: 300; line-height: 1.5; }
        .plan-divider { border: none; border-top: 1px solid var(--border); margin: 0 0 24px; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .plan-feature {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.875rem; color: var(--muted-2); font-weight: 300;
        }
        .check { color: var(--green); font-size: 0.75rem; flex-shrink: 0; }
        .plan-btn {
          margin-top: 28px; padding: 13px 0; border-radius: 10px; font-weight: 700;
          font-size: 0.9rem; cursor: pointer; border: none; transition: all 0.2s;
          font-family: var(--font-display); letter-spacing: 0.02em; text-align: center;
          text-decoration: none; display: block;
        }
        .plan-btn-default {
          background: rgba(255,255,255,0.06); color: var(--text);
          border: 1px solid var(--border);
        }
        .plan-btn-default:hover { background: rgba(255,255,255,0.1); }
        .plan-btn-featured { background: var(--amber); color: #000; }
        .plan-btn-featured:hover { background: var(--amber-light); transform: translateY(-1px); }

        /* ── Testimonials ─────────── */
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px; margin-top: 56px;
        }
        .testimonial-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 32px 28px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .testimonial-card:hover { transform: translateY(-3px); border-color: rgba(245,158,11,0.3); }
        .quote-mark { font-size: 2.5rem; line-height: 1; color: var(--amber); font-family: Georgia, serif; margin-bottom: 12px; }
        .testimonial-text { color: var(--muted-2); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px; font-weight: 300; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .author-avatar {
          width: 40px; height: 40px; border-radius: 10px; background: var(--amber-dim);
          border: 1px solid rgba(245,158,11,0.3); display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; color: var(--amber);
          flex-shrink: 0;
        }
        .author-name { font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--text); }
        .author-role { font-size: 0.78rem; color: var(--muted); margin-top: 2px; }

        /* ── CTA Section ────────── */
        .cta-section {
          position: relative; overflow: hidden;
          background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .cta-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%);
        }
        .cta-inner { text-align: center; max-width: 620px; margin: 0 auto; padding: 96px 24px; position: relative; }
        .cta-title {
          font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px;
        }
        .cta-sub { color: var(--muted-2); margin-bottom: 40px; font-size: 1.05rem; font-weight: 300; line-height: 1.6; }
        .cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          padding: 14px 32px; background: var(--amber); color: #000;
          border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem;
          cursor: pointer; font-family: var(--font-display); transition: all 0.2s;
          text-decoration: none; display: inline-block; letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: var(--amber-light); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,158,11,0.3); }
        .btn-ghost {
          padding: 14px 32px; background: transparent; color: var(--text);
          border: 1px solid var(--border); border-radius: 10px; font-weight: 600; font-size: 0.95rem;
          cursor: pointer; font-family: var(--font-display); transition: all 0.2s;
          text-decoration: none; display: inline-block;
        }
        .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }

        /* ── Footer ────────────── */
        footer {
          background: var(--surface); border-top: 1px solid var(--border);
          padding: 64px 24px 32px;
        }
        .footer-grid {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 48px;
        }
        .footer-brand-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.6; margin-top: 12px; font-weight: 300; max-width: 280px; }
        .footer-col-title { font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text); margin-bottom: 16px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { color: var(--muted); text-decoration: none; font-size: 0.875rem; transition: color 0.2s; font-weight: 300; }
        .footer-links a:hover { color: var(--amber); }
        .footer-bottom { max-width: 1180px; margin: 0 auto; padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 16px; }
        .footer-copy { color: var(--muted); font-size: 0.8rem; }
        .footer-badges { display: flex; gap: 8px; align-items: center; }
        .footer-badge { padding: 4px 10px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 4px; font-size: 0.7rem; color: var(--green); font-weight: 600; letter-spacing: 0.04em; }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 24px; }
          .stat-divider { display: none; }
          .cta-buttons { flex-direction: column; align-items: center; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav>
        <div className="nav-inner">
          <a href="/" className="logo">
            <span className="logo-mark">🌐</span>
            HostForge
          </a>
          <ul className="nav-links">
            <li><a href="/domains">Domains</a></li>
            <li><a href="/hosting">Hosting</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/reseller">Resellers</a></li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/auth/login" style={{ color: "var(--muted-2)", textDecoration: "none", fontSize: "0.875rem" }} className="nav-links-item">Sign in</a>
            <a href="/auth/register" className="nav-cta">Get Started</a>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
        </div>
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <a href="/domains">Domains</a>
          <a href="/hosting">Hosting</a>
          <a href="/pricing">Pricing</a>
          <a href="/reseller">Resellers</a>
          <a href="/auth/login">Sign in</a>
          <a href="/auth/register" style={{ color: "var(--amber)", fontWeight: 600 }}>Get Started →</a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero noise">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-grid" />

        <div className="anim-fade-up" style={{ textAlign: "center", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Built for Africa's Digital Economy
          </div>

          <h1 className="hero-headline">
            Your Domain.<br />
            Your Hosting.<br />
            <span className="headline-accent">Your Rules.</span>
          </h1>

          <p className="hero-sub">
            Register domains, launch hosting, and scale your business — all powered by African infrastructure and paid for in Naira via Flutterwave.
          </p>

          <form className="search-wrap anim-fade-up delay-2" onSubmit={handleSearch}>
            <span style={{ color: "var(--muted)", fontSize: "0.95rem", flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Find your perfect domain name..."
              value={domain}
              onChange={e => setDomain(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="search-btn" disabled={searching}>
              {searching ? "Searching…" : "Search →"}
            </button>
          </form>

          <div className="tld-tags anim-fade-up delay-3">
            {TLDS.map(tld => (
              <button key={tld} className="tld-tag" onClick={() => setDomain(d => d.split(".")[0] + tld)}>
                {tld}
              </button>
            ))}
          </div>

          <div className="hero-stats anim-fade-up delay-4">
            <div className="stat">
              <span className="stat-num">14,000+</span>
              <span className="stat-label">Domains Registered</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">99.97%</span>
              <span className="stat-label">Uptime (12 months)</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">2,800+</span>
              <span className="stat-label">Active Customers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">24 / 7</span>
              <span className="stat-label">Local Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex" }}>
              {["99.97% Uptime SLA", "Lagos & Cape Town DCs", "Free SSL on Every Plan", "Pay in Naira", "Reseller White-Label", "24/7 Local Support", "NVMe SSD Storage", "Flutterwave Checkout", ".ng Domains Available", "Daily Backups Included"].map((item, j) => (
                <span key={j} className="ticker-item">
                  <span className="ticker-dot">✦</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section>
        <div className="container">
          <div style={{ maxWidth: 560 }}>
            <span className="section-tag">Why HostForge</span>
            <h2 className="section-title">
              Infrastructure built for where <em style={{ fontStyle: "normal", color: "var(--amber)" }}>you</em> operate.
            </h2>
            <p className="section-sub">
              We didn't just localize a foreign platform. We built HostForge ground-up for the African digital economy — with payment, infrastructure, and support that actually makes sense here.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Hosting Plans</span>
            <h2 className="section-title" style={{ maxWidth: 500 }}>
              Straightforward pricing.<br />No surprises.
            </h2>
            <p className="section-sub" style={{ textAlign: "center" }}>
              All plans include free SSL, daily backups, and 24/7 Nigerian support. No setup fees, no hidden charges.
            </p>
          </div>

          <div className="pricing-grid">
            {HOSTING_PLANS.map((plan, i) => (
              <div key={i} className={`plan-card ${plan.highlighted ? "featured" : ""}`}>
                {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  {plan.price}
                  <span className="plan-period">{plan.period}</span>
                </div>
                <p className="plan-desc">{plan.description}</p>
                <hr className="plan-divider" />
                <ul className="plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j} className="plan-feature">
                      <span className="check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/auth/register"
                  className={`plan-btn ${plan.highlighted ? "plan-btn-featured" : "plan-btn-default"}`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.82rem", marginTop: 24 }}>
            All prices in Nigerian Naira (NGN). Annual billing available — save up to 20%.
            <a href="/pricing" style={{ color: "var(--amber)", marginLeft: 8, textDecoration: "none" }}>View all plans →</a>
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title" style={{ maxWidth: 480 }}>
              Trusted by builders across Africa.
            </h2>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESELLER CALLOUT ────────────────────────────────── */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <span className="section-tag">Reseller Program</span>
              <h2 className="section-title">
                Start your own hosting business<br />
                <span style={{ color: "var(--amber)" }}>in under 10 minutes.</span>
              </h2>
              <p className="section-sub" style={{ marginBottom: 32 }}>
                Get a white-label storefront with your branding, set your own margins, and collect payments directly from your customers. No technical setup required.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {["Custom domain & branding", "Set your own pricing margins", "Flutterwave payout to your bank", "Manage sub-customers from one dashboard"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted-2)", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--green)", fontSize: "0.8rem" }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <a href="/reseller/apply" className="btn-primary">Become a Reseller</a>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 16,
                padding: 28, fontFamily: "var(--font-body)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <span style={{ color: "var(--muted)", fontSize: "0.78rem", marginLeft: 8 }}>your-brand.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem" }}>TechHost NG</span>
                  <span style={{ marginLeft: "auto", padding: "3px 8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 4, fontSize: "0.68rem", color: "var(--green)", fontWeight: 600 }}>LIVE</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 16 }}>Your white-label storefront — powered by HostForge</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[["Monthly Revenue","₦340,000"],["Customers","48"],["Active Services","127"],["This Month","↑ 23%"]].map(([label, val]) => (
                    <div key={label} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: val.startsWith("↑") ? "var(--green)" : "var(--text)" }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 14px", background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, fontSize: "0.8rem", color: "var(--amber)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>💳</span>
                  Payout of ₦102,000 ready for withdrawal
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="cta-section noise">
        <div className="cta-glow" />
        <div className="cta-inner">
          <div style={{ marginBottom: 16, fontSize: "2rem" }}>🚀</div>
          <h2 className="cta-title">
            Ready to launch?<br />
            <span style={{ color: "var(--amber)" }}>Start for free today.</span>
          </h2>
          <p className="cta-sub">
            No credit card required to explore. Register your first .ng domain for just ₦1,500 and get your hosting live in minutes.
          </p>
          <div className="cta-buttons">
            <a href="/auth/register" className="btn-primary">Create Free Account</a>
            <a href="/domains" className="btn-ghost">Search Domains</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer>
        <div className="footer-grid">
          <div>
            <a href="/" className="logo" style={{ textDecoration: "none" }}>
              <span className="logo-mark">🌐</span>
              HostForge
            </a>
            <p className="footer-brand-desc">
              Nigeria's premier domain and hosting platform. Built for Africa, powered by local infrastructure, accepted in Naira.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["𝕏", "in", "ig", "yt"].map(s => (
                <a key={s} href="#" style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.75rem", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--amber)"; (e.currentTarget as HTMLElement).style.color = "var(--amber)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              <li><a href="/domains">Domain Registration</a></li>
              <li><a href="/hosting">Shared Hosting</a></li>
              <li><a href="/vps">VPS Servers</a></li>
              <li><a href="/ssl">SSL Certificates</a></li>
              <li><a href="/reseller">Reseller Hosting</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li><a href="/dashboard/support">Open a Ticket</a></li>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/status">System Status</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© 2025 HostForge Technologies Ltd · Lagos, Nigeria · RC: 1234567</span>
          <div className="footer-badges">
            <span className="footer-badge">SSL SECURE</span>
            <span className="footer-badge">NDPR COMPLIANT</span>
          </div>
        </div>
      </footer>
    </>
  );
}