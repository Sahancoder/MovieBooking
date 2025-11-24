import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieDataService } from '../../core/services/movie-data.service';
import { Showtime } from '../../core/models/showtime.model';
import { Booking } from '../../core/models/booking.model';
import { Seat, SeatStatus } from '../../core/models/seat.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.scss'
})
export class SeatSelectionComponent implements OnInit {
  private api = inject(MovieDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movieId!: string;
  showtimeId!: string;

  showtime?: Showtime;
  seatRows: Seat[][] = [];

  pricePerSeat = 15;
  selectedSeats: Seat[] = [];

  loading = true;
  error?: string;

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('movieId') ?? 'movie1';
    this.showtimeId = this.route.snapshot.paramMap.get('showtimeId') ?? '';

    this.api.getShowtimes(this.movieId).subscribe({
      next: sts => {
        this.showtime = sts.find(s => s.id === this.showtimeId);
        if (this.showtime) this.pricePerSeat = this.showtime.basePrice;
      },
      error: () => {
        this.error = 'Failed to load showtime.';
      }
    });

    this.api.getBookingsForShowtime(this.showtimeId).subscribe({
      next: bookings => {
        this.buildSeatGrid(bookings);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load seats.';
        this.loading = false;
      }
    });
  }

  private buildSeatGrid(bookings: Booking[]) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const cols = 10;
    const reservedSet = new Set<string>();

    for (const b of bookings) {
      for (const seat of b.seats) {
        reservedSet.add(`${seat.row}-${seat.number}`);
      }
    }

    this.seatRows = rows.map(row => {
      const rowSeats: Seat[] = [];
      for (let num = 1; num <= cols; num++) {
        const key = `${row}-${num}`;
        const status: SeatStatus = reservedSet.has(key)
          ? 'reserved'
          : 'available';
        rowSeats.push({ row, number: num, status });
      }
      return rowSeats;
    });
  }

  toggleSeat(seat: Seat) {
    if (seat.status === 'reserved') return;

    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(
        s => !(s.row === seat.row && s.number === seat.number)
      );
    } else {
      seat.status = 'selected';
      this.selectedSeats.push(seat);
    }
  }

  get totalPrice() {
    return this.selectedSeats.length * this.pricePerSeat;
  }

  get selectedSeatsString(): string {
    if (this.selectedSeats.length === 0) return 'None';
    return this.selectedSeats.map(s => s.row + s.number).join(', ');
  }

  goBack() {
    this.router.navigate(['/movie', this.movieId]);
  }

  async buy() {
    if (!this.showtime || this.selectedSeats.length === 0) return;

    const bookingId = await this.api.createBooking({
      movieId: this.movieId,
      showtimeId: this.showtimeId,
      pricePerSeat: this.pricePerSeat,
      seats: this.selectedSeats.map(s => ({
        row: s.row,
        number: s.number
      }))
    });

    this.router.navigate(['/booking', bookingId]);
  }
}
