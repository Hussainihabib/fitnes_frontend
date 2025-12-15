import { createContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export default function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("appTheme") || "light");

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("appTheme", newMode);
    setMode(newMode);
  };

  const ACCENT = "#5e67eb"; 
  const DARK_BG = "#0b0c14"; 
  const DARK_CARD = "#15161f"; 

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: ACCENT,
            contrastText: "#ffffff",
          },
          ...(mode === "light"
            ? {
                background: {
                  default: "#f4f6fa", 
                  paper: "#ffffff",
                },
                text: {
                  primary: "#111",
                  secondary: "#555",
                },
              }
            : {
                background: {
                  default: DARK_BG,
                  paper: DARK_CARD,
                },
                text: {
                  primary: "#dddddd",
                  secondary: "#a1a1a1",
                },
              }),
        },

        shape: {
          borderRadius: 18,
        },

        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? DARK_CARD : "#ffffff",
                borderRadius: 22,
                boxShadow:
                  mode === "dark"
                    ? "0 6px 20px rgba(0,0,0,0.45)"
                    : "0 4px 16px rgba(0,0,0,0.10)",
                transition: "0.35s ease",
              },
            },
          },

          MuiCard: {
            styleOverrides: {
              root: {
                padding: "12px 16px",
                borderRadius: 22,
                backgroundColor: mode === "dark" ? DARK_CARD : "#ffffff",
                transition: "0.35s ease",
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: 14,
                padding: "10px 18px",
                textTransform: "none",
                transition: "0.3s",
                "&.MuiButton-contained": {
                  backgroundColor: ACCENT,
                  "&:hover": {
                    backgroundColor: "#5159d8",
                  },
                },
              },
            },
          },

          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 14,
                  backgroundColor:
                    mode === "dark" ? "#0f101a" : "#f7f7f7",
                  color: mode === "dark" ? "#fff" : "#000",
                  transition: "0.25s",

                  "& fieldset": {
                    borderColor:
                      mode === "dark" ? "#3d3d3d" : "#bfbfbf",
                  },
                  "&:hover fieldset": {
                    borderColor: ACCENT,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: ACCENT,
                    boxShadow: `0 0 0 2px ${ACCENT}50`,
                  },
                },

                "& .MuiInputLabel-root": {
                  color: mode === "dark" ? "#b6b6b6" : "#454545",
                },
              },
            },
          },
        },
      }),
    [mode]
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
