import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  InputAdornment,
  useTheme,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import InfoIcon from "@mui/icons-material/Info";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const theme = useTheme();
  const { user: authUser, updateUser } = useAuth(); // 🔹 Get updateUser
  const [user, setUser] = useState(authUser || {});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const base = api.defaults.baseURL
    ? api.defaults.baseURL.replace(/\/api$/, "")
    : "";

  useEffect(() => {
    if (authUser) setUser(authUser);
    loadProfile();
  }, [authUser]);

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("loadProfile error:", err.response?.data || err);
    }
  };

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name || "");
      formData.append("email", user.email || "");
      formData.append("contact", user.contact || "");
      formData.append("gender", user.gender || "");
      formData.append("bio", user.bio || "");

      if (selectedImage) {
        formData.append("profilePicture", selectedImage);
      }

      const res = await api.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      updateUser(res.data); 
      setImagePreview(null);
      setSelectedImage(null);
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error("update profile error:", err.response?.data || err);
      alert("Profile update failed!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        py: 6,
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #5c6bc0, #1a237e)"
            : "linear-gradient(135deg, #0d0d16, #111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.85)"
              : "rgba(30,30,46,0.55)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 10px 30px rgba(0,0,0,0.3)"
              : "0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 3, color: theme.palette.primary.main }}
          >
            Profile Settings
          </Typography>

          <Box sx={{ textAlign: "center", mb: 3 }}>
<Avatar
  src={
    imagePreview || user?.profilePicture || "/default-avatar.png"
  }
  sx={{
    width: 120,
    height: 120,
    margin: "auto",
    mb: 2,
    border: `4px solid ${theme.palette.primary.main}`,
  }}
/>

            <Button
              variant="contained"
              component="label"
              sx={{
                borderRadius: "25px",
                px: 3,
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #1a237e, #303f9f)"
                    : "linear-gradient(135deg, #4c51bf, #2a2f85)",
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={user.name || ""}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="email"
            label="Email Address"
            value={user.email || ""}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="contact"
            label="Contact Number"
            value={user.contact || ""}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="gender"
            label="Gender"
            value={user.gender || ""}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            name="bio"
            label="Bio"
            multiline
            rows={3}
            value={user.bio || ""}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InfoIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              fontSize: "16px",
              fontWeight: "bold",
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #1a237e, #303f9f)"
                  : "linear-gradient(135deg, #4c51bf, #2a2f85)",
            }}
            onClick={handleUpdate}
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
