import * as fs from "fs";
import { User } from "./User";

export class UserManager {
    //Singleton für einfachen Zugriff auf UserManager
    private static instance: UserManager;

    private constructor() {}

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }

        return UserManager.instance;
    }
    public ListOfAvailableUsers(): User[] {
        let rawData = fs.readFileSync("data/users.json");
        let carData = JSON.parse(rawData.toString());
        let userObjects: User[] = [];
        carData.forEach((element: any) => {
            //console.log(element);
            // let newUser = new Car(
            //     element.car_ID,
            //     element.description,
            //     element.electricDriveType,
            //     DateTime.fromISO("2000-01-01T" + element.earliestUsageTime),
            //     DateTime.fromISO("2000-01-01T" + element.latestUsageTime),
            //     element.maxUsageDurationMinutes,
            //     element.flatRatePrice,
            //     element.pricePerMin
            // );
            // userObjects.push(newUser);
        });
        //console.log(carObjects);
        return userObjects;
    }

    // public addNewUser(username: string, password: string) {}

    // public loginUser(username: string, password: string): boolean {
    //     return true;
    // }

    // public registerUser(username: string, password: string): boolean {
    //     return true;
    // }

    // public logoutUser() {}
}
