import * as fs from "fs";
import { Ride } from "./Ride";
import { RideManager } from "./RideManager";

export class User {
    public user_ID: number;
    public isAdmin: boolean;
    public username: string;
    public password: string;

    constructor(user_ID: number, isAdmin: boolean, userName: string, password: string) {
        this.user_ID = user_ID;
        this.isAdmin = isAdmin;
        this.username = userName;
        this.password = password;
    }

    public pastBookedRides(): String {
        let allRides = fs.readFileSync("data/rides.json");
        let outputRides = JSON.parse(allRides.toString());
        return "Bis jetzt wurden: " + outputRides + " gebucht.";
    }

    public getAverageRideCost(): number {
        const rides: Ride[] = RideManager.getInstance().getRidesForUser(this);

        return this.getSumRideCost() / rides.length;
    }

    public getSumRideCost() {
        const rides: Ride[] = RideManager.getInstance().getRidesForUser(this);

        let sum = 0;
        rides.forEach((eachRide) => {
            sum += eachRide.getFullPrice();
        });

        return sum;
    }
}
