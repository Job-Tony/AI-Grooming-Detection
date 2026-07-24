import Badge from "../ui/Badge";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";

interface Props {
  risk: number;
}

export default function RiskCard({
  risk,
}: Props) {
  const label =
    risk > 75
      ? "HIGH RISK"
      : risk > 40
      ? "MEDIUM RISK"
      : "LOW RISK";

  const variant =
    risk > 75
      ? "danger"
      : risk > 40
      ? "warning"
      : "success";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">
          Overall Risk
        </h2>

        <Badge
          text={label}
          variant={variant}
        />
      </div>

      <div className="mt-4 text-5xl font-bold text-white">
        {risk.toFixed(1)}%
      </div>

      <ProgressBar value={risk} />
    </Card>
  );
}