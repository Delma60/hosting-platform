"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerWithEmail, signInWithGoogle, getIdToken } from "@/lib/auth";
import { createSessionCookie } from "@/lib/session";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const labelStyle = {
  color: "#94a3b8",
  fontSize: "0.82rem",
  fontWeight: 500,
  marginBottom: 6,
  display: "block",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
};

const inputStyle = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f1f5f9",
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      setSuccess(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 8 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      const token = await getIdToken();
      if (token) await createSessionCookie(token);
      router.push("/client");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✉️</div>
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
          Check your inbox
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
          We sent a verification link to{" "}
          <strong style={{ color: "#94a3b8" }}>{email}</strong>. Click the link
          to activate your account, then sign in.
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
          Go to Sign In →
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
        Create your account
      </h1>
      <p
        style={{
          color: "#64748b",
          fontSize: "0.875rem",
          marginBottom: 28,
          fontWeight: 300,
        }}
      >
        Join 2,800+ businesses on HostForge
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 22,
          }}
        >
          <div>
            <Label htmlFor="name" style={labelStyle}>
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chidinma Okafor"
              style={inputStyle}
            />
          </div>

          <div>
            <Label htmlFor="email" style={labelStyle}>
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
              style={inputStyle}
            />
          </div>

          <div>
            <Label htmlFor="password" style={labelStyle}>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              style={inputStyle}
            />
          </div>

          <div>
            <Label htmlFor="confirm" style={labelStyle}>
              Confirm password
            </Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              style={inputStyle}
            />
          </div>
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
          {loading ? "Creating account…" : "Create Account →"}
        </Button>
      </form>

      <p
        style={{
          color: "#475569",
          fontSize: "0.75rem",
          textAlign: "center",
          margin: "14px 0",
        }}
      >
        By signing up you agree to our{" "}
        <Link
          href="/terms"
          style={{ color: "#64748b", textDecoration: "underline" }}
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          style={{ color: "#64748b", textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "16px 0",
          color: "#334155",
          fontSize: "0.78rem",
        }}
      >
        <span
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
        />
        or
        <span
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
        />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        style={{
          width: "100%",
          padding: "11px 0",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 9,
          color: "#f1f5f9",
          fontSize: "0.9rem",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
            fill="#EA4335"
          />
        </svg>
        {googleLoading ? "Connecting…" : "Continue with Google"}
      </button>

      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.83rem",
          marginTop: 20,
        }}
      >
        Already have an account?{" "}
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
