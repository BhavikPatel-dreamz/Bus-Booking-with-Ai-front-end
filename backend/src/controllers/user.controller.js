import { Route } from "../models/route.model.js";
import { User } from "../models/user.model.js";
import { ContactUs } from "../models/contactus.model.js";
import { asynchandller } from "../util/asynchandller.js";
import { Bus } from "../models/bus.model.js";
import bcrypt from "bcrypt";
import { Trip } from '../models/trip.model.js'
import { Ticket } from "../models/ticket.model.js";

export const getindividualtime = (departuretime, time) => {
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

export const convertToHourMinute = (decimalTime) => {
  const hour = Math.floor(decimalTime);
  const minute = Math.floor((decimalTime - hour) * 60);

  return { hour, minute };
}

export const register = asynchandller(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if ([name, email, phone, password].some((field) => field == ""))
    return res
      .status(400)
      .json({ success: false, message: "Missing fields" });

  const existeduser = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (existeduser)
    return res
      .status(400)
      .json({ success: false, message: "User already exist" });

  const user = await User.create({
    name: name,
    email: email.toLowerCase(),
    phone: phone,
    password: await bcrypt.hash(password, 10),
    role: "user",
  });

  return res.status(200).json({
    success: true,
    message: "User Created succesfully",
    user,
  });
});

export const getuserbyid = asynchandller(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }

  const user = await User.findOne({
    $and: [{ _id: userId }, { role: "user" }],
  }).select("-password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Detail fetch successfully",
    user,
  });
});

export const updateUser = asynchandller(async (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.user.id;

  if ([name, email, phone].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const existeduser = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  }).select("-password");

  if (existeduser) {
    if (email == existeduser.email && userId !== existeduser.id) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }
    if (phone == existeduser.phone && userId !== existeduser.id) {
      return res.status(400).json({
        success: false,
        message: "Phone already exist",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name, email: email, phone: phone },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      success: true,
      message: "User update successfully",
      user,
    });
  }
});

//search bus
export const searchBus = asynchandller(async (req, res) => {
  const { from, to, traveldate } = req.body;
  if ([from, to, traveldate].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const routes = await Route.find({});
  const matches = [];

  for (const route of routes) {
    const fromIndex = route.stops.findIndex((stop) => stop.name === from);
    const toIndex = route.stops.findIndex((stop) => stop.name === to);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      matches.push({
        route,
        fromIndex,
        toIndex,
      });
    }
  }
  if (matches.length == 0)
    return res.status(400).json({
      success: false,
      message: "Route not found",
    });


  const getArrivalTime = (departuretime, fromtime, totime) => {
    const userdeparturetime = getindividualtime(departuretime, fromtime);
    const userarrivaltime = getindividualtime(userdeparturetime, totime);
    return { userdeparturetime, userarrivaltime };
  };

  let buses = [];
  const getIndianDay = () => {
    const date = new Date(traveldate + "T00:00:00");

    const day = date.toLocaleDateString("en-IN", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    });
    return day == "Sunday" ? 0 : day == 'Monday' ? 1 : day == 'Tuesday' ? 2 : day == 'Wednesday' ? 3 : day == 'Thursday' ? 4 : day == 'Friday' ? 5 : 6
  };

  for (const { route, fromIndex, toIndex } of matches) {
    let fromtime = 0;
    let totime = 0;
    let todistance = 0;

    route.stops.forEach((s, index) => {
      if (index <= fromIndex) fromtime += s.pretime;
      if (index > fromIndex && index <= toIndex) {
        totime += s.pretime;
        todistance += s.predistance;
      }
    });

    const alltrips = await Trip.find({ routeId: route.id })

    for (const trip of alltrips.filter((trip) => trip.days.includes(getIndianDay()))) {
      const [bus, tickets] = await Promise.all([
        Bus.findById(trip.busId),
        Ticket.find({ trip: trip.id, status: 'booked', paymentstatus: 'completed', ticketdate: traveldate })
      ])
      const giveindex = (from, to) => {
        const fromIndex = route.stops.findIndex((stop) => stop.name === from);
        const toIndex = route.stops.findIndex((stop) => stop.name === to);
        return { fromIndex, toIndex };
      };
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
      const usertime = getArrivalTime(trip.departureTime, fromtime, totime);
      const timeObj = convertToHourMinute(Number(totime));

      buses.push({
        busId: bus.id,
        tripId: trip.id,
        busname: bus.name,
        busnumber: bus.busNumber,
        type: bus.type,
        from,
        to,
        totaltime: {
          hour: timeObj.hour,
          minute: timeObj.minute,
        },
        totalseats: bus.totalSeats,
        price: Math.ceil(todistance * bus.basePricePerKm),
        fromtime: usertime.userdeparturetime,
        totime: usertime.userarrivaltime,
        days: trip.days,
        availableseat:
          bookedseat.length !== 0
            ? bus.totalSeats - bookedseat.length
            : bus.totalSeats,
        amenties: bus.amenties
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: "Fetch buses successfully",
    buses,
  });
});

// contactUS
export const createContactUs = asynchandller(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // basic validation (matches frontend rules)
  if ([name, email, subject, message].some((field) => !field?.trim())) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Message must be at least 10 characters",
    });
  }

  await ContactUs.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    subject: subject.trim(),
    message: message.trim(),
    // isRead defaults to false
  });

  return res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
});
