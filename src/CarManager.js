"use strict";
exports.__esModule = true;
exports.CarManager = void 0;
var Car_1 = require("./Car");
var fs = require("fs");
var moment = require("moment");
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
        var rawData = fs.readFileSync('data/cars.json');
        var carData = JSON.parse(rawData.toString());
        var carObjects = [];
        carData.forEach(function (element) {
            console.log(element);
            var newCar = new Car_1.Car(element.description, element.electricDriveType, moment('1.1.2000 ' + element.earliestUsageTime), moment('1.1.2000 ' + element.latestUsageTime), element.maxUsageDurationMinutes, element.flatRatePrice, element.pricePerMin);
            carObjects.push(newCar);
        });
        console.log(carObjects);
        return carObjects;
    };
    CarManager.prototype.addNewCar = function () {
        return null;
    };
    CarManager.prototype.searchCar = function () {
        return null;
    };
    return CarManager;
}());
exports.CarManager = CarManager;
