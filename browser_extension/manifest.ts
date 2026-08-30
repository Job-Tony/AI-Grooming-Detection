import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "AI Grooming Detection",

  version: "1.0.0",

  description:
    "AI-powered browser extension for early detection of online child grooming.",

  action: {
    default_popup: "index.html",
    default_title: "AI Grooming Detection",
  },

  permissions: [
    "storage",
    "activeTab",
    "notifications",
  ],

  host_permissions: [
    "http://localhost:8000/*",
    "http://*/*",
    "https://*/*",
  ],

  background: {
    service_worker: "src/background.ts",
  },

  content_scripts: [
    {
      matches: [
        "http://*/*",
        "https://*/*",
      ],

      js: [
        "src/content/content.ts",
      ],
    },
  ],
});