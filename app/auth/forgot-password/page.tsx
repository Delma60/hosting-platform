"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found") {
        setSent(true); // Don't reveal if user exists
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔑</div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.025em",
            marginBottom: 10,
          }}
        >
          Reset link sent
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            marginBottom: 28,
            fontWeight: 300,
          }}
        >
          If an account exists for{" "}
          <strong style={{ color: "#94a3b8" }}>{email}</strong>, you will
          receive a password reset link shortly.
        </p>
        <Link
          href="/auth/login"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#f59e0b",
            color: "#000",
            borderRadius: 9,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#f1f5f9",
          letterSpacing: "-0.025em",
          marginBottom: 6,
        }}
      >
        Forgot password?
      </h1>
      <p
        style={{
          color: "#64748b",
          fontSize: "0.875rem",
          marginBottom: 28,
          fontWeight: 300,
          lineHeight: 1.55,
        }}
      >
        Enter your email and we will send you a link to reset your password.
      </p>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#fca5a5",
            fontSize: "0.85rem",
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 22 }}>
          <Label
            htmlFor="email"
            style={{
              color: "#94a3b8",
              fontSize: "0.82rem",
              fontWeight: 500,
              marginBottom: 6,
              display: "block",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f1f5f9",
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          style={{
            background: "#f59e0b",
            color: "#000",
            fontWeight: 700,
            fontSize: "0.9rem",
            height: 44,
            borderRadius: 9,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p
        style={{ textAlign: "center", color: "#64748b", fontSize: "0.83rem", marginTop: 20 }}
      >
        Remembered it?{" "}
        <Link
          href="/auth/login"
          style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 500 }}
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
