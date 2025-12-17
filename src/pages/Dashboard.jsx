
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Avatar,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api$/, "") : "";

  const primaryGradient = "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)"; // Blue/Violet
  const secondaryGradient = "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)"; // Pink/Orange
  const infoGradient = "linear-gradient(135deg, #2af598 0%, #009efd 100%)"; // Green/Blue

  const glassBackground = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)";
  const panelShadow = isDark ? "0 10px 30px rgba(0,0,0,0.6)" : "0 10px 30px rgba(14,30,60,0.06)";

  useEffect(() => {
    if (authUser) setUser(authUser);
    loadUser();
    loadWorkouts();
    loadNutrition();
    loadProgress();
  }, [authUser]);

  const loadUser = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("loadUser error:", err.response?.data || err);
    }
  };

  const loadWorkouts = async () => {
    try {
      const res = await api.get("/workouts");
      setWorkouts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("loadWorkouts error:", err.response?.data || err);
      setWorkouts([]);
    }
  };

  const loadNutrition = async () => {
    try {
      const res = await api.get("/nutrition");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setNutrition(data);
    } catch (err) {
      console.error("loadNutrition error:", err.response?.data || err);
      setNutrition([]);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await api.get("/progress");
      setProgress(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("loadProgress error:", err.response?.data || err);
      setProgress([]);
    }
  };

  const totalWorkouts = workouts.length;
  const totalSets = workouts.reduce(
    (sum, w) =>
      sum +
      (Array.isArray(w.exercises) ? w.exercises.reduce((s, e) => s + (e.sets || 0), 0) : 0),
    0
  );
  const totalReps = workouts.reduce(
    (sum, w) =>
      sum +
      (Array.isArray(w.exercises) ? w.exercises.reduce((s, e) => s + (e.reps || 0), 0) : 0),
    0
  );
  const totalCalories = nutrition.reduce((sum, n) => sum + (n.calories || 0), 0);
  const lastProgress = progress.length > 0 ? progress[progress.length - 1] : null;

  const makeSparklinePath = (numbers = [], w = 120, h = 36) => {
    if (!numbers || numbers.length === 0) return "";
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    const range = max - min || 1;
    const step = w / Math.max(numbers.length - 1, 1);
    return numbers
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  };

  const recentCounts = useMemo(() => {
    const arr = workouts.slice(-7).map((w) => (Array.isArray(w.exercises) ? w.exercises.length : 0));
    while (arr.length < 7) arr.unshift(0);
    return arr;
  }, [workouts]);

  const SummaryCard = ({ title, value, unit, subtitle, Icon, gradient, onClick, sparkData }) => {
    return (
      <Card
        onClick={onClick}
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: gradient,
          color: "#fff",
          cursor: onClick ? "pointer" : "default",
          position: "relative",
          overflow: "hidden",
          minHeight: 170,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          transition: "transform .25s, box-shadow .25s",
          "&:hover": {
            transform: onClick ? "translateY(-6px)" : "none",
            boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
          },
        }}
      >
        <Box sx={{ position: "absolute", right: -10, top: -10, opacity: 0.12 }}>
          {Icon ? <Icon sx={{ fontSize: 110 }} /> : null}
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.95, fontWeight: 700 }}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
              {value}
            </Typography>
            {unit ? (
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                {unit}
              </Typography>
            ) : null}
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box sx={{ width: 140, height: 40 }}>
            {sparkData && sparkData.length > 0 ? (
              <svg width="100%" height="100%" viewBox={`0 0 120 36`} preserveAspectRatio="none">
                <path d={makeSparklinePath(sparkData, 120, 36)} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </Box>

          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: "#fff",
              background: "rgba(255,255,255,0.06)",
              px: 2,
              py: 0.6,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
            disableRipple
          >
            View
          </Button>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      <Card
        sx={{
          mb: 4,
          p: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
          borderRadius: 3,
          background: glassBackground,
          backdropFilter: "blur(8px)",
          boxShadow: panelShadow,
          justifyContent: "space-between",
          border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
  src={
    user?.profilePicture
      ? user.profilePicture.startsWith("http")
        ? user.profilePicture
        : `${base}/${user.profilePicture}`.replace(/\/{2,}/g, "/").replace(":/", "://")
      : "/default-avatar.png"
  }
  sx={{
    width: 72,
    height: 72,
    border: `3px solid ${theme.palette.primary.main}`,
  }}
/>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Hello, {user?.name || "Fitness Enthusiast"}!
            </Typography>
            <Typography color="text.secondary">Here's your snapshot for today</Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            onClick={() => navigate("/workouts")}
            startIcon={<FitnessCenterIcon />}
            sx={{
              background: primaryGradient,
              textTransform: "none",
              boxShadow: "none",
              borderRadius: 2,
              px: 2.5,
              py: 1,
            }}
          >
            Start New Session
          </Button>

          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate("/profile")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.2,
            }}
          >
            Edit Profile
          </Button>
        </Stack>
      </Card>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Total Workouts"
            value={totalWorkouts}
            unit="Sessions"
            subtitle={`${totalSets} sets • ${totalReps} reps`}
            Icon={FitnessCenterIcon}
            gradient={primaryGradient}
            onClick={() => navigate("/workouts")}
            sparkData={recentCounts}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Calories Consumed"
            value={totalCalories}
            unit="kcal"
            subtitle={`${nutrition.length} meals tracked`}
            Icon={LocalDiningIcon}
            gradient={secondaryGradient}
            onClick={() => navigate("/nutrition")}
            sparkData={nutrition.slice(-7).map((n) => n.calories || 0)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Latest Progress"
            value={lastProgress ? lastProgress.value : "N/A"}
            unit={lastProgress ? lastProgress.unit || "" : ""}
            subtitle={lastProgress ? `Updated: ${new Date(lastProgress.date).toLocaleDateString()}` : "No recent progress"}
            Icon={TrendingUpIcon}
            gradient={infoGradient}
            onClick={() => navigate("/progress")}
            sparkData={progress.slice(-7).map((p) => (typeof p.value === "number" ? p.value : 0))}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" mb={1} sx={{ fontWeight: 800 }}>
            <FitnessCenterIcon sx={{ verticalAlign: "middle", mr: 1, color: theme.palette.primary.main }} />
            Recent Workout Activity
          </Typography>

          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: glassBackground,
              boxShadow: panelShadow,
            }}
          >
            {workouts.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography color="text.secondary" variant="h6">
                  No workouts yet — start logging your first session.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3, background: primaryGradient, textTransform: "none" }}
                  onClick={() => navigate("/workouts")}
                >
                  Add New Workout
                </Button>
              </Box>
            ) : (
              <Box>
                <TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow sx={{ background: isDark ? "rgba(255,255,255,0.03)" : "#f4f7fb" }}>
                        <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Load Progress</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {workouts.slice(0, 5).map((w) => {
                        const totalWeight = (Array.isArray(w.exercises) ? w.exercises : []).reduce(
                          (sum, e) => sum + (e.weight || 0) * (e.reps || 0) * (e.sets || 0),
                          0
                        );
                        const progressPercent = Math.min((totalWeight / 5000) * 100, 100);

                        return (
                          <TableRow
                            key={w._id}
                            sx={{
                              "&:hover": {
                                backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "#fbfbff",
                              },
                            }}
                          >
                            <TableCell sx={{ verticalAlign: "top", width: 260 }}>
                              <Typography sx={{ fontWeight: 700 }}>{w.title}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(w.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" color="text.primary">
                                {w.category}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ minWidth: 200 }}>
                              <LinearProgress
                                variant="determinate"
                                value={progressPercent}
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  background: isDark ? "rgba(255,255,255,0.06)" : "#e9f0ff",
                                  "& .MuiLinearProgress-bar": {
                                    background: primaryGradient,
                                  },
                                }}
                              />
                              <Typography variant="caption" sx={{ mt: 0.5, display: "block", fontWeight: 700 }}>
                                {Math.round(progressPercent)}% load
                              </Typography>
                            </TableCell>

                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Open Workout">
                                  <IconButton size="small" onClick={() => navigate(`/workouts/`)} color="primary">
                                    <ArrowForwardIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Analytics">
                                  <IconButton
                                    size="small"
                                    onClick={() => navigate(`/workouts/`)}
                                    color="primary"
                                  >
                                    <BarChartIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing latest {Math.min(5, workouts.length)} of {workouts.length} workouts
                  </Typography>

                  <Button variant="outlined" onClick={() => navigate("/workouts")} sx={{ textTransform: "none" }}>
                    View All Workouts
                  </Button>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 2.2, borderRadius: 3, background: glassBackground, boxShadow: panelShadow }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Quick Stats
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {totalWorkouts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Workouts
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {totalSets}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sets
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {totalReps}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reps
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {totalCalories}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    kcal
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <svg width="100%" height="48" viewBox="0 0 160 48" preserveAspectRatio="none">
                  <path d={makeSparklinePath(recentCounts, 160, 48)} fill="none" stroke={theme.palette.primary.main} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Box>
            </Card>

            <Card sx={{ p: 2.2, borderRadius: 3, background: glassBackground, boxShadow: panelShadow }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/nutrition")}
                  startIcon={<LocalDiningIcon />}
                  sx={{ background: secondaryGradient, color: "#fff", textTransform: "none", borderRadius: 2 }}
                >
                  Log Today's Meal
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/progress")}
                  startIcon={<TrendingUpIcon />}
                  sx={{ background: infoGradient, color: "#fff", textTransform: "none", borderRadius: 2 }}
                >
                  Record Progress
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/reports")}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  View Reports
                </Button>
              </Stack>
            </Card>

            <Card sx={{ p: 2, borderRadius: 3, background: glassBackground, boxShadow: panelShadow }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                Recent Progress
              </Typography>

              {progress.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No progress recorded yet.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {progress.slice(-5).reverse().map((p) => (
                    <Box key={p._id || p.date} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {p.label || p.type || "Progress"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(p.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>
                          {p.value}
                          {p.unit ? <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 4 }}>{p.unit}</span> : null}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.note ? p.note : ""}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, display: "flex", justifyContent: "center", gap: 3 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/nutrition")}
          startIcon={<LocalDiningIcon />}
          sx={{ background: secondaryGradient, color: "white", px: 4, py: 1.1, textTransform: "none", borderRadius: 2 }}
        >
          Log Today's Meal
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/progress")}
          startIcon={<TrendingUpIcon />}
          sx={{ background: infoGradient, color: "white", px: 4, py: 1.1, textTransform: "none", borderRadius: 2 }}
        >
          Record Progress
        </Button>
      </Box>
    </Box>
  );
}
