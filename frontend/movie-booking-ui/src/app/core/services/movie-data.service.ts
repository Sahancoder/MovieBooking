import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  query,
  where,
  addDoc,
  Timestamp,
  DocumentData
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Showtime } from '../models/showtime.model';
import { Booking, SeatPosition } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class MovieDataService {
  private firestore = inject(Firestore);

  // ---- MOVIES ----

  getMovie(movieId: string): Observable<Movie> {
    const ref = doc(this.firestore, 'movies', movieId);
    return docData(ref, { idField: 'id' }) as Observable<Movie>;
  }

  // ---- SHOWTIMES ----

  getShowtimes(movieId: string): Observable<Showtime[]> {
    const colRef = collection(this.firestore, 'showtimes');
    const qRef = query(colRef, where('movieId', '==', movieId));

    return collectionData(qRef, { idField: 'id' }).pipe(
      map((docs: DocumentData[]) =>
        docs.map((d) => {
          const ts = d['startTime'] as Timestamp;

          const showtime: Showtime = {
            id: d['id'] as string,
            movieId: d['movieId'] as string,
            startTime: ts.toDate().toISOString(),
            auditoriumName: (d['auditoriumName'] as string) ?? 'Hall 1',
            basePrice: Number(d['basePrice'] ?? 0)
          };

          return showtime;
        })
      )
    );
  }

  // ---- BOOKINGS ----

  getBookingsForShowtime(showtimeId: string): Observable<Booking[]> {
    const colRef = collection(this.firestore, 'bookings');
    const qRef = query(colRef, where('showtimeId', '==', showtimeId));

    return collectionData(qRef, { idField: 'id' }).pipe(
      map((docs: DocumentData[]) =>
        docs.map((d) => {
          const ts = d['createdAt'] as Timestamp;

          const booking: Booking = {
            id: d['id'] as string,
            movieId: d['movieId'] as string,
            showtimeId: d['showtimeId'] as string,
            createdAt: ts.toDate().toISOString(),
            totalPrice: Number(d['totalPrice'] ?? 0),
            seats: (d['seats'] as SeatPosition[]) ?? []
          };

          return booking;
        })
      )
    );
  }

  async createBooking(options: {
    movieId: string;
    showtimeId: string;
    seats: SeatPosition[];
    pricePerSeat: number;
  }): Promise<string> {
    const colRef = collection(this.firestore, 'bookings');
    const totalPrice = options.seats.length * options.pricePerSeat;

    const docRef = await addDoc(colRef, {
      movieId: options.movieId,
      showtimeId: options.showtimeId,
      seats: options.seats,
      totalPrice,
      createdAt: Timestamp.now()
    });

    return docRef.id;
  }

  getBooking(bookingId: string): Observable<Booking> {
    const ref = doc(this.firestore, 'bookings', bookingId);

    return docData(ref, { idField: 'id' }).pipe(
      map((d: any) => {
        const ts = d['createdAt'] as Timestamp;

        const booking: Booking = {
          id: d['id'] as string,
          movieId: d['movieId'] as string,
          showtimeId: d['showtimeId'] as string,
          createdAt: ts.toDate().toISOString(),
          totalPrice: Number(d['totalPrice'] ?? 0),
          seats: (d['seats'] as SeatPosition[]) ?? []
        };

        return booking;
      })
    );
  }
}
