import { useContext, useState } from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Divider, Avatar, Tooltip, useMediaQuery, useTheme, Badge } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ColorModeContext, ACCENT, GRADIENT_PRIMARY } from "../context/ThemeContext";

const drawerWidth = 272;

export default function PrivateNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { mode, toggleMode } = useContext(ColorModeContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const items = [
    ["Dashboard", "/dashboard", <DashboardRoundedIcon />],
    ["Workouts", "/workouts", <FitnessCenterRoundedIcon />],
    ["Nutrition", "/nutrition", <RestaurantRoundedIcon />],
    ["Progress", "/progress", <ShowChartRoundedIcon />],
    ["Reports", "/reports", <AssessmentRoundedIcon />],
    ["Profile", "/profile", <PersonRoundedIcon />],
    ["Feedback", "/supportForm", <SupportAgentRoundedIcon />],
  ];

  const sidebar = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2, background: mode === "dark" ? "linear-gradient(180deg,#0d1422,#080d16)" : "#fff" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, px: 1, py: 1.2, mb: 2, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, background: GRADIENT_PRIMARY, display: "grid", placeItems: "center", fontWeight: 900, color: "#031510", fontSize: 20 }}>F</Box>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>FitTrack</Typography>
          <Typography variant="caption" color="text.secondary">Fitness companion</Typography>
        </Box>
      </Box>
      <Typography variant="overline" sx={{ px: 1.5, color: "text.secondary", fontWeight: 800, letterSpacing: 1.3 }}>MENU</Typography>
      <List sx={{ mt: 1, p: 0 }}>
        {items.map(([label, path, icon]) => {
          const active = location.pathname === path;
          return (
            <ListItemButton key={path} onClick={() => { navigate(path); setOpen(false); }} sx={{ mb: 0.7, borderRadius: 3, py: 1.15, color: active ? "#04140f" : "text.primary", background: active ? GRADIENT_PRIMARY : "transparent", boxShadow: active ? "0 8px 22px rgba(16,185,129,.18)" : "none", "&:hover": { background: active ? GRADIENT_PRIMARY : "rgba(16,185,129,.10)" } }}>
              <ListItemIcon sx={{ minWidth: 42, color: active ? "#04140f" : ACCENT }}>{icon}</ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontWeight: active ? 800 : 600 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1.5 }} />
        <ListItemButton onClick={() => navigate("/settings")} sx={{ borderRadius: 3, mb: 0.7 }}>
          <ListItemIcon sx={{ minWidth: 42 }}><SettingsRoundedIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
        <ListItemButton onClick={logout} sx={{ borderRadius: 3, color: "#fb7185" }}>
          <ListItemIcon sx={{ minWidth: 42, color: "#fb7185" }}><LogoutRoundedIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {mobile && <Box sx={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, position: "sticky", top: 0, zIndex: 1100, backdropFilter: "blur(18px)", background: mode === "dark" ? "rgba(8,13,22,.82)" : "rgba(255,255,255,.86)", borderBottom: "1px solid", borderColor: "divider" }}><IconButton onClick={() => setOpen(true)}><MenuRoundedIcon /></IconButton><Typography fontWeight={900}>FitTrack</Typography><Box><Tooltip title="Theme"><IconButton onClick={toggleMode}>{mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}</IconButton></Tooltip><IconButton onClick={() => navigate("/notifications")}><Badge color="error" variant="dot"><NotificationsRoundedIcon /></Badge></IconButton></Box></Box>}
      {!mobile && <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", border: 0, borderRight: "1px solid", borderColor: "divider" } }}>{sidebar}</Drawer>}
      {mobile && <Drawer open={open} onClose={() => setOpen(false)} sx={{ "& .MuiDrawer-paper": { width: drawerWidth, border: 0 } }}>{sidebar}</Drawer>}
      {!mobile && <Box sx={{ position: "fixed", top: 18, right: 24, zIndex: 1200, display: "flex", gap: 1, alignItems: "center", px: 1, py: 0.5, borderRadius: 99, background: mode === "dark" ? "rgba(18,24,38,.8)" : "rgba(255,255,255,.86)", backdropFilter: "blur(18px)", border: "1px solid", borderColor: "divider" }}><Tooltip title="Theme"><IconButton onClick={toggleMode}>{mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}</IconButton></Tooltip><IconButton onClick={() => navigate("/notifications")}><NotificationsRoundedIcon /></IconButton><Avatar sx={{ width: 32, height: 32, bgcolor: ACCENT, color: "#04140f", fontSize: 14, fontWeight: 900 }}>{user?.name?.[0]?.toUpperCase() || "U"}</Avatar></Box>}
      <Box sx={{ display: { xs: "none", md: "block" }, width: drawerWidth }} />
    </>
  );
}
