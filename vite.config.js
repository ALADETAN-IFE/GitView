// ============================================================
// REPOGUARD — MANUAL REVIEW REQUIRED: vite.config.js
// Scanned: 2026-11-12T16:41:54.023Z
// The following findings could NOT be automatically patched:
//   [CRITICAL] js-obfuscated-hex: JavaScript hex/unicode escape obfuscation sequence
//   [MEDIUM] high-entropy-secret: High-entropy string detected — possible hardcoded credential or API key
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // REMOVED BY REPOGUARD: createRequire import for malware// REMOVED BY REPOGUARD: createRequire import for malware
// REMOVED BY REPOGUARD: require definition for malware

// REMOVED BY REPOGUARD: require definition for malware

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
// REMOVED BY REPOGUARD: obfuscated malware payload
