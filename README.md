# PoP🍿 (potential-octo-potato)

# 📑 Table of Contents

1. [Overview](#overview)
2. [System Components](#system-components)
   - [PoP Backend API (Node.js + MongoDB)](#1-pop-backend-nodejs--mongodb)
   - [PoP Ticket Booking App](#2-pop-ticket-booking-app)
   - [PoP Ticket Validator App](#3-pop-ticket-validator-app)
   - [PoP Show Schedule Kisok App](#4-pop-show-schedule-kiosk-app)
3. [Features](#features)
4. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#1-prerequisites)
   - [Deployment Guide](#deployment-guide)
5. [Physical Setup Instructions](#physical-setup-instructions)
6. [Local Development Setup](#local-development-setup)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)
10. [Future Enhancements](#future-enhancements)
11. [Credits](#credits)


## Overview

The **PoP (potential-octo-potato)** is a home-theater software designed for home lab setups. It includes multiple interconnected applications that handle show scheduling, ticket booking and validation, and live display of screenings. The system can be self-hosted on a homelab and accessed securely through a home VPN.

## System Components

### 1. PoP Backend (Node.js + MongoDB)

* Backend service that manages data.
* Handles:
    
  * Popular, Top Rated and Trending Movies and Tv Shows data from TMDB on startup
  * Provides server-sided pagination for efficient data delivery
  * Show bookings and schedules
  * Ticket generation & validation

### 2. PoP Ticket Booking App

* Built as a React Single Page Application (SPA) and Progressive Web App (PWA) with a mobile-first design.
* Allows for browsing movies / tv shows and booking tickets.
* Generates digital tickets.
* Displays where to stream the selected title from.

### 3. PoP Ticket Validator App

* Interface for validating booked tickets via QR code.
* Makes use of the backend API for verification.

### 4. PoP Show Schedule Kiosk App

* Display app showing **Now Showing** and **Next Up** movies.
* Automatically refreshes based on backend schedule data.

## Features

* Automatic data refresh from TMDB once every 24 hours.
* REST API-based communication
* Dockerized for consistent deployment
* Server-sided pagination
* Automatic TMDB data fetching and caching
* Search for any Movie or TV Show

Optional future extensions:

* Admin Dashboard
* Notification Service
* Media Automation Layer

## Setup Instructions

### 1. Prerequisites

* Docker and Docker Compose installed.
* A valid **TMDB account**, **API key**, and **access token**. Follow this [link](https://developer.themoviedb.org/docs/getting-started) to create an account and generate the tokens as per the instructions given on the page.
* Know the **ISO-3166-1** code of the country you live in or want to watch media of (Simple google search reveals this, e.g. - ISO-3166-1 country code for India).

## Deployment Guide

Each PoP service is containerized and can be deployed using **Docker Compose**. Follow these steps to ensure a proper setup.

### 1. Create a Docker Network

Create a dedicated network for all PoP services:

```bash
docker network create pop-net
```

### 2. MongoDB Setup

Create a MongoDB container with persistent storage using the following Docker Compose configuration:

1. Create a directory for MongoDB:

```bash
mkdir mongodb
cd mongodb
```

2. Create a docker compose file in this directory

```bash
nano docker-compose.yml
```
Replace the `</path/to/data/storage>` with your desired path and paste the following contnent in the compose file then save and exit using `Ctrl+O`>`Enter`>`Ctrl+X`

```yaml
version: "3.9"

services:
  mongo:
    image: mongo:latest
    container_name: mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - </path/to/data/storage>:/data/db  # e.g., /hdd/prod/mongo/data
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: <strongpassword>
    networks:
      - pop-net

networks:
  pop-net:
    external: true
```

If a MongoDB container already exists, attach it to the `pop-net` network.

```bash
docker network connect pop-net <existing_mongo_container_name>
```

After the container is running, create a new database `potential-octo-potato` and add a user with your preferred credentials.

- Connect to the running MongoDB container
```bash
docker exec -it <existing_mongo_container_name> mongosh -u root -p <strongpassword> --authenticationDatabase admin
```

- Create a new database
```bash
use potential-octo-potato
```

- Create a new user with password and roles
```bash
db.createUser({
  user: "<your_db_user>",
  pwd: "<your_db_password>",
  roles: [{ role: "readWrite", db: "potential-octo-potato" }]
})
```

- Verify the user creation
```bash
show users
```

- Exit the Mongo shell
```bash
exit
```

### 3. Nginx Setup

1. Create a directory for Nginx configuration:

```bash
mkdir nginx
cd nginx
```

2. Inside this directory, create `nginx.conf` with the following content then save and exit using `Ctrl+O`>`Enter`>`Ctrl+X`:

```bash
nano nginx.conf
```

```nginx
server {
    listen 80;

    server_name _;

    # PoP Frontend
    location /pop/ {
        proxy_pass http://popfrontend:4173/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # PoP Backend API
    location /pop/api/ {
        proxy_pass http://popbackend:3333/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # PoP Show Schedule
    location /pop-show-schedule/ {
        proxy_pass http://pop-show-schedule:4174/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # PoP Ticket Validator
    location /pop-ticket-validator/ {
        proxy_pass http://pop-ticket-validator:4174/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Create an Nginx container using the following compose file in the same directory as `nginx.conf`:

    - Create a `docker-compose.yml` file:

      ```bash
      nano docker-compose.yml
      ```

    - Paste the following configuration into `docker-compose.yml` then save and exit using `Ctrl+O`>`Enter`>`Ctrl+X`:

      ```yaml
      version: "3.9"

      services:
        nginx:
          image: nginx:alpine
          container_name: nginx
          restart: unless-stopped
          ports:
            - "80:80"
          volumes:
            - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
          networks:
            - pop-net

      networks:
        pop-net:
          external: true
      ```

    If an Nginx container already exists, attach it to the `pop-net` network.
    ```bash
    docker network connect pop-net <existing_nginx_container_name>
    ```

### 4. PoP Services Deployment

1. Create a deployment directory and `docker-compose.yml` file:

```bash
mkdir pop
cd pop
nano docker-compose.yml
```

2. Paste the following configuration into `docker-compose.yml` then save and exit using `Ctrl+O`>`Enter`>`Ctrl+X`:

    In the backend service -

    - Replace the placeholders PoP_DB_USER, PoP_DB_USER_PASSWORD with the user credentials created eralier for the db `potential-octo-potato`
      > Note- if the password containes special characters (@,#,$ etc.) then they must be url encoded before pasting in the compose file.

    - Provide your `TMDB_API_KEY` and `REGION` 

```yaml
version: "3.9"

services:
  backend:
    image: aakarshanbasubhardwaj/popbackend:latest
    container_name: popbackend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGO_URI_PROD=mongodb://{PoP_DB_USER}:{PoP_DB_USER_PASSWORD}@mongo:27017/potential-octo-potato?authSource=potential-octo-potato
      - TMDB_API_KEY=<your_TMDB_API_KEY_here>
      - REGION=<ISO-3166-1_country_code>
      - PORT=<desired_PORT>
    networks: 
      - pop-net

  frontend:
    image: aakarshanbasubhardwaj/popfrontend:latest
    container_name: popfrontend
    restart: unless-stopped
    networks: 
      - pop-net

  pop-show-schedule:
    image: aakarshanbasubhardwaj/pop-show-schedule:latest
    container_name: pop-show-schedule
    restart: unless-stopped
    networks:
      - pop-net

  pop-ticket-validator:
    image: aakarshanbasubhardwaj/pop-ticket-validator:latest
    container_name: pop-ticket-validator
    restart: unless-stopped
    networks:
      - pop-net

networks:
  pop-net:
    external: true
```

3. Deploy all PoP services:

```bash
docker-compose up -d
```

Verify deployment by trying to access all apps using - 

* **PoP🍿 Ticket Booking App::** `http://<server-ip>/pop`
* **PoP Show Schedule Kiosk App:** `http://<server-ip>/pop-show-schedule/`
* **PoP Ticket Validator App:** `http://<server-ip>/pop-ticket-validator/`
* **PoP Backend:** `http://<server-ip>/pop/api/test`

For example if your server's VPN IP is 10.0.0.1 then access the PoP🍿 Ticket Booking App at ```http://10.0.0.1/pop/```

If deployment was successful then **PoP Backend:** - displays `{"message":"Test Successful"}` and all other apps load and display thier content.

## Physical Setup Instructions

To provide a cinema-like experience in your home theater, you can set up PoP services on dedicated devices:

* **PoP Show Schedule Kiosk App:**

  * Use a dedicated screen (e.g., old laptop or tablet) mounted on a wall just outside the home theater room.
  * Run the **PoP Show Schedule Kiosk App** in full-screen mode from a browser to display **Now Showing** and **Next Up** movies.
    >  If using android tablet it is recommended to use DuckDuckGo, Edge works fine with PCs, Chrome or Brave can also be used, for ios use Safari.
    
    > Note: If the app does not open in full screen mode then try clicking or tapping anywhere on the screen and it will open in full screen mode.

* **PoP Ticket Validator App:**

  * Can run on another device with a front facing camera such as an old phone or tablet.
  * Ideally mounted below or near the PoP Show Schedule Kiosk App for easy access.

  Alternatively use another handheld device to run the PoP Ticket Validator App.( This will require manual handling of the validation process hence not a preferred way)

* **PoP🍿 Ticket Booking App:**

  * Accessible from any mobile device in a browser, allowing users to browse and book tickets.

* **Backend & Frontend Hosting:**

  * All frontend apps and the backend must be **self-hosted on the home lab server** (see Deployment section) for proper functionality of the ecosystem.

## Local Development Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:aakarshanbasubhardwaj/potential-octo-potato.git
   cd potential-octo-potato
   ```

2. If not running already, create and run a MongoDB container using the followign compose - 

    ```yml
    version: "3.9"

    services:
      mongo:
        image: mongo:latest
        container_name: mongo-dev
        ports:
          - "27018:27017"
        volumes:
          - </path/to/desired/data/storage>:/data/db
    ```

2. Set up environment variables:
    - In the `backend` folder -
      ```bash
      cd backend
      touch .env
      ```

      In the .env file provide the MONGO_URI_DEV, TMDB_API_KEY, REGION and PORT

      ```text
      MONGO_URI_DEV=mongodb://localhost:<27018>/potential-octo-potato
      TMDB_API_KEY=<your_TMDB_API_KEY_here>
      REGION=<ISO-3166-1_country_code>
      PORT=<desired_port>
      ```
    - In the `frontend/potential-octo-potato` folder -

      ```bash
      cd ../frontend/potential-octo-potato
      touch .env
      ```

      In the .env file provide the VITE_API_URL

      ```text
      VITE_API_URL=http://localhost:<same_port_number_as_specified_in_backend>
      ```    

    - In the `frontend/potential-octo-potato-show-schedule` folder -

      ```bash
      cd ../potential-octo-potato-show-schedule
      touch .env
      ```

      In the .env file provide the REACT_APP_API_URL

      ```text
      REACT_APP_API_URL=http://localhost:<same_port_number_as_specified_in_backend>
      ```  

    - In the `frontend/potential-octo-potato-ticket-validator` folder -

      ```bash
      cd ../potential-octo-potato-ticket-validator
      touch .env
      ```

      In the .env file provide the REACT_APP_API_URL

      ```text
      REACT_APP_API_URL=http://localhost:<same_port_number_as_specified_in_backend>
      ```  

3. Run services locally:

    - In the `backend` folder -

      ```bash
      npm i
      npm run server
      ```

    - In the `frontend/potential-octo-potato` folder -

      ```bash
      npm i
      npm run dev
      ``` 

    - In the `frontend/potential-octo-potato-show-schedule` folder -

      ```bash
      npm i
      npm run start
      ``` 

    - In the `frontend/potential-octo-potato-ticket-validator` folder -

      ```bash
      npm i
      npm run start
      ```

4. Access apps at their respective local ports as displayed in the console.

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

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Credits for TMDb data: [TMDb](https://www.themoviedb.org/)

## Contact

For questions, suggestions, or collaboration:

* **Email:** [aakarshanbasubhardwaj@gmail.com](mailto:aakarshanbasubhardwaj@gmail.com)
<!-- * **GitHub:** [your-username](https://github.com/your-username) -->

## Future Enhancements

* WebSocket live updates between apps
* Admin analytics dashboard
* Smart-home integration for lighting and media control
* Automatic trailer and poster fetching from TMDB API

## Credits

This project uses **The Movie Database (TMDb) API** for movie and TV show data.  
All data and images are © TMDb.  

[Visit TMDb](https://www.themoviedb.org/)
