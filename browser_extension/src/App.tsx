import { useEffect, useState } from "react";

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
import type { PredictionWithExplanation } from "./types/prediction";


/* =====================================================
   TYPE FOR SAVED AUTOMATIC RESULT
   ===================================================== */

type AutoMonitorResult = {
  prediction?: PredictionWithExplanation;
  conversation?: Conversation;
  timestamp?: number;
  url?: string;
};


/* =====================================================
   TYPE FOR LIVE AUTO MONITOR MESSAGE
   ===================================================== */

type AutoMonitorMessage = {
  type?: string;
  prediction?: PredictionWithExplanation;
  conversation?: Conversation;
};


function App() {

  /* =====================================================
     CONVERSATION
     ===================================================== */

  const [
    conversation,
    setConversation,
  ] = useState<Conversation | null>(null);


  /* =====================================================
     ERROR
     ===================================================== */

  const [
    error,
    setError,
  ] = useState("");


  /* =====================================================
     MANUAL PREDICTION
     ===================================================== */

  const {
    loading,
    prediction,
    analyze,
  } = usePrediction();


  /* =====================================================
     AUTOMATIC PREDICTION
     ===================================================== */

  const [
    automaticPrediction,
    setAutomaticPrediction,
  ] = useState<PredictionWithExplanation | null>(
    null,
  );


  /* =====================================================
     LOAD LAST AUTOMATIC RESULT
     
     This runs every time the extension popup opens.

     AutoMonitor stores its latest result in:

     chrome.storage.local

     Therefore closing the popup does NOT remove the
     automatic analysis result.
     ===================================================== */

  useEffect(() => {

    const loadAutomaticResult =
      async () => {

        try {

          console.log(
            "📦 Loading saved AutoMonitor result...",
          );


          const stored =
            await chrome.storage.local.get(
              "autoMonitorResult",
            );


          /*
           * Explicitly tell TypeScript what the stored
           * AutoMonitor result looks like.
           */

          const result =
            stored.autoMonitorResult as
              | AutoMonitorResult
              | undefined;


          /* No saved result */

          if (!result) {

            console.log(
              "📦 No AutoMonitor result saved yet.",
            );

            return;
          }


          console.log(
            "✅ AutoMonitor result restored:",
            result,
          );


          /* =================================================
             RESTORE PREDICTION
             ================================================= */

          if (result.prediction) {

            setAutomaticPrediction(
              result.prediction,
            );

          }


          /* =================================================
             RESTORE CONVERSATION
             ================================================= */

          if (result.conversation) {

            setConversation(
              result.conversation,
            );

          }

        } catch (err) {

          console.error(
            "❌ Failed to load AutoMonitor result:",
            err,
          );

        }

      };


    loadAutomaticResult();

  }, []);


  /* =====================================================
     LISTEN FOR LIVE AUTOMATIC RESULTS
     
     If AutoMonitor detects a new message while the
     extension popup is open, it sends:

     AUTO_ANALYSIS_RESULT

     This listener updates the popup immediately.
     ===================================================== */

  useEffect(() => {

    const handleAutoMonitorMessage = (
      message: AutoMonitorMessage,
    ) => {

      /* Ignore unrelated messages */

      if (
        message.type !==
        "AUTO_ANALYSIS_RESULT"
      ) {
        return;
      }


      console.log(
        "⚡ Live AutoMonitor result received:",
        message,
      );


      /* =================================================
         UPDATE AUTOMATIC PREDICTION
         ================================================= */

      if (message.prediction) {

        setAutomaticPrediction(
          message.prediction,
        );

      }


      /* =================================================
         UPDATE CONVERSATION
         ================================================= */

      if (message.conversation) {

        setConversation(
          message.conversation,
        );

      }


      /* Clear previous errors */

      setError("");

    };


    chrome.runtime.onMessage.addListener(
      handleAutoMonitorMessage,
    );


    return () => {

      chrome.runtime.onMessage.removeListener(
        handleAutoMonitorMessage,
      );

    };

  }, []);


  /* =====================================================
     MANUAL ANALYSIS
     ===================================================== */

  const handleAnalyze = async () => {

    setError("");


    try {

      console.log(
        "🔎 Starting manual analysis...",
      );


      /* =================================================
         EXTRACT CONVERSATION
         ================================================= */

      const extractedConversation =
        await BrowserService.getConversation();


      console.log(
        "💬 Manual conversation extracted:",
        extractedConversation,
      );


      /* Display conversation */

      setConversation(
        extractedConversation,
      );


      /* =================================================
         CHECK FOR EMPTY CONVERSATION
         ================================================= */

      if (
        extractedConversation.messages
          .length === 0
      ) {

        setError(
          "No messages found in the current conversation.",
        );

        return;
      }


      /* =================================================
         EXTRACT MESSAGE CONTENTS
         ================================================= */

      const messages =
        extractedConversation.messages.map(
          (message) =>
            message.content,
        );


      console.log(
        "📨 Sending messages for manual analysis:",
        messages,
      );


      /* =================================================
         SEND TO BACKEND
         ================================================= */

      await analyze(messages);


      console.log(
        "✅ Manual analysis completed.",
      );

    } catch (err) {

      console.error(
        "❌ Manual analysis failed:",
        err,
      );


      setError(
        "Unable to connect to the AI backend. Please make sure the FastAPI server is running.",
      );

    }

  };


  /* =====================================================
     DISPLAYED PREDICTION
     
     Manual prediction has priority.

     If there is no manual prediction, display the latest
     automatic prediction.
     ===================================================== */

  const displayedPrediction =
    prediction ??
    automaticPrediction;


  /* =====================================================
     UI
     ===================================================== */

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

      {/* =================================================
          LOADING OVERLAY
          ================================================= */}

      <LoadingOverlay
        visible={loading}
      />


      {/* =================================================
          BACKGROUND GLOW
          ================================================= */}

      <div
        className="
          absolute
          -top-24
          -right-24
          h-72
          w-72
          rounded-full
          bg-blue-600/20
          blur-3xl
        "
      />


      <div
        className="
          absolute
          bottom-0
          left-0
          h-56
          w-56
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <div
        className="
          relative
          z-10
          p-5
        "
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <Header />


        {/* =================================================
            MANUAL ANALYZE BUTTON
            ================================================= */}

        <AnalyzeButton
          loading={loading}
          onAnalyze={handleAnalyze}
        />


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <FadeIn>

            <ErrorCard
              message={error}
            />

          </FadeIn>

        )}


        {/* =================================================
            EMPTY STATE
            ================================================= */}

        {!displayedPrediction &&
          !error && (

            <FadeIn>

              <EmptyState />

            </FadeIn>

          )}


        {/* =================================================
            PREDICTION RESULTS
            ================================================= */}

        {displayedPrediction && (

          <>

            {/* =================================================
                RISK CARD
                ================================================= */}

            <FadeIn>

              <RiskCard
                prediction={
                  displayedPrediction
                }
              />

            </FadeIn>


            {/* =================================================
                EXPLANATION CARD
                ================================================= */}

            <FadeIn>

              <ExplanationCard
                explanation={
                  displayedPrediction
                    .explanation
                }
              />

            </FadeIn>


            {/* =================================================
                WORD IMPORTANCE
                ================================================= */}

            <FadeIn>

              <WordImportance
                words={
                  displayedPrediction
                    .explanation
                    .words
                }
              />

            </FadeIn>


            {/* =================================================
                TIMELINE
                ================================================= */}

            <FadeIn>

              <TimelineCard
                predictionTimeline={
                  displayedPrediction
                    .prediction_timeline
                }
                explanationTimeline={
                  displayedPrediction
                    .explanation_timeline
                }
              />

            </FadeIn>

          </>

        )}


        {/* =================================================
            CONVERSATION CARD
            ================================================= */}

        {conversation && (

          <FadeIn>

            <ConversationCard
              conversation={
                conversation
              }
            />

          </FadeIn>

        )}


        {/* =================================================
            FOOTER
            ================================================= */}

        <Footer />

      </div>

    </div>

  );
}


export default App;