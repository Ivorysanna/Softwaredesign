import * as fs from "fs";
import { Duration } from "luxon";
import { Car } from "./Car";
import { CarManager } from "./CarManager";
import { Ride } from "./Ride";
import { User } from "./User";
import { UserManager } from "./UserManager";
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
            const user = UserManager.getInstance().getUserByID(element.user_ID);
            if (!user) {
                return;
            }

            const car = CarManager.getInstance().getCarByID(element.car_ID);
            if (!car) {
                return;
            }

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

    public getRidesForCar(carToSearch: Car): Ride[] {
        const ridesList: Ride[] = this.listOfAvailableRides();
        return ridesList.filter((eachRide) => eachRide.bookedCar == carToSearch);
    }

    public getRidesForUser(userToSearch: User): Ride[] {
        const ridesList: Ride[] = this.listOfAvailableRides();
        return ridesList.filter((eachRide) => eachRide.user.user_ID == userToSearch.user_ID);
    }

}
