import React, { useState } from "react";
import {
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import type { Appointment, Pet } from "../types";

const fetchAppointments = async () => {
  const { data } = await api.get("/api/appointments");
  return data;
};

const fetchPets = async () => {
  const { data } = await api.get("/api/pets");
  return data;
};

const AppointmentList: React.FC = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [creating, setCreating] = useState<Partial<Appointment> | null>(null);

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const { data: pets } = useQuery<Pet[]>({
    queryKey: ["pets"],
    queryFn: fetchPets,
  });

  const createMutation = useMutation({
    mutationFn: (newAppointment: Partial<Appointment>) =>
      api.post("/api/appointments", {
        ...newAppointment,
        petId: newAppointment.pet?.id,
      }),
    onSuccess: () => {
      setCreating(null);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/appointments/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (appointment: Appointment) =>
      api.put(`/api/appointments/${appointment.id}`, appointment),
    onSuccess: () => {
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editing) {
      setEditing({ ...editing, [e.target.name]: e.target.value });
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() =>
          setCreating({ dateTime: "", reason: "", pet: pets?.[0] || undefined })
        }
      >
        New Appointment
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pet</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments?.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.pet?.name || "Unknown"}</TableCell>
                <TableCell>{appt.dateTime.replace("T", " ")}</TableCell>
                <TableCell>{appt.reason}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditing(appt)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(appt.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onClose={() => setEditing(null)}>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Date/Time"
            name="dateTime"
            type="datetime-local"
            value={editing?.dateTime || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reason"
            name="reason"
            value={editing?.reason || ""}
            onChange={handleEditChange}
          />
          <TextField
            select
            label="Pet"
            name="petId"
            value={editing?.pet?.id || ""}
            onChange={(e) => {
              const selectedPet = pets?.find((p) => p.id === +e.target.value);
              if (editing && selectedPet) {
                setEditing({ ...editing, pet: selectedPet });
              }
            }}
          >
            {pets?.map((pet) => (
              <MenuItem key={pet.id} value={pet.id}>
                {pet.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editing && updateMutation.mutate(editing)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={!!creating} onClose={() => setCreating(null)}>
        <DialogTitle>New Appointment</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Date/Time"
            name="dateTime"
            type="datetime-local"
            value={creating?.dateTime || ""}
            onChange={(e) =>
              setCreating((prev) => ({ ...prev, dateTime: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reason"
            name="reason"
            value={creating?.reason || ""}
            onChange={(e) =>
              setCreating((prev) => ({ ...prev, reason: e.target.value }))
            }
          />
          <TextField
            select
            label="Pet"
            name="petId"
            value={creating?.pet?.id || ""}
            onChange={(e) => {
              const selectedPet = pets?.find((p) => p.id === +e.target.value);
              if (selectedPet) {
                setCreating((prev) => ({ ...prev, pet: selectedPet }));
              }
            }}
          >
            {pets?.map((pet) => (
              <MenuItem key={pet.id} value={pet.id}>
                {pet.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (creating) createMutation.mutate(creating);
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentList;
