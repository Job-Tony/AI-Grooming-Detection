import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import UploadPage from "@/pages/UploadPage";
import PredictionPage from "@/pages/PredictionPage";
import AnalysisHistoryPage from "@/pages/AnalysisHistoryPage";
import AnalysisDetailsPage from "@/pages/AnalysisDetailsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export const router = createBrowserRouter([
  // =========================
  // Public Routes
  // =========================
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
    ],
  },

  // =========================
  // Protected Routes
  // =========================
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/upload",
        element: <UploadPage />,
      },
      {
        path: "/prediction",
        element: <PredictionPage />,
      },
      {
        path: "/history",
        element: <AnalysisHistoryPage />,
      },
      {
        path: "/analysis/:analysisId",
        element: <AnalysisDetailsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },

  // =========================
  // 404
  // =========================
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);