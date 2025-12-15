import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { loadAlerts, createAlert, deleteAlert, updateAlert } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";

export default function Alerts() {
  const userId = localStorage.getItem("userId");
  const { notifyReminder } = useContext(NotificationContext);

  const initialReminderState = {
    type: "Workout",
    title: "",
    date: "",
    time: "",
    repeat: "Daily",
  };

  const [reminder, setReminder] = useState(initialReminderState);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const showSnack = (msg, type = "info") => setSnack({ open: true, message: msg, severity: type });
  const closeSnack = () => setSnack(prev => ({ ...prev, open: false }));

  const loadReminders = async () => {
    if (!userId) {
      setList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await loadAlerts(userId);
      setList(data || []);
    } catch (err) {
      showSnack("Failed to load reminders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      for (const r of list) {
        const [hour, minute] = r.time.split(":").map(Number);
        const isTodayOrDaily = r.repeat === "Daily" || r.date === today;
        const isTimeMatch = now.getHours() === hour && now.getMinutes() === minute;

        if (isTodayOrDaily && isTimeMatch) {
          showSnack(`Reminder: ${r.title}`, "info");

          await notifyReminder(r, "timeTriggered");
fetchNotifications(); 

        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [list, notifyReminder]);

  const handleSave = async () => {
    if (!reminder.title || !reminder.time) {
      showSnack("Title & Time required!", "error");
      return;
    }
    if (!userId) {
      showSnack("User not logged in.", "error");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateAlert(editingId, { ...reminder, user: userId });
        showSnack("Reminder updated!", "success");
        await notifyReminder(reminder, "updated");
      } else {
        await createAlert({ ...reminder, user: userId });
        showSnack("Reminder added!", "success");
        await notifyReminder(reminder, "added");
      }

      setReminder(initialReminderState);
      setEditingId(null);
      await loadReminders();
    } catch (err) {
      console.error(err);
      showSnack("Error saving reminder!", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    setIsDeleting(prev => ({ ...prev, [id]: true }));
    try {
      await deleteAlert(id);
      setList(prev => prev.filter(r => r._id !== id));
      showSnack("Deleted!", "success");
    } catch (err) {
      showSnack("Delete failed!", "error");
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  const startEdit = (r) => {
    setReminder({
      type: r.type ?? "Workout",
      title: r.title ?? "",
      date: r.date ? new Date(r.date).toISOString().split("T")[0] : "",
      time: r.time ?? "",
      repeat: r.repeat ?? "Daily",
    });
    setEditingId(r._id);
    showSnack("Editing mode. Update and save.", "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setReminder(initialReminderState);
    showSnack("Edit cancelled", "info");
  };

  if (loading) return <Box p={4}><CircularProgress /></Box>;

  return (
    <Box maxWidth={800} mx="auto" mt={3}>
      <Typography variant="h5" mb={2}>
        {editingId ? "Edit Reminder" : "Add New Reminder"}
      </Typography>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity} onClose={closeSnack} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Type" value={reminder.type}
                onChange={(e) => setReminder(prev => ({ ...prev, type: e.target.value }))}>
                <MenuItem value="Workout">Workout</MenuItem>
                <MenuItem value="Meal">Meal</MenuItem>
                <MenuItem value="Goal">Goal</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Repeat" value={reminder.repeat}
                onChange={(e) => setReminder(prev => ({ ...prev, repeat: e.target.value }))}>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" value={reminder.title}
                onChange={(e) => setReminder(prev => ({ ...prev, title: e.target.value }))}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" label="Date (optional)" InputLabelProps={{ shrink: true }}
                value={reminder.date} onChange={(e) => setReminder(prev => ({ ...prev, date: e.target.value }))}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth required type="time" label="Time" InputLabelProps={{ shrink: true }}
                value={reminder.time} onChange={(e) => setReminder(prev => ({ ...prev, time: e.target.value }))}/>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                {editingId && <Button variant="outlined" color="error" onClick={cancelEdit}>Cancel Edit</Button>}
                <Button variant="contained" onClick={handleSave} disabled={isSaving}
                  startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}>
                  {editingId ? "Update Reminder" : "Save Reminder"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" mb={2}>Saved Reminders ({list.length})</Typography>
      <List component={Card}>
        {list.length === 0 ? (
          <CardContent><Typography>No reminders found.</Typography></CardContent>
        ) : (
          list.map(r => (
            <ListItem key={r._id} divider>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography fontWeight={600} mr={1}>{r.title}</Typography>
                    <Chip label={r.repeat} size="small" sx={{ mr: 1 }} />
                    <Chip label={r.type} size="small" />
                  </Box>
                }
                secondary={
                  <Typography variant="body2">
                    ⏰ {r.time}{r.date && <span style={{ marginLeft: 16 }}>🗓 {new Date(r.date).toLocaleDateString()}</span>}
                  </Typography>
                }
              />
              <IconButton color="primary" sx={{ mr: 1 }} onClick={() => startEdit(r)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(r._id)}>
                {isDeleting[r._id] ? <CircularProgress size={20} /> : <DeleteIcon />}
              </IconButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}
