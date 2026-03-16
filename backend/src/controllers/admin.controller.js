import { User } from "../models/user.model.js";
import { asynchandller } from "../util/asynchandller.js";
import bcrypt from "bcrypt";
import { Route } from "../models/route.model.js";
import { Bus } from "../models/bus.model.js";
import { Ticket } from "../models/ticket.model.js";
import { ContactUs } from "../models/contactus.model.js";
import { Trip } from "../models/trip.model.js";

export const getArrivalTime = (route, departureTime) => {
  const totalhours = route.stops.reduce((sum, stop) => sum + stop.pretime, 0);

  const [timePart, period] = departureTime.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  let departureMinutes = hours * 60 + minutes;
  let arrivalMinutes = departureMinutes + totalhours * 60;
  arrivalMinutes %= 1440;
  let arrivalHours = Math.floor(arrivalMinutes / 60);
  let arrivalMins = Math.floor(arrivalMinutes % 60);

  const arrivalPeriod = arrivalHours >= 12 ? "PM" : "AM";
  arrivalHours = arrivalHours % 12 || 12;

  return `${arrivalHours}:${arrivalMins
    .toString()
    .padStart(2, "0")} ${arrivalPeriod}`;
};

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
      .json({ success: false, message: "Admin already exist" });

  const user = await User.create({
    name: name,
    email: email.toLowerCase(),
    phone: phone,
    password: await bcrypt.hash(password, 10),
    role: "admin",
  });

  return res.status(200).json({
    success: true,
    message: "Admin Created succesfully",
    user,
  });
});

export const getadminbyid = asynchandller(async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }

  const admin = await User.findOne({
    $and: [{ _id: adminId }, { role: "admin" }],
  }).select("-password");
  if (!admin) {
    return res.status(400).json({
      success: false,
      message: "Admin not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Detail fetch successfully",
    admin,
  });
});

// route part

export const createRoute = asynchandller(async (req, res) => {
  const { stops } = req.body;

  if (stops.length == 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter stops",
    });
  }
  const emptyfield = stops.find(
    (stop, index) =>
      !stop.name ||
      (index !== 0 && stop.predistance == 0) ||
      (index !== 0 && stop.pretime == 0),
  );
  if (emptyfield) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const newroute = await Route.create({
    stops: stops,
  });

  const changestops = newroute.stops.map((stop, index) => {
    if (index == stops.length - 1) {
      stop.predistance = 0;
      stop.pretime = 0;
    } else {
      stop.predistance = stops[index + 1].predistance;
      stop.pretime = stops[index + 1].pretime;
    }
    return stop;
  });

  const reverseroute = changestops.reverse();
  await Route.create({
    ogroute: newroute.id,
    stops: reverseroute,
  });

  return res.status(200).json({
    success: true,
    message: "Route and reverse route create successfully",
  });
});

export const getallRoutes = asynchandller(async (req, res) => {
  const routes = await Route.find({});
  const routeInfo = await Promise.all(
    routes.map((eachRoute) => {
      const stops = [];
      let distance = 0;
      let totaltime = 0;
      eachRoute.stops.forEach((stop) => {
        stops.push(stop.name);
        distance = distance + stop.predistance;
        totaltime += stop.pretime;
      });

      return {
        id: eachRoute.id,
        ogroute: eachRoute.ogroute,
        stops: stops,
        numberofstops: stops.length,
        route: `${stops[0]} -> ${stops[stops.length - 1]}`,
        distance: distance,
        time: totaltime,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Fetch all routes successfully",
    routeInfo,
  });
});

export const getallStops = asynchandller(async (req, res) => {
  const routes = await Route.find({});
  let allstops = [];
  routes.forEach((eachRoute) => {
    eachRoute.stops.forEach((stop) => {
      allstops.push(stop.name);
    });
  });

  return res.status(200).json({
    success: true,
    message: "Detail fetch successfully",
    allstops: [...new Set(allstops)],
  });
});

export const getRouteByid = asynchandller(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }

  const route = await Route.findById(id);
  if (!route) {
    return res.status(400).json({
      success: false,
      message: "Route not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Detail fetch successfully",
    route,
  });
});

export const deleteRoute = asynchandller(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }
  const route = await Route.findById(id);
  if (!route) {
    return res.status(400).json({
      success: false,
      message: "Route not found",
    });
  }

  const trip = await Trip.findOne({routeId:route._id}).select('_id').lean()
  if(trip) return res.status(400).json({
    success:false,
    message:'This route is curruntly linked to an active trip. PLease modify the trip before removing this route.'
  })
  
  await Route.findByIdAndDelete(id, { new: true });
  await Route.deleteOne({ ogroute: route.id });
  return res.status(200).json({
    success: true,
    message: "Route Deleted successfully",
  });
});

