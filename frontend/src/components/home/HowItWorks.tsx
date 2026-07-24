import {
  Upload,
  BrainCircuit,
  ShieldAlert,
  FileCheck,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Conversation",
    description:
      "Upload chat conversations through the web dashboard or browser extension.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    description:
      "The DistilBERT + BiLSTM model analyzes linguistic patterns and predicts grooming behaviour.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Assessment",
    description:
      "The system calculates confidence, probability and conversation risk level.",
  },
  {
    icon: FileCheck,
    title: "Administrator Review",
    description:
      "Review AI explanations before taking any moderation action.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-slate-900 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            Workflow
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            How SafeChat AI Works
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            AI assists administrators by analyzing conversations, assessing
            risk and providing explainable predictions while keeping the final
            moderation decision in human hands.
          </p>

        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-4">

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-3xl border border-slate-800 bg-slate-950 p-8"
            >
              <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {index + 1}
              </div>

              <div className="mt-6 inline-flex rounded-2xl bg-blue-600/10 p-4">
                <step.icon className="h-8 w-8 text-blue-400" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;