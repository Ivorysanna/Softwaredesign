"use strict";
exports.__esModule = true;
exports.Car = void 0;
var fs = require("fs");
var Car = /** @class */ (function () {
    function Car(car_ID, description, electricDriveType, earliestUsageTime, latestUsageTime, maxUsageDurationMinutes, flatRatePrice, pricePerMin) {
        this.car_ID = car_ID;
        this.description = description;
        this.electricDriveType = electricDriveType;
        this.earliestUsageTime = earliestUsageTime;
        this.latestUsageTime = latestUsageTime;
        this.maxUsageDurationMinutes = maxUsageDurationMinutes;
        this.flatRatePrice = flatRatePrice;
        this.pricePerMin = pricePerMin;
    }
    // e.g. "BMW i3 (E) - 9:00-14:00 Uhr, 10€ FP + 3€ pro Min."
    Car.prototype.printString = function () {
        return "".concat(this.description, " : ").concat(this.electricDriveType ? "(E)" : "", " ").concat(this.earliestUsageTime.toFormat("HH:mm"), " - ").concat(this.latestUsageTime.toFormat("HH:mm"), " Uhr, ").concat(this.flatRatePrice, " \u20AC Nutzungspreis ").concat(this.pricePerMin, " \u20AC pro Min.");
    };
    Car.prototype.getCarStatus = function () {
        return true;
    };
    Car.prototype.getCarDescription = function () {
        var rawData = fs.readFileSync("data/cars.json");
        var allCars = JSON.parse(rawData.toString());
        //let carDescription = allCars["description"];
        var logAllCars = [];
        for (var i = 0; i < allCars.length; i++) {
            logAllCars += allCars[i].description;
        }
        //console.log(logAllCars);
        return this.description;
    };
    return Car;
}());
exports.Car = Car;
