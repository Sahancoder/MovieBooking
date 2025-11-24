import { Routes } from '@angular/router';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection';
import { TicketComponent } from './pages/ticket/ticket';

export const routes: Routes = [
  { path: '', redirectTo: 'movie/movie1', pathMatch: 'full' },
  { path: 'movie/:movieId', component: MovieDetailComponent },
  {
    path: 'movie/:movieId/showtime/:showtimeId/seats',
    component: SeatSelectionComponent
  },
  { path: 'booking/:bookingId', component: TicketComponent },
  { path: '**', redirectTo: 'movie/movie1' }
];
