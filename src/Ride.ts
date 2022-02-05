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

    constructor(timestamp: DateTime, duration: Duration, user: User, bookedCar: Car, flatRatePrice: number, pricePerMinute: number){
        this.timestamp = timestamp;
        this.duration = duration;
        this.user = user;
        this.bookedCar = bookedCar;
        this.flatRatePrice = flatRatePrice;
        this.pricePerMinute = pricePerMinute;
    }

    // public bookCar(): Car {
    //     return ;
    // }

    public calculateCost(): number {
        return 1;
    }
}
