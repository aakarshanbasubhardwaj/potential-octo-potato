import Booking from "../../../db/models/bookingModel.js";
import dbOperations from "../../../db/methods/dbOperations.js";

function calculateBlockedSlots(bookings) {
  const blockedSlots = [];

  bookings.forEach(b => {
    const [h, m] = b.time.split(":").map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + b.runtime;

    // Prevent crossing 24:00
    const cappedEnd = Math.min(endMinutes, 24 * 60);

    for (let t = startMinutes; t < cappedEnd; t += 30) {
      const slotH = Math.floor(t / 60);
      const slotM = t % 60;
      blockedSlots.push(`${String(slotH).padStart(2, "0")}:${slotM === 0 ? "00" : "30"}`);
    }
  });

  return [...new Set(blockedSlots)];
}


async function validateBookingSlot(req, res, next) {
  try {
    const { id, date, time, runtime } = req.body;
    if (!id || !date || !time || !runtime) {
      return res.status(400).json({ error: "Missing required booking data" });
    }

    const existing = await dbOperations.getAll(Booking, { date: date });

    const blocked = calculateBlockedSlots(existing);

    const [startH, startM] = time.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const requestedSlots = [];
    const endMinutes = startMinutes + runtime;

    for (let t = startMinutes; t < endMinutes; t += 30) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      requestedSlots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }

    const conflict = requestedSlots.some(slot => blocked.includes(slot));

    if (conflict) {
      return res.status(400).json({ error: "Selected time range conflicts with existing bookings" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error validating booking slot" });
  }
}

export default {
    calculateBlockedSlots,
    validateBookingSlot
}