import type { Pet } from "./pet";

export interface Appointment {
  id: number;
  dateTime: string;
  reason: string;
  pet: Pet;
}
