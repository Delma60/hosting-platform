"use client";
import React, { useState } from "react";

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <div className="nav-inner">
        <a href="/" className="logo">
          <span className="logo-mark">🌐</span>
          HostForge
        </a>
        <ul className="nav-links">
          <li>
            <a href="/domains" className="active">
              Domains
            </a>
          </li>
          <li>
            <a href="/hosting">Hosting</a>
          </li>
          <li>
            <a href="/pricing">Pricing</a>
          </li>
          <li>
            <a href="/reseller">Resellers</a>
          </li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </button>
          <a
            href="/auth/login"
            style={{
              color: "var(--muted-2)",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Sign in
          </a>
          <a href="/auth/register" className="nav-cta">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
