import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import api from "../api/axios";

export default function Progress() {
  const theme = useTheme();

  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    weight: "",
    chest: "",
    waist: "",
    arms: "",
    legs: "",
    runTime: "",
    maxLift: "",
  });

  const fetchProgress = async () => {
    try {
      const res = await api.get("/progress");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!/^[1-9][0-9]*$/.test(value) && value !== "") return;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidField = Object.keys(form).find(
      (key) => !form[key] || Number(form[key]) < 1
    );
    if (invalidField) {
      alert("All fields must be filled with numbers greater than 0. No 0 or special characters allowed.");
      return;
    }

    const payload = {
      weight: Number(form.weight),
      bodyMeasurements: {
        chest: Number(form.chest),
        waist: Number(form.waist),
        arms: Number(form.arms),
        legs: Number(form.legs),
      },
      performance: {
        runTime: Number(form.runTime),
        maxLift: Number(form.maxLift),
      },
    };

    try {
      if (editId) {
        const res = await api.put(`/progress/${editId}`, payload);
        setRecords(records.map((r) => (r._id === editId ? res.data : r)));
      } else {
        const res = await api.post("/progress", payload);
        setRecords([res.data, ...records]);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/progress/${id}`);
      setRecords(records.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setForm({
      weight: record.weight || "",
      chest: record.bodyMeasurements?.chest || "",
      waist: record.bodyMeasurements?.waist || "",
      arms: record.bodyMeasurements?.arms || "",
      legs: record.bodyMeasurements?.legs || "",
      runTime: record.performance?.runTime || "",
      maxLift: record.performance?.maxLift || "",
    });
    setOpen(true);
  };

  const handleOpen = () => {
    setEditId(null);
    setForm({
      weight: "",
      chest: "",
      waist: "",
      arms: "",
      legs: "",
      runTime: "",
      maxLift: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const chartLineColor = theme.palette.charts?.line || theme.palette.primary.main;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={4} sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
        <FitnessCenterIcon sx={{ mr: 1, verticalAlign: "middle", color: chartLineColor }} />
        Progress Tracking
      </Typography>

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>
        Add Progress
      </Button>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#f8f9fb",
        }}
      >
        <Table>
          <TableHead
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : "#e8e8e8",
            }}
          >
            <TableRow>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Weight</b></TableCell>
              <TableCell><b>Measurements</b></TableCell>
              <TableCell><b>Performance</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No progress yet.</TableCell>
              </TableRow>
            )}

            {records.map((r) => (
              <TableRow
                key={r._id}
                hover
                sx={{
                  "&:hover": {
                    background:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[700]
                        : "#f1f1f1",
                  },
                }}
              >
                <TableCell>
                  {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                </TableCell>

                <TableCell>
                  <Chip
                    label={`${r.weight} kg`}
                    sx={{
                      background:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : theme.palette.primary.light,
                      color: theme.palette.getContrastText(
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : theme.palette.primary.light
                      ),
                    }}
                  />
                </TableCell>

                <TableCell>
                  Chest: {r.bodyMeasurements?.chest} cm<br />
                  Waist: {r.bodyMeasurements?.waist} cm<br />
                  Arms: {r.bodyMeasurements?.arms} cm<br />
                  Legs: {r.bodyMeasurements?.legs} cm
                </TableCell>

                <TableCell>
                  Run: {r.performance?.runTime} min<br />
                  Max Lift: {r.performance?.maxLift} kg
                </TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(r)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(r._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CHARTS */}
      <Box mt={5}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          Progress Charts
        </Typography>

        {/* Weight Chart */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" mb={1}>
            Weight Over Time
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={records}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString()}
                stroke={theme.palette.text.primary}
              />
              <YAxis stroke={theme.palette.text.primary} />
              <Tooltip
                labelFormatter={(l) => new Date(l).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Body Measurements Chart */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" mb={1}>
            Body Measurements
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={records}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString()}
                stroke={theme.palette.text.primary}
              />
              <YAxis stroke={theme.palette.text.primary} />
              <Tooltip labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Line dataKey="bodyMeasurements.chest" name="Chest" stroke="#ff4b7b" />
              <Line dataKey="bodyMeasurements.waist" name="Waist" stroke="#ff9800" />
              <Line dataKey="bodyMeasurements.arms" name="Arms" stroke="#4caf50" />
              <Line dataKey="bodyMeasurements.legs" name="Legs" stroke="#9c27b0" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Performance Bar Chart */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" mb={1}>
            Performance Progress
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={records}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString()}
                stroke={theme.palette.text.primary}
              />
              <YAxis stroke={theme.palette.text.primary} />
              <Tooltip labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Bar
                dataKey="performance.runTime"
                name="Run Time (min)"
                fill="#03a9f4"
              />
              <Bar
                dataKey="performance.maxLift"
                name="Max Lift (kg)"
                fill="#8bc34a"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* MODAL */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { backgroundColor: theme.palette.background.paper },
        }}
      >
        <DialogTitle>{editId ? "Update Progress" : "Add Progress"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {["weight", "chest", "waist", "arms", "legs", "runTime", "maxLift"].map(
              (field) => (
                <Grid item xs={6} key={field}>
                  <TextField
                    label={field.toUpperCase()}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
              )
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
