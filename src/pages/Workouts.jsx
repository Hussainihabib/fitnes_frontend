// Workouts.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";

import api from "../api/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// --- Dropdown options (modify if you want) ---
const CATEGORY_OPTIONS = [
  "Strength",
  "Cardio",
  "CrossFit",
  "Flexibility",
  "Yoga",
  "HIIT",
];

const TAG_OPTIONS = [
  "Chest",
  "Back",
  "Arms",
  "Legs",
  "Shoulders",
  "Abs",
  "Warmup",
];

const EXERCISE_SUGGESTIONS = [
  "Bench Press",
  "Deadlift",
  "Squat",
  "Shoulder Press",
  "Bicep Curl",
  "Tricep Pushdown",
  "Pull Ups",
  "Running",
  "Cycling",
];

export default function Workouts() {
  const theme = useTheme();

  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "" },
  ]);

  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, text: "", type: "" });
  const [loadingSave, setLoadingSave] = useState(false);

  // Load workouts
  const loadWorkouts = async () => {
    try {
      const res = await api.get("/workouts");
      setWorkouts(res.data);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setSnackbar({ open: true, text: "Failed to load workouts", type: "error" });
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setCategory("");
    setTags([]);
    setExercises([{ name: "", sets: "", reps: "", weight: "" }]);
    setError("");
  };

  const openAdd = () => {
    resetForm();
    setOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setOpen(false);
  };

  const addExerciseRow = () =>
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);

  const removeExerciseRow = (i) => {
    if (exercises.length === 1) return;
    setExercises(exercises.filter((_, idx) => idx !== i));
  };

  // setExerciseField with checks:
  // - For numeric fields: disallow spaces, allow only digits and decimal if you want (we'll keep integers)
  // - For name: allow free text (but will check trim on submit)
  const setExerciseField = (i, field, val) => {
    const temp = [...exercises];

    if (field === "name") {
      // allow typing (freeSolo) but prevent leading/trailing only spaces on change? we'll set raw value; final validation on submit
      temp[i][field] = val;
    } else {
      // numeric field - disallow spaces anywhere
      if (/\s/.test(val)) return;
      // allow empty string while typing
      if (val === "") {
        temp[i][field] = "";
      } else {
        // convert to number string (user may type '0' but we will block 0 at validation)
        // prevent non-numeric characters (allow only digits)
        // allow numbers like "10"
        if (!/^\d+$/.test(val)) return;
        temp[i][field] = val;
      }
    }

    setExercises(temp);
  };

  // Edit handler
  const onEdit = (w) => {
    setEditId(w._id);
    setTitle(w.title || "");
    setCategory(w.category || "");
    setTags(w.tags || []);
    setExercises(
      w.exercises && w.exercises.length
        ? w.exercises.map((ex) => ({
            name: ex.name ?? "",
            sets: ex.sets != null ? String(ex.sets) : "",
            reps: ex.reps != null ? String(ex.reps) : "",
            weight: ex.weight != null ? String(ex.weight) : "",
          }))
        : [{ name: "", sets: "", reps: "", weight: "" }]
    );
    setOpen(true);
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/workouts/${id}`);
      setSnackbar({ open: true, text: "Workout deleted", type: "success" });
      loadWorkouts();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, text: "Failed to delete", type: "error" });
    }
  };

  const markComplete = async (id) => {
    try {
      await api.put(`/workouts/complete/${id}`);
      setSnackbar({ open: true, text: "Workout marked complete", type: "success" });
      loadWorkouts();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, text: "Failed to mark complete", type: "error" });
    }
  };

  // Validation function: ensures no-only-space for text fields, numbers >=1 for numeric fields
  const validateForm = () => {
    if (!title || !title.trim()) return "Title is required and cannot be spaces only";
    if (!category || !String(category).trim()) return "Please select a category";
    if (!tags || tags.length === 0) return "Please select at least one tag";

    if (!exercises || exercises.length === 0) return "Add at least one exercise";

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (!ex.name || !String(ex.name).trim()) return `Exercise #${i + 1}: name is required`;
      if (ex.sets === "" || ex.sets == null) return `Exercise #${i + 1}: sets is required`;
      if (ex.reps === "" || ex.reps == null) return `Exercise #${i + 1}: reps is required`;
      if (ex.weight === "" || ex.weight == null) return `Exercise #${i + 1}: weight is required`;

      // numeric checks
      if (!/^\d+$/.test(String(ex.sets))) return `Exercise #${i + 1}: sets must be a whole number`;
      if (!/^\d+$/.test(String(ex.reps))) return `Exercise #${i + 1}: reps must be a whole number`;
      if (!/^\d+$/.test(String(ex.weight))) return `Exercise #${i + 1}: weight must be a whole number`;

      const setsN = Number(ex.sets);
      const repsN = Number(ex.reps);
      const weightN = Number(ex.weight);

      if (setsN < 1) return `Exercise #${i + 1}: sets must be at least 1`;
      if (repsN < 1) return `Exercise #${i + 1}: reps must be at least 1`;
      if (weightN < 1) return `Exercise #${i + 1}: weight must be at least 1`;
    }

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    // Build payload in the format backend expects: convert numeric strings to numbers
    const payload = {
      title: title.trim(),
      category: category,
      tags: tags,
      exercises: exercises.map((ex) => ({
        name: ex.name.trim(),
        sets: Number(ex.sets),
        reps: Number(ex.reps),
        weight: Number(ex.weight),
      })),
    };

    setLoadingSave(true);
    try {
      if (editId) {
        await api.put(`/workouts/${editId}`, payload);
        setSnackbar({ open: true, text: "Workout updated", type: "success" });
      } else {
        await api.post("/workouts", payload);
        setSnackbar({ open: true, text: "Workout added", type: "success" });
      }
      closeModal();
      loadWorkouts();
    } catch (err) {
      console.error("Save error:", err);
      // try to show backend message if available
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save workout";
      setError(msg);
      setSnackbar({ open: true, text: msg, type: "error" });
    } finally {
      setLoadingSave(false);
    }
  };

  const filteredWorkouts = useMemo(() => {
  const query = search.trim().toLowerCase();
  if (!query) return workouts;

  return workouts.filter((w) => {
    // Title, category, tags
    const basicMatch =
      w.title.toLowerCase().includes(query) ||
      w.category.toLowerCase().includes(query) ||
      (w.tags || []).some((t) => t.toLowerCase().includes(query));

    // Exercises
    const exerciseMatch = (w.exercises || []).some((ex) =>
      Object.values(ex).some((val) => String(val).toLowerCase().includes(query))
    );

    return basicMatch || exerciseMatch;
  });
}, [search, workouts]);


  const exerciseHistory = filteredWorkouts.flatMap((w) =>
    (w.exercises || []).map((ex) => ({
      date: new Date(w.createdAt || w.date).toLocaleDateString(),
      name: ex.name,
      weight: ex.weight,
    }))
  );

  const weightProgressData = exerciseHistory;

  const frequencyMap = {};
  filteredWorkouts.forEach((w) => {
    const d = new Date(w.createdAt || w.date).toLocaleDateString();
    frequencyMap[d] = (frequencyMap[d] || 0) + 1;
  });

  const frequencyData = Object.keys(frequencyMap).map((d) => ({ date: d, count: frequencyMap[d] }));

  const chartLineColor = theme.palette.charts?.line || theme.palette.primary.main;
  const chartBarColor = theme.palette.charts?.bar || theme.palette.primary.main;
  const chartGridColor = theme.palette.charts?.grid || alpha(theme.palette.text.primary, 0.1);
  const textColor = theme.palette.text.primary;

  // disable submit if invalid (quick UX improvement)
  const isSaveDisabled = !!validateForm();

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ minHeight: "100vh", background: theme.palette.background.default }}>
      {/* --- Heading --- */}
      <Typography variant="h4" mb={4} sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
        <FitnessCenterIcon sx={{ mr: 1, verticalAlign: "middle", color: chartLineColor }} />
        Workout Tracking
      </Typography>

      {/* --- Search & Add --- */}
      <Grid container spacing={2} alignItems="center" mb={4}>
        <Grid item xs={12} sm={8}>
          <TextField
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />,
              sx: { borderRadius: 3, background: theme.palette.background.paper },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            size="large"
            sx={{ fontWeight: "bold", borderRadius: 3, py: 1.5, px: 3 }}
          >
            New Workout
          </Button>
        </Grid>
      </Grid>

      {/* --- Charts --- */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: theme.palette.text.primary }}>
          Performance Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={3} fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                Weight Progress (LBS/KG)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightProgressData}>
                  <CartesianGrid stroke={chartGridColor} strokeDasharray="5 5" />
                  <XAxis
                    dataKey="date"
                    stroke={textColor}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis stroke={textColor} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${chartLineColor}`, borderRadius: 8 }}
                    labelStyle={{ color: chartLineColor, fontWeight: "bold" }}
                    itemStyle={{ color: textColor }}
                  />
                  <Line type="monotone" dataKey="weight" stroke={chartLineColor} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: chartLineColor, stroke: theme.palette.background.paper, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={3} fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                Weekly Frequency
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={frequencyData}>
                  <CartesianGrid stroke={chartGridColor} strokeDasharray="5 5" />
                  <XAxis dataKey="date" stroke={textColor} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} angle={-25} textAnchor="end" height={50} />
                  <YAxis stroke={textColor} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${chartBarColor}`, borderRadius: 8 }}
                    labelStyle={{ color: chartBarColor, fontWeight: "bold" }}
                    itemStyle={{ color: textColor }}
                  />
                  <Bar dataKey="count" fill={chartBarColor} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* --- Workouts Table --- */}
      <Typography variant="h5" fontWeight="bold" my={3} sx={{ color: theme.palette.text.primary }}>
        My Workouts
      </Typography>
     <TableContainer
  component={Card}
  sx={{
    borderRadius: 4,
    overflowX: "auto", // Horizontal scroll on small screens
    width: "100%",
  }}
