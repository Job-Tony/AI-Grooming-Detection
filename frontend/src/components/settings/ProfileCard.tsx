import { User, Mail, Shield, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl bg-white shadow-md p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Profile
        </h2>

        <button
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <User
            size={40}
            className="text-blue-600"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User
              size={18}
              className="text-gray-500"
            />

            <span className="font-semibold">
              {user?.username}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Mail
              size={18}
              className="text-gray-500"
            />

            <span>
              {user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Shield
              size={18}
              className="text-gray-500"
            />

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Authenticated User
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}