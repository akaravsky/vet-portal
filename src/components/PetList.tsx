import React, { useState } from "react";
import {
  Typography,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import type { Pet } from "../types";

const fetchPets = async () => {
  const { data } = await api.get("api/pets");
  return data;
};

const PetList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Pet[]>({
    queryKey: ["pets"],
    queryFn: fetchPets,
  });

  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const deletePetMutation = useMutation({
    mutationFn: (id: number) => api.delete(`api/pets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pets"] }),
  });

  const updatePetMutation = useMutation({
    mutationFn: (updatedPet: Pet) =>
      api.put(`api/pets/${updatedPet.id}`, updatedPet),
    onSuccess: () => {
      setEditingPet(null);
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <CircularProgress />
      </div>
    );
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editingPet) {
      setEditingPet({ ...editingPet, [e.target.name]: e.target.value });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      deletePetMutation.mutate(id);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Pets List
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="pets table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.species}</TableCell>
                <TableCell>{pet.breed}</TableCell>
                <TableCell>{pet.age}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditingPet(pet)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(pet.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editingPet} onClose={() => setEditingPet(null)}>
        <DialogTitle>Edit Pet</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            name="name"
            value={editingPet?.name || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Species"
            name="species"
            value={editingPet?.species || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Breed"
            name="breed"
            value={editingPet?.breed || ""}
            onChange={handleEditChange}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={editingPet?.age || ""}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingPet(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editingPet && updatePetMutation.mutate(editingPet)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PetList;
