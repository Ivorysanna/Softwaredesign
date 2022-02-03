import { User } from "./User";
import { Car } from "./Car";
import { DateTime, Duration } from "luxon";

export class Ride {
    public timestamp: DateTime;
    public duration: Duration;
    public user: User;
    public bookedCar: Car;
    public flatRatePrice: number;
    public pricePerMinute: number;
    

    public bookCar(): Car {
        return null;
    }

    public calculateCost(): number{
        return 1;
    }
}
