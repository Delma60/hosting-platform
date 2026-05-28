import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | HostForge",
    default: "Auth | HostForge",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          top: -200,
          left: -200,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          bottom: -100,
          right: -100,
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 32,
          textDecoration: "none",
          color: "#f1f5f9",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1.4rem",
          letterSpacing: "-0.02em",
          zIndex: 1,
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          🌐
        </span>
        HostForge
      </Link>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#0d1321",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
      >
        {children}
      </div>

      <p
        style={{
          color: "#64748b",
          fontSize: "0.78rem",
          marginTop: 24,
          zIndex: 1,
        }}
      >
        © 2025 HostForge Technologies Ltd · Lagos, Nigeria
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
}
