import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../api/axios";

export default function Nutrition() {
  const theme = useTheme();

  const [meals, setMeals] = useState([]);
  const [mealType, setMealType] = useState("");
  const [foodItems, setFoodItems] = useState([{ name: "", calories: "", protein: "", carbs: "", fat: "" }]);
  const [editId, setEditId] = useState(null);

  const [qSearch, setQSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, text: "", type: "success" });

  const COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.error.main];

  const loadMeals = async () => {
    try {
      const res = await api.get("/nutrition");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setMeals(data);
    } catch (err) {
      console.error("loadMeals", err);
      setMeals([]);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const addFoodRow = () =>
    setFoodItems([...foodItems, { name: "", calories: "", protein: "", carbs: "", fat: "" }]);

  const removeFoodRow = (i) =>
    setFoodItems(foodItems.filter((_, idx) => idx !== i));

  const setFoodField = (i, field, val) => {
    const upd = [...foodItems];

    if (field === "name") {
      if (/[^a-zA-Z ]/.test(val)) return; // only alphabets
      upd[i][field] = val;
    } else {
      if (!/^\d*$/.test(val)) return; // allow only digits
      upd[i][field] = val; // empty allowed while typing
    }

    setFoodItems(upd);
  };

 const onSubmit = async (e) => {
  e?.preventDefault?.();

  // Meal Type Validation: Alphabet only + not empty
  if (!mealType.trim() || /[^a-zA-Z ]/.test(mealType)) {
    setSnackbar({ open: true, text: "Meal type required (alphabets only)", type: "error" });
    return;
  }

  // Food Items Validation
  for (let i = 0; i < foodItems.length; i++) {
    const f = foodItems[i];

    // Name alphabet only + required
    if (!f.name.trim()) {
      setSnackbar({ open: true, text: `Food name required for item ${i + 1}`, type: "error" });
      return;
    }

    // Must be number AND ≥ 1
    if (
      Number(f.calories) < 1 ||
      Number(f.protein) < 1 ||
      Number(f.carbs) < 1 ||
      Number(f.fat) < 1
    ) {
      setSnackbar({
        open: true,
        text: `Calories, Protein, Carbs & Fat must be at least 1 (item ${i + 1})`,
        type: "error",
      });
      return;
    }
  }

  const payload = {
    mealType: mealType.trim(),
    foodItems: foodItems.map((f) => ({
      name: f.name.trim(),
      calories: Number(f.calories),
      protein: Number(f.protein),
      carbs: Number(f.carbs),
      fat: Number(f.fat),
    })),
  };

  try {
    let saved;
    if (editId) {
      const res = await api.put(`/nutrition/${editId}`, payload);
      saved = res.data?.data || res.data;
      setMeals(meals.map((m) => (m._id === editId ? saved : m)));
      setSnackbar({ open: true, text: "Meal updated", type: "success" });
    } else {
      const res = await api.post("/nutrition", payload);
      saved = res.data?.data || res.data;
      setMeals([saved, ...meals]);
      setSnackbar({ open: true, text: "Meal added", type: "success" });
    }

    setMealType("");
    setFoodItems([{ name: "", calories: "", protein: "", carbs: "", fat: "" }]);
    setEditId(null);

  } catch (err) {
    console.error("save meal", err);
    setSnackbar({ open: true, text: "Failed to save meal", type: "error" });
  }
};


  const onEdit = (m) => {
    setEditId(m._id);
    setMealType(m.mealType || "");
    setFoodItems(
      m.foodItems?.length
        ? m.foodItems.map((f) => ({
            name: f.name || "",
            calories: String(f.calories) || "",
            protein: String(f.protein) || "",
            carbs: String(f.carbs) || "",
            fat: String(f.fat) || "",
          }))
        : [{ name: "", calories: "", protein: "", carbs: "", fat: "" }]
    );
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/nutrition/${id}`);
      setMeals(meals.filter((m) => m._id !== id));
      setSnackbar({ open: true, text: "Meal deleted", type: "success" });
    } catch (err) {
      console.error("delete meal", err);
      setSnackbar({ open: true, text: "Failed to delete meal", type: "error" });
    }
  };

  const filteredMeals = useMemo(() => {
    const q = qSearch.trim().toLowerCase();
    if (!q) return meals;
    return meals.filter((m) => {
      if ((m.mealType || "").toLowerCase().includes(q)) return true;
      if ((m.foodItems || []).some((f) =>
        Object.values(f).some((v) => String(v).toLowerCase().includes(q))
      )) return true;
      return false;
    });
  }, [qSearch, meals]);

  const analytics = useMemo(() => {
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    const caloriesByDay = {};
    let highestMeal = null;

    meals.forEach((m) => {
      const day = new Date(m.date || m.createdAt || Date.now()).toISOString().slice(0, 10);
      const mealTotalCal = (m.foodItems || []).reduce((s, f) => s + Number(f.calories || 0), 0);
      const mealTotalProt = (m.foodItems || []).reduce((s, f) => s + Number(f.protein || 0), 0);
      const mealTotalCarb = (m.foodItems || []).reduce((s, f) => s + Number(f.carbs || 0), 0);
      const mealTotalFat = (m.foodItems || []).reduce((s, f) => s + Number(f.fat || 0), 0);

      caloriesByDay[day] = (caloriesByDay[day] || 0) + mealTotalCal;
      totalCalories += mealTotalCal;
      totalProtein += mealTotalProt;
      totalCarbs += mealTotalCarb;
      totalFat += mealTotalFat;

      if (!highestMeal || mealTotalCal > highestMeal.total) highestMeal = { meal: m, total: mealTotalCal };
    });

    const dailyCaloriesTrend = Object.keys(caloriesByDay)
      .sort()
      .map((d) => ({ date: d, calories: caloriesByDay[d] }));

    const macros = [
      { name: "Protein", value: Math.round(totalProtein) },
      { name: "Carbs", value: Math.round(totalCarbs) },
      { name: "Fat", value: Math.round(totalFat) },
    ];

    return {
      totalMeals: meals.length,
      totalCalories,
      avgPerMeal: meals.length ? Math.round(totalCalories / meals.length) : 0,
      highestMeal: highestMeal ? { meal: highestMeal.meal, calories: highestMeal.total } : null,
      dailyCaloriesTrend,
      macros,
    };
  }, [meals]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={4} sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
        <FitnessCenterIcon sx={{ mr: 1, verticalAlign: "middle", color: theme.palette.primary.main }} />
        Nutrition Tracking
      </Typography>

      <Card sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by Meal, Food, Calories, Protein, Carbs, Fat..."
          value={qSearch}
          onChange={(e) => setQSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" mb={2}>{editId ? "Edit Meal" : "Add Meal"}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Meal Type"
              value={mealType}
              onChange={(e) => {
                if (/[^a-zA-Z ]/.test(e.target.value)) return;
                setMealType(e.target.value);
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" mb={1}>Food items</Typography>
            {foodItems.map((f, i) => (
              <Grid container spacing={1} key={i} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField label="Name" fullWidth value={f.name} onChange={(e) => setFoodField(i, "name", e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                  <TextField label="Calories" fullWidth type="text" value={f.calories} onChange={(e) => setFoodField(i, "calories", e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                  <TextField label="Protein" fullWidth type="text" value={f.protein} onChange={(e) => setFoodField(i, "protein", e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                  <TextField label="Carbs" fullWidth type="text" value={f.carbs} onChange={(e) => setFoodField(i, "carbs", e.target.value)} />
                </Grid>
                <Grid item xs={1}>
                  <TextField label="Fat" fullWidth type="text" value={f.fat} onChange={(e) => setFoodField(i, "fat", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton color="error" onClick={() => removeFoodRow(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={addFoodRow}>
              Add Food
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={onSubmit}>
              {editId ? "Update Meal" : "Add Meal"}
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" mb={1}>Daily Calories</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={analytics.dailyCaloriesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke={theme.palette.primary.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" mb={1}>Macro Distribution</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={analytics.macros} dataKey="value" nameKey="name" outerRadius={80} label>
                    {analytics.macros.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Meal</TableCell>
                  <TableCell>Food Items</TableCell>
                  <TableCell>Total Cal</TableCell>
                  <TableCell>Protein</TableCell>
                  <TableCell>Carbs</TableCell>
                  <TableCell>Fat</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMeals.map((m) => {
                  const totalCal = (m.foodItems || []).reduce((s, f) => s + Number(f.calories), 0);
                  const totalProt = (m.foodItems || []).reduce((s, f) => s + Number(f.protein), 0);
                  const totalCarb = (m.foodItems || []).reduce((s, f) => s + Number(f.carbs), 0);
                  const totalFat = (m.foodItems || []).reduce((s, f) => s + Number(f.fat), 0);
                  return (
                    <TableRow key={m._id}>
                      <TableCell>{m.mealType}</TableCell>
                      <TableCell>
                        {(m.foodItems || []).map((f, idx) => (
                          <div key={idx}>{f.name} — {f.calories} cal</div>
                        ))}
                      </TableCell>
                      <TableCell>{totalCal}</TableCell>
                      <TableCell>{totalProt}</TableCell>
                      <TableCell>{totalCarb}</TableCell>
                      <TableCell>{totalFat}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => onEdit(m)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => onDelete(m._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredMeals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No meals found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
