import React, { useState, useEffect } from "react";
import {
    Box, Typography, Card, CardContent, CardHeader,
    FormControl, InputLabel, Select, MenuItem, Switch,
    FormControlLabel, Button, Grid, Tabs, Tab
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import api from "../api/axios";
import Alerts from "./Alerts";

// ArrayTimezones
const TIMEZONE_OPTIONS = [
    { value: "Asia/Karachi", label: "Karachi (PKT, UTC+5)" },
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Asia/Dubai", label: "Dubai (GST, UTC+4)" },
];

export default function Settings() {
    const [settings, setSettings] = useState({
        units: { weight: "kg", distance: "km" },
        notifications: { workout: true, nutrition: true, progress: true },
        timezone: "Asia/Karachi"
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState(0);
    const userId = localStorage.getItem("userId");

    //user settings  
useEffect(() => {
    const fetchSettings = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await api.get(`/users/profile`);
            if (res.data.settings) {
                setSettings(prev => ({ ...prev, ...res.data.settings }));
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        }
        setLoading(false);
    };
    fetchSettings();
}, [userId]);

    //updated settings
    const handleSave = async () => {
        if (!userId) {
            alert("Error: User not logged in. Cannot save settings!");
            return;
        }

        setSaving(true);
        try {
            await api.put(`/users/${userId}/settings`, { settings });
            alert("Settings saved successfully!");
        } catch (err) {
            console.error(err.response?.data || err);
            alert(`Error saving settings: ${err.response?.data?.message || "Unknown error"}`);
        }
        setSaving(false);
    };

    if (loading) return <Typography p={3}>Loading User Settings...</Typography>;

    return (
        <Box p={3} maxWidth={1000} mx="auto">
            <Typography variant="h4" mb={4} fontWeight={700}>
                User Settings ⚙️
            </Typography>

            <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                sx={{ mb: 3 }}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
            >
                <Tab label="General Settings" />
                <Tab label="Alerts & Reminders" />
            </Tabs>

            {tab === 0 && (
                <Grid container spacing={4}>

                    {/* Units Settings */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardHeader title="Units Settings" />
                            <CardContent>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel id="weight-unit-label">Weight Unit</InputLabel>
                                    <Select
                                        labelId="weight-unit-label"
                                        label="Weight Unit"
                                        value={settings.units.weight}
                                        onChange={(e) =>
                                            setSettings(prev => ({
                                                ...prev,
                                                units: { ...prev.units, weight: e.target.value },
                                            }))
                                        }
                                    >
                                        <MenuItem value="kg">Kilograms (kg)</MenuItem>
                                        <MenuItem value="lb">Pounds (lb)</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="distance-unit-label">Distance Unit</InputLabel>
                                    <Select
                                        labelId="distance-unit-label"
                                        label="Distance Unit"
                                        value={settings.units.distance}
                                        onChange={(e) =>
                                            setSettings(prev => ({
                                                ...prev,
                                                units: { ...prev.units, distance: e.target.value },
                                            }))
                                        }
                                    >
                                        <MenuItem value="km">Kilometers (km)</MenuItem>
                                        <MenuItem value="mi">Miles (mi)</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Notifications */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardHeader title="General Notifications" />
                            <CardContent>
                                <FormControlLabel
                                    sx={{ display: "block", mb: 2 }}
                                    control={
                                        <Switch
                                            checked={settings.notifications.workout}
                                            onChange={(e) =>
                                                setSettings(prev => ({
                                                    ...prev,
                                                    notifications: { ...prev.notifications, workout: e.target.checked },
                                                }))
                                            }
                                        />
                                    }
                                    label="Workout Reminders"
                                />
                                <FormControlLabel
                                    sx={{ display: "block", mb: 2 }}
                                    control={
                                        <Switch
                                            checked={settings.notifications.nutrition}
                                            onChange={(e) =>
                                                setSettings(prev => ({
                                                    ...prev,
                                                    notifications: { ...prev.notifications, nutrition: e.target.checked },
                                                }))
                                            }
                                        />
                                    }
                                    label="Nutrition Reminders"
                                />
                                <FormControlLabel
                                    sx={{ display: "block" }}
                                    control={
                                        <Switch
                                            checked={settings.notifications.progress}
                                            onChange={(e) =>
                                                setSettings(prev => ({
                                                    ...prev,
                                                    notifications: { ...prev.notifications, progress: e.target.checked },
                                                }))
                                            }
                                        />
                                    }
                                    label="Progress Check-in Reminders"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Timezone */}
                    <Grid item xs={12}>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardHeader title={<Box display="flex" alignItems="center"><AccessTimeIcon sx={{ mr: 1 }} /> Timezone</Box>} />
                            <CardContent>
                                <FormControl fullWidth>
                                    <InputLabel id="timezone-label">Select Timezone</InputLabel>
                                    <Select
                                        labelId="timezone-label"
                                        label="Select Timezone"
                                        value={settings.timezone}
                                        onChange={(e) =>
                                            setSettings(prev => ({ ...prev, timezone: e.target.value }))
                                        }
                                    >
                                        {TIMEZONE_OPTIONS.map(tz => (
                                            <MenuItem key={tz.value} value={tz.value}>{tz.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Save Button */}
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ px: 4, py: 1.5, fontSize: "1rem", borderRadius: 2 }}
                                onClick={handleSave}
                                disabled={saving}
                                startIcon={!saving ? <SaveIcon /> : null}
                            >
                                {saving ? "Saving..." : "Save Settings"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            )}

            {tab === 1 && <Alerts />}
        </Box>
    );
}