export const updateRoute = asynchandller(async (req, res) => {
  const { id, stops } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }
  if (stops.length == 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter stops",
    });
  }
  const emptyfield = stops.find(
    (stop, index) =>
      !stop.name ||
      (index !== 0 && stop.predistance == 0) ||
      (index !== 0 && stop.pretime == 0),
  );
  if (emptyfield) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const updatedRoute = await Route.findByIdAndUpdate(
    id,
    {
      stops: stops,
    },
    { new: true },
  );

  if (!updatedRoute) {
    return res.status(400).json({
      success: false,
      message: "Route not found",
    });
  }

  const changestops = updatedRoute.stops.map((stop, index) => {
    if (index == stops.length - 1) {
      stop.predistance = 0;
      stop.pretime = 0;
    } else {
      stop.predistance = stops[index + 1].predistance;
      stop.pretime = stops[index + 1].pretime;
    }
    return stop;
  });

  const reverseroute = changestops.reverse();
  await Route.updateOne(
    { ogroute: updatedRoute.id },
    { $set: { stops: reverseroute } },
  );

  return res.status(200).json({
    success: true,
    message: "Route updated successfully",
    updatedRoute,
  });
});

// bus part
export const createBus = asynchandller(async (req, res) => {
  const { name, busnumber, totalseats, type, baseprice, amenties } = req.body;

  if (
    [name, busnumber, totalseats, type, baseprice].some((field) => field == "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  if (type === "seating" && totalseats > 61) {
    return res.status(400).json({
      success: false,
      message: "Seating buses can have a maximum of 60 seats.",
    });
  }

  if (type === "sleeper" && totalseats > 49) {
    return res.status(400).json({
      success: false,
      message: "Sleeper buses can have a maximum of 48 seats.",
    });
  }

  if (busnumber.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Bus number must be exactly 10 characters long.",
    });
  }

  if (type === "sleeper" && (baseprice < 0 || baseprice > 3)) {
    return res.status(400).json({
      success: false,
      message: "For sleeper buses, base price must be between 0 and 3.",
    });
  }

  if (type === "seating" && (baseprice < 0 || baseprice > 1.5)) {
    return res.status(400).json({
      success: false,
      message: "For seating buses, base price must be between 0 and 1.5.",
    });
  }

  const existedbus = await Bus.findOne({ busNumber: busnumber });
  if (existedbus)
    return res.status(400).json({
      success: false,
      message: "Bus already existed",
    });

  await Bus.create({
    name,
    busNumber: busnumber,
    type,
    totalSeats: totalseats,
    basePricePerKm: baseprice,
    amenties: amenties.length == 0 ? [] : amenties,
  });
  return res.status(200).json({
    success: true,
    message: "Bus created successfully",
  });
});

export const getBusByid = asynchandller(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }

  const bus = await Bus.findById(id).populate("routeId");
  if (!bus) {
    return res.status(400).json({
      success: false,
      message: "Bus not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Detail fetch successfully",
    bus,
  });
});

