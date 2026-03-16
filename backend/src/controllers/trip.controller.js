import { Bus } from "../models/bus.model.js";
import { Route } from "../models/route.model.js";
import { Ticket } from "../models/ticket.model.js";
import { Trip } from "../models/trip.model.js";
import { asynchandller } from "../util/asynchandller.js";
import { getArrivalTime } from "./admin.controller.js";
import { Employee } from "../models/employee.model.js";

const minutesConverter = (time) => {
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// export const filterRoutes = asynchandller(async (req, res) => {
//     const { busId, departureTime, days } = req.body;
//     if ([busId, departureTime].some((field) => field == "")) {
//       return res.status(401).json({
//         success: false,
//         message: "Missing fields",
//       });
//     }

//     if (days.length == 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Operating days are required",
//       });
//     }

//     const bus = await Bus.findById(busId);
//     if (!bus) {
//       return res.status(400).json({
//         success: false,
//         message: "Bus not found",
//       });
//     }

//   const alreadyAssinged = await Trip.find({
//     busId: bus.id,
//     days: { $in: days },
//   }).lean();

//   let routes = [];
//   if (alreadyAssinged.length > 0) {
//     for (const trip of alreadyAssinged) {
//       const route = await Route.findById(trip.routeId).lean();
//       const Routes = await Route.find({
//         $or: [
//           { "stops.0.name": route.stops[route.stops.length - 1].name },
//           { ogroute: route._id },
//         ],
//       }).lean();

//       routes.push({
//         ...Routes,
//         days: trip.days.filter((day) => days.includes(day)),
//       });
//     }

//     routes = routes
//       .filter((route) => route.days)
//       .map((route) => {
//         return {
//           routeId: route["0"]._id,
//           route: `${route["0"].stops[0].name} -> ${route["0"].stops[route["0"].stops.length - 1].name}`,
//           days: route["0"] ? route.days : null,
//         };
//       });
//   }
//   return res.status(200).json({
//     success: true,
//     message: "Filter route successfully",
//     routes,
//   });
// });

export const filterBus = asynchandller(async (req, res) => {
  const { tripId, departureTime, days, routeId } = req.body;
  if (!departureTime || days.length == 0) {
    return res.status(401).json({
      success: false,
      message: "Missing fields",
    });
  }

  const route = await Route.findById(routeId).lean();
  const filteredBus = async (tripId) => {
    const buses = await Bus.find({}).lean();
    const assignedTrip = await Trip.find({
      days: { $in: days },
    }).lean();

    const busTripMap = {};

    assignedTrip.forEach((trip) => {
      const busId = trip.busId.toString();
      if (!busTripMap[busId]) {
        busTripMap[busId] = [];
      }
      busTripMap[busId].push(trip);
    });

    const availableBuses = buses.map((bus) => {
      const busTrips = busTripMap[bus._id.toString()];
      if (!busTrips) {
        return {
          busId: bus._id,
          name: bus.name,
          busnumber: bus.busNumber,
          days,
        };
      }

      for (const trip of busTrips) {
        if(route._id.toString()== trip.routeId.toString() && !tripId) return null
        const DAY_MINUTES = 24 * 60;
        const conflictDepTime = minutesConverter(trip.departureTime);
        let conflictArrTime = minutesConverter(trip.arrivalTime);
        const nowDepTime = minutesConverter(departureTime);
        let nowArrivalTime = minutesConverter(
          getArrivalTime(route, departureTime),
        );

        if (conflictArrTime <= conflictDepTime) {
          conflictArrTime += DAY_MINUTES;
        }
        if (nowArrivalTime <= nowDepTime) {
          nowArrivalTime += DAY_MINUTES;
        }
        if (tripId && trip._id.toString() === tripId) {
          const freedays = days.filter((day) => !trip.days.includes(day));
          return {
            busId: bus._id,
            name: bus.name,
            busnumber: bus.busNumber,
            days: [
              ...trip.days.filter((day) => days.includes(day)),
              ...freedays,
            ],
          };
        }

        if (nowDepTime > conflictArrTime || nowArrivalTime < conflictDepTime) {
          const freedays = days.filter((day) => !trip.days.includes(day));
          return {
            busId: bus._id,
            name: bus.name,
            busnumber: bus.busNumber,
            days: [
              ...trip.days.filter((day) => days.includes(day)),
              ...freedays,
            ],
          };
        } else return null;
      }
    });
    return availableBuses;
  };

  const buses = await filteredBus(tripId);
  return res.status(200).json({
    success: true,
    message: "filtered successfully",
    buses: buses.filter((bus) => bus),
  });
});

export const filterEmployee = asynchandller(async (req, res) => {
  const { tripId, role, departureTime, days, routeId } = req.body;

  if (!departureTime || !role || days.length == 0) {
    return res.status(401).json({
      success: false,
      message: "Missing fields",
    });
  }

  const route = await Route.findById(routeId).lean();
  const filteremployee = async (role, tripId) => {
    const employees = await Employee.find({
      $and: [
        { role: role },
        {
          city: route.stops[0].name
        },
      ],
    }).lean();
    const assignedTrip = await Trip.find({ days: { $in: days } });

    const empTripMap = {};

    assignedTrip.forEach((trip) => {
      const empId = trip?.role;
      if (!empTripMap[empId]) {
        empTripMap[empId] = [];
      }
      empTripMap[empId].push(trip);
    });

    const avialableEmp = employees.map((emp) => {
      const empTrips = empTripMap[emp._id];
      if (!empTrips)
        return {
          empId: emp._id,
          empname: emp.name,
          emprole: emp.role,
          empcity: emp.city,
          days,
          phone: emp.phone,
        };
      for (const trip of empTrips) {
        const DAY_MINUTES = 24 * 60;
        const conflictDepTime = minutesConverter(trip.departureTime);
        let conflictArrTime = minutesConverter(trip.arrivalTime);
        const nowDepTime = minutesConverter(departureTime);
        let nowArrivalTime = minutesConverter(
          getArrivalTime(route, departureTime),
        );

        if (conflictArrTime <= conflictDepTime) {
          conflictArrTime += DAY_MINUTES;
        }
        if (nowArrivalTime <= nowDepTime) {
          nowArrivalTime += DAY_MINUTES;
        }

        if (tripId && trip._id.toString() === tripId) {
          if (trip.role == emp._id) {
            const freedays = days.filter((day) => !trip.days.includes(day));
            return {
              empId: emp._id,
              empname: emp.name,
              emprole: emp.role,
              empcity: emp.city,
              days: [
                ...trip.days.filter((day) => days.includes(day)),
                ...freedays,
              ],
            };
          }
        }

        if (nowDepTime > conflictArrTime || nowArrivalTime < conflictDepTime) {
          const freedays = days.filter((day) => !trip.days.includes(day));
          return {
            empId: emp._id,
            empname: emp.name,
            emprole: emp.role,
            empcity: emp.city,
            days: [
              ...trip.days.filter((day) => days.includes(day)),
              ...freedays,
            ],
            phone: emp.phone,
          };
        } else return null;
      }
    });
    return avialableEmp.filter((emp) => emp);
  };

  const employees = await filteremployee(role, tripId);
  return res.status(200).json({
    success: true,
    message: "Employee filtered successfully",
    employees,
  });
});

export const createTrip = asynchandller(async (req, res) => {
  const {
    routeId,
    busId,
    departureTime,
    minimumRevenue,
    days,
    driverId,
    conductorId,
  } = req.body;

  if (
    [
      routeId,
      busId,
      departureTime,
      minimumRevenue,
      days,
      driverId,
      conductorId,
    ].some((field) => !field)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  const route = await Route.findById(routeId);
  const bus = await Bus.findById(busId);

  if (!(route || bus)) {
    return res.status(400).json({
      success: false,
      message: "Route or Bus not found",
    });
  }
  if (days.length == 0) {
    return res.status(400).json({
      success: false,
      message: "Please select a day",
    });
  }

  const arrivalTime = getArrivalTime(route, departureTime);

  const existingTrip = await Trip.findOne({
  routeId,
  busId,
  departureTime,
  driver: driverId,
  conductor: conductorId,
  days
});

if (existingTrip) {
  return res.status(409).json({
    success: false,
    message: "Trip already exists with same schedule configuration",
  });
}

  await Trip.create({
    routeId,
    busId,
    departureTime,
    arrivalTime,
    minimumRevenue,
    days,
    driver: driverId,
    conductor: conductorId,
  });
  return res.status(200).json({
    success: true,
    message: "Trip created successfully",
  });
});

export const getAllTrip = asynchandller(async (req, res) => {
  const trips = await Trip.find({});
  const trip = await Promise.all(
    trips.map(async (trip) => {
      const now = new Date();
      now.setDate(now.getDate() - 6);
      const route = await Route.findById(trip.routeId);
      const bus = await Bus.findById(trip.busId);
      const tickets = await Ticket.find({
        trip: trip.id,
        createdAt: { $gte: now },
      });
      let generatedRevenue = 0;
      let inLoss = false;
      tickets.forEach((ticket) => {
        generatedRevenue += ticket.totalamount;
      });

      if (generatedRevenue < trip.minimumRevenue) {
        inLoss = true;
      }

      return {
        tripId: trip.id,
        routeId: trip.routeId,
        busId: trip.busId,
        tripname: `${route.stops[0].name} -> ${route.stops[route.stops.length - 1].name}`,
        busname: bus.name,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        minimumRevenue: trip.minimumRevenue,
        days: trip.days,
        inLoss: inLoss,
        driver: trip.driver,
        conductor: trip.conductor,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Fetch trips successfully",
    trip,
  });
});

export const updateTrip = asynchandller(async (req, res) => {
  const {
    routeId,
    tripId,
    busId,
    departureTime,
    minimumRevenue,
    days,
    driverId,
    conductorId,
  } = req.body;

  if (
    [
      routeId,
      tripId,
      busId,
      departureTime,
      minimumRevenue,
      days,
      driverId,
      conductorId,
    ].some((field) => !field)
  ) {
    return res.status(400).json({
      success: false,
      message: "please fill all fields",
    });
  }
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(400).json({
      success: false,
      message: "Trip not found",
    });
  }
  const route = await Route.findById(routeId);

  if (!route) {
    return res.status(400).json({
      success: false,
      message: "Route not found",
    });
  }

  const bus = await Bus.findById(busId);

  if (!bus) {
    return res.status(400).json({
      success: false,
      message: "Bus not found",
    });
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    tripId,
    {
      busId: bus.id,
      departureTime: departureTime,
      arrivalTime: getArrivalTime(route, departureTime),
      days: days,
      minimumRevenue: minimumRevenue,
      driver: driverId,
      conductor: conductorId,
    },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Trip updated successfully",
    updatedTrip,
  });
});

export const deleteTrip = asynchandller(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Trip id not found",
    });
  }
  await Trip.findByIdAndDelete(id, { new: true });
  return res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});
