"use strict";
exports.__esModule = true;
exports.Control = void 0;
var User_1 = require("./User");
var inquirer = require("inquirer");
var Control = /** @class */ (function () {
    function Control() {
    }
    Control.prototype.main = function () {
        console.log("Willkommen bei CarCarBla");
        var questions = [
            {
                type: "list",
                name: "loginOrSearch",
                message: "Wollen Sie sich anmelden, oder nach Autos suchen?",
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
            },
            {
                type: "input",
                name: "registration",
                message: "Bitte geben Sie Benutzernamen und Passwort ein.",
                /*validate(value){
                    //Wird hier Passwort und Benutzer überprüft mit Regex?
                },*/
                when: function (answers) {
                    return answers.loginOrSearch == "Registrieren";
                }
            },
            {
                type: "list",
                name: "driveType",
                message: "Wählen Sie die gewünschte Antriebsart",
                choices: ["Elektronisch", "Konventionell"],
                when: function (answers) {
                    return answers.loginOrSearch == "Suchen...";
                }
            },
            {
                type: "input",
                name: "searchBrand",
                message: "Geben Sie Ihre gewünschte Marke ein",
                /*validate(value){
                    //Es muss vorgefiltert werten elektrisch/konventionell
                },*/
                when: function (answers) {
                    return answers.driveType == "Elektronisch" || "Konventionell";
                }
            },
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
