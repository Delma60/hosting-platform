"use client";

import { useState } from "react";
import { User, Lock, Bell, CreditCard, Save } from "lucide-react";

type Tab = "profile" | "security" | "notifications" | "billing";

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "billing", label: "Billing", icon: CreditCard },
];

function InputField({ label, type = "text", value, placeholder }: { label: string; type?: string; value: string; placeholder?: string }) {
  const [val, setVal] = useState(value);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 9,
          padding: "10px 14px",
          color: "#f1f5f9",
          fontSize: "0.9rem",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => { e.target.style.borderColor = "rgba(245,158,11,0.5)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

function Toggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: "0.78rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        style={{
          position: "relative",
          width: 40, height: 22,
          background: on ? "#f59e0b" : "rgba(255,255,255,0.08)",
          borderRadius: 100,
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute",
          top: 3, left: on ? 21 : 3,
          width: 16, height: 16,
          background: "#fff",
          borderRadius: "50%",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

function ProfileTab() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f59e0b", flexShrink: 0 }}>CO</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f1f5f9" }}>Chidinma Okafor</div>
          <div style={{ fontSize: "0.82rem", color: "#475569", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>chidinma@swiftpayng.com</div>
        </div>
        <button style={{ padding: "7px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "#94a3b8", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
          Change photo
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <InputField label="Full Name" value="Chidinma Okafor" />
        <InputField label="Email Address" type="email" value="chidinma@swiftpayng.com" />
        <InputField label="Phone Number" value="+234 801 234 5678" />
        <InputField label="Company" value="SwiftPay NG" />
      </div>
      <InputField label="Address" value="14 Balogun Street, Victoria Island, Lagos" />
    </div>
  );
}

function SecurityTab() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", marginBottom: 16, letterSpacing: "-0.01em" }}>Change Password</h3>
        <InputField label="Current Password" type="password" value="" placeholder="••••••••" />
        <InputField label="New Password" type="password" value="" placeholder="Min. 8 characters" />
        <InputField label="Confirm New Password" type="password" value="" placeholder="Repeat your password" />
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9", marginBottom: 4 }}>Two-Factor Authentication</div>
            <div style={{ fontSize: "0.82rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>Add an extra layer of security to your account with TOTP.</div>
          </div>
          <button style={{ padding: "8px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, color: "#10b981", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <div style={{ marginBottom: 6, fontSize: "0.78rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>Control which emails and alerts you receive from HostForge.</div>
      <div style={{ marginTop: 16 }}>
        <Toggle label="Service expiry reminders" description="Get notified 30, 7, and 1 day before a service expires." defaultOn={true} />
        <Toggle label="Invoice & payment notifications" description="Receive emails when invoices are generated or payments are processed." defaultOn={true} />
        <Toggle label="Support ticket updates" description="Get email updates when a ticket is replied to or resolved." defaultOn={true} />
        <Toggle label="Promotional emails" description="Receive special offers, discounts, and product updates." defaultOn={false} />
        <Toggle label="Security alerts" description="Get notified of unusual login activity or account changes." defaultOn={true} />
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div>
      <div style={{ padding: 18, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <CreditCard size={16} color="#f59e0b" />
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fcd34d", marginBottom: 3 }}>Balance Due: ₦11,000</div>
          <div style={{ fontSize: "0.82rem", color: "#92400e", fontFamily: "'DM Sans', sans-serif" }}>You have 2 unpaid invoices. Pay now to avoid service interruption.</div>
        </div>
        <button style={{ marginLeft: "auto", padding: "7px 16px", background: "#f59e0b", color: "#000", border: "none", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>Pay Now</button>
      </div>
      <div style={{ marginBottom: 6, fontSize: "0.78rem", color: "#475569", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Billing Address</div>
      <div style={{ marginTop: 12 }}>
        <InputField label="Street Address" value="14 Balogun Street, Victoria Island" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
          <InputField label="City" value="Lagos" />
          <InputField label="State" value="Lagos State" />
          <InputField label="Country" value="Nigeria" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  const CONTENT: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab />,
    security: <SecurityTab />,
    notifications: <NotificationsTab />,
    billing: <BillingTab />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #334155; }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 2 }}>Account Settings</h2>
        <p style={{ color: "#475569", fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>Manage your profile, security, and preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
        {/* Tabs sidebar */}
        <div style={{ background: "#0d1321", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 8, height: "fit-content" }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  background: active ? "rgba(255,255,255,0.07)" : "none",
                  border: "none",
                  cursor: "pointer",
                  color: active ? "#f1f5f9" : "#475569",
                  fontSize: "0.865rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: active ? 500 : 400,
                  textAlign: "left",
                  transition: "all 0.15s",
                  marginBottom: 2,
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div style={{ background: "#0d1321", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 28 }}>
          {CONTENT[tab]}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 22px", background: "#f59e0b", color: "#000", borderRadius: 9, fontSize: "0.875rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}