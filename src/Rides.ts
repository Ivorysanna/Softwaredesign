import { User } from "./User";
import { Car } from "./Car";

export class Ride{
    public date: number;
    public time: number;
    public duration: number;
    public userbookedRide: User;
    public bookedCar: Car;
    public priceForRide: number;

    public bookCar(): Car{
        return null;
    }
}