export class Car{
    public car_ID: number;
    public description: string;
    public electricDriveType: boolean;
    public earliestUsageTime: Date;
    public latestUsageTime: Date;
    public maxUsageDurationMinutes: number;
    public flatRatePrice: number;
    public pricePerMin: number;
    



    public getCarStatus():boolean{
        return true;
    }
}