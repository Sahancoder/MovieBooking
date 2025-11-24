export interface SeatPosition {
  row: string;
  number: number;
}

export interface Booking {
  id: string;
  movieId: string;
  showtimeId: string;
  createdAt: string;
  totalPrice: number;
  seats: SeatPosition[];
}

