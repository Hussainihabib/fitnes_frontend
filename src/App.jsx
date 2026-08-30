import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import AuthProvider from "./context/AuthContext";
import NotificationProvider from "./context/NotificationContext";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivateNavbar from "./components/PrivateNavbar";
import SupportForm from "./components/supportForm";


const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          minHeight: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Premium Sidebar */}
        <PrivateNavbar />

        {/* Main Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            width: {
              xs: "100%",
              md: "calc(100% - 280px)",
            },
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ProtectedRoute>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Protected Application Routes */}
          <Route element={<ProtectedLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/workouts"
              element={<Workouts />}
            />

            <Route
              path="/nutrition"
              element={<Nutrition />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/supportForm"
              element={<SupportForm />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>


          {/* Fallback Route */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}