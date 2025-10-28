import Booking from "../../../db/models/bookingModel.js";
import dbOperations from "../../../db/methods/dbOperations.js";

export async function getNextShow(req, res) {
  try {
    const now = new Date();
    const bookings = await dbOperations.getAll(Booking);

    if (!bookings || bookings.length === 0)
      return ({ currentShow: null, nextShow: null });

    const bookingsWithDate = bookings.map(b => ({
      ...b,
      showDateTime: new Date(`${b.date} ${b.time}`),
    }));

    bookingsWithDate.sort((a, b) => a.showDateTime - b.showDateTime);

    let currentShow = null;
    let nextShow = null;

    for (const b of bookingsWithDate) {
      const showStart = b.showDateTime;
      const durationMins = b.runtime;
      const showEnd = new Date(showStart.getTime() + durationMins * 60000);

      if (now >= showStart && now <= showEnd) {
        currentShow = {
          title: b.title,
          date: b.date,
          time: b.time,
          poster_path: b.poster_path,
          backdrop_path: b.backdrop_path,
          runtime: b.runtime
        };
      }

      if (showStart > now) {
        nextShow = {
          title: b.title,
          date: b.date,
          time: b.time,
          poster_path: b.poster_path,
          backdrop_path: b.backdrop_path,
          runtime: b.runtime
        };
        break;
      }
    }

    return ({
      currentShow: currentShow,
      nextShow: nextShow
    });
  } catch (err) {
    console.error("Error fetching show status:", err);
    return ({ message: `Internal Server Error: ${err.message}` });
  }
}