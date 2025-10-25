import Ticket from "../../../db/models/ticketModel.js";
import dbOperations from "../../../db/methods/dbOperations.js";

export async function getNextShow(req, res) {
  try {
    const now = new Date();
    const tickets = await dbOperations.getAll(Ticket);

    if (!tickets || tickets.length === 0)
      return res.status(200).json({ currentShow: null, nextShow: null });

    const ticketsWithDate = tickets.map(ticket => ({
      ...ticket,
      showDateTime: new Date(`${ticket.date} ${ticket.time}`)
    }));

    ticketsWithDate.sort((a, b) => a.showDateTime - b.showDateTime);
    const SHOW_DURATION_MINS = 120;

    let currentShow = null;
    let nextShow = null;

    for (let i = 0; i < ticketsWithDate.length; i++) {
      const t = ticketsWithDate[i];
      const showStart = t.showDateTime;
      const showEnd = new Date(showStart.getTime() + SHOW_DURATION_MINS * 60000);

      if (now >= showStart && now <= showEnd) {
        currentShow = {
          title: t.title,
          date: t.date,
          time: t.time,
          poster_path: t.poster_path,
          backdrop_path: t.backdrop_path,
        };
      }

      if (showStart > now) {
        nextShow = {
          title: t.title,
          date: t.date,
          time: t.time,
          poster_path: t.poster_path,
          backdrop_path: t.backdrop_path,
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
    return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
}