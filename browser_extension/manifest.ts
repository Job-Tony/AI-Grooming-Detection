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
  ],

  host_permissions: [
    "http://localhost:8000/*",

    "https://discord.com/*",

    "https://web.whatsapp.com/*",

    "https://www.instagram.com/*",

    "https://web.telegram.org/*",
  ],

  content_scripts: [
    {
      matches: [
        "https://discord.com/*",

        "https://web.whatsapp.com/*",

        "https://www.instagram.com/*",

        "https://web.telegram.org/*",
      ],

      js: [
        "src/content/content.ts",
      ],
    },
  ],
});