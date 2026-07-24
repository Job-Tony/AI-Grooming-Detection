import Card from "../ui/Card";

interface Word {
  token: string;
  color: string;
}

interface Props {
  words: Word[];
}

export default function WordImportanceCard({
  words,
}: Props) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 font-semibold text-white">
        Important Words
      </h2>

      <div className="flex flex-wrap gap-2">
        {words.map((word) => (
          <span
            key={word.token}
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{
              background: `${word.color}20`,
              color: word.color,
            }}
          >
            {word.token}
          </span>
        ))}
      </div>
    </Card>
  );
}