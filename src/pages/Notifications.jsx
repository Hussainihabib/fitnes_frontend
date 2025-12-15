import React, { useContext, useCallback } from "react";
import { NotificationContext } from "../context/NotificationContext";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

const getTypeStyles = (type) => {
  const t = type?.toLowerCase() || "";
  if (t.includes("milestone") || t.includes("achieve"))
    return { icon: <CheckCircleOutlineIcon color="success" />, color: "success", label: "Milestone" };
  if (t.includes("workout") || t.includes("activity"))
    return { icon: <FitnessCenterIcon color="primary" />, color: "primary", label: "Activity" };
  if (t.includes("reminder") || t.includes("alert"))
    return { icon: <NotificationsActiveIcon color="secondary" />, color: "secondary", label: "Reminder" };
  if (t.includes("error") || t.includes("failure"))
    return { icon: <WarningAmberIcon color="error" />, color: "error", label: "System Error" };
  return { icon: <AccessTimeIcon sx={{ color: "text.secondary" }} />, color: "default", label: "General" };
};

export default function Notifications() {
  const { notifications, markNotificationAsRead } = useContext(NotificationContext);

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleMarkRead = useCallback((id) => {
    if (markNotificationAsRead) markNotificationAsRead(id);
  }, [markNotificationAsRead]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: 700, color: "primary.dark", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <NotificationsActiveIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: '2rem' }} color="primary" />
        Activity Feed
        {unreadCount > 0 && (
          <Chip
            label={`${unreadCount} Unread`}
            color="secondary"
            size="small"
            sx={{ ml: 2, fontWeight: 'bold' }}
          />
        )}
      </Typography>

      <Divider sx={{ mb: 4, borderColor: 'primary.main' }} />

      <Paper elevation={8} sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 5, textAlign: "center", bgcolor: 'primary.light', color: 'primary.dark' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
              ✨ You're all caught up!
            </Typography>
            <Typography variant="body1">
              No new activities or alerts in your feed.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {sortedNotifications.map((n, index) => {
              const notificationId = n._id || index;
              const isRead = !!n.read;
              const { icon, color, label } = getTypeStyles(n.type);
              const isLast = index === sortedNotifications.length - 1;
              const listItemBg = isRead ? 'white' : 'action.selected';

              return (
                <React.Fragment key={notificationId}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      backgroundColor: listItemBg,
                      "&:hover": { backgroundColor: isRead ? 'action.hover' : 'primary.light' },
                      p: 3,
                      transition: 'background-color 0.3s, opacity 0.3s',
                      opacity: isRead ? 0.7 : 1,
                      borderLeft: isRead ? 'none' : `5px solid`,
                      borderLeftColor: 'primary.main',
                    }}
                  >
                    <Box sx={{ mr: 2, mt: 0.5 }}>{icon}</Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Chip
                            label={n.type || label}
                            color={color}
                            size="small"
                            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", fontStyle: 'italic' }}>
                            <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                            {new Date(n.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ display: "block", mt: 1, fontWeight: isRead ? 400 : 600 }}
                        >
                          {n.message}
                        </Typography>
                      }
                    />
                    <Box sx={{ ml: 2, alignSelf: 'center' }}>
                      {markNotificationAsRead && (
                        <Tooltip title={isRead ? "Read" : "Mark as Read"}>
                          <IconButton
                            onClick={() => !isRead && handleMarkRead(notificationId)}
                            disabled={isRead}
                            color={isRead ? 'default' : 'primary'}
                            size="small"
                          >
                            {isRead ? <MarkEmailReadIcon /> : <MarkEmailUnreadIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </ListItem>
                  {!isLast && <Divider variant="fullWidth" component="li" sx={{ ml: 0 }} />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
}
