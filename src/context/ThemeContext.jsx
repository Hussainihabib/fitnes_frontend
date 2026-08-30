import { createContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({
  mode: "dark",
  toggleMode: () => {},
});

/**
 * ---------------------------------------------------------------------------
 * DESIGN TOKENS — "Premium SaaS Fitness Dashboard"
 * Dark-mode-first, deep slate/charcoal surfaces with electric neon accents.
 * ---------------------------------------------------------------------------
 */
export const ACCENT = "#10b981"; // Electric neon green (emerald)
export const ACCENT_DARK = "#059669";
export const ACCENT_SOFT = "rgba(16, 185, 129, 0.14)";
export const CYAN = "#06b6d4"; // Secondary accent
export const CYAN_SOFT = "rgba(6, 182, 212, 0.14)";
export const AMBER = "#f59e0b"; // Tertiary accent (calories / energy)
export const AMBER_SOFT = "rgba(245, 158, 11, 0.14)";
export const DANGER = "#f43f5e";
export const DANGER_SOFT = "rgba(244, 63, 94, 0.14)";

export const GRADIENT_PRIMARY = `linear-gradient(135deg, ${ACCENT} 0%, ${CYAN} 100%)`;
export const GRADIENT_ENERGY = `linear-gradient(135deg, ${AMBER} 0%, #fb7185 100%)`;
export const GRADIENT_INFO = `linear-gradient(135deg, ${CYAN} 0%, #3b82f6 100%)`;
export const GRADIENT_DARK_SURFACE = "linear-gradient(160deg, #0f172a 0%, #0b0f1a 100%)";

// Deep slate / charcoal surfaces
const DARK_BG = "#0a0e16";
const DARK_BG_ELEVATED = "#0f172a";
const DARK_CARD = "#121826";
const DARK_CARD_HOVER = "#161d2e";
const DARK_BORDER = "rgba(255,255,255,0.08)";

const LIGHT_BG = "#f4f6f9";
const LIGHT_CARD = "#ffffff";
const LIGHT_BORDER = "rgba(15,23,42,0.08)";

export default function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("appTheme") || "dark");

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("appTheme", newMode);
    setMode(newMode);
  };

  const isDark = mode === "dark";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: ACCENT,
            dark: ACCENT_DARK,
            light: "#34d399",
            contrastText: "#031510",
          },
          secondary: {
            main: CYAN,
            contrastText: "#031014",
          },
          warning: { main: AMBER },
          error: { main: DANGER },
          success: { main: ACCENT },
          info: { main: CYAN },
          divider: isDark ? DARK_BORDER : LIGHT_BORDER,
          ...(isDark
            ? {
                background: {
                  default: DARK_BG,
                  paper: DARK_CARD,
                },
                text: {
                  primary: "#f1f5f9", // clean off-white
                  secondary: "#94a3b8", // soft muted gray
                },
              }
            : {
                background: {
                  default: LIGHT_BG,
                  paper: LIGHT_CARD,
                },
                text: {
                  primary: "#0f172a",
                  secondary: "#5b6472",
                },
              }),
        },

        shape: {
          borderRadius: 16,
        },

        typography: {
          fontFamily: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
          ].join(","),
          h4: { fontWeight: 800, letterSpacing: "-0.02em" },
          h5: { fontWeight: 800, letterSpacing: "-0.01em" },
          h6: { fontWeight: 700, letterSpacing: "-0.01em" },
          button: { fontWeight: 600 },
        },

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: isDark ? DARK_BG : LIGHT_BG,
                backgroundImage: isDark
                  ? `radial-gradient(circle at 15% 0%, rgba(16,185,129,0.06) 0%, rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 10%, rgba(6,182,212,0.05) 0%, rgba(0,0,0,0) 40%)`
                  : "none",
                backgroundAttachment: "fixed",
                scrollbarColor: isDark ? `${ACCENT_DARK} ${DARK_BG_ELEVATED}` : `#cbd5e1 ${LIGHT_BG}`,
              },
              "*::-webkit-scrollbar": {
                width: 10,
                height: 10,
              },
              "*::-webkit-scrollbar-track": {
                background: isDark ? DARK_BG_ELEVATED : LIGHT_BG,
              },
              "*::-webkit-scrollbar-thumb": {
                background: isDark ? "#243046" : "#cbd5e1",
                borderRadius: 8,
              },
            },
          },

          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: isDark ? DARK_CARD : LIGHT_CARD,
                backgroundImage: "none",
                borderRadius: 16,
                border: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                boxShadow: isDark
                  ? "0 4px 24px rgba(0,0,0,0.35)"
                  : "0 4px 18px rgba(15,23,42,0.06)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
              },
            },
          },

          MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                padding: 0,
                borderRadius: 16,
                backgroundColor: isDark ? DARK_CARD : LIGHT_CARD,
                border: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                boxShadow: isDark
                  ? "0 4px 24px rgba(0,0,0,0.35)"
                  : "0 4px 18px rgba(15,23,42,0.06)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
              },
            },
          },

          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backdropFilter: "blur(20px)",
                backgroundColor: isDark ? "rgba(10,14,22,0.72)" : "rgba(255,255,255,0.78)",
                borderBottom: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                boxShadow: "none",
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: 12,
                padding: "9px 18px",
                textTransform: "none",
                transition: "all 0.2s ease",
              },
              contained: {
                background: GRADIENT_PRIMARY,
                color: "#04140f",
                boxShadow: `0 4px 14px ${ACCENT_SOFT}`,
                "&:hover": {
                  boxShadow: `0 6px 22px rgba(16,185,129,0.35)`,
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": {
                  background: isDark ? "#1e293b" : "#e2e8f0",
                  color: isDark ? "#64748b" : "#94a3b8",
                },
              },
              outlined: {
                borderColor: isDark ? DARK_BORDER : LIGHT_BORDER,
                color: isDark ? "#e2e8f0" : "#0f172a",
                "&:hover": {
                  borderColor: ACCENT,
                  backgroundColor: ACCENT_SOFT,
                },
              },
              text: {
                "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)" },
              },
            },
          },

          MuiIconButton: {
            styleOverrides: {
              root: {
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.10)",
                  transform: "translateY(-1px)",
                },
              },
            },
          },

          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.02em",
                border: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
              },
              colorSuccess: {
                backgroundColor: ACCENT_SOFT,
                color: isDark ? "#34d399" : ACCENT_DARK,
                borderColor: "rgba(16,185,129,0.35)",
              },
              colorPrimary: {
                backgroundColor: ACCENT_SOFT,
                color: isDark ? "#34d399" : ACCENT_DARK,
                borderColor: "rgba(16,185,129,0.35)",
              },
              colorInfo: {
                backgroundColor: CYAN_SOFT,
                color: isDark ? "#22d3ee" : "#0e7490",
                borderColor: "rgba(6,182,212,0.35)",
              },
              colorSecondary: {
                backgroundColor: CYAN_SOFT,
                color: isDark ? "#22d3ee" : "#0e7490",
                borderColor: "rgba(6,182,212,0.35)",
              },
              colorWarning: {
                backgroundColor: AMBER_SOFT,
                color: isDark ? "#fbbf24" : "#b45309",
                borderColor: "rgba(245,158,11,0.35)",
              },
              colorError: {
                backgroundColor: DANGER_SOFT,
                color: isDark ? "#fb7185" : "#be123c",
                borderColor: "rgba(244,63,94,0.35)",
              },
              colorDefault: {
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)",
                color: isDark ? "#cbd5e1" : "#334155",
              },
            },
          },

          MuiTableContainer: {
            styleOverrides: {
              root: {
                borderRadius: 14,
              },
            },
          },

          MuiTableHead: {
            styleOverrides: {
              root: {
                "& .MuiTableCell-root": {
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f4f7fb",
                  color: isDark ? "#94a3b8" : "#5b6472",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                },
              },
            },
          },

          MuiTableRow: {
            styleOverrides: {
              root: {
                transition: "background-color 0.2s ease",
                "&:last-child td": { borderBottom: 0 },
              },
            },
          },

          MuiTableBody: {
            styleOverrides: {
              root: {
                "& .MuiTableRow-root:hover": {
                  backgroundColor: isDark ? DARK_CARD_HOVER : "#f8fafc",
                },
              },
            },
          },

          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                padding: "14px 16px",
              },
            },
          },

          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 12,
                  backgroundColor: isDark ? "#0d1420" : "#f7f9fc",
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  transition: "all 0.2s ease",

                  "& fieldset": {
                    borderColor: isDark ? DARK_BORDER : "#d8dee8",
                  },
                  "&:hover fieldset": {
                    borderColor: ACCENT,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: ACCENT,
                    borderWidth: 1.5,
                    boxShadow: `0 0 0 3px ${ACCENT_SOFT}`,
                  },
                },

                "& .MuiInputLabel-root": {
                  color: isDark ? "#8695ab" : "#5b6472",
                  "&.Mui-focused": { color: ACCENT },
                },
              },
            },
          },

          MuiLinearProgress: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "#e9eef5",
              },
              bar: {
                borderRadius: 999,
                background: GRADIENT_PRIMARY,
              },
            },
          },

          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: isDark ? DARK_BORDER : LIGHT_BORDER,
              },
            },
          },

          MuiMenu: {
            styleOverrides: {
              paper: {
                borderRadius: 14,
                backgroundColor: isDark ? DARK_CARD : LIGHT_CARD,
                border: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(15,23,42,0.12)",
              },
            },
          },

          MuiMenuItem: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                margin: "2px 6px",
                "&:hover": {
                  backgroundColor: ACCENT_SOFT,
                },
              },
            },
          },

          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 20,
                backgroundColor: isDark ? DARK_CARD : LIGHT_CARD,
                border: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
                backgroundImage: "none",
              },
            },
          },

          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundImage: "none",
              },
            },
          },

          MuiAvatar: {
            styleOverrides: {
              root: {
                border: `2px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
              },
            },
          },

          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: isDark ? "#1e293b" : "#0f172a",
                fontSize: "0.72rem",
                borderRadius: 8,
                padding: "6px 10px",
              },
            },
          },

          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                border: `1px solid ${isDark ? DARK_BORDER : LIGHT_BORDER}`,
              },
            },
          },
        },
      }),
    [mode, isDark]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
