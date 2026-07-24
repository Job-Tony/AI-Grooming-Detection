interface HistoryHeaderProps {
  total: number;
}

export default function HistoryHeader({
  total,
}: HistoryHeaderProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-3xl font-bold">
        Analysis History
      </h1>

      <p className="mt-2 text-gray-500">
        View and manage all previous AI grooming analyses.
      </p>

      <div className="mt-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
        {total} Analysis{total !== 1 ? "es" : ""}
      </div>
    </div>
  );
}