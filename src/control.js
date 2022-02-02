"use strict";
exports.__esModule = true;
exports.Control = void 0;
var user_1 = require("./user");
var Control = /** @class */ (function () {
    function Control() {
    }
    Control.prototype.main = function () {
        var testUser = new user_1.User;
        testUser.pastBookedRides();
        console.log(testUser.averageCost());
    };
    return Control;
}());
exports.Control = Control;
