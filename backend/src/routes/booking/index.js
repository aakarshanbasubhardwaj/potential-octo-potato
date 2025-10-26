import { Router } from "express";
import Booking from '../../../db/models/bookingModel.js';
import validator from "../../services/bookingValidator/index.js";

const router = Router();

router.get("/unavailableTimes", async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await Booking.find({ date });
    const blockedSlots = validator.calculateBlockedSlots(bookings);
    res.json({ blockedSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching blocked slots" });
  }
});

export default router;
