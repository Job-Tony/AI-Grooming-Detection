import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentAnalyses from "@/components/dashboard/RecentAnalyses";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Statistics */}
      <DashboardStats />

      {/* Recent Analyses + Chart */}
      <div className="grid gap-8 lg:grid-cols-2">
        <RecentAnalyses />
        <RiskDistributionChart />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}