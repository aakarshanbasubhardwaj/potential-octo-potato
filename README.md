creata netwrok - docker network create pop-net
add mongo db and nginx to this network
create a user in pop db 
give cred in env in compose

look into qr code reading for the validator app
make it wokr using IP

create .env ansd pop with the content
server ip or monmgodb container name
docker compose uri from ongo in backend "mongodb://popuser:popUser@123@10.0.0.1:27017/potential-octo-potato?authSource=potential-octo-potato"
and env environment:
  - NODE_ENV=production
  - MONGO_URI_PROD=mongodb://popuser:app_password_here@10.0.0.1:27017/potential-octo-potato?authSource=potential-octo-potato

# 1. Build the image and name it 'pop:latest'
docker build -t pop:latest .

# 2. Tag it for Docker Hub
docker tag pop:latest yourusername/pop:latest

# 3. Log in to Docker Hub
docker login

# 4. Push the image
docker push yourusername/pop:latest

# 5. (Optional) Pull elsewhere to verify
docker pull yourusername/pop:latest

dynamic port mapping for each app 

1️⃣ Frontend API calls (server-ip:3333) → no changes for dev & prod

Right now, your frontend is hardcoding the backend via server-vpn-ip:3333. That breaks portability because:

Local dev uses localhost:3333

Prod should go via Nginx reverse proxy (/api)

Solution: Use relative paths with environment variables.

Step 1: Use REACT_APP_API_URL

In all React apps:

const API_URL = process.env.REACT_APP_API_URL || '/api';


Local dev: .env:

REACT_APP_API_URL=http://localhost:3333/api


Prod: .env or Docker build arg:

REACT_APP_API_URL=/api


Then in fetch calls:

fetch(`${API_URL}/movies`)


✅ This way, same code works in dev and production:

Dev → calls backend container or localhost

Prod → Nginx handles /api → backend

No code changes required between environments.

2️⃣ MongoDB container

You already have a MongoDB container running on prod. Two choices:

Option A: Use existing MongoDB database for this app

Use a dedicated database name (not the default test) for this ecosystem.

In your backend .env:

MONGO_URI=mongodb://mongo:27017/pop_ecosystem


Backend will only connect and create collections in this DB.

No attempt to start another Mongo container is needed.

Option B: Separate Mongo container (if isolation desired)

Create a new container in Docker Compose:

mongo-pop:
  image: mongo:latest
  container_name: mongo-pop
  volumes:
    - mongo_pop_data:/data/db
  networks:
    - pop-net


Use a separate DB name to avoid conflicts: pop_ecosystem

Volumes ensure data persists.

💡 Recommendation: Option A is cleaner if you want to avoid extra containers.

3️⃣ Nginx container for the ecosystem

You want a single Nginx container on the prod server to serve all 3 frontends + backend.

Steps:

Create Dockerfile:

# nginx/Dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


Nginx config (nginx.conf):

