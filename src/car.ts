import { DateTime, Duration, Interval } from "luxon";
import * as fs from "fs";
import { RideManager } from "./RideManager";
import { Ride } from "./Ride";

export class Car {
    public car_ID: number;
    public description: string;
    public electricDriveType: boolean;
    public earliestUsageTime: DateTime;
    public latestUsageTime: DateTime;
    public maxUsageDurationMinutes: number;
    public flatRatePrice: number;
    public pricePerMinute: number;

    constructor(
        car_ID: number,
        description: string,
        electricDriveType: boolean,
        earliestUsageTime: DateTime,
        latestUsageTime: DateTime,
        maxUsageDurationMinutes: number,
        flatRatePrice: number,
        pricePerMinute: number
    ) {
        this.car_ID = car_ID;
        this.description = description;
        this.electricDriveType = electricDriveType;
        this.earliestUsageTime = earliestUsageTime;
        this.latestUsageTime = latestUsageTime;
        this.maxUsageDurationMinutes = maxUsageDurationMinutes;
        this.flatRatePrice = flatRatePrice;
        this.pricePerMinute = pricePerMinute;
    }

    // e.g. "BMW i3 (E) - 9:00-14:00 Uhr, 10€ FP + 3€ pro Min."
    public printString(): string {
        return `${this.description} : ${
            this.electricDriveType ? "(E)" : ""
        } ${this.earliestUsageTime.toFormat("HH:mm")} - ${this.latestUsageTime.toFormat(
            "HH:mm"
        )} Uhr, ${this.flatRatePrice} € Nutzungspreis ${this.pricePerMinute} € pro Min.`;
    }

    public hasAlreadyBookedRidesInTimeAndDuration(
        startDateTime: DateTime,
        duration: Duration
    ): boolean {
        const ridesForCar = RideManager.getInstance().getRidesForCar(this);

        let newInterval: Interval = Interval.fromDateTimes(
            startDateTime,
            startDateTime.plus(duration)
        );

        return ridesForCar.some((eachRide: Ride) => {
            let rideInterval: Interval = Interval.fromDateTimes(
                eachRide.timestamp,
                eachRide.timestamp.plus(eachRide.duration)
            );
            return rideInterval.overlaps(newInterval);
        });
    }

    public existingRideContainsStartDateTime(startDateTime: DateTime): boolean {
        const ridesForCar = RideManager.getInstance().getRidesForCar(this);

        return ridesForCar.some((eachRide: Ride) => {
            let rideInterval: Interval = Interval.fromDateTimes(
                eachRide.timestamp,
                eachRide.timestamp.plus(eachRide.duration)
            );
            return rideInterval.contains(startDateTime);
        });
    }

    public isIntervalBetweenEarliestAndLatestUsageTime(dateTime: DateTime, duration: Duration): boolean {
        let bookingEndDateTime = dateTime.plus(duration);

        return (
            this.isDateTimeBetweenEarliestAndLatestUsageTime(dateTime) &&
            (bookingEndDateTime.hour < this.latestUsageTime.hour ||
                (bookingEndDateTime.hour == this.latestUsageTime.hour &&
                    bookingEndDateTime.minute < this.latestUsageTime.minute))
        );
    }

    public isDateTimeBetweenEarliestAndLatestUsageTime(dateTime: DateTime): boolean {
        return (
            (dateTime.hour > this.earliestUsageTime.hour ||
                (dateTime.hour == this.earliestUsageTime.hour &&
                    dateTime.minute >= this.earliestUsageTime.minute)) &&
            (dateTime.hour < this.latestUsageTime.hour ||
                (dateTime.hour == this.latestUsageTime.hour &&
                    dateTime.minute < this.latestUsageTime.minute))
        );
    }
}
