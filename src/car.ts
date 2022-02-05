import { DateTime } from "luxon";
import * as fs from "fs";

export class Car {
    public car_ID: number;
    public description: string;
    public electricDriveType: boolean;
    public earliestUsageTime: DateTime;
    public latestUsageTime: DateTime;
    public maxUsageDurationMinutes: number;
    public flatRatePrice: number;
    public pricePerMin: number;

    constructor(
        car_ID: number,
        description: string,
        electricDriveType: boolean,
        earliestUsageTime: DateTime,
        latestUsageTime: DateTime,
        maxUsageDurationMinutes: number,
        flatRatePrice: number,
        pricePerMin: number
    ) {
        this.car_ID = car_ID;
        this.description = description;
        this.electricDriveType = electricDriveType;
        this.earliestUsageTime = earliestUsageTime;
        this.latestUsageTime = latestUsageTime;
        this.maxUsageDurationMinutes = maxUsageDurationMinutes;
        this.flatRatePrice = flatRatePrice;
        this.pricePerMin = pricePerMin;
    }

    // e.g. "BMW i3 (E) - 9:00-14:00 Uhr, 10€ FP + 3€ pro Min."
    public printString(): string {
        return `${this.description} : ${
            this.electricDriveType ? "(E)" : ""
        } ${this.earliestUsageTime.toFormat(
            "HH:mm"
        )} - ${this.latestUsageTime.toFormat("HH:mm")} Uhr, ${
            this.flatRatePrice
        } € Nutzungspreis ${this.pricePerMin} € pro Min.`;
    }
    public getCarStatus(): boolean {
        return true;
    }
    public getCarDescription(): string {
        let rawData = fs.readFileSync("data/cars.json");
        let allCars = JSON.parse(rawData.toString());
        //let carDescription = allCars["description"];
        let logAllCars: String[] = [];
        for (let i = 0; i < allCars.length; i++) {
            logAllCars += allCars[i].description;
        }
        //console.log(logAllCars);
        return this.description;
    }
}
