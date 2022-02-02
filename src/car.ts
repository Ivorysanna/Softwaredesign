import { Moment } from "moment";

export class Car {
    public car_ID: number;
    public description: string;
    public electricDriveType: boolean;
    public earliestUsageTime: Moment;
    public latestUsageTime: Moment;
    public maxUsageDurationMinutes: number;
    public flatRatePrice: number;
    public pricePerMin: number;

    constructor(description: string, electricDriveType: boolean, earliestUsageTime: Moment, latestUsageTime: Moment, maxUsageDurationMinutes: number, 
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
        return this.description;
    }
}
