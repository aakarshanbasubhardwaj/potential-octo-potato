import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

export default function TicketScanner() {
  const webcamRef = useRef(null);
  const codeReader = useRef(null);
  const cooldownRef = useRef(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [flash, setFlash] = useState(null); 
  const [showIcon, setShowIcon] = useState(false);
  const [loading, setLoading] = useState(false);

  const beep = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  };

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    let active = true;

    const startScanning = async () => {
      if (!webcamRef.current) return;

      try {
        await codeReader.current.decodeFromVideoDevice(
          null,
          webcamRef.current.video,
          async (result) => {
            if (!active || !result) return;
            if (cooldownRef.current) return;

            const extracted = result.getText();
            cooldownRef.current = true;
            beep();

            setLoading(true);
            setResponseMessage(null);
            setShowIcon(false);

            try {
              const res = await axios.get(
                `http://10.0.0.1:3333/tickets/validate-ticket/${extracted}`
              );
              setResponseMessage(res.data.message);
              setFlash("success");
              setShowIcon(true);
            } catch (err) {
              setFlash("error");
              setShowIcon(true);
              setResponseMessage(
                err.response?.data?.message || "Ticket validation failed"
              );
            } finally {
              setLoading(false);
              setTimeout(() => {
                setResponseMessage(null);
                setFlash(null);
                setShowIcon(false);
                cooldownRef.current = false;
              }, 2000);
            }
          }
        );
      } catch (err) {
        console.error("ZXing error:", err);
      }
    };

    startScanning();

    return () => {
      active = false;
      codeReader.current?.reset();
    };
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#000",
        position: "relative",
      }}
    >
      <Paper
        sx={{
          width: "680",
          height: "420",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Paper
        sx={{
            maxWidth: 680,
            aspectRatio: "1/1",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
        }}
        >
        <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            }}
        />
        <>
        {/* top */}
        <Box
        sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "20%",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            pointerEvents: "none",
        }}
        />
        {/* bottom */}
        <Box
        sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "20%",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            pointerEvents: "none",
        }}
        />
        {/* left */}
        <Box
        sx={{
            position: "absolute",
            top: "20%",
            left: 0,
            width: "20%",
            height: "60%",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            pointerEvents: "none",
        }}
        />
        {/* right */}
        <Box
        sx={{
            position: "absolute",
            top: "20%",
            right: 0,
            width: "20%",
            height: "60%",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            pointerEvents: "none",
        }}
        />
        </>
        {/* scanning guide */}
        <Box
        sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "60%",    
            aspectRatio: "1/1", 
            transform: "translate(-50%, -50%)",
            border: "5px dashed #00FFFF",
            borderRadius: 4,
            pointerEvents: "none",
        }}
        >
        <Box
            sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "2px",
            bgcolor: "#00FFFF",
            animation: "scanline 2s linear infinite",
            }}
        />
        </Box>

        </Paper>
        {/* success/error icons */}
        {showIcon && flash === "success" && (
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 80,
              color: "limegreen",
              animation: "popfade 2s ease-out forwards",
            }}
          >
            ✓
          </Typography>
        )}
        {showIcon && flash === "error" && (
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 80,
              color: "red",
              animation: "popfade 2s ease-out forwards",
            }}
          >
            ✕
          </Typography>
        )}

        {/* loading overlay */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress sx={{ color: "#00FFFF" }} />
          </Box>
        )}

        {/* response message overlay */}
        {responseMessage && (
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "rgba(0,0,0,0.6)",
              px: 3,
              py: 1,
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 200,
              width: "100%",      
              maxWidth: 600, 
            }}
          >
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: flash === "success" ? "limegreen" : flash === "error" ? "red" : "#fff",
              }}
            >
              {responseMessage}
            </Typography>
          </Box>
        )}
      </Paper>

      <style>{`
        @keyframes popfade {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          10% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </Box>
  );
}
