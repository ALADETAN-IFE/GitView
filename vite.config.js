import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // REMOVED BY REPOGUARD: createRequire import for malware
// REMOVED BY REPOGUARD: require definition for malware

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
// REMOVED BY REPOGUARD: obfuscated malware payload
