import { User } from "../models/user.model.js";
import { asynchandller } from "../util/asynchandller.js";
import { Bus } from "../models/bus.model.js";
import { Ticket } from "../models/ticket.model.js";
import { Route } from "../models/route.model.js";
import { Trip } from "../models/trip.model.js";

const generateUniqueNumber = () => {
  const time = Date.now().toString().slice("-8");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return time + random;
};

const getindividualtime = (departuretime, time) => {
  const [timePart, period] = departuretime.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  let Minutes = hours * 60 + minutes + time * 60;
  Minutes %= 1440;
  let Hours = Math.floor(Minutes / 60);
  let Mins = Math.floor(Minutes % 60);

  const Period = Hours >= 12 ? "PM" : "AM";
  Hours = Hours % 12 || 12;

  return `${Hours}:${Mins.toString().padStart(2, "0")} ${Period}`;
};

// seat selection part
// export const getallSeat = asynchandller(async (req, res) => {
//   const { busid, traveldate } = req.body;

//   if ([busid, traveldate].some((field) => field == "")) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing fields",
//     });
//   }
//   const bus = await Bus.findById(busid);
//   if (!bus) {
//     return res.status(400).json({
//       success: false,
//       message: "Bus not found",
//     });
//   }

//   let seats;

//   const allseats = await Seat.find({ bus: busid, isCreated: true, traveldate });
//   if (allseats.length > 0) {
//     seats = await Promise.all(
//       allseats.map(async (seat) => {
//         if (seat.status == "hold" && new Date() > seat.selectedtime) {
//           const updatedseat = await Seat.findByIdAndUpdate(
//             seat.id,
//             { $set: { status: "available" } },
//             { new: true }
//           );
//           return updatedseat;
//         } else return seat;
//       })
//     );
//   } else if (allseats.length == 0) {
//     seats = [];
//     for (let i = 1; i <= bus.totalSeats; i++) {
//       const newseat = await Seat.create({
//         bus: bus.id,
//         seatNo: i,
//         traveldate,
//         status: "available",
//         isCreated: true,
//       });
//       seats.push(newseat);
//     }
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Fetch all seats successfully",
//     seats,
//   });
// });

export const getallSeat = asynchandller(async (req, res) => {
  const { tripId, from, to, traveldate } = req.body;
  if (!tripId) {
    return res.status(400).json({
      success: false,
      message: "TripId not found",
    });
  }
  if ([from, to, traveldate].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(400).json({
      success: false,
      message: "Trip not found",
    });
  }

  const route = await Route.findById(trip.routeId);
  const giveindex = (from, to) => {
    const fromIndex = route.stops.findIndex((stop) => stop.name === from);
    const toIndex = route.stops.findIndex((stop) => stop.name === to);
    return { fromIndex, toIndex };
  };

  // delete all pending tickets for this trip + date
  await Ticket.deleteMany({
    trip: trip.id,
    paymentstatus: "pending",
    ticketdate: traveldate,
  });

  const tickets = await Ticket.find({
    trip: trip.id,
    status: "booked",
    paymentstatus: "completed",
    ticketdate: traveldate,
  });
  
  const bookedseat = tickets.reduce((acc, ticket) => {
    const tindexes = giveindex(ticket.from, ticket.to);
    const nindexes = giveindex(from, to);
    const isOverlapping =
      tindexes.fromIndex < nindexes.toIndex &&
      tindexes.toIndex > nindexes.fromIndex;

    if (isOverlapping) {
      acc.push(...ticket.seats);
    }
    return acc;
  }, []);
  return res.status(200).json({
    success: true,
    message: "Booked seat fetch successfully",
    bookedseat,
  });
});

// ticket part
export const createTicket = asynchandller(async (req, res) => {
  const { from, to, tripId, price, seats, passengers, ticketdate } = req.body;
  const userid = req.user.id;

  if ([from, to, tripId, price, ticketdate].some((field) => field) == "") {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }
  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one seat.",
    });
  }
  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please add at least one passenger.",
    });
  }
  if (passengers.length != seats.length) {
    return res.status(400).json({
      success: false,
      message: "The number of passengers must match the number of seats.",
    });
  }

  const emptyfileds = passengers.filter(
    (passenger) => !passenger.name || !passenger.age || !passenger.gender,
  );
  if (emptyfileds.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Some passengers details are empty",
    });
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(400).json({
      success: false,
      message: "Trip not found",
    });
  }

  const bookedseat = await Ticket.findOne({ $and: [{ trip: tripId }, { from: from }, { to: to }, { ticketdate: ticketdate }, { seats: seats },{status:'completed'}] })
  if (bookedseat) {
    return res.status(400).json({
      success: false,
      message: `${seats.join()} Seats already booked`
    })
  }

  const ticket = await Ticket.create({
    user: userid,
    trip: tripId,
    from: from,
    to: to,
    totalamount: price,
    seats,
    passengers,
    ticketdate,
    pnr: generateUniqueNumber(),
    status: "booked",
    paymentstatus: "pending",
  });

  return res.status(200).json({
    success: true,
    message: " Ticketcreate successfully",
    ticket,
  });
});

