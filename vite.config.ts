import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/nexora-wholesale-business-manager/",
  plugins: [react()],
  server: { host: "0.0.0.0" }
});
