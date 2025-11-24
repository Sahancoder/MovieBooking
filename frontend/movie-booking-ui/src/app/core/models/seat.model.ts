export type SeatStatus = 'available' | 'reserved' | 'selected';

export interface Seat {
  row: string;
  number: number;
  status: SeatStatus;
}