export const updateBus = asynchandller(async (req, res) => {
  const { id, name, baseprice, type, amenties } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found",
    });
  }

  if ([name, baseprice, type].some((field) => field == "")) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  if (type === "sleeper" && (baseprice < 0 || baseprice > 3))
    return res.status(400).json({
      success: false,
      message: "For sleeper buses, base price must be between 0 and 3.",
    });

  if (type === "seating" && (baseprice < 0 || baseprice > 1.5))
    return res.status(400).json({
      success: false,
      message: "For seating buses, base price must be between 0 and 1.5.",
    });

  const bus = await Bus.findByIdAndUpdate(
    id,
    {
      basePricePerKm: baseprice,
      name: name,
      amenties: amenties,
    },
    { new: true },
  );
  if (!bus) {
    return res.status(400).json({
      success: false,
      message: "Bus not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Bus updated successfully",
    bus,
  });
});

export const getallBus = asynchandller(async (req, res) => {
  const buses = await Bus.find({});
  const busInfo = await Promise.all(
    buses.map(async (eachBus) => {
      return {
        id: eachBus.id,
        name: eachBus.name,
        busnumber: eachBus.busNumber,
        type: eachBus.type,
        totalseats: eachBus.totalSeats,
        baseprice: eachBus.basePricePerKm,
        amenties: eachBus.amenties,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Detail fetch successfully",
    busInfo,
  });
});

export const deleteBus = asynchandller(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Bus Id not found",
    });
  }

  const bus = await Bus.findById(id);
  if (!bus) {
    return res.status(400).json({
      success: false,
      message: "Bus not found",
    });
  }

  const assingedBus = await Trip.findOne({ busId: id });

  if (assingedBus) {
    return res.status(400).json({
      success: false,
      message:
        "This bus is currently linked to an active trip. Update or delete the trip before removing this bus.",
    });
  }

  await Bus.findByIdAndDelete(id, { new: true });
  return res.status(200).json({
    success: true,
    message: "Bus Deleted successfully",
  });
});

export const adminDashboard = asynchandller(async (req, res) => {

  // ===== BASIC COUNTS =====
  const totalBus = await Bus.countDocuments({});
  const totalRoutes = await Route.countDocuments({});
  const totalBookiings = await Ticket.countDocuments({});
  const activeBooking = await Ticket.countDocuments({ status: "booked" });
  const cancelledBooking = await Ticket.countDocuments({ status: "cancelled" });
  const totalCustomer = await User.countDocuments({ role: "user" });
  const totalTrip = await Trip.countDocuments({});

  // ===== TOTAL REVENUE (ONLY COMPLETED PAYMENTS) =====
  const completedTickets = await Ticket.find({ paymentstatus: "completed" });
  let totalrevenue = 0;
  completedTickets.forEach(ticket => totalrevenue += ticket.totalamount);

  // ===== RECENT BOOKINGS (LIMITED) =====
  const tickets = await Ticket.find({})
    .sort({ createdAt: -1 })
    .limit(10);

  const recentTickets = tickets.map(ticket => ({
    pnr: ticket.pnr,
    route: `${ticket.from} -> ${ticket.to}`,
    status: ticket.status,
    date: ticket.ticketdate,
  }));

  // ===== CURRENT WEEK (SUN → SAT) =====
  const today = new Date();
  const dayOfWeek = today.getDay();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0,0,0,0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);

  const Tickets = await Ticket.find({
    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
  });

  // ===== BOOKING TREND =====
  const bookingTrend = () => {
    const daysmap = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};

    const result = {Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0};

    Tickets.forEach(ticket=>{
      const dayname = daysmap[new Date(ticket.createdAt).getDay()];
      result[dayname]++;
    });

    return Object.keys(result).map(day=>({ day, count: result[day] }));
  };

  // ===== REVENUE TREND (ONLY COMPLETED PAYMENTS) =====
  const revenueTrend = () => {
    const daysmap = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};
    const result = {Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0};

    Tickets.forEach(ticket=>{
      if(ticket.paymentstatus === "completed"){
        const dayname = daysmap[new Date(ticket.createdAt).getDay()];
        result[dayname] += ticket.totalamount;
      }
    });

    return Object.keys(result).map(day=>({ day, sum: result[day] }));
  };

  // ===== ROUTE TREND (SAFE + CORRECT REVENUE) =====
  const routeTrend = async () => {
    const allroute = {};

    for(const ticket of Tickets){
      const trip = await Trip.findById(ticket.trip);
      if(!trip) continue;

      const route = await Route.findById(trip.routeId);
      if(!route || !route.stops?.length) continue;

      const name = `${route.stops[0].name} -> ${route.stops[route.stops.length-1].name}`;

      if(!allroute[name]) allroute[name] = 0;

      if(ticket.paymentstatus === "completed"){
        allroute[name] += ticket.totalamount;
      }
    }
    return allroute;
  };

  // ===== RESPONSE =====
  return res.status(200).json({
    success: true,
    message: "detail fetched",
    totalBookiings,
    totalBus,
    totalRoutes,
    activeBooking,
    cancelledBooking,
    totalCustomer,
    totalTrip,
    totalrevenue,
    recentTickets,
    revenueTrend: revenueTrend(),
    bookingTrend: bookingTrend(),
    routeTrend: await routeTrend(),
  });
});

