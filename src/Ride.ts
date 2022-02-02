import { User } from "./User";
import { Car } from "./Car";
import { Moment } from "moment";

export class Ride {
    public date: Moment;
    public time: Moment;
    public duration: Moment;
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
