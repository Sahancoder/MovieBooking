import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieDataService } from '../../core/services/movie-data.service';
import { Booking } from '../../core/models/booking.model';
import { Movie } from '../../core/models/movie.model';
import { Showtime } from '../../core/models/showtime.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './ticket.html',
  styleUrl: './ticket.scss'
})
export class TicketComponent implements OnInit {
  private api = inject(MovieDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  booking?: Booking;
  movie?: Movie;
  showtime?: Showtime;
  loading = true;
  error?: string;

  bars = Array.from({ length: 24 });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('bookingId') ?? '';

    this.api.getBooking(id).subscribe({
      next: b => {
        this.booking = b;
        this.loadMovieAndShowtime();
      },
      error: () => {
        this.error = 'Failed to load ticket.';
        this.loading = false;
      }
    });
  }

  private loadMovieAndShowtime() {
    if (!this.booking) return;

    this.api.getMovie(this.booking.movieId).subscribe({
      next: m => {
        this.movie = m;
        this.checkComplete();
      }
    });

    this.api.getShowtimes(this.booking.movieId).subscribe({
      next: sts => {
        this.showtime = sts.find(s => s.id === this.booking!.showtimeId);
        this.checkComplete();
      }
    });
  }

  private checkComplete() {
    if (this.movie && this.showtime) {
      this.loading = false;
    }
  }

  get seatsString(): string {
    if (!this.booking || !this.booking.seats) return '';
    return this.booking.seats.map(s => s.row + s.number).join(', ');
  }

  goBack() {
    this.router.navigate(['/movie', this.booking?.movieId ?? 'movie1']);
  }
}
