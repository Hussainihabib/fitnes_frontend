import { Routes, Route, Outlet } from "react-router-dom";
import React from "react"; 

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
      <PrivateNavbar />
      <Outlet />
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>

          <Route path="/" element={<HomePage />} />

          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />

          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Workouts />} />

            <Route path="/workouts" element={<Workouts />} />
            <Route path="/" element={<Nutrition />} />

            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/" element={<Progress />} />

            <Route path="/progress" element={<Progress />} />
            <Route path="/" element={<Reports />} />

            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<SupportForm />} />
            
            <Route path="/supportForm" element={<SupportForm />} />
            <Route path="/" element={<Profile />} />

            <Route path="/profile" element={<Profile />} />


            <Route path="/" element={<Notifications />} />
          
            <Route path="/notifications" element={<Notifications />} />

            <Route path="/" element={<Settings />} />
           
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}
