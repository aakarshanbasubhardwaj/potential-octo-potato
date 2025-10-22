import Ticket from "../../../db/models/ticketModel.js";
import dbOperations from "../../../db/methods/dbOperations.js";

export async function getNextUpcomingShow() {
  const now = new Date();

  const tickets = await dbOperations.getAll(Ticket);

  if (!tickets || tickets.length === 0) return null;

  const ticketsWithDate = tickets.map(ticket => ({
    ...ticket,
    showDateTime: new Date(`${ticket.date} ${ticket.time}`)
  }));

  const futureTickets = ticketsWithDate.filter(t => t.showDateTime > now);
  if (futureTickets.length === 0) return null;

  futureTickets.sort((a, b) => a.showDateTime - b.showDateTime);

  const nextShow = futureTickets[0];
  return {
    title: nextShow.title,
    date: nextShow.date,
    time: nextShow.time,
    poster_path: nextShow.poster_path,
    backdrop_path: nextShow.backdrop_path,
  };
}