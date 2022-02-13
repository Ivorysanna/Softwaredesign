import { User } from "./User";
import { Car } from "./Car";
import { DateTime, Duration } from "luxon";
import { CarManager } from "./CarManager";

export class Ride {
    public timestamp: DateTime;
    public duration: Duration;
    public user: User;
    public bookedCar: Car;

    constructor(
        timestamp: DateTime,
        duration: Duration,
        user: User,
        bookedCar: Car,
    ) {
        this.timestamp = timestamp;
        this.duration = duration;
        this.user = user;
        this.bookedCar = bookedCar;
    }

    // public bookCar(): Car {
    //     return ;
    // }

    public getFullPrice(): number {
        let car = CarManager.getInstance().getCarByID(this.bookedCar.car_ID);
        if (!car) {
            return 0;
        }


        return car.flatRatePrice + this.duration.minutes * car.pricePerMinute;
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
