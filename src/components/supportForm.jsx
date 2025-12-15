import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography, Paper } from "@mui/material";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function SupportForm() {
  const { user } = useAuth(); 
  const [form, setForm] = useState({
    type: "issue",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle change with validation (only letters & no starting space)
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters and spaces
    if (/[^a-zA-Z\s]/.test(value)) return;

    // Prevent starting with space
    if (/^\s/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (!user?.name || !user?.email) {
      setResult({ success: false, message: "User info missing" });
      setLoading(false);
      return;
    }

    // Subject validation
    if (!form.subject.trim() || !/^[a-zA-Z\s]+$/.test(form.subject)) {
      setResult({ success: false, message: "Subject must contain only letters and cannot be empty." });
      setLoading(false);
      return;
    }

    // Message validation
    if (!form.message.trim() || !/^[a-zA-Z\s]+$/.test(form.message)) {
      setResult({ success: false, message: "Message must contain only letters and cannot be empty." });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: user.name,
        email: user.email,
        ...form
      };

      const res = await API.post("/support", payload);
      setResult({
        success: true,
        message: "Ticket created. ID: " + res.data.ticketId
      });

      setForm({
        type: "issue",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error(err);
      setResult({
        success: false,
        message: err?.response?.data?.message || "Failed to send"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 700, margin: "24px auto", padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contact Support
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          name="name"
          value={user?.name || ""}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Email"
          name="email"
          value={user?.email || ""}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        <TextField
          select
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="issue">Issue</MenuItem>
          <MenuItem value="feedback">Feedback</MenuItem>
          <MenuItem value="help">Help</MenuItem>
        </TextField>

        <TextField
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              setForm({
                type: "issue",
                subject: "",
                message: ""
              })
            }
          >
            Reset
          </Button>
        </Box>

        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography color={result.success ? "green" : "error"}>
              {result.message}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
