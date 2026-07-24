import {
  Cpu,
  Database,
  BrainCircuit,
  Globe,
  Server,
  Code2,
  ShieldCheck,
  Layers,
} from "lucide-react";

const technologies = [
  {
    icon: BrainCircuit,
    name: "DistilBERT",
    description: "Transformer-based NLP model",
  },
  {
    icon: Cpu,
    name: "PyTorch",
    description: "Deep Learning Framework",
  },
  {
    icon: ShieldCheck,
    name: "SHAP",
    description: "Explainable AI",
  },
  {
    icon: Server,
    name: "FastAPI",
    description: "Backend REST API",
  },
  {
    icon: Database,
    name: "PostgreSQL",
    description: "Relational Database",
  },
  {
    icon: Globe,
    name: "React",
    description: "Modern Frontend",
  },
  {
    icon: Layers,
    name: "Tailwind CSS",
    description: "Responsive UI",
  },
  {
    icon: Code2,
    name: "TypeScript",
    description: "Type-safe Development",
  },
];

const TechStack = () => {
  return (
    <section
      id="technology"
      className="bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            Technology Stack
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Built with Modern Technologies
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            SafeChat AI combines cutting-edge AI research with modern web
            technologies to deliver an efficient and explainable moderation
            platform.
          </p>

        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500 hover:-translate-y-1"
            >
              <tech.icon className="h-10 w-10 text-blue-400" />

              <h3 className="mt-5 text-lg font-semibold text-white">
                {tech.name}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {tech.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default TechStack;