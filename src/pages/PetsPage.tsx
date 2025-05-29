import { Container, Typography } from "@mui/material";
import PetList from "../components/PetList";
import AddPetForm from "../components/AddPetForm";

export default function PetsPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pet Records
      </Typography>
      <AddPetForm />
      <PetList />
    </Container>
  );
}
