import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieDataService } from '../../core/services/movie-data.service';
import { Movie } from '../../core/models/movie.model';
import { Showtime } from '../../core/models/showtime.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss'
})
export class MovieDetailComponent implements OnInit {
  private api = inject(MovieDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movie?: Movie;
  showtimes: Showtime[] = [];
  selectedShowtime?: Showtime;

  loading = true;
  error?: string;

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('movieId') ?? 'movie1';

    this.api.getMovie(movieId).subscribe({
      next: m => {
        this.movie = m;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading movie:', err);
        this.error = 'Failed to load movie. Check Firebase config and Firestore rules.';
        this.loading = false;
      }
    });

    this.api.getShowtimes(movieId).subscribe({
      next: sts => {
        this.showtimes = sts;
        if (sts.length > 0) this.selectedShowtime = sts[0];
      },
      error: (err) => {
        console.error('Error loading showtimes:', err);
        this.error = 'Failed to load showtimes. Make sure Firestore has data.';
      }
    });
  }

  selectShowtime(s: Showtime) {
    this.selectedShowtime = s;
  }

  goToSeats() {
    if (!this.movie || !this.selectedShowtime) return;
    this.router.navigate([
      '/movie',
      this.movie.id,
      'showtime',
      this.selectedShowtime.id,
      'seats'
    ]);
  }

  goBack() {
    this.router.navigateByUrl('/');
  }
}
