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

    constructor(description: string, electricDriveType: boolean, earliestUsageTime: DateTime, latestUsageTime: DateTime, maxUsageDurationMinutes: number, 
        flatRatePrice: number, pricePerMin: number) {
        this.description = description;
        this.electricDriveType = electricDriveType;
        this.earliestUsageTime = earliestUsageTime;
        this.latestUsageTime = latestUsageTime;
        this.maxUsageDurationMinutes = maxUsageDurationMinutes;
        this.flatRatePrice = flatRatePrice;
        this.pricePerMin = pricePerMin;
    }
    public getCarStatus(): boolean {
        return true;
    }
    public getCarDescription(): string {
        let rawData= fs.readFileSync('data/cars.json');
        let allCars = JSON.parse(rawData.toString());
        //let carDescription = allCars["description"];
        let logAllCars: String[] = [];
        for(let i = 0; i < allCars.length; i++){
            logAllCars += allCars[i].description;
        }
        console.log(logAllCars);
        return this.description;
    }
}
