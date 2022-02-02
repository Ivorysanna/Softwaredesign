"use strict";
exports.__esModule = true;
exports.Car = void 0;
var Car = /** @class */ (function () {
    function Car(description, electricDriveType, earliestUsageTime, latestUsageTime, maxUsageDurationMinutes, flatRatePrice, pricePerMin) {
        this.description = description;
        this.electricDriveType = electricDriveType;
        this.earliestUsageTime = earliestUsageTime;
        this.latestUsageTime = latestUsageTime;
        this.maxUsageDurationMinutes = maxUsageDurationMinutes;
        this.flatRatePrice = flatRatePrice;
        this.pricePerMin = pricePerMin;
    }
    Car.prototype.getCarStatus = function () {
        return true;
    };
    Car.prototype.getCarDescription = function () {
        return this.description;
    };
    return Car;
}());
exports.Car = Car;
