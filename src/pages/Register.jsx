import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/apiCalls";
import { Card, CardContent, TextField, Typography, Button, MenuItem, Box, InputAdornment, useTheme, Alert, IconButton } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

const BrandPanel = () => (
  <Box sx={{ display: { xs: "none", md: "flex" }, width: "48%", minHeight: 700, p: 6, position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "flex-end", backgroundImage: "linear-gradient(0deg,rgba(3,10,18,.9),rgba(3,10,18,.2)),url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=85')", backgroundSize: "cover", backgroundPosition: "center", color: "white" }}>
    <Box sx={{ position: "absolute", top: 36, left: 42, display: "flex", alignItems: "center", gap: 1.2 }}><Box sx={{ width: 44, height: 44, borderRadius: 3, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#10b981,#06b6d4)", color: "#04140f", fontWeight: 900 }}>F</Box><Typography fontWeight={900} fontSize={22}>FitTrack</Typography></Box>
    <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.08 }}>Your journey starts with one decision.</Typography>
    <Typography sx={{ mt: 2, color: "rgba(255,255,255,.75)", maxWidth: 470 }}>Create your personal fitness space and keep every goal, workout and milestone within reach.</Typography>
  </Box>
);

export default function Register() {
  const theme = useTheme(); const { login } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", contact: "", gender: "" });
  const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [show, setShow] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess(""); const trimmedForm = {};
    for (const key in form) trimmedForm[key] = form[key].trim();
    for (const key in trimmedForm) { if (!trimmedForm[key]) { setError(`Please enter a valid ${key}.`); return; } }
    const password = trimmedForm.password;
    if (/\s/.test(password)) { setError("Password cannot contain spaces."); return; }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/@[$!%*?&]/.test(password)) { setError("Password must contain uppercase, lowercase, number, and special character."); return; }
    try { const res = await registerUser(trimmedForm); if (!res.success) { setError(res.message === "Email already exists" ? "This email is already registered." : res.message || "Registration failed"); return; } setSuccess("Registration successful! Logging in..."); login({ user: res.user, token: res.token }); localStorage.setItem("userId", res.user._id); setTimeout(() => navigate("/dashboard"), 1500); }
    catch (err) { setError(err.response?.data?.message || "Registration failed"); }
  };
  const input = (label, name, type, Icon) => <TextField label={label} name={name} fullWidth type={type} margin="dense" value={form[name]} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><Icon color="primary" /></InputAdornment>, ...(name === "password" ? { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShow(!show)} edge="end">{show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}</IconButton></InputAdornment> } : {}) }} />;
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: { xs: 1.5, md: 4 }, background: theme.palette.mode === "dark" ? "#080d16" : "#f3f6f8" }}><Card sx={{ width: "100%", maxWidth: 1180, overflow: "hidden", display: "flex", borderRadius: 5, boxShadow: "0 28px 90px rgba(0,0,0,.28)" }}><BrandPanel /><Box sx={{ flex: 1, display: "grid", placeItems: "center", p: { xs: 3, sm: 5, md: 6 } }}><CardContent sx={{ p: 0, width: "100%", maxWidth: 420 }}><Typography variant="overline" color="primary" fontWeight={900} letterSpacing={1.4}>START YOUR JOURNEY</Typography><Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>Create your account</Typography><Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>Your fitness goals deserve a dedicated space.</Typography>{error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}{success && <Alert severity="success" sx={{ mb: 1.5 }}>{success}</Alert>}<form onSubmit={handleSubmit}>{input("Full name", "name", "text", PersonRoundedIcon)}{input("Email address", "email", "email", EmailRoundedIcon)}{input("Password", "password", show ? "text" : "password", LockRoundedIcon)}{input("Contact number", "contact", "tel", PhoneAndroidRoundedIcon)}<TextField select label="Gender" name="gender" fullWidth margin="dense" value={form.gender} onChange={handleChange} required><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem></TextField><Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2.5, py: 1.25, fontWeight: 800 }}>Create Account</Button><Typography mt={2.5} textAlign="center" color="text.secondary">Already have an account? <Box component="span" onClick={() => navigate("/login")} sx={{ color: "primary.main", fontWeight: 800, cursor: "pointer" }}>Sign in</Box></Typography></form></CardContent></Box></Card></Box>
  );
}
