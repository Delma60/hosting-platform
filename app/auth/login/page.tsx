"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { signInWithEmail, signInWithGoogle, getIdToken } from "@/lib/auth";
import { createSessionCookie } from "@/lib/session";

// shadcn/ui primitives (install via: npx shadcn@latest add button input label)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const styles = {
  heading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "-0.025em",
    marginBottom: 6,
  },
  sub: {
    color: "#64748b",
    fontSize: "0.875rem",
    marginBottom: 28,
    fontWeight: 300,
  },
  fieldset: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 18,
    marginBottom: 24,
  },
  label: {
    color: "#94a3b8",
    fontSize: "0.82rem",
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  error: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: "0.85rem",
    marginBottom: 20,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
    color: "#334155",
    fontSize: "0.78rem",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.07)",
  },
  googleBtn: {
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
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  link: {
    color: "#f59e0b",
    textDecoration: "none",
    fontWeight: 500,
  },
  footer: {
    textAlign: "center" as const,
    color: "#64748b",
    fontSize: "0.83rem",
    marginTop: 20,
  },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/client";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      const token = await getIdToken();
      if (token) await createSessionCookie(token);
      router.push(callbackUrl);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a moment and try again.");
      } else {
        setError("Something went wrong. Please try again.");
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
      router.push(callbackUrl);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <h1 style={styles.heading}>Welcome back</h1>
      <p style={styles.sub}>Sign in to your HostForge account</p>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.fieldset}>
          <div>
            <Label htmlFor="email" style={styles.label}>
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

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Label
                htmlFor="password"
                style={{ ...styles.label, marginBottom: 0 }}
              >
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                style={{ ...styles.link, fontSize: "0.78rem" }}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f1f5f9",
              }}
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
          {loading ? "Signing in…" : "Sign in →"}
        </Button>
      </form>

      <div style={styles.divider}>
        <span style={styles.dividerLine} />
        or continue with
        <span style={styles.dividerLine} />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        style={styles.googleBtn}
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

      <p style={styles.footer}>
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" style={styles.link}>
          Create one
        </Link>
      </p>
    </>
  );
}
