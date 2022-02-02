import { User } from "./user";
import { Car } from "./car";

export class BookedRides{
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