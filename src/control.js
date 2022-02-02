"use strict";
exports.__esModule = true;
exports.Control = void 0;
var User_1 = require("./User");
var Control = /** @class */ (function () {
    function Control() {
    }
    Control.prototype.main = function () {
        var inquirer = require("inquirer");
        console.log("Willkommen bei CarCarBla");
        var questions = [
            {
                type: "list",
                name: "loginOrSearch",
                message: "Wollen Sie sich anmelden?",
                choices: ["Anmelden", "Registrieren", "Suchen..."]
            },
            {
                type: "input",
                name: "login",
                message: "Bitte geben Sie Benutzernamen und Passwort ein.",
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft?
                },*/
                when: function (answers) {
                    return answers.loginOrSearch == "Anmelden";
                }
            }
        ];
        inquirer.prompt(questions).then(function (answers) {
        });
        var testUser = new User_1.User;
        /*testUser.pastBookedRides();
        console.log(testUser.averageCost());*/
    };
    return Control;
}());
exports.Control = Control;
