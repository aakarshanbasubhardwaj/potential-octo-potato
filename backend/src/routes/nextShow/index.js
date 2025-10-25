import express from "express";
import { getNextShow } from "../../services/nextShow/index.js";

const router = express.Router();

router.get("/showSchedule", async (req, res) => {
  try {
    const nextShow = await getNextShow();

    if (!nextShow) {
      return res.status(200).json({ message: "No upcoming shows" });
    }

    return res.status(200).json(nextShow);
  } catch (err) {
    console.error("Error fetching next upcoming show:", err);
    return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

export default router;
