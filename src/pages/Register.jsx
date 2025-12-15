import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/apiCalls";

import {
Card,
CardContent,
TextField,
Typography,
Button,
MenuItem,
Box,
InputAdornment,
useTheme,
Alert
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

export default function Register() {
const theme = useTheme();
const { login } = useAuth();
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
contact: "",
gender: "",
});

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

const trimmedForm = {};
for (const key in form) {
  trimmedForm[key] = form[key].trim();
}

for (const key in trimmedForm) {
  if (!trimmedForm[key]) {
    setError(`Please enter a valid ${key}.`);
    return;
  }
}

const password = trimmedForm.password;
if (/\s/.test(password)) {
  setError("Password cannot contain spaces.");
  return;
}
if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[@$!%*?&]/.test(password)) {
  setError("Password must contain uppercase, lowercase, number, and special character.");
  return;
}

try {
  const res = await registerUser(trimmedForm);

  if (!res.success) {
    setError(
      res.message === "Email already exists"
        ? "This email is already registered."
        : res.message || "Registration failed"
    );
    return;
  }

  setSuccess("Registration successful! Logging in...");

  // Loginautomaticc
  login({ user: res.user, token: res.token });
  localStorage.setItem("userId", res.user._id);

  setTimeout(() => {
    navigate("/dashboard");
  }, 1500);

} catch (err) {
  setError(err.response?.data?.message || "Registration failed");
}

};

return (
<Box
sx={{
minHeight: "100vh",
background: theme.palette.mode === "light"
? "linear-gradient(135deg, #5c6bc0, #1a237e)"
: "linear-gradient(135deg, #0d0d16, #111827)",
display: "flex",
justifyContent: "center",
alignItems: "center",
px: 2,
}}
>
<Card
sx={{
width: "100%",
maxWidth: 420,
p: 3,
borderRadius: 4,
backdropFilter: "blur(10px)",
background: theme.palette.mode === "light"
? "rgba(255,255,255,0.85)"
: "rgba(30,30,46,0.55)",
boxShadow: theme.palette.mode === "light"
? "0 8px 25px rgba(0,0,0,0.25)"
: "0 8px 25px rgba(0,0,0,0.45)",
}}
> <CardContent>
<Typography
variant="h4"
fontWeight="bold"
textAlign="center"
mb={1}
sx={{ color: theme.palette.primary.main }}
>
Create Account  </Typography>


      <Typography
        textAlign="center"
        sx={{ color: theme.palette.text.secondary, mb: 3 }}
      >
        Join FitTrack and start your fitness journey!
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          name="name"
          fullWidth
          margin="normal"
          required
          value={form.name}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment> }}
        />
        <TextField
          label="Email Address"
          type="email"
          name="email"
          fullWidth
          margin="normal"
          required
          value={form.email}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          required
          value={form.password}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon color="primary" /></InputAdornment> }}
        />
        <TextField
          label="Contact Number"
          name="contact"
          fullWidth
          margin="normal"
          required
          value={form.contact}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><PhoneAndroidIcon color="primary" /></InputAdornment> }}
        />
        <TextField
          select
          label="Gender"
          name="gender"
          fullWidth
          margin="normal"
          required
          value={form.gender}
          onChange={handleChange}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.3,
            fontSize: "16px",
            fontWeight: "bold",
            background: theme.palette.mode === "light"
              ? "linear-gradient(135deg, #1a237e, #303f9f)"
              : "linear-gradient(135deg, #4c51bf, #2a2f85)",
          }}
        >
          Register
        </Button>

        <Typography
          textAlign="center"
          sx={{ mt: 2, cursor: "pointer", color: theme.palette.primary.main }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Typography>
      </form>
    </CardContent>
  </Card>
</Box>


);
}
