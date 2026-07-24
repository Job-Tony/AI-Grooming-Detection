import { useState } from "react";

import Header from "./Header";
import AnalyzeButton from "./AnalyzeButton";
import ConversationCard from "./ConversationCard";
import RiskCard from "./RiskCard";
import Footer from "./Footer";

import ExplanationCard from "./components/ExplanationCard";
import WordImportance from "./components/WordImportance";
import EmptyState from "./components/EmptyState";
import ErrorCard from "./components/ErrorCard";
import TimelineCard from "./components/TimelineCard";

import FadeIn from "./ui/FadeIn";
import LoadingOverlay from "./ui/LoadingOverlay";

import { BrowserService } from "./services/BrowserService";
import { usePrediction } from "./hooks/usePrediction";

import type { Conversation } from "./types/Conversation";

function App() {
  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [error, setError] = useState("");

  const {
    loading,
    prediction,
    analyze,
  } = usePrediction();

  const handleAnalyze = async () => {
    setError("");

    try {
      const extractedConversation =
        await BrowserService.getConversation();

      setConversation(extractedConversation);

      if (extractedConversation.messages.length === 0) {
        setError("No messages found in the current conversation.");
        return;
      }

      const messages =
        extractedConversation.messages.map(
          (message) => message.content,
        );

      await analyze(messages);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the AI backend. Please make sure the FastAPI server is running.",
      );
    }
  };

  return (
    <div
      className="
      relative
      w-[420px]
      min-h-[650px]
      max-h-[760px]
      overflow-y-auto
      bg-slate-950
      text-slate-100
      "
    >
      <LoadingOverlay visible={loading} />

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 p-5">

        <Header />

        <AnalyzeButton
          loading={loading}
          onAnalyze={handleAnalyze}
        />

        {error && (
          <FadeIn>
            <ErrorCard message={error} />
          </FadeIn>
        )}

        {!prediction && !error && (
          <FadeIn>
            <EmptyState />
          </FadeIn>
        )}

        {prediction && (
          <>
            <FadeIn>
              <RiskCard prediction={prediction} />
            </FadeIn>

            <FadeIn>
              <ExplanationCard
                explanation={prediction.explanation}
              />
            </FadeIn>

            <FadeIn>
              <WordImportance
                words={prediction.explanation.words}
              />
            </FadeIn>

            <FadeIn>
              <TimelineCard
                predictionTimeline={
                  prediction.prediction_timeline
                }
                explanationTimeline={
                  prediction.explanation_timeline
              }
            />
          </FadeIn>
          </>
        )}

        {conversation && (
          <FadeIn>
            <ConversationCard
              conversation={conversation}
            />
          </FadeIn>
        )}

        <Footer />

      </div>
    </div>
  );
}

export default App;