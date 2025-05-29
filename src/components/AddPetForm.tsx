import { useState } from "react";
import { TextField, Button, Paper, Typography, Stack } from "@mui/material";
import axios from "../api/axios";

export default function AddPetForm() {
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/pets", {
        ...form,
        age: parseInt(form.age),
      });
      alert("Pet added!");
      setForm({ name: "", species: "", breed: "", age: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add pet");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Pet
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Species"
            name="species"
            value={form.species}
            onChange={handleChange}
            required
          />
          <TextField
            label="Breed"
            name="breed"
            value={form.breed}
            onChange={handleChange}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained">
            Add Pet
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
