import { useState, useEffect } from "react";
import { loginUser } from "../api/apiCalls";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Card, CardContent, TextField, Typography, Button, InputAdornment, IconButton, Alert, useTheme } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

const BrandPanel = () => (
  <Box sx={{ display: { xs: "none", md: "flex" }, width: "52%", minHeight: 620, p: 6, position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "flex-end", backgroundImage: "linear-gradient(0deg,rgba(3,10,18,.88),rgba(3,10,18,.25)),url('https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1400&q=85')", backgroundSize: "cover", backgroundPosition: "center", color: "white" }}>
    <Box sx={{ position: "absolute", top: 36, left: 42, display: "flex", alignItems: "center", gap: 1.2 }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 3, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#10b981,#06b6d4)", color: "#04140f", fontWeight: 900 }}>F</Box>
      <Typography fontWeight={900} fontSize={22}>FitTrack</Typography>
    </Box>
    <Typography variant="h3" sx={{ fontWeight: 900, maxWidth: 540, lineHeight: 1.08 }}>Stronger every day. <Box component="span" sx={{ color: "#34d399" }}>One workout at a time.</Box></Typography>
    <Typography sx={{ mt: 2, maxWidth: 500, color: "rgba(255,255,255,.75)", fontSize: 16 }}>Track your workouts, nutrition and progress in one focused fitness experience built for consistency.</Typography>
  </Box>
);

export default function Login() {
  const theme = useTheme();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try { const res = await loginUser(form); login({ user: res.user, token: res.token }); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Login failed"); }
  };
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: { xs: 1.5, md: 4 }, background: theme.palette.mode === "dark" ? "#080d16" : "#f3f6f8" }}>
      <Card sx={{ width: "100%", maxWidth: 1180, minHeight: { md: 620 }, overflow: "hidden", display: "flex", borderRadius: 5, boxShadow: "0 28px 90px rgba(0,0,0,.28)" }}>
        <BrandPanel />
        <Box sx={{ flex: 1, display: "grid", placeItems: "center", p: { xs: 3, sm: 5, md: 7 } }}>
          <CardContent sx={{ p: 0, width: "100%", maxWidth: 390 }}>
            <Typography variant="overline" color="primary" fontWeight={900} letterSpacing={1.4}>WELCOME BACK</Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>Sign in to FitTrack</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3.5 }}>Continue building the habits that move you forward.</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField label="Email address" name="email" fullWidth type="email" margin="normal" value={form.email} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon color="primary" /></InputAdornment> }} />
              <TextField label="Password" name="password" fullWidth type={show ? "text" : "password"} margin="normal" value={form.password} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><LockRoundedIcon color="primary" /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShow(!show)} edge="end">{show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}</IconButton></InputAdornment> }} />
              <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.35, fontWeight: 800 }}>Sign In</Button>
              <Typography mt={3} textAlign="center" color="text.secondary">New to FitTrack? <Box component="span" onClick={() => navigate("/register")} sx={{ color: "primary.main", fontWeight: 800, cursor: "pointer" }}>Create an account</Box></Typography>
            </form>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
