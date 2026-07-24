import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function SecurityCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    alert(
      "Password change functionality will be connected to the backend in a future update."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck className="text-blue-600" size={28} />

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Security
          </h2>

          <p className="text-gray-500">
            Manage your account password.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block font-medium">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          <Lock size={18} />
          Change Password
        </button>
      </form>
    </div>
  );
}