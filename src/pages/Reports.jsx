import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  useTheme,
  Divider,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DownloadIcon from "@mui/icons-material/Download";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EventNoteIcon from "@mui/icons-material/EventNote";

import { useAuth } from "../context/AuthContext";
import { exportCSV, exportPDF } from "../utils/export";
import api from "../api/axios";

// Analuticc card
const StatCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      minHeight: 120,
      display: "flex",
      alignItems: "center",
      boxShadow: 6,
      borderRadius: 3,
      transition: "transform 0.3s",
      "&:hover": { transform: "translateY(-5px)" },
    }}
  >
    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
      <Box sx={{ color: color, mb: 1 }}>{icon}</Box>
      <Typography variant="h5" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export default function Reports() {
  const theme = useTheme();
  const { user } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  // load data from api 
  useEffect(() => {
    const loadData = async () => {
      try {
        const [workoutRes, nutritionRes] = await Promise.all([
          api.get("/workouts"),
          api.get("/nutrition"),
        ]);

        setWorkouts(
          Array.isArray(workoutRes.data)
            ? workoutRes.data
            : workoutRes.data?.data || []
        );
        setNutrition(
          Array.isArray(nutritionRes.data)
            ? nutritionRes.data
            : nutritionRes.data?.data || []
        );
      } catch (err) {
        console.error(err);
        setWorkouts([]);
        setNutrition([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // filter date
  const filterByDate = (data) => {
    return data.filter((item) => {
      const dateString = item.date || item.createdAt;
      if (!dateString) return false;

      const itemDate = new Date(dateString.split("T")[0]);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      return true;
    });
  };

  const filteredWorkouts = useMemo(() => filterByDate(workouts), [
    workouts,
    fromDate,
    toDate,
  ]);
  const filteredNutrition = useMemo(() => filterByDate(nutrition), [
    nutrition,
    fromDate,
    toDate,
  ]);

  // work analytic
  const workoutAnalytics = useMemo(() => {
    let totalWorkouts = filteredWorkouts.length;
    let totalExercises = 0;
    let totalSets = 0;
    let totalReps = 0;

    filteredWorkouts.forEach((w) => {
      (w.exercises || []).forEach((ex) => {
        totalExercises += 1;
        totalSets += Number(ex.sets || 0);
        totalReps += Number(ex.reps || 0);
      });
    });

    return { totalWorkouts, totalExercises, totalSets, totalReps };
  }, [filteredWorkouts]);

  const nutritionAnalytics = useMemo(() => {
    let totalCalories = 0,
      totalProtein = 0,
      totalCarbs = 0,
      totalFat = 0;

    filteredNutrition.forEach((n) => {
      (n.foodItems || []).forEach((f) => {
        totalCalories += Number(f.calories || 0);
        totalProtein += Number(f.protein || 0);
        totalCarbs += Number(f.carbs || 0);
        totalFat += Number(f.fat || 0);
      });
    });

    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
    };
  }, [filteredNutrition]);

  // workout export
  const workoutExportData = filteredWorkouts.map((w) => ({
    Title: w.title,
    Category: w.category,
    Exercises: (w.exercises || [])
      .map((ex) => `${ex.name} ${ex.sets}x${ex.reps} @${ex.weight}kg`)
      .join("; "),
    Date: new Date(w.date || w.createdAt).toLocaleDateString(),
  }));

  const nutritionExportData = filteredNutrition.map((n) => ({
    Meal: n.mealType,
    Foods: (n.foodItems || []).map((f) => f.name).join(", "),
    Calories: (n.foodItems || []).reduce(
      (s, f) => s + Number(f.calories || 0),
      0
    ),
    Protein: (n.foodItems || []).reduce(
      (s, f) => s + Number(f.protein || 0),
      0
    ),
    Carbs: (n.foodItems || []).reduce((s, f) => s + Number(f.carbs || 0), 0),
    Fat: (n.foodItems || []).reduce((s, f) => s + Number(f.fat || 0), 0),
    Date: new Date(n.date).toLocaleDateString(),
  }));

  if (loading) return <Typography>Loading Reports...</Typography>;

  return (
    <Box p={4} sx={{ backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        color={theme.palette.primary.main}
      >
        <AnalyticsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Fitness Reports & Analytics
      </Typography>

      {/* Date Filter */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <EventNoteIcon sx={{ mr: 1 }} />
          Select Date Range
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="To Date"
              type="date"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Clear Filter
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Workout Analytics */}
      <Box mb={5}>
        <Typography variant="h4" gutterBottom>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          Workout Summary ({filteredWorkouts.length})
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Workouts"
              value={workoutAnalytics.totalWorkouts}
              icon={<FitnessCenterIcon />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Exercises"
              value={workoutAnalytics.totalExercises}
              icon={<FitnessCenterIcon />}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Sets"
              value={workoutAnalytics.totalSets}
              icon={<FitnessCenterIcon />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Reps"
              value={workoutAnalytics.totalReps}
              icon={<FitnessCenterIcon />}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Nutrition Analytics */}
      <Box mb={5}>
        <Typography variant="h4" gutterBottom>
          <RestaurantIcon sx={{ mr: 1 }} />
          Nutrition Summary ({filteredNutrition.length})
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Calories"
              value={nutritionAnalytics.totalCalories}
              icon={<RestaurantIcon />}
              color={theme.palette.secondary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Protein"
              value={nutritionAnalytics.totalProtein}
              icon={<RestaurantIcon />}
              color={theme.palette.error.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Carbs"
              value={nutritionAnalytics.totalCarbs}
              icon={<RestaurantIcon />}
              color={theme.palette.info.light}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Fat"
              value={nutritionAnalytics.totalFat}
              icon={<RestaurantIcon />}
              color={theme.palette.success.light}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Export Buttons */}
      <Box>
        <Typography variant="h5" gutterBottom>
          <DownloadIcon sx={{ mr: 1 }} />
          Export Reports
        </Typography>
        <Grid container spacing={2}>
          {/* CSV */}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              disabled={!user}
              onClick={() =>
                exportCSV(
                  [...workoutExportData, ...nutritionExportData, user],
                  "Fitness_Report_Combined.csv"
                )
              }
            >
              Export Combined CSV
            </Button>
          </Grid>

          {/* PDF */}
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              disabled={!user}
              onClick={() =>
                exportPDF(
                  workoutExportData,
                  nutritionExportData,
                  fromDate,
                  toDate,
                  user
                )
              }
            >
              Export PDF Report
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
