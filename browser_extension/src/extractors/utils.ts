export function cleanText(text?: string | null): string {
  return (text ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function createMessageId(
  platform: string,
  index: number,
): string {
  return `${platform}_${index}_${Date.now()}`;
}

export function inferDirection(
  author: string,
  currentUser?: string,
): "incoming" | "outgoing" {
  if (!currentUser) {
    return "incoming";
  }

  return author === currentUser
    ? "outgoing"
    : "incoming";
}