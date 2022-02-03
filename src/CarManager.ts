import { Car } from './Car';
import * as fs from 'fs';
import * as moment from 'moment';

export class CarManager {
    //Singleton für einfachen Zugriff auf CarManager
    private static instance: CarManager;

    private constructor() {}

    public static getInstance(): CarManager {
        if (!CarManager.instance) {
            CarManager.instance = new CarManager();
        }

        return CarManager.instance;
    }
    public ListOfAvailableCars(): Car[] {
        let rawData = fs.readFileSync('data/cars.json');
        let carData = JSON.parse(rawData.toString());
        let carObjects: Car[] = [];
        carData.forEach((element) => {
            console.log(element);
            let newCar = new Car(
                element.description,
                element.electricDriveType,
                moment('1.1.2000 ' + element.earliestUsageTime),
                moment('1.1.2000 ' + element.latestUsageTime),
                element.maxUsageDurationMinutes,
                element.flatRatePrice,
                element.pricePerMin
            );
            carObjects.push(newCar);
        });
        console.log(carObjects);
        return carObjects;
    }

    public addNewCar(): Car[] {
        return null;
    }

    public searchCar(): Car[] {
        return null;
    }
}
