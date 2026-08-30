import { useContext, useState } from "react";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";

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

import {
  ColorModeContext,
  ACCENT,
  GRADIENT_PRIMARY,
} from "../context/ThemeContext";

const drawerWidth = 272;

export default function PrivateNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const { logout, user } = useAuth();

  const { mode, toggleMode } = useContext(ColorModeContext);

  const theme = useTheme();

  const mobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [open, setOpen] = useState(false);

  const items = [
    [
      "Dashboard",
      "/dashboard",
      <DashboardRoundedIcon />,
    ],

    [
      "Workouts",
      "/workouts",
      <FitnessCenterRoundedIcon />,
    ],

    [
      "Nutrition",
      "/nutrition",
      <RestaurantRoundedIcon />,
    ],

    [
      "Progress",
      "/progress",
      <ShowChartRoundedIcon />,
    ],

    [
      "Reports",
      "/reports",
      <AssessmentRoundedIcon />,
    ],

    [
      "Profile",
      "/profile",
      <PersonRoundedIcon />,
    ],

    [
      "Feedback",
      "/supportForm",
      <SupportAgentRoundedIcon />,
    ],
  ];

  const handleNavigate = (path) => {
    navigate(path);

    if (mobile) {
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      setOpen(false);

      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebar = (
    <Box
      sx={{
        height: "100%",
        width: "100%",

        display: "flex",

        flexDirection: "column",

        p: 2,

        overflowY: "auto",

        overflowX: "hidden",

        background:
          mode === "dark"
            ? "linear-gradient(180deg, #0d1422 0%, #080d16 100%)"
            : "#ffffff",

        scrollbarWidth: "thin",

        "&::-webkit-scrollbar": {
          width: 6,
        },

        "&::-webkit-scrollbar-thumb": {
          background:
            mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.12)",

          borderRadius: 10,
        },
      }}
    >
      {/* ================= LOGO ================= */}

      <Box
        onClick={() => handleNavigate("/dashboard")}
        sx={{
          display: "flex",

          alignItems: "center",

          gap: 1.4,

          px: 1,

          py: 1.2,

          mb: 2,

          cursor: "pointer",

          flexShrink: 0,

          transition: "transform 0.2s ease",

          "&:hover": {
            transform: "translateX(2px)",
          },
        }}
      >
        <Box
          sx={{
            width: 44,

            height: 44,

            borderRadius: 3,

            background: GRADIENT_PRIMARY,

            display: "grid",

            placeItems: "center",

            fontWeight: 900,

            color: "#031510",

            fontSize: 20,

            flexShrink: 0,

            boxShadow:
              "0 8px 22px rgba(16,185,129,0.22)",
          }}
        >
          F
        </Box>

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,

              fontSize: 20,

              lineHeight: 1.1,

              whiteSpace: "nowrap",
            }}
          >
            FitTrack
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Fitness companion
          </Typography>
        </Box>
      </Box>

      {/* ================= MENU LABEL ================= */}

      <Typography
        variant="overline"
        sx={{
          px: 1.5,

          color: "text.secondary",

          fontWeight: 800,

          letterSpacing: 1.3,

          flexShrink: 0,
        }}
      >
        MENU
      </Typography>

      {/* ================= NAVIGATION ================= */}

      <List
        sx={{
          mt: 1,

          p: 0,

          flexShrink: 0,
        }}
      >
        {items.map(([label, path, icon]) => {
          const active =
            location.pathname === path;

          return (
            <ListItemButton
              key={path}
              onClick={() => handleNavigate(path)}
              sx={{
                mb: 0.7,

                borderRadius: 3,

                py: 1.15,

                color: active
                  ? "#04140f"
                  : "text.primary",

                background: active
                  ? GRADIENT_PRIMARY
                  : "transparent",

                boxShadow: active
                  ? "0 8px 22px rgba(16,185,129,.18)"
                  : "none",

                transition:
                  "all 0.2s ease",

                "&:hover": {
                  background: active
                    ? GRADIENT_PRIMARY
                    : "rgba(16,185,129,.10)",

                  transform:
                    "translateX(3px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,

                  color: active
                    ? "#04140f"
                    : ACCENT,
                }}
              >
                {icon}
              </ListItemIcon>

              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontWeight: active
                    ? 800
                    : 600,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* ================= BOTTOM SECTION ================= */}

      <Box
        sx={{
          mt: "auto",

          pt: 2,

          flexShrink: 0,
        }}
      >
        <Divider
          sx={{
            mb: 1.5,
          }}
        />

        {/* ================= SETTINGS ================= */}

        <ListItemButton
          onClick={() =>
            handleNavigate("/settings")
          }
          sx={{
            borderRadius: 3,

            mb: 0.7,

            color:
              location.pathname === "/settings"
                ? "#04140f"
                : "text.primary",

            background:
              location.pathname === "/settings"
                ? GRADIENT_PRIMARY
                : "transparent",

            transition: "all 0.2s ease",

            "&:hover": {
              background:
                location.pathname === "/settings"
                  ? GRADIENT_PRIMARY
                  : "rgba(16,185,129,.10)",

              transform:
                "translateX(3px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,

              color:
                location.pathname === "/settings"
                  ? "#04140f"
                  : ACCENT,
            }}
          >
            <SettingsRoundedIcon />
          </ListItemIcon>

          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontWeight:
                location.pathname === "/settings"
                  ? 800
                  : 600,
            }}
          />
        </ListItemButton>

        {/* ================= LOGOUT ================= */}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,

            color: "#fb7185",

            transition: "all 0.2s ease",

            "&:hover": {
              background:
                "rgba(251,113,133,0.10)",

              transform:
                "translateX(3px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,

              color: "#fb7185",
            }}
          >
            <LogoutRoundedIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 700,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* ========================================= */}
      {/* MOBILE HEADER */}
      {/* ========================================= */}

      {mobile && (
        <Box
          sx={{
            height: 68,

            width: "100%",

            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            px: {
              xs: 1.5,
              sm: 2,
            },

            position: "sticky",

            top: 0,

            zIndex: 1200,

            backdropFilter:
              "blur(18px)",

            background:
              mode === "dark"
                ? "rgba(8,13,22,.90)"
                : "rgba(255,255,255,.92)",

            borderBottom:
              "1px solid",

            borderColor: "divider",

            boxSizing: "border-box",
          }}
        >
          {/* MENU BUTTON */}

          <IconButton
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuRoundedIcon />
          </IconButton>

          {/* LOGO */}

          <Typography
            fontWeight={900}
            sx={{
              fontSize: {
                xs: 18,
                sm: 20,
              },
            }}
          >
            FitTrack
          </Typography>

          {/* ACTIONS */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",
            }}
          >
            <Tooltip title="Theme">
              <IconButton
                onClick={toggleMode}
                aria-label="Toggle theme"
              >
                {mode === "dark" ? (
                  <LightModeRoundedIcon />
                ) : (
                  <DarkModeRoundedIcon />
                )}
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={() =>
                handleNavigate(
                  "/notifications"
                )
              }
              aria-label="Notifications"
            >
              <Badge
                color="error"
                variant="dot"
              >
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      )}

      {/* ========================================= */}
      {/* DESKTOP FIXED SIDEBAR */}
      {/* ========================================= */}

      {!mobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,

            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,

              boxSizing: "border-box",

              border: 0,

              borderRight:
                "1px solid",

              borderColor: "divider",

              position: "fixed",

              left: 0,

              top: 0,

              height: "100vh",

              overflow: "hidden",

              zIndex: 1200,
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      {/* ========================================= */}
      {/* MOBILE DRAWER */}
      {/* ========================================= */}

      {mobile && (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            zIndex: 1400,

            "& .MuiDrawer-paper": {
              width: drawerWidth,

              maxWidth: "86vw",

              border: 0,

              height: "100vh",

              overflow: "hidden",
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      {/* ========================================= */}
      {/* DESKTOP ACTION BAR */}
      {/* ========================================= */}

      {!mobile && (
        <Box
          sx={{
            position: "fixed",

            top: 18,

            right: {
              md: 24,
              lg: 32,
            },

            zIndex: 1300,

            display: "flex",

            gap: 0.8,

            alignItems: "center",

            px: 1,

            py: 0.5,

            borderRadius: 99,

            background:
              mode === "dark"
                ? "rgba(18,24,38,.86)"
                : "rgba(255,255,255,.90)",

            backdropFilter:
              "blur(18px)",

            border:
              "1px solid",

            borderColor:
              "divider",

            boxShadow:
              mode === "dark"
                ? "0 10px 30px rgba(0,0,0,.28)"
                : "0 10px 30px rgba(15,23,42,.08)",
          }}
        >
          {/* THEME */}

          <Tooltip title="Theme">
            <IconButton
              onClick={toggleMode}
              aria-label="Toggle theme"
            >
              {mode === "dark" ? (
                <LightModeRoundedIcon />
              ) : (
                <DarkModeRoundedIcon />
              )}
            </IconButton>
          </Tooltip>

          {/* NOTIFICATIONS */}

          <Tooltip title="Notifications">
            <IconButton
              onClick={() =>
                navigate(
                  "/notifications"
                )
              }
              aria-label="Notifications"
            >
              <Badge
                color="error"
                variant="dot"
              >
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* USER AVATAR */}

          <Tooltip
            title={
              user?.name || "Profile"
            }
          >
            <Avatar
              onClick={() =>
                navigate("/profile")
              }
              sx={{
                width: 34,

                height: 34,

                bgcolor: ACCENT,

                color: "#04140f",

                fontSize: 14,

                fontWeight: 900,

                cursor: "pointer",

                transition:
                  "transform 0.2s ease",

                "&:hover": {
                  transform:
                    "scale(1.06)",
                },
              }}
            >
              {user?.name?.[0]?.toUpperCase() ||
                "U"}
            </Avatar>
          </Tooltip>
        </Box>
      )}
    </>
  );
}