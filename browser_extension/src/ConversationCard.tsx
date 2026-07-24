import {
  MessageSquare,
  User,
} from "lucide-react";

import Card from "./ui/Card";

import type { Conversation } from "./types/Conversation";

interface ConversationCardProps {
  conversation: Conversation | null;
}

export default function ConversationCard({
  conversation,
}: ConversationCardProps) {
  if (!conversation) return null;

  return (
    <Card className="mt-6 p-5">

      {/* Header */}

      <div className="mb-5 flex items-center gap-3">

        <div className="rounded-xl bg-blue-500/20 p-2">
          <MessageSquare
            className="text-blue-400"
            size={22}
          />
        </div>

        <div>

          <h2 className="text-lg font-semibold text-white">
            Conversation Preview
          </h2>

          <p className="text-sm text-slate-400">
            {conversation.platform}
          </p>

        </div>

      </div>

      {/* Messages */}

      <div className="max-h-96 space-y-4 overflow-y-auto pr-1">

        {conversation.messages.map((message, index) => {

          const outgoing =
            message.direction === "outgoing";

          return (

            <div
              key={message.id ?? index}
              className={`flex ${
                outgoing
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                max-w-[82%]
                rounded-2xl
                px-4
                py-3
                shadow-md

                ${
                  outgoing
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-100"
                }
                `}
              >

                <div className="mb-2 flex items-center gap-2">

                  <User
                    size={14}
                    className={
                      outgoing
                        ? "text-blue-100"
                        : "text-slate-400"
                    }
                  />

                  <span
                    className={`text-xs font-semibold ${
                      outgoing
                        ? "text-blue-100"
                        : "text-slate-400"
                    }`}
                  >
                    {message.author}
                  </span>

                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.content}
                </p>

                {message.timestamp && (

                  <div
                    className={`mt-3 text-right text-[11px] ${
                      outgoing
                        ? "text-blue-100/80"
                        : "text-slate-500"
                    }`}
                  >
                    {message.timestamp}
                  </div>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </Card>
  );
}