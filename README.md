# 🎬 MovieBooking – Mobile Movie Ticket App (Angular + Firebase)

![MovieBooking Logo](images%20(3).png)

**MovieBooking** is a mobile-first movie ticket booking UI built with **Angular** and **Firebase (Firestore + Hosting)**.  
You can browse a movie, pick a showtime, select your seats, and view a mobile ticket – all from a clean, cinematic interface.

---

## 📸 UI Preview

<p align="center">
  <img src="Movie%20Page.png" alt="Movie details page" width="30%" />
  <img src="Book%20Tickets.png" alt="Seat selection screen" width="30%" />
  <img src="Your%20Ticket.png" alt="Mobile ticket screen" width="30%" />
</p>

---

## ✨ Features

- 🎥 **Movie details view**
  - Poster, title, subtitle, description, duration, rating, genre
- 🕒 **Showtime selection**
  - List of showtimes with date & time chips
- 🎟️ **Seat selection**
  - Visual seat grid (rows A–G, seat numbers)
  - Seat states: available, reserved, selected
  - Total price calculated from Firestore data
- 📱 **Mobile ticket**
  - Shows movie info, showtime, selected seats and total price
  - Barcode-style visual to match real cinema tickets
- ☁️ **Firebase backend**
  - Movies, showtimes, bookings stored in **Cloud Firestore**
  - App hosted on **Firebase Hosting**

---

## 🛠 Tech Stack

- **Frontend:** Angular (standalone components, SCSS, mobile-first layout)
- **Backend:** Firebase  
  - **Cloud Firestore** for movies, showtimes, bookings  
  - **Firebase Hosting** for deployment
- **Language:** TypeScript, HTML, SCSS

---

## 📂 Project Structure

```text
MovieBooking/
  frontend/
    movie-booking-ui/
      src/
        app/
          core/
            models/          # Movie, Showtime, Seat, Booking interfaces
            services/
              movie-data.service.ts   # All Firestore reads/writes
          pages/
            movie-detail/    # Movie info + showtime selection screen
            seat-selection/  # Seat grid + booking screen
            ticket/          # Mobile ticket view
          app.routes.ts
          app.config.ts
          app.component.*
        environments/
          environment.ts         # Dev Firebase config
          environment.prod.ts    # Prod Firebase config
        styles.scss              # Global design tokens + base styles
      firebase.json              # Firebase Hosting config
      .firebaserc
