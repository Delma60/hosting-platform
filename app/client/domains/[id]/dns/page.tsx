"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Server,
  Link as LinkIcon,
  Mail,
  FileText,
  Cloud,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const MOCK_RECORDS = [
  { id: "1", type: "A", name: "@", value: "41.58.62.144", ttl: "3600" },
  { id: "2", type: "A", name: "www", value: "41.58.62.144", ttl: "3600" },
  { id: "3", type: "MX", name: "@", value: "mail.swiftpayng.com", ttl: "3600", priority: 10 },
  { id: "4", type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: "3600" },
  { id: "5", type: "CNAME", name: "blog", value: "ghs.googlehosted.com", ttl: "3600" },
];

function RecordTypeIcon({ type }: { type: string }) {
  const map: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    A:     { icon: Server,   color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    AAAA:  { icon: Server,   color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    CNAME: { icon: LinkIcon, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    MX:    { icon: Mail,     color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    TXT:   { icon: FileText, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    NS:    { icon: Cloud,    color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  };
  const s = map[type] ?? { icon: Globe, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };
  const Icon = s.icon;
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 6,
      background: s.bg, border: `1px solid ${s.color}20`,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <Icon size={14} color={s.color} />
    </div>
  );
}

export default function DNSPage() {
  const params = useParams();
  const [showAdd, setShowAdd] = useState(false);

  // Mock domain name based on ID
  const domainName = "swiftpayng.com";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        
        .dns-table { width: 100%; border-collapse: collapse; }
        .dns-table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #334155;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
        }
        .dns-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
          color: #f1f5f9;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
        }
        .dns-table tr:last-child td { border-bottom: none; }
        .dns-table tbody tr:hover { background: rgba(255,255,255,0.01); }

        .action-icon-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-icon-btn:hover { color: #f1f5f9; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); }
        .action-icon-btn.delete:hover { color: #ef4444; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); }

        .dns-input {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 8px 12px;
          color: #f1f5f9;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          outline: none;
        }
        .dns-input:focus { border-color: #f59e0b; }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <Link href="/client/domains" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
          <ArrowLeft size={14} /> Back to Domains
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 4 }}>
            DNS Management
          </h2>
          <p style={{ color: "#475569", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            Configuring records for <strong style={{ color: "#94a3b8", fontWeight: 500 }}>{domainName}</strong>
          </p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          style={{ 
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", 
            background: "#f59e0b", color: "#000", borderRadius: 10, fontSize: "0.875rem", 
            fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif" 
          }}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? "Cancel" : "Add New Record"}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "#0d1321", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 2fr 120px 100px auto", gap: 16, alignItems: "flex-end" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Type</label>
              <select className="dns-input"><option>A</option><option>AAAA</option><option>CNAME</option><option>MX</option><option>TXT</option></select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Name</label>
              <input type="text" className="dns-input" placeholder="@" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Value</label>
              <input type="text" className="dns-input" placeholder="Points to" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>TTL</label>
              <input type="text" className="dns-input" defaultValue="3600" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Priority</label>
              <input type="text" className="dns-input" placeholder="0" />
            </div>
            <button style={{ height: 38, padding: "0 20px", background: "#f59e0b", color: "#000", borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Add</button>
          </div>
        </div>
      )}

      <div style={{ background: "#0d1321", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
        <table className="dns-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Content</th>
              <th>TTL</th>
              <th>Priority</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RECORDS.map((r) => (
              <tr key={r.id}>
                <td style={{ width: 100 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <RecordTypeIcon type={r.type} />
                    <span style={{ fontWeight: 600 }}>{r.type}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500, color: "#94a3b8" }}>{r.name}</td>
                <td style={{ maxWidth: 300, wordBreak: "break-all" }}>{r.value}</td>
                <td>{r.ttl}</td>
                <td>{r.priority ?? "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="action-icon-btn" title="Edit"><Edit2 size={14} /></button>
                    <button className="action-icon-btn delete" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
