export default function EmptyHistory() {
  return (
    <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
      <div className="text-6xl">
        📂
      </div>

      <h2 className="mt-6 text-2xl font-bold">
        No Analysis History
      </h2>

      <p className="mt-3 text-gray-500">
        Analyze a conversation to see it appear here.
      </p>
    </div>
  );
}