// for admin
export const getallticket = asynchandller(async (req, res) => {
  const tickets = await Ticket.find({}).sort({ createdAt: -1 });

  const allticket = await Promise.all(
    tickets.map(async (ticket) => {
      const trip = await Trip.findById(ticket.trip)

      const [user, bus] = await Promise.all([
        User.findById(ticket.user).select("name email"),
        Bus.findById(trip.busId).select("busNumber"),
      ]);

      const createdAt = new Date(ticket.createdAt);
      const time = createdAt.toLocaleDateString("en-CA");

      return {
        ticketid: ticket.id,
        tripId: trip.id,
        pnr: ticket.pnr,
        status: ticket.status,
        user: user.name,
        email: user.email,
        amount: ticket.totalamount,
        route: `${ticket.from} -> ${ticket.to}`,
        traveldate: ticket.ticketdate,
        seats: ticket.seats.length,
        busnumber: bus.busNumber,
        bookedon: time,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Fetch all tickets",
    allticket,
  });
});

// for user
export const getTickets = asynchandller(async (req, res) => {
  const { id } = req.user;

  const tickets = await Ticket.find({ user: id }).sort({ createdAt: -1 });

  const allticket = await Promise.all(
    tickets.map(async (ticket) => {
      const trip = await Trip.findById(ticket.trip)
      const bus = await Bus.findById(trip.busId)
      return {
        ticketid: ticket.id,
        tripId: trip.id,
        pnr: ticket.pnr,
        status: ticket.status,
        amount: ticket.totalamount,
        from: ticket.from,
        to: ticket.to,
        traveldate: ticket.ticketdate,
        seat: ticket.seats.length,
        busnumber: bus.busNumber,
        bustype: bus.type,
        passengers: ticket.passengers.length,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Fetch tickets successfully",
    allticket,
  });
});

export const ticketgetByid = asynchandller(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id must be required",
    });
  }

  const ticketdetail = await Ticket.findById(id);
  if (!ticketdetail) {
    return res.status(400).json({
      success: false,
      message: "Ticket not found",
    });
  }

  const trip = await Trip.findById(ticketdetail.trip)
  const [bus, route] = await Promise.all([
    Bus.findById(trip.busId),
    Route.findById(trip.routeId),
  ]);

  let fromtime = 0;
  let totime = 0;
  const fromIndex = route.stops.findIndex(
    (stop) => stop.name === ticketdetail.from,
  );
  const toIndex = route.stops.findIndex(
    (stop) => stop.name === ticketdetail.to,
  );

  route.stops.forEach((s, index) => {
    if (index <= fromIndex) fromtime += s.pretime;
    if (index > fromIndex && index <= toIndex) {
      totime += s.pretime;
    }
  });

  const getArrivalTime = (departuretime) => {
    const userdeparturetime = getindividualtime(departuretime, fromtime);
    const userarrivaltime = getindividualtime(userdeparturetime, totime);
    return { userdeparturetime, userarrivaltime };
  };

  const usertime = getArrivalTime(trip.departureTime);
  const createdAt = new Date(ticketdetail.createdAt);
  const date = createdAt.toLocaleDateString("en-CA");
  const time = createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const passengersInfo = await Promise.all(
    ticketdetail.seats.map(async (seat, index) => {
      return {
        name: ticketdetail.passengers[index].name,
        age: ticketdetail.passengers[index].age,
        gender: ticketdetail.passengers[index].gender,
        seatno: seat,
      };
    }),
  );

  const ticket = {
    id: ticketdetail.id,
    tripId: trip.id,
    pnr: ticketdetail.pnr,
    status: ticketdetail.status,
    busnumber: bus.busNumber,
    bustype: bus.type,
    from: ticketdetail.from,
    to: ticketdetail.to,
    departuretime: usertime.userdeparturetime,
    arrivaltime: usertime.userarrivaltime,
    passengersInfo,
    totalamount: ticketdetail.totalamount,
    paymentstatus: ticketdetail.paymentstatus,
    traveldate: ticketdetail.ticketdate,
    bookedtime: `${date} ${time}`,
  };

  return res.status(200).json({
    success: true,
    message: "Fetch ticket detail successfully",
    ticket,
  });
});

export const ticketCancel = asynchandller(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id must be required",
    });
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return res.status(400).json({
      success: false,
      message: "Ticket not found",
    });
  }

  function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }

  const now = new Date();
  const today = normalizeDate(now);
  const ticketDate = normalizeDate(new Date(ticket.ticketdate));
  const diffMinutes = (ticketDate - today) / (1000 * 60);
  if (diffMinutes >= 120) {
    ticket.status = "cancelled";
    await ticket.save();
    return res.status(200).json({
      success: true,
      message: `Ticket ${id} cancelled successfully`,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: `Cancellation not allowed. Tickets must be cancelled at least 2 hours before departure.`,
    });
  }
});

export const ticketUpdate = asynchandller(async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    id,
    {
      totalamount: price,
      paymentstatus: "completed",
    },
    { new: true },
  );
  if (!updatedTicket) {
    return res.status(400).json({
      success: false,
      message: "Ticket not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "payment completed",
    updatedTicket,
  });
});

export const ticketDelete = asynchandller(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: `"${id}" Id not found`,
    });
  }
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return res.status(400).json({
      success: false,
      message: `"${id}" Ticket not found`,
    });
  }
  await Ticket.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message: `"${id}" Ticket Deleted`,
  });
});
