"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI so it is never server-rendered
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/swagger-spec")
      .then((r) => r.json())
      .then(setSpec)
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/swagger-auth", { method: "DELETE" });
    router.push("/api-docs/login");
  };

  return (
    <>
      {/* ── Custom header bar ─────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a18 0%, #2C2C2A 100%)",
          borderBottom: "2px solid #EF9F27",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo / brand */}
        <div
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #EF9F27, #BA7517)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
            boxShadow: "0 2px 8px rgba(239,159,39,0.4)",
          }}
        >🪷</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8F7F2", letterSpacing: "0.01em" }}>
            Raghvendra Saini — Campaign Portal API
          </div>
          <div style={{ fontSize: 11, color: "#EF9F27", marginTop: 1 }}>
            OpenAPI 3.0 · Powered by Swagger UI
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="/"
            style={{
              fontSize: 12, fontWeight: 600, color: "#F8F7F2",
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: 8, padding: "6px 14px",
              textDecoration: "none",
            }}
          >← Website</a>
          <a
            href="/admin"
            style={{
              fontSize: 12, fontWeight: 600, color: "#2C2C2A",
              background: "#EF9F27", border: "none",
              borderRadius: 8, padding: "6px 14px",
              textDecoration: "none",
            }}
          >Admin Panel</a>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12, fontWeight: 600, color: "#F8F7F2",
              background: "rgba(192,57,43,0.25)",
              border: "0.5px solid rgba(192,57,43,0.5)",
              borderRadius: 8, padding: "6px 14px",
              cursor: "pointer",
            }}
          >🔒 Logout</button>
        </div>
      </div>

      {/* ── Swagger UI ────────────────────────────────────────────────── */}
      <div
        style={{
          minHeight: "calc(100vh - 66px)",
          background: "#FAFAF7",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {spec ? (
          <SwaggerUI
            spec={spec}
            docExpansion="list"
            defaultModelsExpandDepth={1}
            tryItOutEnabled={true}
            requestSnippetsEnabled={true}
            displayRequestDuration={true}
            filter={true}
            persistAuthorization={true}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              gap: 16,
              color: "#888780",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #EF9F2730",
                borderTopColor: "#EF9F27",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Loading API documentation…
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* ── Swagger UI theme overrides ────────────────────────────────── */}
      <style>{`
        /* Top bar */
        .swagger-ui .topbar { display: none; }

        /* Title */
        .swagger-ui .info .title { color: #2C2C2A; font-weight: 800; }
        .swagger-ui .info .description p { color: #5F5E5A; }

        /* Tags */
        .swagger-ui .opblock-tag { color: #2C2C2A; font-weight: 700; border-bottom: 1px solid #e5e3dc; }
        .swagger-ui .opblock-tag:hover { background: #F8F7F2; }

        /* Method badges */
        .swagger-ui .opblock.opblock-get .opblock-summary-method   { background: #185FA5; }
        .swagger-ui .opblock.opblock-post .opblock-summary-method  { background: #1D9E75; }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method{ background: #C0392B; }

        /* Try-it-out execute button */
        .swagger-ui .btn.execute { background: #EF9F27; border-color: #EF9F27; color: #fff; font-weight: 700; border-radius: 8px; }
        .swagger-ui .btn.execute:hover { background: #BA7517; }

        /* Authorize button */
        .swagger-ui .btn.authorize { border-color: #EF9F27; color: #BA7517; font-weight: 700; border-radius: 8px; }

        /* Models section */
        .swagger-ui section.models { background: #fff; border: 0.5px solid #e5e3dc; border-radius: 12px; overflow: hidden; }

        /* General input/select */
        .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select { border-radius: 6px; border-color: #d3d1c7; }

        /* Response code */
        .swagger-ui .response-col_status { font-weight: 700; }

        /* Filter input */
        .swagger-ui .filter input { border-radius: 8px; border: 1px solid #d3d1c7; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f0ede5; }
        ::-webkit-scrollbar-thumb { background: #EF9F27; border-radius: 3px; }
      `}</style>
    </>
  );
}
