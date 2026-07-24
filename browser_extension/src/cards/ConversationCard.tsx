import Card from "../ui/Card";

interface Message {
  author: string;
  content: string;
  direction: "incoming" | "outgoing";
}

interface Props {
  messages: Message[];
}

export default function ConversationCard({
  messages,
}: Props) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 font-semibold text-white">
        Conversation Preview
      </h2>

      <div className="space-y-3">
        {messages.slice(0, 6).map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.direction === "outgoing"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.direction === "outgoing"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-100"
              }`}
            >
              <p className="mb-1 text-xs font-semibold opacity-70">
                {message.author}
              </p>

              <p className="text-sm">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}