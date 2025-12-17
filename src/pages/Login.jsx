import { useState, useEffect } from "react";
import { loginUser } from "../api/apiCalls";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
Card,
CardContent,
TextField,
Typography,
Button,
Box,
InputAdornment,
useTheme,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function Login() {
const theme = useTheme();
const { login, user } = useAuth();
const navigate = useNavigate();

const [form, setForm] = useState({ email: "", password: "" });
const [error, setError] = useState("");

useEffect(() => {
if (user) {
navigate("/dashboard");
}
}, [user]);

const handleChange = (e) =>
setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
e.preventDefault();
setError("");

try {
  const res = await loginUser(form);

  login({ user: res.user, token: res.token });
  navigate("/dashboard");
} catch (err) {
  setError(err.response?.data?.message || "Login failed");
}

};

return (
<Box
sx={{
minHeight: "100vh",
background:
theme.palette.mode === "light"
? "linear-gradient(135deg, #5c6bc0, #1a237e)"
: "linear-gradient(135deg, #0d0d16, #111827)",
display: "flex",
justifyContent: "center",
alignItems: "center",
p: 2,
}}
>
<Card
sx={{
width: 380,
p: 3,
borderRadius: 4,
backdropFilter: "blur(10px)",
background:
theme.palette.mode === "light"
? "rgba(255,255,255,0.85)"
: "rgba(30,30,46,0.55)",
boxShadow:
theme.palette.mode === "light"
? "0px 8px 22px rgba(0,0,0,0.25)"
: "0px 8px 22px rgba(0,0,0,0.45)",
}}
> <CardContent>
  <Typography
variant="h6"
textAlign="center"
mb={3}
sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
>
FitTrack </Typography>
<Typography
variant="h4"
textAlign="center"
mb={3}
sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
>
Login Form </Typography>
<Typography
        textAlign="center"
        sx={{ color: theme.palette.text.secondary, mb: 3 }}
      >
      Welcom Back and start your fitness journey!
      </Typography>


      {error && (
        <Typography color="error" textAlign="center" mb={2}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          fullWidth
          type="email"
          margin="normal"
          value={form.email}
          onChange={handleChange}
          required
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          name="password"
          fullWidth
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
          required
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "16px",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(135deg, #1a237e, #303f9f)"
                : "linear-gradient(135deg, #4c51bf, #2a2f85)",
          }}
        >
          Login
        </Button>

        <Typography
          mt={2}
          textAlign="center"
          sx={{
            cursor: "pointer",
            fontWeight: 500,
            color: theme.palette.primary.main,
          }}
          onClick={() => navigate("/register")}
        >
          Create an account?
        </Typography>
      </form>
    </CardContent>
  </Card>
</Box>


);
}
