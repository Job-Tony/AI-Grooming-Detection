import {
  FileText,
  MessageCircle,
} from "lucide-react";

import type {
  UploadedConversationResponse,
} from "@/types/upload";

interface ConversationViewerProps {
  conversation: UploadedConversationResponse;
}

export default function ConversationViewer({
  conversation,
}: ConversationViewerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-200 p-2">
            <FileText
              size={22}
              className="text-slate-700"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Uploaded Conversation
            </h2>

            <p className="text-sm text-slate-500">
              {conversation.filename}
            </p>
          </div>
        </div>
      </div>

      {/* Conversation */}

      <div className="max-h-[550px] overflow-y-auto bg-slate-100 p-6">
        <div className="space-y-4">
          {conversation.conversation.map(
            (message, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex ${
                    isLeft
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] gap-3 ${
                      isLeft
                        ? ""
                        : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isLeft
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      <MessageCircle
                        size={18}
                        className={
                          isLeft
                            ? "text-blue-700"
                            : "text-green-700"
                        }
                      />
                    </div>

                    <div
                      className={`rounded-2xl border p-4 shadow-sm ${
                        isLeft
                          ? "bg-white"
                          : "bg-green-50"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-6">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {isLeft
                            ? "Participant A"
                            : "Participant B"}
                        </span>

                        <span className="text-xs text-slate-400">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Footer */}

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Total Messages
          </span>

          <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
            {conversation.message_count}
          </span>
        </div>
      </div>
    </div>
  );
}