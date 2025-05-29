import React from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Appointment } from "../types";

const fetchAppointments = async () => {
  const { data } = await api.get("/api/appointments");
  return data;
};

const fetchPets = async () => {
  const { data } = await api.get("/api/pets");
  return data;
};

const DashboardPage: React.FC = () => {
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const { data: pets = [] } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
  });

  const upcoming: Appointment[] = appointments
    .filter((a: Appointment) => new Date(a.dateTime) > new Date())
    .sort(
      (a: Appointment, b: Appointment) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
    .slice(0, 5);

  const recentPets = [...pets]
    .sort((a, b) => b.id - a.id) // assuming recent = higher ID
    .slice(0, 5);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap">
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6">Upcoming Appointments</Typography>
          <List>
            {upcoming.map((appt) => (
              <React.Fragment key={appt.id}>
                <ListItem>
                  <ListItemText
                    primary={new Date(appt.dateTime).toLocaleString()}
                    secondary={`${appt.pet.name} — ${appt.reason}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6">Recently Added Pets</Typography>
          <List>
            {recentPets.map((pet) => (
              <React.Fragment key={pet.id}>
                <ListItem>
                  <ListItemText
                    primary={pet.name}
                    secondary={`${pet.species}, Age: ${pet.age}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