>
  <Table sx={{ minWidth: 650 }}>
    <TableHead
      sx={{
        background: alpha(theme.palette.primary.main, 0.1),
        "& .MuiTableCell-head": { fontWeight: "bold", color: theme.palette.text.primary, py: 2 },
      }}
    >
      <TableRow>
        <TableCell sx={{ minWidth: 150 }}>Title</TableCell>
        <TableCell sx={{ minWidth: 100 }}>Category</TableCell>
        <TableCell sx={{ minWidth: 150 }}>Tags</TableCell>
        <TableCell sx={{ minWidth: 250 }}>Exercises</TableCell>
        <TableCell align="center" sx={{ minWidth: 150 }}>Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredWorkouts.map((w) => (
        <TableRow
          key={w._id}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
            "&:hover": { background: alpha(theme.palette.action.hover, 0.5) },
          }}
        >
          <TableCell component="th" scope="row">
            <Typography fontWeight="bold">{w.title}</Typography>
          </TableCell>
          <TableCell>{w.category}</TableCell>
          <TableCell>
            {(w.tags || []).map((t, i) => (
              <Chip
                key={i}
                label={t}
                size="small"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  backgroundColor: alpha(chartLineColor, 0.1),
                  color: chartLineColor,
                  fontWeight: 600,
                }}
              />
            ))}
          </TableCell>
          <TableCell>
            {(w.exercises || []).map((ex, i) => (
              <Typography key={i} variant="body2" sx={{ my: 0.5 }}>
                <strong>{ex.name}</strong> — {ex.sets}×{ex.reps} @ {ex.weight}kg
              </Typography>
            ))}
          </TableCell>
          <TableCell align="center">
            <IconButton color="primary" onClick={() => onEdit(w)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(w._id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="success" onClick={() => markComplete(w._id)}>
              <CheckCircleIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* --- Modal --- */}
      <Dialog fullWidth maxWidth="md" open={open} onClose={closeModal}>
        <DialogTitle sx={{ fontWeight: "bold" }}>{editId ? "Edit Workout" : "Add Workout"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  inputProps={{ maxLength: 150 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    input={<OutlinedInput label="Category" />}
                    sx={{ minWidth: 220 }}
                  >
                    <MenuItem value="">
                      <em>-- Select Category --</em>
                    </MenuItem>
                    {CATEGORY_OPTIONS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    multiple
                    value={tags}
                    onChange={(e) => {
                      const value = e.target.value;
                      // ensure array of strings
                      setTags(typeof value === "string" ? value.split(",") : value);
                    }}
                    sx={{ minWidth: 220 }}

                    input={<OutlinedInput label="Tags" />}
                    renderValue={(selected) => (selected || []).join(", ")}
                  >
                    {TAG_OPTIONS.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Exercises
                </Typography>

                {exercises.map((ex, idx) => (
                  <Grid
                    container
                    spacing={2}
                    key={idx}
                    alignItems="center"
                    sx={{
                      mb: 1,
                      p: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                    }}
                  >
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        freeSolo
                        options={EXERCISE_SUGGESTIONS}
                        value={ex.name}
                        onChange={(event, newValue) => {
                          // from option select
                          setExerciseField(idx, "name", newValue || "");
                        }}
                        onInputChange={(event, newInputValue) => {
                          // when typing
                          setExerciseField(idx, "name", newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Name" fullWidth size="small" />
                        )}
                        disableClearable={false}
                    sx={{ minWidth: 220 }}

                      />
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <TextField
                        label="Sets"
                        type="number"
                        fullWidth
                        size="small"
                        value={ex.sets}
                        onChange={(e) => setExerciseField(idx, "sets", e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        label="Reps"
                        type="number"
                        fullWidth
                        size="small"
                        value={ex.reps}
                        onChange={(e) => setExerciseField(idx, "reps", e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        label="Weight"
                        type="number"
                        fullWidth
                        size="small"
                        value={ex.weight}
                        onChange={(e) => setExerciseField(idx, "weight", e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <IconButton color="error" onClick={() => removeExerciseRow(idx)} disabled={exercises.length === 1}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                <Button startIcon={<AddIcon />} onClick={addExerciseRow} variant="outlined" sx={{ mt: 1, borderRadius: 2 }}>
                  Add Exercise
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={onSubmit} sx={{ fontWeight: "bold" }} disabled={loadingSave}>
            {loadingSave ? "Saving..." : editId ? "Update Workout" : "Add Workout"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Snackbar --- */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: "100%" }}>
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
