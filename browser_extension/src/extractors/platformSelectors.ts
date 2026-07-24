export interface PlatformSelectors {
  message: string[];

  author: string[];

  content: string[];

  timestamp: string[];

  id: string[];

  outgoing: string[];
}

export const PLATFORM_SELECTORS = {
  discord: {
    message: [
      '[id^="chat-messages-"]',
      '[class*="messageListItem"]',
    ],

    author: [
      '[id^="message-username-"]',
      '[class*="username"]',
    ],

    content: [
      '[id^="message-content-"]',
      '[class*="messageContent"]',
    ],

    timestamp: [
      "time",
    ],

    id: [
      "[id]",
    ],

    outgoing: [
      '[class*="isSending"]',
      '[class*="replying"]',
    ],
  },

  whatsapp: {
    message: [
      '[data-testid="msg-container"]',
    ],

    author: [
      '[data-testid="conversation-info-header-chat-title"]',
    ],

    content: [
      '[data-testid="msg-container"]',
    ],

    timestamp: [
      "time",
    ],

    id: [],

    outgoing: [
      '[data-testid="msg-meta"]',
    ],
  },

  instagram: {
    message: [
      '[role="row"]',
    ],

    author: [],

    content: [
      '[role="row"]',
    ],

    timestamp: [],

    id: [],

    outgoing: [],
  },

  telegram: {
    message: [
      ".message",
    ],

    author: [],

    content: [
      ".message",
    ],

    timestamp: [
      "time",
    ],

    id: [],

    outgoing: [],
  },
} satisfies Record<string, PlatformSelectors>;