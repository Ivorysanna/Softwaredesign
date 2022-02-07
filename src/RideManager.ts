import * as fs from "fs";
import { Car } from "./Car";
import { Ride } from "./Ride";
import { User } from "./User";
import { Utils } from "./Utils";

export class RideManager {
    //Singleton für einfachen Zugriff auf RideManager
    private static instance: RideManager;

    private constructor() {}

    public static getInstance(): RideManager {
        if (!RideManager.instance) {
            RideManager.instance = new RideManager();
        }

        return RideManager.instance;
    }
    public listOfAvailableRides(): Ride[] {
        let rawData = fs.readFileSync("data/rides.json");
        let rideData = JSON.parse(rawData.toString());
        let rideObjects: Ride[] = [];
        rideData.forEach((element: any) => {
            let newRide = new Ride(
                Utils.parseDateTimeString(element.timestamp),
                Duration.fromObject({ minutes: element.duration }),
                user,
                car,
                element.flatRatePrice,
                element.pricePerMinute
            );
            rideObjects.push(newRide);
        });
        return rideObjects;
    }

    public getRidesForCar(carToSearch: Car): Ride | undefined {
        const ridesList: Ride[] = this.listOfAvailableRides();
        return ridesList.find((eachRide) => eachRide.bookedCar == carToSearch);
    }

    public getRidesForUser(userToSearch: User): Ride | undefined {
        const ridesList: Ride[] = this.listOfAvailableRides();
        return ridesList.find((eachRide) => eachRide.user == userToSearch);
    }
}
