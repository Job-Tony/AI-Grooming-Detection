import type { ConversationExtractor } from "./ConversationExtractor";

import { DiscordExtractor } from "./DiscordExtractor";
import { WhatsAppExtractor } from "./WhatsAppExtractor";
import { InstagramExtractor } from "./InstagramExtractor";
import { TelegramExtractor } from "./TelegramExtractor";
import { GenericExtractor } from "./GenericExtractor";

export class ExtractorFactory {
  private static readonly extractors: ConversationExtractor[] = [
    new DiscordExtractor(),
    new WhatsAppExtractor(),
    new InstagramExtractor(),
    new TelegramExtractor(),
    new GenericExtractor(),
  ];

  static getExtractor(url: string): ConversationExtractor {
    return (
      this.extractors.find((extractor) =>
        extractor.canHandle(url)
      ) ?? new GenericExtractor()
    );
  }
}