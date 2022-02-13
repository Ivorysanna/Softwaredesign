import { Car } from "./Car";
import * as fs from "fs";
import { DateTime, Duration, Interval } from "luxon";

export class CarManager {
    //Singleton für einfachen Zugriff auf CarManager
    private static instance: CarManager;

    private constructor() {
        if(CarManager.instance){
            throw new Error("Instanz ist schon vorhanden");
        }
    }

    public static getInstance(): CarManager {
        if (!CarManager.instance) {
            CarManager.instance = new CarManager();
        }

        return CarManager.instance;
    }
    public listOfAvailableCars(): Car[] {
        let rawData = fs.readFileSync("data/cars.json");
        let carData = JSON.parse(rawData.toString());
        let carObjects: Car[] = [];
        carData.forEach((element: any) => {
            let newCar = new Car(
                element.car_ID,
                element.description,
                element.electricDriveType,
                //Zeitzone wird fix gesetzt, im Normalfall schwachsinn - Andere Lösung für Zeitzonen Problem nicht gefunden
                DateTime.fromISO(element.earliestUsageTime).setZone("Europe/Berlin"),
                DateTime.fromISO(element.latestUsageTime).setZone("Europe/Berlin"),
                element.maxUsageDurationMinutes,
                element.flatRatePrice,
                element.pricePerMin
            );
            carObjects.push(newCar);
        });
        return carObjects;
    }

    public getCarByID(idToSearch: number): Car | undefined {
        const userList: Car[] = this.listOfAvailableCars();
        return userList.find((eachCar) => eachCar.car_ID == idToSearch);
    }

    public addNewCar(
        description: string,
        electricDriveType: boolean,
        earliestUsageTime: DateTime,
        latestUsageTime: DateTime,
        maxUsageDurationMinutes: number,
        flatRatePrice: number,
        pricePerMin: number
    ): boolean {
        const carsList: Car[] = this.listOfAvailableCars();

        let newCarID: number = 1;
        while (carsList.some((eachCar) => eachCar.car_ID == newCarID)) {
            newCarID++;
        }

        const newCar = new Car(
            newCarID,
            description,
            electricDriveType,
            earliestUsageTime.setZone("Europe/Berlin"),
            latestUsageTime.setZone("Europe/Berlin"),
            maxUsageDurationMinutes,
            flatRatePrice,
            pricePerMin
        );
        carsList.push(newCar);

        fs.writeFileSync("data/cars.json", JSON.stringify(carsList));

        return true;
    }

    public getCarsWithoutRidesInInterval(startDateTime: DateTime, duration: Duration): Car[] {
        const newInterval: Interval = Interval.fromDateTimes(
            startDateTime,
            startDateTime.plus(duration)
        );

        let filteredCars: Car[] = [];

        return this.listOfAvailableCars().filter((eachCar: Car) => {
            if (newInterval.length("minutes") > eachCar.maxUsageDurationMinutes) {
                return false;
            }

            if (eachCar.hasAlreadyBookedRidesInTimeAndDuration(startDateTime, duration)) {
                return false;
            }

            if (!eachCar.isIntervalBetweenEarliestAndLatestUsageTime(startDateTime, duration)) {
                return false;
            }

            return true;
        });
    }
}
