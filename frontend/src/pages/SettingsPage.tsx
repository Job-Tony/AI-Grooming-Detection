import ProfileCard from "../components/settings/ProfileCard";
import SecurityCard from "../components/settings/SecurityCard";
import AIPreferencesCard from "../components/settings/AIPreferencesCard";
import SystemInfoCard from "../components/settings/SystemInfoCard";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            Manage your account, AI preferences, security and system
            information.
          </p>
        </div>

        {/* Profile */}
        <ProfileCard />

        {/* Security */}
        <SecurityCard />

        {/* Bottom Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          <AIPreferencesCard />
          <SystemInfoCard />
        </div>
      </div>
    </div>
  );
}