"use strict";
exports.__esModule = true;
exports.User = void 0;
var fs = require("fs");
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.pastBookedRides = function () {
        var allRides = fs.readFileSync('data/rides.json');
        var outputRides = JSON.parse(allRides.toString());
        //console.log(outputRides);
        return "Bis jetzt wurden: " + outputRides + " gebucht.";
    };
    //Average Cost wird berechnet
    User.prototype.averageCost = function () {
        var rawData = fs.readFileSync('data/rides.json');
        var allRides = JSON.parse(rawData.toString());
        var bookedRides = allRides["bookedRides"];
        var logAllRides = 0;
        for (var i = 0; i < bookedRides.length; i++) {
            logAllRides += bookedRides[i].price;
        }
        var averageCost = logAllRides / bookedRides.length;
        return "Durchschnittskosten betragen: " + averageCost + " €.";
    };
    return User;
}());
exports.User = User;