server {
    listen 80;

    # Booking App
    location /booking/ {
        proxy_pass http://frontend-booking:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Validator App
    location /validator/ {
        proxy_pass http://frontend-validator:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Kiosk App
    location /kiosk/ {
        proxy_pass http://frontend-kiosk:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:3333/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}


Docker Compose snippet (if you want to integrate):

nginx:
  build: ./nginx
  container_name: nginx-proxy
  ports:
    - "80:80"
  depends_on:
    - backend
    - frontend-booking
    - frontend-validator
    - frontend-kiosk
  networks:
    - pop-net


If you already have a shared Nginx container in your home lab, you can just add a new config file and reload Nginx.

No third-party packages are needed.

4️⃣ Docker networking

All containers (backend, 3 frontends, Nginx) should be on the same Docker network:

networks:
  pop-net:
    driver: bridge


This allows Nginx to resolve container names internally (http://frontend-booking:80).

✅ Summary of What You Need to Do

Frontend:

Use relative paths or REACT_APP_API_URL → /api in prod

Local dev still works with localhost:3333

Backend:

Connect to either existing MongoDB DB (pop_ecosystem) or separate container

Frontend Containers:

Build production React apps (npm run build)

Serve via their own containers (Nginx or lightweight server)

Nginx Container:

Single container serving all 3 frontends + reverse proxy to backend

Mount production build folders for each frontend

Docker Compose / Network:

Shared network for backend, frontend containers, Nginx

Expose only Nginx to host (80/443)

I can also write the final production-ready Docker Compose + environment setup for this scenario so that:

You just docker-compose up -d

Frontends call backend automatically

MongoDB uses existing DB

Nginx routes everything correctly

Do you want me to do that?

so in nginnx config i cna give localhost with different ports fo different apps?

ChatGPT said:Yes — that’s exactly how you would do it if your Nginx is running on the host, outside Docker.
Here’s the logic:

1️⃣ Expose container ports to host
In your docker-compose.yml for each app:
frontend-booking:
  build: ./frontend-booking
  ports:
    - "8080:80"      # maps container port 80 → host 8080

frontend-validator:
  build: ./frontend-validator
  ports:
    - "8081:80"

frontend-kiosk:
  build: ./frontend-kiosk
  ports:
    - "8082:80"

backend:
  build: ./backend
  ports:
    - "3333:3333"


2️⃣ Nginx config (host)
You can now use localhost with those ports:
server {
    listen 80;

    location /booking/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /validator/ {
        proxy_pass http://127.0.0.1:8081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /kiosk/ {
        proxy_pass http://127.0.0.1:8082/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3333/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
>>>so best way to this right now is to have github actions build the prod build fo rall backend and formtned apps then the docker image cretaion using the docker fil e for all apps by simply copying th ebuild folders in the nginx base reference containers and then pushing the images to docker hub, then mamnually go into prod server to run docker coimpose to which has fetch from the docker hub and run the continers wiht desired ports on the host, and then go ahead an edit the nginx conf?
Yes — that workflow is completely valid and is basically the classic “build in CI, deploy manually” approach. Let me break it down cleanly and point out potential pitfalls and optimizations:
>>>
✅ Workflow Overview


GitHub Actions CI/CD


Pulls full source code.


Builds backend image (Node.js/Express).


Builds frontend apps into static files (npm run build) and copies them into Nginx-based containers.


Tags the images (e.g., pop-backend:latest, pop-booking:latest).


Pushes all images to Docker Hub (or another registry).




Production server


Pulls the images from Docker Hub.


Runs docker-compose up -d with a docker-compose.yml referencing the pulled images.


Maps backend and frontend containers to host ports as desired.


Edits/updates Nginx config for reverse proxy routing /api/ to backend and /booking, /validator, /kiosk to corresponding frontend container ports.





⚡ Pros


Simple, uses standard Docker and Docker Compose.


No need for self-hosted runners or local build on prod.


Keeps prod server clean — no source code, only images.


Easy rollback: pull older images from Docker Hub.



⚡ Cons / Gotchas


Manual Nginx edit


Each time ports change or you add new frontend, you need to update Nginx config and reload.


Can be automated via templates + CI/CD if desired.




Docker Hub dependency


Requires prod server to have internet access to Docker Hub.


If your VPN is isolated with no internet, this breaks.




Port changes


If backend host port changes, you need to update Nginx proxy to match — frontend doesn’t need changes, though.





⚡ Optimizations


Use environment variable templating in docker-compose.yml to control ports dynamically.


Preconfigure Nginx to route based on container names rather than hardcoded host ports:


location /api/ {
    proxy_pass http://backend:3333/;
}



Then all frontend apps just use /api/ and don’t care about host port.


If you do this, your Nginx config becomes portable and largely static, and all host port mapping is handled by Docker.



✅ Bottom line
Yes, your plan works and is fully functional for your home lab:


GitHub Actions builds → Docker Hub → Prod pulls → Docker Compose → Nginx proxy.


Optional: you can further automate Nginx edits or make it containerized so Nginx config is version-controlled too.



If you want, I can draft a production-ready Docker Compose + Nginx setup for your 1 backend + 3 frontend apps that:


Uses container names for proxying


Maps host ports dynamically


Eliminates most manual Nginx edits


Works with Docker Hub images


Do you want me to do that?

Perfect. Here's a production-ready setup for your home lab ecosystem — 1 backend + 3 frontend apps, using Docker Compose and a single Nginx container for reverse proxying. This eliminates most manual Nginx edits and uses container names for internal routing.

# docker-compose.prod.yml
version: "3.9"

services:
  backend:
    image: yourdockerhubusername/pop-backend:latest
    container_name: pop-backend
    restart: always
    environment:
      - MONGO_URI=mongodb://mongo:27017/pop_db
      - NODE_ENV=production
    networks:
      - pop-network

  booking-app:
    image: yourdockerhubusername/pop-booking:latest
    container_name: pop-booking
    restart: always
    networks:
      - pop-network

  validator-app:
    image: yourdockerhubusername/pop-validator:latest
    container_name: pop-validator
    restart: always
    networks:
      - pop-network

  kiosk-app:
    image: yourdockerhubusername/pop-kiosk:latest
    container_name: pop-kiosk
    restart: always
    networks:
      - pop-network

  nginx:
    image: nginx:alpine
    container_name: pop-nginx
    restart: always
    ports:
      - "80:80"       # frontend apps
      - "443:443"     # https if needed
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - booking-app
      - validator-app
      - kiosk-app
    networks:
      - pop-network

networks:
  pop-network:
    driver: bridge

Example nginx.conf
worker_processes 1;

events { worker_connections 1024; }

http {
    server {
        listen 80;

        # Backend API
        location /api/ {
            proxy_pass http://backend:3333/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Booking frontend
        location /booking/ {
            proxy_pass http://booking-app:80/;
            proxy_set_header Host $host;
        }

        # Validator frontend
        location /validator/ {
            proxy_pass http://validator-app:80/;
            proxy_set_header Host $host;
        }

        # Kiosk frontend
        location /kiosk/ {
            proxy_pass http://kiosk-app:80/;
            proxy_set_header Host $host;
        }
    }
}

✅ Key Features

Single Nginx container routes all frontends and backend API.

Uses container names inside Docker network (pop-network) for proxying — no need to edit Nginx for host port changes.

Docker Compose handles port mapping for public access (80/443).

Backend connects to MongoDB container or existing MongoDB instance via network name.

Static frontend files are already inside the Docker images (built via GitHub Actions).

Deployment Steps

On prod server:

mkdir pop-ecosystem && cd pop-ecosystem
# place docker-compose.prod.yml + nginx.conf here
docker-compose pull       # pull latest images from Docker Hub
docker-compose up -d      # start all containers


Access apps:

http://server-ip/booking/ → Booking app

http://server-ip/validator/ → Validator app

http://server-ip/kiosk/ → Kiosk app

http://server-ip/api/ → Backend API

This setup means no source code is required on prod, Nginx config is mostly static, and port changes on backend/frontend images don’t require edits.

If you want, I can also show how to adjust the Dockerfiles for the frontend apps so they build into the Nginx image properly, ready for this setup.

Do you want me to do that next?
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
