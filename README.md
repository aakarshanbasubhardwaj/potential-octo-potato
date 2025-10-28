look into qr code reading for the validator app

create docker containers
dynamic port mapping for each app 
check mongo db for the app

------------------------------------
# 🎬 POP (potential-octo-potato)

# 📑 Table of Contents

1. [Overview](#overview)
2. [System Components](#system-components)

   * [Backend API (Node.js + MongoDB)](#1-backend-api-nodejs--mongodb)
   * [Booking App](#2-booking-app)
   * [Ticket Validator App](#3-ticket-validator-app)
   * [Show Schedule Kiosk](#4-show-schedule-kiosk)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Setup Instructions](#setup-instructions)

   * [Prerequisites](#1-prerequisites)
   * [Configuration](#2-configuration)
6. [Deployment](#deployment)

   * [Example docker-compose.yml](#example-docker-composeyml-structure)
7. [Physical Setup Instructions](#physical-setup-instructions)
8. [Running](#running)
9. [Development Setup](#development-setup)
10. [Contributing](#contributing)

    * [Contribution Ideas](#contribution-ideas)
11. [License](#license)
12. [Contact](#contact)
13. [Future Enhancements](#future-enhancements)


## Overview

The **POP (potential-octo-potato)** is a complete home-theater software suite designed for private setups. It includes multiple interconnected applications that handle show scheduling, ticket booking, validation, and live display of screenings. The system can be self-hosted on a homelab and accessed securely through a home VPN.

---

## System Components

### 1. Backend API (Node.js + MongoDB)

* Core service that manages data.
* Handles:
    
  * Fetches movie and show data from TMDB on startup
  * Provides server-side pagination for efficient data delivery
  * Show bookings and schedules
  * Ticket generation & validation

### 2. Booking App

* Built as a React Single Page Application (SPA) and Progressive Web App (PWA) with a mobile-first design.
* Allows for browsing movies and booking tickets.
* Generates digital tickets.

### 3. Ticket Validator App

* Interface for validating booked tickets via QR code.
* Makes use of the backend API for verification.

### 4. Show Schedule Kiosk

* Display app showing **Now Showing** and **Next Up** movies.
* Automatically refreshes based on backend schedule data.

---

## Features

* Modular architecture (each app runs independently)
* REST API-based communication
* Dockerized for consistent deployment
<!-- * Works fully offline over local network or VPN -->
* Server-side pagination
* Automatic TMDB data fetching and caching
* Search for any Movie or TV Show
* Extendable with admin panel, notifications, and automation

---

## Architecture

```
[Booking App (React PWA)]   ┐
                            │
[Ticket Validator]          ├──>  [Backend API (Node.js)]  <──> [MongoDB (Docker)]
                            │
[Schedule Kiosk]            ┘
```

Optional future extensions:

* [Admin Dashboard]
* [Notification Service]
* [Media Automation Layer]

---

## Setup Instructions

### 1. Prerequisites

* Docker and Docker Compose installed.
* MongoDB must run as a **Docker container**.
* A valid **TMDB account**, **API key**, and **access token**.

### 2. Configuration

Create a `config.js` file inside the backend directory:

```js
export default {
    "TMDB_API_KEY" : "<your-TMDB-API-key>",
    "TMDB_BASE_URL" : "https://api.themoviedb.org/3",
    "REGION" : "<ISO-3166-1 code of the country you live in or want to watch media of>"
}
```

On server startup, the backend will automatically fetch data from TMDB once and populate MongoDB with the popular, top rated and trending movie and TV show listings. The MongoDB Data is refreshed every 24 hours.

---

## Deployment

Each service is containerized and can be deployed via **Docker Compose**.

### Example `docker-compose.yml` structure

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3333:3333"
    env_file:
      - .env
    depends_on:
      - mongo

  booking-app:
    build: ./booking-app
    ports:
      - "8080:80"
    depends_on:
      - backend

  validator-app:
    build: ./validator-app
    ports:
      - "8081:80"
    depends_on:
      - backend

  kiosk-app:
    build: ./kiosk-app
    ports:
      - "8082:80"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```
## Physical Setup Instructions

To provide a cinema-like experience in your home theater, you can set up your ecosystem components on dedicated devices:

* **Show Schedule Kiosk:**

  * Use a dedicated screen (e.g., old laptop or tablet) mounted on a wall just outside the home theater.
  * Run the **Show Schedule Kiosk app** in full-screen mode to display **Now Showing** and **Next Up** movies.

* **Ticket Validator:**

  * Can run on another device with a front facing camera such as an old phone or tablet.
  * Ideally mounted below or near the show schedule kiosk for easy access.

* **Booking App:**

  * Accessible from any mobile device, allowing users to browse and book tickets.

* **Backend & Frontend Hosting:**

  * All frontend apps and the backend must be **self-hosted on the home lab server** (see Deployment section) for proper functionality of the ecosystem.

---

### Running

```bash
docker-compose up -d --build
```

Access each app via:

* **Booking App:** `http://<server-ip>:8080`
* **Ticket Validator:** `http://<server-ip>:8081`
* **Kiosk Display:** `http://<server-ip>:8082`
* **Backend:** `http://<server-ip>:3333`
---

## Development Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:aakarshanbasubhardwaj/potential-octo-potato.git
   cd movie-ecosystem
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in your MongoDB URI, TMDB API key, and access token.

3. Run services locally:

   ```bash
   docker-compose up
   ```

4. Access apps at their respective local ports.

---

## Contributing

We welcome contributions! Here’s how to get involved:

1. **Fork** the repository.
2. **Create** a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear messages.
4. **Push** to your fork and open a **pull request**.

### Contribution Ideas

* Add admin dashboard (for show/ticket management)
* Implement authentication & roles (user/admin/validator)
* Improve UI/UX of booking and kiosk apps
* Add automated notifications (email, push)
* Integrate with home automation (media playback triggers)

---

## License

Specify license here (e.g., MIT, Apache 2.0, etc.).

---

## Contact

For questions, suggestions, or collaboration:

* **Email:** [aakarshanbasubhardwaj@gmail.com](mailto:aakarshanbasubhardwaj@gmail.com)
<!-- * **GitHub:** [your-username](https://github.com/your-username) -->

---

## Future Enhancements

* WebSocket live updates between apps
* Admin analytics dashboard
* Smart-home integration for lighting and media control
* Automatic trailer and poster fetching from TMDB API

---

> This project aims to bring a professional movie theater experience to your home network — fully open-source, modular, and customizable.
