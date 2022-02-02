import { Car } from "./car";

export class AddCar{
    public carID: number;
    public description: string;
    public driveType: string;
    public earliestUsageTime: number;
    public latestUsageTime: number;
    public maxUsageDuration: number;
    public flatRateprice: number;
    public pricePerMinute: number;

    public addCar(): Car{
        return null;
    }
}