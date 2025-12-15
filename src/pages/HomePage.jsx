import React, { useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import StarIcon from "@mui/icons-material/Star";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const featuresRef = useRef(null);
  const exercisesRef = useRef(null);
  const dietRef = useRef(null);
  const trainersRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const downloadDietPlan = (type) => {
    const plans = {
      "weight-loss": [
        "Weight Loss Plan — 2000 kcal (sample day)",
        "Breakfast: Oats (50g) + 2 boiled eggs + green tea",
        "Snack: Apple + 10 almonds",
        "Lunch: Grilled chicken (150g) + mixed salad + 1 chapati",
        "Snack: Greek yogurt (100g)",
        "Dinner: Vegetable soup + salad (light)",
        "Notes: Drink 3L water, maintain calorie deficit ~300-500 kcal",
      ],
      "muscle-gain": [
        "Muscle Gain Plan — 3200 kcal (sample day)",
        "Breakfast: 4 eggs + oats + banana",
        "Snack: Peanut butter sandwich + milk",
        "Lunch: Rice (200g) + chicken breast (200g) + veg",
        "Post-Workout: Whey shake + banana",
        "Dinner: Salmon/Beef + sweet potato + veg",
        "Notes: Protein target ~1.6-2.2 g/kg bodyweight",
      ],
      "balanced": [
        "Balanced Plan — 2500 kcal (sample day)",
        "Breakfast: Greek yogurt + mixed berries + seeds",
        "Snack: Fruit + handful nuts",
        "Lunch: Brown rice + lentils + salad",
        "Snack: Cottage cheese + cucumber",
        "Dinner: Grilled fish + steamed veg",
        "Notes: Balance carbs, protein & healthy fats",
      ],
    };

    const content = (plans[type] || plans["balanced"]).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-diet-plan.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exercises = [
    {
      title: "Bench Press",
      group: "Chest",
      img:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=900&q=80",
      desc: "Compound chest builder — heavy sets 4x6-8",
    },
    {
      title: "Pull Ups",
      group: "Back",
      img:
        "https://images.unsplash.com/photo-1558611848-73f7eb4001d8?auto=format&fit=crop&w=900&q=80https://tse2.mm.bing.net/th/id/OIP.2jsLcyYM6Zooe7aTWw7FtQHaE7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      desc: "Great for width — do 3-4 sets to failure / assisted.",
    },
    {
      title: "Squats",
      group: "Legs",
      img:
        "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=80",
      desc: "King of leg exercises — 4x6-10 heavy or 5x5 strength.",
    },
    {
      title: "Deadlift",
      group: "Back",
      img:
        "https://images.unsplash.com/photo-1517964603305-3e68c9f9c3a2?auto=format&fit=crop&w=900&q=80",
      desc: "Full posterior chain — keep form strict, low reps.",
    },
    {
      title: "Overhead Press",
      group: "Shoulders",
      img:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e28?auto=format&fit=crop&w=900&q=80https://tse2.mm.bing.net/th/id/OIP.2jsLcyYM6Zooe7aTWw7FtQHaE7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      desc: "Builds shoulder mass & pressing strength.",
    },
  ];

  return (
    <Box sx={{ fontFamily: "Inter, sans-serif", scrollBehavior: "smooth" }}>
      {/* NAVBAR */}
      <AppBar
        position="sticky"
        elevation={8}
        sx={{
          background: isDark ? "rgba(6,6,6,0.5)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "transparent" }}>
              <PersonIcon sx={{ color: "transparent" }} />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(90deg,#4e54c8,#8f94fb)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              FitTrack
            </Typography>
          </Box>

          {mdUp ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => scrollTo(featuresRef)}>Features</Button>
              <Button onClick={() => scrollTo(exercisesRef)}>Exercises</Button>
              <Button onClick={() => scrollTo(dietRef)}>Diet Plans</Button>
              <Button onClick={() => scrollTo(trainersRef)}>Trainers</Button>
              <Button onClick={() => scrollTo(pricingRef)}>Pricing</Button>
              <Button variant="contained" onClick={() => navigate("/register")}>
                Sign Up Free
              </Button>
            </Stack>
          ) : (
            <IconButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: { xs: "80vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          background: isDark
            ? "linear-gradient(135deg,#0f1720 10%, #1f2937 100%)"
            : "linear-gradient(135deg,#eef2ff 0%, #f8fafc 100%)",
          color: isDark ? "#fff" : "#08101a",
        }}
      >
        <Grid container spacing={4} alignItems="center" maxWidth="lg">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
              Train Smart. Eat Well. Track Progress.
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              All your workouts, nutrition and analytics in one place — designed for
              real progress.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  borderRadius: "40px",
                  px: 4,
                  py: 1.3,
                  fontWeight: "bold",
                  background: "linear-gradient(90deg,#4e54c8,#8f94fb)",
                }}
              >
                Create Account
              </Button>

              <Button
                variant="outlined"
                
                size="large"
                onClick={() => navigate("login")}
                sx={{ borderRadius: "40px", px: 4, py: 1.3 }}
              >
                Log In
              </Button>
            </Stack>

            <Stack direction="row" spacing={3} mt={4} alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  <StarIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  4.8 User Rating
                </Typography>
                <Typography color="text.secondary">Trusted by 10k+ users</Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  <FitnessCenterIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Pro Workouts
                </Typography>
                <Typography color="text.secondary">Guided plans for gains & fat loss</Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                p: 3,
                boxShadow: 8,
                background: isDark ? "#0b1220" : "#fff",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Quick Stats
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="900">
                      12k+
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Workouts Logged
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="900">
                      8k+
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Meal Entries
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="900">
                      95%
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Active Users Retention
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="caption" display="block" mt={2} color="text.secondary">
                Pro tip: Consistency + progressive overload = results.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box ref={featuresRef} sx={{ py: 10, px: 3, background: isDark ? "#07101a" : "#f8fafc" }}>
        <Typography variant="h4" textAlign="center" fontWeight="900" mb={6}>
          Built For Results
        </Typography>

        <Grid container spacing={3} maxWidth="lg" margin="0 auto">
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <FitnessCenterIcon sx={{ fontSize: 44, color: "#4e54c8" }} />
              <Typography variant="h6" fontWeight="bold" mt={1}>
                Structured Workouts
              </Typography>
              <Typography color="text.secondary">
                Follow periodized plans for strength, hypertrophy or fat loss.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <FastfoodIcon sx={{ fontSize: 44, color: "#ffb74d" }} />
              <Typography variant="h6" fontWeight="bold" mt={1}>
                Smart Nutrition
              </Typography>
              <Typography color="text.secondary">
                Macro-friendly meal plans & daily logging to hit your targets.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <ShowChartIcon sx={{ fontSize: 44, color: "#4caf50" }} />
              <Typography variant="h6" fontWeight="bold" mt={1}>
                Pro Analytics
              </Typography>
              <Typography color="text.secondary">
                Track trends, body measurements and performance over time.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box ref={exercisesRef} sx={{ py: 8, px: 3 }}>
        <Typography variant="h4" textAlign="center" fontWeight="900" mb={4}>
          Exercise Library
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 1,
            px: 1,
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": { background: isDark ? "#374151" : "#cbd5e1", borderRadius: 2 },
          }}
        >
          {exercises.map((ex, idx) => (
            <Card key={idx} sx={{ minWidth: 260, flex: "0 0 auto", borderRadius: 3 }}>
              <Box
                sx={{
                  height: 160,
                  background: `linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${ex.img}) center/cover`,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {ex.title}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {ex.group} • {ex.desc}
                </Typography>
                <Button size="small" sx={{ mt: 2 }} onClick={() => alert(`${ex.title}\n\nRecommended: Warm up, 3-5 sets.`)}>
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* DIET PLANS */}
      <Box ref={dietRef} sx={{ py: 10, px: 3, background: isDark ? "#04121a" : "#fff" }}>
        <Typography variant="h4" textAlign="center" fontWeight="900" mb={4}>
          Professional Diet Plans
        </Typography>

        <Grid container spacing={3} maxWidth="lg" mx="auto">
          {[
            {
              id: "weight-loss",
              title: "Weight Loss",
              subtitle: "Calorie deficit + high protein",
              highlights: ["Oats & eggs breakfast", "Lean proteins", "Veg-heavy lunches"],
              color: "#ff7043",
            },
            {
              id: "muscle-gain",
              title: "Muscle Gain",
              subtitle: "Calorie surplus + protein timing",
              highlights: ["Higher carbs around workout", "Frequent protein meals", "Calorie surplus 250-500 kcal"],
              color: "#66bb6a",
            },
            {
              id: "balanced",
              title: "Balanced",
              subtitle: "Maintenance + healthy macros",
              highlights: ["Whole grains", "Healthy fats", "Moderate proteins"],
              color: "#42a5f5",
            },
          ].map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card sx={{ p: 3, borderRadius: 3, borderTop: `6px solid ${plan.color}` }}>
                <Typography variant="h6" fontWeight="bold">
                  {plan.title}
                </Typography>
                <Typography color="text.secondary" variant="body2" mb={2}>
                  {plan.subtitle}
                </Typography>

                <Box>
                  {plan.highlights.map((h, i) => (
                    <Typography key={i} sx={{ mt: 1 }}>
                      • {h}
                    </Typography>
                  ))}
                </Box>

                <Stack direction="row" spacing={1} mt={3}>
                  <Button
                    startIcon={<DownloadIcon />}
                    variant="outlined"
                    onClick={() => downloadDietPlan(plan.id)}
                    sx={{ textTransform: "none" }}
                  >
                    Download Plan
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => alert("Open diet modal or navigate to diet logging")}
                    sx={{ textTransform: "none" }}
                  >
                    Start Plan
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box ref={trainersRef} sx={{ py: 10, px: 3 }}>
        <Typography variant="h4" textAlign="center" fontWeight="900" mb={6}>
          Expert Trainers
        </Typography>

        <Grid container spacing={3} maxWidth="lg" mx="auto">
          {[
            { name: "Ahsan", role: "Strength Coach", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
            { name: "Sara", role: "Nutritionist", avatar: "https://images.unsplash.com/photo-1545996124-1b5d6b6a1bfb?auto=format&fit=crop&w=200&q=80" },
            { name: "Bilal", role: "Conditioning", avatar: "https://images.unsplash.com/photo-1541534401786-8b516b0b9f14?auto=format&fit=crop&w=200&q=80" },
          ].map((t, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <Avatar src={t.avatar} sx={{ width: 84, height: 84, mx: "auto", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  {t.name}
                </Typography>
                <Typography color="text.secondary">{t.role}</Typography>
                <Button sx={{ mt: 2 }} onClick={() => alert(`Message ${t.name} or view profile`)}>
                  View Profile
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box ref={pricingRef} sx={{ py: 10, px: 3, background: isDark ? "#04121a" : "#f8fafc" }}>
        <Typography variant="h4" textAlign="center" fontWeight="900" mb={5}>
          Pricing
        </Typography>

        <Grid container spacing={3} maxWidth="lg" mx="auto" alignItems="stretch">
          {[
            { title: "Free", price: "0", perks: ["Basic logging", "Limited plans"], featured: false },
            { title: "Pro", price: "7.99/mo", perks: ["All plans", "Advanced analytics", "Priority support"], featured: true },
            { title: "Coach", price: "29.99/mo", perks: ["Trainer tools", "Team features"], featured: false },
          ].map((p, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ p: 4, borderRadius: 3, boxShadow: p.featured ? 12 : 4 }}>
                <Typography variant="h6" fontWeight="bold">
                  {p.title}
                </Typography>
                <Typography variant="h4" fontWeight="900" my={2}>
                  {p.price === "0" ? "Free" : p.price}
                </Typography>

                <Box>
                  {p.perks.map((perk, idx) => (
                    <Typography key={idx} sx={{ mt: 1 }}>
                      • {perk}
                    </Typography>
                  ))}
                </Box>

                <Button
                  variant={p.featured ? "contained" : "outlined"}
                  sx={{ mt: 3, textTransform: "none" }}
                  onClick={() => navigate("/register")}
                >
                  Choose
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box ref={contactRef} sx={{ py: 8, px: 3 }}>
        <Grid container spacing={3} maxWidth="lg" mx="auto" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="900">
              Ready to start your transformation?
            </Typography>
            <Typography color="text.secondary">Join thousands of users building healthy habits today.</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Button variant="contained" onClick={() => navigate("/register")} sx={{ px: 4 }}>
              Create Account
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          py: 4,
          px: 3,
          background: isDark ? "linear-gradient(90deg,#000,#07121a)" : "linear-gradient(90deg,#4e54c8,#8f94fb)",
          color: "#fff",
          mt: 6,
        }}
      >
        <Grid container maxWidth="lg" mx="auto" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography>© {new Date().getFullYear()} FitTrack. All rights reserved.</Typography>
            <Typography variant="body2">Designed  by Habib Hussaini</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Button color="inherit" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Back to top
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

