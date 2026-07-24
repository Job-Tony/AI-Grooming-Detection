import {
  BrainCircuit,
  ShieldCheck,
  Activity,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Explainable AI",
    description:
      "Every prediction includes transparent word-level explanations using SHAP, allowing administrators to understand why the AI reached its decision.",
  },
  {
    icon: ShieldCheck,
    title: "AI-Powered Detection",
    description:
      "Detect potential online child grooming conversations using a DistilBERT + BiLSTM deep learning model trained on real-world datasets.",
  },
  {
    icon: Activity,
    title: "Risk Assessment",
    description:
      "Generate confidence scores, prediction probabilities and overall conversation risk to assist administrators in decision-making.",
  },
  {
    icon: Globe,
    title: "Browser Extension",
    description:
      "Analyze supported online conversations directly from web platforms while keeping the administrator in control.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            Features
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Designed for Secure AI Moderation
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            SafeChat AI combines state-of-the-art Natural Language Processing,
            Explainable AI and risk assessment tools into one professional
            moderation platform.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >
              <div className="inline-flex rounded-2xl bg-blue-600/10 p-4">
                <feature.icon className="h-8 w-8 text-blue-400" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Features;