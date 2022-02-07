import { User } from "./User";
import { Car } from "./Car";
import { DateTime, Duration } from "luxon";
import { CarManager } from "./CarManager";

export class Ride {
    public timestamp: DateTime;
    public duration: Duration;
    public user: User;
    public bookedCar: Car;
    public flatRatePrice: number;
    public pricePerMinute: number;

    constructor(
        timestamp: DateTime,
        duration: Duration,
        user: User,
        bookedCar: Car,
        flatRatePrice: number,
        pricePerMinute: number
    ) {
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

    public getFullPrice(): number | null {
        let car = CarManager.getInstance().getCarByID(this.bookedCar.car_ID);
        if (!car) {
            return null;
        }


        return car.flatRatePrice + this.duration.minutes * car.pricePerMin;
    }

    // e.g. "BMW i3 (E) - 14:00, Dauer: 40 min, Gesamt Preis: 30 €"
    public printString(): string {
        let car = CarManager.getInstance().getCarByID(this.bookedCar.car_ID);
        if (!car) {
            return "ERROR";
        }

        console.log("printstring", this.duration.minutes);

        return `${car.description}  ${car.electricDriveType ? "(E)" : ""} - ${this.timestamp.toFormat("HH:mm")}, 
        Dauer:  ${this.duration.minutes} min,
        Gesamt Preis: ${this.getFullPrice()}.`;
    }
}
