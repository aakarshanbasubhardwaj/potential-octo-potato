import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [data, setData] = useState(null);
  const [showType, setShowType] = useState("current");
  const [error, setError] = useState(null);

  const preloadImages = (shows) => {
    const imageBase = "https://image.tmdb.org/t/p/original";
    shows.forEach((show) => {
      if (!show) return;
      const img = new Image();
      img.src = imageBase + (show.backdrop_path || show.poster_path);
    });
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch("http://localhost:3333/nextShow/showSchedule");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      preloadImages([json.currentShow, json.nextShow]);
      setError(null);
      localStorage.setItem("cachedSchedule", JSON.stringify(json));
      localStorage.setItem("cachedTime", new Date().toISOString());
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);

      const cached = localStorage.getItem("cachedSchedule");
      if (cached) {
        console.warn("Loaded schedule from cache");
        const cachedData = JSON.parse(cached);
        setData(cachedData);
        preloadImages([cachedData.currentShow, cachedData.nextShow]);
      }
    }
  };

  const scheduleNextFetch = () => {
    const now = new Date();
    const nextFetch = new Date(now);

    if (now.getMinutes() < 30) {
      nextFetch.setMinutes(30, 5, 0); 
    } else {
      nextFetch.setHours(now.getHours() + 1);
      nextFetch.setMinutes(30, 5, 0); 
    }

    const delay = nextFetch - now;
    setTimeout(() => {
      fetchSchedule();
      scheduleNextFetch(); 
    }, delay);
  };

  useEffect(() => {
    
    const cached = localStorage.getItem("cachedSchedule");
    if (cached) setData(JSON.parse(cached));

    fetchSchedule(); 
    scheduleNextFetch(); 
  }, []);

  useEffect(() => {
    if (!data?.currentShow || !data?.nextShow) return;
    const interval = setInterval(() => {
      setShowType((prev) => (prev === "current" ? "next" : "current"));
    }, 20000);
    return () => clearInterval(interval);
  }, [data]);

  const renderShowCard = (show, label) => {
    const imageBase = "https://image.tmdb.org/t/p/original";
    return (
      <Card
        sx={{
          width: "99vw",
          height: "99vh",
          margin: "auto",
          borderRadius: 4,
          boxShadow: 6,
          overflow: "hidden",
          bgcolor: "rgba(0,0,0,0.7)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.02)",
            transition: "transform 15s ease-in-out",
            "&:hover": { transform: "scale(1.05)" },
          }}
          image={imageBase + (show.backdrop_path || show.poster_path)}
          alt={show.title}
        />
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.3) 100%)",
            py: 6,
            px: 4,
            color: "white",
            textAlign: "center",
            fontFamily: "'Bebas Neue', sans-serif",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: showType === "current" ? "#FFD700" : "#00FFFF",
                textShadow:
                  showType === "current"
                    ? "0 0 15px rgba(255,215,0,1), 0 0 30px rgba(255,215,0,0.7)"
                    : "0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(0,255,255,0.5)",
                mb: 2,
                animation:
                  showType === "current"
                    ? "pulseGlow 2s infinite"
                    : "flickerNeon 1.5s infinite",
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: 2,
                color: "#FFFFFF",
                mb: 3,
              }}
            >
              {show.title}
            </Typography>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "#FFD",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              {show.date} &nbsp;
            </Typography>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                letterSpacing: 3,
                color: "#fff",
              }}
            >
              {show.time}
            </Typography>
          </motion.div>
          <style>
            {`
              @keyframes pulseGlow {
                0% { text-shadow: 0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.5); }
                50% { text-shadow: 0 0 25px rgba(255,215,0,1), 0 0 50px rgba(255,215,0,0.7); }
                100% { text-shadow: 0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.5); }
              }

              @keyframes flickerNeon {
                0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { text-shadow: 0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(0,255,255,0.5); }
                20%, 24%, 55% { text-shadow: 0 0 5px rgba(0,255,255,0.5), 0 0 15px rgba(0,255,255,0.3); }
              }
            `}
          </style>
        </CardContent>
      </Card>
    );
  };

  let content;
  if (error && !data) content = <Typography color="error">Error: {error}</Typography>;
  else if (!data) content = <CircularProgress color="inherit" />;
  else if (!data.currentShow && !data.nextShow)
    content = (
      <Typography variant="h4" align="center">
        No shows scheduled currently.
      </Typography>
    );
  else {
    const activeShow = showType === "current" ? data.currentShow : data.nextShow;
    const label = showType === "current" ? "Now Showing" : "Next Up";
    content = (
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {renderShowCard(activeShow, label)}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {content}
    </Box>
  );
}
