import { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ColorModeContext } from "../context/ThemeContext";

export default function PrivateNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { mode, toggleMode } = useContext(ColorModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const textColor = mode === "dark" ? "#E5F6FC" : "#0D1B2A";

  const menuItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Workouts", path: "/workouts" },
    { text: "Nutrition", path: "/nutrition" },
    { text: "Progress", path: "/progress" },
    { text: "Profile", path: "/profile" },
    { text: "Reports", path: "/reports" },
    { text: "Feedback", path: "supportForm" },
  ];

  const glassColors = {
    light: "rgba(255,255,255,0.75)",
    dark: "rgba(17,25,40,0.65)",
  };

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Random notification simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          message: "You have a new notification!",
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setHasNew(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    setHasNew(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          mb: 3,
          borderRadius: "0 0 20px 20px",
          backdropFilter: "blur(20px)",
          background: glassColors[mode],
          boxShadow: "0px 0px 8px rgba(94, 103, 235, 0.4)",
          transition: "0.3s",
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", color: textColor }}>
          <IconButton
            sx={{ display: { xs: "block", sm: "none" }, mr: 1, color: textColor }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              flexGrow: 1,
              fontSize: "18px",
              cursor: "pointer",
              background: "linear-gradient(45deg,#6670ff,#5dd6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={() => navigate("/dashboard")}
          >
            FitTrack
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, mr: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  color: textColor,
                  fontSize: "15px",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 1.5,
                  "&:hover": {
                    background: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <IconButton onClick={toggleMode} sx={{ mr: 1, color: textColor }}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* Notification Bell */}
         <IconButton
  onClick={() => {
    setHasNew(false);
    navigate("/notifications");
  }}
  sx={{ mr: 1, color: textColor }}
>
  <Badge color="error" variant="dot" invisible={!hasNew}>
    <NotificationsIcon />
  </Badge>
</IconButton>

          
          <IconButton
            sx={{ display: { xs: "none", sm: "block" }, mr: 1, color: textColor }}
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon />
          </IconButton>

          <Button
            variant="contained"
            onClick={logout}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              borderRadius: "12px",
              background: "linear-gradient(45deg,#5e67eb,#5dd6ff)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(45deg,#5161e0,#4ac2ef)",
              },
            }}
          >
            Logout
          </Button>

          {/* Notification dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {notifications.length === 0 && <MenuItem disabled>No notifications</MenuItem>}
            {notifications.map((n) => (
              <MenuItem key={n.id}>{n.message}</MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            backdropFilter: "blur(18px)",
            background: glassColors[mode],
            color: textColor,
          },
        }}
      >
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                sx={{
                  mx: 1,
                  borderRadius: "10px",
                  color: textColor,
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                mx: 1,
                mt: 2,
                borderRadius: "10px",
                color: "#FF4D4D",
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