// report and analytics

export const getReport = asynchandller(async (req, res) => {
  const period = req.body.period?.toLowerCase();


  if (!period) {
    return res.status(400).json({
      success: false,
      message: "Please give period",
    });
  }


  let totalBookiings = 0;
  let cancelRate = 0;
  let totalrevenue = 0;
  let average = 0;

  const now = new Date();

  let revenuetrend = [];
  let bookingtrend = [];
  let routetrend = {};
  let bustrend = {};

  const routeTrend = async (Tickets) => {
    const allroute = {};

    for (const ticket of Tickets) {
      const trip = await Trip.findById(ticket.trip);
      if (!trip) continue;

      const route = await Route.findById(trip.routeId);
      if (!route || !route.stops?.length) continue;

      const name = `${route.stops[0].name} -> ${route.stops[route.stops.length - 1].name}`;

      if (!allroute[name]) {
        allroute[name] = {
          revenue: 0,
          totalBookiings: 0,
        };
      }

      // accumulate instead of overwrite
      if (ticket.paymentstatus === "completed") {
        allroute[name].revenue += ticket.totalamount;
      }
      allroute[name].totalBookiings += 1;
    }

    return allroute;
  };

  const busTrend = async (Tickets) => {
    const allBus = {};

    for (const ticket of Tickets) {
      const trip = await Trip.findById(ticket.trip);
      if (!trip) continue;

      const bus = await Bus.findById(trip.busId);
      if (!bus) continue;

      if (!allBus[bus.name]) {
        allBus[bus.name] = {
          revenue: 0,
          trips: new Set(),
        };
      }

      if (ticket.paymentstatus === "completed") {
        allBus[bus.name].revenue += ticket.totalamount;
      }

      allBus[bus.name].trips.add(trip._id.toString());
    }

    // convert set → count
    for (const bus in allBus) {
      allBus[bus].Totaltrip = allBus[bus].trips.size;
      delete allBus[bus].trips;
    }

    return allBus;
  };

  const calculateKPI = (Tickets) => {
    const totalBookiings = Tickets.length;

    const cancelledBooking = Tickets.filter(
      (t) => t.status === "cancelled"
    ).length;

    const completedTickets = Tickets.filter(
      (t) => t.paymentstatus === "completed"
    );

    const totalrevenue = completedTickets.reduce(
      (sum, ticket) => sum + ticket.totalamount,
      0
    );

    const cancelRate =
      totalBookiings === 0
        ? 0
        : Math.round((cancelledBooking * 100) / totalBookiings);

    const average =
      completedTickets.length === 0
        ? 0
        : Math.floor(totalrevenue / completedTickets.length);

    return {
      totalBookiings,
      cancelRate,
      totalrevenue,
      average,
    };
  };

  if (period == "week") {

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const Tickets = await Ticket.find({
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    });




    ({ totalBookiings, cancelRate, totalrevenue, average } = calculateKPI(Tickets));
    const bookingTrend = () => {
      const daysmap = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
      };

      const result = {
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
      };
      Tickets.forEach((ticket) => {
        const dayindex = new Date(ticket.createdAt).getDay();
        const dayname = daysmap[dayindex];
        result[dayname]++;
      });
      return Object.keys(result).map((day) => ({
        day,
        count: result[day],
      }));
    };

    const revenueTrend = () => {
      const daysmap = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
      };

      const result = {
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
      };
      Tickets.forEach((ticket) => {
        const dayindex = new Date(ticket.createdAt).getDay();
        const dayname = daysmap[dayindex];
        if (ticket.paymentstatus === "completed") {
          result[dayname] += ticket.totalamount;
        }

      });
      return Object.keys(result).map((day) => ({
        day,
        sum: result[day],
      }));
    };
    revenuetrend = revenueTrend();
    bookingtrend = bookingTrend();
    routetrend = await routeTrend(Tickets);
    bustrend = await busTrend(Tickets);
  }

  if (period == "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const Tickets = await Ticket.find({
      createdAt: { $gte: start, $lte: end },
    });

    ({ totalBookiings, cancelRate, totalrevenue, average } = calculateKPI(Tickets));

    const bookingTrend = () => {
      const result = {
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
        week5: 0,
      };

      Tickets.forEach((ticket) => {
        const day = new Date(ticket.createdAt).getDate();
        const weeknumber = Math.ceil(day / 7);
        result[`week${weeknumber}`]++;
      });
      return Object.keys(result).map((week) => ({
        day: week,
        count: result[week],
      }));
    };

    const revenueTrend = () => {
      const result = {
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
        week5: 0,
      };

      Tickets.forEach((ticket) => {
        const day = new Date(ticket.createdAt).getDate();
        const weeknumber = Math.ceil(day / 7);
        if (ticket.paymentstatus === "completed") {
          result[`week${weeknumber}`] += ticket.totalamount;
        }


      });
      return Object.keys(result).map((week) => ({
        day: week,
        sum: result[week],
      }));
    };
    revenuetrend = revenueTrend();
    bookingtrend = bookingTrend();
    routetrend = await routeTrend(Tickets);
    bustrend = await busTrend(Tickets);
  }

  if (period == "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const Tickets = await Ticket.find({
      createdAt: { $gte: start, $lte: end },
    });

    ({ totalBookiings, cancelRate, totalrevenue, average } = calculateKPI(Tickets));

    const bookingTrend = () => {
      const months = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
      };

      const result = {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      };
      Tickets.forEach((ticket) => {
        const dayindex = new Date(ticket.createdAt).getMonth();
        const month = months[dayindex];
        result[month]++;
      });
      return Object.keys(result).map((day) => ({
        day,
        count: result[day],
      }));
    };

    const revenueTrend = () => {
      const months = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
      };

      const result = {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      };
      Tickets.forEach((ticket) => {
        const dayindex = new Date(ticket.createdAt).getMonth();
        const month = months[dayindex];
        if (ticket.paymentstatus === "completed") {
          result[month] += ticket.totalamount;
        }

      });
      return Object.keys(result).map((day) => ({
        day,
        sum: result[day],
      }));
    };

    revenuetrend = revenueTrend();
    bookingtrend = bookingTrend();
    routetrend = await routeTrend(Tickets);
    bustrend = await busTrend(Tickets);
  }

  return res.status(200).json({
    success: true,
    message: "detail fetched successfully",
    totalrevenue,
    totalBookiings,
    average,
    cancelRate,
    revenuetrend,
    bookingtrend,
    routetrend,
    bustrend,
  });
});

//contactUs page
export const getAllContactRequests = asynchandller(async (req, res) => {
  const contacts = await ContactUs.find({}).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Contact requests fetched successfully",
    contacts,
  });
});

// MARK contact request as read
export const markContactAsRead = asynchandller(async (req, res) => {
  const { id } = req.params;

  // safety check for ObjectId
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid contact request id",
    });
  }

  const contact = await ContactUs.findById(id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: "Contact request not found",
    });
  }

  // already read → no unnecessary update
  if (contact.isRead) {
    return res.status(200).json({
      success: true,
      message: "Contact request already marked as read",
    });
  }

  contact.isRead = true;
  await contact.save();

  return res.status(200).json({
    success: true,
    message: "Contact request marked as read",
  });
});
