"use strict";
exports.__esModule = true;
exports.Control = void 0;
var User_1 = require("./User");
var Control = /** @class */ (function () {
    function Control() {
    }
    Control.prototype.main = function () {
        var testUser = new User_1.User;
        testUser.pastBookedRides();
        console.log(testUser.averageCost());
    };
    return Control;
}());
exports.Control = Control;
