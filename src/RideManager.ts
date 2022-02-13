import * as fs from "fs";
import { DateTime, Duration } from "luxon";
import { Car } from "./Car";
import { CarManager } from "./CarManager";
import { Ride } from "./Ride";
import { User } from "./User";
import { UserManager } from "./UserManager";


export class RideManager {
    //Singleton für einfachen Zugriff auf RideManager
    private static instance: RideManager;

    private constructor() {
        if(RideManager.instance){
            throw new Error("Instanz ist schon vorhanden");
        }
    }

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
                DateTime.fromISO(element.timestamp),
                Duration.fromObject({ minutes: element.duration }),
                user,
                car
            );
            rideObjects.push(newRide);
        });
        return rideObjects;
    }

    public getRidesForCar(carToSearch: Car): Ride[] {
        const ridesList: Ride[] = this.listOfAvailableRides();
        return ridesList.filter((eachRide) => eachRide.bookedCar.car_ID == carToSearch.car_ID);
    }

    public getRidesForUser(userToSearch: User): Ride[] {
        const ridesList: Ride[] = this.listOfAvailableRides();
        return ridesList.filter((eachRide) => eachRide.user.user_ID == userToSearch.user_ID);
    }

    public saveRideToJson(rideToSave: Ride): boolean {
        const ridesList: Ride[] = this.listOfAvailableRides();

        let rawData = fs.readFileSync("data/rides.json");
        let rideData = JSON.parse(rawData.toString());

        rideData.push({
            user_ID: rideToSave.user.user_ID,
            timestamp: rideToSave.timestamp,
            duration: rideToSave.duration.minutes,
            car_ID: rideToSave.bookedCar.car_ID,
        });

        fs.writeFileSync("data/rides.json", JSON.stringify(rideData));

        return true;
    }
}
