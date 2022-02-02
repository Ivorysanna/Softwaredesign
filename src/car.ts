import { Moment } from "moment";

export class Car{
    public car_ID: number;
    public description: string;
    public electricDriveType: boolean;
    public earliestUsageTime: Moment;
    public latestUsageTime: Moment;
    public maxUsageDurationMinutes: number;
    public flatRatePrice: number;
    public pricePerMin: number;
    



    public getCarStatus():boolean{
        return true;
    }
}