export interface Showtime {
  id: string;
  movieId: string;
  startTime: string; // from Firestore Timestamp -> toDate().toISOString()
  auditoriumName: string;
  basePrice: number;
}

