import { Bus } from '../models/bus.model.js';
import { Route } from '../models/route.model.js';
import { Trip } from '../models/trip.model.js';
import { asynchandller } from '../util/asynchandller.js'
import { convertToHourMinute, getindividualtime } from './user.controller.js';



export const aiAllBus = asynchandller(async (req, res) => {
    const { from, to } = req.body;
    if ([from, to].some((field) => field == "")) {
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

        for (const trip of alltrips) {
            const bus = await Bus.findById(trip.busId)
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
                amenties: bus.amenties
            })
        }
    }
    return res.status(200).json({
        success: true,
        message: "Fetch buses successfully",
        buses,
    });
})