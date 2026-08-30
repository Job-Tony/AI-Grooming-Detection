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

import IncidentsPage from "@/pages/IncidentsPage";
import IncidentDetailsPage from "@/pages/IncidentDetailsPage";

import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";


export const router = createBrowserRouter([
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================

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


  // =====================================================
  // PROTECTED ROUTES
  // =====================================================

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [

      // -------------------------
      // Dashboard
      // -------------------------

      {
        path: "/dashboard",
        element: <DashboardPage />,
      },


      // -------------------------
      // Upload
      // -------------------------

      {
        path: "/upload",
        element: <UploadPage />,
      },


      // -------------------------
      // AI Prediction
      // -------------------------

      {
        path: "/prediction",
        element: <PredictionPage />,
      },


      // -------------------------
      // Analysis History
      // -------------------------

      {
        path: "/history",
        element: <AnalysisHistoryPage />,
      },


      // -------------------------
      // Analysis Details
      // -------------------------

      {
        path: "/analysis/:analysisId",
        element: <AnalysisDetailsPage />,
      },


      // -------------------------
      // Incidents
      // -------------------------

      {
        path: "/incidents",
        element: <IncidentsPage />,
      },


      // -------------------------
      // Incident Details
      // -------------------------

      {
        path: "/incidents/:incidentId",
        element: <IncidentDetailsPage />,
      },


      // -------------------------
      // Settings
      // -------------------------

      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },


  // =====================================================
  // 404 - NOT FOUND
  // =====================================================

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);