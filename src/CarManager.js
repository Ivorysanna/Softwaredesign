"use strict";
exports.__esModule = true;
exports.CarManager = void 0;
var Car_1 = require("./Car");
var fs = require("fs");
var luxon_1 = require("luxon");
var CarManager = /** @class */ (function () {
    function CarManager() {
    }
    CarManager.getInstance = function () {
        if (!CarManager.instance) {
            CarManager.instance = new CarManager();
        }
        return CarManager.instance;
    };
    CarManager.prototype.ListOfAvailableCars = function () {
        var rawData = fs.readFileSync("data/cars.json");
        var carData = JSON.parse(rawData.toString());
        var carObjects = [];
        carData.forEach(function (element) {
            //console.log(element);
            var newCar = new Car_1.Car(element.car_ID, element.description, element.electricDriveType, luxon_1.DateTime.fromISO("2000-01-01T" + element.earliestUsageTime), luxon_1.DateTime.fromISO("2000-01-01T" + element.latestUsageTime), element.maxUsageDurationMinutes, element.flatRatePrice, element.pricePerMin);
            carObjects.push(newCar);
        });
        //console.log(carObjects);
        return carObjects;
    };
    return CarManager;
}());
exports.CarManager = CarManager;
